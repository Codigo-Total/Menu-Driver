export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com/v1',
  TIMEOUT: 30000,
  AUTH_TOKEN_KEY: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth-token',
  USER_STORAGE_KEY: process.env.NEXT_PUBLIC_USER_STORAGE_KEY || 'user-data',
} as const;

export const APP_CONFIG = {
  NAME: 'Menu Driver',
  VERSION: '1.0.0',
  ENV: process.env.NODE_ENV || 'development',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
} as const;
