-- Drop the existing SELECT policy that doesn't work correctly
DROP POLICY IF EXISTS "Users can view own license" ON public.license_settings;

-- Create a new SELECT policy that checks both user_id AND user_email
CREATE POLICY "Users can view own license" 
ON public.license_settings 
FOR SELECT 
TO authenticated
USING (
  user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR user_id = auth.uid()
  OR (SELECT email FROM auth.users WHERE id = auth.uid()) = 'marquisogre@gmail.com'
);