export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
}

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme') as Theme) || 'system';
}

export function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme;
}

export function applyThemeToDocument(effectiveTheme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(effectiveTheme);
}

export function getInitialThemeState(): ThemeState {
  const theme = getStoredTheme();
  const effectiveTheme = getEffectiveTheme(theme);
  return { theme, effectiveTheme };
}
