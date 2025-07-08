import PocketBase from 'pocketbase';
import { browser } from '$app/environment';
import { BACKEND_URL } from '$lib/config/constants';
import { currentUser } from '$lib/stores/auth';

let pb: PocketBase | null = null;

if (browser) {
  pb = new PocketBase(BACKEND_URL);
  pb.autoCancellation = false;
  
  // Update the user store when auth state changes
  pb.authStore.onChange(() => {
    currentUser.set(pb.authStore.record);
  });
  
  // Set initial user
  currentUser.set(pb.authStore.record);
}

export default pb;