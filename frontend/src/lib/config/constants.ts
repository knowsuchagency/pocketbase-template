export const BACKEND_URL = 
  typeof window !== 'undefined' && import.meta.env.PROD
    ? window.location.origin
    : import.meta.env.VITE_BACKEND_URL || 'http://localhost:8090';