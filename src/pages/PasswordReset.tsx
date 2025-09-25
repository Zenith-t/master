import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useSupabase } from '../contexts/SupabaseContext';

export default function PasswordReset() {
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  // Handle session setup from URL parameters
  useEffect(() => {
    const setupSession = async () => {
      try {
        console.log('Current URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        console.log('Search params:', window.location.search);
        
        // Check if we have the hash fragment
        const hash = window.location.hash;
        const search = window.location.search;
        
        // Try hash parameters first (most common)
        if (hash && (hash.includes('access_token') || hash.includes('token'))) {
          // Parse hash parameters
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token') || hashParams.get('token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');
          
          console.log('Hash params - Access token:', accessToken ? 'Found' : 'Not found');
          console.log('Hash params - Refresh token:', refreshToken ? 'Found' : 'Not found');
          console.log('Hash params - Type:', type);
          
          if (accessToken && (type === 'recovery' || !type)) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (error) {
              console.error('Session setup error:', error);
              setError(`Session setup failed: ${error.message}. Please request a new password reset.`);
              setTimeout(() => navigate('/admin'), 3000);
            } else if (data.session) {
              console.log('Session established successfully');
              setSessionReady(true);
            }
          } else {
            setError(`Missing required parameters. Found: access_token=${!!accessToken}, type=${type}. Please request a new password reset.`);
            setTimeout(() => navigate('/admin'), 3000);
          }
        } 
        // Try search parameters as fallback
        else if (search && (search.includes('access_token') || search.includes('token') || search.includes('code'))) {
          // Check URL search params as fallback
          const accessToken = searchParams.get('access_token') || searchParams.get('token');
          const refreshToken = searchParams.get('refresh_token');
          const type = searchParams.get('type');
          const code = searchParams.get('code');
          
          console.log('Search params - Access token:', accessToken ? 'Found' : 'Not found');
          console.log('Search params - Refresh token:', refreshToken ? 'Found' : 'Not found');
          console.log('Search params - Type:', type);
          console.log('Search params - Code:', code ? 'Found' : 'Not found');
          
          if (code) {
            // Handle OAuth code flow
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
              console.error('Code exchange error:', error);
              setError(`Code exchange failed: ${error.message}. Please request a new password reset.`);
              setTimeout(() => navigate('/admin'), 3000);
            } else if (data.session) {
              console.log('Session established via code exchange');
              setSessionReady(true);
            }
          } else if (accessToken && (type === 'recovery' || !type)) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (error) {
              console.error('Session setup error:', error);
              setError(`Session setup failed: ${error.message}. Please request a new password reset.`);
              setTimeout(() => navigate('/admin'), 3000);
            } else if (data.session) {
              console.log('Session established successfully');
              setSessionReady(true);
            }
          } else {
            setError(`Missing required parameters in search. Found: access_token=${!!accessToken}, type=${type}, code=${!!code}. Please request a new password reset.`);
            setTimeout(() => navigate('/admin'), 3000);
          }
        } else {
          setError('No reset parameters found in URL. Please click the reset link from your email again.');
          setTimeout(() => navigate('/admin'), 3000);
        }
      } catch (err) {
        console.error('Setup session error:', err);
        setError(`Failed to process reset link: ${err}. Please request a new password reset.`);
        setTimeout(() => navigate('/admin'), 3000);
      }
    };

    setupSession();
  }, [searchParams, supabase.auth, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if session is ready
    if (!sessionReady) {
      setError('Session not ready. Please wait or try clicking the reset link again.');
      setLoading(false);
      return;
    }

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'your-supabase-url') {
        setError('Please connect to Supabase first using the "Connect to Supabase" button in the top right corner.');
        setLoading(false);
        return;
      }

      // Verify we have a valid session before updating password
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('No active session found. Please click the reset link again.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        if (error.message.includes('Auth session missing')) {
          setError('Session expired. Please request a new password reset link.');
        } else {
          setError(error.message);
        }
      } else {
        setSuccess(true);
        // Redirect to admin dashboard after 3 seconds
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while setting up session
  if (!sessionReady && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Setting up session...</h2>
          <p className="text-gray-600 mb-6">Please wait while we verify your reset link.</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully updated. You will be redirected to the admin dashboard shortly.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="text-gray-600 mt-2">Enter your new password below</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !sessionReady}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/admin')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to Login
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-md text-sm text-gray-600">
          <p><strong>Password Requirements:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>At least 6 characters long</li>
            <li>Use a strong, unique password</li>
            <li>Consider using a password manager</li>
          </ul>
          
          {!sessionReady && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
              <p className="text-xs font-semibold">Session Status: Not Ready</p>
              <p className="text-xs mt-1">Please wait for the session to be established or click the reset link again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}