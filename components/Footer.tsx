import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import type { Locale, Translations } from "@/types/i18n";

interface FooterProps {
  locale: Locale;
  t: Translations;
  onLocaleChange: (locale: Locale) => void;
}

export function Footer({ locale, t, onLocaleChange }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-[var(--color-border)] py-10">
      <div className="container-grid grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo locale={locale} />
          <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--color-muted)]">
            {t.footer.description}
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
            {t.nav.features}
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li>
              <a href="#features" className="hover:text-[var(--color-text)]">
                {t.nav.features}
              </a>
            </li>
            <li>
              <a href="#who" className="hover:text-[var(--color-text)]">
                {t.nav.whoItServes}
              </a>
            </li>
            <li>
              <a href="#security" className="hover:text-[var(--color-text)]">
                {t.nav.security}
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-[var(--color-text)]">
                {t.nav.faq}
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} t={t} />
          <p className="text-xs text-[var(--color-muted)]">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
