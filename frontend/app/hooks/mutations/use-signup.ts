import { useMutation, useQueryClient } from '@tanstack/react-query';
import pocketbaseService, { type SignupCredentials } from '@/services/pocketbase.service';
import { userKeys } from '../queries/use-user';
import { useAppStore } from '@/stores/app.store';

export function useSignup() {
  const queryClient = useQueryClient();
  const addNotification = useAppStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      return await pocketbaseService.signup(credentials);
    },
    onSuccess: (data) => {
      // Update the user query cache
      queryClient.setQueryData(userKeys.current(), data.record);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: userKeys.all });

      addNotification({
        type: 'success',
        title: 'Welcome!',
        message: 'Your account has been created successfully.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.message || error?.message || 'Failed to create account';
      addNotification({
        type: 'error',
        title: 'Signup failed',
        message,
      });
    },
  });
}
