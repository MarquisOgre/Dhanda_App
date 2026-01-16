-- Add user_id to license_settings for per-email licensing
ALTER TABLE public.license_settings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add email field to license_settings for easy lookup
ALTER TABLE public.license_settings ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_license_settings_user_id ON public.license_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_license_settings_user_email ON public.license_settings(user_email);

-- Update RLS for license_settings - each user sees only their own license
DROP POLICY IF EXISTS "Anyone can view license settings" ON public.license_settings;
DROP POLICY IF EXISTS "Admins can update license settings" ON public.license_settings;

-- Users can view their own license
CREATE POLICY "Users can view own license"
ON public.license_settings
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  -- SuperAdmin can view all licenses
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'marquisogre@gmail.com'
);

-- Only SuperAdmin can insert licenses
CREATE POLICY "SuperAdmin can insert licenses"
ON public.license_settings
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'marquisogre@gmail.com'
);

-- Only SuperAdmin can update licenses
CREATE POLICY "SuperAdmin can update licenses"
ON public.license_settings
FOR UPDATE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'marquisogre@gmail.com'
);

-- Only SuperAdmin can delete licenses
CREATE POLICY "SuperAdmin can delete licenses"
ON public.license_settings
FOR DELETE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'marquisogre@gmail.com'
);

-- Add user_id to items, parties, sale_invoices, purchase_invoices etc. for data isolation if not exists
-- Ensure all data tables have proper RLS for user isolation

-- Update business_settings RLS to be user-specific for modifications
DROP POLICY IF EXISTS "All users can view business settings" ON public.business_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.business_settings;
DROP POLICY IF EXISTS "Users can insert settings" ON public.business_settings;

-- Each user can view only their own business settings
CREATE POLICY "Users can view own business settings"
ON public.business_settings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can update only their own settings
CREATE POLICY "Users can update own business settings"
ON public.business_settings
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users can insert their own settings
CREATE POLICY "Users can insert own business settings"
ON public.business_settings
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());