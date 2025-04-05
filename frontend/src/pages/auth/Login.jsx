import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Import auth context
import { useAuth } from '../../context/AuthContext';
import SocialLogin from '../../components/common/SocialLogin';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, isAuthenticated, currentUser } = useAuth();
  const [loginError, setLoginError] = useState('');
  
  const from = location.state?.from?.pathname || '/';
  
  // If already authenticated, redirect to the appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const path = currentUser?.type === 'recruiter' 
        ? '/recruiter/dashboard' 
        : '/candidate/dashboard';
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError('');
    
    try {
      const success = await login(values);
      
      if (success) {
        // Let the useEffect handle the redirect
      } else {
        setLoginError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please try again.');
    }
    
    setSubmitting(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to AI Interview Assistant
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="space-y-6">
                {(loginError || authError) && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{loginError || authError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email && touched.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    />
                    {errors.email && touched.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password && touched.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    />
                    {errors.password && touched.password && (
                      <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
                
                <SocialLogin userType={values.email.includes('recruiter') ? 'recruiter' : 'candidate'} />
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="mb-1">For demo purposes, you can use any of the following:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Recruiter:</strong> recruiter@example.com / any password</li>
                      <li><strong>Candidate:</strong> candidate@example.com / any password</li>
                    </ul>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login; 