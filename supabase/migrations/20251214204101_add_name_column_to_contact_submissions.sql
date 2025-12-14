/*
  # Add name column to contact_submissions

  1. Changes
    - Add `name` column (text, nullable) to store sender's name
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'name'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN name text;
  END IF;
END $$;