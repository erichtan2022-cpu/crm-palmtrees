/*
# Palmtrees Montessori CRM — Core Schema

## Overview
Creates all 7 core tables for the Palmtrees Montessori CRM application:
students, parents, leads, events, messages, waitlist, volunteers.

## Tables Created

### 1. students
Stores each enrolled student's profile, attendance log, Montessori milestones,
and teacher observations. Complex fields (attendance, milestones, observations,
allergies, parent_ids) are stored as JSONB arrays for flexibility.

Columns:
- id (text, primary key) — app-generated ID
- name (text) — student full name
- photo (text) — avatar URL
- age (int) — current age in years
- dob (text) — date of birth (YYYY-MM-DD string)
- enrollment_date (text) — enrollment date string
- classroom (text) — Toddler | Primary | Lower Elementary | Upper Elementary
- medical_info (text) — free-text medical notes
- allergies (jsonb) — array of allergy strings
- emergency_contact (text) — emergency contact name
- emergency_phone (text) — emergency contact phone
- parent_ids (jsonb) — array of parent IDs linked to this student
- status (text) — active | inactive
- attendance (jsonb) — array of daily attendance objects
- milestones (jsonb) — array of Montessori milestone objects
- observations (jsonb) — array of teacher observation objects
- created_at (timestamptz)

### 2. parents
Stores parent/guardian contact information and their linked children.

Columns:
- id (text, primary key)
- name (text)
- email (text)
- phone (text)
- relation (text) — Father | Mother | Guardian etc.
- child_ids (jsonb) — array of student IDs
- preferred_channel (text) — email | sms | whatsapp
- privacy_consent (boolean)
- avatar (text) — avatar URL
- created_at (timestamptz)

### 3. leads
Tracks prospective families through the enrollment pipeline.

Columns:
- id (text, primary key)
- parent_name (text)
- child_name (text)
- child_age (int)
- email (text)
- phone (text)
- source (text) — Website | Referral | Instagram | Google Ads | Walk-in
- status (text) — Inquiry | Tour Scheduled | Tour Completed | Applied | Enrolled
- inquiry_date (text)
- tour_date (text, nullable)
- notes (text)
- follow_up_date (text, nullable)
- created_at (timestamptz)

### 4. events
School-wide calendar events.

Columns:
- id (text, primary key)
- title (text)
- date (text) — YYYY-MM-DD
- time (text) — HH:MM
- type (text) — school | class | conference | holiday
- classroom (text, nullable) — which class the event is for
- description (text)
- created_at (timestamptz)

### 5. messages
Log of all outbound communications (email, SMS, WhatsApp).

Columns:
- id (text, primary key)
- to_recipient (text) — recipient name or email
- subject (text)
- channel (text) — email | sms | whatsapp
- date (text)
- status (text) — sent | delivered | read
- preview (text) — short preview text
- created_at (timestamptz)

### 6. waitlist
Families waiting for placement, with drag-and-drop ordering via position.

Columns:
- id (text, primary key)
- child_name (text)
- parent_name (text)
- age (int)
- desired_class (text)
- join_date (text)
- priority (text) — high | medium | low
- notes (text)
- position (int) — ordering position for drag-to-reorder
- created_at (timestamptz)

### 7. volunteers
Parent volunteers, their skills, logged hours, and upcoming events.

Columns:
- id (text, primary key)
- name (text)
- parent (text) — parent name label
- skills (jsonb) — array of skill strings
- hours (int) — total volunteer hours
- upcoming_event (text, nullable)
- created_at (timestamptz)

## Security
- RLS enabled on all 7 tables.
- All policies use TO anon, authenticated because the app currently uses a
  custom login flow (not Supabase Auth), so the frontend runs as the anon role.
- USING (true) / WITH CHECK (true) is intentional here: this is a single-tenant
  school admin system — all staff share the same data and there is no per-row
  ownership requirement at the database level.

## Notes
- All ID columns are text to preserve existing 's1', 'u4', 'l123' style IDs
  used in seed data and the existing codebase.
- JSONB columns allow flexible nested data without requiring junction tables
  for the relatively small record counts typical in a school CRM.
*/

