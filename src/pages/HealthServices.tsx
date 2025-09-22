import React, { useState, useEffect } from 'react';
import { Star, Phone, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../contexts/SupabaseContext';
import { RatingsCounter } from '../utils/ratingsCounter';

interface Clinic {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  phone?: string;
  address?: string;
}

interface Hospital {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  phone?: string;
  address?: string;
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
}

export default function HealthServices() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [diagnosticCenters, setDiagnosticCenters] = useState<DiagnosticCenter[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [clinicsRes, hospitalsRes, diagnosticRes] = await Promise.all([
        supabase.from('clinics').select('*').eq('is_active', true),
        supabase.from('hospitals').select('*').eq('is_active', true),
        supabase.from('diagnostic_centers').select('*').eq('is_active', true)
      ]);

      if (clinicsRes.data) setClinics(clinicsRes.data);
      if (hospitalsRes.data) setHospitals(hospitalsRes.data);
      if (diagnosticRes.data) setDiagnosticCenters(diagnosticRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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

  const ServiceCard = ({ service, type }: { service: any; type: string }) => (
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
          <p className="text-blue-600 font-medium mb-2">{service.specialization}</p>
          
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
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-semibold text-blue-600">Call: +91 9871199768</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Health Services</h1>
          <p className="text-xl">Find the best healthcare providers near you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Clinics Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Clinics</h2>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics.length > 0 ? (
              clinics.map((clinic) => (
                <ServiceCard key={clinic.id} service={clinic} type="clinic" />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No clinics available at the moment</p>
              </div>
            )}
          </div>
        </section>

        {/* Hospitals Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hospitals</h2>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.length > 0 ? (
              hospitals.map((hospital) => (
                <ServiceCard key={hospital.id} service={hospital} type="hospital" />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No hospitals available at the moment</p>
              </div>
            )}
          </div>
        </section>

        {/* Diagnostic Centers Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Diagnostic Centers</h2>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagnosticCenters.length > 0 ? (
              diagnosticCenters.map((center) => (
                <ServiceCard key={center.id} service={center} type="diagnostic" />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No diagnostic centers available at the moment</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">HealthCare Plus</h3>
            <p className="text-gray-400">Your trusted healthcare partner</p>
            <div className="mt-4 flex justify-center items-center">
              <Phone className="h-5 w-5 mr-2" />
              <span>Emergency: +91 7678229653</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}