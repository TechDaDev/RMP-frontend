"use client";

import type { Theme } from "@/lib/theme";
import type { Translations } from "@/types/i18n";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  t: Translations;
  ariaLabel?: string;
}

export function ThemeToggle({ theme, onToggle, t, ariaLabel }: ThemeToggleProps) {
  const nextModeLabel = theme === "dark" ? t.theme.light : t.theme.dark;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel ?? `${t.ui.themeToggleLabel}: ${nextModeLabel}`}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
    >
      <span aria-hidden="true" className="text-base leading-none">
        {theme === "dark" ? "☀" : "☾"}
      </span>
      <span suppressHydrationWarning>
        {nextModeLabel}
      </span>
    </button>
  );
}
