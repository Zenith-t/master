import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Users, 
  Building2, 
  Stethoscope,
  Activity,
  FileText,
  GraduationCap,
  Briefcase,
  Home,
  Image as ImageIcon
} from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

interface SliderImage {
  id: string;
  title: string;
  image_url: string;
  is_active: boolean;
}

interface School {
  id: string;
  name: string;
  logo_url?: string;
  location?: string;
  description?: string;
  website_url?: string;
  is_active: boolean;
}

interface Clinic {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  phone?: string;
  address?: string;
  image_url?: string;
  is_active: boolean;
}

interface Hospital {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  phone?: string;
  address?: string;
  image_url?: string;
  is_active: boolean;
}

interface DiagnosticCenter {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  phone?: string;
  address?: string;
  image_url?: string;
  is_active: boolean;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  category: 'health' | 'tutors';
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  is_published: boolean;
  author: string;
  reading_time: number;
  views: number;
}

interface Teacher {
  id: string;
  name: string;
  qualifications: string;
  work_experience: number;
  specialization: string;
  school_name?: string;
  photo_url?: string;
  phone?: string;
  email?: string;
  rating: number;
  hourly_rate: number;
  location?: string;
  bio?: string;
  is_active: boolean;
}

interface SchoolJob {
  id: string;
  title: string;
  school_name: string;
  location: string;
  job_type: string;
  subjects: string;
  qualifications_required: string;
  experience_required: number;
  salary_range?: string;
  description?: string;
  contact_phone?: string;
  contact_email?: string;
  application_deadline?: string;
  is_active: boolean;
}

interface HomeTuitionJob {
  id: string;
  title: string;
  student_class: string;
  subjects: string;
  location: string;
  preferred_gender: string;
  experience_required: number;
  hourly_rate: number;
  schedule?: string;
  description?: string;
  contact_phone?: string;
  contact_name?: string;
  is_active: boolean;
}

interface TutorBanner {
  id: string;
  title: string;
  image_url: string;
  description?: string;
  is_active: boolean;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { supabase, user } = useSupabase();
  const [activeTab, setActiveTab] = useState('slider');
  const [loading, setLoading] = useState(false);

