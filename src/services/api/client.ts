import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/constants/config';

/**
 * Custom Axios instance pre-configured with base URL, timeout, and interceptors.
 * This ensures all API calls follow the same pattern and handle global concerns
 * like authentication and error normalization.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Authorization tokens
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(API_CONFIG.AUTH_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors and data normalization
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    // Handle global error cases (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(API_CONFIG.AUTH_TOKEN_KEY);
        // Optional: window.location.href = '/login';
      }
    }
    
    // Normalize error data for consistent consumption in the app
    const normalizedError = {
      message: (error.response?.data as any)?.message || error.message || 'Unknown error',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };

    return Promise.reject(normalizedError);
  }
);

export { apiClient };
