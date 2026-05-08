-- Praisa v2 Migration: Review Growth & Customer Recovery
-- Run this in your Supabase SQL editor if you already have the v1 schema.

-- 1. Add new columns to feedbacks
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS status text DEFAULT 'new' NOT NULL;
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS internal_note text;

-- 2. Add logo_url to business_profiles
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS logo_url text;

-- 3. Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_slug text NOT NULL,
  name text NOT NULL,
  phone text,
  email text,
  status text DEFAULT 'not_requested' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own customers"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
  ON customers FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_business_slug ON customers(business_slug);
