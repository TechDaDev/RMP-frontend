"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, GlobeIcon } from "@/components/icons";
import type { Locale, Translations } from "@/types/i18n";

interface LanguageSwitcherProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
  t: Translations;
  compact?: boolean;
  onAfterChange?: () => void;
  ariaLabel?: string;
}

const locales: Locale[] = ["ar", "ku", "en"];

const buttonLabels: Record<Locale, string> = {
  ar: "العربية",
  ku: "کوردی",
  en: "EN",
};

const menuLabels: Record<Locale, string> = {
  ar: "العربية",
  ku: "کوردی",
  en: "English",
};

export function LanguageSwitcher({
  locale,
  onChange,
  t,
  compact = false,
  onAfterChange,
  ariaLabel,
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const activeLabel = buttonLabels[locale];

  function handleSelect(nextLocale: Locale) {
    onChange(nextLocale);
    setOpen(false);
    onAfterChange?.();
  }

  return (
    <div
      ref={rootRef}
      className="relative inline-flex shrink-0"
    >
      <button
        type="button"
        className={[
          "inline-flex min-h-10 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm font-semibold text-[var(--color-text)] shadow-sm transition hover:bg-[var(--color-surface-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
          compact ? "max-w-[9.5rem]" : "max-w-[11rem]",
        ].join(" ")}
        aria-label={ariaLabel ?? t.ui.languageSwitcherLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="flex items-center text-[var(--color-muted)]" aria-hidden="true">
          <GlobeIcon size={14} />
        </span>
        <span className="truncate text-xs font-bold sm:text-sm">{activeLabel}</span>
        <span
          className={`ms-auto flex items-center text-[var(--color-muted)] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <ChevronDownIcon size={14} />
        </span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t.ui.languageMenu}
          className="absolute top-[calc(100%+0.5rem)] z-[70] min-w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[var(--card-shadow-lg)] rtl:right-0 ltr:left-0"
        >
          {locales.map((item) => (
            <button
              key={item}
              type="button"
              role="menuitemradio"
              aria-checked={locale === item}
              onClick={() => handleSelect(item)}
              className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                locale === item
                  ? "bg-[color:color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))] font-semibold text-[var(--color-text)]"
                  : "text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]"
              }`}
            >
              <span>{menuLabels[item]}</span>
              <span className="flex h-4 w-4 items-center justify-center text-[var(--color-primary)]" aria-hidden="true">
                {locale === item ? <CheckIcon size={14} /> : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
