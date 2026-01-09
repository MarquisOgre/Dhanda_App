-- Fix parties SELECT policy to require authentication
DROP POLICY IF EXISTS "All authenticated users can view parties" ON public.parties;

CREATE POLICY "All authenticated users can view parties"
ON public.parties
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);