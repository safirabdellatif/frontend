from typing import Any

from fastapi import APIRouter, Request

from app.db import record_browser_event
from app.schemas.events import BrowserEventRequest, BrowserEventResponse
from app.services.maxmind import check_minfraud
from app.services.orders import extract_client_ip

router = APIRouter()


def _is_valid_ksa_traffic(fraud_check: dict[str, Any]) -> bool:
    return (
        fraud_check.get("allowed") is True
        and fraud_check.get("country_iso") == "SA"
        and fraud_check.get("is_anonymous") is False
        and fraud_check.get("is_anonymous_vpn") is False
        and fraud_check.get("is_hosting_provider") is False
        and fraud_check.get("is_public_proxy") is False
        and fraud_check.get("is_residential_proxy") is False
        and fraud_check.get("is_tor_exit_node") is False
    )


@router.post("", response_model=BrowserEventResponse)
async def record_event(body: BrowserEventRequest, request: Request):
    """
    Receive browser-side funnel events for admin reporting.
    Admin metrics only count events from valid Saudi, non-VPN/proxy IPs.
    """
    headers = dict(request.headers)
    ip_address = extract_client_ip(headers)
    user_agent = body.user_agent or headers.get("user-agent", "")
    fraud_check = await check_minfraud(
        ip_address=ip_address,
        user_agent=user_agent,
        phone_national="",
        order_amount=float(body.value or 0),
    )
    await record_browser_event(
        {
            **body.model_dump(),
            "user_agent": user_agent,
            "ip_address": ip_address,
        },
        fraud_check,
        _is_valid_ksa_traffic(fraud_check),
    )
    return BrowserEventResponse(ok=True)