-- ============================================================
-- STUDENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id text PRIMARY KEY,
  name text NOT NULL,
  photo text NOT NULL DEFAULT '',
  age int NOT NULL DEFAULT 0,
  dob text NOT NULL DEFAULT '',
  enrollment_date text NOT NULL DEFAULT '',
  classroom text NOT NULL DEFAULT 'Primary',
  medical_info text NOT NULL DEFAULT '',
  allergies jsonb NOT NULL DEFAULT '[]'::jsonb,
  emergency_contact text NOT NULL DEFAULT '',
  emergency_phone text NOT NULL DEFAULT '',
  parent_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  attendance jsonb NOT NULL DEFAULT '[]'::jsonb,
  milestones jsonb NOT NULL DEFAULT '[]'::jsonb,
  observations jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_students" ON students;
CREATE POLICY "anon_select_students" ON students FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_students" ON students;
CREATE POLICY "anon_insert_students" ON students FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_students" ON students;
CREATE POLICY "anon_update_students" ON students FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_students" ON students;
CREATE POLICY "anon_delete_students" ON students FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- PARENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS parents (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  relation text NOT NULL DEFAULT 'Parent',
  child_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  preferred_channel text NOT NULL DEFAULT 'email',
  privacy_consent boolean NOT NULL DEFAULT false,
  avatar text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE parents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_parents" ON parents;
CREATE POLICY "anon_select_parents" ON parents FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_parents" ON parents;
CREATE POLICY "anon_insert_parents" ON parents FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_parents" ON parents;
CREATE POLICY "anon_update_parents" ON parents FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_parents" ON parents;
CREATE POLICY "anon_delete_parents" ON parents FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id text PRIMARY KEY,
  parent_name text NOT NULL,
  child_name text NOT NULL,
  child_age int NOT NULL DEFAULT 0,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'Website',
  status text NOT NULL DEFAULT 'Inquiry',
  inquiry_date text NOT NULL DEFAULT '',
  tour_date text,
  notes text NOT NULL DEFAULT '',
  follow_up_date text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_leads" ON leads;
CREATE POLICY "anon_select_leads" ON leads FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_leads" ON leads;
CREATE POLICY "anon_update_leads" ON leads FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_leads" ON leads;
CREATE POLICY "anon_delete_leads" ON leads FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id text PRIMARY KEY,
  title text NOT NULL,
  date text NOT NULL DEFAULT '',
  time text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'school',
  classroom text,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_events" ON events;
CREATE POLICY "anon_select_events" ON events FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events" ON events FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_events" ON events;
CREATE POLICY "anon_update_events" ON events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_events" ON events;
CREATE POLICY "anon_delete_events" ON events FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id text PRIMARY KEY,
  to_recipient text NOT NULL,
  subject text NOT NULL,
  channel text NOT NULL DEFAULT 'email',
  date text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'sent',
  preview text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_messages" ON messages;
CREATE POLICY "anon_select_messages" ON messages FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages" ON messages FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_messages" ON messages;
CREATE POLICY "anon_update_messages" ON messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_messages" ON messages;
CREATE POLICY "anon_delete_messages" ON messages FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- WAITLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS waitlist (
  id text PRIMARY KEY,
  child_name text NOT NULL,
  parent_name text NOT NULL,
  age int NOT NULL DEFAULT 0,
  desired_class text NOT NULL DEFAULT '',
  join_date text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'medium',
  notes text NOT NULL DEFAULT '',
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_waitlist" ON waitlist;
CREATE POLICY "anon_select_waitlist" ON waitlist FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_waitlist" ON waitlist;
CREATE POLICY "anon_insert_waitlist" ON waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_waitlist" ON waitlist;
CREATE POLICY "anon_update_waitlist" ON waitlist FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_waitlist" ON waitlist;
CREATE POLICY "anon_delete_waitlist" ON waitlist FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- VOLUNTEERS
-- ============================================================
CREATE TABLE IF NOT EXISTS volunteers (
  id text PRIMARY KEY,
  name text NOT NULL,
  parent text NOT NULL DEFAULT '',
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  hours int NOT NULL DEFAULT 0,
  upcoming_event text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_volunteers" ON volunteers;
CREATE POLICY "anon_select_volunteers" ON volunteers FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_volunteers" ON volunteers;
CREATE POLICY "anon_insert_volunteers" ON volunteers FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_volunteers" ON volunteers;
CREATE POLICY "anon_update_volunteers" ON volunteers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_volunteers" ON volunteers;
CREATE POLICY "anon_delete_volunteers" ON volunteers FOR DELETE TO anon, authenticated USING (true);
