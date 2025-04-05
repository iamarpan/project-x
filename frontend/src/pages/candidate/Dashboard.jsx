import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheckIcon, 
  ClockIcon, 
  ArrowRightIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';

// Mock data for interviews
const pendingInterviews = [
  {
    id: 'int1',
    company: 'TechCorp',
    position: 'Senior Frontend Developer',
    dueDate: '2025-04-20',
    status: 'pending',
    type: 'Technical Assessment',
  },
  {
    id: 'int2',
    company: 'Design Studio',
    position: 'UX/UI Designer',
    dueDate: '2025-04-15',
    status: 'pending',
    type: 'Design Challenge',
  },
];

const completedInterviews = [
  {
    id: 'int3',
    company: 'Software Solutions',
    position: 'JavaScript Developer',
    completedDate: '2025-03-30',
    status: 'completed',
    type: 'Coding Skills',
    feedback: {
      strengths: ['Strong problem-solving abilities', 'Excellent JavaScript knowledge'],
      improvements: ['Could improve CSS skills'],
      overallScore: 4.2,
    },
  },
  {
    id: 'int4',
    company: 'Tech Innovations',
    position: 'React Developer',
    completedDate: '2025-03-25',
    status: 'completed',
    type: 'Framework Knowledge',
    feedback: {
      strengths: ['Exceptional React expertise', 'Great communication'],
      improvements: ['More focus on testing would be beneficial'],
      overallScore: 4.5,
    },
  },
];

const CandidateDashboard = () => {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Candidate Dashboard</h1>
      
      {/* Welcome Message */}
      <Card className="mb-6 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-bold">Welcome back, John!</h2>
          <p className="mt-1">
            You have {pendingInterviews.length} pending interviews. Complete them before the due date to improve your chances.
          </p>
        </div>
      </Card>
      
      {/* Pending Interviews */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">Pending Interviews</h2>
          <Link to="/candidate/interviews" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </Link>
        </div>
        
        {pendingInterviews.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {pendingInterviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-100 rounded-md p-2">
                        <ClockIcon className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">{interview.position}</h3>
                        <p className="text-sm text-gray-500">{interview.company}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Type: {interview.type}</p>
                        <p className="text-sm text-gray-500">Due: {interview.dueDate}</p>
                      </div>
                      <Link
                        to={`/interview/${interview.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Start Interview
                        <ArrowRightIcon className="ml-2 -mr-0.5 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50">
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">You have no pending interviews</p>
            </div>
          </Card>
        )}
      </div>
      
      {/* Completed Interviews */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">Completed Interviews</h2>
          <Link to="/candidate/interviews" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </Link>
        </div>
        
        {completedInterviews.length > 0 ? (
          <div className="space-y-4">
            {completedInterviews.map((interview) => (
              <Card key={interview.id} className="overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{interview.position}</h3>
                      <p className="text-sm text-gray-500">{interview.company}</p>
                    </div>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
                
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Interview Details</h4>
                      <p className="mt-1 text-sm text-gray-900">Type: {interview.type}</p>
                      <p className="mt-1 text-sm text-gray-900">Completed: {interview.completedDate}</p>
                      <div className="mt-2 flex items-center">
                        <p className="text-sm text-gray-900 mr-2">Overall Score:</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(interview.feedback.overallScore)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 15.585l-6.327 3.323a1 1 0 01-1.45-1.054l1.208-7.04-5.118-4.986a1 1 0 01.555-1.705l7.075-1.027 3.157-6.404a1 1 0 011.79 0l3.157 6.404 7.075 1.027a1 1 0 01.555 1.705l-5.118 4.986 1.208 7.04a1 1 0 01-1.45 1.054L10 15.585z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                          <span className="ml-1 text-sm text-gray-500">
                            ({interview.feedback.overallScore.toFixed(1)})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Strengths</h4>
                      <ul className="mt-1 space-y-1">
                        {interview.feedback.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Areas for Improvement</h4>
                      <ul className="mt-1 space-y-1">
                        {interview.feedback.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start">
                            <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View Full Report
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50">
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">You have no completed interviews</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard; 