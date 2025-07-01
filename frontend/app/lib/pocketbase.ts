import PocketBase from 'pocketbase';

// In production, the frontend is served from the same domain as PocketBase
// In development, use VITE_POCKETBASE_URL to point to the local PocketBase instance
const pbUrl = import.meta.env.PROD 
  ? window.location.origin 
  : (import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090');

const pb = new PocketBase(pbUrl);

// Optional: Enable auto cancellation of pending requests
pb.autoCancellation(false);

export default pb;