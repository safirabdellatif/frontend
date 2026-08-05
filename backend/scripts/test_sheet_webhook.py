"""Test your Google Sheet webhook URL from the command line.

Usage:
  python scripts/test_sheet_webhook.py
  python scripts/test_sheet_webhook.py "https://script.google.com/macros/s/XXXX/exec"
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import httpx

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.core.config import get_settings

get_settings.cache_clear()


def main() -> None:
    url = (sys.argv[1] if len(sys.argv) > 1 else get_settings().google_sheet_webhook_url).strip()
    if not url:
        print("ERROR: no URL. Pass it as argument or set GOOGLE_SHEET_WEBHOOK_URL in backend/.env")
        sys.exit(1)

    print("Testing GET:", url)
    r = httpx.get(url, timeout=20, follow_redirects=True)
    print("GET", r.status_code, r.text[:400])

    payload = {
        "date": "19/06/2026",
        "orderid": "TEST-CLI-DEBUG",
        "country": "KSA",
        "name": "Test CLI",
        "phone": "966501234567",
        "product": "Produit test",
        "sku": "SANAD-BC-7K3F",
        "quantity": "1",
        "totalprice": 199,
        "currency": "SAR",
        "status": "test",
    }
    print("\nTesting POST with orderid=TEST-CLI-DEBUG")
    r2 = httpx.post(url, json=payload, timeout=20, follow_redirects=True)
    print("POST", r2.status_code, r2.text[:400])

    try:
        body = json.loads(r2.text)
    except json.JSONDecodeError:
        body = {}
    if r2.status_code == 200 and body.get("ok"):
        print("\nOK — check Google Sheet tab 'Orders' for row TEST-CLI-DEBUG")
        if body.get("spreadsheet_name"):
            print("Spreadsheet:", body.get("spreadsheet_name"))
    else:
        print("\nFAILED — wrong URL or Apps Script error")
        sys.exit(1)


if __name__ == "__main__":
    main()
