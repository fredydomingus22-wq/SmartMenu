-- Ensure bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-gallery', 'product-gallery', true) 
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid errors on retry
DROP POLICY IF EXISTS "Allow Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Allow Anonymous Uploads (DEBUG)" ON storage.objects;

-- Create policies
CREATE POLICY "Allow Authenticated Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Allow Public Select" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-gallery');

-- For debugging "Failed to upload", let's temporary allow all inserts if the above fails
-- CREATE POLICY "Allow Anonymous Uploads (DEBUG)" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-gallery');
