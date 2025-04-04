import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  DocumentIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import Card from '../../components/common/Card';

// Mock data
const recentInterviews = [
  { id: 1, candidate: 'Sarah Chen', position: 'Frontend Developer', date: '2025-04-05', status: 'pending' },
  { id: 2, candidate: 'Michael Johnson', position: 'Backend Developer', date: '2025-04-03', status: 'completed' },
  { id: 3, candidate: 'Jessica Smith', position: 'UX Designer', date: '2025-04-04', status: 'pending' },
  { id: 4, candidate: 'David Wilson', position: 'Product Manager', date: '2025-04-02', status: 'completed' },
  { id: 5, candidate: 'Emma Brown', position: 'DevOps Engineer', date: '2025-04-01', status: 'completed' },
];

const interviewsByDay = [
  { name: 'Mon', completed: 2, scheduled: 3 },
  { name: 'Tue', completed: 4, scheduled: 2 },
  { name: 'Wed', completed: 3, scheduled: 5 },
  { name: 'Thu', completed: 5, scheduled: 1 },
  { name: 'Fri', completed: 2, scheduled: 4 },
  { name: 'Sat', completed: 1, scheduled: 2 },
  { name: 'Sun', completed: 0, scheduled: 3 },
];

const candidateSourceData = [
  { name: 'LinkedIn', value: 45 },
  { name: 'Job Boards', value: 30 },
  { name: 'Referrals', value: 15 },
  { name: 'Direct', value: 10 },
];

const COLORS = ['#0284c7', '#8b5cf6', '#059669', '#d97706'];

const stats = [
  { name: 'Total Candidates', value: 145, icon: UserGroupIcon, change: 12, isIncrease: true },
  { name: 'Active Interviews', value: 28, icon: DocumentIcon, change: 8, isIncrease: true },
  { name: 'Avg. Time to Complete', value: '45min', icon: ClockIcon, change: 10, isIncrease: false },
  { name: 'Completion Rate', value: '87%', icon: CheckCircleIcon, change: 5, isIncrease: true },
];

const RecruiterDashboard = () => {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <Link
          to="/recruiter/scheduler"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Schedule Interview
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <stat.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      <p
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.isIncrease ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.isIncrease ? (
                          <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                        )}
                        <span className="ml-1">{stat.change}%</span>
                      </p>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Interviews by Day</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={interviewsByDay}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#0284c7" name="Completed" />
                  <Bar dataKey="scheduled" fill="#8b5cf6" name="Scheduled" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Candidate Sources</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={candidateSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {candidateSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Interviews</h3>
          <p className="mt-1 text-sm text-gray-500">
            A list of recent interviews and their current status.
          </p>
        </div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Candidate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Position
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentInterviews.map((interview) => (
                      <tr key={interview.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{interview.candidate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{interview.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{interview.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              interview.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {interview.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/recruiter/reviews/${interview.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RecruiterDashboard; 