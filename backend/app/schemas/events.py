from __future__ import annotations

from typing import Optional

from pydantic import BaseModel


class BrowserEventRequest(BaseModel):
    event_name: str
    event_id: str
    session_id: str
    page_url: Optional[str] = None
    referrer: Optional[str] = None
    product_id: Optional[str] = None
    value: Optional[float] = None
    currency: str = "SAR"
    user_agent: str = ""
    fbp: Optional[str] = None
    fbc: Optional[str] = None
    ttp: Optional[str] = None


class BrowserEventResponse(BaseModel):
    ok: bool
