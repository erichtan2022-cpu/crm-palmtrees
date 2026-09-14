/*
# Add child_dob column to leads table

1. Modified Tables
- `leads`: add `child_dob` (text, nullable) — child's date of birth in YYYY-MM-DD format.
  Stored alongside child_age so a lead can carry the same DOB that the Student
  record uses when the lead is enrolled via "Input to DB".
2. Security
- No policy changes. RLS already enabled on `leads`; existing anon/authenticated
  CRUD policies continue to apply to the new column automatically.
*/

ALTER TABLE leads ADD COLUMN IF NOT EXISTS child_dob text;
