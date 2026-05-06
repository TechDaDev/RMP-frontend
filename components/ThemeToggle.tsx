"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
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
      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm font-medium text-[var(--color-text)] transition hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
    >
      <span className="flex items-center text-[var(--color-primary)]">
        {theme === "dark" ? <SunIcon size={15} /> : <MoonIcon size={15} />}
      </span>
      <span suppressHydrationWarning className="text-xs font-semibold">
        {nextModeLabel}
      </span>
    </button>
  );
}
