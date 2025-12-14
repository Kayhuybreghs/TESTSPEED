/*
  # Update Contact Submissions - Change to Minimum 5 Words

  1. Changes
    - Drop the old max 5 words constraint
    - Add new constraint for minimum 5 words instead of maximum
    - This allows longer messages while enforcing a minimum length
    
  2. Security
    - Maintains existing RLS policies
    - No changes to data access rules
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'contact_submissions' AND constraint_name = 'contact_submissions_message_word_count_check'
  ) THEN
    ALTER TABLE contact_submissions DROP CONSTRAINT contact_submissions_message_word_count_check;
  END IF;
END $$;

ALTER TABLE contact_submissions ADD CONSTRAINT contact_submissions_message_word_count_check 
  CHECK (array_length(string_to_array(trim(message), ' '), 1) >= 5 AND length(trim(message)) > 0);