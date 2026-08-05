"""TikTok Events API client."""
from __future__ import annotations

import time
from typing import Any

import httpx

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()

TIKTOK_API_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"
TIMEOUT = 10.0


async def send_tiktok_purchase(payload: dict[str, Any]) -> dict[str, Any]:
    if not settings.tiktok_pixel_id or not settings.tiktok_access_token:
        logger.warning("TikTok Events API not configured")
        return {"ok": False, "error": "not_configured"}

    event_data: dict[str, Any] = {
        "event": "CompletePayment",
        "event_time": payload.get("event_time") or int(time.time()),
        "event_id": payload["event_id"],
        "user": {
            "phone": payload["phone_hash_tiktok"],
            "ip": payload.get("ip", ""),
            "user_agent": payload.get("user_agent", ""),
        },
        "properties": {
            "currency": payload.get("currency", "SAR"),
            "value": payload.get("value", 0),
            "contents": [
                {
                    "content_id": c["id"],
                    "quantity": c["quantity"],
                    "price": c["item_price"],
                }
                for c in payload.get("contents", [])
            ],
            "order_id": payload.get("order_id", ""),
        },
        "page": {
            "url": payload.get("landing_page") or settings.frontend_url,
            "referrer": payload.get("referrer", ""),
        },
    }

    if payload.get("ttclid"):
        event_data["user"]["ttclid"] = payload["ttclid"]
    if payload.get("ttp"):
        event_data["user"]["ttp"] = payload["ttp"]

    body: dict[str, Any] = {
        "event_source": "web",
        "event_source_id": settings.tiktok_pixel_id,
        "data": [event_data],
    }

    headers = {
        "Access-Token": settings.tiktok_access_token,
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.post(TIKTOK_API_URL, json=body, headers=headers)
            ok = resp.status_code == 200
            try:
                data = resp.json()
                ok = ok and data.get("code") == 0
            except Exception:
                data = None
            if not ok:
                logger.error("TikTok Events API failed", status=resp.status_code, body=resp.text[:500])
            elif settings.debug_analytics:
                logger.info("TikTok Events API response", status=resp.status_code, body=resp.text[:500])
            return {"ok": ok, "status_code": resp.status_code, "body": resp.text}
    except Exception as e:
        logger.error("TikTok Events API error", error=str(e))
        return {"ok": False, "error": str(e)}