  // State for all entities
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [diagnosticCenters, setDiagnosticCenters] = useState<DiagnosticCenter[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schoolJobs, setSchoolJobs] = useState<SchoolJob[]>([]);
  const [homeTuitionJobs, setHomeTuitionJobs] = useState<HomeTuitionJob[]>([]);
  const [tutorBanners, setTutorBanners] = useState<TutorBanner[]>([]);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!user) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        sliderRes,
        schoolsRes,
        clinicsRes,
        hospitalsRes,
        diagnosticRes,
        blogsRes,
        teachersRes,
        schoolJobsRes,
        homeTuitionRes,
        tutorBannersRes
      ] = await Promise.all([
        supabase.from('slider_images').select('*').order('created_at', { ascending: false }),
        supabase.from('schools').select('*').order('created_at', { ascending: false }),
        supabase.from('clinics').select('*').order('created_at', { ascending: false }),
        supabase.from('hospitals').select('*').order('created_at', { ascending: false }),
        supabase.from('diagnostic_centers').select('*').order('created_at', { ascending: false }),
        supabase.from('blogs').select('*').order('created_at', { ascending: false }),
        supabase.from('teachers').select('*').order('created_at', { ascending: false }),
        supabase.from('school_jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('home_tuition_jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('tutor_banners').select('*').order('created_at', { ascending: false })
      ]);

      if (sliderRes.data) setSliderImages(sliderRes.data);
      if (schoolsRes.data) setSchools(schoolsRes.data);
      if (clinicsRes.data) setClinics(clinicsRes.data);
      if (hospitalsRes.data) setHospitals(hospitalsRes.data);
      if (diagnosticRes.data) setDiagnosticCenters(diagnosticRes.data);
      if (blogsRes.data) setBlogs(blogsRes.data);
      if (teachersRes.data) setTeachers(teachersRes.data);
      if (schoolJobsRes.data) setSchoolJobs(schoolJobsRes.data);
      if (homeTuitionRes.data) setHomeTuitionJobs(homeTuitionRes.data);
      if (tutorBannersRes.data) setTutorBanners(tutorBannersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let table = '';
      let data = { ...formData };

      switch (activeTab) {
        case 'slider':
          table = 'slider_images';
          break;
        case 'schools':
          table = 'schools';
          break;
        case 'clinics':
          table = 'clinics';
          break;
        case 'hospitals':
          table = 'hospitals';
          break;
        case 'diagnostic':
          table = 'diagnostic_centers';
          break;
        case 'blogs':
          table = 'blogs';
          if (!editingItem) {
            data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          }
          break;
        case 'teachers':
          table = 'teachers';
          break;
        case 'school-jobs':
          table = 'school_jobs';
          break;
        case 'home-tuition':
          table = 'home_tuition_jobs';
          break;
        case 'tutor-banners':
          table = 'tutor_banners';
          break;
      }

      if (editingItem) {
        const { error } = await supabase
          .from(table)
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(table)
          .insert([data]);
        if (error) throw error;
      }

      setShowForm(false);
      setEditingItem(null);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      let table = '';
      switch (activeTab) {
        case 'slider':
          table = 'slider_images';
          break;
        case 'schools':
          table = 'schools';
          break;
        case 'clinics':
          table = 'clinics';
          break;
        case 'hospitals':
          table = 'hospitals';
          break;
        case 'diagnostic':
          table = 'diagnostic_centers';
          break;
        case 'blogs':
          table = 'blogs';
          break;
        case 'teachers':
          table = 'teachers';
          break;
        case 'school-jobs':
          table = 'school_jobs';
          break;
        case 'home-tuition':
          table = 'home_tuition_jobs';
          break;
        case 'tutor-banners':
          table = 'tutor_banners';
          break;
      }

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
    setShowForm(false);
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'slider':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <ImageUpload
                onImageSelect={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
                currentImage={formData.image_url}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
        );

      case 'schools':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <ImageUpload
                onImageSelect={(imageUrl) => setFormData({ ...formData, logo_url: imageUrl })}
                currentImage={formData.logo_url}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input
                type="url"
                value={formData.website_url || ''}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
        );

      case 'clinics':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <ImageUpload
                onImageSelect={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
                currentImage={formData.image_url}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <input
                type="text"
                value={formData.specialization || ''}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
              <input
                type="number"
                value={formData.experience || 0}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
              <input
                type="number"
                value={formData.rating || 5}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="1"
                max="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
        );

      case 'hospitals':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <ImageUpload
                onImageSelect={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
                currentImage={formData.image_url}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <input
                type="text"
                value={formData.specialization || ''}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
              <input
                type="number"
                value={formData.experience || 0}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
              <input
                type="number"
                value={formData.rating || 5}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="1"
                max="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
        );

      case 'diagnostic':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Center Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <ImageUpload
                onImageSelect={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
                currentImage={formData.image_url}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <input
                type="text"
                value={formData.specialization || ''}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
              <input
                type="number"
                value={formData.experience || 0}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
              <input
                type="number"
                value={formData.rating || 5}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="1"
                max="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
        );

      case 'blogs':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category || 'health'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="health">Health</option>
                <option value="tutors">Education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Brief description of the blog post"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
              <ImageUpload
                onImageSelect={(imageUrl) => setFormData({ ...formData, featured_image: imageUrl })}
                currentImage={formData.featured_image}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={10}
                placeholder="Write your blog content here. Use ## for headings and **text** for bold."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                value={formData.author || 'Admin'}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reading Time (minutes)</label>
              <input
                type="number"
                value={formData.reading_time || 5}
                onChange={(e) => setFormData({ ...formData, reading_time: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title (SEO)</label>
              <input
                type="text"
                value={formData.meta_title || ''}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="SEO title for search engines"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description (SEO)</label>
              <textarea
                value={formData.meta_description || ''}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="SEO description for search engines"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (SEO)</label>
              <input
                type="text"
                value={formData.keywords || ''}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Comma-separated keywords"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published !== false}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_published" className="text-sm font-medium text-gray-700">Published</label>
            </div>
          </div>
        );

      case 'teachers':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
              <ImageUpload
                onImageSelect={(imageUrl) => setFormData({ ...formData, photo_url: imageUrl })}
                currentImage={formData.photo_url}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
              <input
                type="text"
                value={formData.qualifications || ''}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience (years)</label>
              <input
                type="number"
                value={formData.work_experience || 0}
                onChange={(e) => setFormData({ ...formData, work_experience: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <input
                type="text"
                value={formData.specialization || ''}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
              <input
                type="text"
                value={formData.school_name || ''}
                onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
              <input
                type="number"
                value={formData.rating || 5}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="1"
                max="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (₹)</label>
              <input
                type="number"
                value={formData.hourly_rate || 500}
                onChange={(e) => setFormData({ ...formData, hourly_rate: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
        );

      case 'school-jobs':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
              <input
                type="text"
                value={formData.school_name || ''}
                onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                value={formData.job_type || 'Full-time'}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
              <input
                type="text"
                value={formData.subjects || ''}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications Required</label>
              <textarea
                value={formData.qualifications_required || ''}
                onChange={(e) => setFormData({ ...formData, qualifications_required: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required (years)</label>
              <input
                type="number"
                value={formData.experience_required || 0}
                onChange={(e) => setFormData({ ...formData, experience_required: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
              <input
                type="text"
                value={formData.salary_range || ''}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., ₹25,000 - ₹40,000 per month"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                type="tel"
                value={formData.contact_phone || ''}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={formData.contact_email || ''}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
              <input
                type="date"
                value={formData.application_deadline || ''}
                onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
        );

      case 'home-tuition':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Class</label>
              <input
                type="text"
                value={formData.student_class || ''}
                onChange={(e) => setFormData({ ...formData, student_class: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
              <input
                type="text"
                value={formData.subjects || ''}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Gender</label>
              <select
                value={formData.preferred_gender || 'Any'}
                onChange={(e) => setFormData({ ...formData, preferred_gender: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required (years)</label>
              <input
                type="number"
                value={formData.experience_required || 0}
                onChange={(e) => setFormData({ ...formData, experience_required: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (₹)</label>
              <input
                type="number"
                value={formData.hourly_rate || 0}
                onChange={(e) => setFormData({ ...formData, hourly_rate: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
              <input
                type="text"
                value={formData.schedule || ''}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mon-Fri 4-6 PM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                type="tel"
                value={formData.contact_phone || ''}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
              <input
                type="text"
                value={formData.contact_name || ''}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
        );

      case 'tutor-banners':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
              <ImageUpload
                onImageSelect={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
                currentImage={formData.image_url}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderList = () => {
    let items: any[] = [];
    let title = '';

    switch (activeTab) {
      case 'slider':
        items = sliderImages;
        title = 'Slider Images';
        break;
      case 'schools':
        items = schools;
        title = 'Schools';
        break;
      case 'clinics':
        items = clinics;
        title = 'Clinics';
        break;
      case 'hospitals':
        items = hospitals;
        title = 'Hospitals';
        break;
      case 'diagnostic':
        items = diagnosticCenters;
        title = 'Diagnostic Centers';
        break;
      case 'blogs':
        items = blogs;
        title = 'Blogs';
        break;
      case 'teachers':
        items = teachers;
        title = 'Teachers';
        break;
      case 'school-jobs':
        items = schoolJobs;
        title = 'School Jobs';
        break;
      case 'home-tuition':
        items = homeTuitionJobs;
        title = 'Home Tuition Jobs';
        break;
      case 'tutor-banners':
        items = tutorBanners;
        title = 'Tutor Banners';
        break;
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex gap-6">
                {/* Image Section */}
                <div className="flex-shrink-0">
                  {(item.image_url || item.logo_url || item.photo_url || item.featured_image) && (
                    <img
                      src={item.image_url || item.logo_url || item.photo_url || item.featured_image}
                      alt={item.title || item.name}
                      className="w-32 h-24 object-cover rounded-lg border"
                    />
                  )}
                  {!(item.image_url || item.logo_url || item.photo_url || item.featured_image) && (
                    <div className="w-32 h-24 bg-gray-200 rounded-lg border flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title || item.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        (item.is_active !== false && item.is_published !== false) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(item.is_active !== false && item.is_published !== false) ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    {item.specialization && (
                      <p><span className="font-medium">Specialization:</span> {item.specialization}</p>
                    )}
                    {item.school_name && (
                      <p><span className="font-medium">School:</span> {item.school_name}</p>
                    )}
                    {item.location && (
                      <p><span className="font-medium">Location:</span> {item.location}</p>
                    )}
                    {item.phone && (
                      <p><span className="font-medium">Phone:</span> {item.phone}</p>
                    )}
                    {item.category && (
                      <p><span className="font-medium">Category:</span> {item.category}</p>
                    )}
                    {item.experience !== undefined && (
                      <p><span className="font-medium">Experience:</span> {item.experience} years</p>
                    )}
                    {item.work_experience !== undefined && (
                      <p><span className="font-medium">Experience:</span> {item.work_experience} years</p>
                    )}
                    {item.hourly_rate && (
                      <p><span className="font-medium">Rate:</span> ₹{item.hourly_rate}/hour</p>
                    )}
                    {item.student_class && (
                      <p><span className="font-medium">Class:</span> {item.student_class}</p>
                    )}
                    {item.subjects && (
                      <p><span className="font-medium">Subjects:</span> {item.subjects}</p>
                    )}
                    {item.excerpt && (
                      <p><span className="font-medium">Excerpt:</span> {item.excerpt}</p>
                    )}
                    {item.description && (
                      <p><span className="font-medium">Description:</span> {item.description.substring(0, 100)}...</p>
                    )}
                    {item.views !== undefined && (
                      <p><span className="font-medium">Views:</span> {item.views}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No {title.toLowerCase()} found. Add your first item!</p>
          </div>
        )}
      </div>
    );
  };

  if (loading && !showForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-md p-6 mr-8">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('slider')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === 'slider' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ImageIcon className="h-4 w-4 mr-3" />
                Slider Images
              </button>
              <button
                onClick={() => setActiveTab('schools')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === 'schools' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building2 className="h-4 w-4 mr-3" />
                Schools
              </button>
              <button
                onClick={() => setActiveTab('clinics')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === 'clinics' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Stethoscope className="h-4 w-4 mr-3" />
                Clinics
              </button>
              <button
                onClick={() => setActiveTab('hospitals')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === 'hospitals' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building2 className="h-4 w-4 mr-3" />
                Hospitals
              </button>
              <button
                onClick={() => setActiveTab('diagnostic')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === 'diagnostic' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Activity className="h-4 w-4 mr-3" />
                Diagnostic Centers
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === 'blogs' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-4 w-4 mr-3" />
                Blogs
              </button>
              <button
                onClick={() => setActiveTab('teachers')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === 'teachers' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4 mr-3" />
                Teachers
              </button>
              <button
                onClick={() => setActiveTab('school-jobs')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === 'school-jobs' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="h-4 w-4 mr-3" />
                School Jobs
              </button>
              <button
                onClick={() => setActiveTab('home-tuition')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === 'home-tuition' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="h-4 w-4 mr-3" />
                Home Tuition
              </button>
              <button
                onClick={() => setActiveTab('tutor-banners')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === 'tutor-banners' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <GraduationCap className="h-4 w-4 mr-3" />
                Tutor Banners
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {showForm ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingItem ? 'Edit' : 'Add New'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {renderForm()}
                  
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                {renderList()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}