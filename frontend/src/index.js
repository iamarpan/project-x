import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './styles/tailwind.css';
import './styles/auth.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Get Clerk publishable key
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Clerk appearance configuration
const clerkAppearance = {
  layout: {
    socialButtonsVariant: 'iconButton',
    socialButtonsPlacement: 'bottom',
    showOptionalFields: true,
    logoPlacement: 'inside',
    shimmer: false,
    privacyPageUrl: undefined,
    termsPageUrl: undefined,
  },
  elements: {
    rootBox: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '0 16px',
      margin: '0 auto',
      boxSizing: 'border-box',
      width: '100%',
    },
    card: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      maxWidth: '28rem',
      width: '100%',
      margin: '0 auto',
    },
    formButtonPrimary: {
      backgroundColor: '#0ea5e9',
      '&:hover': {
        backgroundColor: '#0284c7',
      },
    },
  },
};

// ClerkProvider configuration
const clerkConfig = {
  publishableKey: clerkPubKey,
  appearance: clerkAppearance,
  // Enable loading user metadata
  userSettings: {
    enableMetadata: true,
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider {...clerkConfig}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
); 