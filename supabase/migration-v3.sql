-- Migration v3: Trial & Subscription System
-- Run this in your Supabase SQL Editor.
-- Safe to re-run (uses IF NOT EXISTS / DROP POLICY IF EXISTS).

-- =============================================================
-- 1. Subscription fields on business_profiles
-- =============================================================
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'trial' NOT NULL;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS trial_started_at timestamptz DEFAULT now();
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz DEFAULT (now() + interval '7 days');
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS paid_until timestamptz;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS plan text DEFAULT 'starter';

-- =============================================================
-- 2. Access codes table
-- =============================================================
CREATE TABLE IF NOT EXISTS access_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  client_name text,
  is_used boolean DEFAULT false NOT NULL,
  used_by_email text,
  used_by_user_id uuid,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by uuid
);

ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Admin can do everything (admin email = praisareviews@gmail.com)
DROP POLICY IF EXISTS "Admin can view access codes" ON access_codes;
CREATE POLICY "Admin can view access codes"
  ON access_codes FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'praisareviews@gmail.com'
  );

DROP POLICY IF EXISTS "Admin can insert access codes" ON access_codes;
CREATE POLICY "Admin can insert access codes"
  ON access_codes FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' = 'praisareviews@gmail.com'
  );

DROP POLICY IF EXISTS "Admin can update access codes" ON access_codes;
CREATE POLICY "Admin can update access codes"
  ON access_codes FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'praisareviews@gmail.com'
  );

DROP POLICY IF EXISTS "Admin can delete access codes" ON access_codes;
CREATE POLICY "Admin can delete access codes"
  ON access_codes FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'praisareviews@gmail.com'
  );

-- =============================================================
-- 3. RPC: validate_access_code (callable by anon during signup)
-- =============================================================
CREATE OR REPLACE FUNCTION validate_access_code(p_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM access_codes
    WHERE code = p_code
      AND is_used = false
      AND (expires_at IS NULL OR expires_at > now())
  ) INTO v_exists;
  RETURN v_exists;
END;
$$;

-- =============================================================
-- 4. RPC: mark_access_code_used (called after successful signup)
-- =============================================================
CREATE OR REPLACE FUNCTION mark_access_code_used(
  p_code text,
  p_email text,
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE access_codes
  SET is_used = true,
      used_by_email = p_email,
      used_by_user_id = p_user_id
  WHERE code = p_code
    AND is_used = false;
END;
$$;

-- =============================================================
-- 5. Admin RLS policy for business_profiles (admin can view all)
-- =============================================================
DROP POLICY IF EXISTS "Admin can view all profiles" ON business_profiles;
CREATE POLICY "Admin can view all profiles"
  ON business_profiles FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'praisareviews@gmail.com'
  );

DROP POLICY IF EXISTS "Admin can update all profiles" ON business_profiles;
CREATE POLICY "Admin can update all profiles"
  ON business_profiles FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'praisareviews@gmail.com'
  );

-- =============================================================
-- 6. Update slug migration RPC to include new fields
-- =============================================================
CREATE OR REPLACE FUNCTION migrate_business_slug(
  p_profile_id uuid, p_old_slug text, p_new_slug text,
  p_business_name text, p_google_review_link text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
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
    SET business_name = p_business_name, business_slug = p_new_slug,
        google_review_link = p_google_review_link
    WHERE id = p_profile_id;
END;
$$;

-- =============================================================
-- 7. Indexes
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_is_used ON access_codes(is_used);
