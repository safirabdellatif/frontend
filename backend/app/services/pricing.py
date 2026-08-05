"""Backend source of truth for product IDs, offers, and pricing."""
from __future__ import annotations

from typing import Optional

PRODUCTS: dict[str, dict] = {
    "biotin_collagen": {
        "name_ar": "قطرات البيوتين والكولاجين للشعر",
        "short_name_ar": "قطرات البيوتين والكولاجين",
        "slug": "biotin-collagen-drops",
        "sku": "SANAD-BC-7K3F",
    },
    "teeth_whitening_kit": {
        "name_ar": "طقم تبييض الأسنان الاحترافي بضوء LED",
        "short_name_ar": "طقم تبييض الأسنان",
        "slug": "teeth-whitening-kit",
        "sku": "SANAD-TW-9P2L",
    },
    "beauty_milk": {
        "name_ar": "بودرة حليب الفراولة لنضارة وتفتيح البشرة",
        "short_name_ar": "بودرة حليب الفراولة",
        "slug": "beauty-milk-glutathione",
        "sku": "SANAD-BM-4M8X",
    },
}

OFFERS: dict[int, int] = {
    1: 199,
    2: 279,
    3: 349,
}

UPSELL_PRICE = 99

UPSELL_MAP: dict[str, str] = {
    "biotin_collagen": "teeth_whitening_kit",
    "teeth_whitening_kit": "beauty_milk",
    "beauty_milk": "biotin_collagen",
}


def calculate_line_total(product_id: str, quantity: int) -> Optional[float]:
    """Return the canonical line total for a product+quantity, or None if invalid."""
    if product_id not in PRODUCTS:
        return None
    if quantity not in OFFERS:
        return None
    return float(OFFERS[quantity])


def get_upsell_product_id(cart_product_ids: list[str]) -> Optional[str]:
    """Return the recommended upsell product based on primary cart item."""
    if not cart_product_ids:
        return None
    primary = cart_product_ids[0]
    preferred = UPSELL_MAP.get(primary)
    if preferred and preferred not in cart_product_ids:
        return preferred
    for product_id in PRODUCTS:
        if product_id not in cart_product_ids:
            return product_id
    return None


def get_product_name(product_id: str) -> str:
    return PRODUCTS.get(product_id, {}).get("name_ar", product_id)


def get_product_sku(product_id: str) -> str:
    return PRODUCTS.get(product_id, {}).get("sku", product_id)
