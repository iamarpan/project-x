import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
    try {
      const currentUserType = getUserType(user);
      
      if (currentUserType !== userType) {
        console.log(`User type mismatch: expected ${userType}, got ${currentUserType}`);
        return <Navigate to="/select-role" replace />;
      }
    } catch (error) {
      console.error('Error checking user type:', error);
      return <Navigate to="/select-role" replace />;
    }
  }
  
  return children;
};

const App = () => {
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  
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
  
  const handleSignOut = async () => {
    try {
      // Use redirectUrl option to specify where to go after sign-out
      await signOut({ redirectUrl: '/sign-in' });
      // No need to manually navigate - the redirectUrl will handle it
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Check if current path is a dashboard path that already has its own header
  const isDashboardPath = 
    location.pathname.startsWith('/recruiter') || 
    location.pathname.startsWith('/candidate') ||
    location.pathname.startsWith('/interview');
  
  return (
    <>
      {isSignedIn && location.pathname !== '/select-role' && !isDashboardPath && (
        <div className="fixed top-0 right-0 z-50 bg-white shadow-sm px-4 py-2 text-sm border-l border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {user.firstName} {user.lastName}
            </span>
            <UserButton />
            <button 
              onClick={handleSignOut} 
              className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-md text-xs font-medium"
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