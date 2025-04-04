import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Mock data for an interview
const MOCK_INTERVIEW = {
  id: '123',
  title: 'Frontend Developer Technical Screen',
  company: 'Tech Innovations Inc.',
  position: 'Senior Frontend Developer',
  description: 'This interview assesses your technical skills for the frontend developer position. Please answer all questions to the best of your ability.',
  questions: [
    {
      id: 1,
      type: 'text',
      text: 'Describe your experience with modern JavaScript frameworks like React, Vue, or Angular.',
      required: true
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
      required: true
    },
    {
      id: 3,
      type: 'text',
      text: 'Explain how you would optimize the performance of a React application.',
      required: true
    },
    {
      id: 4,
      type: 'video',
      text: 'Tell us about a challenging project you worked on and how you overcame obstacles.',
      time_limit: 120, // 2 minutes
      required: true
    }
  ]
};

const InterviewSession = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);
  
  // Load interview data
  useEffect(() => {
    // In a real app, this would fetch from an API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setInterview(MOCK_INTERVIEW);
      
      // Initialize responses
      const initialResponses = {};
      MOCK_INTERVIEW.questions.forEach(q => {
        initialResponses[q.id] = q.type === 'mcq' ? null : '';
      });
      setResponses(initialResponses);
      
      setLoading(false);
    }, 1000);
  }, [interviewId]);
  
  // Handle countdown for video questions
  useEffect(() => {
    if (!interview) return;
    
    const currentQuestion = interview.questions[currentQuestionIndex];
    if (currentQuestion && currentQuestion.type === 'video' && recording) {
      setTimeLeft(currentQuestion.time_limit);
      
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setRecording(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, interview, recording]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading interview...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
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
  
  const currentQuestion = interview.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;
  
  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleNextQuestion = () => {
    // Check if question is required
    const question = interview.questions[currentQuestionIndex];
    const response = responses[question.id];
    
    if (question.required && (!response || (typeof response === 'string' && response.trim() === ''))) {
      alert('Please answer the question before proceeding.');
      return;
    }
    
    if (isLastQuestion) {
      if (window.confirm('Are you sure you want to submit your interview? You won\'t be able to change your answers after submission.')) {
        // In a real app, submit to API
        console.log('Submitting interview with responses:', responses);
        navigate('/interview-complete');
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handleStartRecording = () => {
    // In a real app, this would access camera and microphone
    setRecording(true);
  };
  
  const handleStopRecording = () => {
    setRecording(false);
    
    // In a real app, this would process the recording
    // For now, just set a mock video URL
    setResponses({
      ...responses,
      [currentQuestion.id]: 'mock-video-url-' + Date.now()
    });
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{interview.title}</h1>
              <p className="text-sm text-gray-500">{interview.company} • {interview.position}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {interview.questions.length}</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ width: `${((currentQuestionIndex + 1) / interview.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Question */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">
              {currentQuestion.text}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </h2>
            
            {/* Question type specific UI */}
            <div className="mt-6">
              {currentQuestion.type === 'text' && (
                <textarea
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md h-32"
                  placeholder="Type your answer here..."
                  value={responses[currentQuestion.id] || ''}
                  onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                ></textarea>
              )}
              
              {currentQuestion.type === 'mcq' && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        id={`option-${index}`}
                        name={`question-${currentQuestion.id}`}
                        type="radio"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                        checked={responses[currentQuestion.id] === option}
                        onChange={() => handleResponseChange(currentQuestion.id, option)}
                      />
                      <label htmlFor={`option-${index}`} className="ml-3 block text-sm font-medium text-gray-700">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              
              {currentQuestion.type === 'video' && (
                <div className="text-center py-8">
                  {recording ? (
                    <div className="space-y-4">
                      <div className="rounded-md bg-red-50 p-4 mx-auto inline-flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-3 w-3 rounded-full bg-red-600 animate-pulse"></div>
                        </div>
                        <div className="ml-3 flex items-center">
                          <ClockIcon className="h-5 w-5 text-red-500 mr-1" />
                          <p className="text-sm text-red-700">Recording: {formatTime(timeLeft)}</p>
                        </div>
                      </div>
                      
                      <div className="mx-auto w-96 h-72 bg-gray-800 rounded-lg flex items-center justify-center">
                        <p className="text-white">Camera Preview (mock)</p>
                      </div>
                      
                      <button
                        onClick={handleStopRecording}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Stop Recording
                      </button>
                    </div>
                  ) : responses[currentQuestion.id] ? (
                    <div className="space-y-4">
                      <div className="mx-auto w-96 h-72 bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                          <CheckCircleIcon className="h-12 w-12 mx-auto text-green-500" />
                          <p className="mt-2">Video recorded successfully</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setResponses({ ...responses, [currentQuestion.id]: '' })}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Record Again
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <VideoCameraIcon className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-500">
                          You'll have {formatTime(currentQuestion.time_limit)} to record your response
                        </p>
                      </div>
                      
                      <button
                        onClick={handleStartRecording}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <MicrophoneIcon className="h-5 w-5 mr-2" />
                        Start Recording
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentQuestionIndex === 0 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Previous
            </button>
            
            <button
              onClick={handleNextQuestion}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isLastQuestion ? 'Submit Interview' : 'Next'}
              {!isLastQuestion && <ArrowRightIcon className="h-5 w-5 ml-2" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewSession; 