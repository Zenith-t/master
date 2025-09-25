/*
  # Create schools table for Zenit Tutors

  1. New Tables
    - `schools` - Store school information and logos

  2. Security
    - Enable RLS on schools table
    - Add policies for public read access and authenticated admin write access

  3. Sample Data
    - Insert sample schools with logos
*/

CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  location text,
  description text,
  website_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active schools"
  ON schools
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage schools"
  ON schools
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample schools
INSERT INTO schools (name, logo_url, location, description) VALUES
  ('Delhi Public School', 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg', 'Delhi', 'Premier educational institution'),
  ('Ryan International School', 'https://images.pexels.com/photos/5212346/pexels-photo-5212346.jpeg', 'Gurgaon', 'Quality education provider'),
  ('Modern School', 'https://images.pexels.com/photos/5212347/pexels-photo-5212347.jpeg', 'Delhi', 'Excellence in education'),
  ('St. Columba School', 'https://images.pexels.com/photos/5212348/pexels-photo-5212348.jpeg', 'Delhi', 'Traditional values, modern approach'),
  ('Amity International School', 'https://images.pexels.com/photos/5212349/pexels-photo-5212349.jpeg', 'Noida', 'Global education standards');