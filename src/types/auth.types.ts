export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}
