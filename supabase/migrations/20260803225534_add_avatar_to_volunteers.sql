/*
# Add Avatar Column to Volunteers

## Overview
Adds an `avatar` text column to the `volunteers` table so volunteer photos
can be uploaded and stored, matching the existing pattern on students/parents.

## Changes
- ALTER TABLE volunteers ADD COLUMN avatar text NOT NULL DEFAULT ''
- Idempotent via DO $$ ... IF NOT EXISTS ... END $$

## Security
- No RLS policy changes needed — existing policies already cover all columns.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'volunteers' AND column_name = 'avatar'
  ) THEN
    ALTER TABLE volunteers ADD COLUMN avatar text NOT NULL DEFAULT '';
  END IF;
END $$;
