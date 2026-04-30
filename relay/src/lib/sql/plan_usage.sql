-- Dedicated table for tracking monthly usage per user to avoid expensive logs table scans
CREATE TABLE IF NOT EXISTS plan_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: YYYY-MM
    usage_count BIGINT DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, month_year)
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_plan_usage_lookup ON plan_usage(user_id, month_year);
