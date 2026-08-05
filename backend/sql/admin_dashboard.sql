-- Admin dashboard migration for existing MySanad databases.
-- The FastAPI app also creates this table on startup, but run this once
-- manually if you manage schema changes outside the app boot process.

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

CREATE INDEX IF NOT EXISTS idx_browser_events_created_at
    ON browser_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_browser_events_valid_created_at
    ON browser_events(is_valid_ksa_traffic, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_browser_events_event_name
    ON browser_events(event_name);
