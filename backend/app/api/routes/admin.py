from __future__ import annotations

from datetime import datetime, time, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.security import verify_admin
from app.db import get_admin_metrics, get_admin_order_detail, list_admin_orders

router = APIRouter(dependencies=[Depends(verify_admin)])


def _parse_date(value: Optional[str], end_of_day: bool = False) -> Optional[datetime]:
    if not value:
        return None
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        if "T" not in value:
            parsed_time = time.max if end_of_day else time.min
            parsed = datetime.combine(parsed.date(), parsed_time)
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


@router.get("/metrics")
async def metrics(
    start: Optional[str] = Query(None),
    end: Optional[str] = Query(None),
):
    return await get_admin_metrics(_parse_date(start), _parse_date(end, end_of_day=True))


@router.get("/orders")
async def orders(
    start: Optional[str] = Query(None),
    end: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    return await list_admin_orders(
        start_at=_parse_date(start),
        end_at=_parse_date(end, end_of_day=True),
        status=status,
        query=q,
        limit=limit,
        offset=offset,
    )


@router.get("/orders/{order_id}")
async def order_detail(order_id: str):
    detail = await get_admin_order_detail(order_id)
    if detail is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return detail
