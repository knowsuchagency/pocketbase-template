import PocketBase from 'pocketbase';

// Get backend URL from environment or use default
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8090';

// Create and export PocketBase instance
const pb = new PocketBase(BACKEND_URL);

// Auto-cancel requests on duplicate calls
pb.autoCancellation(false);

// Export the backend URL for use in other parts of the app
export { BACKEND_URL };

// Default export the PocketBase instance
export default pb;