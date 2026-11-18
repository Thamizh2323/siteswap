-- Migration 0005: Supabase Storage Configuration for listing-photos
-- Creates public bucket for surplus listing photos with strict path-isolated RLS policies.
-- Path convention: <uid>/<random-uuid>.jpg

-- 1. Create or update the listing-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-photos',
  'listing-photos',
  true,
  5242880, -- 5 MB ceiling; client-side compresses to < 300 KB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 2. Public Read: anyone can view listing photos
DROP POLICY IF EXISTS "listing_photos_public_read" ON storage.objects;
CREATE POLICY "listing_photos_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'listing-photos');

-- 3. Authenticated Insert: user can only upload into their own folder (<uid>/...)
DROP POLICY IF EXISTS "listing_photos_auth_insert" ON storage.objects;
CREATE POLICY "listing_photos_auth_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. Authenticated Update: user can only update their own files
DROP POLICY IF EXISTS "listing_photos_auth_update" ON storage.objects;
CREATE POLICY "listing_photos_auth_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5. Authenticated Delete: user can only delete their own files
DROP POLICY IF EXISTS "listing_photos_auth_delete" ON storage.objects;
CREATE POLICY "listing_photos_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
