import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  QuestionMarkCircleIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import Button from '../common/Button';
import Card from '../common/Card';

// Mock data - would be fetched from an API in a real application
const MOCK_INTERVIEW_DATA = {
  id: 'int-12345',
  title: 'Software Engineer Interview',
  candidate: {
    id: 'cand-123',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    resumeUrl: '#',
    appliedPosition: 'Senior React Developer',
  },
  submittedAt: '2025-03-25T14:30:00Z',
  status: 'completed',
  questions: [
    {
      id: 'q1',
      type: 'text',
      text: 'Describe your experience with React.js and component-based architecture.',
      answer: 'I have 4 years of experience with React, building scalable applications with reusable component structures. I've implemented both class-based and functional components, and have extensive experience with hooks, context API, and state management solutions like Redux and Zustand. I prefer creating small, focused components that can be composed together to build complex UIs.',
      aiAnalysis: {
        score: 4.2,
        strengths: [
          'Demonstrates strong understanding of React architecture',
          'Shows experience with multiple state management approaches',
          'Indicates preference for maintainable code patterns'
        ],
        weaknesses: [
          'Could provide more specific examples of complex projects'
        ]
      }
    },
    {
      id: 'q2',
      type: 'multiple_choice',
      text: 'Which of the following is NOT a React Hook?',
      options: ['useEffect', 'useState', 'useReducer', 'useRender'],
      answer: 'useRender',
      isCorrect: true,
      aiAnalysis: {
        score: 5.0,
        notes: 'Candidate correctly identified that useRender is not a built-in React Hook.'
      }
    },
    {
      id: 'q3',
      type: 'video',
      text: 'Explain how you would design a scalable application and the considerations you would make.',
      videoUrl: 'https://example.com/videos/response.mp4',
      transcription: 'When designing a scalable application, I first consider the architecture. I typically use a microservices approach for larger applications to ensure different parts can scale independently. For the frontend, I implement code-splitting and lazy loading to reduce initial load times. I also consider database optimization with proper indexing and query design. For state management, I choose solutions based on the complexity - Context API for simpler apps, Redux for complex ones. Finally, I implement proper error handling and logging for easier debugging and monitoring.',
      aiAnalysis: {
        score: 4.5,
        strengths: [
          'Shows deep understanding of scalability concerns',
          'Differentiates approaches based on application needs',
          'Considers both frontend and backend scalability'
        ],
        weaknesses: [
          'Could elaborate more on deployment and DevOps considerations'
        ]
      }
    }
  ],
  overallScore: 4.5,
  aiRecommendation: 'Strong candidate with solid React experience and good understanding of scalability concerns. Recommended for technical interview.'
};

