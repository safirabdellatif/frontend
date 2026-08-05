from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.db import is_ready, list_ad_redirects

router = APIRouter()


@router.get("/health")
async def health():
    settings = get_settings()
    maxmind_configured = bool(settings.maxmind_account_id and settings.maxmind_license_key)
    warnings: list[str] = []
    if settings.is_production and settings.maxmind_required and not maxmind_configured:
        warnings.append("maxmind_required_but_not_configured")
    google_sheet_configured = bool(settings.google_sheet_webhook_url)
    if settings.is_production and not google_sheet_configured:
        warnings.append("google_sheet_webhook_not_configured")

    redirect_admin_configured = bool(
        settings.redirect_admin_username and settings.redirect_admin_password
    )
    redirect_count = len(await list_ad_redirects()) if is_ready() else 0
    if settings.is_production and redirect_admin_configured and redirect_count == 0:
        warnings.append("no_ad_redirects_configured")

    return JSONResponse({
        "ok": True,
        "environment": settings.environment,
        "maxmind_configured": maxmind_configured,
        "maxmind_required": settings.maxmind_required,
        "warnings": warnings,
        "deploy_version": "2026-06-19-sheet-webhook",
        "maxmind_enforcement": settings.maxmind_required,
        "google_sheet": {
            "configured": google_sheet_configured,
            "send_test_orders": settings.send_test_orders_to_sheet,
            "webhook_url_suffix": settings.google_sheet_webhook_url.rstrip("/").split("/")[-1][:12]
            if google_sheet_configured
            else None,
        },
        "analytics": {
            "enabled": settings.analytics_enabled,
            "meta_configured": bool(settings.meta_pixel_id and settings.meta_access_token),
            "meta_pixel_id_suffix": settings.meta_pixel_id[-8:] if settings.meta_pixel_id else None,
            "tiktok_configured": bool(settings.tiktok_pixel_id and settings.tiktok_access_token),
            "tiktok_pixel_id_suffix": settings.tiktok_pixel_id[-8:] if settings.tiktok_pixel_id else None,
            "snap_configured": bool(settings.snap_pixel_id and settings.snap_access_token),
            "snap_pixel_id_suffix": settings.snap_pixel_id[-8:] if settings.snap_pixel_id else None,
            "send_test_events": settings.send_test_events,
            "debug_analytics": settings.debug_analytics,
        },
        "redirects": {
            "admin_configured": redirect_admin_configured,
            "count": redirect_count,
        },
    })
