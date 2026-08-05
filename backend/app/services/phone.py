"""Saudi phone number validation and normalization."""
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Optional


@dataclass
class NormalizedPhone:
    local: str              # 05XXXXXXXX
    e164: str               # +9665XXXXXXXX
    digits_country: str     # 9665XXXXXXXX


MOBILE_PREFIX_RE = re.compile(r"^5[0-9]{8}$")


def _get_test_phone_stripped() -> str:
    from app.core.config import get_settings
    return re.sub(r"[^\d]", "", get_settings().allow_test_phone)


def normalize_saudi_phone(raw: str) -> Optional[NormalizedPhone]:
    """
    Returns NormalizedPhone or None if the phone is invalid.

    Accepts:
    - 05XXXXXXXX (10 digits)
    - 5XXXXXXXX  (9 digits)
    - 9665XXXXXXXX (12 digits)
    - +9665XXXXXXXX (13 chars)

    Special case: ALLOW_TEST_PHONE from settings (shorter than a real mobile number)
    """
    stripped = re.sub(r"[^\d]", "", raw)

    test_phone = _get_test_phone_stripped()
    if stripped == test_phone:
        return NormalizedPhone(
            local=test_phone,
            e164="+966" + test_phone,
            digits_country="966" + test_phone,
        )

    # Remove leading zeros or country code to get national 9-digit number
    national: Optional[str] = None

    if stripped.startswith("966") and len(stripped) == 12:
        national = stripped[3:]  # 9665XXXXXXXX -> 5XXXXXXXX
    elif stripped.startswith("0") and len(stripped) == 10:
        national = stripped[1:]  # 05XXXXXXXX -> 5XXXXXXXX
    elif len(stripped) == 9:
        national = stripped      # 5XXXXXXXX

    if not national:
        return None

    if not MOBILE_PREFIX_RE.match(national):
        return None

    return NormalizedPhone(
        local="0" + national,
        e164="+966" + national,
        digits_country="966" + national,
    )


def is_test_phone(raw: str) -> bool:
    stripped = re.sub(r"[^\d]", "", raw)
    return stripped == _get_test_phone_stripped()
