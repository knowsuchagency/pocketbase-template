import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import pb from '~/lib/pocketbase'
import type { RecordModel } from 'pocketbase'

interface AuthState {
  user: RecordModel | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: pb.authStore.record,
        isAuthenticated: pb.authStore.isValid,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null })
          try {
            const authData = await pb.collection('users').authWithPassword(email, password)
            set({
              user: authData.record,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Login failed'
            })
            throw error
          }
        },

        logout: async () => {
          pb.authStore.clear()
          set({
            user: null,
            isAuthenticated: false,
            error: null
          })
        },

        checkAuth: () => {
          set({
            user: pb.authStore.record,
            isAuthenticated: pb.authStore.isValid
          })
        },

        clearError: () => {
          set({ error: null })
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          // We don't persist loading or error states
          user: state.user,
          isAuthenticated: state.isAuthenticated
        })
      }
    )
  )
)

// Listen to PocketBase auth changes
pb.authStore.onChange(() => {
  useAuthStore.getState().checkAuth()
})