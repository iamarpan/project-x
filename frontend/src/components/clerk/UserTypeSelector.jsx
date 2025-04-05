import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { setUserType } from '../../utils/userMetadata';

const UserTypeSelector = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const { signOut } = useClerk();
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with sign-out button */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">AI Interview Assistant</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.firstName} {user?.lastName}
            </span>
            <button 
              onClick={() => signOut()} 
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Welcome to AI Interview Assistant</h2>
            <p className="mt-2 text-lg text-gray-600">Please select your role to continue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recruiter Card */}
            <div 
              onClick={() => !isLoading && handleSelectUserType('recruiter')} 
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'border-transparent hover:border-primary-500'}`}
            >
              <div className="p-8">
                <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Recruiter</h3>
                <p className="text-gray-600 text-center">Create interviews, manage candidates, and review results</p>
                <div className="mt-6">
                  <button 
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-150"
                  >
                    {isLoading ? 'Processing...' : 'Select Recruiter Role'}
                  </button>
                </div>
              </div>
            </div>

            {/* Candidate Card */}
            <div 
              onClick={() => !isLoading && handleSelectUserType('candidate')} 
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'border-transparent hover:border-primary-500'}`}
            >
              <div className="p-8">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Candidate</h3>
                <p className="text-gray-600 text-center">Take interviews and advance your career opportunities</p>
                <div className="mt-6">
                  <button 
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-150"
                  >
                    {isLoading ? 'Processing...' : 'Select Candidate Role'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 px-6 border-t">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-500 text-center">© 2023 AI Interview Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserTypeSelector; 