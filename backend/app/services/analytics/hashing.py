"""SHA-256 phone hashing for CAPI channels."""
import hashlib


def _sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def hash_phone_meta_snap(digits_country: str) -> str:
    """
    Meta and Snapchat: hash digits with country code, no plus.
    Input: '966551234567'
    """
    normalized = digits_country.lstrip("+")
    return _sha256_hex(normalized)


def hash_ip(ip: str) -> str:
    """Snapchat: SHA-256 hash of the client IP address."""
    return _sha256_hex(ip.strip())


def hash_phone_tiktok(e164: str) -> str:
    """
    TikTok: hash E.164 with exactly one leading plus.
    Input: '+966551234567'
    """
    if not e164.startswith("+"):
        e164 = "+" + e164.lstrip("+")
    return _sha256_hex(e164)
