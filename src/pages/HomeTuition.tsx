import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Phone, User, BookOpen } from 'lucide-react';
import { supabase } from '../contexts/SupabaseContext';
import SearchBar from '../components/SearchBar';

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
  created_at: string;
  school?: string;
  school_name?: string;
  subject?: string;
}

export default function HomeTuition() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<HomeTuitionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('home_tuition_jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setJobs(data as HomeTuitionJob[]);
    } catch (error) {
      console.error('Error fetching home tuition jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    if (!q) return jobs;
    const needle = q.toLowerCase();
    return (jobs || []).filter((j) => {
      const hay = [
        j.title || '',
        j.location || '',
        (j.subject as any) || j.subjects || '',
        j.student_class || '',
        j.description || '',
        j.school || j.school_name || ''
      ].join(' ').toLowerCase();
      return hay.includes(needle);
    });
  }, [jobs, q]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-blue-600">Zenith Health</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Home Tuition Postings</h1>
          <p className="text-xl">Find home tutoring opportunities near you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-6">
          <SearchBar value={q} onChange={setQ} placeholder="Search by title, subject, class, location..." />
        </div>

        {filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                      {job.student_class}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">💰</span>
                        <span>₹{job.hourly_rate}/hour</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{job.experience_required}+ years experience required</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span>Preferred: {job.preferred_gender}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Subjects:</h5>
                      <div className="flex items-center text-gray-700">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>{job.subjects}</span>
                      </div>
                    </div>

                    {job.schedule && (
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2">Schedule:</h5>
                        <p className="text-gray-700">{job.schedule}</p>
                      </div>
                    )}

                    {job.description && (
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2">Additional Details:</h5>
                        <p className="text-gray-700">{job.description}</p>
                      </div>
                    )}

                    <div className="text-sm text-gray-500">
                      Posted on {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {job.contact_phone && (
                      <a
                        href={`tel:${job.contact_phone}`}
                        className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call {job.contact_name ? job.contact_name : 'Parent'}: {job.contact_phone}
                      </a>
                    )}

                    {job.contact_phone && (
                      <a
                        href={`https://wa.me/917678229653?text=I%20am%20interested%20to%20know%20about%20${encodeURIComponent(job.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109"/>
                        </svg>
                        WhatsApp
                      </a>
                    )}

                    {!job.contact_phone && (
                      <div className="text-center py-3 text-gray-500">
                        Contact information not available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Home Tuition Jobs Available</h3>
            <p className="text-gray-500">Try different search keywords.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Zenith Tutors - Zenith Health</h3>
            <p className="text-gray-400">Connecting tutors with students</p>
            <div className="mt-4 flex justify-center items-center">
              <Phone className="h-5 w-5 mr-2" />
              <span>Contact: +91 7678229653</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
