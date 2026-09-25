-- ================================================================
-- 📲 تەكلىماكان سودا سۇپىسى — تېلېفون خەۋەرلەندۈرۈش جەدۋەللىرى (Web Push)
-- Supabase SQL Editor غا چاپلاپ ئىجرا قىلىسىز
-- ================================================================

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT,
    auth TEXT,
    preferred_lang VARCHAR(10) DEFAULT 'ug',
    lang_history TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access to push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Public access to push subscriptions" ON public.push_subscriptions
    FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.push_broadcast_logs (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT,
    image TEXT,
    url TEXT,
    target_lang VARCHAR(10) DEFAULT 'all',
    sent_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.push_broadcast_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access to push logs" ON public.push_broadcast_logs;
CREATE POLICY "Public access to push logs" ON public.push_broadcast_logs
    FOR ALL USING (true) WITH CHECK (true);
