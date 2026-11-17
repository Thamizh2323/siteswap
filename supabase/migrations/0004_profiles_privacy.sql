-- Migration 0004: Column-Level Phone Number Privacy on Profiles
-- Restricts direct table SELECT on `profiles` to the authenticated owner.
-- Public queries (seller name, role, area) must read from `public_profiles` view.
-- Phone numbers remain exclusively accessible via `get_contact(p_res)` RPC.

-- 1. Drop the broad public read policy
DROP POLICY IF EXISTS "Profiles: public read" ON profiles;

-- 2. Restrict direct profiles SELECT to the profile owner
CREATE POLICY "Profiles: own read" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 3. Create the public_profiles view omitting sensitive phone numbers
CREATE OR REPLACE VIEW public_profiles WITH (security_invoker = false) AS
  SELECT
    id,
    name,
    role,
    lang,
    area_text,
    created_at
  FROM profiles;

-- 4. Allow public read access on the sanitized view
GRANT SELECT ON public_profiles TO anon, authenticated;
