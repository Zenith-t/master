/*
  # Create Zenit Tutors System

  1. New Tables
    - `teachers` - Teacher profiles from reputed schools
    - `school_jobs` - School job postings  
    - `home_tuition_jobs` - Home tuition job postings
    - `tutor_banners` - Photo banners for tutors section

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access and authenticated user management

  3. Features
    - Teacher profiles with qualifications and experience
    - Job postings with requirements and contact info
    - Photo banner management
    - Category-based organization
*/

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  qualifications text NOT NULL,
  work_experience integer DEFAULT 0,
  specialization text NOT NULL,
  school_name text,
  photo_url text,
  phone text,
  email text,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  hourly_rate integer DEFAULT 500,
  location text,
  bio text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active teachers"
  ON teachers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage teachers"
  ON teachers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- School Jobs table
CREATE TABLE IF NOT EXISTS school_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  school_name text NOT NULL,
  location text NOT NULL,
  job_type text DEFAULT 'Full-time',
  subjects text NOT NULL,
  qualifications_required text NOT NULL,
  experience_required integer DEFAULT 0,
  salary_range text,
  description text,
  contact_phone text,
  contact_email text,
  application_deadline date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE school_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active school jobs"
  ON school_jobs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage school jobs"
  ON school_jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Home Tuition Jobs table
CREATE TABLE IF NOT EXISTS home_tuition_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  student_class text NOT NULL,
  subjects text NOT NULL,
  location text NOT NULL,
  preferred_gender text DEFAULT 'Any',
  experience_required integer DEFAULT 0,
  hourly_rate integer,
  schedule text,
  description text,
  contact_phone text,
  contact_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE home_tuition_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active home tuition jobs"
  ON home_tuition_jobs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage home tuition jobs"
  ON home_tuition_jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tutor Banners table
CREATE TABLE IF NOT EXISTS tutor_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tutor_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active tutor banners"
  ON tutor_banners
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage tutor banners"
  ON tutor_banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);