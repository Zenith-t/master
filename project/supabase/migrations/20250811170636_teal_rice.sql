/*
  # Initial Schema Setup for Healthcare Website

  1. New Tables
    - `slider_images` - Store homepage slider images
    - `clinics` - Store clinic listings with contact info
    - `hospitals` - Store hospital listings with contact info  
    - `diagnostic_centers` - Store diagnostic center listings with contact info

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access and authenticated admin write access

  3. Sample Data
    - Insert default slider images
    - Insert sample listings for each category
*/

-- Create slider_images table
CREATE TABLE IF NOT EXISTS slider_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  experience integer DEFAULT 0,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  phone text,
  address text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  experience integer DEFAULT 0,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  phone text,
  address text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create diagnostic_centers table
CREATE TABLE IF NOT EXISTS diagnostic_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  experience integer DEFAULT 0,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  phone text,
  address text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE slider_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_centers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read slider images"
  ON slider_images FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can read clinics"
  ON clinics FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can read hospitals"
  ON hospitals FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can read diagnostic centers"
  ON diagnostic_centers FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create policies for authenticated users to manage data
CREATE POLICY "Authenticated users can manage slider images"
  ON slider_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage clinics"
  ON clinics FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage hospitals"
  ON hospitals FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage diagnostic centers"
  ON diagnostic_centers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample slider images
INSERT INTO slider_images (title, image_url, is_active) VALUES
  ('Quality Healthcare Services', 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg', true),
  ('Expert Medical Care', 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg', true),
  ('Modern Medical Equipment', 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg', true);

-- Insert sample clinics
INSERT INTO clinics (name, specialization, experience, rating, phone, address) VALUES
  ('City Skin Clinic', 'Dermatologist', 8, 5, '+91-9876543210', 'Sector 15, Gurgaon'),
  ('Family Care Clinic', 'General Physician', 12, 4, '+91-9876543211', 'Model Town, Delhi'),
  ('ENT Specialist Center', 'ENT', 6, 5, '+91-9876543212', 'Lajpat Nagar, Delhi');

-- Insert sample hospitals
INSERT INTO hospitals (name, specialization, experience, rating, phone, address) VALUES
  ('Metro Heart Hospital', 'Surgeon', 15, 5, '+91-9876543213', 'Connaught Place, Delhi'),
  ('General Care Hospital', 'General Physician', 20, 4, '+91-9876543214', 'Karol Bagh, Delhi'),
  ('Skin & Beauty Hospital', 'Dermatologist', 10, 5, '+91-9876543215', 'Vasant Kunj, Delhi');

-- Insert sample diagnostic centers
INSERT INTO diagnostic_centers (name, specialization, experience, rating, phone, address, image_url) VALUES
  ('Advanced X-Ray Center', 'X-RAY', 5, 5, '+91-9876543216', 'Rajouri Garden, Delhi', 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg'),
  ('MRI Scan Center', 'MRI', 8, 4, '+91-9876543217', 'Dwarka, Delhi', 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg'),
  ('Ultrasound Clinic', 'Ultrasound', 6, 5, '+91-9876543218', 'Rohini, Delhi', 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg');