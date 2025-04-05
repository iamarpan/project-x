import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  VideoCameraIcon, 
  PauseIcon, 
  PlayIcon, 
  ArrowRightIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Card from '../common/Card';

// Mock data - in a real app, this would come from an API
const MOCK_INTERVIEW = {
  id: 'interview-123',
  title: 'Software Engineer Interview',
  description: 'This interview assesses your technical skills and problem-solving abilities.',
  questions: [
    {
      id: 'q1',
      type: 'text',
      text: 'Describe your experience with React.js and component-based architecture.',
      required: true,
    },
    {
      id: 'q2',
      type: 'multiple_choice',
      text: 'Which of the following is NOT a React Hook?',
      options: ['useEffect', 'useState', 'useReducer', 'useRender'],
      required: true,
    },
    {
      id: 'q3',
      type: 'video',
      text: 'Explain how you would design a scalable application and the considerations you would make.',
      timeLimit: 60,
      required: true,
    }
  ]
};

const InterviewInterface = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [interview, setInterview] = useState(MOCK_INTERVIEW);
  const [videoState, setVideoState] = useState({
    isRecording: false,
    recordedBlob: null,
    stream: null,
    timeLeft: null,
    timer: null,
  });
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  
  // This would be fetched from an API in a real app
  useEffect(() => {
    // Simulating API call
    // const fetchInterview = async () => {
    //   const response = await api.getInterview(interviewId);
    //   setInterview(response.data);
    // };
    // fetchInterview();
  }, [interviewId]);

  const totalSteps = interview?.questions?.length || 0;
  const currentQuestion = interview?.questions?.[currentStep] || {};

  // Form validation schema based on question type
  const getValidationSchema = () => {
    if (currentQuestion.type === 'text') {
      return Yup.object().shape({
        answer: currentQuestion.required 
          ? Yup.string().required('This question requires an answer')
          : Yup.string(),
      });
    } else if (currentQuestion.type === 'multiple_choice') {
      return Yup.object().shape({
        answer: currentQuestion.required 
          ? Yup.string().required('Please select an option')
          : Yup.string(),
      });
    } else if (currentQuestion.type === 'video') {
      return Yup.object().shape({
        videoRecorded: currentQuestion.required 
          ? Yup.boolean().oneOf([true], 'Please record a video response')
          : Yup.boolean(),
      });
    }
    
    return Yup.object().shape({});
  };

  // Handle video recording
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        
        setVideoState(prev => ({
          ...prev,
          recordedBlob: blob,
          isRecording: false,
          timeLeft: null,
        }));
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      
      // Start timer
      let timeLeft = currentQuestion.timeLimit;
      const timer = setInterval(() => {
        timeLeft -= 1;
        setVideoState(prev => ({ ...prev, timeLeft }));
        
        if (timeLeft <= 0) {
          stopVideoRecording();
          clearInterval(timer);
        }
      }, 1000);
      
      setVideoState({
        isRecording: true,
        recordedBlob: null,
        stream,
        timeLeft,
        timer,
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please make sure you have granted camera permissions.');
    }
  };
  
  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && videoState.isRecording) {
      mediaRecorderRef.current.stop();
      videoState.stream.getTracks().forEach(track => track.stop());
      
      if (videoState.timer) {
        clearInterval(videoState.timer);
      }
    }
  };
  
  const resetVideoRecording = () => {
    if (videoRef.current) {
      videoRef.current.src = '';
    }
    
    setVideoState({
      isRecording: false,
      recordedBlob: null,
      stream: null,
      timeLeft: null,
      timer: null,
    });
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      resetVideoRecording();
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    // In a real app, this would save to an API
    console.log('Submitting answer for question', currentQuestion.id, values);
    
    // Go to next question
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      resetVideoRecording();
    } else {
      // Submit the entire interview
      console.log('Interview completed');
      alert('Your interview has been successfully submitted. Thank you!');
      navigate('/candidate/dashboard');
    }
    
    setSubmitting(false);
  };

  if (!interview) {
    return (
      <div className="flex justify-center items-center h-96">
        <p>Loading interview...</p>
      </div>
    );
  }

  const initialValues = {
    answer: '',
    videoRecorded: videoState.recordedBlob !== null,
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <Card className="mb-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">{interview.title}</h1>
          <p className="text-gray-600">{interview.description}</p>
        </div>
      </Card>
      
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-500">
            Question {currentStep + 1} of {totalSteps}
          </div>
          <div className="w-1/2 bg-gray-200 h-2 rounded-full">
            <div 
              className="bg-primary-600 h-2 rounded-full" 
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema()}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched, setFieldValue }) => (
            <Form className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {currentQuestion.text}
                  {currentQuestion.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </h3>
                
                {currentQuestion.type === 'text' && (
                  <div>
                    <Field
                      as="textarea"
                      name="answer"
                      rows={6}
                      placeholder="Type your answer here..."
                      className="form-input"
                    />
                    {errors.answer && touched.answer && (
                      <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
                    )}
                  </div>
                )}
                
                {currentQuestion.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <Field
                          type="radio"
                          id={`option-${index}`}
                          name="answer"
                          value={option}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`option-${index}`} className="ml-2 text-gray-700">
                          {option}
                        </label>
                      </div>
                    ))}
                    {errors.answer && touched.answer && (
                      <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
                    )}
                  </div>
                )}
                
                {currentQuestion.type === 'video' && (
                  <div>
                    <div className="mb-4 bg-black rounded-lg overflow-hidden aspect-video">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted={videoState.isRecording}
                        controls={!videoState.isRecording}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        {videoState.timeLeft !== null && (
                          <span className="text-lg font-medium">
                            {videoState.timeLeft} seconds remaining
                          </span>
                        )}
                      </div>
                      
                      <div className="space-x-3">
                        {!videoState.isRecording && !videoState.recordedBlob && (
                          <Button
                            type="button"
                            variant="primary"
                            onClick={() => {
                              startVideoRecording();
                              setFieldValue('videoRecorded', false);
                            }}
                          >
                            <VideoCameraIcon className="h-5 w-5 mr-2" />
                            Start Recording
                          </Button>
                        )}
                        
                        {videoState.isRecording && (
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => {
                              stopVideoRecording();
                              setFieldValue('videoRecorded', true);
                            }}
                          >
                            <PauseIcon className="h-5 w-5 mr-2" />
                            Stop Recording
                          </Button>
                        )}
                        
                        {videoState.recordedBlob && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => resetVideoRecording()}
                          >
                            <PlayIcon className="h-5 w-5 mr-2" />
                            Record Again
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {errors.videoRecorded && touched.videoRecorded && (
                      <div className="mt-2 flex items-center text-red-600">
                        <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                        <p className="text-sm">{errors.videoRecorded}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Previous
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {currentStep < totalSteps - 1 ? (
                    <>
                      Next
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </>
                  ) : (
                    'Submit Interview'
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
      
      {currentQuestion.type === 'video' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Make sure your camera and microphone are working properly. Your video response
                will be reviewed by the hiring team.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewInterface; 