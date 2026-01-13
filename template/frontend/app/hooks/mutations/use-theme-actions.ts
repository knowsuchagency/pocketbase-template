import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { themeKeys, type Theme, type ThemeState } from '@/hooks/queries/use-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useThemeActions() {
  const queryClient = useQueryClient();

  const setTheme = useCallback((theme: Theme) => {
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;

    // Persist to localStorage
    localStorage.setItem('theme', theme);

    // Update DOM
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);

    // Update query cache
    queryClient.setQueryData<ThemeState>(themeKeys.current(), {
      theme,
      effectiveTheme,
    });
  }, [queryClient]);

  return { setTheme };
}
