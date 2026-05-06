"use client";

import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Theme } from "@/lib/theme";
import type { Locale, Translations } from "@/types/i18n";

interface HeaderProps {
  locale: Locale;
  t: Translations;
  theme: Theme;
  onThemeToggle: () => void;
  onLocaleChange: (locale: Locale) => void;
}

export function Header({
  locale,
  t,
  theme,
  onThemeToggle,
  onLocaleChange,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: "home", label: t.nav.home },
    { id: "features", label: t.nav.features },
    { id: "who", label: t.nav.whoItServes },
    { id: "security", label: t.nav.security },
    { id: "how-it-works", label: t.nav.howItWorks },
    { id: "faq", label: t.nav.faq },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-bg)_88%,transparent)] backdrop-blur">
      <div className="container-grid flex min-h-20 items-center justify-between gap-4 py-3">
        <a href="#home" className="focus-ring rounded-lg">
          <Logo locale={locale} />
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          {links.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} t={t} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} t={t} />
          <a href="#cta" className="btn-primary">
            {t.nav.cta}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
          aria-expanded={menuOpen}
        >
          <span className="text-lg">☰</span>
        </button>
      </div>

      {menuOpen ? (
        <div className="container-grid grid gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] py-4 lg:hidden">
          {links.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-lg px-2 py-2 text-sm font-medium text-[var(--color-text)]"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <LanguageSwitcher locale={locale} onChange={onLocaleChange} t={t} />
            <ThemeToggle theme={theme} onToggle={onThemeToggle} t={t} />
            <a href="#cta" className="btn-primary" onClick={() => setMenuOpen(false)}>
              {t.nav.cta}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
