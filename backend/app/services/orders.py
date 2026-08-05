"""Core order creation and upsell business logic — no database."""
from __future__ import annotations

import asyncio
import re
import uuid
from datetime import date, datetime, timezone
from typing import TYPE_CHECKING, Optional

from app.core.config import get_settings
from app.core.logging import get_logger, mask_phone
from app.schemas.orders import (
    CreateOrderRequest, CreateOrderResponse, UpsellInfo, UpsellRequest, UpsellResponse,
)
from app.services.fraud import evaluate_fraud
from app.services.phone import is_test_phone, normalize_saudi_phone
from app.services.pricing import (
    PRODUCTS, UPSELL_PRICE, calculate_line_total, get_product_name, get_upsell_product_id,
)
from app.services.sheet_webhook import build_sheet_payload, send_order_to_sheet
from app.db import mark_upsell_response, save_order

if TYPE_CHECKING:
    from fastapi import BackgroundTasks

logger = get_logger(__name__)
settings = get_settings()

# In-memory store for upsell tracking — keyed by order_id
# Entries: { order_id: { "order": dict, "items": list, "attr": dict, "fc": dict } }
_order_store: dict[str, dict] = {}

# Simple counter for order numbers within the same day
_order_counter: dict[str, int] = {}


def extract_client_ip(headers: dict) -> str:
    cf_ip = headers.get("cf-connecting-ip") or headers.get("CF-Connecting-IP")
    if cf_ip:
        return cf_ip.strip()
    xff = headers.get("x-forwarded-for") or headers.get("X-Forwarded-For")
    if xff:
        first = xff.split(",")[0].strip()
        if first:
            return first
    real_ip = headers.get("x-real-ip") or headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    return "unknown"


def validate_name(name: str) -> bool:
    name = name.strip()
    if len(name) < 2:
        return False
    if re.match(r"^[0-9]+$", name):
        return False
    if "http" in name.lower():
        return False
    return True


def generate_order_number() -> str:
    today = date.today().strftime("%Y%m%d")
    _order_counter[today] = _order_counter.get(today, 0) + 1
    return f"SND-{today}-{_order_counter[today]:04d}"


def _error_response(code: str, message: str):
    from fastapi import HTTPException
    raise HTTPException(status_code=422, detail={"code": code, "message": message})


