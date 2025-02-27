import type { PaletteMode } from '@mui/material/styles';
import { createContext, useMemo, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

export const ThemeModeContext = createContext({ toggle: () => {} });

export const useThemeMode = () => {
  const [mode, setMode] = useState(
    window.localStorage.getItem('theme.color') || 'light'
  );

  useEffect(() => {
    if (typeof window !== 'undefined')
      window.localStorage.setItem('theme.color', mode);
  }, [mode]);

  // Update the theme only if the mode changes
  const colorTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode as PaletteMode,
        },
      }),
    [mode]
  );

  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggle: () => {
        const mode = window?.localStorage?.getItem('theme.color') || 'light';
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);

        // If there is a window
        if (typeof window !== 'undefined')
          window.localStorage.setItem('theme.color', mode);
      },
    }),
    []
  );

  return {
    colorTheme,
    colorMode,
  };
};
