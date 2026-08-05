from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.core.security import verify_redirect_admin
from app.db import (
    create_ad_redirect,
    delete_ad_redirect,
    list_ad_redirects,
    update_ad_redirect,
)
from app.schemas.redirects import (
    RedirectCreateRequest,
    RedirectResponse,
    RedirectUpdateRequest,
)

router = APIRouter(dependencies=[Depends(verify_redirect_admin)])


@router.get("/redirects", response_model=list[RedirectResponse])
async def get_redirects():
    rows = await list_ad_redirects()
    return [RedirectResponse.model_validate(row) for row in rows]


@router.post("/redirects", response_model=RedirectResponse, status_code=201)
async def post_redirect(body: RedirectCreateRequest):
    try:
        row = await create_ad_redirect(body.slug, body.target_path, body.label)
    except Exception as exc:
        if "duplicate key" in str(exc).lower():
            raise HTTPException(status_code=409, detail="Slug already exists.") from exc
        raise
    return RedirectResponse.model_validate(row)


@router.put("/redirects/{slug}", response_model=RedirectResponse)
async def put_redirect(slug: str, body: RedirectUpdateRequest):
    row = await update_ad_redirect(
        slug,
        target_path=body.target_path,
        label=body.label,
        is_active=body.is_active,
    )
    if row is None:
        raise HTTPException(status_code=404, detail="Redirect not found.")
    return RedirectResponse.model_validate(row)


@router.delete("/redirects/{slug}")
async def remove_redirect(slug: str):
    deleted = await delete_ad_redirect(slug)
    if not deleted:
        raise HTTPException(status_code=404, detail="Redirect not found.")
    return {"ok": True}
