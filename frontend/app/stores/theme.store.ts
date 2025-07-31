import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "light" | "dark";
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getEffectiveTheme = (theme: Theme): "light" | "dark" => {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      effectiveTheme: getEffectiveTheme("system"),
      setTheme: (theme) => {
        const effectiveTheme = getEffectiveTheme(theme);
        set({ theme, effectiveTheme });
        
        // Apply theme to document
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(effectiveTheme);
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const effectiveTheme = getEffectiveTheme(state.theme);
          state.effectiveTheme = effectiveTheme;
          
          // Apply theme on rehydration
          const root = document.documentElement;
          root.classList.remove("light", "dark");
          root.classList.add(effectiveTheme);
        }
      },
    }
  )
);

// Listen for system theme changes
if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    const state = useThemeStore.getState();
    if (state.theme === "system") {
      state.setTheme("system"); // Re-apply to update effective theme
    }
  });
}