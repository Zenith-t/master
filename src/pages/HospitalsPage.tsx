import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Phone, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '../contexts/SupabaseContext';
import { RatingsCounter } from '../utils/ratingsCounter';

interface Hospital {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  phone?: string;
  address?: string;
  image_url?: string;
}

export default function HospitalsPage() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      if (data) setHospitals(data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
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
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-semibold text-blue-600">Call: +91 9871199768</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Hospitals</h1>
          <p className="text-xl">Find the best hospitals near you</p>
        </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <div key={hospital.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                <div className="flex gap-4">
                  {/* Image Section */}
                  <div className="flex-shrink-0">
                    {hospital.image_url ? (
                      <img
                        src={hospital.image_url}
                        alt={hospital.name}
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{hospital.name}</h3>
                    <p className="text-red-600 font-medium mb-2">{hospital.specialization}</p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex">{renderStars(hospital.rating)}</div>
                      <span className="ml-2 text-sm text-gray-600">
                        ({RatingsCounter.formatCount(RatingsCounter.getRatingCount(hospital.id))} reviews)
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{hospital.experience} years experience</span>
                    </div>

                    {hospital.address && (
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{hospital.address}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      {hospital.phone && (
                        <a
                          href={`tel:${hospital.phone}`}
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No hospitals available at the moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">HealthCare Plus</h3>
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
                <li><a href="/health" className="hover:text-white transition-colors">Our Clinics</a></li>
                <li><a href="/health" className="hover:text-white transition-colors">Hospitals</a></li>
                <li><a href="/health" className="hover:text-white transition-colors">Diagnostic Centers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Health Blogs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Book Appointment</a></li>
              </ul>
            </div>

            {/* Education Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Education Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Zenit Tutors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Online Classes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Study Materials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Education Blogs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Tutors</a></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/health" className="hover:text-white transition-colors">Health Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/admin" className="hover:text-white transition-colors">Admin Panel</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                © 2024 HealthCare Plus. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}