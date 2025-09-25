import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { useSupabase } from '../contexts/SupabaseContext';

const PasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    const errorParam = searchParams.get('error');

    console.log('URL Parameters:', { accessToken, refreshToken, type, errorParam });

    if (errorParam) {
      setError('Invalid or expired reset link. Please request a new password reset.');
      return;
    }

    if (type === 'recovery' && accessToken && refreshToken) {
      // Set the session with the tokens from URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ data, error }) => {
        if (error) {
          console.error('Session error:', error);
          setError('Invalid or expired reset link. Please request a new password reset.');
        } else {
          console.log('Session set successfully:', data);
        }
      });
    } else if (!accessToken || !refreshToken) {
=======
    // Handle hash fragments (#access_token) for Supabase reset links
    const hash = window.location.hash.substring(1); // Remove '#' from hash
    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get('access_token') || searchParams.get('access_token') || searchParams.get('token');
    const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token') || searchParams.get('refresh');
    const type = hashParams.get('type') || searchParams.get('type');
    const errorParam = hashParams.get('error') || searchParams.get('error');
    const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

    console.log('Hash Parameters:', Object.fromEntries(hashParams));
    console.log('Search Parameters:', Object.fromEntries(searchParams));
    console.log('Parsed Parameters:', { accessToken, refreshToken, type, errorParam, errorDescription });

    if (errorParam || errorDescription) {
      setError(`Reset link error: ${errorDescription || errorParam}. Please request a new password reset.`);
      return;
    }

    if (accessToken && refreshToken && type === 'recovery') {
      // Set session with tokens
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ data, error }) => {
        if (error) {
          console.error('Session set error:', error);
          setError(`Session error: ${error.message}. Please request a new password reset.`);
        } else {
          console.log('Session set successfully:', data);
          // Verify session
          supabase.auth.getSession().then(({ data: sessionData, error: sessionError }) => {
            if (sessionError || !sessionData.session) {
              console.error('Session verification failed:', sessionError);
              setError('Invalid or expired reset link. Please try again.');
            } else {
              console.log('Session verified:', sessionData.session);
              // Clean URL for security
              window.history.replaceState({}, document.title, '/password-reset');
            }
          });
        }
      });
    } else {
      console.log('Missing tokens in URL or hash');
>>>>>>> 4438176d7af52e6d26aca0b60d619ba08c3a3c06
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
<<<<<<< HEAD
      // Check if user has a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setError('Invalid or expired reset link. Please request a new password reset.');
=======
      console.log('Attempting password update...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Current session:', { session, sessionError });

      if (sessionError || !session) {
        setError('No active session. Please request a new password reset link.');
>>>>>>> 4438176d7af52e6d26aca0b60d619ba08c3a3c06
        setLoading(false);
        return;
      }

<<<<<<< HEAD
      console.log('Current session:', session);

      // Update password
      const { data, error } = await supabase.auth.updateUser({
        password: password
=======
      const { data, error } = await supabase.auth.updateUser({
        password: password,
>>>>>>> 4438176d7af52e6d26aca0b60d619ba08c3a3c06
      });

      console.log('Update response:', { data, error });

      if (error) {
<<<<<<< HEAD
        setError(error.message || 'Failed to update password');
=======
        console.error('Password update error:', error);
        setError(`Failed to update password: ${error.message}`);
>>>>>>> 4438176d7af52e6d26aca0b60d619ba08c3a3c06
      } else {
        console.log('Password updated successfully:', data);
        setSuccess(true);
<<<<<<< HEAD
        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      }
    } catch (err) {
      console.error('Password update error:', err);
=======
        setTimeout(() => navigate('/admin'), 2000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
>>>>>>> 4438176d7af52e6d26aca0b60d619ba08c3a3c06
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Password Updated!</h1>
            <p className="text-gray-600">
              Your password has been successfully updated. Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/admin')}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;