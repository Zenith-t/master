-- =====================================================
-- ZENITH TUTORS - HEALTHCARE PLUS DATABASE BACKUP
-- Generated on: 2025-01-15
-- Database: Supabase PostgreSQL
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: slider_images
-- =====================================================
CREATE TABLE IF NOT EXISTS public.slider_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    image_url text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.slider_images
    ADD CONSTRAINT slider_images_pkey PRIMARY KEY (id);

-- Enable RLS
ALTER TABLE public.slider_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read slider images" ON public.slider_images FOR SELECT TO anon, authenticated USING ((is_active = true));
CREATE POLICY "Authenticated users can manage slider images" ON public.slider_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: clinics
-- =====================================================
CREATE TABLE IF NOT EXISTS public.clinics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    specialization text NOT NULL,
    experience integer DEFAULT 0,
    rating integer DEFAULT 5,
    phone text,
    address text,
    image_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_rating_check CHECK (((rating >= 1) AND (rating <= 5)));

-- Enable RLS
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read clinics" ON public.clinics FOR SELECT TO anon, authenticated USING ((is_active = true));
CREATE POLICY "Authenticated users can manage clinics" ON public.clinics FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: hospitals
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hospitals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    specialization text NOT NULL,
    experience integer DEFAULT 0,
    rating integer DEFAULT 5,
    phone text,
    address text,
    image_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_rating_check CHECK (((rating >= 1) AND (rating <= 5)));

-- Enable RLS
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read hospitals" ON public.hospitals FOR SELECT TO anon, authenticated USING ((is_active = true));
CREATE POLICY "Authenticated users can manage hospitals" ON public.hospitals FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: diagnostic_centers
-- =====================================================
CREATE TABLE IF NOT EXISTS public.diagnostic_centers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    specialization text NOT NULL,
    experience integer DEFAULT 0,
    rating integer DEFAULT 5,
    phone text,
    address text,
    image_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.diagnostic_centers
    ADD CONSTRAINT diagnostic_centers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.diagnostic_centers
    ADD CONSTRAINT diagnostic_centers_rating_check CHECK (((rating >= 1) AND (rating <= 5)));

-- Enable RLS
ALTER TABLE public.diagnostic_centers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read diagnostic centers" ON public.diagnostic_centers FOR SELECT TO anon, authenticated USING ((is_active = true));
CREATE POLICY "Authenticated users can manage diagnostic centers" ON public.diagnostic_centers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: teachers
-- =====================================================
CREATE TABLE IF NOT EXISTS public.teachers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    qualifications text NOT NULL,
    work_experience integer DEFAULT 0,
    specialization text NOT NULL,
    school_name text,
    photo_url text,
    phone text,
    email text,
    rating integer DEFAULT 5,
    hourly_rate integer DEFAULT 500,
    location text,
    bio text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_rating_check CHECK (((rating >= 1) AND (rating <= 5)));

-- Enable RLS
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active teachers" ON public.teachers FOR SELECT TO anon, authenticated USING ((is_active = true));
CREATE POLICY "Authenticated users can manage teachers" ON public.teachers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: schools
-- =====================================================
CREATE TABLE IF NOT EXISTS public.schools (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    logo_url text,
    location text,
    description text,
    website_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);

-- Enable RLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active schools" ON public.schools FOR SELECT TO anon, authenticated USING ((is_active = true));
CREATE POLICY "Authenticated users can manage schools" ON public.schools FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: school_jobs
-- =====================================================
CREATE TABLE IF NOT EXISTS public.school_jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    school_name text NOT NULL,
    location text NOT NULL,
    job_type text DEFAULT 'Full-time'::text,
    subjects text NOT NULL,
    qualifications_required text NOT NULL,
    experience_required integer DEFAULT 0,
    salary_range text,
    description text,
    contact_phone text,
    contact_email text,
    application_deadline date,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.school_jobs
    ADD CONSTRAINT school_jobs_pkey PRIMARY KEY (id);

