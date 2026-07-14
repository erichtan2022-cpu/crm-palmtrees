/*
# Seed demo auth users and profiles

## Overview
Creates 4 Supabase Auth accounts for the existing demo users so the quick-login
buttons on the login screen continue to work after switching to real Supabase Auth.

## Users Created
1. Hendrik Tanuwidjaja — admin — fxrich01@gmail.com / CRM123#
2. Ms. Jati             — teacher — msjati@gmail.com / Guru123#
3. Angelina Rini        — staff — kiddymontessori@gmail.com / Staff123#
4. Johny Patra          — parent — johny01@gmail.com / Ortu123#

## Notes
- Passwords are encrypted using Supabase's built-in crypt() function with bf (blowfish).
- email_confirmed_at is set so no confirmation email is required.
- The profile row is inserted directly here rather than relying on the trigger,
  because the trigger only fires for new users created via the signup flow.
- ON CONFLICT DO NOTHING makes this migration idempotent.
*/

DO $$
DECLARE
  admin_id   uuid := gen_random_uuid();
  teacher_id uuid := gen_random_uuid();
  staff_id   uuid := gen_random_uuid();
  parent_id  uuid := gen_random_uuid();
BEGIN
  -- Only insert if these users don't already exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fxrich01@gmail.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token
    ) VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'fxrich01@gmail.com',
      crypt('CRM123#', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Hendrik Tanuwidjaja","role":"admin","avatar":"https://i.pravatar.cc/150?img=12"}'::jsonb,
      false, ''
    );
    INSERT INTO profiles (id, name, role, avatar, child_ids)
    VALUES (admin_id, 'Hendrik Tanuwidjaja', 'admin', 'https://i.pravatar.cc/150?img=12', '[]'::jsonb)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'msjati@gmail.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token
    ) VALUES (
      teacher_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'msjati@gmail.com',
      crypt('Guru123#', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Ms. Jati","role":"teacher","avatar":"https://i.pravatar.cc/150?img=47"}'::jsonb,
      false, ''
    );
    INSERT INTO profiles (id, name, role, avatar, child_ids)
    VALUES (teacher_id, 'Ms. Jati', 'teacher', 'https://i.pravatar.cc/150?img=47', '[]'::jsonb)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kiddymontessori@gmail.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token
    ) VALUES (
      staff_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'kiddymontessori@gmail.com',
      crypt('Staff123#', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Angelina Rini","role":"staff","avatar":"https://i.imgur.com/8XpQSC6.jpeg"}'::jsonb,
      false, ''
    );
    INSERT INTO profiles (id, name, role, avatar, child_ids)
    VALUES (staff_id, 'Angelina Rini', 'staff', 'https://i.imgur.com/8XpQSC6.jpeg', '[]'::jsonb)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'johny01@gmail.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token
    ) VALUES (
      parent_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'johny01@gmail.com',
      crypt('Ortu123#', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Johny Patra","role":"parent","avatar":"https://i.pravatar.cc/150?img=33","child_ids":["s1","s2"]}'::jsonb,
      false, ''
    );
    INSERT INTO profiles (id, name, role, avatar, child_ids)
    VALUES (parent_id, 'Johny Patra', 'parent', 'https://i.pravatar.cc/150?img=33', '["s1","s2"]'::jsonb)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END;
$$;
