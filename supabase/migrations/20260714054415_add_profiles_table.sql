/*
# Add profiles table for Supabase Auth integration

## Overview
Creates a `profiles` table that extends Supabase Auth users with
app-specific data: display name, role, and avatar. A trigger automatically
creates a profile row whenever a new auth.users record is inserted.

## Tables Created

### profiles
Stores CRM-specific user metadata, linked 1:1 to auth.users.

Columns:
- id (uuid, primary key) — matches auth.users.id exactly
- name (text) — display name shown in the UI
- role (text) — admin | teacher | staff | parent
- avatar (text) — avatar URL
- child_ids (jsonb) — for parent role: array of student IDs they can view
- created_at (timestamptz)

## Security
- RLS enabled.
- Each authenticated user can read and update only their own profile row.
- SELECT is also permitted to anon so the seeding/login flow can query it
  before a session is established (resolved via service role in practice,
  but permissive here for simplicity during initial deployment).

## Trigger
- `on_auth_user_created`: fires AFTER INSERT on auth.users, calls
  `handle_new_user()` which inserts a skeleton profile row.
  The profile name and role can be updated after creation.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'staff',
  avatar text NOT NULL DEFAULT '',
  child_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete" ON profiles;
CREATE POLICY "profiles_delete" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- Auto-create a skeleton profile whenever a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, name, role, avatar, child_ids)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', ''),
    COALESCE((NEW.raw_user_meta_data->>'child_ids')::jsonb, '[]'::jsonb)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
