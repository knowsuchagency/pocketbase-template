import { useQuery, useQueryClient } from '@tanstack/react-query';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};

export function useNotifications() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: (): Notification[] => {
      // Check if we already have data in the cache
      const existingData = queryClient.getQueryData<Notification[]>(notificationKeys.list());
      return existingData ?? [];
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
