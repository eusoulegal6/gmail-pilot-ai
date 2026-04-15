
INSERT INTO storage.buckets (id, name, public)
VALUES ('extension-downloads', 'extension-downloads', true);

CREATE POLICY "Anyone can download extension files"
ON storage.objects FOR SELECT
USING (bucket_id = 'extension-downloads');

CREATE POLICY "Authenticated users can upload extension files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'extension-downloads' AND auth.role() = 'authenticated');
