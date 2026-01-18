-- Create a function to check if user is SuperAdmin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = _user_id
      AND email = 'marquisogre@gmail.com'
  )
$$;

-- Drop the permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert units" ON public.units;
DROP POLICY IF EXISTS "Authenticated users can update units" ON public.units;
DROP POLICY IF EXISTS "Authenticated users can delete units" ON public.units;

-- Create stricter policies that only allow SuperAdmin to modify
CREATE POLICY "Only SuperAdmin can insert units" 
ON public.units 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Only SuperAdmin can update units" 
ON public.units 
FOR UPDATE 
TO authenticated
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Only SuperAdmin can delete units" 
ON public.units 
FOR DELETE 
TO authenticated
USING (public.is_super_admin(auth.uid()));