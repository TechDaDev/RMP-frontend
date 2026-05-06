"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShieldIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonClassName } from "@/components/ui/Button";

interface PublicAuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function PublicAuthLayout({ title, subtitle, children }: PublicAuthLayoutProps) {
  const { locale, theme, t, setLocale, toggleTheme } = useAppPreferences();

  return (
    <main className="relative flex min-h-screen overflow-hidden py-4 sm:py-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-primary)_14%,transparent),transparent_34%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent_32%)]" aria-hidden="true" />

      <div className="container-grid relative z-10 flex flex-1 flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-bg)_88%,transparent)] px-4 py-3 backdrop-blur-md">
          <Link href="/" className="focus-ring rounded-xl">
            <Logo locale={locale} />
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <LanguageSwitcher locale={locale} onChange={setLocale} t={t} compact ariaLabel={t.ui.languageSwitcherLabel} />
            <ThemeToggle theme={theme} onToggle={toggleTheme} t={t} compact ariaLabel={t.ui.themeToggleLabel} />
            <Link href="/" className={buttonClassName({ variant: "secondary" })}>
              {t.common.backToHome}
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-6 lg:grid-cols-[0.95fr,1.05fr]">
          <Card className="hidden min-h-[32rem] overflow-hidden border-none bg-[linear-gradient(155deg,color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface)),color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface)))] p-8 lg:flex lg:flex-col lg:justify-between">
            <div className="space-y-4">
              <Badge tone="primary">{t.ui.phaseBadge}</Badge>
              <h1 className="text-4xl font-extrabold leading-tight text-[var(--color-text)]">{title}</h1>
              <p className="max-w-xl text-base leading-8 text-[var(--color-muted)]">{subtitle}</p>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-surface)_74%,transparent)] p-6 shadow-[var(--card-shadow)]">
              <Badge tone="success">
                <ShieldIcon size={14} />
                {t.common.uiOnlyBadge}
              </Badge>
              <p className="text-sm leading-7 text-[var(--color-muted)]">{t.portal.previewNotice}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <p className="text-sm font-bold text-[var(--color-text)]">{t.roles.patient}</p>
                  <p className="mt-2 text-xs leading-6 text-[var(--color-muted)]">{t.dashboards.patientSubtitle}</p>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <p className="text-sm font-bold text-[var(--color-text)]">{t.roles.doctor}</p>
                  <p className="mt-2 text-xs leading-6 text-[var(--color-muted)]">{t.dashboards.doctorSubtitle}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="mx-auto w-full max-w-xl rounded-[2rem] p-6 sm:p-8">{children}</Card>
        </div>
      </div>
    </main>
  );
}