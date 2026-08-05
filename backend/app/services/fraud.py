"""Fraud detection logic combining MaxMind results with business rules."""
from __future__ import annotations

from typing import Any

from app.core.config import get_settings
from app.core.logging import get_logger
from app.services.maxmind import check_minfraud
from app.services.phone import NormalizedPhone

logger = get_logger(__name__)


async def evaluate_fraud(
    phone: NormalizedPhone,
    ip_address: str,
    user_agent: str,
    order_amount: float,
    is_test: bool,
) -> dict[str, Any]:
    """
    Returns a fraud evaluation dict with:
    - allowed: bool
    - reason: str
    - maxmind: dict (raw result)
    """
    if is_test:
        logger.info("Test phone bypass, skipping MaxMind check")
        return {
            "allowed": True,
            "reason": "test_bypass",
            "maxmind": {
                "allowed": True,
                "reason": "test_bypass",
                "risk_score": 0,
                "ip_risk": 0,
                "country_iso": "SA",
                "registered_country_iso": "SA",
                "is_anonymous": False,
                "is_anonymous_vpn": False,
                "is_hosting_provider": False,
                "is_public_proxy": False,
                "is_residential_proxy": False,
                "is_tor_exit_node": False,
                "raw_response": {},
            },
        }

    if not ip_address or ip_address == "unknown":
        logger.warning("Client IP unknown, skipping MaxMind check")
        return {
            "allowed": True,
            "reason": "ip_unknown_bypass",
            "maxmind": {
                "allowed": True,
                "reason": "ip_unknown_bypass",
                "risk_score": 0,
                "ip_risk": 0,
                "country_iso": None,
                "registered_country_iso": None,
                "is_anonymous": False,
                "is_anonymous_vpn": False,
                "is_hosting_provider": False,
                "is_public_proxy": False,
                "is_residential_proxy": False,
                "is_tor_exit_node": False,
                "raw_response": {},
            },
        }

    phone_national = phone.local.lstrip("0")  # 5XXXXXXXX for MaxMind billing
    mm = await check_minfraud(
        ip_address=ip_address,
        user_agent=user_agent,
        phone_national=phone_national,
        order_amount=order_amount,
    )

    if not mm["allowed"]:
        settings = get_settings()
        if not settings.maxmind_required:
            logger.warning(
                "MaxMind advisory block ignored (MAXMIND_REQUIRED=false)",
                reason=mm["reason"],
            )
            return {"allowed": True, "reason": f"advisory:{mm['reason']}", "maxmind": mm}
        logger.info("Order blocked by MaxMind", reason=mm["reason"])
        return {"allowed": False, "reason": mm["reason"], "maxmind": mm}

    return {"allowed": True, "reason": "ok", "maxmind": mm}
