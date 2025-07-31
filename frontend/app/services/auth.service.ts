import pb from '~/lib/pocketbase';
import type { RecordModel, RecordAuthResponse } from 'pocketbase';

export interface User extends RecordModel {
  email: string;
  name?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<RecordAuthResponse<User>> {
    const { email, password } = credentials;
    
    try {
      // Try to authenticate as a regular user first
      return await pb.collection('users').authWithPassword<User>(email, password);
    } catch (userError) {
      // If user auth fails, try admin auth (superusers collection)
      return await pb.collection('_superusers').authWithPassword<User>(email, password);
    }
  }

  async logout(): Promise<void> {
    pb.authStore.clear();
  }

  async refresh(): Promise<RecordAuthResponse<User> | null> {
    if (!pb.authStore.isValid) {
      return null;
    }

    try {
      const authData = await pb.collection(pb.authStore.record?.collectionName || 'users')
        .authRefresh<User>();
      return authData;
    } catch (error) {
      // If refresh fails, clear the auth store
      pb.authStore.clear();
      return null;
    }
  }

  getCurrentUser(): User | null {
    if (!pb.authStore.isValid) {
      return null;
    }
    return pb.authStore.record as User;
  }

  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  }

  getToken(): string {
    return pb.authStore.token;
  }

  // Subscribe to auth state changes
  subscribeToAuthChanges(callback: (token: string, model: RecordModel | null) => void) {
    return pb.authStore.onChange(callback);
  }
}

export const authService = new AuthService();