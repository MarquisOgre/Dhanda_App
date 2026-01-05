-- Allow admins to view all profiles for user management
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert missing role for user without role
INSERT INTO public.user_roles (user_id, role)
SELECT 'a5cba0bf-ba20-446a-a49d-d2eaf8d821ee', 'viewer'
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = 'a5cba0bf-ba20-446a-a49d-d2eaf8d821ee'
);