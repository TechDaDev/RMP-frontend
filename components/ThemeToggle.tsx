"use client";

import type { Theme } from "@/lib/theme";
import type { Translations } from "@/types/i18n";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  t: Translations;
}

export function ThemeToggle({ theme, onToggle, t }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle theme"
      className="inline-flex h-10 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
    >
      <span suppressHydrationWarning>
        {theme === "dark" ? t.theme.light : t.theme.dark}
      </span>
    </button>
  );
}
