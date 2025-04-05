import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { 
  PlusIcon, 
  MinusCircleIcon,
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const QUESTION_TYPES = [
  { id: 'text', name: 'Text Response' },
  { id: 'mcq', name: 'Multiple Choice' },
  { id: 'video', name: 'Video Response' }
];

// Mock template data - in a real app, this would be fetched from the API
const MOCK_TEMPLATE = {
  id: '123',
  title: 'Frontend Developer Technical Interview',
  description: 'A comprehensive technical interview for assessing frontend development skills and experience.',
  position: 'Senior Frontend Developer',
  questions: [
    {
      id: 1,
      type: 'text',
      text: 'Describe your experience with modern JavaScript frameworks like React, Vue, or Angular.',
      required: true,
      options: [],
      time_limit: 0
    },
    {
      id: 2,
      type: 'mcq',
      text: 'Which of the following is NOT a hook in React?',
      required: true,
      options: [
        'useState',
        'useEffect',
        'useHistory',
        'useCallback',
        'useStorage'
      ],
      time_limit: 0
    },
    {
      id: 3,
      type: 'video',
      text: 'Tell us about a challenging project you worked on and how you overcame obstacles.',
      required: true,
      options: [],
      time_limit: 120
    }
  ]
};

const EditTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: '',
    questions: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load template data
  useEffect(() => {
    // In a real app, this would fetch data from an API
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Clone the mock data to avoid direct reference modifications
      setFormData(JSON.parse(JSON.stringify(MOCK_TEMPLATE)));
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  const handleQuestionChange = (questionId, field, value) => {
    const updatedQuestions = formData.questions.map(q => {
      if (q.id === questionId) {
        return { ...q, [field]: value };
      }
      return q;
    });
    
    setFormData({ ...formData, questions: updatedQuestions });
    
    // Clear question error
    if (errors[`question_${questionId}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`question_${questionId}_${field}`];
      setErrors(newErrors);
    }
  };
  
  const handleAddQuestion = () => {
    const newQuestion = { 
      id: Date.now(), 
      type: 'text', 
      text: '', 
      required: true,
      options: [],
      time_limit: 120
    };
    
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };
  
  const handleRemoveQuestion = (questionId) => {
    if (formData.questions.length <= 1) {
      alert('Template must have at least one question');
      return;
    }
    
    const updatedQuestions = formData.questions.filter(q => q.id !== questionId);
    setFormData({ ...formData, questions: updatedQuestions });
    
    // Clear any errors related to this question
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.includes(`question_${questionId}`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };
  
  const handleAddOption = (questionId) => {
    const updatedQuestions = formData.questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...(q.options || []), ''];
        return { ...q, options: newOptions };
      }
      return q;
    });
    
    setFormData({ ...formData, questions: updatedQuestions });
  };
  
  const handleOptionChange = (questionId, optionIndex, value) => {
    const updatedQuestions = formData.questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    
    setFormData({ ...formData, questions: updatedQuestions });
    
    // Clear option error
    if (errors[`question_${questionId}_option_${optionIndex}`]) {
      const newErrors = { ...errors };
      delete newErrors[`question_${questionId}_option_${optionIndex}`];
      setErrors(newErrors);
    }
  };
  
  const handleRemoveOption = (questionId, optionIndex) => {
    const updatedQuestions = formData.questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions.splice(optionIndex, 1);
        return { ...q, options: newOptions };
      }
      return q;
    });
    
    setFormData({ ...formData, questions: updatedQuestions });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate template details
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    
    // Validate questions
    formData.questions.forEach((question, index) => {
      if (!question.text.trim()) {
        newErrors[`question_${question.id}_text`] = 'Question text is required';
      }
      
      if (question.type === 'mcq') {
        if (!question.options || question.options.length < 2) {
          newErrors[`question_${question.id}_options`] = 'At least 2 options are required';
        } else {
          question.options.forEach((option, optionIndex) => {
            if (!option.trim()) {
              newErrors[`question_${question.id}_option_${optionIndex}`] = 'Option cannot be empty';
            }
          });
        }
      }
      
      if (question.type === 'video' && (!question.time_limit || question.time_limit < 30)) {
        newErrors[`question_${question.id}_time_limit`] = 'Time limit must be at least 30 seconds';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to the API
      // Mock API call success
      console.log('Updating template:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to templates page
      navigate('/interview-templates', { 
        state: { 
          message: 'Interview template updated successfully!',
          success: true
        } 
      });
      
    } catch (error) {
      console.error('Error updating template:', error);
      setErrors({ 
        submit: 'Failed to update template. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading template...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/interview-templates"
                className="inline-flex items-center mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Edit Interview Template</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Template details section */}
          <div className="bg-white shadow sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Template Details</h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                    placeholder="e.g., Frontend Developer Technical Interview"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    id="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.position ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                    placeholder="e.g., Senior Frontend Developer"
                  />
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                  )}
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                    placeholder="Describe the purpose of this interview template"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Questions section */}
          <div className="bg-white shadow sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Interview Questions</h2>
                <span className="text-sm text-gray-500">{formData.questions.length} question(s)</span>
              </div>
              
              <div className="mt-5 space-y-6">
                {formData.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-md font-medium text-gray-700">Question {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(question.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <MinusCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor={`question-${question.id}-text`} className="block text-sm font-medium text-gray-700">
                          Question Text <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id={`question-${question.id}-text`}
                          rows={2}
                          value={question.text}
                          onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                          className={`mt-1 block w-full rounded-md border ${
                            errors[`question_${question.id}_text`] ? 'border-red-300' : 'border-gray-300'
                          } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                          placeholder="Enter your question here"
                        />
                        {errors[`question_${question.id}_text`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`question_${question.id}_text`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor={`question-${question.id}-type`} className="block text-sm font-medium text-gray-700">
                          Question Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id={`question-${question.id}-type`}
                          value={question.type}
                          onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          {QUESTION_TYPES.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <input
                            id={`question-${question.id}-required`}
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => handleQuestionChange(question.id, 'required', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`question-${question.id}-required`} className="ml-2 block text-sm text-gray-700">
                            Required question
                          </label>
                        </div>
                      </div>
                      
                      {/* Video question time limit */}
                      {question.type === 'video' && (
                        <div className="sm:col-span-2">
                          <label htmlFor={`question-${question.id}-time-limit`} className="block text-sm font-medium text-gray-700">
                            Time Limit (seconds) <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="number"
                              min="30"
                              id={`question-${question.id}-time-limit`}
                              value={question.time_limit}
                              onChange={(e) => handleQuestionChange(question.id, 'time_limit', parseInt(e.target.value) || 0)}
                              className={`block w-full rounded-md border ${
                                errors[`question_${question.id}_time_limit`] ? 'border-red-300' : 'border-gray-300'
                              } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                            />
                          </div>
                          {errors[`question_${question.id}_time_limit`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`question_${question.id}_time_limit`]}</p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            Recommended: 60-180 seconds (1-3 minutes)
                          </p>
                        </div>
                      )}
                      
                      {/* Multiple choice options */}
                      {question.type === 'mcq' && (
                        <div className="sm:col-span-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                              Answer Options <span className="text-red-500">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleAddOption(question.id)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <PlusIcon className="h-4 w-4 mr-1" /> Add Option
                            </button>
                          </div>
                          
                          {errors[`question_${question.id}_options`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`question_${question.id}_options`]}</p>
                          )}
                          
                          <div className="mt-2 space-y-2">
                            {(question.options || []).map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center">
                                <div className="flex-grow">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className={`block w-full rounded-md border ${
                                      errors[`question_${question.id}_option_${optionIndex}`] ? 'border-red-300' : 'border-gray-300'
                                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                                  />
                                  {errors[`question_${question.id}_option_${optionIndex}`] && (
                                    <p className="mt-0.5 text-xs text-red-600">{errors[`question_${question.id}_option_${optionIndex}`]}</p>
                                  )}
                                </div>
                                {question.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOption(question.id, optionIndex)}
                                    className="ml-2 text-gray-400 hover:text-red-500"
                                  >
                                    <MinusCircleIcon className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                            ))}
                            
                            {(!question.options || question.options.length < 2) && (
                              <button
                                type="button"
                                onClick={() => handleAddOption(question.id)}
                                className="inline-flex items-center px-2.5 py-1.5 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                <PlusIcon className="h-4 w-4 mr-1" /> Add at least 2 options
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Question
                </button>
              </div>
            </div>
          </div>
          
          {/* Form actions */}
          <div className="flex justify-end space-x-3">
            <Link
              to="/interview-templates"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
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
      </main>
    </div>
  );
};

export default EditTemplate; 