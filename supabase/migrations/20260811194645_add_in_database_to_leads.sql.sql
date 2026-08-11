ALTER TABLE leads ADD COLUMN IF NOT EXISTS in_database boolean NOT NULL DEFAULT false;

-- Mark leads that were previously imported (old notes-based approach) as both imported and in_database
UPDATE leads SET imported = true, in_database = true
WHERE notes LIKE '%[Imported to Student & Family DB]%' AND imported = false;
