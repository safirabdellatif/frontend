"""Snapchat Conversions API client."""
from __future__ import annotations

import time
from typing import Any

import httpx

from app.core.config import get_settings
from app.core.logging import get_logger
from app.services.analytics.hashing import hash_ip

logger = get_logger(__name__)
settings = get_settings()

SNAP_CAPI_URL = "https://tr.snapchat.com/v2/conversion"
TIMEOUT = 10.0


async def send_snap_purchase(payload: dict[str, Any]) -> dict[str, Any]:
    if not settings.snap_pixel_id or not settings.snap_access_token:
        logger.warning("Snapchat CAPI not configured")
        return {"ok": False, "error": "not_configured"}

    event_time = payload.get("event_time") or int(time.time())
    timestamp_ms = str(int(event_time * 1000))

    body: dict[str, Any] = {
        "pixel_id": settings.snap_pixel_id,
        "timestamp": timestamp_ms,
        "event_type": "PURCHASE",
        "event_conversion_type": "WEB",
        "price": str(payload.get("value", 0)),
        "currency": str(payload.get("currency", "SAR")).lower(),
        "page_url": payload.get("landing_page") or settings.frontend_url,
        "user_agent": payload.get("user_agent", ""),
        "hashed_phone_number": payload["phone_hash_meta_snap"],
        "transaction_id": payload.get("order_id", ""),
        "client_dedup_id": payload["event_id"],
    }

    content_ids = payload.get("content_ids") or []
    if content_ids:
        body["item_ids"] = content_ids

    ip = payload.get("ip", "")
    if ip and ip != "unknown":
        body["hashed_ip_address"] = hash_ip(ip)

    scclid = payload.get("scclid")
    if scclid:
        body["click_id"] = scclid

    snaptr_cookie = payload.get("snaptr_cookie")
    if snaptr_cookie:
        body["uuid_c1"] = snaptr_cookie

    headers = {
        "Authorization": f"Bearer {settings.snap_access_token}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.post(SNAP_CAPI_URL, json=body, headers=headers)
            ok = resp.status_code in (200, 201)
            try:
                data = resp.json()
                ok = ok and data.get("status") == "SUCCESS"
            except Exception:
                pass
            if not ok:
                logger.error("Snap CAPI failed", status=resp.status_code, body=resp.text[:500])
            elif settings.debug_analytics:
                logger.info("Snap CAPI response", status=resp.status_code, body=resp.text[:500])
            return {"ok": ok, "status_code": resp.status_code, "body": resp.text}
    except Exception as e:
        logger.error("Snap CAPI error", error=str(e))
        return {"ok": False, "error": str(e)}
