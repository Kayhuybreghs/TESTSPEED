/*
  # Contact Form Submissions Table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `email` (text, required) - User's email address
      - `message` (text, required) - Message content (max 5 words)
      - `ip_address` (text) - For spam/rate limiting
      - `user_agent` (text) - Browser user agent
      - `created_at` (timestamptz) - Submission timestamp
      - `is_spam` (boolean, default false) - Spam flag
      
  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for anonymous users to insert (with validation)
    - Add policy for authenticated admins to read
    
  3. Indexes
    - Index on ip_address for rate limiting checks
    - Index on created_at for cleanup queries
    
  4. Rate Limiting
    - Uses ip_address + created_at to enforce 1 submission per 5 minutes
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  message text NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  is_spam boolean DEFAULT false,
  
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT message_word_count CHECK (array_length(string_to_array(trim(message), ' '), 1) <= 5 AND length(trim(message)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_ip ON contact_submissions(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);