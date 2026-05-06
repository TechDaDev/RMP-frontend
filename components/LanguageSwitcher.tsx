"use client";

import type { Locale, Translations } from "@/types/i18n";

interface LanguageSwitcherProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
  t: Translations;
}

const locales: Locale[] = ["ar", "ku", "en"];

export function LanguageSwitcher({ locale, onChange, t }: LanguageSwitcherProps) {
  return (
    <div
      className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1"
      role="group"
      aria-label="Language switcher"
    >
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
            locale === item
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          {t.lang[item]}
        </button>
      ))}
    </div>
  );
}