async def create_order(
    request: CreateOrderRequest,
    request_headers: dict,
    background_tasks: BackgroundTasks | None = None,
) -> CreateOrderResponse:
    # 1. Validate name
    if not validate_name(request.customer.name):
        _error_response("invalid_name", "فضلاً أدخلي اسمًا صحيحًا.")

    # 2. Validate and normalize phone
    phone = normalize_saudi_phone(request.customer.phone)
    if phone is None:
        _error_response("invalid_phone", "فضلاً أدخلي رقم جوال سعودي صحيح.")

    logger.info("Processing order", phone=mask_phone(phone.local))
    test = is_test_phone(request.customer.phone)

    # 3. Recalculate prices from backend source of truth
    computed_subtotal = 0.0
    validated_items = []
    for item in request.cart.items:
        if item.source == "upsell":
            line_total = float(UPSELL_PRICE)
        else:
            line_total = calculate_line_total(item.product_id, item.quantity)
            if line_total is None:
                _error_response("invalid_product", "منتج أو عرض غير صحيح.")
        validated_items.append({
            "product_id": item.product_id,
            "product_name": get_product_name(item.product_id),
            "quantity": item.quantity,
            "offer_label": item.offer_label,
            "source": item.source,
            "unit_price": line_total,
            "line_total": line_total,
        })
        computed_subtotal += line_total

    # 4. Extract IP
    client_ip = extract_client_ip(request_headers)

    # 5. Run fraud check
    fraud_result = await evaluate_fraud(
        phone=phone,
        ip_address=client_ip,
        user_agent=request.analytics.user_agent,
        order_amount=computed_subtotal,
        is_test=test,
    )

    # 6. Generate IDs
    order_id = str(uuid.uuid4())
    order_number = generate_order_number()
    purchase_event_id = f"purchase_{request.analytics.event_id}"
    now = datetime.now(timezone.utc).isoformat()

    mm = fraud_result.get("maxmind", {})
    status = "blocked" if not fraud_result["allowed"] else "pending_confirmation"

    order = {
        "order_id": order_id,
        "order_number": order_number,
        "status": status,
        "is_test": test,
        "customer_name": request.customer.name.strip(),
        "phone_local": phone.local,
        "phone_e164": phone.e164,
        "phone_country_digits": phone.digits_country,
        "currency": "SAR",
        "subtotal": computed_subtotal,
        "upsell_total": 0.0,
        "total": computed_subtotal,
        "upsell_status": "pending",
        "upsell_product_id": None,
        "source_page": request.attribution.landing_page,
        "landing_page": request.attribution.landing_page,
        "referrer": request.attribution.referrer,
        "user_agent": request.analytics.user_agent,
        "ip_address": client_ip,
        "session_id": request.analytics.session_id,
        "purchase_event_id": purchase_event_id,
        "created_at": now,
        "updated_at": now,
    }

    attr = {
        "session_id": request.analytics.session_id,
        "utm_source": request.attribution.utm_source,
        "utm_medium": request.attribution.utm_medium,
        "utm_campaign": request.attribution.utm_campaign,
        "utm_content": request.attribution.utm_content,
        "utm_term": request.attribution.utm_term,
        "fbclid": request.attribution.fbclid,
        "fbc": request.attribution.fbc,
        "fbp": request.attribution.fbp,
        "ttclid": request.attribution.ttclid,
        "ttp": request.attribution.ttp,
        "scclid": request.attribution.scclid,
        "snaptr_cookie": request.attribution.snaptr_cookie,
        "landing_page": request.attribution.landing_page,
        "referrer": request.attribution.referrer,
    }

    fc = {
        "allowed": fraud_result["allowed"],
        "reason": fraud_result.get("reason"),
        "risk_score": mm.get("risk_score"),
        "ip_risk": mm.get("ip_risk"),
        "country_iso": mm.get("country_iso"),
        "registered_country_iso": mm.get("registered_country_iso"),
        "is_anonymous": mm.get("is_anonymous"),
        "is_anonymous_vpn": mm.get("is_anonymous_vpn"),
        "is_hosting_provider": mm.get("is_hosting_provider"),
        "is_public_proxy": mm.get("is_public_proxy"),
        "is_residential_proxy": mm.get("is_residential_proxy"),
        "is_tor_exit_node": mm.get("is_tor_exit_node"),
    }

    if not fraud_result["allowed"]:
        logger.info("Order blocked", order_id=order_id, reason=fraud_result.get("reason"))
        _error_response(
            "blocked",
            "تعذر استقبال الطلب حاليًا. تواصل معنا عبر البريد الإلكتروني للمساعدة.",
        )

    # 7. Determine upsell product
    product_ids = [i["product_id"] for i in validated_items if i["source"] != "upsell"]
    upsell_product_id = get_upsell_product_id(product_ids)
    order["upsell_product_id"] = upsell_product_id

    # 8. Save to in-memory store for upsell endpoint
    _order_store[order_id] = {
        "order": order,
        "items": validated_items,
        "attr": attr,
        "fc": fc,
    }
    logger.info("Order accepted", order_id=order_id, order_number=order_number)

    should_send_sheet = not test or settings.send_test_orders_to_sheet
    if should_send_sheet and settings.google_sheet_webhook_url:
        sheet_data = build_sheet_payload(order, validated_items, attr, fc)
        if background_tasks is not None:
            background_tasks.add_task(_send_sheet_safe, sheet_data)
        else:
            asyncio.create_task(_send_sheet_safe(sheet_data))
    elif should_send_sheet:
        logger.warning(
            "Sheet webhook skipped — GOOGLE_SHEET_WEBHOOK_URL not configured",
            order_id=order_number,
        )

    # Persist + analytics side effects in background — don't block the customer response.
    if background_tasks is not None:
        background_tasks.add_task(_persist_order, order, validated_items, attr, fc)
        background_tasks.add_task(
            _dispatch_side_effects, order, validated_items, attr, fc, request, test
        )
    else:
        asyncio.create_task(_persist_order(order, validated_items, attr, fc))
        asyncio.create_task(_dispatch_side_effects(order, validated_items, attr, fc, request, test))

    upsell = None
    if upsell_product_id:
        upsell = UpsellInfo(
            product_id=upsell_product_id,
            product_name_ar=get_product_name(upsell_product_id),
            price=UPSELL_PRICE,
            expires_in_seconds=15,
        )

    return CreateOrderResponse(
        order_id=order_id,
        order_number=order_number,
        status=status,
        total=computed_subtotal,
        currency="SAR",
        upsell=upsell,
    )


