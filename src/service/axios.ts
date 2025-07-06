import { API_ENDPOINT } from '@/configs/env';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;

    // Handle 401 Unauthorized errors (token expired)
    if (response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = `/login?redirect=${window.location.pathname}`;
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to make API requests with proper error handling
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;

      // Extract error message from response if available
      const errorMessage =
        axiosError.response?.data?.message || axiosError.message || 'An unknown error occurred';

      throw new Error(errorMessage);
    }

    throw error;
  }
};

export default axiosInstance;
