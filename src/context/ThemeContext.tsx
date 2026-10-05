import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('sachii_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    // Default to dark or system preference (electric blue on dark is requested as a primary highlight)
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sachii_theme', theme);
  }, [theme]);

  const applyThemeWithTransition = (newTheme: Theme) => {
    if (typeof document === 'undefined') {
      setThemeState(newTheme);
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Modern View Transitions API (hardware-accelerated page crossfade)
    if ('startViewTransition' in document && !prefersReducedMotion) {
      (document as any).startViewTransition(() => {
        setThemeState(newTheme);
      });
    } else {
      // Smooth fallback transition class
      document.documentElement.classList.add('theme-transitioning');
      setThemeState(newTheme);
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 450);
    }
  };

  const toggleTheme = () => {
    applyThemeWithTransition(theme === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    applyThemeWithTransition(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
