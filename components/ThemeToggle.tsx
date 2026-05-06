"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import type { Theme } from "@/lib/theme";
import type { Translations } from "@/types/i18n";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  t: Translations;
  compact?: boolean;
  ariaLabel?: string;
}

export function ThemeToggle({ theme, onToggle, t, compact = false, ariaLabel }: ThemeToggleProps) {
  const nextModeLabel = theme === "dark" ? t.theme.light : t.theme.dark;
  const shortLabel = theme === "dark" ? t.theme.shortLight : t.theme.shortDark;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel ?? `${t.ui.themeToggleLabel}: ${nextModeLabel}`}
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] transition hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
        compact ? "h-10 w-10" : "min-h-10 gap-2 px-3",
      ].join(" ")}
    >
      <span className="flex items-center text-[var(--color-primary)]">
        {theme === "dark" ? <SunIcon size={15} /> : <MoonIcon size={15} />}
      </span>
      {compact ? null : (
        <span suppressHydrationWarning className="text-xs font-semibold">
          {shortLabel}
        </span>
      )}
    </button>
  );
}
