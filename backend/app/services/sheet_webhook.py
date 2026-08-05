"""Google Sheets webhook delivery."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import httpx

from app.core.config import get_settings
from app.core.logging import get_logger
from app.services.pricing import get_product_name, get_product_sku

logger = get_logger(__name__)
settings = get_settings()

TIMEOUT = 10.0


def _format_sheet_date(iso: str) -> str:
    dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.strftime("%d/%m/%Y")


async def send_order_to_sheet(order_data: dict[str, Any]) -> dict[str, Any]:
    """
    POST append-only order event payload to Google Apps Script web app.
    Returns dict with ok, status_code, error.
    """
    if not settings.google_sheet_webhook_url:
        logger.warning("Google Sheet webhook URL not configured")
        return {"ok": False, "error": "not_configured"}

    payload = {**order_data, "secret": settings.google_sheet_webhook_secret}

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT, follow_redirects=True) as client:
            resp = await client.post(
                settings.google_sheet_webhook_url,
                json=payload,
                headers={"Content-Type": "application/json"},
            )
            body = resp.text
            logger.info(
                "Sheet webhook sent",
                order_id=order_data.get("orderid") or order_data.get("order_id"),
                status=resp.status_code,
            )
            return {"ok": resp.status_code == 200, "status_code": resp.status_code, "body": body}
    except httpx.TimeoutException:
        logger.error("Sheet webhook timeout", order_id=order_data.get("orderid"))
        return {"ok": False, "error": "timeout"}
    except Exception as e:
        logger.error("Sheet webhook error", error=str(e), order_id=order_data.get("orderid"))
        return {"ok": False, "error": str(e)}


def build_sheet_payload(order, items, attribution, fraud_check) -> dict[str, Any]:
    """Build a flat row matching scripts/google-sheet-webhook.js HEADERS."""
    created_at = order.get("created_at") or datetime.now(timezone.utc).isoformat()
    product_names = "/".join(
        item.get("product_name") or get_product_name(item.get("product_id", ""))
        for item in items
    )
    skus = "/".join(get_product_sku(item.get("product_id", "")) for item in items)
    quantities = "/".join(str(item.get("quantity", 1)) for item in items)

    return {
        "date": _format_sheet_date(created_at),
        "orderid": order.get("order_number") or str(order.get("order_id", "")),
        "country": "KSA",
        "name": order.get("customer_name", ""),
        "phone": order.get("phone_country_digits") or order.get("phone_e164", "").lstrip("+"),
        "product": product_names,
        "sku": skus,
        "quantity": quantities,
        "totalprice": order.get("total", order.get("subtotal", 0)),
        "currency": order.get("currency", "SAR"),
        "status": order.get("status", ""),
    }
