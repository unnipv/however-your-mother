'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'default' | 'matcha';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with the server-side default, client will also use this for initial render
  const [theme, setThemeState] = useState<Theme>('default'); 

  useEffect(() => {
    // This effect runs only on the client after mount
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme && ['default', 'matcha'].includes(storedTheme)) {
      setThemeState(storedTheme); // Update to localStorage theme if valid
    }
  }, []); // Empty dependency array: run once on mount to sync with localStorage

  useEffect(() => {
    // This effect applies the theme to the document and updates localStorage whenever theme changes
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]); // Runs when theme state changes (either from initial localStorage sync or user interaction)

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 