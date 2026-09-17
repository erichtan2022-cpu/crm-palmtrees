/*
# Migrate classroom values to new program categories

1. Updated data
- students.classroom: remap old program names to new ones:
    Toddler          → Preschool
    Primary          → Kindergarten B  (Primary was 3-6; closest new bucket is K-B 5-6)
    Lower Elementary → Lower Elementary (unchanged)
    Upper Elementary → Upper Elementary (unchanged)
- students.classroom default changed from 'Primary' to 'Preschool'.
2. Security
- No policy changes. RLS already enabled; existing policies apply to the column.
*/

UPDATE students SET classroom = 'Preschool' WHERE classroom = 'Toddler';
UPDATE students SET classroom = 'Kindergarten B' WHERE classroom = 'Primary';

ALTER TABLE students ALTER COLUMN classroom SET DEFAULT 'Preschool';
