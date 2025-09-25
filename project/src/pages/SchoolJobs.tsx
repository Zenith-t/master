import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Phone, Mail, Briefcase } from 'lucide-react';
import { supabase } from '../contexts/SupabaseContext';

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
  created_at: string;
}

export default function SchoolJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<SchoolJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('school_jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setJobs(data);
    } catch (error) {
      console.error('Error fetching school jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-blue-600">HealthCare Plus</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">School Job Postings</h1>
          <p className="text-xl">Find teaching opportunities at reputed schools</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {jobs.length > 0 ? (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <h4 className="text-xl text-blue-600 font-semibold mb-3">{job.school_name}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <span>{job.job_type}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{job.experience_required}+ years experience required</span>
                      </div>
                      
                      {job.salary_range && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-2">💰</span>
                          <span>{job.salary_range}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Subjects:</h5>
                      <p className="text-gray-700">{job.subjects}</p>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Qualifications Required:</h5>
                      <p className="text-gray-700">{job.qualifications_required}</p>
                    </div>

                    {job.description && (
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2">Job Description:</h5>
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
                        className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call: {job.contact_phone}
                      </a>
                    )}
                    
                    {job.contact_email && (
                      <a
                        href={`mailto:${job.contact_email}`}
                        className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email: {job.contact_email}
                      </a>
                    )}
                    
                    {!job.contact_phone && !job.contact_email && (
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
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No School Jobs Available</h3>
            <p className="text-gray-500">Check back later for new job postings.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Zenith Tutors - HealthCare Plus</h3>
            <p className="text-gray-400">Connecting educators with opportunities</p>
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