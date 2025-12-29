import PocketBase from 'pocketbase';
import type { RecordModel, RecordAuthResponse } from 'pocketbase';

// In production, frontend is served from PocketBase, so use root-relative URL
// In development, frontend runs on :5173 and needs to connect to :8090
const BACKEND_URL = import.meta.env.DEV ? 'http://localhost:8090' : '/';

export interface User extends RecordModel {
  email: string;
  name?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  passwordConfirm: string;
  name?: string;
}

class PocketBaseService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(BACKEND_URL);
    // Auto-cancel requests on duplicate calls
    this.pb.autoCancellation(false);
  }

  // Expose the PocketBase instance for direct access when needed
  get client() {
    return this.pb;
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<RecordAuthResponse<User>> {
    const { email, password } = credentials;
    // Authenticate as a regular user only
    return await this.pb.collection('users').authWithPassword<User>(email, password);
  }

  async loginAsSuperuser(credentials: LoginCredentials): Promise<RecordAuthResponse<User>> {
    const { email, password } = credentials;
    // Authenticate as a superuser/admin
    return await this.pb.collection('_superusers').authWithPassword<User>(email, password);
  }

  async signup(credentials: SignupCredentials): Promise<RecordAuthResponse<User>> {
    const { email, password, passwordConfirm, name } = credentials;
    // Create the user account
    const user = await this.pb.collection('users').create<User>({
      email,
      password,
      passwordConfirm,
      name,
    });

    // Automatically log in the user after signup
    return await this.login({ email, password });
  }

  async logout(): Promise<void> {
    this.pb.authStore.clear();
  }

  async refresh(): Promise<RecordAuthResponse<User> | null> {
    if (!this.pb.authStore.isValid) {
      return null;
    }

    try {
      const authData = await this.pb.collection(this.pb.authStore.record?.collectionName || 'users')
        .authRefresh<User>();
      return authData;
    } catch (error) {
      // If refresh fails, clear the auth store
      this.pb.authStore.clear();
      return null;
    }
  }

  getCurrentUser(): User | null {
    if (!this.pb.authStore.isValid) {
      return null;
    }
    return this.pb.authStore.record as User;
  }

  isAuthenticated(): boolean {
    return this.pb.authStore.isValid;
  }

  getToken(): string {
    return this.pb.authStore.token;
  }

  // Subscribe to auth state changes
  subscribeToAuthChanges(callback: (token: string, model: RecordModel | null) => void) {
    return this.pb.authStore.onChange(callback);
  }

  // Collection access methods
  collection(name: string) {
    return this.pb.collection(name);
  }

  // File URL builder
  getFileUrl(record: RecordModel, filename: string, queryParams?: { thumb?: string; token?: string; download?: boolean }) {
    return this.pb.files.getUrl(record, filename, queryParams);
  }

  // Health check
  async health() {
    return this.pb.health.check();
  }
}

// Export singleton instance
export const pocketbaseService = new PocketBaseService();

// Default export for convenience
export default pocketbaseService;