"""Small PostgreSQL persistence layer for MySanad orders.

This project does not use Alembic yet. To make Easypanel deployments practical,
the API creates the required tables on startup when DATABASE_URL is configured.
"""
from __future__ import annotations

import json
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Optional

import asyncpg

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()

_pool: Optional[asyncpg.Pool] = None


async def init_db() -> None:
    """Create a connection pool and ensure all required tables exist."""
    global _pool
    if _pool is not None:
        return

    _pool = await asyncpg.create_pool(dsn=settings.database_url, min_size=1, max_size=5)
    await ensure_schema()
    logger.info("Database initialized")


async def close_db() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None
        logger.info("Database closed")


def is_ready() -> bool:
    return _pool is not None


async def ensure_schema() -> None:
    if _pool is None:
        raise RuntimeError("Database pool is not initialized")

    async with _pool.acquire() as conn:
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY,
                order_number TEXT UNIQUE NOT NULL,
                status TEXT NOT NULL,
                is_test BOOLEAN NOT NULL DEFAULT FALSE,
                customer_name TEXT NOT NULL,
                phone_local TEXT NOT NULL,
                phone_e164 TEXT NOT NULL,
                phone_country_digits TEXT NOT NULL,
                currency TEXT NOT NULL DEFAULT 'SAR',
                subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
                upsell_total NUMERIC(10,2) NOT NULL DEFAULT 0,
                total NUMERIC(10,2) NOT NULL DEFAULT 0,
                upsell_status TEXT NOT NULL DEFAULT 'pending',
                upsell_product_id TEXT,
                source_page TEXT,
                landing_page TEXT,
                referrer TEXT,
                user_agent TEXT,
                ip_address TEXT,
                session_id TEXT,
                purchase_event_id TEXT,
                attribution JSONB NOT NULL DEFAULT '{}'::jsonb,
                fraud_check JSONB NOT NULL DEFAULT '{}'::jsonb,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS order_items (
                id BIGSERIAL PRIMARY KEY,
                order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                product_id TEXT NOT NULL,
                product_name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                offer_label TEXT,
                source TEXT NOT NULL,
                unit_price NUMERIC(10,2) NOT NULL,
                line_total NUMERIC(10,2) NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS upsell_events (
                id BIGSERIAL PRIMARY KEY,
                order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                product_id TEXT,
                product_name TEXT,
                price NUMERIC(10,2) NOT NULL DEFAULT 99,
                shown BOOLEAN NOT NULL DEFAULT TRUE,
                accepted BOOLEAN,
                event_id TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                responded_at TIMESTAMPTZ
            );
            """
        )
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS analytics_deliveries (
                id BIGSERIAL PRIMARY KEY,
                order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
                platform TEXT NOT NULL,
                event_name TEXT NOT NULL,
                event_id TEXT,
                status TEXT NOT NULL DEFAULT 'pending',
                request_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
                response_payload JSONB,
                attempts INTEGER NOT NULL DEFAULT 0,
                last_error TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS browser_events (
                id BIGSERIAL PRIMARY KEY,
                event_name TEXT NOT NULL,
                event_id TEXT UNIQUE NOT NULL,
                session_id TEXT NOT NULL,
                page_url TEXT,
                referrer TEXT,
                product_id TEXT,
                value NUMERIC(10,2),
                currency TEXT NOT NULL DEFAULT 'SAR',
                user_agent TEXT,
                ip_address TEXT,
                fbp TEXT,
                fbc TEXT,
                ttp TEXT,
                fraud_check JSONB NOT NULL DEFAULT '{}'::jsonb,
                is_valid_ksa_traffic BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_orders_phone_local ON orders(phone_local);")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_browser_events_created_at ON browser_events(created_at DESC);")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_browser_events_valid_created_at ON browser_events(is_valid_ksa_traffic, created_at DESC);")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_browser_events_event_name ON browser_events(event_name);")
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS ad_redirects (
                slug TEXT PRIMARY KEY,
                target_path TEXT NOT NULL,
                label TEXT NOT NULL DEFAULT '',
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                click_count INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )
        await conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_ad_redirects_active ON ad_redirects(is_active);"
        )


def _jsonable(value: Any) -> Any:
    if isinstance(value, asyncpg.Record):
        return {key: _jsonable(value[key]) for key in value.keys()}
    if isinstance(value, list):
        return [_jsonable(item) for item in value]
    if isinstance(value, dict):
        return {key: _jsonable(item) for key, item in value.items()}
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, str) and value[:1] in ("{", "["):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value


def _order_valid_sql(alias: str = "o") -> str:
    return f"""
        {alias}.status <> 'blocked'
        AND {alias}.is_test = FALSE
        AND ({alias}.fraud_check->>'allowed')::boolean IS TRUE
        AND {alias}.fraud_check->>'country_iso' = 'SA'
        AND COALESCE(({alias}.fraud_check->>'is_anonymous')::boolean, FALSE) = FALSE
        AND COALESCE(({alias}.fraud_check->>'is_anonymous_vpn')::boolean, FALSE) = FALSE
        AND COALESCE(({alias}.fraud_check->>'is_hosting_provider')::boolean, FALSE) = FALSE
        AND COALESCE(({alias}.fraud_check->>'is_public_proxy')::boolean, FALSE) = FALSE
        AND COALESCE(({alias}.fraud_check->>'is_residential_proxy')::boolean, FALSE) = FALSE
        AND COALESCE(({alias}.fraud_check->>'is_tor_exit_node')::boolean, FALSE) = FALSE
    """


async def save_order(
    order: dict[str, Any],
    items: list[dict[str, Any]],
    attribution: dict[str, Any],
    fraud_check: dict[str, Any],
) -> None:
    """Persist a newly accepted order and its items."""
    if _pool is None:
        logger.warning("Database not initialized; skipping order persistence", order_id=order.get("order_id"))
        return

    async with _pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute(
                """
                INSERT INTO orders (
                    id, order_number, status, is_test, customer_name, phone_local, phone_e164,
                    phone_country_digits, currency, subtotal, upsell_total, total, upsell_status,
                    upsell_product_id, source_page, landing_page, referrer, user_agent, ip_address,
                    session_id, purchase_event_id, attribution, fraud_check, created_at, updated_at
                )
                VALUES (
                    $1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
                    $14, $15, $16, $17, $18, $19, $20, $21, $22::jsonb, $23::jsonb,
                    $24::timestamptz, $25::timestamptz
                )
                ON CONFLICT (id) DO NOTHING;
                """,
                order["order_id"],
                order["order_number"],
                order["status"],
                order["is_test"],
                order["customer_name"],
                order["phone_local"],
                order["phone_e164"],
                order["phone_country_digits"],
                order["currency"],
                order["subtotal"],
                order["upsell_total"],
                order["total"],
                order["upsell_status"],
                order.get("upsell_product_id"),
                order.get("source_page"),
                order.get("landing_page"),
                order.get("referrer"),
                order.get("user_agent"),
                order.get("ip_address"),
                order.get("session_id"),
                order.get("purchase_event_id"),
                json.dumps(attribution, ensure_ascii=False),
                json.dumps(fraud_check, ensure_ascii=False),
                order["created_at"],
                order["updated_at"],
            )
            for item in items:
                await conn.execute(
                    """
                    INSERT INTO order_items (
                        order_id, product_id, product_name, quantity, offer_label,
                        source, unit_price, line_total
                    )
                    VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8);
                    """,
                    order["order_id"],
                    item["product_id"],
                    item["product_name"],
                    item["quantity"],
                    item.get("offer_label"),
                    item["source"],
                    item["unit_price"],
                    item["line_total"],
                )
            if order.get("upsell_product_id"):
                from app.services.pricing import get_product_name

                await conn.execute(
                    """
                    INSERT INTO upsell_events (order_id, product_id, product_name, price, shown)
                    VALUES ($1::uuid, $2, $3, $4, TRUE);
                    """,
                    order["order_id"],
                    order["upsell_product_id"],
                    get_product_name(order["upsell_product_id"]),
                    99,
                )


async def mark_upsell_response(
    order_id: str,
    accepted: bool,
    product_id: Optional[str],
    event_id: Optional[str],
    total: float,
    upsell_total: float,
) -> None:
    if _pool is None:
        logger.warning("Database not initialized; skipping upsell persistence", order_id=order_id)
        return

    async with _pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute(
                """
                UPDATE orders
                SET upsell_status = $2,
                    upsell_total = $3,
                    total = $4,
                    updated_at = NOW()
                WHERE id = $1::uuid;
                """,
                order_id,
                "accepted" if accepted else "declined",
                upsell_total,
                total,
            )
            await conn.execute(
                """
                UPDATE upsell_events
                SET accepted = $2,
                    product_id = COALESCE($3, product_id),
                    event_id = $4,
                    responded_at = NOW()
                WHERE order_id = $1::uuid
                  AND responded_at IS NULL;
                """,
                order_id,
                accepted,
                product_id,
                event_id,
            )


async def record_browser_event(
    event: dict[str, Any],
    fraud_check: dict[str, Any],
    is_valid_ksa_traffic: bool,
) -> None:
    if _pool is None:
        logger.warning("Database not initialized; skipping browser event", event_id=event.get("event_id"))
        return

    async with _pool.acquire() as conn:
        await conn.execute(
            """
            INSERT INTO browser_events (
                event_name, event_id, session_id, page_url, referrer, product_id,
                value, currency, user_agent, ip_address, fbp, fbc, ttp,
                fraud_check, is_valid_ksa_traffic
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
                $14::jsonb, $15
            )
            ON CONFLICT (event_id) DO NOTHING;
            """,
            event["event_name"],
            event["event_id"],
            event["session_id"],
            event.get("page_url"),
            event.get("referrer"),
            event.get("product_id"),
            event.get("value"),
            event.get("currency", "SAR"),
            event.get("user_agent"),
            event.get("ip_address"),
            event.get("fbp"),
            event.get("fbc"),
            event.get("ttp"),
            json.dumps(fraud_check, ensure_ascii=False),
            is_valid_ksa_traffic,
        )


async def get_admin_metrics(start_at: Optional[datetime], end_at: Optional[datetime]) -> dict[str, Any]:
    if _pool is None:
        raise RuntimeError("Database pool is not initialized")

    valid_orders = _order_valid_sql("o")
    async with _pool.acquire() as conn:
        event_row = await conn.fetchrow(
            """
            SELECT
                COUNT(*) FILTER (WHERE event_name = 'PageView') AS page_views,
                COUNT(*) FILTER (WHERE event_name = 'ViewContent') AS product_views,
                COUNT(*) FILTER (WHERE event_name = 'AddToCart') AS clicks,
                COUNT(*) FILTER (WHERE event_name = 'InitiateCheckout') AS checkouts,
                COUNT(DISTINCT session_id) AS visitors
            FROM browser_events
            WHERE is_valid_ksa_traffic = TRUE
              AND ($1::timestamptz IS NULL OR created_at >= $1::timestamptz)
              AND ($2::timestamptz IS NULL OR created_at < $2::timestamptz);
            """,
            start_at,
            end_at,
        )
        order_row = await conn.fetchrow(
            f"""
            SELECT
                COUNT(*) AS orders,
                COALESCE(SUM(total), 0) AS revenue,
                COALESCE(AVG(total), 0) AS average_order_value,
                COUNT(*) FILTER (WHERE upsell_status = 'accepted') AS upsell_accepts
            FROM orders o
            WHERE {valid_orders}
              AND ($1::timestamptz IS NULL OR o.created_at >= $1::timestamptz)
              AND ($2::timestamptz IS NULL OR o.created_at < $2::timestamptz);
            """,
            start_at,
            end_at,
        )
        trend_rows = await conn.fetch(
            f"""
            WITH event_days AS (
                SELECT
                    date_trunc('day', created_at)::date AS day,
                    COUNT(*) FILTER (WHERE event_name = 'AddToCart') AS clicks,
                    COUNT(*) FILTER (WHERE event_name = 'InitiateCheckout') AS checkouts,
                    COUNT(DISTINCT session_id) AS visitors
                FROM browser_events
                WHERE is_valid_ksa_traffic = TRUE
                  AND ($1::timestamptz IS NULL OR created_at >= $1::timestamptz)
                  AND ($2::timestamptz IS NULL OR created_at < $2::timestamptz)
                GROUP BY 1
            ),
            order_days AS (
                SELECT
                    date_trunc('day', o.created_at)::date AS day,
                    COUNT(*) AS orders,
                    COALESCE(SUM(o.total), 0) AS revenue
                FROM orders o
                WHERE {valid_orders}
                  AND ($1::timestamptz IS NULL OR o.created_at >= $1::timestamptz)
                  AND ($2::timestamptz IS NULL OR o.created_at < $2::timestamptz)
                GROUP BY 1
            )
            SELECT
                COALESCE(event_days.day, order_days.day) AS day,
                COALESCE(event_days.visitors, 0) AS visitors,
                COALESCE(event_days.clicks, 0) AS clicks,
                COALESCE(event_days.checkouts, 0) AS checkouts,
                COALESCE(order_days.orders, 0) AS orders,
                COALESCE(order_days.revenue, 0) AS revenue
            FROM event_days
            FULL OUTER JOIN order_days ON order_days.day = event_days.day
            ORDER BY day ASC;
            """,
            start_at,
            end_at,
        )

    events = _jsonable(event_row)
    orders = _jsonable(order_row)
    clicks = events["clicks"] or 0
    visitors = events["visitors"] or 0
    order_count = orders["orders"] or 0
    return {
        **events,
        **orders,
        "conversion_rate": (order_count / clicks * 100) if clicks else 0,
        "visitor_conversion_rate": (order_count / visitors * 100) if visitors else 0,
        "upsell_take_rate": (orders["upsell_accepts"] / order_count * 100) if order_count else 0,
        "daily": _jsonable(trend_rows),
    }


async def list_admin_orders(
    start_at: Optional[datetime],
    end_at: Optional[datetime],
    status: Optional[str],
    query: Optional[str],
    limit: int,
    offset: int,
) -> dict[str, Any]:
    if _pool is None:
        raise RuntimeError("Database pool is not initialized")

    valid_orders = _order_valid_sql("o")
    search = f"%{query.strip()}%" if query else None
    async with _pool.acquire() as conn:
        total = await conn.fetchval(
            f"""
            SELECT COUNT(*)
            FROM orders o
            WHERE {valid_orders}
              AND ($1::timestamptz IS NULL OR o.created_at >= $1::timestamptz)
              AND ($2::timestamptz IS NULL OR o.created_at < $2::timestamptz)
              AND ($3::text IS NULL OR o.status = $3)
              AND (
                $4::text IS NULL
                OR o.order_number ILIKE $4
                OR o.customer_name ILIKE $4
                OR o.phone_local ILIKE $4
              );
            """,
            start_at,
            end_at,
            status,
            search,
        )
        rows = await conn.fetch(
            f"""
            SELECT
                o.id, o.order_number, o.status, o.customer_name, o.phone_local,
                o.total, o.currency, o.upsell_status, o.landing_page,
                o.ip_address, o.fraud_check, o.created_at,
                COALESCE(COUNT(oi.id), 0) AS item_count
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            WHERE {valid_orders}
              AND ($1::timestamptz IS NULL OR o.created_at >= $1::timestamptz)
              AND ($2::timestamptz IS NULL OR o.created_at < $2::timestamptz)
              AND ($3::text IS NULL OR o.status = $3)
              AND (
                $4::text IS NULL
                OR o.order_number ILIKE $4
                OR o.customer_name ILIKE $4
                OR o.phone_local ILIKE $4
              )
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT $5 OFFSET $6;
            """,
            start_at,
            end_at,
            status,
            search,
            limit,
            offset,
        )
    return {"total": total or 0, "orders": _jsonable(rows)}


async def get_admin_order_detail(order_id: str) -> Optional[dict[str, Any]]:
    if _pool is None:
        raise RuntimeError("Database pool is not initialized")

    valid_orders = _order_valid_sql("o")
    async with _pool.acquire() as conn:
        order = await conn.fetchrow(
            f"""
            SELECT *
            FROM orders o
            WHERE o.id = $1::uuid
              AND {valid_orders};
            """,
            order_id,
        )
        if order is None:
            return None
        items = await conn.fetch(
            """
            SELECT product_id, product_name, quantity, offer_label, source, unit_price, line_total, created_at
            FROM order_items
            WHERE order_id = $1::uuid
            ORDER BY created_at ASC, id ASC;
            """,
            order_id,
        )
        upsells = await conn.fetch(
            """
            SELECT product_id, product_name, price, shown, accepted, event_id, created_at, responded_at
            FROM upsell_events
            WHERE order_id = $1::uuid
            ORDER BY created_at ASC, id ASC;
            """,
            order_id,
        )
    detail = _jsonable(order)
    detail["items"] = _jsonable(items)
    detail["upsells"] = _jsonable(upsells)
    return detail


async def list_ad_redirects() -> list[dict[str, Any]]:
    if _pool is None:
        return []
    async with _pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT slug, target_path, label, is_active, click_count, created_at, updated_at
            FROM ad_redirects
            ORDER BY updated_at DESC, slug ASC;
            """
        )
    return _jsonable(rows)


