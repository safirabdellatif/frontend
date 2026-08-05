from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator
from pydantic.alias_generators import to_camel


class CartItemSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    product_id: str
    product_name: str
    quantity: int
    unit_bundle_price: float
    offer_price: float
    offer_label: str
    source: str = "product_page"


class CartSchema(BaseModel):
    items: list[CartItemSchema]
    total: float
    currency: str = "SAR"


class CustomerSchema(BaseModel):
    name: str
    phone: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Name too short")
        if len(v) > 80:
            raise ValueError("Name too long")
        return v


class AttributionSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    landing_page: Optional[str] = None
    referrer: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None
    fbclid: Optional[str] = None
    fbc: Optional[str] = None
    fbp: Optional[str] = None
    ttclid: Optional[str] = None
    ttp: Optional[str] = None
    scclid: Optional[str] = None
    snaptr_cookie: Optional[str] = None


class AnalyticsSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    event_id: str
    session_id: str
    user_agent: str = ""


class CreateOrderRequest(BaseModel):
    customer: CustomerSchema
    cart: CartSchema
    attribution: AttributionSchema
    analytics: AnalyticsSchema


class UpsellInfo(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    product_id: str
    product_name_ar: str
    price: int
    expires_in_seconds: int = 15


class CreateOrderResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    order_id: str
    order_number: str
    status: str
    total: float
    currency: str = "SAR"
    upsell: Optional[UpsellInfo] = None


class UpsellRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    accepted: bool
    product_id: Optional[str] = None
    event_id: Optional[str] = None


class UpsellResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    ok: bool
    total: Optional[float] = None
    upsell_total: Optional[float] = None
