import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '~/services/auth.service';
import { useUser, userKeys } from './queries/use-user';
import { useLogin } from './mutations/use-login';
import { useLogout } from './mutations/use-logout';

export function useAuth() {
  const queryClient = useQueryClient();
  const userQuery = useUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  // Subscribe to PocketBase auth changes
  useEffect(() => {
    let previousToken = authService.getToken();
    
    const unsubscribe = authService.subscribeToAuthChanges((token) => {
      // Only invalidate if the token actually changed (login/logout)
      if (token !== previousToken) {
        previousToken = token;
        queryClient.invalidateQueries({ queryKey: userKeys.all });
      }
    });

    return unsubscribe;
  }, [queryClient]);

  return {
    user: userQuery.data ?? null,
    isAuthenticated: !!userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}