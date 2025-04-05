import api from './api';

/**
 * Authentication service to handle all auth-related operations
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Registration response
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Login a user and store token and user info
   * @param {Object} credentials - User login credentials
   * @returns {Promise} - Login response with user data
   */
  login: async (credentials) => {
    try {
      // Convert to form data for OAuth2 compatibility with FastAPI
      const formData = new FormData();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      
      const response = await api.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Store token and user data in localStorage
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.user_id,
          name: response.data.user_name,
          type: response.data.user_type,
        }));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Logout a user and clear storage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user information
   * @returns {Object|null} - Current user data or null if not logged in
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is logged in
   * @returns {Boolean} - True if user is logged in
   */
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get user profile from server
   * @returns {Promise} - User profile data
   */
  getUserProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default authService; 