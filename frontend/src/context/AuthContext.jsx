import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// Create auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = () => {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Handle user registration
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      await authService.register(userData);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.detail || 'Registration failed');
      setLoading(false);
      return false;
    }
  };

  // Handle user login
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.login(credentials);
      const user = {
        id: data.user_id,
        name: data.user_name,
        type: data.user_type,
      };
      setCurrentUser(user);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.detail || 'Login failed');
      setLoading(false);
      return false;
    }
  };

  // Handle user logout
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 