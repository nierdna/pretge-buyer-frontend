import { API_ENDPOINT } from '@/configs/env';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { camelizeKeys } from 'humps';
import AuthService from './auth.service';

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get access token from auth store
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.params?.transformCase === false || config.data?.transformCase === false) {
      delete config.params?.transformCase;
      delete config.data?.transformCase;
      return config;
    }
    // config.params = decamelizeKeys(config.params);
    // if (config.headers["Content-Type"] !== "multipart/form-data") {
    //   config.data = decamelizeKeys(config.data);
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define queue item type
interface QueueItem {
  resolve: (value: string | null) => void;
  reject: (error: unknown) => void;
}

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Store pending requests
let failedQueue: QueueItem[] = [];

// Process pending requests
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.pagination) {
      response.data.data = {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    }
    if (Object.keys(response.data).includes('success')) {
      response.data = {
        data: response.data,
        success: response.data.success,
      };
    }

    response.data = camelizeKeys(response.data.data ?? response.data, function (key, convert) {
      return /^[A-Z0-9_]+$/.test(key) ? key : convert(key);
    });

    return Promise.resolve(response);
  },
  async (error) => {
    // Handle errors here
    if (error.response) {
      const originalRequest = error.config;

      // Handle 401 Unauthorized error
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, add request to queue
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        // Get refresh token from auth store
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          // No refresh token, clear auth and reject
          useAuthStore.getState().logout();
          isRefreshing = false;
          return Promise.reject(error);
        }

        try {
          // Try to refresh the token
          const authService = new AuthService();
          const response = await authService.refreshToken(refreshToken);

          // Update access token in store
          const newAccessToken = response.accessToken;
          const newRefreshToken = response.refreshToken;
          useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

          // Update Authorization header
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

          // Process pending requests
          processQueue(null, newAccessToken);
          isRefreshing = false;

          // Retry original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, logout user
          processQueue(refreshError, null);
          useAuthStore.getState().logout();
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      switch (error.response.status) {
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          // Handle other errors
          break;
      }
    } else if (error?.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
