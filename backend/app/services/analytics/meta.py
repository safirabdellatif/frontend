"""Meta Conversions API client."""
from __future__ import annotations

import time
from typing import Any

import httpx

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()

META_API_VERSION = "v20.0"
TIMEOUT = 10.0


async def send_meta_purchase(payload: dict[str, Any]) -> dict[str, Any]:
    if not settings.meta_pixel_id or not settings.meta_access_token:
        logger.warning("Meta CAPI not configured")
        return {"ok": False, "error": "not_configured"}

    endpoint = (
        f"https://graph.facebook.com/{META_API_VERSION}"
        f"/{settings.meta_pixel_id}/events"
    )

    event_data: dict[str, Any] = {
        "event_name": "Purchase",
        "event_time": payload.get("event_time") or int(time.time()),
        "event_id": payload["event_id"],
        "action_source": "website",
        "event_source_url": payload.get("landing_page") or settings.frontend_url,
        "user_data": {
            "ph": [payload["phone_hash_meta_snap"]],
            "client_ip_address": payload.get("ip", ""),
            "client_user_agent": payload.get("user_agent", ""),
            "fbp": payload.get("fbp") or None,
            "fbc": payload.get("fbc") or None,
        },
        "custom_data": {
            "currency": payload.get("currency", "SAR"),
            "value": payload.get("value", 0),
            "content_ids": payload.get("content_ids", []),
            "content_type": "product",
            "contents": payload.get("contents", []),
            "order_id": payload.get("order_id", ""),
        },
    }

    event_data["user_data"] = {k: v for k, v in event_data["user_data"].items() if v}

    body: dict[str, Any] = {"data": [event_data]}
    if settings.meta_test_event_code:
        body["test_event_code"] = settings.meta_test_event_code

    params = {"access_token": settings.meta_access_token}

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.post(endpoint, json=body, params=params)
            ok = resp.status_code == 200
            try:
                data = resp.json()
                ok = ok and data.get("events_received", 0) > 0
            except Exception:
                pass
            if not ok:
                logger.error("Meta CAPI failed", status=resp.status_code, body=resp.text[:500])
            elif settings.debug_analytics:
                logger.info("Meta CAPI response", status=resp.status_code, body=resp.text[:500])
            return {"ok": ok, "status_code": resp.status_code, "body": resp.text}
    except Exception as e:
        logger.error("Meta CAPI error", error=str(e))
        return {"ok": False, "error": str(e)}
