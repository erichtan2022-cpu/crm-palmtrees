/*
# Fix missing auth.identities records for all seeded users (corrected)

Inserts identity rows (provider = 'email') for all seeded users
so Supabase Auth can validate signInWithPassword calls.
Uses gen_random_uuid() for the identity id column (uuid type).
ON CONFLICT DO NOTHING makes this idempotent.
*/

DO $$
DECLARE
  u RECORD;
BEGIN
  FOR u IN
    SELECT id, email FROM auth.users
    WHERE email IN (
      'info@palmtreesmontessori.com',
      'fxrich01@gmail.com',
      'msjati@gmail.com',
      'kiddymontessori@gmail.com',
      'johny01@gmail.com'
    )
  LOOP
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      u.id,
      u.email,
      jsonb_build_object('sub', u.id::text, 'email', u.email),
      'email',
      now(),
      now(),
      now()
    )
    ON CONFLICT (provider, provider_id) DO NOTHING;
  END LOOP;
END;
$$;
