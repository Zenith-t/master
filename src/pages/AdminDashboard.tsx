import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, Upload, Star, Image, FileText, Eye, User, School } from 'lucide-react';
import { useSupabase } from '../contexts/SupabaseContext';
import ImageUpload from '../components/ImageUpload';

type TabType = 'slider' | 'clinics' | 'hospitals' | 'diagnostic' | 'health-blogs' | 'tutor-blogs' | 'school-jobs' | 'home-tuition' | 'teachers' | 'schools' | 'tutorBanners';

interface FormData {
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  phone: string;
  address: string;
  image_url: string;
}

interface SliderFormData {
  title: string;
  image_url: string;
}

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  category: 'health' | 'tutors';
  meta_title: string;
  meta_description: string;
  keywords: string;
  author: string;
  reading_time: number;
  is_published: boolean;
}

interface SchoolJobFormData {
  title: string;
  school_name: string;
  location: string;
  job_type: string;
  subjects: string;
  qualifications_required: string;
  experience_required: number;
  salary_range: string;
  description: string;
  contact_phone: string;
  contact_email: string;
}

interface HomeTuitionFormData {
  title: string;
  student_class: string;
  subjects: string;
  location: string;
  preferred_gender: string;
  experience_required: number;
  hourly_rate: number;
  schedule: string;
  description: string;
  contact_phone: string;
  contact_name: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { supabase, user } = useSupabase();
  const [activeTab, setActiveTab] = useState<TabType>('slider');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSliderForm, setShowSliderForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState<string | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<string | null>(null);
  const [showSchoolJobForm, setShowSchoolJobForm] = useState(false);
  const [editingSchoolJob, setEditingSchoolJob] = useState<string | null>(null);
  const [showHomeTuitionForm, setShowHomeTuitionForm] = useState(false);
  const [editingHomeTuition, setEditingHomeTuition] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    specialization: '',
    experience: 0,
    rating: 5,
    phone: '',
    address: '',
    image_url: ''
  });

  const [sliderFormData, setSliderFormData] = useState<SliderFormData>({
    title: '',
    image_url: ''
  });

  const [blogFormData, setBlogFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: 'health',
    meta_title: '',
    meta_description: '',
    keywords: '',
    author: 'Admin',
    reading_time: 5,
    is_published: false
  });

  const [schoolJobFormData, setSchoolJobFormData] = useState<SchoolJobFormData>({
    title: '',
    school_name: '',
    location: '',
    job_type: 'Full-time',
    subjects: '',
    qualifications_required: '',
    experience_required: 0,
    salary_range: '',
    description: '',
    contact_phone: '',
    contact_email: ''
  });

  const [homeTuitionFormData, setHomeTuitionFormData] = useState<HomeTuitionFormData>({
    title: '',
    student_class: '',
    subjects: '',
    location: '',
    preferred_gender: 'Any',
    experience_required: 0,
    hourly_rate: 500,
    schedule: '',
    description: '',
    contact_phone: '',
    contact_name: ''
  });

  const [sliderImages, setSliderImages] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [diagnosticCenters, setDiagnosticCenters] = useState<any[]>([]);
  const [healthBlogs, setHealthBlogs] = useState<any[]>([]);
  const [tutorBlogs, setTutorBlogs] = useState<any[]>([]);
  const [schoolJobs, setSchoolJobs] = useState<any[]>([]);
  const [homeTuitionJobs, setHomeTuitionJobs] = useState<any[]>([]);
  
  // Teachers state
  const [teachers, setTeachers] = useState<any[]>([]);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  
  // Schools state
  const [schools, setSchools] = useState<any[]>([]);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [showSchoolForm, setShowSchoolForm] = useState(false);

  // Tutor Banners state
  const [tutorBanners, setTutorBanners] = useState<any[]>([]);
  const [newTutorBanner, setNewTutorBanner] = useState({
    title: '',
    image_url: '',
    description: '',
    is_active: true
  });

  const specializationOptions = {
    clinics: ['Dermatologist', 'General Physician', 'ENT', 'Surgeon'],
    hospitals: ['Dermatologist', 'General Physician', 'ENT', 'Surgeon'],
    diagnostic: ['X-RAY', 'MRI', 'Ultrasound']
  };

  const getTableName = () => {
    switch (activeTab) {
      case 'slider-images': return 'slider_images';
      case 'clinics': return 'clinics';
      case 'hospitals': return 'hospitals';
      case 'diagnostic-centers': return 'diagnostic_centers';
      case 'blogs': return 'blogs';
      case 'teachers': return 'teachers';
      case 'schools': return 'schools';
      case 'school-jobs': return 'school_jobs';
      case 'home-tuition': return 'home_tuition_jobs';
      case 'tutor-banners': return 'tutor_banners';
      default: return 'slider_images';
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/admin');
      return;
    }
    fetchAllData();
    fetchTeachers();
    fetchSchools();
    fetchTutorBanners();
  }, [user, navigate]);

  const fetchAllData = async () => {
    try {
      const [sliderRes, clinicsRes, hospitalsRes, diagnosticRes, healthBlogsRes, tutorBlogsRes, schoolJobsRes, homeTuitionRes] = await Promise.all([
        supabase.from('slider_images').select('*').order('created_at'),
        supabase.from('clinics').select('*').order('created_at'),
        supabase.from('hospitals').select('*').order('created_at'),
        supabase.from('diagnostic_centers').select('*').order('created_at'),
        supabase.from('blogs').select('*').eq('category', 'health').order('created_at', { ascending: false }),
        supabase.from('blogs').select('*').eq('category', 'tutors').order('created_at', { ascending: false }),
        supabase.from('school_jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('home_tuition_jobs').select('*').order('created_at', { ascending: false })
      ]);

      if (sliderRes.data) setSliderImages(sliderRes.data);
      if (clinicsRes.data) setClinics(clinicsRes.data);
      if (hospitalsRes.data) setHospitals(hospitalsRes.data);
      if (diagnosticRes.data) setDiagnosticCenters(diagnosticRes.data);
      if (healthBlogsRes.data) setHealthBlogs(healthBlogsRes.data);
      if (tutorBlogsRes.data) setTutorBlogs(tutorBlogsRes.data);
      if (schoolJobsRes.data) setSchoolJobs(schoolJobsRes.data);
      if (homeTuitionRes.data) setHomeTuitionJobs(homeTuitionRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setSchools(data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const fetchTutorBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('tutor_banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTutorBanners(data);
    } catch (error) {
      console.error('Error fetching tutor banners:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleSliderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSlider) {
        await supabase.from('slider_images').update(sliderFormData).eq('id', editingSlider);
      } else {
        await supabase.from('slider_images').insert([{ ...sliderFormData, is_active: true }]);
      }
      
      resetSliderForm();
      fetchAllData();
    } catch (error) {
      console.error('Error saving slider data:', error);
    }
  };

  const handleSliderEdit = (slider: any) => {
    setSliderFormData({
      title: slider.title || '',
      image_url: slider.image_url || ''
    });
    setEditingSlider(slider.id);
    setShowSliderForm(true);
  };

  const handleSliderDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider image?')) return;
    
    try {
      await supabase.from('slider_images').delete().eq('id', id);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting slider:', error);
    }
  };

  const resetSliderForm = () => {
    setSliderFormData({
      title: '',
      image_url: ''
    });
    setEditingSlider(null);
    setShowSliderForm(false);
  };

  // Blog functions
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const blogData = {
        ...blogFormData,
        slug: blogFormData.slug || generateSlug(blogFormData.title),
        meta_title: blogFormData.meta_title || blogFormData.title,
        meta_description: blogFormData.meta_description || blogFormData.excerpt
      };

      if (editingBlog) {
        await supabase.from('blogs').update(blogData).eq('id', editingBlog);
      } else {
        await supabase.from('blogs').insert([blogData]);
      }
      
      resetBlogForm();
      fetchAllData();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleBlogEdit = (blog: any) => {
    setBlogFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      featured_image: blog.featured_image || '',
      category: blog.category || 'health',
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      keywords: blog.keywords || '',
      author: blog.author || 'Admin',
      reading_time: blog.reading_time || 5,
      is_published: blog.is_published || false
    });
    setEditingBlog(blog.id);
    setShowBlogForm(true);
  };

  const handleBlogDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await supabase.from('blogs').delete().eq('id', id);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const resetBlogForm = () => {
    setBlogFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      category: activeTab === 'health-blogs' ? 'health' : 'tutors',
      meta_title: '',
      meta_description: '',
      keywords: '',
      author: 'Admin',
      reading_time: 5,
      is_published: false
    });
    setEditingBlog(null);
    setShowBlogForm(false);
  };

  // School Job functions
  const handleSchoolJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSchoolJob) {
        await supabase.from('school_jobs').update(schoolJobFormData).eq('id', editingSchoolJob);
      } else {
        await supabase.from('school_jobs').insert([{ ...schoolJobFormData, is_active: true }]);
      }
      
      resetSchoolJobForm();
      fetchAllData();
    } catch (error) {
      console.error('Error saving school job:', error);
    }
  };

  const handleSchoolJobEdit = (job: any) => {
    setSchoolJobFormData({
      title: job.title || '',
      school_name: job.school_name || '',
      location: job.location || '',
      job_type: job.job_type || 'Full-time',
      subjects: job.subjects || '',
      qualifications_required: job.qualifications_required || '',
      experience_required: job.experience_required || 0,
      salary_range: job.salary_range || '',
      description: job.description || '',
      contact_phone: job.contact_phone || '',
      contact_email: job.contact_email || ''
    });
    setEditingSchoolJob(job.id);
    setShowSchoolJobForm(true);
  };

  const handleSchoolJobDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this school job posting?')) return;
    
    try {
      await supabase.from('school_jobs').delete().eq('id', id);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting school job:', error);
    }
  };

  const resetSchoolJobForm = () => {
    setSchoolJobFormData({
      title: '',
      school_name: '',
      location: '',
      job_type: 'Full-time',
      subjects: '',
      qualifications_required: '',
      experience_required: 0,
      salary_range: '',
      description: '',
      contact_phone: '',
      contact_email: ''
    });
    setEditingSchoolJob(null);
    setShowSchoolJobForm(false);
  };

  // Home Tuition functions
  const handleHomeTuitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingHomeTuition) {
        await supabase.from('home_tuition_jobs').update(homeTuitionFormData).eq('id', editingHomeTuition);
      } else {
        await supabase.from('home_tuition_jobs').insert([{ ...homeTuitionFormData, is_active: true }]);
      }
      
      resetHomeTuitionForm();
      fetchAllData();
    } catch (error) {
      console.error('Error saving home tuition job:', error);
    }
  };

  const handleHomeTuitionEdit = (job: any) => {
    setHomeTuitionFormData({
      title: job.title || '',
      student_class: job.student_class || '',
      subjects: job.subjects || '',
      location: job.location || '',
      preferred_gender: job.preferred_gender || 'Any',
      experience_required: job.experience_required || 0,
      hourly_rate: job.hourly_rate || 500,
      schedule: job.schedule || '',
      description: job.description || '',
      contact_phone: job.contact_phone || '',
      contact_name: job.contact_name || ''
    });
    setEditingHomeTuition(job.id);
    setShowHomeTuitionForm(true);
  };

  const handleHomeTuitionDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this home tuition posting?')) return;
    
    try {
      await supabase.from('home_tuition_jobs').delete().eq('id', id);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting home tuition job:', error);
    }
  };

  const resetHomeTuitionForm = () => {
    setHomeTuitionFormData({
      title: '',
      student_class: '',
      subjects: '',
      location: '',
      preferred_gender: 'Any',
      experience_required: 0,
      hourly_rate: 500,
      schedule: '',
      description: '',
      contact_phone: '',
      contact_name: ''
    });
    setEditingHomeTuition(null);
    setShowHomeTuitionForm(false);
  };

  const handleSaveTeacher = async (teacherData: any) => {
    try {
      if (editingTeacher) {
        const { error } = await supabase
          .from('teachers')
          .update(teacherData)
          .eq('id', editingTeacher.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('teachers')
          .insert([teacherData]);
        if (error) throw error;
      }
      
      fetchTeachers();
      setEditingTeacher(null);
      setShowTeacherForm(false);
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Error saving teacher');
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try {
        const { error } = await supabase
          .from('teachers')
          .delete()
          .eq('id', id);
        if (error) throw error;
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Error deleting teacher');
      }
    }
  };

  const handleSaveSchool = async (schoolData: any) => {
    try {
      if (editingSchool) {
        const { error } = await supabase
          .from('schools')
          .update(schoolData)
          .eq('id', editingSchool.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('schools')
          .insert([schoolData]);
        if (error) throw error;
      }
      
      fetchSchools();
      setEditingSchool(null);
      setShowSchoolForm(false);
    } catch (error) {
      console.error('Error saving school:', error);
      alert('Error saving school');
    }
  };

  const handleDeleteSchool = async (id: string) => {
    if (confirm('Are you sure you want to delete this school?')) {
      try {
        const { error } = await supabase
          .from('schools')
          .delete()
          .eq('id', id);
        if (error) throw error;
        fetchSchools();
      } catch (error) {
        console.error('Error deleting school:', error);
        alert('Error deleting school');
      }
    }
  };

  const handleAddTutorBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('tutor_banners')
        .insert([newTutorBanner]);

      if (error) throw error;
      
      setNewTutorBanner({
        title: '',
        image_url: '',
        description: '',
        is_active: true
      });
      fetchTutorBanners();
      alert('Tutor banner added successfully!');
    } catch (error) {
      console.error('Error adding tutor banner:', error);
      alert('Error adding tutor banner');
    }
  };

  const handleDeleteTutorBanner = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        const { error } = await supabase
          .from('tutor_banners')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchTutorBanners();
        alert('Banner deleted successfully!');
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Error deleting banner');
      }
    }
  };

  const handleUpdateTutorBanner = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('tutor_banners')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      fetchTutorBanners();
      alert('Banner updated successfully!');
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Error updating banner');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const table = activeTab === 'clinics' ? 'clinics' : 
                  activeTab === 'hospitals' ? 'hospitals' : 'diagnostic_centers';
    
    try {
      if (editingId) {
        await supabase.from(table).update(formData).eq('id', editingId);
      } else {
        await supabase.from(table).insert([{ ...formData, is_active: true }]);
      }
      
      resetForm();
      fetchAllData();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name || '',
      specialization: item.specialization || '',
      experience: item.experience || 0,
      rating: item.rating || 5,
      phone: item.phone || '',
      address: item.address || '',
      image_url: item.image_url || ''
    });
    setEditingId(item.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const table = activeTab === 'clinics' ? 'clinics' : 
                  activeTab === 'hospitals' ? 'hospitals' : 'diagnostic_centers';
    
    try {
      await supabase.from(table).delete().eq('id', id);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      experience: 0,
      rating: 5,
      phone: '',
      address: '',
      image_url: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'clinics': return clinics;
      case 'hospitals': return hospitals;
      case 'diagnostic': return diagnosticCenters;
      case 'health-blogs': return healthBlogs;
      case 'tutor-blogs': return tutorBlogs;
      case 'school-jobs': return schoolJobs;
      case 'home-tuition': return homeTuitionJobs;
      default: return [];
    }
  };

  const getSpecializationOptions = () => {
    return specializationOptions[activeTab === 'diagnostic' ? 'diagnostic' : activeTab] || [];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Admin</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-800 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-8">
          {[
            { id: 'slider', label: 'Slider Images' },
            { id: 'clinics', label: 'Clinics' },
            { id: 'hospitals', label: 'Hospitals' },
            { id: 'diagnostic', label: 'Diagnostic Centers' },
            { id: 'health-blogs', label: 'Health Blogs' },
            { id: 'tutor-blogs', label: 'Tutor Blogs' },
            { id: 'school-jobs', label: 'School Jobs' },
            { id: 'home-tuition', label: 'Home Tuition' },
            { id: 'teachers', label: 'Teachers' },
            { id: 'schools', label: 'Schools' },
            { id: 'tutorBanners', label: 'Photo Banners' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                setShowAddForm(false);
                resetForm();
              }}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {activeTab === 'slider' ? 'Slider Images' :
               activeTab === 'clinics' ? 'Clinics' :
               activeTab === 'hospitals' ? 'Hospitals' :
               activeTab === 'diagnostic' ? 'Diagnostic Centers' :
               activeTab === 'health-blogs' ? 'Health Blogs' : 
               activeTab === 'tutor-blogs' ? 'Tutor Blogs' :
               activeTab === 'school-jobs' ? 'School Job Postings' :
               activeTab === 'home-tuition' ? 'Home Tuition Postings' :
               activeTab === 'teachers' ? 'Teachers' :
               activeTab === 'schools' ? 'Schools' :
               activeTab === 'tutorBanners' ? 'Photo Banners' : 'Unknown'}
            </h2>
            {activeTab !== 'slider' && !activeTab.includes('blogs') && !activeTab.includes('jobs') && activeTab !== 'home-tuition' && activeTab !== 'teachers' && activeTab !== 'schools' && activeTab !== 'tutorBanners' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </button>
            )}
            {activeTab.includes('blogs') && (
              <button
                onClick={() => setShowBlogForm(!showBlogForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Blog
              </button>
            )}
            {activeTab === 'slider' && (
              <button
                onClick={() => setShowSliderForm(!showSliderForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Slider Image
              </button>
            )}
            {activeTab === 'school-jobs' && (
              <button
                onClick={() => setShowSchoolJobForm(!showSchoolJobForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add School Job
              </button>
            )}
            {activeTab === 'home-tuition' && (
              <button
                onClick={() => setShowHomeTuitionForm(!showHomeTuitionForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Home Tuition
              </button>
            )}
          </div>

          <div className="p-6">
            {activeTab === 'school-jobs' ? (
              <>
                {/* School Job Add/Edit Form */}
                {showSchoolJobForm && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingSchoolJob ? 'Edit' : 'Add New'} School Job Posting
                    </h3>
                    <form onSubmit={handleSchoolJobSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title *
                          </label>
                          <input
                            type="text"
                            value={schoolJobFormData.title}
                            onChange={(e) => setSchoolJobFormData({...schoolJobFormData, title: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Mathematics Teacher"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            School Name *
                          </label>
                          <input
                            type="text"
                            value={schoolJobFormData.school_name}
                            onChange={(e) => setSchoolJobFormData({...schoolJobFormData, school_name: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Delhi Public School"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location *
                          </label>
                          <input
                            type="text"
                            value={schoolJobFormData.location}
                            onChange={(e) => setSchoolJobFormData({...schoolJobFormData, location: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Delhi, Mumbai"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Type
                          </label>
                          <select
                            value={schoolJobFormData.job_type}
                            onChange={(e) => setSchoolJobFormData({...schoolJobFormData, job_type: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subjects *
                          </label>
                          <input
                            type="text"
                            value={schoolJobFormData.subjects}
                            onChange={(e) => setSchoolJobFormData({...schoolJobFormData, subjects: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Mathematics, Physics"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Experience Required (years)
                          </label>
                          <input
                            type="number"
                            value={schoolJobFormData.experience_required}
                            onChange={(e) => setSchoolJobFormData({...schoolJobFormData, experience_required: parseInt(e.target.value)})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Salary Range
                          </label>
                          <input
                            type="text"
                            value={schoolJobFormData.salary_range}
                            onChange={(e) => setSchoolJobFormData({...schoolJobFormData, salary_range: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., ₹25,000 - ₹35,000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Phone
                          </label>
                          <input
                            type="tel"
                            value={schoolJobFormData.contact_phone}
                            onChange={(e) => setSchoolJobFormData({...schoolJobFormData, contact_phone: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="+91-9876543210"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Email
                          </label>
                          <input
                            type="email"
                            value={schoolJobFormData.contact_email}
                            onChange={(e) => setSchoolJobFormData({...schoolJobFormData, contact_email: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="hr@school.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Qualifications Required *
                        </label>
                        <textarea
                          value={schoolJobFormData.qualifications_required}
                          onChange={(e) => setSchoolJobFormData({...schoolJobFormData, qualifications_required: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="e.g., B.Ed, M.Sc Mathematics"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Description
                        </label>
                        <textarea
                          value={schoolJobFormData.description}
                          onChange={(e) => setSchoolJobFormData({...schoolJobFormData, description: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          rows={4}
                          placeholder="Detailed job description..."
                        />
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {editingSchoolJob ? 'Update' : 'Create'} Job Posting
                        </button>
                        <button
                          type="button"
                          onClick={resetSchoolJobForm}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* School Jobs List */}
                <div className="space-y-4">
                  {schoolJobs.length > 0 ? schoolJobs.map((job: any) => (
                    <div key={job.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{job.title}</h4>
                          <p className="text-blue-600 font-medium">{job.school_name}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                            <span>📍 {job.location}</span>
                            <span>📚 {job.subjects}</span>
                            <span>💼 {job.job_type}</span>
                            {job.salary_range && <span>💰 {job.salary_range}</span>}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Experience: {job.experience_required}+ years</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSchoolJobEdit(job)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleSchoolJobDelete(job.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No school job postings found. Create your first job posting above.</p>
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === 'home-tuition' ? (
              <>
                {/* Home Tuition Add/Edit Form */}
                {showHomeTuitionForm && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingHomeTuition ? 'Edit' : 'Add New'} Home Tuition Posting
                    </h3>
                    <form onSubmit={handleHomeTuitionSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={homeTuitionFormData.title}
                            onChange={(e) => setHomeTuitionFormData({...homeTuitionFormData, title: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Class 10 Mathematics Tutor Required"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Student Class *
                          </label>
                          <input
                            type="text"
                            value={homeTuitionFormData.student_class}
                            onChange={(e) => setHomeTuitionFormData({...homeTuitionFormData, student_class: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Class 10 CBSE"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subjects *
                          </label>
                          <input
                            type="text"
                            value={homeTuitionFormData.subjects}
                            onChange={(e) => setHomeTuitionFormData({...homeTuitionFormData, subjects: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Mathematics, Science"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location *
                          </label>
                          <input
                            type="text"
                            value={homeTuitionFormData.location}
                            onChange={(e) => setHomeTuitionFormData({...homeTuitionFormData, location: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., South Delhi, Gurgaon"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Gender
                          </label>
                          <select
                            value={homeTuitionFormData.preferred_gender}
                            onChange={(e) => setHomeTuitionFormData({...homeTuitionFormData, preferred_gender: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Any">Any</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Experience Required (years)
                          </label>
                          <input
                            type="number"
                            value={homeTuitionFormData.experience_required}
                            onChange={(e) => setHomeTuitionFormData({...homeTuitionFormData, experience_required: parseInt(e.target.value)})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hourly Rate (₹)
                          </label>
                          <input
                            type="number"
                            value={homeTuitionFormData.hourly_rate}
                            onChange={(e) => setHomeTuitionFormData({...homeTuitionFormData, hourly_rate: parseInt(e.target.value)})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Schedule
                          </label>
                          <input
                            type="text"
                            value={homeTuitionFormData.schedule}
                            onChange={(e) => setHomeTuitionFormData({...homeTuitionFormData, schedule: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Evening 6-8 PM, Weekend only"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Name
                          </label>
                          <input
                            type="text"
                            value={homeTuitionFormData.contact_name}
                            onChange={(e) => setHomeTuitionFormData({...homeTuitionFormData, contact_name: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Parent/Guardian name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Phone
                          </label>
                          <input
                            type="tel"
                            value={homeTuitionFormData.contact_phone}
                            onChange={(e) => setHomeTuitionFormData({...homeTuitionFormData, contact_phone: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="+91-9876543210"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Details
                        </label>
                        <textarea
                          value={homeTuitionFormData.description}
                          onChange={(e) => setHomeTuitionFormData({...homeTuitionFormData, description: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          rows={4}
                          placeholder="Any additional requirements or details..."
                        />
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {editingHomeTuition ? 'Update' : 'Create'} Tuition Posting
                        </button>
                        <button
                          type="button"
                          onClick={resetHomeTuitionForm}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Home Tuition Jobs List */}
                <div className="space-y-4">
                  {homeTuitionJobs.length > 0 ? homeTuitionJobs.map((job: any) => (
                    <div key={job.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{job.title}</h4>
                          <p className="text-green-600 font-medium">{job.student_class}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                            <span>📍 {job.location}</span>
                            <span>📚 {job.subjects}</span>
                            <span>💰 ₹{job.hourly_rate}/hour</span>
                            {job.schedule && <span>⏰ {job.schedule}</span>}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            {job.contact_name && <span>👤 {job.contact_name}</span>}
                            <span>Experience: {job.experience_required}+ years</span>
                            <span>Gender: {job.preferred_gender}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleHomeTuitionEdit(job)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleHomeTuitionDelete(job.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No home tuition postings found. Create your first tuition posting above.</p>
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === 'teachers' ? (
              <TeachersTab
                teachers={teachers}
                editingTeacher={editingTeacher}
                showForm={showTeacherForm}
                onSave={handleSaveTeacher}
                onEdit={setEditingTeacher}
                onDelete={handleDeleteTeacher}
                onShowForm={setShowTeacherForm}
              />
            ) : activeTab === 'schools' ? (
              <SchoolsTab
                schools={schools}
                editingSchool={editingSchool}
                showForm={showSchoolForm}
                onSave={handleSaveSchool}
                onEdit={setEditingSchool}
                onDelete={handleDeleteSchool}
                onShowForm={setShowSchoolForm}
              />
            ) : activeTab === 'tutorBanners' ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Manage Photo Banners</h3>
                
                {/* Add New Banner Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Add New Photo Banner</h4>
                  <form onSubmit={handleAddTutorBanner} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Banner Title *
                        </label>
                        <input
                          type="text"
                          value={newTutorBanner.title}
                          onChange={(e) => setNewTutorBanner({...newTutorBanner, title: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter banner title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL *
                        </label>
                        <input
                          type="url"
                          value={newTutorBanner.image_url}
                          onChange={(e) => setNewTutorBanner({...newTutorBanner, image_url: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newTutorBanner.description}
                        onChange={(e) => setNewTutorBanner({...newTutorBanner, description: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Enter banner description (optional)"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="bannerActive"
                        checked={newTutorBanner.is_active}
                        onChange={(e) => setNewTutorBanner({...newTutorBanner, is_active: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="bannerActive" className="ml-2 block text-sm text-gray-900">
                        Active (Show on website)
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add Photo Banner
                    </button>
                  </form>
                </div>

                {/* Banners List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900">Photo Banners ({tutorBanners.length})</h4>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {tutorBanners.length > 0 ? (
                      tutorBanners.map((banner) => (
                        <div key={banner.id} className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-3">
                                <img
                                  src={banner.image_url}
                                  alt={banner.title}
                                  className="w-20 h-12 object-cover rounded-md mr-4"
                                />
                                <div>
                                  <h5 className="text-lg font-semibold text-gray-900">{banner.title}</h5>
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    banner.is_active 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {banner.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                              {banner.description && (
                                <p className="text-gray-600 mb-2">{banner.description}</p>
                              )}
                              <p className="text-sm text-gray-500">
                                Added: {new Date(banner.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => handleUpdateTutorBanner(banner.id, { is_active: !banner.is_active })}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                  banner.is_active
                                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                }`}
                              >
                                {banner.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteTutorBanner(banner.id)}
                                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500">No photo banners added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : activeTab.includes('blogs') ? (
              <>
                {/* Blog Add/Edit Form */}
                {showBlogForm && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingBlog ? 'Edit' : 'Add New'} {activeTab === 'health-blogs' ? 'Health' : 'Tutor'} Blog Post
                    </h3>
                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Blog Title *
                          </label>
                          <input
                            type="text"
                            value={blogFormData.title}
                            onChange={(e) => {
                              const title = e.target.value;
                              setBlogFormData({
                                ...blogFormData, 
                                title,
                                slug: generateSlug(title),
                                meta_title: title
                              });
                            }}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter blog title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL Slug *
                          </label>
                          <input
                            type="text"
                            value={blogFormData.slug}
                            onChange={(e) => setBlogFormData({...blogFormData, slug: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="url-friendly-slug"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Blog Content *
                        </label>
                        <textarea
                          value={blogFormData.content}
                          onChange={(e) => setBlogFormData({...blogFormData, content: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          rows={10}
                          placeholder="Write your blog content here... Use **bold** and ## headings for formatting"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Excerpt (Short Description) *
                        </label>
                        <textarea
                          value={blogFormData.excerpt}
                          onChange={(e) => setBlogFormData({...blogFormData, excerpt: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Brief description for SEO and previews"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Featured Image
                        </label>
                        <ImageUpload
                          onImageSelect={(url) => setBlogFormData({...blogFormData, featured_image: url})}
                          currentImage={blogFormData.featured_image}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Author
                          </label>
                          <input
                            type="text"
                            value={blogFormData.author}
                            onChange={(e) => setBlogFormData({...blogFormData, author: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Author name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reading Time (minutes)
                          </label>
                          <input
                            type="number"
                            value={blogFormData.reading_time}
                            onChange={(e) => setBlogFormData({...blogFormData, reading_time: parseInt(e.target.value)})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            min="1"
                            max="60"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            value={blogFormData.is_published ? 'published' : 'draft'}
                            onChange={(e) => setBlogFormData({...blogFormData, is_published: e.target.value === 'published'})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        </div>
                      </div>

                      {/* SEO Section */}
                      <div className="border-t pt-4">
                        <h4 className="text-md font-semibold mb-3 text-gray-800">SEO Settings</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Meta Title
                            </label>
                            <input
                              type="text"
                              value={blogFormData.meta_title}
                              onChange={(e) => setBlogFormData({...blogFormData, meta_title: e.target.value})}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                              placeholder="SEO title (60 characters max)"
                              maxLength={60}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Meta Description
                            </label>
                            <textarea
                              value={blogFormData.meta_description}
                              onChange={(e) => setBlogFormData({...blogFormData, meta_description: e.target.value})}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              placeholder="SEO description (160 characters max)"
                              maxLength={160}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Keywords (comma separated)
                            </label>
                            <input
                              type="text"
                              value={blogFormData.keywords}
                              onChange={(e) => setBlogFormData({...blogFormData, keywords: e.target.value})}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                              placeholder="keyword1, keyword2, keyword3"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {editingBlog ? 'Update' : 'Create'} Blog Post
                        </button>
                        <button
                          type="button"
                          onClick={resetBlogForm}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Blog List */}
                <div className="space-y-4">
                  {getCurrentData().length > 0 ? getCurrentData().map((blog: any) => (
                    <div key={blog.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-lg">{blog.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              blog.is_published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {blog.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{blog.excerpt}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>By {blog.author}</span>
                            <span>{blog.reading_time} min read</span>
                            <span>{blog.views} views</span>
                            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleBlogEdit(blog)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleBlogDelete(blog.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No blog posts found. Create your first blog post above.</p>
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === 'slider' ? (
              <>
                {/* Slider Add/Edit Form */}
                {showSliderForm && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingSlider ? 'Edit' : 'Add New'} Slider Image
                    </h3>
                    <form onSubmit={handleSliderSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image Title
                        </label>
                        <input
                          type="text"
                          value={sliderFormData.title}
                          onChange={(e) => setSliderFormData({...sliderFormData, title: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter image title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Slider Image
                        </label>
                        <ImageUpload
                          onImageSelect={(url) => setSliderFormData({...sliderFormData, image_url: url})}
                          currentImage={sliderFormData.image_url}
                        />
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {editingSlider ? 'Update' : 'Add'} Image
                        </button>
                        <button
                          type="button"
                          onClick={resetSliderForm}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {sliderImages.map((image) => (
                    <div key={image.id} className="bg-gray-50 rounded-lg p-4">
                      <img src={image.image_url} alt={image.title} className="w-full h-32 object-cover rounded-md mb-2" />
                      <p className="text-sm font-medium">{image.title}</p>
                      <div className="flex justify-between mt-2">
                        <button 
                          onClick={() => handleSliderEdit(image)}
                          className="text-blue-600 text-sm hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleSliderDelete(image.id)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {sliderImages.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No slider images found. Add your first image above.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Add/Edit Form */}
                {showAddForm && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingId ? 'Edit' : 'Add New'} {
                        activeTab === 'clinics' ? 'Clinic' :
                        activeTab === 'hospitals' ? 'Hospital' : 'Diagnostic Center'
                      }
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {activeTab === 'clinics' ? 'Clinic' :
                           activeTab === 'hospitals' ? 'Hospital' : 'Center'} Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Specialization
                        </label>
                        <select
                          value={formData.specialization}
                          onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Specialization</option>
                          {getSpecializationOptions().map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Work Experience (years)
                        </label>
                        <input
                          type="number"
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rating
                        </label>
                        <select
                          value={formData.rating}
                          onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {[1,2,3,4,5].map(num => (
                            <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {activeTab === 'diagnostic' && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Image
                          </label>
                          <ImageUpload
                            onImageSelect={(url) => setFormData({...formData, image_url: url})}
                            currentImage={formData.image_url}
                          />
                        </div>
                      )}

                      <div className="md:col-span-2 flex space-x-4">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {editingId ? 'Update' : 'Add'}
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Data List */}
                <div className="space-y-4">
                  {getCurrentData().length > 0 ? getCurrentData().map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{item.name}</h4>
                        <p className="text-blue-600 font-medium">{item.specialization}</p>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                          <span>{item.experience} years experience</span>
                          <div className="flex items-center">
                            <div className="flex mr-2">{renderStars(item.rating)}</div>
                            <span>({item.rating}/5)</span>
                          </div>
                          {item.phone && <span>📞 {item.phone}</span>}
                        </div>
                        {item.address && (
                          <p className="text-sm text-gray-600 mt-1">📍 {item.address}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No items found. Add your first item above.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Teachers Tab Component
function TeachersTab({ teachers, editingTeacher, showForm, onSave, onEdit, onDelete, onShowForm }: any) {
  const [formData, setFormData] = useState({
    name: '',
    qualifications: '',
    work_experience: 0,
    specialization: '',
    school_name: '',
    photo_url: '',
    phone: '',
    email: '',
    rating: 5,
    hourly_rate: 500,
    location: '',
    bio: '',
    is_active: true
  });

  useEffect(() => {
    if (editingTeacher) {
      setFormData(editingTeacher);
    } else {
      setFormData({
        name: '',
        qualifications: '',
        work_experience: 0,
        specialization: '',
        school_name: '',
        photo_url: '',
        phone: '',
        email: '',
        rating: 5,
        hourly_rate: 500,
        location: '',
        bio: '',
        is_active: true
      });
    }
  }, [editingTeacher]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Teachers Management</h2>
        <button
          onClick={() => onShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                <input
                  type="text"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Experience (years)</label>
                <input
                  type="number"
                  value={formData.work_experience}
                  onChange={(e) => setFormData({ ...formData, work_experience: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  value={formData.school_name}
                  onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({ ...formData, hourly_rate: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <ImageUpload
                onImageSelect={(url) => setFormData({ ...formData, photo_url: url })}
                currentImage={formData.photo_url}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Save Teacher
              </button>
              <button
                type="button"
                onClick={() => {
                  onEdit(null);
                  onShowForm(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifications</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {teacher.photo_url && (
                      <img className="h-10 w-10 rounded-full mr-3" src={teacher.photo_url} alt={teacher.name} />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                      <div className="text-sm text-gray-500">{teacher.specialization}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.qualifications}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.work_experience} years</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.school_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    teacher.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {teacher.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      onEdit(teacher);
                      onShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(teacher.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Schools Tab Component
function SchoolsTab({ schools, editingSchool, showForm, onSave, onEdit, onDelete, onShowForm }: any) {
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    location: '',
    description: '',
    website: '',
    is_active: true
  });

  useEffect(() => {
    if (editingSchool) {
      setFormData(editingSchool);
    } else {
      setFormData({
        name: '',
        logo_url: '',
        location: '',
        description: '',
        website: '',
        is_active: true
      });
    }
  }, [editingSchool]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Schools Management</h2>
        <button
          onClick={() => onShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingSchool ? 'Edit School' : 'Add New School'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Logo</label>
              <ImageUpload
                onImageSelect={(url) => setFormData({ ...formData, logo_url: url })}
                currentImage={formData.logo_url}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active_school"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active_school" className="text-sm font-medium text-gray-700">Active</label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Save School
              </button>
              <button
                type="button"
                onClick={() => {
                  onEdit(null);
                  onShowForm(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schools.map((school) => (
              <tr key={school.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {school.logo_url && (
                      <img className="h-10 w-10 rounded mr-3" src={school.logo_url} alt={school.name} />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{school.name}</div>
                      <div className="text-sm text-gray-500">{school.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {school.website && (
                    <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      Visit Website
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    school.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {school.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      onEdit(school);
                      onShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(school.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}