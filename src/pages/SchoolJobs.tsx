import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Phone, Building2, GraduationCap } from 'lucide-react';
import { supabase } from '../contexts/SupabaseContext';
import SearchBar from '../components/SearchBar';

interface SchoolJob {
  id: string;
  title: string;
  school_name?: string;
  location?: string;
  subject?: string;
  job_type?: string;
  salary_range?: string;
  qualifications_required?: string;
  description?: string;
  contact_phone?: string;
  contact_name?: string;
  created_at: string;
}

export default function SchoolJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<SchoolJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

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
      if (data) setJobs(data as SchoolJob[]);
    } catch (error) {
      console.error('Error fetching school jobs:', error);
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
        j.school_name || '',
        j.location || '',
        j.subject || '',
        j.job_type || '',
        j.salary_range || '',
        j.qualifications_required || '',
        j.description || ''
      ].join(' ').toLowerCase();
      return hay.includes(needle);
    });
  }, [jobs, q]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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

      {/* Hero */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-2">School Jobs</h1>
          <p className="text-lg opacity-90">Browse latest vacancies in schools near you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-6">
          <SearchBar value={q} onChange={setQ} placeholder="Search by title, school, subject, location..." />
        </div>

        {filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                <div className="flex flex-col gap-2">
                  <div className="text-2xl font-bold text-gray-900">{job.title}</div>
                  <div className="flex flex-wrap gap-3 text-gray-700">
                    {job.school_name && (
                      <span className="inline-flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> {job.school_name}
                      </span>
                    )}
                    {job.location && (
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {job.location}
                      </span>
                    )}
                    {job.subject && (
                      <span className="inline-flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" /> {job.subject}
                      </span>
                    )}
                    {job.job_type && (
                      <span className="inline-flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> {job.job_type}
                      </span>
                    )}
                    {job.salary_range && (
                      <span className="inline-flex items-center gap-2">💰 {job.salary_range}</span>
                    )}
                  </div>

                  {job.qualifications_required && (
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Qualifications:</span> {job.qualifications_required}
                    </div>
                  )}
                  {job.description && (
                    <p className="text-sm text-gray-700">{job.description}</p>
                  )}

                  <div className="text-xs text-gray-500">
                    Posted on {new Date(job.created_at).toLocaleDateString()}
                  </div>

                  <div className="pt-3 flex flex-wrap gap-3">
                    {job.contact_phone && (
                      <a
                        href={`tel:${job.contact_phone}`}
                        className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call {job.contact_name ? job.contact_name : 'School'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No jobs found. Try different keywords.</div>
        )}
      </div>
    </div>
  );
}
