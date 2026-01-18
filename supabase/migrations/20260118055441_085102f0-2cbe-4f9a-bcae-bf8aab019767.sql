
-- Fix the get_family_user_ids function to properly isolate data per admin
-- Each admin should only see their own data
-- Sub-users should see their parent admin's data only

CREATE OR REPLACE FUNCTION public.get_family_user_ids(_user_id uuid)
RETURNS TABLE(family_user_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Get the admin (root parent) of this user
  WITH RECURSIVE user_hierarchy AS (
    -- Start with the current user
    SELECT p.user_id, p.parent_user_id
    FROM public.profiles p
    WHERE p.user_id = _user_id
    
    UNION ALL
    
    -- Go up the hierarchy to find the root admin
    SELECT p.user_id, p.parent_user_id
    FROM public.profiles p
    INNER JOIN user_hierarchy uh ON p.user_id = uh.parent_user_id
  ),
  root_admin AS (
    -- The root admin is the one with no parent
    SELECT user_id as admin_id
    FROM user_hierarchy
    WHERE parent_user_id IS NULL
    LIMIT 1
  )
  -- Return ONLY the root admin's user_id
  -- This means all users in a family see ONLY the admin's data
  SELECT admin_id as family_user_id
  FROM root_admin;
$$;
