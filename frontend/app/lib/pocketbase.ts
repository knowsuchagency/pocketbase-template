import PocketBase from 'pocketbase';

// In production, frontend is served from PocketBase, so use relative URL
// In development, frontend runs on :5173 and needs to connect to :8090
const BACKEND_URL = import.meta.env.DEV ? 'http://localhost:8090' : '';

// Create and export PocketBase instance
const pb = new PocketBase(BACKEND_URL);

// Auto-cancel requests on duplicate calls
pb.autoCancellation(false);

// Default export the PocketBase instance
export default pb;
