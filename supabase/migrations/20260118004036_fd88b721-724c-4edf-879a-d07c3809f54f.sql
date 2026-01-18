-- Update RLS policies on units table to make units global (readable by all, writable only by SuperAdmin via application logic)

-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view their own units" ON public.units;
DROP POLICY IF EXISTS "Users can create their own units" ON public.units;
DROP POLICY IF EXISTS "Users can update their own units" ON public.units;
DROP POLICY IF EXISTS "Users can delete their own units" ON public.units;

-- Create new policies: All authenticated users can view all units
CREATE POLICY "All users can view units" 
ON public.units 
FOR SELECT 
TO authenticated
USING (true);

-- Only authenticated users can insert (SuperAdmin check is done in application)
CREATE POLICY "Authenticated users can insert units" 
ON public.units 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Only authenticated users can update (SuperAdmin check is done in application)
CREATE POLICY "Authenticated users can update units" 
ON public.units 
FOR UPDATE 
TO authenticated
USING (true);

-- Only authenticated users can delete (SuperAdmin check is done in application)
CREATE POLICY "Authenticated users can delete units" 
ON public.units 
FOR DELETE 
TO authenticated
USING (true);