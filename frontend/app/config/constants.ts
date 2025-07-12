// Backend URL configuration
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8090';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/collections/users/auth-with-password',
    REFRESH: '/api/collections/users/auth-refresh',
    LOGOUT: '/api/collections/users/auth-logout',
  },
} as const;

// Other app constants
export const APP_NAME = 'PocketBase Template';
export const APP_VERSION = '1.0.0';