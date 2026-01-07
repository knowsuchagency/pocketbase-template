import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { queryKeys } from '@/lib/query-keys';
import {
  type ThemeState,
  getSystemTheme,
  getEffectiveTheme,
  applyThemeToDocument,
} from '@/lib/theme-utils';

function createQueryClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  // Pre-populate notifications with empty array
  client.setQueryData(queryKeys.notifications.list(), []);

  return client;
}

function initializeSystemThemeListener(queryClient: QueryClient) {
  if (typeof window === 'undefined') return;

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = () => {
    const currentState = queryClient.getQueryData<ThemeState>(
      queryKeys.theme.current()
    );

    if (currentState?.theme === 'system') {
      const effectiveTheme = getSystemTheme();
      queryClient.setQueryData<ThemeState>(queryKeys.theme.current(), {
        theme: 'system',
        effectiveTheme,
      });
      applyThemeToDocument(effectiveTheme);
    }
  };

  mediaQuery.addEventListener('change', handleChange);

  return () => mediaQuery.removeEventListener('change', handleChange);
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  // Initialize system theme listener
  useEffect(() => {
    const cleanup = initializeSystemThemeListener(queryClient);
    return cleanup;
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}
