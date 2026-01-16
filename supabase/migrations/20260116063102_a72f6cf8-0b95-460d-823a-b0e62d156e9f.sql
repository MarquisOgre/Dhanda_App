-- Fix RLS policies on license_settings: remove dependency on auth.users (permission denied)

-- Ensure RLS is enabled
ALTER TABLE public.license_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if they exist)
DROP POLICY IF EXISTS "Users can view own license" ON public.license_settings;
DROP POLICY IF EXISTS "SuperAdmin can insert licenses" ON public.license_settings;
DROP POLICY IF EXISTS "SuperAdmin can update licenses" ON public.license_settings;
DROP POLICY IF EXISTS "SuperAdmin can delete licenses" ON public.license_settings;
DROP POLICY IF EXISTS "Admins can manage license settings" ON public.license_settings;

-- Users can view their own license (by user_id OR by matching email in JWT)
CREATE POLICY "Users can view own license"
ON public.license_settings
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR (user_email IS NOT NULL AND lower(user_email) = lower(auth.jwt() ->> 'email'))
  OR lower(auth.jwt() ->> 'email') = 'marquisogre@gmail.com'
);

-- Admins can manage license settings (keep existing intent, but scoped to authenticated)
CREATE POLICY "Admins can manage license settings"
ON public.license_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SuperAdmin override (email-based)
CREATE POLICY "SuperAdmin can insert licenses"
ON public.license_settings
FOR INSERT
TO authenticated
WITH CHECK (lower(auth.jwt() ->> 'email') = 'marquisogre@gmail.com');

CREATE POLICY "SuperAdmin can update licenses"
ON public.license_settings
FOR UPDATE
TO authenticated
USING (lower(auth.jwt() ->> 'email') = 'marquisogre@gmail.com')
WITH CHECK (lower(auth.jwt() ->> 'email') = 'marquisogre@gmail.com');

CREATE POLICY "SuperAdmin can delete licenses"
ON public.license_settings
FOR DELETE
TO authenticated
USING (lower(auth.jwt() ->> 'email') = 'marquisogre@gmail.com');
