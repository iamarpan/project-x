import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, ClipboardIcon } from '@heroicons/react/24/outline';

// Mock data for templates
const MOCK_TEMPLATES = [
  {
    id: 1,
    title: 'Frontend Developer Interview',
    description: 'Technical assessment for frontend developers, focusing on React.js, JavaScript, CSS, and responsive design.',
    questionCount: 12,
    duration: 45,
    createdAt: '2023-06-15T12:00:00Z',
  },
  {
    id: 2,
    title: 'Backend Engineer Screen',
    description: 'Technical screen for backend engineers with focus on system design, algorithms, and database concepts.',
    questionCount: 8,
    duration: 30,
    createdAt: '2023-07-01T14:30:00Z',
  },
  {
    id: 3,
    title: 'Product Manager Assessment',
    description: 'Evaluates product sense, strategic thinking, and execution abilities for product managers.',
    questionCount: 10,
    duration: 40,
    createdAt: '2023-07-10T09:15:00Z',
  },
];

const InterviewTemplates = () => {
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter templates based on search query
  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle template deletion
  const handleDeleteTemplate = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(template => template.id !== id));
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Interview Templates</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage interview templates for your candidates.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/recruiter/templates/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Template
          </Link>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="mt-6 flex flex-col sm:flex-row">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search templates..."
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Templates grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="col-span-1 flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="px-6 py-5 flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {template.questionCount} questions
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500 line-clamp-3">{template.description}</p>
              <div className="mt-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <span className="mr-4">Duration: ~{template.duration} min</span>
                  <span>Created: {formatDate(template.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex justify-between">
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
              <div className="flex space-x-4">
                <Link
                  to={`/recruiter/scheduler?templateId=${template.id}`}
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  <ClipboardIcon className="h-4 w-4 mr-1" />
                  Use
                </Link>
                <Link
                  to={`/recruiter/templates/edit/${template.id}`}
                  className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-3">
              <ClipboardIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try a different search term or create a new template.' : 'Get started by creating a new template.'}
            </p>
            <div className="mt-6">
              <Link
                to="/recruiter/templates/create"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Template
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewTemplates; 