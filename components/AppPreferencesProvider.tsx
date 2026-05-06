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
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedLocale = window.localStorage.getItem(languageStorageKey);
      const storedTheme = window.localStorage.getItem(themeStorageKey);

      if (isLocale(storedLocale)) {
        setLocale(storedLocale);
      }

      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
      } else {
        setTheme(detectPreferredTheme());
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute("dir", localeDirection[locale]);
    window.localStorage.setItem(languageStorageKey, locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      locale,
      theme,
      t: getTranslation(locale),
      setLocale,
      setTheme,
      toggleTheme: () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
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
