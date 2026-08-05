from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import admin, events, health, orders, redirect_admin, redirects_public
from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger
from app.db import close_db, init_db

settings = get_settings()
configure_logging(settings.log_level)
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting MySanad API", environment=settings.environment)
    if not settings.google_sheet_webhook_url:
        logger.warning(
            "Google Sheet webhook URL not configured — orders will NOT be sent to the sheet",
        )
    else:
        logger.info(
            "Google Sheet webhook configured",
            send_test_orders=settings.send_test_orders_to_sheet,
        )
    await init_db()
    try:
        yield
    finally:
        await close_db()
        logger.info("Shutting down MySanad API")


app = FastAPI(
    title="MySanad API",
    version="0.1.0",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url=None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=r"https://(.*\.)?mysanad\.shop",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])
app.include_router(events.router, prefix="/events", tags=["events"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(redirect_admin.router, prefix="/redirect-admin", tags=["redirect-admin"])
app.include_router(redirects_public.router, prefix="/redirects", tags=["redirects"])
