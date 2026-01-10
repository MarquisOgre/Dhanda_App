-- Update RLS policy for business_settings to allow all authenticated users to view settings
-- This ensures supervisors and viewers can also see the business settings

DROP POLICY IF EXISTS "Users can view own settings" ON public.business_settings;

CREATE POLICY "All users can view business settings" 
ON public.business_settings 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);