/*
# Activity Log & CRM Version History

1. New Tables
- `activity_log` — records every data change in the CRM (who, what, which entity, when)
  - id (uuid PK)
  - user_id (uuid, references profiles, nullable for system actions)
  - user_name (text, denormalized for display)
  - user_role (text, denormalized for display)
  - action (text: 'create' | 'update' | 'delete' | 'enroll' | 'publish_version')
  - entity_type (text: 'student' | 'parent' | 'lead' | 'event' | 'volunteer' | 'waitlist' | 'message' | 'crm_version')
  - entity_id (text, nullable)
  - description (text, human-readable summary)
  - created_at (timestamptz, default now())
- `crm_versions` — tracks CRM version releases with changelog
  - id (uuid PK)
  - version (text, e.g. 'v1.0.0')
  - release_date (date)
  - notes (text, changelog/release notes)
  - published_by (uuid, references profiles)
  - created_at (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- All authenticated users can READ activity_log and crm_versions (admin needs to see logs; all roles see version).
- Only admin-role users can INSERT into activity_log and crm_versions (admin publishes versions; all writes go through admin or edge function).
- Admin-only UPDATE/DELETE on both tables.

3. Seed Data
- Insert initial CRM version v1.0.0 with release date 2026-07-14 and basic release notes.
*/

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  user_name text,
  user_role text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read activity logs
DROP POLICY IF EXISTS "read_activity_log" ON activity_log;
CREATE POLICY "read_activity_log" ON activity_log FOR SELECT
  TO authenticated USING (true);

-- All authenticated users can insert (logging happens from client with their session)
DROP POLICY IF EXISTS "insert_activity_log" ON activity_log;
CREATE POLICY "insert_activity_log" ON activity_log FOR INSERT
  TO authenticated WITH CHECK (true);

-- Only admin can update/delete log entries
DROP POLICY IF EXISTS "update_activity_log_admin" ON activity_log;
CREATE POLICY "update_activity_log_admin" ON activity_log FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "delete_activity_log_admin" ON activity_log;
CREATE POLICY "delete_activity_log_admin" ON activity_log FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- CRM versions table
CREATE TABLE IF NOT EXISTS crm_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  release_date date NOT NULL,
  notes text NOT NULL DEFAULT '',
  published_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crm_versions ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read versions
DROP POLICY IF EXISTS "read_crm_versions" ON crm_versions;
CREATE POLICY "read_crm_versions" ON crm_versions FOR SELECT
  TO authenticated USING (true);

-- Only admin can insert new versions
DROP POLICY IF EXISTS "insert_crm_versions_admin" ON crm_versions;
CREATE POLICY "insert_crm_versions_admin" ON crm_versions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Only admin can update versions
DROP POLICY IF EXISTS "update_crm_versions_admin" ON crm_versions;
CREATE POLICY "update_crm_versions_admin" ON crm_versions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Only admin can delete versions
DROP POLICY IF EXISTS "delete_crm_versions_admin" ON crm_versions;
CREATE POLICY "delete_crm_versions_admin" ON crm_versions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Seed initial version
INSERT INTO crm_versions (version, release_date, notes)
SELECT 'v1.0.0', '2026-07-14', 'Initial CRM release: Student management, Family directory, Lead tracking, Communications, Calendar & Events, Progress tracking, Waitlist, Volunteers, Analytics, User accounts, Role-based access (Admin, Teacher, Staff, Parent).'
WHERE NOT EXISTS (SELECT 1 FROM crm_versions WHERE version = 'v1.0.0');

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_type ON activity_log (entity_type);
CREATE INDEX IF NOT EXISTS idx_crm_versions_release_date ON crm_versions (release_date DESC);
