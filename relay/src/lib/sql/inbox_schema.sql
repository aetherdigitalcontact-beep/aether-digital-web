-- RELAY INBOX INFRASTRUCTURE
-- Run this in the Supabase SQL Editor

-- 1. Subscribers Table
-- Represents the users of the developer's application
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    external_id TEXT NOT NULL,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, external_id)
);

-- 2. Inbox Messages Table
-- Stores notifications sent to subscribers
CREATE TABLE IF NOT EXISTS public.inbox_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    subscriber_id UUID NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    cta_url TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_inbox_subscriber_id ON public.inbox_messages(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_inbox_is_read ON public.inbox_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_subscribers_external_id ON public.subscribers(external_id);

-- 4. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.inbox_messages;
