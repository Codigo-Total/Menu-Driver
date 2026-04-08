import { apiClient } from './client';
import { ApiResponse, LoginResponse } from '@/types/api.types';
import { User } from '@/types/auth.types';

/**
 * Service for handling authentication-related API calls.
 * This encapsulates API communication and data transformations.
 */
export const authService = {
  login: async (credentials: any): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post('/auth/login', credentials);
  },

  register: async (userData: any): Promise<ApiResponse<User>> => {
    return apiClient.post('/auth/register', userData);
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiClient.get('/auth/me');
  },
};
