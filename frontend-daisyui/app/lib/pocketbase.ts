import PocketBase from 'pocketbase';
import { BACKEND_URL } from '~/config/constants';

// In production, the frontend is served from the same domain as PocketBase
// In development, use VITE_BACKEND_URL to point to the local PocketBase instance
const pb = new PocketBase(BACKEND_URL);

// Optional: Enable auto cancellation of pending requests
pb.autoCancellation(false);

export default pb;