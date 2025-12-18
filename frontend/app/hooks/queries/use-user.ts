import { useQuery } from '@tanstack/react-query';
import pocketbaseService, { type User } from '@/services/pocketbase.service';

export const userKeys = {
  all: ['user'] as const,
  current: () => [...userKeys.all, 'current'] as const,
};

export function useUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: async (): Promise<User | null> => {
      // First check if we have a valid stored auth
      const currentUser = pocketbaseService.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      // Return the current user without refreshing every time
      // The token refresh can happen separately when needed
      return currentUser;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: false, // Don't retry auth checks
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Don't refetch if data exists
  });
}