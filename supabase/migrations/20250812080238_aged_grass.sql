/*
  # Create blogs system for Health Services and Zenit Tutors

  1. New Tables
    - `blogs`
      - `id` (uuid, primary key)
      - `title` (text, SEO optimized title)
      - `slug` (text, URL-friendly slug)
      - `content` (text, blog content)
      - `excerpt` (text, short description for SEO)
      - `featured_image` (text, main blog image)
      - `category` (text, 'health' or 'tutors')
      - `meta_title` (text, SEO meta title)
      - `meta_description` (text, SEO meta description)
      - `keywords` (text, SEO keywords)
      - `is_published` (boolean, publish status)
      - `author` (text, author name)
      - `reading_time` (integer, estimated reading time)
      - `views` (integer, view count)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `blogs` table
    - Add policies for public read access and authenticated write access
*/

CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  category text NOT NULL CHECK (category IN ('health', 'tutors')),
  meta_title text,
  meta_description text,
  keywords text,
  is_published boolean DEFAULT false,
  author text DEFAULT 'Admin',
  reading_time integer DEFAULT 5,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blogs"
  ON blogs
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Authenticated users can manage blogs"
  ON blogs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample blog posts
INSERT INTO blogs (title, slug, content, excerpt, category, meta_title, meta_description, keywords, is_published, reading_time) VALUES
(
  'Top 10 Health Tips for Better Living',
  'top-10-health-tips-better-living',
  'Living a healthy lifestyle is essential for overall well-being. Here are the top 10 health tips that can transform your life:

1. **Stay Hydrated**: Drink at least 8 glasses of water daily to keep your body functioning optimally.

2. **Regular Exercise**: Aim for at least 30 minutes of physical activity daily to maintain cardiovascular health.

3. **Balanced Diet**: Include fruits, vegetables, whole grains, and lean proteins in your daily meals.

4. **Adequate Sleep**: Get 7-9 hours of quality sleep each night for proper recovery and mental health.

5. **Stress Management**: Practice meditation, yoga, or deep breathing exercises to manage stress effectively.

6. **Regular Check-ups**: Visit your healthcare provider regularly for preventive care and early detection.

7. **Limit Processed Foods**: Reduce consumption of processed and sugary foods to maintain optimal health.

8. **Social Connections**: Maintain strong relationships and social connections for mental well-being.

9. **Avoid Smoking and Excessive Alcohol**: These habits can significantly impact your long-term health.

10. **Stay Positive**: Maintain a positive mindset and practice gratitude daily.

Following these simple yet effective tips can lead to a healthier, happier life. Remember, small changes can make a big difference in your overall health journey.',
  'Discover the top 10 essential health tips that can transform your lifestyle and improve your overall well-being. Expert advice for better living.',
  'health',
  'Top 10 Health Tips for Better Living | Zenith Health',
  'Discover essential health tips for better living. Expert advice on nutrition, exercise, sleep, and wellness from Zenith Health professionals.',
  'health tips, wellness, healthy lifestyle, nutrition, exercise, healthcare, better living, wellness tips',
  true,
  8
),
(
  'Understanding Different Medical Specializations',
  'understanding-medical-specializations',
  'Medical specializations play a crucial role in providing targeted healthcare. Understanding different specializations can help you choose the right healthcare provider for your needs.

## Common Medical Specializations:

### **Dermatology**
Dermatologists specialize in skin, hair, and nail conditions. They treat everything from acne to skin cancer.

### **General Medicine**
General physicians provide comprehensive healthcare and are often your first point of contact for medical concerns.

### **ENT (Ear, Nose, Throat)**
ENT specialists diagnose and treat conditions related to the ear, nose, throat, and related structures.

### **Surgery**
Surgeons perform operative procedures to treat diseases, injuries, and deformities.

## Choosing the Right Specialist

When selecting a healthcare provider, consider:
- Your specific health concern
- The specialist''s experience and qualifications
- Location and accessibility
- Insurance coverage
- Patient reviews and recommendations

## Our Network of Specialists

At Zenith Health, we have a comprehensive network of qualified specialists across all major medical fields. Our team is committed to providing exceptional care tailored to your individual needs.',
  'Learn about different medical specializations and how to choose the right healthcare provider for your specific needs.',
  'health',
  'Understanding Medical Specializations | Zenith Health',
  'Learn about different medical specializations including dermatology, general medicine, ENT, and surgery. Find the right specialist for your healthcare needs.',
  'medical specializations, dermatology, general medicine, ENT, surgery, healthcare providers, medical specialists',
  true,
  6
),
(
  'The Importance of Regular Health Check-ups',
  'importance-regular-health-checkups',
  'Regular health check-ups are fundamental to maintaining good health and preventing serious medical conditions. Here''s why they matter:

## Benefits of Regular Check-ups

### **Early Detection**
Many health conditions show no symptoms in their early stages. Regular screenings can detect issues before they become serious.

### **Prevention is Better Than Cure**
Preventive care helps identify risk factors and implement lifestyle changes to prevent diseases.

### **Cost-Effective Healthcare**
Early detection and prevention are more cost-effective than treating advanced diseases.

### **Peace of Mind**
Regular check-ups provide reassurance about your health status and help address any concerns.

## What to Expect During a Check-up

- **Vital Signs**: Blood pressure, heart rate, temperature, and weight measurements
- **Blood Tests**: Cholesterol, blood sugar, and other important markers
- **Physical Examination**: Comprehensive body examination
- **Screening Tests**: Age and gender-appropriate screenings
- **Vaccinations**: Updates on necessary immunizations

## Recommended Frequency

- **Ages 18-30**: Every 2-3 years
- **Ages 30-40**: Every 2 years
- **Ages 40+**: Annually

## Book Your Check-up Today

Don''t wait for symptoms to appear. Schedule your regular health check-up with our experienced healthcare professionals at Zenith Health.',
  'Discover why regular health check-ups are essential for maintaining good health and preventing serious medical conditions.',
  'health',
  'Importance of Regular Health Check-ups | Zenith Health',
  'Learn why regular health check-ups are crucial for early detection, prevention, and maintaining optimal health. Schedule your check-up today.',
  'health checkups, preventive care, early detection, health screening, medical examination, healthcare',
  true,
  7
),
(
  'Effective Study Techniques for Better Academic Performance',
  'effective-study-techniques-academic-performance',
  'Academic success requires more than just hard work – it requires smart study techniques. Here are proven methods to enhance your learning:

## Top Study Techniques

### **1. Active Learning**
Engage with the material through:
- Taking detailed notes
- Asking questions
- Discussing concepts with peers
- Teaching others what you''ve learned

### **2. Spaced Repetition**
Review material at increasing intervals to improve long-term retention:
- Day 1: Learn new material
- Day 3: First review
- Day 7: Second review
- Day 21: Third review

### **3. The Pomodoro Technique**
Study in focused 25-minute intervals followed by 5-minute breaks:
- Improves concentration
- Prevents mental fatigue
- Increases productivity

### **4. Mind Mapping**
Create visual representations of information to:
- Organize complex topics
- Show relationships between concepts
- Improve memory retention

### **5. Practice Testing**
Regular self-testing helps:
- Identify knowledge gaps
- Improve recall ability
- Build confidence

## Creating an Optimal Study Environment

- **Quiet Space**: Minimize distractions
- **Good Lighting**: Reduce eye strain
- **Comfortable Seating**: Maintain good posture
- **Organized Materials**: Keep everything within reach

## Time Management Tips

- Set specific study goals
- Create a study schedule
- Prioritize difficult subjects
- Take regular breaks
- Maintain work-life balance

## Get Expert Tutoring Support

At Zenit Tutors, our experienced educators can help you implement these techniques and achieve your academic goals.',
  'Master effective study techniques to improve your academic performance and achieve better learning outcomes.',
  'tutors',
  'Effective Study Techniques for Academic Success | Zenit Tutors',
  'Discover proven study techniques including active learning, spaced repetition, and time management strategies for better academic performance.',
  'study techniques, academic performance, learning strategies, education, tutoring, study tips, exam preparation',
  true,
  9
),
(
  'Choosing the Right Tutor for Your Child',
  'choosing-right-tutor-for-child',
  'Finding the perfect tutor for your child is crucial for their academic success. Here''s a comprehensive guide to help you make the right choice:

## Key Factors to Consider

### **1. Subject Expertise**
Ensure the tutor has:
- Strong knowledge in the specific subject
- Relevant educational background
- Experience teaching the curriculum
- Up-to-date knowledge of exam patterns

### **2. Teaching Style**
Look for tutors who:
- Adapt to different learning styles
- Use interactive teaching methods
- Provide personalized attention
- Make learning engaging and fun

### **3. Experience and Qualifications**
Consider:
- Years of teaching experience
- Educational qualifications
- Track record of student success
- Specialized training in tutoring

### **4. Communication Skills**
A good tutor should:
- Explain concepts clearly
- Be patient and encouraging
- Provide regular progress updates
- Maintain open communication with parents

## Red Flags to Avoid

- Lack of proper credentials
- Poor communication skills
- Inflexible teaching methods
- No progress tracking system
- Unrealistic promises

## Benefits of Professional Tutoring

### **Academic Improvement**
- Better grades and test scores
- Improved understanding of concepts
- Enhanced problem-solving skills
- Increased confidence in studies

### **Personal Development**
- Better study habits
- Time management skills
- Critical thinking abilities
- Self-motivation and discipline

## Our Tutoring Approach at Zenit

At Zenit Tutors, we provide:
- Qualified and experienced tutors
- Personalized learning plans
- Regular progress assessments
- Flexible scheduling options
- Comprehensive subject coverage

## Making the Final Decision

- Schedule a trial session
- Assess compatibility with your child
- Check references and reviews
- Discuss goals and expectations
- Ensure clear communication channels

Choose Zenit Tutors for professional, reliable, and effective tutoring services that help your child reach their full potential.',
  'Learn how to choose the perfect tutor for your child with expert tips on qualifications, teaching styles, and what to look for.',
  'tutors',
  'How to Choose the Right Tutor for Your Child | Zenit Tutors',
  'Expert guide on selecting the perfect tutor for your child. Learn about qualifications, teaching styles, and key factors to consider.',
  'tutoring, education, child development, academic support, learning, private tutor, educational guidance',
  true,
  10
);