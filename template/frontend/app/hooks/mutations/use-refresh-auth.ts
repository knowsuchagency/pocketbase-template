import { useMutation, useQueryClient } from '@tanstack/react-query';
import pocketbaseService from '@/services/pocketbase.service';
import { userKeys } from '@/hooks/queries/use-user';

export function useRefreshAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return pocketbaseService.refresh();
    },
    onSuccess: (data) => {
      if (data) {
        // Update the user query cache with refreshed data
        queryClient.setQueryData(userKeys.current(), data.record);
      } else {
        // Clear user data if refresh failed
        queryClient.setQueryData(userKeys.current(), null);
        queryClient.removeQueries({ queryKey: userKeys.all });
      }
    },
  });
}