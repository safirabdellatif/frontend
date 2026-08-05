from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.db import get_ad_redirect_by_slug, increment_ad_redirect_clicks
from app.schemas.redirects import PublicRedirectResponse

router = APIRouter()


@router.get("/public/{slug}", response_model=PublicRedirectResponse)
async def get_public_redirect(slug: str):
    row = await get_ad_redirect_by_slug(slug.strip().lower())
    if row is None or not row.get("is_active"):
        raise HTTPException(status_code=404, detail="Redirect not found.")
    await increment_ad_redirect_clicks(slug.strip().lower())
    return PublicRedirectResponse(slug=row["slug"], target_path=row["target_path"])
