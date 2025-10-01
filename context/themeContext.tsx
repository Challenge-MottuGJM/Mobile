import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'light' | 'dark' | 'system';
type ThemeContextValue = {
  preference: ThemePreference;
  colorScheme: Exclude<ColorSchemeName, null>;
  setPreference: (pref: ThemePreference) => void;
  isDark: boolean;
};

const STORAGE_KEY = 'theme.preference';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme() ?? 'light';
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setPreferenceState(saved);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem(STORAGE_KEY, preference);
    })();
  }, [preference]);

  const colorScheme: 'light' | 'dark' =
    preference === 'system' ? system : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      colorScheme,
      setPreference: setPreferenceState,
      isDark: colorScheme === 'dark',
    }),
    [preference, colorScheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return ctx;
}
