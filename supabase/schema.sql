-- ═══════════════════════════════════════════════════════════════════════════
-- Shree Radha Studio — Exhibition Lead Capture System
-- Supabase SQL Schema
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Table: exhibition_leads ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.exhibition_leads (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT          NOT NULL,
  mobile            TEXT          NOT NULL,
  city              TEXT          NOT NULL,
  state             TEXT,
  shop_name         TEXT          NOT NULL,
  business_type     TEXT          CHECK (business_type IN ('Wholesaler', 'Retailer', 'Distributor', 'Other')),
  product_code      TEXT,
  sales_order_code  TEXT,
  remarks           TEXT,
  uploaded_files    JSONB,        -- Array of { name, url, type, size, category }
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

-- For search by name and mobile
CREATE INDEX IF NOT EXISTS idx_exhibition_leads_name
  ON public.exhibition_leads USING btree (name);

CREATE INDEX IF NOT EXISTS idx_exhibition_leads_mobile
  ON public.exhibition_leads USING btree (mobile);

-- For default ordering by newest first
CREATE INDEX IF NOT EXISTS idx_exhibition_leads_created_at
  ON public.exhibition_leads USING btree (created_at DESC);

-- For full-text search across name and mobile
CREATE INDEX IF NOT EXISTS idx_exhibition_leads_name_mobile_text
  ON public.exhibition_leads USING gin (to_tsvector('english', name || ' ' || mobile));

-- For filtering by business type
CREATE INDEX IF NOT EXISTS idx_exhibition_leads_business_type
  ON public.exhibition_leads USING btree (business_type);

-- ─── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE public.exhibition_leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon key) to INSERT leads from the form
CREATE POLICY "Allow public insert" ON public.exhibition_leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users (admin) to read all leads
CREATE POLICY "Allow authenticated read" ON public.exhibition_leads
  FOR SELECT TO authenticated
  USING (true);

-- Allow anon key to read leads (needed for admin page using anon key)
-- NOTE: Remove this if you add proper auth to admin page
CREATE POLICY "Allow anon read" ON public.exhibition_leads
  FOR SELECT TO anon
  USING (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- Storage Bucket Setup
-- Run this SQL in Supabase SQL Editor after creating the bucket via UI
-- ═══════════════════════════════════════════════════════════════════════════

-- Create storage bucket (via Supabase Dashboard -> Storage -> New bucket)
-- Name: exhibition-leads
-- Public: true (so uploaded files have public URLs)

-- Storage policies for the bucket
-- Allow anyone to upload files
INSERT INTO storage.buckets (id, name, public)
  VALUES ('exhibition-leads', 'exhibition-leads', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'exhibition-leads');

CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'exhibition-leads');

-- ─── Sample Query: fetch recent leads ────────────────────────────────────────

-- SELECT * FROM exhibition_leads ORDER BY created_at DESC LIMIT 50;

-- Sample Query: search by name or mobile
-- SELECT * FROM exhibition_leads
-- WHERE name ILIKE '%search%' OR mobile ILIKE '%search%'
-- ORDER BY created_at DESC;
