-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view parties" ON public.parties;

-- Create new policy that allows all authenticated users to view all parties
CREATE POLICY "All authenticated users can view parties" 
ON public.parties 
FOR SELECT 
TO authenticated
USING (true);

-- Also update insert/update policies to not require user_id match for admins
-- This allows admins to manage all parties
DROP POLICY IF EXISTS "Admin/Supervisor can insert parties" ON public.parties;
CREATE POLICY "Admin/Supervisor can insert parties" 
ON public.parties 
FOR INSERT 
TO authenticated
WITH CHECK (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin/Supervisor can update parties" ON public.parties;
CREATE POLICY "Admin/Supervisor can update parties" 
ON public.parties 
FOR UPDATE 
TO authenticated
USING (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin can delete parties" ON public.parties;
CREATE POLICY "Admin can delete parties" 
ON public.parties 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));