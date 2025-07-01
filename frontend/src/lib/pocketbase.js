import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

// Initialize PocketBase client
// In production, this will connect to the same domain
// In development, it connects to the local PocketBase instance
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090');

// Create a store for the current user
export const currentUser = writable(pb.authStore.model);

// Listen to auth store changes and update the user store
pb.authStore.onChange((auth) => {
    currentUser.set(pb.authStore.model);
});