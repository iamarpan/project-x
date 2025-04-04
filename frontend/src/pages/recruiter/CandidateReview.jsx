import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  UserCircleIcon, 
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon, 
  BookOpenIcon,
  PlayIcon,
  StarIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  MapIcon
} from '@heroicons/react/24/outline';

// Mock interview data
const MOCK_INTERVIEW = {
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
  scheduledAt: '2023-06-01T10:00:00Z',
  dueDate: '2023-06-07T23:59:59Z',
  overallScore: 78,
  aiAnalysis: {
    summary: 'The candidate demonstrated strong technical knowledge in React and modern JavaScript concepts. They have good experience with state management solutions and component design patterns. Areas for improvement include performance optimization and more advanced CSS concepts.',
    strengths: [
      'Extensive experience with React hooks and functional components',
      'Strong understanding of state management principles',
      'Good grasp of modern JavaScript features and syntax',
      'Clear communication of technical concepts'
    ],
    weaknesses: [
      'Limited knowledge of advanced performance optimization techniques',
      'Some gaps in understanding of CSS Grid and advanced layout strategies',
      'Could improve on testing methodologies'
    ],
    recommendation: 'This candidate shows strong potential for the Senior Frontend Developer role. Their technical knowledge and communication skills are solid. Consider a follow-up technical interview focusing on performance optimization and advanced UI challenges to further assess their capabilities.'
  },
  questions: [
    {
      id: 1,
      type: 'text',
      text: 'Describe your experience with modern JavaScript frameworks like React, Vue, or Angular.',
      response: 'I have over 5 years of experience working with React and its ecosystem. I\'ve built complex applications using React, Redux, and more recently, React Query for data fetching. I\'ve also worked with Next.js for server-side rendering. I have limited experience with Vue and Angular, but understand their core concepts and component models.',
      score: 85,
      analysis: 'The candidate demonstrates extensive experience with React and related technologies. Their knowledge of modern frameworks is strong, with particular depth in React.'
    },
    {
      id: 2,
      type: 'mcq',
      text: 'Which of the following is NOT a hook in React?',
      options: [
        'useState',
        'useEffect',
        'useHistory',
        'useCallback',
        'useStorage'
      ],
      selectedOption: 'useStorage',
      correctOption: 'useStorage',
      score: 100,
      analysis: 'The candidate correctly identified that useStorage is not a built-in React hook.'
    },
    {
      id: 3,
      type: 'text',
      text: 'Explain how you would optimize the performance of a React application.',
      response: 'I would start by identifying performance bottlenecks using React DevTools Profiler. Key optimization strategies include: 1) Using React.memo for component memoization, 2) Implementing useCallback and useMemo for expensive computations and preventing unnecessary re-renders, 3) Code splitting with React.lazy and Suspense, 4) Using virtualization for long lists with react-window or similar libraries, 5) Optimizing images and assets, 6) Implementing proper key usage in lists. I would also consider using web workers for heavy computations and ensuring efficient state management patterns are followed.',
      score: 82,
      analysis: 'The candidate shows good knowledge of React performance optimization techniques. They mention several key strategies like memoization, code splitting, and virtualization. The response could be improved with more specifics on measuring performance impact.'
    },
    {
      id: 4,
      type: 'video',
      text: 'Tell us about a challenging project you worked on and how you overcame obstacles.',
      videoUrl: 'https://example.com/mock-video-url',
      score: 75,
      analysis: 'The candidate described a challenging e-commerce application refactoring project. They showed good problem-solving skills and team collaboration. The explanation of technical decisions was clear, though they could have elaborated more on specific technical challenges overcome.'
    }
  ]
};

