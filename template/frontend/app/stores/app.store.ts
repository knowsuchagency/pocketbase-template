import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface AppState {
  // Loading state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Loading state
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // Notifications
      notifications: [],
      
      addNotification: (notification) => {
        const id = crypto.randomUUID();
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove notification after duration (default 5 seconds)
        if (notification.duration !== 0) {
          setTimeout(() => {
            useAppStore.getState().removeNotification(id);
          }, notification.duration || 5000);
        }
      },

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'AppStore',
    }
  )
);