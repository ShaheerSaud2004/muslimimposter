import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes, Theme, ThemeColors } from '../theme';
import { getSettings, saveSettings } from '../utils/storage';

type ThemeContextType = {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const settings = await getSettings();
    const validThemes: Theme[] = ['soft', 'paper', 'dark', 'ramadan'];
    const themeToUse = settings.theme && validThemes.includes(settings.theme) ? settings.theme : 'dark';
    setThemeState(themeToUse);
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await saveSettings({ theme: newTheme });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: themes[theme],
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};