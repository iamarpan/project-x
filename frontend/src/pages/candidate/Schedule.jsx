import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { 
  CalendarIcon, 
  ClockIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  PlusIcon,
  BellIcon,
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const dayDifference = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const differenceTime = targetDate - today;
  const differenceDays = Math.ceil(differenceTime / (1000 * 60 * 60 * 24));
  
  if (differenceDays === 0) return 'Today';
  if (differenceDays === 1) return 'Tomorrow';
  if (differenceDays > 1 && differenceDays < 7) return `In ${differenceDays} days`;
  return formatDate(date);
};

const Schedule = () => {
  const { user } = useUser();
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('upcoming');

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call to fetch interview schedule
        // For this demo, we're using mock data
        
        // Mock data for demonstration
        const mockInterviews = [
          {
            id: 1,
            title: 'Frontend Developer Interview',
            company: 'TechCorp Inc.',
            status: 'scheduled',
            scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
            duration: 60, // minutes
            recruiter: 'Sarah Williams',
            description: 'Technical interview for Frontend Developer position. Focus on React, JavaScript, and CSS.',
            location: 'Virtual (Zoom)',
            link: 'https://zoom.us/j/1234567890',
            reminder_set: true
          },
          {
            id: 4,
            title: 'Product Manager Interview',
            company: 'ProductVision Co.',
            status: 'scheduled',
            scheduled_at: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
            duration: 45, // minutes
            recruiter: 'Jessica Lee',
            description: 'Comprehensive assessment of product management skills, strategy development, and execution capabilities.',
            location: 'Virtual (Teams)',
            link: 'https://teams.microsoft.com/l/meetup-join/123456',
            reminder_set: false
          },
          {
            id: 6,
            title: 'Data Scientist - First Round',
            company: 'AnalyticsPro Inc.',
            status: 'scheduled',
            scheduled_at: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
            duration: 90, // minutes
            recruiter: 'David Chen',
            description: 'Technical assessment focusing on machine learning, statistics, and data analysis skills.',
            location: 'Phone Call',
            link: null,
            reminder_set: true
          },
          {
            id: 7,
            title: 'Marketing Specialist Interview',
            company: 'GrowthMarketing Ltd.',
            status: 'scheduled',
            scheduled_at: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
            duration: 60, // minutes
            recruiter: 'Amanda Wilson',
            description: 'Interview for the Marketing Specialist position. Discussion about previous campaigns, growth strategies, and analytical skills.',
            location: 'Virtual (Google Meet)',
            link: 'https://meet.google.com/abc-defg-hij',
            reminder_set: false
          }
        ];

        // Sort interviews by date (closest first)
        const sortedInterviews = mockInterviews.sort((a, b) => 
          new Date(a.scheduled_at) - new Date(b.scheduled_at)
        );

        setUpcomingInterviews(sortedInterviews);
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError('Failed to load your schedule. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [user]);

  // Filter interviews based on selected timeframe
  const filteredInterviews = upcomingInterviews.filter(interview => {
    const interviewDate = new Date(interview.scheduled_at);
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);

    if (timeframe === 'upcoming') return true;
    if (timeframe === 'week') return interviewDate <= oneWeekFromNow;
    if (timeframe === 'month') return interviewDate <= oneMonthFromNow;
    return true;
  });

  const toggleReminder = (id) => {
    setUpcomingInterviews(prev => 
      prev.map(interview => 
        interview.id === id 
        ? { ...interview, reminder_set: !interview.reminder_set } 
        : interview
      )
    );
  };

  const addToCalendar = (interview) => {
    // In a real app, this would generate a calendar event (e.g., ICS file or Google Calendar link)
    // For this demo, we'll just show an alert
    alert(`Added "${interview.title}" to your calendar`);
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-bold leading-6 text-gray-900">My Schedule</h3>
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

      {/* Time frame selector */}
      <div className="mt-6 mb-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <p className="mt-1 text-sm text-gray-500">
              View and manage your upcoming interview schedule.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setTimeframe('upcoming')}
                className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ${
                  timeframe === 'upcoming'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                }`}
              >
                All Upcoming
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('week')}
                className={`relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold ${
                  timeframe === 'week'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('month')}
                className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ${
                  timeframe === 'month'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                }`}
              >
                This Month
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Timeline */}
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
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No interviews scheduled</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any interviews scheduled for this time period.
          </p>
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {filteredInterviews.map((interview, interviewIdx) => (
              <li key={interview.id}>
                <div className="relative pb-8">
                  {interviewIdx !== filteredInterviews.length - 1 ? (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full ring-8 ring-white">
                        <CalendarIcon className="w-5 h-5 text-blue-600" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 bg-white p-4 rounded-lg shadow">
                      <div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-primary-600">
                            {dayDifference(interview.scheduled_at)}
                          </p>
                          <span className="text-sm text-gray-500 whitespace-nowrap">
                            {formatTime(interview.scheduled_at)}
                            {interview.duration && ` (${interview.duration} min)`}
                          </span>
                        </div>
                        <div className="mt-1">
                          <h3 className="text-lg font-semibold text-gray-900">{interview.title}</h3>
                          <p className="text-sm text-gray-500">{interview.company}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3 text-sm text-gray-500">
                            <p>{formatDate(interview.scheduled_at)} at {formatTime(interview.scheduled_at)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <ArrowRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3 text-sm text-gray-500">
                            <p>{interview.location}</p>
                          </div>
                        </div>
                        
                        {interview.recruiter && (
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                            </div>
                            <div className="ml-3 text-sm text-gray-500">
                              <p>Interviewer: {interview.recruiter}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => toggleReminder(interview.id)}
                            className={`inline-flex items-center px-3 py-1.5 border ${
                              interview.reminder_set
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            } text-xs font-medium rounded-md`}
                          >
                            <BellIcon className={`-ml-0.5 mr-1.5 h-4 w-4 ${interview.reminder_set ? 'text-indigo-500' : 'text-gray-400'}`} aria-hidden="true" />
                            {interview.reminder_set ? 'Reminder Set' : 'Set Reminder'}
                          </button>
                          <button
                            type="button"
                            onClick={() => addToCalendar(interview)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 bg-white text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50"
                          >
                            <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                            Add to Calendar
                          </button>
                        </div>
                        <div>
                          {interview.link && (
                            <a
                              href={interview.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 border border-green-500 bg-green-50 text-green-700 text-xs font-medium rounded-md hover:bg-green-100"
                            >
                              <ArrowTopRightOnSquareIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-green-500" aria-hidden="true" />
                              Join Interview
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Schedule; 