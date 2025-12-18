import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import pocketbaseService from '@/services/pocketbase.service';
import { useUser, userKeys } from './queries/use-user';
import { useLogin } from './mutations/use-login';
import { useLogout } from './mutations/use-logout';
import { useSignup } from './mutations/use-signup';

export function useAuth() {
  const queryClient = useQueryClient();
  const userQuery = useUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const signupMutation = useSignup();

  // Subscribe to PocketBase auth changes
  useEffect(() => {
    let previousToken = pocketbaseService.getToken();

    const unsubscribe = pocketbaseService.subscribeToAuthChanges((token) => {
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
    signup: signupMutation.mutate,
    signupAsync: signupMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isSigningUp: signupMutation.isPending,
  };
}