import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { notificationKeys, type Notification, type NotificationType } from '@/hooks/queries/use-notifications';

export interface AddNotificationParams {
  type: NotificationType;
  title: string;
  message?: string;
}

export function useNotificationActions() {
  const queryClient = useQueryClient();

  const addNotification = useCallback((params: AddNotificationParams) => {
    const notification: Notification = {
      id: crypto.randomUUID(),
      ...params,
    };

    queryClient.setQueryData<Notification[]>(notificationKeys.list(), (old = []) => {
      return [...old, notification];
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      queryClient.setQueryData<Notification[]>(notificationKeys.list(), (old = []) => {
        return old.filter((n) => n.id !== notification.id);
      });
    }, 5000);
  }, [queryClient]);

  const removeNotification = useCallback((id: string) => {
    queryClient.setQueryData<Notification[]>(notificationKeys.list(), (old = []) => {
      return old.filter((n) => n.id !== id);
    });
  }, [queryClient]);

  return { addNotification, removeNotification };
}
