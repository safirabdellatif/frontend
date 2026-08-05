from __future__ import annotations

from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"
    api_base_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:3000"

    cors_origins: str = "http://localhost:3000,https://mysanad.shop,https://www.mysanad.shop"

    # Google Sheet webhook
    google_sheet_webhook_url: str = ""
    google_sheet_webhook_secret: str = ""
    send_test_orders_to_sheet: bool = True

    # MaxMind (accept MAX_MIND_ACCOUNT_ID — common Easypanel typo)
    maxmind_account_id: str = Field(
        default="",
        validation_alias=AliasChoices("MAXMIND_ACCOUNT_ID", "MAX_MIND_ACCOUNT_ID"),
    )
    maxmind_license_key: str = Field(
        default="",
        validation_alias=AliasChoices("MAXMIND_LICENSE_KEY", "MAX_MIND_LICENSE_KEY"),
    )
    maxmind_minfraud_endpoint: str = "https://minfraud.maxmind.com/minfraud/v2.0/insights"
    maxmind_max_risk_score: float = 50.0
    maxmind_max_ip_risk_score: float = 50.0
    # False (default): MaxMind runs in advisory mode — logs risk but never blocks.
    # True: enforce blocks (non-SA IP, VPN, high risk score, etc.).
    maxmind_required: bool = False
    allow_test_phone: str = "055000000"

    # Meta
    meta_pixel_id: str = ""
    meta_access_token: str = ""
    meta_test_event_code: str = ""

    # TikTok
    tiktok_pixel_id: str = ""
    tiktok_access_token: str = ""

    # Snapchat
    snap_pixel_id: str = ""
    snap_access_token: str = ""

    # Analytics flags
    analytics_enabled: bool = True
    debug_analytics: bool = False
    send_test_events: bool = False

    # Admin dashboard
    admin_username: str = ""
    admin_password: str = ""

    # Ad redirect manager (/redirecmysanad) — separate from admin dashboard
    redirect_admin_username: str = ""
    redirect_admin_password: str = ""

    # Database debug
    debug_db: bool = False

    database_url: str = "postgresql://mysanad:mysanad@localhost:5432/mysanad"

    log_level: str = "INFO"

    @property
    def async_database_url(self) -> str:
        url = self.database_url
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+asyncpg://", 1)
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql+asyncpg://", 1)
        return url

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
