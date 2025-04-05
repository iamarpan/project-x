import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const statusStyles = {
  pending: {
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    icon: ClockIcon,
    label: 'Pending'
  },
  scheduled: {
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    icon: CalendarIcon,
    label: 'Scheduled'
  },
  in_progress: {
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-200',
    icon: ArrowPathIcon,
    label: 'In Progress'
  },
  completed: {
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    icon: CheckCircleIcon,
    label: 'Completed'
  },
  expired: {
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
    icon: ExclamationTriangleIcon,
    label: 'Expired'
  }
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const Interviews = () => {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        // In a real application, this would be an API call to fetch interviews
        // For this example, we're using mock data
        // const response = await axios.get('/api/interviews/candidate');
        
        // Mock data for demonstration
        const mockInterviews = [
          {
            id: 1,
            title: 'Frontend Developer Interview',
            company: 'TechCorp Inc.',
            template: 'Frontend Technical Assessment',
            status: 'scheduled',
            scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
            due_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
            recruiter: 'Sarah Williams',
            description: 'Technical interview for Frontend Developer position. Focus on React, JavaScript, and CSS.'
          },
          {
            id: 2,
            title: 'UX Designer Interview',
            company: 'DesignHub',
            template: 'UX Design Assessment',
            status: 'pending',
            scheduled_at: null,
            due_date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
            recruiter: 'Alex Johnson',
            description: 'Interview to assess UX design skills, portfolio review, and problem-solving capabilities.'
          },
          {
            id: 3,
            title: 'Backend Developer Interview',
            company: 'DataSystems Ltd.',
            template: 'Backend Technical Assessment',
            status: 'completed',
            scheduled_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
            completed_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            recruiter: 'Michael Smith',
            description: 'Assessment of backend development skills including API design, database knowledge, and system architecture.'
          },
          {
            id: 4,
            title: 'Product Manager Interview',
            company: 'ProductVision Co.',
            template: 'Product Management Assessment',
            status: 'in_progress',
            scheduled_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            due_date: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
            recruiter: 'Jessica Lee',
            description: 'Comprehensive assessment of product management skills, strategy development, and execution capabilities.'
          },
          {
            id: 5,
            title: 'DevOps Engineer Interview',
            company: 'CloudOps Solutions',
            template: 'DevOps Technical Assessment',
            status: 'expired',
            scheduled_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
            due_date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
            recruiter: 'Robert Chen',
            description: 'Technical assessment for DevOps Engineer position focusing on CI/CD, cloud infrastructure, and automation.'
          }
        ];

        setInterviews(mockInterviews);
      } catch (err) {
        console.error('Error fetching interviews:', err);
        setError('Failed to load your interviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [user]);

  const filteredInterviews = interviews.filter(interview => {
    if (activeTab === 'all') return true;
    return interview.status === activeTab;
  });

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-bold leading-6 text-gray-900">My Interviews</h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link
            to="/candidate/dashboard"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <ArrowRightIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Interview filters">
          <button
            onClick={() => setActiveTab('all')}
            className={`${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All Interviews
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`${
              activeTab === 'scheduled'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`${
              activeTab === 'pending'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`${
              activeTab === 'in_progress'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`${
              activeTab === 'completed'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Completed
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <ArrowPathIcon className="animate-spin h-10 w-10 text-primary-500" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-20">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No interviews found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'all' 
                ? "You don't have any interviews yet." 
                : `You don't have any ${activeTab === 'in_progress' ? 'in progress' : activeTab} interviews.`}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredInterviews.map((interview) => {
              const statusConfig = statusStyles[interview.status];
              const StatusIcon = statusConfig.icon;
              
              return (
                <li key={interview.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{interview.title}</h3>
                        <p className="text-sm text-gray-500">{interview.company}</p>
                      </div>
                      <div className={`${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {statusConfig.label}
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Recruiter</dt>
                          <dd className="mt-1 text-sm text-gray-900">{interview.recruiter}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Template</dt>
                          <dd className="mt-1 text-sm text-gray-900">{interview.template}</dd>
                        </div>
                        {interview.scheduled_at && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Scheduled Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDateTime(interview.scheduled_at)}</dd>
                          </div>
                        )}
                        {interview.due_date && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDateTime(interview.due_date)}</dd>
                          </div>
                        )}
                        {interview.completed_at && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Completed On</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDateTime(interview.completed_at)}</dd>
                          </div>
                        )}
                      </dl>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">{interview.description}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      {interview.status === 'scheduled' && (
                        <Link
                          to={`/interview/${interview.id}`}
                          className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                        >
                          Start Interview
                        </Link>
                      )}
                      {interview.status === 'in_progress' && (
                        <Link
                          to={`/interview/${interview.id}`}
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                          Continue Interview
                        </Link>
                      )}
                      {interview.status === 'completed' && (
                        <Link
                          to={`/candidate/interview-results/${interview.id}`}
                          className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                        >
                          View Results
                        </Link>
                      )}
                      {interview.status === 'pending' && (
                        <Link
                          to={`/candidate/interview-details/${interview.id}`}
                          className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                        >
                          View Details
                        </Link>
                      )}
                      {interview.status === 'expired' && (
                        <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700">
                          Expired
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Interviews; 