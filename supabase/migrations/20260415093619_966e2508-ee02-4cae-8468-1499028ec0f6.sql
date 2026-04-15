
-- Remove the public SELECT policy
DROP POLICY IF EXISTS "Anyone can download extension files" ON storage.objects;

-- Add auth-only download policy
CREATE POLICY "Authenticated users can download extension files"
ON storage.objects FOR SELECT
USING (bucket_id = 'extension-downloads' AND auth.role() = 'authenticated');
