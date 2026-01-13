import { useQuery, useQueryClient } from '@tanstack/react-query';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
}

export const themeKeys = {
  all: ['theme'] as const,
  current: () => [...themeKeys.all, 'current'] as const,
};

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme') as Theme) || 'system';
}

function getInitialThemeState(): ThemeState {
  const theme = getStoredTheme();
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
  return { theme, effectiveTheme };
}

export function useTheme() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: themeKeys.current(),
    queryFn: (): ThemeState => {
      // Check if we already have data in the cache
      const existingData = queryClient.getQueryData<ThemeState>(themeKeys.current());
      if (existingData) return existingData;
      return getInitialThemeState();
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