// Component for displaying star ratings
const StarRating = ({ score }) => {
  const fullStars = Math.floor(score / 20);
  const hasHalfStar = score % 20 >= 10;
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`h-5 w-5 ${
            i < fullStars 
              ? 'text-yellow-400 fill-current' 
              : i === fullStars && hasHalfStar
                ? 'text-yellow-400' 
                : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">{score}%</span>
    </div>
  );
};

// Component for an individual question and response
const QuestionResponse = ({ question, index }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="border border-gray-200 rounded-md mb-4 overflow-hidden">
      <div 
        className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mr-3">
            {index + 1}
          </span>
          <h3 className="text-md font-medium text-gray-900 mr-2">{question.text}</h3>
        </div>
        <div className="flex items-center">
          <StarRating score={question.score} />
          <button className="ml-4 text-gray-400 hover:text-gray-500">
            {expanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 border-t border-gray-200">
          {question.type === 'text' && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Response:</p>
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800">
                {question.response}
              </div>
            </div>
          )}
          
          {question.type === 'mcq' && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Answer:</p>
              <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm">
                <CheckCircleIcon className="inline-block h-4 w-4 mr-1" /> 
                {question.selectedOption}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {question.options.map((option, i) => (
                  <div key={i} className={`p-2 rounded-md text-sm ${
                    option === question.selectedOption 
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50'
                  }`}>
                    {option}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {question.type === 'video' && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Video Response:</p>
              <div className="bg-gray-800 rounded-md aspect-video flex items-center justify-center">
                <button className="bg-white bg-opacity-20 rounded-full p-3 hover:bg-opacity-30 transition-colors">
                  <PlayIcon className="h-8 w-8 text-white" />
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">AI Analysis:</p>
            <div className="bg-blue-50 p-3 rounded-md text-sm text-gray-800">
              {question.analysis}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CandidateReview = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: 'Interview Feedback',
    message: 'Thank you for completing your interview. We\'ve reviewed your responses and would like to provide feedback.'
  });
  
  useEffect(() => {
    // In a real app, this would fetch interview data from an API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Use mock data for now
        setInterview(MOCK_INTERVIEW);
        setLoading(false);
      } catch (err) {
        setError('Failed to load interview data. Please try again.');
        setLoading(false);
      }
    }, 1000);
  }, [id]);
  
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm({ ...emailForm, [name]: value });
  };
  
  const handleSendEmail = (e) => {
    e.preventDefault();
    // In a real app, this would send the email via API
    console.log('Sending email:', emailForm);
    
    // Close modal and show confirmation
    setShowEmailModal(false);
    // Would show confirmation message in real app
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading interview data...</p>
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
  
  if (!interview) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Candidate Review</h1>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Candidate info and summary - Left column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Candidate info card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    {interview.candidate.avatar ? (
                      <img
                        src={interview.candidate.avatar}
                        alt={`${interview.candidate.firstName} ${interview.candidate.lastName}`}
                        className="h-16 w-16 rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      {interview.candidate.firstName} {interview.candidate.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">{interview.position}</p>
                    <p className="text-sm text-gray-500">
                      <a href={`mailto:${interview.candidate.email}`} className="text-primary-600 hover:text-primary-700">
                        {interview.candidate.email}
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Interview</dt>
                      <dd className="mt-1 text-sm text-gray-900">{interview.template.title}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Completed</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(interview.completedAt)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(interview.dueDate)}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(true)}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <MapIcon className="mr-2 h-5 w-5 text-gray-400" />
                    Send Feedback
                  </button>
                  
                  <button
                    type="button"
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <DocumentDuplicateIcon className="mr-2 h-5 w-5 text-white" />
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
            
            {/* Overall score card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Overall Score</h3>
                <div className="mt-6 flex justify-center">
                  <div className="relative inline-flex">
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                      <div className="text-3xl font-bold text-primary-600">{interview.overallScore}%</div>
                    </div>
                    <div className="absolute top-0 left-0 right-0 bottom-0">
                      <svg viewBox="0 0 36 36" className="w-32 h-32 stroke-current text-primary-500">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          strokeWidth="2"
                          strokeDasharray={`${interview.overallScore}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500">Score Breakdown</h4>
                  <ul className="mt-3 space-y-3">
                    {interview.questions.map((question, i) => (
                      <li key={question.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 truncate flex-grow">Question {i + 1}</span>
                        <StarRating score={question.score} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main review content - Right column */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Analysis summary */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  <AcademicCapIcon className="inline-block h-5 w-5 mr-2 text-primary-500" />
                  AI Analysis
                </h3>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>{interview.aiAnalysis.summary}</p>
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <BookOpenIcon className="h-5 w-5 text-green-500 mr-2" /> 
                      Strengths
                    </h4>
                    <ul className="mt-2 pl-5 list-disc text-sm text-gray-600 space-y-1">
                      {interview.aiAnalysis.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <BookOpenIcon className="h-5 w-5 text-red-500 mr-2" /> 
                      Areas for Improvement
                    </h4>
                    <ul className="mt-2 pl-5 list-disc text-sm text-gray-600 space-y-1">
                      {interview.aiAnalysis.weaknesses.map((weakness, i) => (
                        <li key={i}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900">Recommendation</h4>
                  <p className="mt-2 text-sm text-gray-600">{interview.aiAnalysis.recommendation}</p>
                </div>
              </div>
            </div>
            
            {/* Questions and responses */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  <DocumentTextIcon className="inline-block h-5 w-5 mr-2 text-primary-500" />
                  Interview Responses
                </h3>
                
                <div className="space-y-2">
                  {interview.questions.map((question, i) => (
                    <QuestionResponse 
                      key={question.id} 
                      question={question} 
                      index={i}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Email feedback modal */}
      {showEmailModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleSendEmail}>
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                    <MapIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Send Feedback to Candidate
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Send an email with feedback to {interview.candidate.firstName} {interview.candidate.lastName}.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-6">
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={emailForm.subject}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      value={emailForm.message}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => setShowEmailModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Send Email
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateReview; 