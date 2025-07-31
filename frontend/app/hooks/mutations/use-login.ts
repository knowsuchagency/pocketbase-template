import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, type LoginCredentials, type User } from '~/services/auth.service';
import { userKeys } from '~/hooks/queries/use-user';
import { useAppStore } from '~/stores/app.store';
import type { RecordAuthResponse } from 'pocketbase';

export function useLogin() {
  const queryClient = useQueryClient();
  const addNotification = useAppStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<RecordAuthResponse<User>> => {
      return authService.login(credentials);
    },
    onSuccess: (data) => {
      // Update the user query cache
      queryClient.setQueryData(userKeys.current(), data.record);
      
      // Invalidate all user queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      
      addNotification({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully logged in.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Login failed',
        message: error.message || 'Invalid email or password',
      });
    },
  });
}