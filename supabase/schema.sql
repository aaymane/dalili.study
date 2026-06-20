-- ─────────────────────────────────────────────────────────────────────────────
-- DALILI WAITLIST — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Table ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.waitlist (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        NOT NULL,
  source     TEXT        NOT NULL DEFAULT 'website',
  status     TEXT        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'invited', 'converted', 'unsubscribed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata   JSONB                DEFAULT '{}'::jsonb,

  CONSTRAINT waitlist_email_unique UNIQUE (email)
);

-- ── 2. Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_status     ON public.waitlist (status);
CREATE INDEX IF NOT EXISTS idx_waitlist_email      ON public.waitlist (lower(email));

-- ── 3. Auto updated_at ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_waitlist_updated_at
  BEFORE UPDATE ON public.waitlist
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 4. Row Level Security ─────────────────────────────────────────────────────
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (the public signup form — anon key)
CREATE POLICY "waitlist_public_insert"
  ON public.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service_role can SELECT / UPDATE / DELETE
-- (service_role bypasses RLS entirely — no explicit policy needed)
-- But deny anon reads explicitly for clarity:
CREATE POLICY "waitlist_deny_anon_select"
  ON public.waitlist
  FOR SELECT
  TO anon
  USING (false);

-- ── 5. Stats view (optional, convenient for dashboard) ───────────────────────
CREATE OR REPLACE VIEW public.waitlist_stats AS
SELECT
  count(*)                                              AS total,
  count(*) FILTER (WHERE status = 'pending')            AS pending,
  count(*) FILTER (WHERE status = 'invited')            AS invited,
  count(*) FILTER (WHERE status = 'converted')          AS converted,
  count(*) FILTER (WHERE created_at >= now() - interval '7 days')  AS last_7_days,
  count(*) FILTER (WHERE created_at >= now() - interval '30 days') AS last_30_days
FROM public.waitlist;
