import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone, Star, MapPin, Clock, ArrowRight, X, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../contexts/SupabaseContext';
import { RatingsCounter } from '../utils/ratingsCounter';

interface SliderImage {
  id: string;
  image_url: string;
  title: string;
  is_active: boolean;
}

interface ServiceItem {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  phone?: string;
  address?: string;
  image_url?: string;
}

export default function Homepage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [activeTab, setActiveTab] = useState<'health' | 'tutors'>('health');
  const [clinics, setClinics] = useState<ServiceItem[]>([]);
  const [hospitals, setHospitals] = useState<ServiceItem[]>([]);
  const [diagnosticCenters, setDiagnosticCenters] = useState<ServiceItem[]>([]);
  const [healthBlogs, setHealthBlogs] = useState<any[]>([]);
  const [tutorBlogs, setTutorBlogs] = useState<any[]>([]);
  const [schoolJobs, setSchoolJobs] = useState<any[]>([]);
  const [homeTuitionJobs, setHomeTuitionJobs] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [currentTeacherSlide, setCurrentTeacherSlide] = useState(0);
  const [currentSchoolSlide, setCurrentSchoolSlide] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [tutorBanners, setTutorBanners] = useState<any[]>([]);
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0);

  useEffect(() => {
    fetchSliderImages();
    fetchHealthServices();
    fetchBlogs();
    fetchJobPostings();
    fetchTeachersAndSchools();
    fetchTutorBanners();
  }, []);

  const fetchSliderImages = async () => {
    try {
      const { data, error } = await supabase
        .from('slider_images')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setSliderImages(data);
      } else {
        // Default images if none in database
        setSliderImages([
          {
            id: '1',
            image_url: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg',
            title: 'Quality Healthcare Services',
            is_active: true
          },
          {
            id: '2', 
            image_url: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg',
            title: 'Expert Medical Care',
            is_active: true
          },
          {
            id: '3',
            image_url: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg',
            title: 'Modern Medical Equipment',
            is_active: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching slider images:', error);
      // Use default images on error
      setSliderImages([
        {
          id: '1',
          image_url: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg',
          title: 'Quality Healthcare Services',
          is_active: true
        }
      ]);
    }
  };

  const fetchHealthServices = async () => {
    try {
      const [clinicsRes, hospitalsRes, diagnosticRes] = await Promise.all([
        supabase.from('clinics').select('*').eq('is_active', true).limit(3),
        supabase.from('hospitals').select('*').eq('is_active', true).limit(3),
        supabase.from('diagnostic_centers').select('*').eq('is_active', true).limit(3)
      ]);

      if (clinicsRes.data) setClinics(clinicsRes.data);
      if (hospitalsRes.data) setHospitals(hospitalsRes.data);
      if (diagnosticRes.data) setDiagnosticCenters(diagnosticRes.data);
    } catch (error) {
      console.error('Error fetching health services:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const [healthBlogsRes, tutorBlogsRes] = await Promise.all([
        supabase.from('blogs').select('*').eq('category', 'health').eq('is_published', true).limit(3).order('created_at', { ascending: false }),
        supabase.from('blogs').select('*').eq('category', 'tutors').eq('is_published', true).limit(3).order('created_at', { ascending: false })
      ]);

      if (healthBlogsRes.data) setHealthBlogs(healthBlogsRes.data);
      if (tutorBlogsRes.data) setTutorBlogs(tutorBlogsRes.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchJobPostings = async () => {
    try {
      const [schoolJobsRes, homeTuitionRes] = await Promise.all([
        supabase.from('school_jobs').select('*').eq('is_active', true).limit(3).order('created_at', { ascending: false }),
        supabase.from('home_tuition_jobs').select('*').eq('is_active', true).limit(3).order('created_at', { ascending: false })
      ]);

      if (schoolJobsRes.data) setSchoolJobs(schoolJobsRes.data);
      if (homeTuitionRes.data) setHomeTuitionJobs(homeTuitionRes.data);
    } catch (error) {
      console.error('Error fetching job postings:', error);
    }
  };

  const fetchTeachersAndSchools = async () => {
    try {
      const [teachersRes, schoolsRes] = await Promise.all([
        supabase.from('teachers').select('*').eq('is_active', true).limit(10),
        supabase.from('schools').select('*').eq('is_active', true).limit(10)
      ]);

      if (teachersRes.data) setTeachers(teachersRes.data);
      if (schoolsRes.data) setSchools(schoolsRes.data);
    } catch (error) {
      console.error('Error fetching teachers and schools:', error);
    }
  };

  const fetchTutorBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('tutor_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTutorBanners(data);
    } catch (error) {
      console.error('Error fetching tutor banners:', error);
    }
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  useEffect(() => {
    if (sliderImages.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [sliderImages.length]);

  // Teacher slider auto-advance
  useEffect(() => {
    if (teachers.length > 0) {
      const timer = setInterval(() => {
        setCurrentTeacherSlide((prev) => (prev + 1) % teachers.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [teachers.length]);

  // School slider auto-advance
  useEffect(() => {
    if (schools.length > 0) {
      const timer = setInterval(() => {
        setCurrentSchoolSlide((prev) => (prev + 1) % schools.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [schools.length]);

  // Banner slider auto-advance
  useEffect(() => {
    if (tutorBanners.length > 0) {
      const timer = setInterval(() => {
        setCurrentBannerSlide((prev) => (prev + 1) % tutorBanners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [tutorBanners.length]);
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

  const ServiceCard = ({ service, type }: { service: ServiceItem; type: string }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="flex gap-4">
        {/* Image Section */}
        <div className="flex-shrink-0">
          {service.image_url ? (
            <img
              src={service.image_url}
              alt={service.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
          <p className={`font-medium mb-2 ${
            type === 'clinic' ? 'text-blue-600' : 
            type === 'hospital' ? 'text-red-600' : 'text-purple-600'
          }`}>
            {service.specialization}
          </p>
          
          <div className="flex items-center mb-2">
            <div className="flex">{renderStars(service.rating)}</div>
            <span className="ml-2 text-sm text-gray-600">
              ({RatingsCounter.formatCount(RatingsCounter.getRatingCount(service.id))} reviews)
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">{service.experience} years experience</span>
          </div>

          {service.address && (
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">{service.address}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            {service.phone && (
              <a
                href={`tel:${service.phone}`}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <Phone className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Call Now</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Zenith Tutors</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-blue-600">
                <Phone className="h-5 w-5 mr-2" />
                <span className="font-semibold">Call: +91 7678229653</span>
              </div>
              <button 
                onClick={() => navigate('/admin')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Image Slider */}
      <div className="relative h-96 overflow-hidden">
        {sliderImages.length > 0 && (
          <>
            <div className="absolute inset-0 transition-transform duration-500 ease-in-out"
                 style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              <div className="flex h-full">
                {sliderImages.map((image, index) => (
                  <div key={image.id} className="w-full h-full flex-shrink-0 relative">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">{image.title}</h2>
                        <div className="flex justify-center space-x-4">
                         
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Slider Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

      {/* Call and WhatsApp Buttons - Inside Slider at Bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
        <a
          href="tel:+917678229653"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center shadow-lg"
        >
          <Phone className="h-5 w-5 mr-2" />
          Call Now
        </a>
        
        <a
          href="https://wa.me/917678229653"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center shadow-lg"
        >
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </div>



      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg relative">
            <button
              onClick={() => setActiveTab('health')}
              className={`px-8 py-3 rounded-md font-semibold transition-all duration-300 relative overflow-hidden ${
                activeTab === 'health'
                  ? 'bg-blue-600 text-white border-2 border-yellow-400 shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-200'
              }`}
            >
              {activeTab === 'health' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-300 animate-pulse"></div>
              )}
              Health Services
            </button>
            <button
              onClick={() => setActiveTab('tutors')}
              className={`px-8 py-3 rounded-md font-semibold transition-all duration-300 relative overflow-hidden ${
                activeTab === 'tutors'
                  ? 'bg-blue-600 text-white border-2 border-yellow-400 shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-200'
              }`}
            >
              {activeTab === 'tutors' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-300 animate-pulse"></div>
              )}
              Zenith Tutors
            </button>
          </div>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === 'health' && (
          <>
            {/* Our Clinics Preview */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Our Clinics</h3>
                <button
                  onClick={() => navigate('/clinics')}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                >
                  View All Services <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <a
              href="tel:+91 7678229653"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center shadow-lg"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call for Appointment: +91 7678229653
            </a>
          </div>
          <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 inline-block">
            <p className="text-orange-800 font-semibold">
              📞 Before going call to get ₹100 - ₹5000 discount
            </p>
          </div>
        </div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clinics.length > 0 ? (
                  clinics.map((clinic) => (
                    <ServiceCard key={clinic.id} service={clinic} type="clinic" />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No clinics available</p>
                  </div>
                )}
              </div>
            </section>

            {/* Hospitals Preview */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Hospitals</h3>
                <button
                  onClick={() => navigate('/hospitals')}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                >
                  View All Services <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <a
              href="tel:+91 7678229653"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center shadow-lg"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call for Appointment: +91 7678229653
            </a>
          </div>
          <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 inline-block">
            <p className="text-orange-800 font-semibold">
              📞 Before going call to get ₹100 - ₹5000 discount
            </p>
          </div>
        </div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hospitals.length > 0 ? (
                  hospitals.map((hospital) => (
                    <ServiceCard key={hospital.id} service={hospital} type="hospital" />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No hospitals available</p>
                  </div>
                )}
              </div>
            </section>

            {/* Diagnostic Centers Preview */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Diagnostic Centers</h3>
                
                <button
                  onClick={() => navigate('/diagnostic-centers')}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                >
                  View All Services <ArrowRight className="h-4 w-4 ml-1" />
                </button>
                
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <a
              href="tel:+91 7678229653"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center shadow-lg"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call for Appointment: +91 7678229653
            </a>
          </div>
          <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 inline-block">
            <p className="text-orange-800 font-semibold">
              📞 Before going call to get ₹100 - ₹5000 discount
            </p>
          </div>
        </div>

                   
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {diagnosticCenters.length > 0 ? (
                  diagnosticCenters.map((center) => (
                    <ServiceCard key={center.id} service={center} type="diagnostic" />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No diagnostic centers available</p>
                  </div>
                )}
              </div>
            </section>

            {/* Explore All Services Button */}
            <div className="text-center">
              <button
                onClick={() => navigate('/health')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Explore All Health Services
              </button>
            </div>

            {/* Health Blogs Section */}
            <section className="mt-16">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Health Blogs</h3>
                <button
                  onClick={() => navigate('/blogs/health')}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                >
                  View All Blogs <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {healthBlogs.length > 0 ? (
                  healthBlogs.slice(0, 3).map((blog) => (
                    <div key={blog.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                      {blog.featured_image && (
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{blog.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{blog.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>By {blog.author}</span>
                          <span>{blog.reading_time} min read</span>
                        </div>
                        <div className="mt-3">
                          <button 
                            onClick={() => navigate(`/blog/health/${blog.slug}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Read More →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No health blogs available</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'tutors' && (
          <div className="relative">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Zenith Tutors
              </h2>
              <p className="text-xl text-gray-600 mb-2">
                Several thousands of students of Top Schools Till Now
              </p>
              <p className="text-lg text-blue-600 font-semibold">
                → Get A Home Tutor ←
              </p>
            </div>

            {/* Tutor Banners Slider Section */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Photo Banners</h3>
                {tutorBanners.length > 0 ? (
                  <div className="relative max-w-4xl mx-auto">
                    <div className="overflow-hidden rounded-xl shadow-2xl">
                      <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentBannerSlide * 100}%)` }}
                      >
                        {tutorBanners.map((banner, index) => (
                          <div key={banner.id} className="w-full flex-shrink-0">
                            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                              <img 
                                src={banner.image_url} 
                                alt={banner.title} 
                                className="w-full h-64 md:h-80 object-cover"
                              />
                              <div className="p-6">
                                <h4 className="text-2xl font-bold text-gray-900 mb-3">{banner.title}</h4>
                                {banner.description && (
                                  <p className="text-gray-600 text-lg leading-relaxed">{banner.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Navigation Arrows */}
                    <button
                      onClick={() => setCurrentBannerSlide((prev) => (prev - 1 + tutorBanners.length) % tutorBanners.length)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setCurrentBannerSlide((prev) => (prev + 1) % tutorBanners.length)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    
                    {/* Enhanced Banner Slider Indicators */}
                    <div className="flex justify-center mt-6 space-x-3">
                      {tutorBanners.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentBannerSlide(index)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 transform hover:scale-110 ${
                            index === currentBannerSlide 
                              ? 'bg-blue-600 text-white shadow-lg scale-110' 
                              : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-12 shadow-lg text-center">
                    <p className="text-gray-500">No banners available</p>
                  </div>
                )}
              </div>
            </section>

            {/* Teachers from Reputed Schools */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Nearly Teachers Posted in Reputed Schools</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Teachers Slider - Larger Section */}
                  <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-semibold text-lg mb-4">Featured Teachers</h4>
                    {teachers.length > 0 ? (
                      <div className="relative">
                        <div className="overflow-hidden rounded-lg">
                          <div 
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentTeacherSlide * 100}%)` }}
                          >
                            {teachers.map((teacher, index) => (
                              <div key={teacher.id} className="w-full flex-shrink-0">
                                <div className="flex items-center mb-4">
                                  <img 
                                    src={teacher.photo_url || "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg"} 
                                    alt={teacher.name} 
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                  />
                                  <div>
                                    <h5 className="font-semibold text-lg">{teacher.name}</h5>
                                    <p className="text-blue-600">{teacher.specialization}</p>
                                    <p className="text-sm text-gray-600">{teacher.school_name}</p>
                                  </div>
                                </div>
                                <div className="flex items-center mb-2">
                                  <div className="flex">{renderStars(teacher.rating)}</div>
                                  <span className="ml-2 text-sm text-gray-600">
                                    ({RatingsCounter.formatCount(RatingsCounter.getRatingCount(teacher.id))})
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 mb-4">
                                  <p><strong>Qualifications:</strong> {teacher.qualifications}</p>
                                  <p><strong>Experience:</strong> {teacher.work_experience} years</p>
                                  <p><strong>Location:</strong> {teacher.location}</p>
                                  <p><strong>Rate:</strong> ₹{teacher.hourly_rate}/hour</p>
                                </div>
                                <button 
                                  onClick={() => setSelectedTeacher(teacher)}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
                                >
                                  Read Complete Profile
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Teacher Slider Indicators */}
                        <div className="flex justify-center mt-4 space-x-2">
                          {teachers.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentTeacherSlide(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentTeacherSlide ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No teachers available</p>
                      </div>
                    )}
                  </div>

                  {/* Schools Logo Slider - Smaller Section */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-base mb-4">Teachers from Top Schools</h4>
                    {schools.length > 0 ? (
                      <div className="relative">
                        <div className="overflow-hidden rounded-lg">
                          <div 
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSchoolSlide * 100}%)` }}
                          >
                            {schools.map((school, index) => (
                              <div key={school.id} className="w-full flex-shrink-0 text-center">
                                <img 
                                  src={school.logo_url || "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg"} 
                                  alt={school.name} 
                                  className="w-24 h-24 rounded-lg object-cover mx-auto mb-3 shadow-md"
                                />
                                <h5 className="font-medium text-sm">{school.name}</h5>
                                <p className="text-xs text-gray-600">{school.location}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* School Slider Indicators */}
                        <div className="flex justify-center mt-3 space-x-1">
                          {schools.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSchoolSlide(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentSchoolSlide ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">No schools available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* School Job Postings */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">School Job Postings</h3>
                <button
                  onClick={() => navigate('/school-jobs')}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {schoolJobs.length > 0 ? (
                  schoolJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                      <h4 className="font-semibold text-lg mb-2">{job.title}</h4>
                      <p className="text-blue-600 font-medium mb-2">{job.school_name}, {job.location}</p>
                      <div className="text-sm text-gray-600 mb-4">
                        <p><strong>Subjects:</strong> {job.subjects}</p>
                        <p><strong>Experience:</strong> {job.experience_required}+ years required</p>
                        {job.salary_range && <p><strong>Salary:</strong> {job.salary_range}</p>}
                      </div>
                      {job.contact_phone && (
                        <a
                          href={`tel:${job.contact_phone}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full inline-block text-center"
                        >
                          Apply Now
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No school job postings available</p>
                  </div>
                )}
              </div>
            </section>

            {/* Home Tuition Postings */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Home Tuition Postings</h3>
                <button
                  onClick={() => navigate('/home-tuition')}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {homeTuitionJobs.length > 0 ? (
                  homeTuitionJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                      <h4 className="font-semibold text-lg mb-2">{job.title}</h4>
                      <p className="text-green-600 font-medium mb-2">{job.location}</p>
                      <div className="text-sm text-gray-600 mb-4">
                        <p><strong>Student:</strong> {job.student_class}</p>
                        <p><strong>Subjects:</strong> {job.subjects}</p>
                        <p><strong>Rate:</strong> ₹{job.hourly_rate}/hour</p>
                        {job.schedule && <p><strong>Schedule:</strong> {job.schedule}</p>}
                      </div>
                      {job.contact_phone && (
                        <a
                          href={`tel:${job.contact_phone}`}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full inline-block text-center"
                        >
                          Contact Parent
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No home tuition postings available</p>
                  </div>
                )}
              </div>
            </section>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
              {/* Call Button */}
              <a
                href="tel:+917678229653"
                className="group bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
                title="Call Now"
              >
                <Phone className="h-6 w-6" />
                <span className="absolute right-16 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Call Now
                </span>
              </a>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/917678229653"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-green-400 hover:bg-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
                title="WhatsApp"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109"/>
                </svg>
                <span className="absolute right-16 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  WhatsApp
                </span>
              </a>

              {/* Share Button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Zenith Tutors ',
                      text: 'Quality education and tutoring services coming soon!',
                      url: window.location.href
                    });
                  } else {
                    // Fallback for browsers that don't support Web Share API
                    navigator.clipboard.writeText(window.location.href);
                    alert('Page link copied to clipboard!');
                  }
                }}
                className="group bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
                title="Share Page"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="absolute right-16 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Share Page
                </span>
              </button>
            </div>

            {/* Tutor Blogs Section */}
            <section className="mt-16">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Education Blogs</h3>
                <button
                  onClick={() => navigate('/blogs/tutors')}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                >
                  View All Blogs <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tutorBlogs.length > 0 ? (
                  tutorBlogs.slice(0, 3).map((blog) => (
                    <div key={blog.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                      {blog.featured_image && (
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{blog.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{blog.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>By {blog.author}</span>
                          <span>{blog.reading_time} min read</span>
                        </div>
                        <div className="mt-3">
                          <button 
                            onClick={() => navigate(`/blog/tutors/${blog.slug}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Read More →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No education blogs available</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Teacher Profile Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Teacher Profile</h3>
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Teacher Info */}
              <div className="flex items-center mb-6">
                <img 
                  src={selectedTeacher.photo_url || "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg"} 
                  alt={selectedTeacher.name} 
                  className="w-24 h-24 rounded-full object-cover mr-6 shadow-lg"
                />
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedTeacher.name}</h4>
                  <p className="text-blue-600 font-semibold text-lg mb-2">{selectedTeacher.specialization}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex">{renderStars(selectedTeacher.rating)}</div>
                    <span className="ml-2 text-sm text-gray-600">
                      ({RatingsCounter.formatCount(RatingsCounter.getRatingCount(selectedTeacher.id))} reviews)
                    </span>
                  </div>
                  {selectedTeacher.school_name && (
                    <p className="text-gray-600 font-medium">{selectedTeacher.school_name}</p>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Qualifications
                  </h5>
                  <p className="text-gray-700">{selectedTeacher.qualifications}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Experience
                  </h5>
                  <p className="text-gray-700">{selectedTeacher.work_experience} years</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                    Location
                  </h5>
                  <p className="text-gray-700">{selectedTeacher.location}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                    Hourly Rate
                  </h5>
                  <p className="text-gray-700 font-bold">₹{selectedTeacher.hourly_rate}/hour</p>
                </div>
              </div>

              {/* Bio Section */}
              {selectedTeacher.bio && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                    About Teacher
                  </h5>
                  <p className="text-gray-700 leading-relaxed">{selectedTeacher.bio}</p>
                </div>
              )}

              {/* Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+917678229653"
                  className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call: +91 7678229653
                </a>
                
                {selectedTeacher.email && (
                  <a
                    href={`mailto:${selectedTeacher.email}`}
                    className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Email Teacher
                  </a>
                )}
                
                <a
                  href="https://wa.me/917678229653"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Zenith Tutors</h3>
              <p className="text-gray-400 mb-4">Your trusted healthcare partner providing quality medical services and educational resources.</p>
              <div className="flex items-center mb-2">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+91-7678229653</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">Delhi, India</span>
              </div>
            </div>

            {/* Health Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Health Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/clinics" className="hover:text-white transition-colors">Our Clinics</a></li>
                <li><a href="/hospitals" className="hover:text-white transition-colors">Hospitals</a></li>
                <li><a href="/diagnostic-centers" className="hover:text-white transition-colors">Diagnostic Centers</a></li>
                <li><a href="/blogs/health" className="hover:text-white transition-colors">Health Blogs</a></li>
              </ul>
            </div>

            {/* Education Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Education Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/school-jobs" className="hover:text-white transition-colors">School Jobs</a></li>
                <li><a href="home-tuition" className="hover:text-white transition-colors">home-tuition</a></li>
                <li><a href="/blogs/tutors" className="hover:text-white transition-colors">Education Blogs</a></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/health" className="hover:text-white transition-colors">Health Services</a></li>
                <li><a href="/admin" className="hover:text-white transition-colors">Admin Panel</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                © 2025 Zenith Tutors. All rights reserved.
              </div>
             <div className="flex space-x-6 text-sm text-gray-400">
              {/*   <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Support</a> */}
              </div>    
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
