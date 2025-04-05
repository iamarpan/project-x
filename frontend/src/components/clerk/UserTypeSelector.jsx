import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { setUserType } from '../../utils/userMetadata';

const UserTypeSelector = () => {
  const [userType, setUserType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleSelectUserType = async (selectedType) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Update the user's metadata with their selected type using the utility function
      await setUserType(user, selectedType);
      
      // Navigate to the appropriate dashboard
      if (selectedType === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      console.error('Error setting user type:', err);
      setError('Failed to set user type. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to AI Interview Assistant
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please select your role to continue
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleSelectUserType('recruiter')}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'I am a Recruiter'}
          </button>
          
          <button
            onClick={() => handleSelectUserType('candidate')}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'I am a Candidate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector; 