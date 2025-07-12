import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { pb } from '~/lib/pocketbase';
import type { RecordModel, RecordAuthResponse } from 'pocketbase';

interface User extends RecordModel {
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<RecordAuthResponse<User>>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,

        login: async (email: string, password: string) => {
          set({ isLoading: true });
          try {
            const authData = await pb.collection('users').authWithPassword<User>(email, password);
            set({
              user: authData.record,
              isAuthenticated: true,
              isLoading: false,
            });
            return authData;
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        logout: () => {
          pb.authStore.clear();
          set({
            user: null,
            isAuthenticated: false,
          });
        },

        checkAuth: () => {
          const isValid = pb.authStore.isValid;
          const model = pb.authStore.model as User | null;
          
          set({
            user: isValid ? model : null,
            isAuthenticated: isValid,
          });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    {
      name: 'AuthStore',
    }
  )
);

// Sync PocketBase auth state with Zustand
pb.authStore.onChange(() => {
  useAuthStore.getState().checkAuth();
});