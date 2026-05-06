"use client";

import { useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
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
  const mobileMenuId = "mobile-primary-nav";

  const links = [
    { id: "home", label: t.nav.home },
    { id: "features", label: t.nav.features },
    { id: "who", label: t.nav.whoItServes },
    { id: "security", label: t.nav.security },
    { id: "how-it-works", label: t.nav.howItWorks },
    { id: "faq", label: t.nav.faq },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-md">
      <div className="container-grid flex min-h-[4.5rem] items-center justify-between gap-4 py-3">
        <a href="#home" className="focus-ring rounded-lg">
          <Logo locale={locale} />
        </a>

        <nav className="hidden items-center gap-5 lg:flex" aria-label={t.ui.primaryNavigation}>
          {links.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} t={t} ariaLabel={t.ui.languageSwitcherLabel} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} t={t} ariaLabel={t.ui.themeToggleLabel} />
          <a href="#cta" className="btn-primary px-5 py-2 text-sm">
            {t.nav.cta}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] transition hover:bg-[var(--color-surface-alt)] lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? t.ui.closeMenu : t.ui.openMenu}
          aria-expanded={menuOpen}
          aria-controls={mobileMenuId}
        >
          {menuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
        </button>
      </div>

      {menuOpen ? (
        <div
          id={mobileMenuId}
          className="container-grid grid gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] py-4 lg:hidden"
          aria-label={t.ui.mobileMenu}
        >
          {links.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-alt)]"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-3">
            <LanguageSwitcher
              locale={locale}
              onChange={(value) => {
                onLocaleChange(value);
                setMenuOpen(false);
              }}
              t={t}
              ariaLabel={t.ui.languageSwitcherLabel}
            />
            <ThemeToggle
              theme={theme}
              onToggle={() => {
                onThemeToggle();
                setMenuOpen(false);
              }}
              t={t}
              ariaLabel={t.ui.themeToggleLabel}
            />
            <a href="#cta" className="btn-primary w-full sm:w-auto" onClick={() => setMenuOpen(false)}>
              {t.nav.cta}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

