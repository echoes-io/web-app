'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'neutral' | 'anima' | 'eros' | 'bloom';
export type Mode = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultMode?: Mode;
};

export function ThemeProvider({
  children,
  defaultTheme = 'neutral',
  defaultMode = 'light',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mode, setModeState] = useState<Mode>(defaultMode);

  // Initialize from cookie/localStorage on mount
  useEffect(() => {
    // Check localStorage for mode preference
    const savedMode = localStorage.getItem('echoes-mode') as Mode | null;
    if (savedMode === 'light' || savedMode === 'dark') {
      setModeState(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setModeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  // Apply mode to document
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    // Save to localStorage
    localStorage.setItem('echoes-mode', newMode);
    // Save to cookie for SSR
    // biome-ignore lint/suspicious/noDocumentCookie: Required for SSR hydration without flash
    document.cookie = `echoes-mode=${newMode}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
