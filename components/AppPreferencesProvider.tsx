"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, getTranslation, localeDirection } from "@/lib/i18n";
import {
  detectPreferredTheme,
  languageStorageKey,
  themeStorageKey,
  type Theme,
} from "@/lib/theme";
import type { Locale, Translations } from "@/types/i18n";

interface AppPreferencesContextValue {
  locale: Locale;
  theme: Theme;
  t: Translations;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "ar" || value === "ku" || value === "en";
}

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [theme, setThemeState] = useState<Theme>("light");

  function applyLocale(nextLocale: Locale) {
    setLocaleState(nextLocale);

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", nextLocale);
      document.documentElement.setAttribute("dir", localeDirection[nextLocale]);
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(languageStorageKey, nextLocale);
    }
  }

  function applyTheme(nextTheme: Theme) {
    setThemeState(nextTheme);

    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    }
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedLocale = window.localStorage.getItem(languageStorageKey);
      const storedTheme = window.localStorage.getItem(themeStorageKey);

      if (isLocale(storedLocale)) {
        applyLocale(storedLocale);
      }

      if (storedTheme === "light" || storedTheme === "dark") {
        applyTheme(storedTheme);
      } else {
        applyTheme(detectPreferredTheme());
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      locale,
      theme,
      t: getTranslation(locale),
      setLocale: applyLocale,
      setTheme: applyTheme,
      toggleTheme: () => {
        applyTheme(theme === "light" ? "dark" : "light");
      },
    }),
    [locale, theme],
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);
  if (!context) {
    throw new Error("useAppPreferences must be used within AppPreferencesProvider");
  }
  return context;
}
