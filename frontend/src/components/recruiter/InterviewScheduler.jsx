import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  CalendarIcon, 
  EnvelopeIcon, 
  ClockIcon,
  UserIcon,
  PlusIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Card from '../common/Card';

// Mock data - would come from API in real app
const MOCK_TEMPLATES = [
  { id: 'temp1', name: 'Software Engineer - Frontend' },
  { id: 'temp2', name: 'Software Engineer - Backend' },
  { id: 'temp3', name: 'UX Designer Interview' },
  { id: 'temp4', name: 'Product Manager Interview' },
];

const MOCK_TIMEZONES = [
  { value: 'UTC-8', label: 'Pacific Time (PT)' },
  { value: 'UTC-5', label: 'Eastern Time (ET)' },
  { value: 'UTC+0', label: 'Coordinated Universal Time (UTC)' },
  { value: 'UTC+1', label: 'Central European Time (CET)' },
  { value: 'UTC+5:30', label: 'India Standard Time (IST)' },
  { value: 'UTC+8', label: 'China Standard Time (CST)' },
];

const validationSchema = Yup.object().shape({
  candidateEmail: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  candidateName: Yup.string()
    .required('Candidate name is required'),
  templateId: Yup.string()
    .required('Please select an interview template'),
  dueDate: Yup.date()
    .required('Due date is required')
    .min(new Date(), 'Due date must be in the future'),
  timezone: Yup.string()
    .required('Please select a timezone'),
  sendReminder: Yup.boolean(),
  reminderDays: Yup.number()
    .when('sendReminder', {
      is: true,
      then: () => Yup.number()
        .required('Please specify reminder days')
        .positive('Must be a positive number')
        .max(30, 'Maximum 30 days'),
    }),
  message: Yup.string(),
});

