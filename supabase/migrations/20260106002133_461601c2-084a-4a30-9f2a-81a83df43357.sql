-- Drop the existing restrictive SELECT policy for items
DROP POLICY IF EXISTS "Users can view items" ON public.items;

-- Create new policy that allows all authenticated users to view all items
CREATE POLICY "All authenticated users can view items" 
ON public.items 
FOR SELECT 
TO authenticated
USING (true);

-- Update insert/update policies to not require user_id match
DROP POLICY IF EXISTS "Admin/Supervisor can insert items" ON public.items;
CREATE POLICY "Admin/Supervisor can insert items" 
ON public.items 
FOR INSERT 
TO authenticated
WITH CHECK (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin/Supervisor can update items" ON public.items;
CREATE POLICY "Admin/Supervisor can update items" 
ON public.items 
FOR UPDATE 
TO authenticated
USING (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin can delete items" ON public.items;
CREATE POLICY "Admin can delete items" 
ON public.items 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));