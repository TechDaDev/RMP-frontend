"use client";

import { GlobeIcon } from "@/components/icons";
import type { Locale, Translations } from "@/types/i18n";

interface LanguageSwitcherProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
  t: Translations;
  ariaLabel?: string;
}

const locales: Locale[] = ["ar", "ku", "en"];

const shortLabels: Record<Locale, string> = {
  ar: "عربي",
  ku: "کور",
  en: "EN",
};

export function LanguageSwitcher({
  locale,
  onChange,
  t,
  ariaLabel,
}: LanguageSwitcherProps) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1"
      role="group"
      aria-label={ariaLabel ?? t.ui.languageSwitcherLabel}
    >
      <span className="flex items-center px-1.5 text-[var(--color-muted)]" aria-hidden="true">
        <GlobeIcon size={14} />
      </span>
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          aria-pressed={locale === item}
          className={`min-h-8 rounded-xl px-2.5 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
            locale === item
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "cursor-pointer text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]"
          }`}
        >
          {shortLabels[item]}
        </button>
      ))}
    </div>
  );
}
