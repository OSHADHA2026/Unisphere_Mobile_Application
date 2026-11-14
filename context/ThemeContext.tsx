import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/config';
import { darkColors, lightColors, type Colors } from '@/constants/colors';

/**
 * Keeps the OS-level appearance in sync on native. react-native-web does not
 * implement `Appearance.setColorScheme`, so it is skipped in the browser
 * (the app's own `isDark` state drives the theme there).
 */
const syncSystemColorScheme = (dark: boolean) => {
  if (typeof Appearance.setColorScheme === 'function') {
    Appearance.setColorScheme(dark ? 'dark' : 'light');
  }
};

type ThemeContextType = {
  isDark: boolean;
  colors: Colors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.theme).then((saved) => {
      if (saved !== null) {
        const dark = saved === 'dark';
        setIsDark(dark);
        syncSystemColorScheme(dark);
      }
    });
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    syncSystemColorScheme(next);
    await AsyncStorage.setItem(STORAGE_KEYS.theme, next ? 'dark' : 'light');
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
