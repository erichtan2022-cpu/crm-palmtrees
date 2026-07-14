/*
# Recreate all seeded auth users with correct schema

Inserts all 5 users with:
- All token fields as empty string (not NULL)
- is_anonymous = false, is_sso_user = false
- bcrypt cost 10
- Complete identity_data (email_verified=true)
- Matching profile rows
*/

DO $$
DECLARE
  uid1 uuid := gen_random_uuid();
  uid2 uuid := gen_random_uuid();
  uid3 uuid := gen_random_uuid();
  uid4 uuid := gen_random_uuid();
  uid5 uuid := gen_random_uuid();
BEGIN

  -- info@palmtreesmontessori.com / Palmtrees@2022#
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change, email_change_token_current,
    phone_change, phone_change_token, reauthentication_token,
    email_change_confirm_status, is_sso_user, is_anonymous, is_super_admin,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    uid1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'info@palmtreesmontessori.com', crypt('Palmtrees@2022#', gen_salt('bf', 10)),
    now(), '', '', '', '', '', '', '', '', 0, false, false, false,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Admin Palmtrees","role":"admin","avatar":"https://i.pravatar.cc/150?img=12"}'::jsonb,
    now(), now()
  );
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), uid1, 'info@palmtreesmontessori.com',
    jsonb_build_object('sub', uid1::text, 'email', 'info@palmtreesmontessori.com', 'email_verified', true, 'phone_verified', false),
    'email', now(), now(), now());
  INSERT INTO profiles (id, name, role, avatar, child_ids)
  VALUES (uid1, 'Admin Palmtrees', 'admin', 'https://i.pravatar.cc/150?img=12', '[]'::jsonb)
  ON CONFLICT (id) DO NOTHING;

  -- fxrich01@gmail.com / CRM123#
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change, email_change_token_current,
    phone_change, phone_change_token, reauthentication_token,
    email_change_confirm_status, is_sso_user, is_anonymous, is_super_admin,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    uid2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'fxrich01@gmail.com', crypt('CRM123#', gen_salt('bf', 10)),
    now(), '', '', '', '', '', '', '', '', 0, false, false, false,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Hendrik Tanuwidjaja","role":"admin","avatar":"https://i.pravatar.cc/150?img=12"}'::jsonb,
    now(), now()
  );
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), uid2, 'fxrich01@gmail.com',
    jsonb_build_object('sub', uid2::text, 'email', 'fxrich01@gmail.com', 'email_verified', true, 'phone_verified', false),
    'email', now(), now(), now());
  INSERT INTO profiles (id, name, role, avatar, child_ids)
  VALUES (uid2, 'Hendrik Tanuwidjaja', 'admin', 'https://i.pravatar.cc/150?img=12', '[]'::jsonb)
  ON CONFLICT (id) DO NOTHING;

  -- msjati@gmail.com / Guru123#
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change, email_change_token_current,
    phone_change, phone_change_token, reauthentication_token,
    email_change_confirm_status, is_sso_user, is_anonymous, is_super_admin,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    uid3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'msjati@gmail.com', crypt('Guru123#', gen_salt('bf', 10)),
    now(), '', '', '', '', '', '', '', '', 0, false, false, false,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Ms. Jati","role":"teacher","avatar":"https://i.pravatar.cc/150?img=47"}'::jsonb,
    now(), now()
  );
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), uid3, 'msjati@gmail.com',
    jsonb_build_object('sub', uid3::text, 'email', 'msjati@gmail.com', 'email_verified', true, 'phone_verified', false),
    'email', now(), now(), now());
  INSERT INTO profiles (id, name, role, avatar, child_ids)
  VALUES (uid3, 'Ms. Jati', 'teacher', 'https://i.pravatar.cc/150?img=47', '[]'::jsonb)
  ON CONFLICT (id) DO NOTHING;

  -- kiddymontessori@gmail.com / Staff123#
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change, email_change_token_current,
    phone_change, phone_change_token, reauthentication_token,
    email_change_confirm_status, is_sso_user, is_anonymous, is_super_admin,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    uid4, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'kiddymontessori@gmail.com', crypt('Staff123#', gen_salt('bf', 10)),
    now(), '', '', '', '', '', '', '', '', 0, false, false, false,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Angelina Rini","role":"staff","avatar":"https://i.imgur.com/8XpQSC6.jpeg"}'::jsonb,
    now(), now()
  );
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), uid4, 'kiddymontessori@gmail.com',
    jsonb_build_object('sub', uid4::text, 'email', 'kiddymontessori@gmail.com', 'email_verified', true, 'phone_verified', false),
    'email', now(), now(), now());
  INSERT INTO profiles (id, name, role, avatar, child_ids)
  VALUES (uid4, 'Angelina Rini', 'staff', 'https://i.imgur.com/8XpQSC6.jpeg', '[]'::jsonb)
  ON CONFLICT (id) DO NOTHING;

  -- johny01@gmail.com / Ortu123#
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change, email_change_token_current,
    phone_change, phone_change_token, reauthentication_token,
    email_change_confirm_status, is_sso_user, is_anonymous, is_super_admin,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    uid5, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'johny01@gmail.com', crypt('Ortu123#', gen_salt('bf', 10)),
    now(), '', '', '', '', '', '', '', '', 0, false, false, false,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Johny Patra","role":"parent","avatar":"https://i.pravatar.cc/150?img=33","child_ids":["s1","s2"]}'::jsonb,
    now(), now()
  );
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), uid5, 'johny01@gmail.com',
    jsonb_build_object('sub', uid5::text, 'email', 'johny01@gmail.com', 'email_verified', true, 'phone_verified', false),
    'email', now(), now(), now());
  INSERT INTO profiles (id, name, role, avatar, child_ids)
  VALUES (uid5, 'Johny Patra', 'parent', 'https://i.pravatar.cc/150?img=33', '["s1","s2"]'::jsonb)
  ON CONFLICT (id) DO NOTHING;

END;
$$;