async def process_upsell(
    order_id: str,
    req: UpsellRequest,
    background_tasks: BackgroundTasks | None = None,
) -> tuple[UpsellResponse, int]:
    entry = _order_store.get(order_id)
    if not entry:
        return UpsellResponse(ok=False), 404

    order = entry["order"]
    if order["status"] == "blocked":
        return UpsellResponse(ok=False), 422
    if order["upsell_status"] != "pending":
        return UpsellResponse(ok=True, total=order["total"]), 200

    if req.accepted and req.product_id:
        upsell_item = {
            "product_id": req.product_id,
            "product_name": get_product_name(req.product_id),
            "quantity": 1,
            "offer_label": "عرض الإضافة",
            "source": "upsell",
            "unit_price": float(UPSELL_PRICE),
            "line_total": float(UPSELL_PRICE),
        }
        entry["items"].append(upsell_item)
        order["upsell_total"] = float(UPSELL_PRICE)
        order["total"] = order["subtotal"] + float(UPSELL_PRICE)
        order["upsell_status"] = "accepted"
        logger.info("Upsell accepted", order_id=order_id, product=req.product_id)

        is_test = order.get("is_test", False)
        should_send_sheet = not is_test or settings.send_test_orders_to_sheet
        if should_send_sheet and settings.google_sheet_webhook_url:
            sheet_data = build_sheet_payload(order, entry["items"], entry["attr"], entry["fc"])
            if background_tasks is not None:
                background_tasks.add_task(_send_sheet_safe, sheet_data)
            else:
                asyncio.create_task(_send_sheet_safe(sheet_data))
    else:
        order["upsell_status"] = "declined"
        logger.info("Upsell declined", order_id=order_id)

    try:
        await mark_upsell_response(
            order_id=order_id,
            accepted=req.accepted,
            product_id=req.product_id,
            event_id=req.event_id,
            total=order["total"],
            upsell_total=order["upsell_total"],
        )
    except Exception as e:
        logger.error("Database upsell update failed", order_id=order_id, error=str(e))

    return UpsellResponse(ok=True, total=order["total"], upsell_total=order["upsell_total"]), 200


async def _persist_order(
    order: dict,
    items: list[dict],
    attr: dict,
    fc: dict,
) -> None:
    try:
        await save_order(order, items, attr, fc)
    except Exception as e:
        logger.error("Database order save failed", order_id=order.get("order_id"), error=str(e))


async def _send_sheet_safe(sheet_data: dict) -> None:
    try:
        result = await send_order_to_sheet(sheet_data)
        if not result.get("ok"):
            logger.error(
                "Sheet webhook failed",
                error=result.get("error"),
                status_code=result.get("status_code"),
                body=(result.get("body") or "")[:500],
                order_id=sheet_data.get("orderid"),
            )
    except Exception as e:
        logger.error("Sheet webhook error", error=str(e), order_id=sheet_data.get("orderid"))


async def _dispatch_side_effects(order, items, attr, fc, request, is_test):
    from app.services.analytics.meta import send_meta_purchase
    from app.services.analytics.tiktok import send_tiktok_purchase
    from app.services.analytics.snapchat import send_snap_purchase
    from app.services.analytics.hashing import hash_phone_meta_snap, hash_phone_tiktok

    should_send_capi = not is_test or settings.send_test_events

    tasks: list = []

    if should_send_capi and settings.analytics_enabled:
        capi_payload = {
            "order_id": order["order_id"],
            "order_number": order["order_number"],
            "event_id": order["purchase_event_id"],
            "event_time": int(datetime.fromisoformat(order["created_at"]).timestamp()),
            "phone_digits_country": order["phone_country_digits"],
            "phone_e164": order["phone_e164"],
            "phone_hash_meta_snap": hash_phone_meta_snap(order["phone_country_digits"]),
            "phone_hash_tiktok": hash_phone_tiktok(order["phone_e164"]),
            "ip": order["ip_address"],
            "user_agent": order["user_agent"],
            "landing_page": order["landing_page"],
            "referrer": order["referrer"],
            "fbp": attr.get("fbp"),
            "fbc": attr.get("fbc"),
            "ttp": attr.get("ttp"),
            "ttclid": attr.get("ttclid"),
            "scclid": attr.get("scclid"),
            "snaptr_cookie": attr.get("snaptr_cookie"),
            "value": order["total"],
            "currency": order["currency"],
            "content_ids": [i["product_id"] for i in items],
            "contents": [
                {"id": i["product_id"], "quantity": i["quantity"], "item_price": i["line_total"]}
                for i in items
            ],
        }
        async def _send_capi(sender, label: str) -> None:
            try:
                res = await sender(capi_payload)
                if not res.get("ok"):
                    logger.error(
                        "CAPI failed",
                        channel=label,
                        error=res.get("error"),
                        status_code=res.get("status_code"),
                        body=(res.get("body") or "")[:500],
                    )
            except Exception as e:
                logger.error("CAPI dispatch error", channel=label, error=str(e))

        tasks.extend([
            _send_capi(send_meta_purchase, "meta_capi"),
            _send_capi(send_tiktok_purchase, "tiktok_events_api"),
            _send_capi(send_snap_purchase, "snapchat_capi"),
        ])

    if tasks:
        await asyncio.gather(*tasks, return_exceptions=True)
