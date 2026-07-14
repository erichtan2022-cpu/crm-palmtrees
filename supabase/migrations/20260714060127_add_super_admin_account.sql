/*
# Add super admin account for Palmtrees Montessori

Creates the primary admin login:
- Email: info@palmtreesmontessori.com
- Password: Palmtrees@2022#
- Role: admin
- Name: Admin Palmtrees
*/

DO $$
DECLARE
  new_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'info@palmtreesmontessori.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token
    ) VALUES (
      new_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'info@palmtreesmontessori.com',
      crypt('Palmtrees@2022#', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Admin Palmtrees","role":"admin","avatar":"https://i.pravatar.cc/150?img=12"}'::jsonb,
      false, ''
    );
    INSERT INTO profiles (id, name, role, avatar, child_ids)
    VALUES (new_id, 'Admin Palmtrees', 'admin', 'https://i.pravatar.cc/150?img=12', '[]'::jsonb)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END;
$$;
