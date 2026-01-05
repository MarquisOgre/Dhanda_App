-- Create storage bucket for business logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('business-logos', 'business-logos', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own logo
CREATE POLICY "Users can upload their own business logo"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to update their own logo
CREATE POLICY "Users can update their own business logo"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'business-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own logo
CREATE POLICY "Users can delete their own business logo"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'business-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to logos
CREATE POLICY "Business logos are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'business-logos');

-- Add financial_year_start column to business_settings
ALTER TABLE public.business_settings 
ADD COLUMN IF NOT EXISTS financial_year_start text DEFAULT 'april';