const CandidateReviewDashboard = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(MOCK_INTERVIEW_DATA);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState({});
  const [rating, setRating] = useState(0);
  const [decision, setDecision] = useState(null); // 'advance', 'reject', 'hold'
  
  // Get the currently active question
  const activeQuestion = interview?.questions[activeQuestionIndex] || {};
  
  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleFeedbackChange = (e) => {
    setFeedback({
      ...feedback,
      [activeQuestion.id]: e.target.value
    });
  };
  
  const handleSaveEvaluation = () => {
    // In a real app, this would send data to the API
    console.log('Saving evaluation:', {
      interviewId: interview.id,
      feedback,
      rating,
      decision
    });
    
    alert('Evaluation saved successfully');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Candidate info and questions list */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{interview.candidate.name}</h2>
                  <p className="text-sm text-gray-500">{interview.candidate.email}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium mb-2">{interview.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>Applied for: {interview.candidate.appliedPosition}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Submitted: {formatDate(interview.submittedAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>Status: {interview.status}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <a 
                    href={interview.candidate.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    View Resume
                  </a>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-2">AI Overall Assessment</h4>
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon 
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(interview.overallScore) 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">{interview.overallScore.toFixed(1)}/5.0</span>
                </div>
                <p className="text-sm text-gray-700">{interview.aiRecommendation}</p>
              </div>
            </div>
          </Card>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Interview Questions</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {interview.questions.map((question, index) => (
                <button
                  key={question.id}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none ${
                    activeQuestionIndex === index ? 'bg-primary-50' : ''
                  }`}
                  onClick={() => setActiveQuestionIndex(index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Question {index + 1}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {question.type === 'text' ? 'Text' : 
                       question.type === 'multiple_choice' ? 'Choice' : 'Video'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{question.text}</p>
                  {question.aiAnalysis && (
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        <span className="text-xs mr-1">AI Score:</span>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                          question.aiAnalysis.score >= 4 ? 'bg-green-100 text-green-800' :
                          question.aiAnalysis.score >= 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {question.aiAnalysis.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right column - Question details and evaluation */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Question {activeQuestionIndex + 1} of {interview.questions.length}
                </span>
                <h3 className="text-xl font-bold mt-1">{activeQuestion.text}</h3>
              </div>
              
              {/* Question Answer Section */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-2">Candidate Response</h4>
                
                {activeQuestion.type === 'text' && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="whitespace-pre-wrap">{activeQuestion.answer}</p>
                  </div>
                )}
                
                {activeQuestion.type === 'multiple_choice' && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span>Selected answer:</span>
                      <span className="font-medium">{activeQuestion.answer}</span>
                      {activeQuestion.isCorrect ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                )}
                
                {activeQuestion.type === 'video' && (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-md overflow-hidden">
                      <video
                        src={activeQuestion.videoUrl}
                        controls
                        className="w-full h-full"
                        poster="/video-placeholder.jpg"
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Transcription</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{activeQuestion.transcription}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* AI Analysis Section */}
              {activeQuestion.aiAnalysis && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium mb-2">AI Analysis</h4>
                  
                  <div className="bg-primary-50 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <span className="font-medium mr-2">Score:</span>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon 
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.round(activeQuestion.aiAnalysis.score) 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span>{activeQuestion.aiAnalysis.score.toFixed(1)}/5.0</span>
                      </div>
                    </div>
                    
                    {activeQuestion.aiAnalysis.notes && (
                      <p className="text-sm mb-2">{activeQuestion.aiAnalysis.notes}</p>
                    )}
                    
                    {activeQuestion.aiAnalysis.strengths && activeQuestion.aiAnalysis.strengths.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-green-800">Strengths:</span>
                        <ul className="list-disc list-inside pl-2 text-sm text-green-800">
                          {activeQuestion.aiAnalysis.strengths.map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {activeQuestion.aiAnalysis.weaknesses && activeQuestion.aiAnalysis.weaknesses.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-red-800">Areas for improvement:</span>
                        <ul className="list-disc list-inside pl-2 text-sm text-red-800">
                          {activeQuestion.aiAnalysis.weaknesses.map((weakness, i) => (
                            <li key={i}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Recruiter Feedback Section */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-2">Your Evaluation</h4>
                
                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback Notes
                  </label>
                  <textarea
                    id="feedback"
                    rows={4}
                    className="form-input"
                    placeholder="Add your notes about this answer..."
                    value={feedback[activeQuestion.id] || ''}
                    onChange={handleFeedbackChange}
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Final Evaluation Card */}
          <Card>
            <h3 className="text-lg font-bold mb-4">Overall Evaluation</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <StarIcon 
                        className={`h-8 w-8 ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-lg font-medium">{rating}/5</span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decision
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center py-3 px-4 border rounded-md ${
                      decision === 'advance'
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setDecision('advance')}
                  >
                    <CheckCircleIcon className={`h-8 w-8 ${
                      decision === 'advance' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <span className="mt-1 font-medium">Advance</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center py-3 px-4 border rounded-md ${
                      decision === 'hold'
                        ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setDecision('hold')}
                  >
                    <QuestionMarkCircleIcon className={`h-8 w-8 ${
                      decision === 'hold' ? 'text-yellow-500' : 'text-gray-400'
                    }`} />
                    <span className="mt-1 font-medium">Hold</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center py-3 px-4 border rounded-md ${
                      decision === 'reject'
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setDecision('reject')}
                  >
                    <XCircleIcon className={`h-8 w-8 ${
                      decision === 'reject' ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <span className="mt-1 font-medium">Reject</span>
                  </button>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleSaveEvaluation}
                  disabled={!rating || !decision}
                >
                  Save Evaluation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateReviewDashboard; 