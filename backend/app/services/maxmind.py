"""MaxMind minFraud API client."""
from __future__ import annotations

from typing import Any, Optional

import httpx

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()

TIMEOUT = 8.0  # seconds


async def check_minfraud(
    ip_address: str,
    user_agent: str,
    phone_national: str,
    order_amount: float,
) -> dict[str, Any]:
    """
    Call MaxMind minFraud Insights.
    Returns a dict with keys: allowed, reason, risk_score, ip_risk,
    country_iso, registered_country_iso, flags, raw_response.
    """
    if not settings.maxmind_account_id or not settings.maxmind_license_key:
        logger.warning("MaxMind credentials not configured, skipping fraud check")
        return _bypass_result("maxmind_not_configured")

    billing: dict[str, Any] = {"country": "SA"}
    if phone_national:
        billing["phone_number"] = phone_national

    payload = {
        "device": {
            "ip_address": ip_address,
            "user_agent": user_agent,
        },
        "billing": billing,
        "order": {
            "amount": order_amount,
            "currency": "SAR",
        },
        "event": {
            "shop_id": "mysanad",
        },
    }

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.post(
                settings.maxmind_minfraud_endpoint,
                json=payload,
                auth=(settings.maxmind_account_id, settings.maxmind_license_key),
            )
            resp.raise_for_status()
            data = resp.json()
    except httpx.TimeoutException:
        logger.error("MaxMind request timed out")
        return _bypass_result("maxmind_timeout")
    except httpx.HTTPStatusError as e:
        status = e.response.status_code
        if status in (401, 403):
            logger.error(
                "MaxMind authentication failed — check MAXMIND_ACCOUNT_ID and MAXMIND_LICENSE_KEY",
                status_code=status,
            )
            return _bypass_result("maxmind_not_configured")
        logger.error("MaxMind HTTP error", status_code=status)
        return _bypass_result(f"maxmind_http_{status}")
    except Exception as e:
        logger.error("MaxMind unexpected error", error=str(e))
        return _bypass_result("maxmind_error")

    return _parse_response(data)


def _parse_response(data: dict) -> dict[str, Any]:
    ip = data.get("ip_address", {})
    traits = ip.get("traits", {})
    country = ip.get("country", {})
    reg_country = ip.get("registered_country", {})

    risk_score = float(data.get("risk_score", 100))
    ip_risk = float(ip.get("risk", 100))
    country_iso = country.get("iso_code", "")
    registered_country_iso = reg_country.get("iso_code", "")
    is_anonymous = traits.get("is_anonymous", False)
    is_anonymous_vpn = traits.get("is_anonymous_vpn", False)
    is_hosting = traits.get("is_hosting_provider", False)
    is_public_proxy = traits.get("is_public_proxy", False)
    is_residential_proxy = traits.get("is_residential_proxy", False)
    is_tor = traits.get("is_tor_exit_node", False)

    block_reasons: list[str] = []
    if country_iso and country_iso != "SA":
        block_reasons.append(f"country_not_allowed:{country_iso}")
    if is_anonymous:
        block_reasons.append("is_anonymous")
    if is_anonymous_vpn:
        block_reasons.append("is_anonymous_vpn")
    if is_hosting:
        block_reasons.append("is_hosting_provider")
    if is_public_proxy:
        block_reasons.append("is_public_proxy")
    if is_residential_proxy:
        block_reasons.append("is_residential_proxy")
    if is_tor:
        block_reasons.append("is_tor_exit_node")
    if risk_score > settings.maxmind_max_risk_score:
        block_reasons.append(f"risk_score_high:{risk_score}")
    if ip_risk > settings.maxmind_max_ip_risk_score:
        block_reasons.append(f"ip_risk_high:{ip_risk}")

    allowed = len(block_reasons) == 0

    return {
        "allowed": allowed,
        "reason": "; ".join(block_reasons) if block_reasons else "ok",
        "risk_score": risk_score,
        "ip_risk": ip_risk,
        "country_iso": country_iso,
        "registered_country_iso": registered_country_iso,
        "is_anonymous": is_anonymous,
        "is_anonymous_vpn": is_anonymous_vpn,
        "is_hosting_provider": is_hosting,
        "is_public_proxy": is_public_proxy,
        "is_residential_proxy": is_residential_proxy,
        "is_tor_exit_node": is_tor,
        "raw_response": data,
    }


def _bypass_result(reason: str) -> dict[str, Any]:
    """Used when MaxMind is unavailable or not configured.

    - maxmind_not_configured: always allow (missing credentials is a deploy config issue)
    - timeout / HTTP errors: block only when MAXMIND_REQUIRED=true in production
    """
    settings_ = get_settings()
    if reason == "maxmind_not_configured":
        allowed = True
        logger.warning(
            "MaxMind credentials missing — orders allowed; set MAXMIND_ACCOUNT_ID and MAXMIND_LICENSE_KEY",
        )
    else:
        allowed = not (settings_.is_production and settings_.maxmind_required)
        if allowed:
            logger.warning("MaxMind unavailable, allowing order", reason=reason)
    return {
        "allowed": allowed,
        "reason": reason,
        "risk_score": None,
        "ip_risk": None,
        "country_iso": None,
        "registered_country_iso": None,
        "is_anonymous": None,
        "is_anonymous_vpn": None,
        "is_hosting_provider": None,
        "is_public_proxy": None,
        "is_residential_proxy": None,
        "is_tor_exit_node": None,
        "raw_response": {},
    }
