import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, DocumentTextIcon, HomeIcon } from '@heroicons/react/24/outline';

const InterviewComplete = () => {
  // In a real app, this would be fetched from an API or passed via navigation state
  const mockInterviewData = {
    title: 'Frontend Developer Technical Screen',
    company: 'Tech Innovations Inc.',
    position: 'Senior Frontend Developer',
    completedAt: new Date().toISOString()
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Interview Complete</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircleIcon className="h-8 w-8 text-green-600" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
              Thank You!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your interview has been successfully submitted
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            <div className="rounded-md bg-gray-50 p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Interview</span>
                  <span className="text-sm font-medium text-gray-900">{mockInterviewData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Company</span>
                  <span className="text-sm font-medium text-gray-900">{mockInterviewData.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Position</span>
                  <span className="text-sm font-medium text-gray-900">{mockInterviewData.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Completed</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(mockInterviewData.completedAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center">
                Your responses are being processed. The recruiter will review your interview and get back to you soon.
              </p>
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <Link
                  to="/dashboard"
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Return to Dashboard
                </Link>
                
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Print Confirmation
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 text-center">
            <div className="text-xs text-gray-500">
              Interview ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} AI Interview Assistant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InterviewComplete; 