-- Create the superadmin user if not exists
-- Note: This creates the user in auth.users with the specified email
-- The password will be set via auth.users table

DO $$
DECLARE
  superadmin_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO superadmin_user_id 
  FROM auth.users 
  WHERE email = 'marquisogre@gmail.com';
  
  IF superadmin_user_id IS NULL THEN
    -- Create the user
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      aud,
      role
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'marquisogre@gmail.com',
      crypt('!Vijaya84', gen_salt('bf')),
      now(),
      now(),
      now(),
      '',
      '',
      'authenticated',
      'authenticated'
    ) RETURNING id INTO superadmin_user_id;
    
    -- Create profile for the superadmin
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (superadmin_user_id, 'marquisogre@gmail.com', 'Super Admin');
    
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (superadmin_user_id, 'admin');
  ELSE
    -- Update password if user exists
    UPDATE auth.users 
    SET encrypted_password = crypt('!Vijaya84', gen_salt('bf'))
    WHERE id = superadmin_user_id;
    
    -- Ensure admin role exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (superadmin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;