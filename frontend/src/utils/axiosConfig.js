import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
        details: error.message
      });
    }

    // Handle token expiration
    if (error.response.status === 401) {
      const currentPath = window.location.pathname;
      
      // Don't redirect if already on login/signup pages
      if (!['/login', '/signup', '/'].includes(currentPath)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    // Standardize error format
    const standardError = {
      code: error.response.data?.code || `HTTP_${error.response.status}`,
      message: error.response.data?.message || error.message || 'An error occurred',
      details: error.response.data?.details || null,
      status: error.response.status
    };

    console.error('API Error:', standardError);
    return Promise.reject(standardError);
  }
);

export default axiosInstance;