-- Enable RLS
ALTER TABLE public.school_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active school jobs" ON public.school_jobs FOR SELECT TO anon, authenticated USING ((is_active = true));
CREATE POLICY "Authenticated users can manage school jobs" ON public.school_jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: home_tuition_jobs
-- =====================================================
CREATE TABLE IF NOT EXISTS public.home_tuition_jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    student_class text NOT NULL,
    subjects text NOT NULL,
    location text NOT NULL,
    preferred_gender text DEFAULT 'Any'::text,
    experience_required integer DEFAULT 0,
    hourly_rate integer,
    schedule text,
    description text,
    contact_phone text,
    contact_name text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.home_tuition_jobs
    ADD CONSTRAINT home_tuition_jobs_pkey PRIMARY KEY (id);

-- Enable RLS
ALTER TABLE public.home_tuition_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active home tuition jobs" ON public.home_tuition_jobs FOR SELECT TO anon, authenticated USING ((is_active = true));
CREATE POLICY "Authenticated users can manage home tuition jobs" ON public.home_tuition_jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: tutor_banners
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tutor_banners (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    image_url text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.tutor_banners
    ADD CONSTRAINT tutor_banners_pkey PRIMARY KEY (id);

-- Enable RLS
ALTER TABLE public.tutor_banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active tutor banners" ON public.tutor_banners FOR SELECT TO anon, authenticated USING ((is_active = true));
CREATE POLICY "Authenticated users can manage tutor banners" ON public.tutor_banners FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: blogs
-- =====================================================
-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS public.blogs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    featured_image text,
    category text NOT NULL,
    meta_title text,
    meta_description text,
    keywords text,
    is_published boolean DEFAULT false,
    author text DEFAULT 'Admin'::text,
    reading_time integer DEFAULT 5,
    views integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_slug_key UNIQUE (slug);

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_category_check CHECK ((category = ANY (ARRAY['health'::text, 'tutors'::text])));

-- Create trigger for updated_at
CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON public.blogs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read published blogs" ON public.blogs FOR SELECT TO anon, authenticated USING ((is_published = true));
CREATE POLICY "Authenticated users can manage blogs" ON public.blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- SAMPLE DATA INSERTS
-- =====================================================

-- Sample Slider Images
INSERT INTO public.slider_images (title, image_url, is_active) VALUES
('Healthcare Excellence', 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg', true),
('Quality Education', 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg', true),
('Professional Services', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg', true)
ON CONFLICT DO NOTHING;

-- Sample Clinics
INSERT INTO public.clinics (name, specialization, experience, rating, phone, address, image_url) VALUES
('City Medical Center', 'General Medicine', 15, 5, '+91 9871199768', 'Central Delhi', 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg'),
('Heart Care Clinic', 'Cardiology', 20, 5, '+91 9871199768', 'South Delhi', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg'),
('Dental Care Plus', 'Dentistry', 12, 4, '+91 9871199768', 'North Delhi', 'https://images.pexels.com/photos/4386468/pexels-photo-4386468.jpeg')
ON CONFLICT DO NOTHING;

-- Sample Hospitals
INSERT INTO public.hospitals (name, specialization, experience, rating, phone, address, image_url) VALUES
('Metro Hospital', 'Multi-Specialty', 25, 5, '+91 9871199768', 'Central Delhi', 'https://images.pexels.com/photos/4386469/pexels-photo-4386469.jpeg'),
('Children Hospital', 'Pediatrics', 18, 5, '+91 9871199768', 'East Delhi', 'https://images.pexels.com/photos/4386470/pexels-photo-4386470.jpeg')
ON CONFLICT DO NOTHING;

-- Sample Diagnostic Centers
INSERT INTO public.diagnostic_centers (name, specialization, experience, rating, phone, address, image_url) VALUES
('Advanced Diagnostics', 'Radiology & Lab', 10, 5, '+91 9871199768', 'West Delhi', 'https://images.pexels.com/photos/4386471/pexels-photo-4386471.jpeg'),
('Quick Lab Services', 'Pathology', 8, 4, '+91 9871199768', 'South Delhi', 'https://images.pexels.com/photos/4386472/pexels-photo-4386472.jpeg')
ON CONFLICT DO NOTHING;

-- Sample Teachers
INSERT INTO public.teachers (name, qualifications, work_experience, specialization, school_name, photo_url, phone, email, rating, hourly_rate, location, bio) VALUES
('Dr. Priya Sharma', 'M.Sc Physics, B.Ed', 8, 'Physics & Mathematics', 'Delhi Public School', 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg', '+91 7678229653', 'priya@example.com', 5, 800, 'Central Delhi', 'Experienced physics teacher with passion for making complex concepts simple.'),
('Prof. Rajesh Kumar', 'M.A English, B.Ed', 12, 'English Literature', 'Modern School', 'https://images.pexels.com/photos/5212318/pexels-photo-5212318.jpeg', '+91 7678229653', 'rajesh@example.com', 5, 700, 'South Delhi', 'English literature expert with focus on creative writing and communication skills.'),
('Ms. Anita Singh', 'M.Sc Chemistry, B.Ed', 6, 'Chemistry', 'Kendriya Vidyalaya', 'https://images.pexels.com/photos/5212319/pexels-photo-5212319.jpeg', '+91 7678229653', 'anita@example.com', 4, 750, 'North Delhi', 'Chemistry teacher specializing in practical experiments and conceptual clarity.')
ON CONFLICT DO NOTHING;

-- Sample Schools
INSERT INTO public.schools (name, logo_url, location, description, website_url) VALUES
('Delhi Public School', 'https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg', 'Multiple Locations', 'Premier educational institution with excellent academic record.', 'https://dpsdelhi.com'),
('Modern School', 'https://images.pexels.com/photos/5212321/pexels-photo-5212321.jpeg', 'Barakhamba Road', 'Historic school known for holistic education and sports excellence.', 'https://modernschool.net')
ON CONFLICT DO NOTHING;

-- Sample School Jobs
INSERT INTO public.school_jobs (title, school_name, location, job_type, subjects, qualifications_required, experience_required, salary_range, description, contact_phone, contact_email) VALUES
('Mathematics Teacher', 'Delhi Public School', 'Vasant Kunj', 'Full-time', 'Mathematics for Classes 9-12', 'M.Sc Mathematics, B.Ed', 3, '₹40,000 - ₹60,000', 'Looking for experienced mathematics teacher for senior secondary classes.', '+91 7678229653', 'hr@dps.edu'),
('English Teacher', 'Modern School', 'Barakhamba Road', 'Full-time', 'English Literature', 'M.A English, B.Ed', 2, '₹35,000 - ₹55,000', 'English teacher required for middle and senior classes.', '+91 7678229653', 'careers@modern.edu')
ON CONFLICT DO NOTHING;

-- Sample Home Tuition Jobs
INSERT INTO public.home_tuition_jobs (title, student_class, subjects, location, preferred_gender, experience_required, hourly_rate, schedule, description, contact_phone, contact_name) VALUES
('Physics Tutor for Class 12', 'Class 12', 'Physics', 'Lajpat Nagar', 'Any', 2, 600, 'Evening 6-8 PM', 'Need experienced physics tutor for CBSE Class 12 board preparation.', '+91 7678229653', 'Mr. Gupta'),
('Mathematics Home Tutor', 'Class 10', 'Mathematics', 'Karol Bagh', 'Female', 1, 500, 'Morning 10-12 PM', 'Looking for female mathematics tutor for Class 10 student.', '+91 7678229653', 'Mrs. Sharma')
ON CONFLICT DO NOTHING;

-- Sample Tutor Banners
INSERT INTO public.tutor_banners (title, image_url, description) VALUES
('Expert Home Tutors', 'https://images.pexels.com/photos/5212322/pexels-photo-5212322.jpeg', 'Find qualified home tutors for all subjects'),
('Online Learning', 'https://images.pexels.com/photos/5212323/pexels-photo-5212323.jpeg', 'Interactive online classes with experienced teachers')
ON CONFLICT DO NOTHING;

-- Sample Blogs
INSERT INTO public.blogs (title, slug, content, excerpt, featured_image, category, meta_title, meta_description, keywords, is_published, author, reading_time, views) VALUES
('10 Tips for Healthy Living', '10-tips-healthy-living', 'Living a healthy lifestyle is essential for overall well-being. Here are 10 practical tips that can help you maintain good health:

## 1. Eat a Balanced Diet
Include plenty of fruits, vegetables, whole grains, and lean proteins in your daily meals. Avoid processed foods and excessive sugar.

## 2. Stay Hydrated
Drink at least 8 glasses of water daily. Proper hydration is crucial for all bodily functions.

## 3. Exercise Regularly
Aim for at least 30 minutes of physical activity daily. This can include walking, jogging, swimming, or any sport you enjoy.

## 4. Get Adequate Sleep
Adults should aim for 7-9 hours of quality sleep each night. Good sleep is essential for physical and mental health.

## 5. Manage Stress
Practice stress-reduction techniques like meditation, deep breathing, or yoga. Chronic stress can lead to various health problems.

## 6. Regular Health Checkups
Visit your doctor regularly for preventive care and early detection of any health issues.

## 7. Avoid Smoking and Limit Alcohol
These habits can significantly impact your health. If you smoke, consider quitting, and drink alcohol in moderation.

## 8. Maintain Social Connections
Strong relationships and social support are important for mental health and overall well-being.

## 9. Practice Good Hygiene
Regular handwashing and maintaining personal hygiene can prevent many illnesses.

## 10. Stay Positive
A positive mindset can improve your immune system and overall health. Practice gratitude and focus on the good things in life.

Remember, small changes in your daily routine can lead to significant improvements in your health over time.', 'Discover 10 essential tips for maintaining a healthy lifestyle and improving your overall well-being.', 'https://images.pexels.com/photos/4386473/pexels-photo-4386473.jpeg', 'health', '10 Essential Tips for Healthy Living | HealthCare Plus', 'Learn 10 practical tips for healthy living including diet, exercise, sleep, and stress management for better overall health.', 'healthy living, health tips, wellness, diet, exercise, sleep, stress management', true, 'Dr. Health Expert', 5, 150),

('Effective Study Techniques for Students', 'effective-study-techniques-students', 'Success in academics requires more than just hard work; it requires smart study techniques. Here are proven methods to enhance your learning:

## 1. Active Reading
Don''t just read passively. Take notes, ask questions, and summarize what you''ve learned in your own words.

## 2. The Pomodoro Technique
Study in focused 25-minute intervals followed by 5-minute breaks. This helps maintain concentration and prevents burnout.

## 3. Create a Study Schedule
Plan your study time in advance. Allocate specific time slots for different subjects and stick to your schedule.

## 4. Use Multiple Learning Styles
Combine visual, auditory, and kinesthetic learning methods. Use diagrams, read aloud, and practice hands-on activities.

## 5. Practice Retrieval
Test yourself regularly without looking at your notes. This strengthens memory and identifies areas that need more work.

## 6. Form Study Groups
Collaborate with classmates to discuss concepts, share notes, and explain topics to each other.

## 7. Eliminate Distractions
Create a quiet, organized study environment. Turn off notifications and keep your phone away during study time.

## 8. Take Care of Your Health
Eat well, exercise regularly, and get enough sleep. A healthy body supports a healthy mind.

## 9. Use Technology Wisely
Leverage educational apps, online resources, and digital tools to enhance your learning experience.

## 10. Review Regularly
Don''t wait until exams to review. Regular revision helps transfer information from short-term to long-term memory.

Remember, different techniques work for different people. Experiment with these methods to find what works best for you.', 'Master these proven study techniques to improve your academic performance and make learning more effective.', 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg', 'tutors', 'Effective Study Techniques for Academic Success | Zenith Tutors', 'Discover proven study techniques and learning strategies to improve academic performance and achieve better results.', 'study techniques, learning methods, academic success, student tips, education, study skills', true, 'Education Specialist', 7, 200)
ON CONFLICT DO NOTHING;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_teachers_active ON public.teachers(is_active);
CREATE INDEX IF NOT EXISTS idx_teachers_specialization ON public.teachers(specialization);
CREATE INDEX IF NOT EXISTS idx_clinics_active ON public.clinics(is_active);
CREATE INDEX IF NOT EXISTS idx_hospitals_active ON public.hospitals(is_active);
CREATE INDEX IF NOT EXISTS idx_diagnostic_centers_active ON public.diagnostic_centers(is_active);

-- =====================================================
-- BACKUP COMPLETE
-- Database: Zenith Tutors - HealthCare Plus
-- Tables: 9 main tables with sample data
-- Features: RLS policies, triggers, indexes
-- =====================================================