async def get_ad_redirect_by_slug(slug: str) -> Optional[dict[str, Any]]:
    if _pool is None:
        return None
    async with _pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT slug, target_path, label, is_active, click_count, created_at, updated_at
            FROM ad_redirects
            WHERE slug = $1;
            """,
            slug,
        )
    return _jsonable(row) if row else None


async def create_ad_redirect(slug: str, target_path: str, label: str = "") -> dict[str, Any]:
    if _pool is None:
        raise RuntimeError("Database not initialized")
    async with _pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO ad_redirects (slug, target_path, label)
            VALUES ($1, $2, $3)
            RETURNING slug, target_path, label, is_active, click_count, created_at, updated_at;
            """,
            slug,
            target_path,
            label,
        )
    return _jsonable(row)


async def update_ad_redirect(
    slug: str,
    *,
    target_path: str,
    label: str,
    is_active: bool,
) -> Optional[dict[str, Any]]:
    if _pool is None:
        raise RuntimeError("Database not initialized")
    async with _pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE ad_redirects
            SET target_path = $2,
                label = $3,
                is_active = $4,
                updated_at = NOW()
            WHERE slug = $1
            RETURNING slug, target_path, label, is_active, click_count, created_at, updated_at;
            """,
            slug,
            target_path,
            label,
            is_active,
        )
    return _jsonable(row) if row else None


async def delete_ad_redirect(slug: str) -> bool:
    if _pool is None:
        raise RuntimeError("Database not initialized")
    async with _pool.acquire() as conn:
        result = await conn.execute("DELETE FROM ad_redirects WHERE slug = $1;", slug)
    return result.endswith("1")


async def increment_ad_redirect_clicks(slug: str) -> None:
    if _pool is None:
        return
    async with _pool.acquire() as conn:
        await conn.execute(
            """
            UPDATE ad_redirects
            SET click_count = click_count + 1, updated_at = NOW()
            WHERE slug = $1;
            """,
            slug,
        )
