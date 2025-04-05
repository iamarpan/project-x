import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn, 
  SignIn, 
  SignUp, 
  UserButton, 
  useUser, 
  useClerk 
} from '@clerk/clerk-react';
import { getUserType } from './utils/userMetadata';

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

// Additional import for UserTypeSelector
import UserTypeSelector from './components/clerk/UserTypeSelector';

// Protected route component
const ProtectedRoute = ({ children, userType }) => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();

  // User isn't signed in, redirect to sign-in page
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // If userType is specified, check if user has the correct type
  if (userType) {
    const currentUserType = getUserType(user);
    
    if (currentUserType !== userType) {
      return <Navigate to="/select-role" replace />;
    }
  }
  
  return children;
};

const App = () => {
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  const location = useLocation();
  
  // Add a body class for auth pages to help with centering
  React.useEffect(() => {
    const isAuthPage = location.pathname.includes('/sign-in') || location.pathname.includes('/sign-up');
    
    if (isAuthPage) {
      document.body.classList.add('auth-page');
    } else {
      document.body.classList.remove('auth-page');
    }
    
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, [location.pathname]);
  
  return (
    <>
      {isSignedIn && location.pathname !== '/select-role' && (
        <div className="fixed top-0 right-0 z-50 bg-gray-800 text-white px-4 py-2 text-sm">
          <div className="flex items-center space-x-4">
            <span>
              {user.firstName} {user.lastName}
            </span>
            <UserButton />
            <button 
              onClick={() => signOut()} 
              className="bg-primary-500 hover:bg-primary-600 px-2 py-1 rounded text-xs"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
      
      <Routes>
        {/* Public auth routes */}
        <Route
          path="/sign-in/*"
          element={
            <SignedOut>
              <SignIn routing="path" path="/sign-in" redirectUrl="/dashboard" />
            </SignedOut>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <SignedOut>
              <SignUp routing="path" path="/sign-up" redirectUrl="/dashboard" />
            </SignedOut>
          }
        />
        
        {/* Dashboard route - redirects to appropriate dashboard based on user type */}
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <Navigate to="/select-role" replace />
            </SignedIn>
          }
        />
        
        {/* User type selector - only accessible when signed in */}
        <Route
          path="/select-role"
          element={
            <SignedIn>
              <UserTypeSelector />
            </SignedIn>
          }
        />
        
        {/* Recruiter routes */}
        <Route 
          path="/recruiter" 
          element={
            <ProtectedRoute userType="recruiter">
              <RecruiterLayout />
            </ProtectedRoute>
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
            <ProtectedRoute userType="candidate">
              <CandidateLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/candidate/dashboard" replace />} />
          <Route path="dashboard" element={<CandidateDashboard />} />
        </Route>
        
        {/* Interview session standalone page */}
        <Route 
          path="/interview/:interviewId" 
          element={
            <ProtectedRoute userType="candidate">
              <InterviewSession />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/interview-complete" 
          element={
            <ProtectedRoute userType="candidate">
              <InterviewComplete />
            </ProtectedRoute>
          } 
        />
        
        {/* Root redirect */}
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />} 
        />
        
        {/* Legacy redirects */}
        <Route path="/login" element={<Navigate to="/sign-in" replace />} />
        <Route path="/register" element={<Navigate to="/sign-up" replace />} />
        
        {/* 404 route */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </>
  );
};

export default App; 