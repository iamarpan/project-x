import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  CalendarIcon,
  ClockIcon,
  CheckBadgeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Mock data for interviews
const MOCK_INTERVIEWS = [
  {
    id: '123',
    candidate: {
      id: 'cand-123',
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@example.com',
      avatar: null
    },
    position: 'Senior Frontend Developer',
    template: {
      id: 'temp-456',
      title: 'Frontend Developer Technical Interview'
    },
    status: 'completed',
    completedAt: '2023-06-05T14:30:00Z',
    reviewStatus: 'pending',
    overallScore: 78
  },
  {
    id: '124',
    candidate: {
      id: 'cand-124',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      avatar: null
    },
    position: 'UX Designer',
    template: {
      id: 'temp-457',
      title: 'UX Design Portfolio Review'
    },
    status: 'completed',
    completedAt: '2023-06-04T16:45:00Z',
    reviewStatus: 'pending',
    overallScore: 85
  },
  {
    id: '125',
    candidate: {
      id: 'cand-125',
      firstName: 'Robert',
      lastName: 'Chen',
      email: 'robert.chen@example.com',
      avatar: null
    },
    position: 'Backend Developer',
    template: {
      id: 'temp-458',
      title: 'Backend Technical Assessment'
    },
    status: 'completed',
    completedAt: '2023-06-03T11:20:00Z',
    reviewStatus: 'reviewed',
    overallScore: 92
  },
  {
    id: '126',
    candidate: {
      id: 'cand-126',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@example.com',
      avatar: null
    },
    position: 'Product Manager',
    template: {
      id: 'temp-459',
      title: 'Product Management Case Study'
    },
    status: 'completed',
    completedAt: '2023-06-02T13:15:00Z',
    reviewStatus: 'pending',
    overallScore: 76
  },
  {
    id: '127',
    candidate: {
      id: 'cand-127',
      firstName: 'James',
      lastName: 'Miller',
      email: 'james.miller@example.com',
      avatar: null
    },
    position: 'DevOps Engineer',
    template: {
      id: 'temp-460',
      title: 'DevOps Technical Interview'
    },
    status: 'completed',
    completedAt: '2023-06-01T10:00:00Z',
    reviewStatus: 'reviewed',
    overallScore: 81
  }
];

const Reviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    // Simulate API call to fetch interviews
    setLoading(true);
    
    setTimeout(() => {
      try {
        setInterviews(MOCK_INTERVIEWS);
        setLoading(false);
      } catch (err) {
        setError('Failed to load interviews. Please try again.');
        setLoading(false);
      }
    }, 800);
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter and sort interviews
  const filteredInterviews = interviews
    .filter(interview => {
      // Filter by search query
      const candidateName = `${interview.candidate.firstName} ${interview.candidate.lastName}`.toLowerCase();
      const position = interview.position.toLowerCase();
      const template = interview.template.title.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      
      const matchesSearch = !searchQuery || 
        candidateName.includes(searchLower) || 
        position.includes(searchLower) || 
        template.includes(searchLower);
      
      // Filter by review status
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'pending' && interview.reviewStatus === 'pending') || 
        (filterStatus === 'reviewed' && interview.reviewStatus === 'reviewed');
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by completion date
      if (sortOrder === 'newest') {
        return new Date(b.completedAt) - new Date(a.completedAt);
      } else {
        return new Date(a.completedAt) - new Date(b.completedAt);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading interviews...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XCircleIcon className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-2 text-lg font-medium text-gray-900">Error</h2>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Candidate Interview Reviews
          </h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search, filters, and actions */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <div className="mt-1 flex rounded-md shadow-sm max-w-lg">
              <div className="relative flex-grow focus-within:z-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                  placeholder="Search by candidate, position, or template"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  id="filter-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => {
                    // Toggle filter dropdown in real implementation
                  }}
                >
                  <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Filter: {filterStatus === 'all' ? 'All' : filterStatus === 'pending' ? 'Pending' : 'Reviewed'}
                  <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              {/* Filter Dropdown Menu - would be implemented with useState toggle */}
              <div className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="filter-menu">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    onClick={() => setFilterStatus('pending')}
                  >
                    Pending Review
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    onClick={() => setFilterStatus('reviewed')}
                  >
                    Reviewed
                  </button>
                </div>
              </div>
            </div>
            
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  id="sort-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => {
                    // Toggle sort dropdown in real implementation
                  }}
                >
                  <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Sort: {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                  <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              {/* Sort Dropdown Menu - would be implemented with useState toggle */}
              <div className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="sort-menu">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    onClick={() => setSortOrder('newest')}
                  >
                    Newest First
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    onClick={() => setSortOrder('oldest')}
                  >
                    Oldest First
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Interview List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredInterviews.length === 0 ? (
              <li className="px-6 py-12">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery 
                      ? "Try adjusting your search or filter criteria." 
                      : "Completed interviews will appear here."}
                  </p>
                </div>
              </li>
            ) : (
              filteredInterviews.map((interview) => (
                <li key={interview.id}>
                  <Link to={`/recruiter/reviews/${interview.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {interview.candidate.avatar ? (
                              <img
                                src={interview.candidate.avatar}
                                alt={`${interview.candidate.firstName} ${interview.candidate.lastName}`}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <UserCircleIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="text-sm font-medium text-gray-900">{interview.candidate.firstName} {interview.candidate.lastName}</h3>
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                interview.reviewStatus === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {interview.reviewStatus === 'pending' ? 'Pending Review' : 'Reviewed'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{interview.position}</p>
                          </div>
                        </div>
                        <div className="ml-6 flex-shrink-0 flex items-center">
                          <p className="text-sm text-gray-500 flex items-center mr-6">
                            <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {formatDate(interview.completedAt)}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <CheckBadgeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <p>
                              <span className="font-medium text-gray-900">{interview.overallScore}%</span>
                              <span className="hidden md:inline"> score</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {interview.template.title}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span className="hidden md:inline">View details</span>
                          <svg className="flex-shrink-0 ml-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Filter tags */}
        {(searchQuery || filterStatus !== 'all') && (
          <div className="mt-4 flex flex-wrap items-center space-x-2">
            <span className="text-sm text-gray-700">Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Search: {searchQuery}
                <button
                  type="button"
                  className="ml-1 inline-flex text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery('')}
                >
                  <span className="sr-only">Remove search filter</span>
                  <XCircleIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Status: {filterStatus === 'pending' ? 'Pending Review' : 'Reviewed'}
                <button
                  type="button"
                  className="ml-1 inline-flex text-gray-400 hover:text-gray-600"
                  onClick={() => setFilterStatus('all')}
                >
                  <span className="sr-only">Remove status filter</span>
                  <XCircleIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </span>
            )}
          </div>
        )}
        
        {/* Pagination - would be implemented with real data */}
        {filteredInterviews.length > 0 && (
          <nav className="mt-6 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
            <div className="-mt-px w-0 flex-1 flex">
              <button
                className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
            </div>
            <div className="hidden md:-mt-px md:flex">
              <span className="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
                Page 1 of 1
              </span>
            </div>
            <div className="-mt-px w-0 flex-1 flex justify-end">
              <button
                className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Next
                <svg className="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </nav>
        )}
      </main>
    </div>
  );
};

export default Reviews; 