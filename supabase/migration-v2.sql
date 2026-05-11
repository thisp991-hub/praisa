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

-- 4. Update slug migration RPC to also migrate customers
CREATE OR REPLACE FUNCTION migrate_business_slug(
  p_profile_id uuid,
  p_old_slug text,
  p_new_slug text,
  p_business_name text,
  p_google_review_link text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM business_profiles
    WHERE id = p_profile_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized to modify this profile';
  END IF;

  UPDATE feedbacks SET business_slug = p_new_slug WHERE business_slug = p_old_slug;
  UPDATE customers SET business_slug = p_new_slug WHERE business_slug = p_old_slug;
  UPDATE business_profiles
    SET business_name = p_business_name,
        business_slug = p_new_slug,
        google_review_link = p_google_review_link
    WHERE id = p_profile_id;
END;
$$;
