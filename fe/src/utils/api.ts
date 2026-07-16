import axios from 'axios';

// Base API URL pointing to the Spring Boot backend
const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token if it exists in localStorage
api.interceptors.request.use(
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

// Response interceptor for handling common error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is due to authentication / expired token
    if (error.response && error.response.status === 401) {
      // Clear expired credentials
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');

      // Optionally trigger a page reload or event to redirect to login
      if (window.location.pathname !== '/login') {
        // Since we are using standard navigation without complex router library, we can reload or dispatch custom event
        window.dispatchEvent(new CustomEvent('unauthorized-api-call'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
