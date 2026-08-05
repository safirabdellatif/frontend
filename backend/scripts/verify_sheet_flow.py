"""Local verification: order creation triggers sheet payload (mocked HTTP)."""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path
from unittest.mock import AsyncMock, patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.core.config import get_settings
from app.schemas.orders import CreateOrderRequest
from app.services.orders import create_order

get_settings.cache_clear()


async def main() -> None:
    settings = get_settings()
    print("backend_url_configured:", bool(settings.google_sheet_webhook_url))
    print("send_test_orders_to_sheet:", settings.send_test_orders_to_sheet)

    payload = {
        "customer": {"name": "DryRun", "phone": "0551234567"},
        "cart": {
            "items": [
                {
                    "product_id": "biotin_collagen",
                    "product_name": "test",
                    "quantity": 1,
                    "unit_bundle_price": 199,
                    "offer_price": 199,
                    "offer_label": "1",
                    "source": "product_page",
                }
            ],
            "total": 199,
            "currency": "SAR",
        },
        "attribution": {
            "landing_page": "https://mysanad.shop/?utm_source=mock",
            "referrer": "",
        },
        "analytics": {
            "event_id": "e1",
            "session_id": "s1",
            "user_agent": "verify-sheet-flow",
        },
    }

    captured: list[dict] = []

    async def fake_send(data: dict) -> dict:
        captured.append(data)
        return {"ok": True, "status_code": 200, "body": '{"ok":true}'}

    with patch("app.services.orders.send_order_to_sheet", new=AsyncMock(side_effect=fake_send)):
        req = CreateOrderRequest.model_validate(payload)
        result = await create_order(req, {"user-agent": "verify-sheet-flow"})
        await asyncio.sleep(2)

    print("order_number:", result.order_number)
    print("sheet_calls:", len(captured))
    if captured:
        row = captured[0]
        print("sheet_orderid:", row.get("orderid"))
        print("sheet_ok_fields:", all(k in row for k in ("date", "orderid", "sku", "product")))


if __name__ == "__main__":
    asyncio.run(main())
