/*
# Add Storage Bucket for Profile Photos

## Overview
Creates a public storage bucket named `photos` for storing student, parent,
and volunteer profile photos uploaded from the CRM frontend.

## Changes
- Insert a new row in `storage.buckets` with id `photos`, public = true.
- No RLS policies needed on the bucket since it is public (read = anyone,
  write = anon + authenticated via storage policies below).

## Storage Policies
- SELECT (read): public — anyone can view uploaded photos.
- INSERT (upload): anon + authenticated can upload.
- UPDATE: anon + authenticated can replace.
- DELETE: anon + authenticated can remove.

## Notes
- The bucket is public so photo URLs can be displayed in <img> tags without
  signed URLs.
- Object paths will be prefixed by entity type, e.g. `students/<uuid>.jpg`.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Read: public
DROP POLICY IF EXISTS "photos_public_read" ON storage.objects;
CREATE POLICY "photos_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'photos');

-- Insert: anon + authenticated
DROP POLICY IF EXISTS "photos_anon_insert" ON storage.objects;
CREATE POLICY "photos_anon_insert"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'photos');

-- Update: anon + authenticated
DROP POLICY IF EXISTS "photos_anon_update" ON storage.objects;
CREATE POLICY "photos_anon_update"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'photos')
  WITH CHECK (bucket_id = 'photos');

-- Delete: anon + authenticated
DROP POLICY IF EXISTS "photos_anon_delete" ON storage.objects;
CREATE POLICY "photos_anon_delete"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'photos');
