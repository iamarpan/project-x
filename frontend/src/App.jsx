import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { create } from 'zustand';

// Layout components
import RecruiterLayout from './layouts/RecruiterLayout';
import CandidateLayout from './layouts/CandidateLayout';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import InterviewTemplates from './pages/recruiter/InterviewTemplates';
import CreateTemplate from './pages/recruiter/CreateTemplate';
import EditTemplate from './pages/recruiter/EditTemplate';
import CandidateScheduler from './pages/recruiter/CandidateScheduler';
import CandidateReview from './pages/recruiter/CandidateReview';
import RecruiterAnalytics from './pages/recruiter/Analytics';
import Reviews from './pages/recruiter/Reviews';

// Candidate pages
import CandidateDashboard from './pages/candidate/Dashboard';
import InterviewSession from './pages/candidate/InterviewSession';
import InterviewComplete from './pages/candidate/InterviewComplete';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Create a store for authentication
const useAuthStore = create((set) => ({
  isAuthenticated: false, // In a real app, would check localStorage/cookie
  userType: null, // 'recruiter' or 'candidate'
  login: (userType) => set({ isAuthenticated: true, userType }),
  logout: () => set({ isAuthenticated: false, userType: null }),
}));

// Demo user types for easy switching
const DEMO_TYPES = {
  RECRUITER: 'recruiter',
  CANDIDATE: 'candidate',
};

const App = () => {
  const { isAuthenticated, userType, login, logout } = useAuthStore();
  const location = useLocation();
  
  // Demo mode for showcasing both interfaces
  const [demoUserType, setDemoUserType] = useState(userType || DEMO_TYPES.RECRUITER);
  
  // For demo purposes, set based on URL
  useEffect(() => {
    if (location.pathname.includes('/recruiter')) {
      setDemoUserType(DEMO_TYPES.RECRUITER);
    } else if (location.pathname.includes('/candidate')) {
      setDemoUserType(DEMO_TYPES.CANDIDATE);
    }
  }, [location.pathname]);
  
  // For demo, auto login
  useEffect(() => {
    if (!isAuthenticated) {
      login(demoUserType);
    }
  }, [isAuthenticated, demoUserType, login]);
  
  // Auth check for routes
  const RequireAuth = ({ children, userType: requiredUserType }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // In a real app, check for proper authorization
    if (requiredUserType && userType !== requiredUserType) {
      // For demo, pretend to be the correct user type
      return children;
      
      // In a real app, do this instead:
      // return <Navigate to="/" replace />;
    }
    
    return children;
  };
  
  // User switching for demo purposes only
  const switchUserType = () => {
    const newUserType = demoUserType === DEMO_TYPES.RECRUITER 
      ? DEMO_TYPES.CANDIDATE 
      : DEMO_TYPES.RECRUITER;
    
    setDemoUserType(newUserType);
    logout();
    login(newUserType);
    
    return newUserType === DEMO_TYPES.RECRUITER 
      ? <Navigate to="/recruiter/dashboard" replace />
      : <Navigate to="/candidate/dashboard" replace />;
  };

  return (
    <>
      {/* Demo Mode Panel (would be removed in real app) */}
      <div className="fixed top-0 right-0 z-50 bg-gray-800 text-white px-4 py-2 text-sm">
        <div className="flex items-center space-x-2">
          <span>Demo Mode: {demoUserType.toUpperCase()}</span>
          <button onClick={switchUserType} className="bg-primary-500 hover:bg-primary-600 px-2 py-1 rounded text-xs">
            Switch to {demoUserType === DEMO_TYPES.RECRUITER ? 'CANDIDATE' : 'RECRUITER'}
          </button>
        </div>
      </div>
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Recruiter routes */}
        <Route 
          path="/recruiter" 
          element={
            <RequireAuth userType={DEMO_TYPES.RECRUITER}>
              <RecruiterLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="templates" element={<InterviewTemplates />} />
          <Route path="templates/create" element={<CreateTemplate />} />
          <Route path="templates/edit/:templateId" element={<EditTemplate />} />
          <Route path="scheduler" element={<CandidateScheduler />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="reviews/:interviewId" element={<CandidateReview />} />
          <Route path="analytics" element={<RecruiterAnalytics />} />
        </Route>
        
        {/* Candidate routes */}
        <Route 
          path="/candidate" 
          element={
            <RequireAuth userType={DEMO_TYPES.CANDIDATE}>
              <CandidateLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/candidate/dashboard" replace />} />
          <Route path="dashboard" element={<CandidateDashboard />} />
        </Route>
        
        {/* Interview session standalone page */}
        <Route 
          path="/interview/:interviewId" 
          element={
            <RequireAuth userType={DEMO_TYPES.CANDIDATE}>
              <InterviewSession />
            </RequireAuth>
          } 
        />
        
        <Route 
          path="/interview-complete" 
          element={
            <RequireAuth userType={DEMO_TYPES.CANDIDATE}>
              <InterviewComplete />
            </RequireAuth>
          } 
        />
        
        {/* Redirect to appropriate dashboard based on user type */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              userType === DEMO_TYPES.RECRUITER ? (
                <Navigate to="/recruiter/dashboard" replace />
              ) : (
                <Navigate to="/candidate/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* 404 route */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </>
  );
};

export default App; 