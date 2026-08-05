"""Quick fraud-check diagnostic — run from backend/ with: python scripts/test_fraud.py"""
from __future__ import annotations

import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.fraud import evaluate_fraud
from app.services.phone import is_test_phone, normalize_saudi_phone


async def run(phone: str, ip: str) -> None:
    normalized = normalize_saudi_phone(phone)
    if normalized is None:
        print(f"{phone}: invalid phone")
        return
    test = is_test_phone(phone)
    result = await evaluate_fraud(normalized, ip, "Mozilla/5.0", 199.0, test)
    print(
        f"phone={phone} ip={ip} test={test} "
        f"allowed={result['allowed']} reason={result['reason']}"
    )


async def main() -> None:
    for phone, ip in [
        ("0551234567", "203.0.113.1"),
        ("055000000", "203.0.113.1"),
        ("0551234567", "unknown"),
    ]:
        await run(phone, ip)


if __name__ == "__main__":
    asyncio.run(main())
