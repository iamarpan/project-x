import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  UserCircleIcon, 
  CalendarIcon, 
  ClockIcon,
  DocumentTextIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

// Mock data for templates
const TEMPLATES = [
  { id: 1, title: 'Frontend Developer Technical Interview', position: 'Senior Frontend Developer', questionCount: 8 },
  { id: 2, title: 'Backend Developer Technical Interview', position: 'Backend Developer', questionCount: 7 },
  { id: 3, title: 'UX Designer Interview', position: 'UX Designer', questionCount: 6 },
  { id: 4, title: 'Product Manager Interview', position: 'Product Manager', questionCount: 9 }
];

const CandidateScheduler = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    templateId: '',
    message: 'We are excited to invite you to complete an online interview for the position you applied for. This interview will help us better understand your qualifications and experience.',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  const handleTemplateSelect = (templateId) => {
    setFormData({ ...formData, templateId });
    
    // Clear error
    if (errors.templateId) {
      setErrors({ ...errors, templateId: null });
    }
  };
  
  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.position.trim()) {
        newErrors.position = 'Position is required';
      }
    }
    
    if (stepNumber === 2) {
      if (!formData.templateId) {
        newErrors.templateId = 'Please select an interview template';
      }
    }
    
    if (stepNumber === 3) {
      if (!formData.message.trim()) {
        newErrors.message = 'Message is required';
      }
      
      if (!formData.dueDate) {
        newErrors.dueDate = 'Due date is required';
      } else {
        // Check if due date is in the future
        const selectedDate = new Date(formData.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          newErrors.dueDate = 'Due date must be in the future';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to the API
      // Mock API call success
      console.log('Scheduling interview with data:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error scheduling interview:', error);
      setErrors({ 
        submit: 'Failed to schedule interview. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate minimum due date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDueDate = tomorrow.toISOString().split('T')[0];
  
  // Get selected template
  const selectedTemplate = formData.templateId 
    ? TEMPLATES.find(t => t.id === parseInt(formData.templateId))
    : null;
  
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Schedule Interview</h1>
          </div>
        </header>
        
        <main className="max-w-lg mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Interview Scheduled!</h2>
              <p className="mt-2 text-sm text-gray-500">
                An email invitation has been sent to {formData.firstName} {formData.lastName} at {formData.email}.
              </p>
            </div>
            
            <div className="mt-6">
              <div className="rounded-md bg-gray-50 p-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Interview Details</p>
                  <ul className="mt-2 space-y-1 pl-5 list-disc">
                    <li>Candidate: {formData.firstName} {formData.lastName}</li>
                    <li>Position: {formData.position}</li>
                    <li>Template: {selectedTemplate?.title}</li>
                    <li>Due Date: {new Date(formData.dueDate).toLocaleDateString()}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Schedule Interview</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-lg mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress steps */}
        <div className="mb-8">
          <div className="relative">
            <div className="overflow-hidden h-2 flex rounded bg-gray-200">
              <div 
                className="bg-primary-600 transition-all duration-500" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
            <div className="absolute top-0 left-0 flex justify-between w-full -mt-2">
              <div className={`w-4 h-4 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-gray-400'}`}></div>
              <div className={`w-4 h-4 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-400'}`}></div>
              <div className={`w-4 h-4 rounded-full ${step >= 3 ? 'bg-primary-600' : 'bg-gray-400'}`}></div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs mt-3">
            <div className={`${step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>Candidate Details</div>
            <div className={`${step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>Select Template</div>
            <div className={`${step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>Finalize</div>
          </div>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Candidate Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Candidate Details</h2>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      id="position"
                      value={formData.position}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                        errors.position ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    />
                    {errors.position && (
                      <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Select Template */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Select Interview Template</h2>
                
                <div className="space-y-4">
                  {errors.templateId && (
                    <p className="text-sm text-red-600">{errors.templateId}</p>
                  )}
                  
                  {TEMPLATES.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-md p-4 cursor-pointer hover:border-primary-500 ${
                        formData.templateId === template.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-300'
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h3 className="text-md font-medium text-gray-900">{template.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">{template.position}</p>
                          <p className="mt-1 text-xs text-gray-500">{template.questionCount} questions</p>
                        </div>
                        
                        <div className="ml-4 flex items-center">
                          <div className={`h-5 w-5 rounded-full border ${
                            formData.templateId === template.id 
                              ? 'border-primary-500 bg-primary-500' 
                              : 'border-gray-300'
                          }`}>
                            {formData.templateId === template.id && (
                              <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 3: Finalize */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Finalize Interview</h2>
                
                <div className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-md font-medium text-gray-900">Interview Summary</h3>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Candidate</p>
                      <div className="mt-1 flex items-center">
                        <UserCircleIcon className="h-5 w-5 text-gray-400 mr-1" />
                        <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Position</p>
                      <p className="mt-1 font-medium">{formData.position}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Template</p>
                      <div className="mt-1 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-1" />
                        <p className="font-medium">{selectedTemplate?.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dueDate"
                      id="dueDate"
                      min={minDueDate}
                      value={formData.dueDate}
                      onChange={handleChange}
                      className={`pl-10 block w-full border ${
                        errors.dueDate ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    />
                  </div>
                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Email Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      errors.message ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </button>
              )}
            </div>
            
            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default CandidateScheduler; 