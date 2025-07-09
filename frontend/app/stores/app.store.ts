import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface AppState {
  isLoading: boolean
  notifications: Notification[]
  
  // Actions
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      isLoading: false,
      notifications: [],

      setLoading: (loading) => set({ isLoading: loading }),

      addNotification: (notification) => {
        const id = Date.now().toString()
        const newNotification = { ...notification, id }
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }))

        // Auto-remove notification after duration (default 5 seconds)
        if (notification.duration !== 0) {
          setTimeout(() => {
            useAppStore.getState().removeNotification(id)
          }, notification.duration || 5000)
        }
      },

      removeNotification: (id) => 
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),

      clearNotifications: () => set({ notifications: [] })
    })
  )
)