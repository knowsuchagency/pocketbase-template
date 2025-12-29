import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import pocketbaseService from '@/services/pocketbase.service';
import { userKeys } from '@/hooks/queries/use-user';
import { useAppStore } from '@/stores/app.store';

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addNotification = useAppStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async () => {
      await pocketbaseService.logout();
    },
    onSuccess: () => {
      // Clear all user-related queries
      queryClient.removeQueries({ queryKey: userKeys.all });
      
      // Reset query client to clear all cached data
      queryClient.clear();
      
      // Navigate to home
      navigate('/');
      
      addNotification({
        type: 'info',
        title: 'Logged out',
        message: 'You have been successfully logged out.',
      });
    },
  });
}