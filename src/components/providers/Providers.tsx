"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useEffect, useState } from "react";

/**
 * Extension component to handle automatic time-based theme switching.
 * Rules:
 * - Night (19:00 - 07:00) -> Dark Mode
 * - Day (07:00 - 19:00) -> Light Mode
 */
function TimeBasedThemeHandler({ children }: { children: React.ReactNode }) {
  const { setTheme, theme } = useTheme();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;

    const checkTimeAndSetTheme = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 19 || hour < 7;
      const targetTheme = isNight ? "dark" : "light";

      // Only set if different to avoid unnecessary re-renders
      if (theme !== targetTheme) {
        setTheme(targetTheme);
      }
      setHasInitialized(true);
    };

    checkTimeAndSetTheme();
  }, [setTheme, theme, hasInitialized]);

  return <>{children}</>;
}

/**
 * Global provider component for client-side functionality.
 * Includes ThemeProvider and the time-based theme logic.
 */
export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <TimeBasedThemeHandler>{children}</TimeBasedThemeHandler>
    </NextThemesProvider>
  );
}
