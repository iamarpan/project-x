import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

// Mock analytics data
const MOCK_ANALYTICS = {
  summary: {
    totalCandidates: 42,
    completedInterviews: 28,
    pendingInterviews: 10,
    expiredInterviews: 4,
    averageScore: 76.5,
    highestScore: 96,
    completionRate: 66.7
  },
  positions: [
    { name: 'Frontend Developer', count: 18, avgScore: 78.2 },
    { name: 'Backend Developer', count: 12, avgScore: 75.8 },
    { name: 'UX Designer', count: 8, avgScore: 82.1 },
    { name: 'Product Manager', count: 4, avgScore: 71.5 }
  ],
  templates: [
    { name: 'Frontend Technical Interview', usage: 22, avgScore: 77.3 },
    { name: 'Backend Technical Interview', usage: 14, avgScore: 74.2 },
    { name: 'UX Design Assessment', usage: 8, avgScore: 81.5 },
    { name: 'Product Management Interview', usage: 6, avgScore: 73.8 }
  ],
  overTime: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    interviews: [8, 12, 15, 7],
    avgScores: [72.5, 75.8, 77.2, 80.1]
  },
  questionScores: [
    { id: 1, question: 'Describe your experience with React', avgScore: 68 },
    { id: 2, question: 'Explain component lifecycle methods', avgScore: 72 },
    { id: 3, question: 'How do you handle state management?', avgScore: 75 },
    { id: 4, question: 'Explain your approach to responsive design', avgScore: 82 },
    { id: 5, question: 'How do you debug frontend issues?', avgScore: 79 }
  ]
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // In a real app, this would fetch analytics from an API
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnalytics(MOCK_ANALYTICS);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Recruitment Analytics</h1>
        </div>
      </header>

      {/* Time range selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'overview'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'positions'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Positions
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'templates'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'questions'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Questions
            </button>
          </div>

          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Candidates"
                value={analytics.summary.totalCandidates}
                icon={<UsersIcon className="h-6 w-6 text-white" />}
                color="bg-blue-500"
              />
              <StatCard
                title="Completed Interviews"
                value={analytics.summary.completedInterviews}
                icon={<CheckCircleIcon className="h-6 w-6 text-white" />}
                color="bg-green-500"
              />
              <StatCard
                title="Pending Interviews"
                value={analytics.summary.pendingInterviews}
                icon={<ClockIcon className="h-6 w-6 text-white" />}
                color="bg-yellow-500"
              />
              <StatCard
                title="Completion Rate"
                value={`${analytics.summary.completionRate}%`}
                icon={<ChartBarIcon className="h-6 w-6 text-white" />}
                color="bg-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {/* Metrics */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Key Metrics</h3>
                  <div className="mt-5 divide-y divide-gray-200">
                    <div className="py-4 flex justify-between">
                      <div className="text-sm font-medium text-gray-500">Average Score</div>
                      <div className="text-sm font-semibold text-gray-900">{analytics.summary.averageScore}%</div>
                    </div>
                    <div className="py-4 flex justify-between">
                      <div className="text-sm font-medium text-gray-500">Highest Score</div>
                      <div className="text-sm font-semibold text-gray-900">{analytics.summary.highestScore}%</div>
                    </div>
                    <div className="py-4 flex justify-between">
                      <div className="text-sm font-medium text-gray-500">Expired Interviews</div>
                      <div className="text-sm font-semibold text-gray-900">{analytics.summary.expiredInterviews}</div>
                    </div>
                    <div className="py-4 flex justify-between">
                      <div className="text-sm font-medium text-gray-500">Avg Response Time</div>
                      <div className="text-sm font-semibold text-gray-900">2.3 days</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Positions chart */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Top Positions</h3>
                  <div className="mt-5 space-y-4">
                    {analytics.positions.map((position) => (
                      <div key={position.name}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm font-medium text-gray-700">{position.name}</div>
                          <div className="text-sm font-medium text-gray-500">{position.count} interviews</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(position.count / analytics.summary.totalCandidates) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Templates chart */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Top Templates</h3>
                  <div className="mt-5 space-y-4">
                    {analytics.templates.map((template) => (
                      <div key={template.name}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm font-medium text-gray-700">{template.name}</div>
                          <div className="text-sm font-medium text-gray-500">{template.usage} uses</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${(template.usage / 50) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Over time chart (mock) */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Interviews Over Time</h3>
                <div className="mt-5 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <DocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Chart visualization would be here</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      In a real implementation, this would be a line or bar chart showing interview trends.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Positions tab */}
        {activeTab === 'positions' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {analytics.positions.map((position) => (
                <li key={position.name}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="sm:flex sm:justify-between w-full">
                        <div>
                          <p className="text-md font-medium text-primary-600 truncate">{position.name}</p>
                          <div className="mt-2 flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <UsersIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {position.count} candidates
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Avg Score: {position.avgScore}%
                          </p>
                          <div className="mt-2 flex items-center justify-end">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${position.avgScore}%` }}
                              ></div>
                            </div>
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

        {/* Templates tab */}
        {activeTab === 'templates' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {analytics.templates.map((template) => (
                <li key={template.name}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="sm:flex sm:justify-between w-full">
                        <div>
                          <p className="text-md font-medium text-primary-600 truncate">{template.name}</p>
                          <div className="mt-2 flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <DocumentCheckIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {template.usage} uses
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Avg Score: {template.avgScore}%
                          </p>
                          <div className="mt-2 flex items-center justify-end">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${template.avgScore}%` }}
                              ></div>
                            </div>
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

        {/* Questions tab */}
        {activeTab === 'questions' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {analytics.questionScores.map((question) => (
                <li key={question.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="sm:flex sm:justify-between w-full">
                        <div className="flex-grow pr-4">
                          <p className="text-md font-medium text-gray-900 truncate">{question.question}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Avg Score: {question.avgScore}%
                          </p>
                          <div className="mt-2 flex items-center justify-end">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  question.avgScore > 80 ? 'bg-green-600' : 
                                  question.avgScore > 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${question.avgScore}%` }}
                              ></div>
                            </div>
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
      </main>
    </div>
  );
};

export default Analytics; 