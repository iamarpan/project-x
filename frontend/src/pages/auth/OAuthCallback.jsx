import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const processOAuthCallback = () => {
      try {
        setLoading(true);
        
        // Parse URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('user_id');
        const userType = params.get('user_type');
        const name = params.get('name');
        
        if (!token) {
          throw new Error('No authentication token received');
        }
        
        // Store token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          id: userId,
          name: name,
          type: userType
        }));
        
        // Force page reload to refresh auth state
        window.location.href = userType === 'recruiter' 
          ? '/recruiter/dashboard' 
          : '/candidate/dashboard';
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        setLoading(false);
      }
    };
    
    // Only process if not already authenticated
    if (!currentUser) {
      processOAuthCallback();
    } else {
      // Already logged in, redirect to appropriate dashboard
      const path = currentUser.type === 'recruiter'
        ? '/recruiter/dashboard'
        : '/candidate/dashboard';
      navigate(path, { replace: true });
    }
  }, [location, navigate, currentUser]);
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Authentication Failed</h2>
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Completing authentication...</h2>
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback; 