const InterviewScheduler = () => {
  const [scheduledInterviews, setScheduledInterviews] = useState([
    {
      id: 'int1',
      candidateName: 'Sarah Chen',
      candidateEmail: 'sarah.chen@example.com',
      templateName: 'Software Engineer - Frontend',
      dueDate: '2025-04-20T23:59:59Z',
      status: 'pending',
      invitedAt: '2025-04-05T14:30:00Z',
    },
    {
      id: 'int2',
      candidateName: 'Michael Johnson',
      candidateEmail: 'michael.j@example.com',
      templateName: 'Software Engineer - Backend',
      dueDate: '2025-04-15T23:59:59Z',
      status: 'completed',
      invitedAt: '2025-04-01T10:15:00Z',
      completedAt: '2025-04-03T16:42:00Z',
    },
    {
      id: 'int3',
      candidateName: 'Jessica Smith',
      candidateEmail: 'j.smith@example.com',
      templateName: 'UX Designer Interview',
      dueDate: '2025-04-25T23:59:59Z',
      status: 'pending',
      invitedAt: '2025-04-04T09:20:00Z',
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  
  const initialValues = {
    candidateEmail: '',
    candidateName: '',
    templateId: '',
    dueDate: '',
    timezone: 'UTC-5',
    sendReminder: true,
    reminderDays: 2,
    message: 'We are excited to learn more about your skills and experience. Please complete this interview at your convenience before the due date.',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // In real app, this would call API to send invitation
    console.log('Sending invitation:', values);
    
    // Add to scheduled interviews
    const newInterview = {
      id: `int${scheduledInterviews.length + 1}`,
      candidateName: values.candidateName,
      candidateEmail: values.candidateEmail,
      templateName: MOCK_TEMPLATES.find(t => t.id === values.templateId)?.name || 'Unknown Template',
      dueDate: new Date(values.dueDate).toISOString(),
      status: 'pending',
      invitedAt: new Date().toISOString(),
    };
    
    setScheduledInterviews([newInterview, ...scheduledInterviews]);
    setShowForm(false);
    resetForm();
    setSubmitting(false);
    
    alert('Interview invitation sent successfully!');
  };
  
  const copyInviteLink = (id) => {
    // In real app, this would generate and copy a unique link
    const link = `https://interview-assistant.example.com/interview/${id}`;
    navigator.clipboard.writeText(link)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link:', err));
  };
  
  const sendReminderEmail = (interview) => {
    // In real app, this would call API to send reminder
    console.log('Sending reminder for interview:', interview.id);
    alert(`Reminder email sent to ${interview.candidateEmail}`);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Interview Scheduler</h1>
        <Button 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Schedule New Interview'}
        </Button>
      </div>
      
      {showForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">Schedule New Interview</h2>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="candidateName" className="block text-sm font-medium text-gray-700 mb-1">
                      Candidate Name
                    </label>
                    <Field
                      type="text"
                      id="candidateName"
                      name="candidateName"
                      className="form-input"
                    />
                    {errors.candidateName && touched.candidateName && (
                      <p className="mt-1 text-sm text-red-600">{errors.candidateName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="candidateEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Candidate Email
                    </label>
                    <Field
                      type="email"
                      id="candidateEmail"
                      name="candidateEmail"
                      className="form-input"
                    />
                    {errors.candidateEmail && touched.candidateEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.candidateEmail}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="templateId" className="block text-sm font-medium text-gray-700 mb-1">
                      Interview Template
                    </label>
                    <Field
                      as="select"
                      id="templateId"
                      name="templateId"
                      className="form-input"
                    >
                      <option value="">Select a template</option>
                      {MOCK_TEMPLATES.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </Field>
                    {errors.templateId && touched.templateId && (
                      <p className="mt-1 text-sm text-red-600">{errors.templateId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <Field
                      type="datetime-local"
                      id="dueDate"
                      name="dueDate"
                      className="form-input"
                    />
                    {errors.dueDate && touched.dueDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <Field
                      as="select"
                      id="timezone"
                      name="timezone"
                      className="form-input"
                    >
                      {MOCK_TIMEZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </Field>
                    {errors.timezone && touched.timezone && (
                      <p className="mt-1 text-sm text-red-600">{errors.timezone}</p>
                    )}
                  </div>
                  
                  <div className="flex items-start mt-2">
                    <div className="flex items-center h-5">
                      <Field
                        type="checkbox"
                        id="sendReminder"
                        name="sendReminder"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="sendReminder" className="font-medium text-gray-700">
                        Send reminder email
                      </label>
                    </div>
                  </div>
                  
                  {values.sendReminder && (
                    <div>
                      <label htmlFor="reminderDays" className="block text-sm font-medium text-gray-700 mb-1">
                        Days before due date
                      </label>
                      <Field
                        type="number"
                        id="reminderDays"
                        name="reminderDays"
                        min="1"
                        max="30"
                        className="form-input w-24"
                      />
                      {errors.reminderDays && touched.reminderDays && (
                        <p className="mt-1 text-sm text-red-600">{errors.reminderDays}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Message (Optional)
                  </label>
                  <Field
                    as="textarea"
                    id="message"
                    name="message"
                    rows={4}
                    className="form-input"
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="mr-3"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Send Invitation
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      )}
      
      <Card>
        <h2 className="text-xl font-bold mb-4">Scheduled Interviews</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invited
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduledInterviews.map((interview) => (
                <tr key={interview.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{interview.candidateName}</div>
                        <div className="text-sm text-gray-500">{interview.candidateEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{interview.templateName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-900">{formatDate(interview.dueDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      interview.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {interview.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(interview.invitedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => copyInviteLink(interview.id)}
                        className="text-primary-600 hover:text-primary-900 focus:outline-none"
                        title="Copy invite link"
                      >
                        <LinkIcon className="h-5 w-5" />
                      </button>
                      
                      {interview.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => sendReminderEmail(interview)}
                          className="text-yellow-600 hover:text-yellow-900 focus:outline-none"
                          title="Send reminder"
                        >
                          <EnvelopeIcon className="h-5 w-5" />
                        </button>
                      )}
                      
                      {interview.status === 'completed' && (
                        <a
                          href={`/recruiter/reviews/${interview.id}`}
                          className="text-green-600 hover:text-green-900 focus:outline-none"
                          title="View results"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default InterviewScheduler; 