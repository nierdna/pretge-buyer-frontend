import { API_ENDPOINT } from '@/configs/env';
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Helper function to safely access localStorage
const getLocalStorage = (key: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage access failed:', error);
      return null;
    }
  }
  return null;
};

const requestHandler = {
  onFulfilled(config: InternalAxiosRequestConfig) {
    const res = getLocalStorage('auth.store');
    const accessToken = res ? JSON.parse(res).accessToken : null;
    if (accessToken && config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // if (config.params?.transformCase === false || config.data?.transformCase === false) {
    //   delete config.params?.transformCase;
    //   delete config.data?.transformCase;
    //   return config;
    // }
    return config;
  },
};

const responseHandler = {
  onFulfilled(response: AxiosResponse) {
    response.statusText = '';
    // Transform paginated data
    if (response.data.pagination) {
      response.data.data = {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    }
    return Promise.resolve(response);
  },
  onRejected(error: AxiosError) {
    if (error.response?.data) {
      const data = error.response.data as any;
      if (error.response.status === 401) {
        // authStore.logout()
        // userStore.logout()
      }
      error.response.statusText = data.message;
      error.response.data = null;
    } else {
      error.response!.statusText = 'Connection lost';
    }
    return Promise.reject(error.response);
  },
};

export const api: AxiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${
      getLocalStorage('auth.store') ? JSON.parse(getLocalStorage('auth.store')!).accessToken : ''
    }`,
    'Cache-Control': 'no-cache',
  },
});

api.interceptors.request.use(requestHandler.onFulfilled);
api.interceptors.response.use(responseHandler.onFulfilled, responseHandler.onRejected);
