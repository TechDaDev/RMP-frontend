"use client";

import { AppPreferencesProvider, useAppPreferences } from "@/components/AppPreferencesProvider";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import type { ReactNode } from "react";

export default function Home() {
  return (
    <AppPreferencesProvider>
      <LandingPage />
    </AppPreferencesProvider>
  );
}

function icon(kind: "trust" | "feature" | "audience" | "security"): ReactNode {
  const paths = {
    trust: "M12 3l7 3v6c0 5-3.4 9.8-7 11-3.6-1.2-7-6-7-11V6l7-3z",
    feature: "M12 3a9 9 0 100 18 9 9 0 000-18zm0 4v10m-5-5h10",
    audience: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0",
    security: "M7 12h10M9 8h6m-8 8h10m2-13v18",
  };

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d={paths[kind]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LandingPage() {
  const { locale, theme, t, setLocale, toggleTheme } = useAppPreferences();

  return (
    <>
      <Header
        locale={locale}
        t={t}
        theme={theme}
        onThemeToggle={toggleTheme}
        onLocaleChange={setLocale}
      />

      <main>
        <Hero t={t} locale={locale} />

        <section className="section-space" aria-label={t.trust.title}>
          <div className="container-grid">
            <SectionHeader title={t.trust.title} subtitle={t.security.tagline} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {t.trust.items.map((item) => (
                <FeatureCard key={item.label} title={item.label} desc={item.desc} icon={icon("trust")} />
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="section-space">
          <div className="container-grid">
            <SectionHeader title={t.features.title} subtitle={t.features.subtitle} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {t.features.items.map((item) => (
                <FeatureCard key={item.title} title={item.title} desc={item.desc} icon={icon("feature")} />
              ))}
            </div>
          </div>
        </section>

        <section id="who" className="section-space">
          <div className="container-grid">
            <SectionHeader title={t.whoItServes.title} subtitle={t.whoItServes.subtitle} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.whoItServes.items.map((item) => (
                <FeatureCard key={item.title} title={item.title} desc={item.desc} icon={icon("audience")} />
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="section-space">
          <div className="container-grid">
            <SectionHeader
              title={t.security.title}
              subtitle={t.security.subtitle}
              action={
                <p className="text-sm text-[var(--color-muted)]">{t.security.tagline}</p>
              }
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {t.security.items.map((item) => (
                <FeatureCard key={item.label} title={item.label} desc={item.desc} icon={icon("security")} />
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section-space">
          <div className="container-grid">
            <SectionHeader title={t.howItWorks.title} subtitle={t.howItWorks.subtitle} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {t.howItWorks.steps.map((step) => (
                <article
                  key={step.title}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow)]"
                >
                  <h3 className="text-base font-semibold text-[var(--color-text)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {step.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="container-grid">
            <SectionHeader title={t.preview.title} subtitle={t.preview.subtitle} />
            <div className="grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow-lg)] lg:grid-cols-5">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 lg:col-span-2">
                <p className="text-xs font-medium text-[var(--color-muted)]">{t.preview.items[0].title}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{t.preview.items[0].status}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">{t.preview.items[1].title}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{t.preview.items[1].status}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">{t.preview.items[2].title}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{t.preview.items[2].status}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">{t.preview.items[3].title}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{t.preview.items[3].status}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 lg:col-span-2">
                <p className="text-xs font-medium text-[var(--color-muted)]">{t.preview.items[4].title}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{t.preview.items[4].status}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="section-space">
          <div className="container-grid">
            <SectionHeader title={t.faq.title} subtitle={t.faq.subtitle} />
            <div className="space-y-3">
              {t.faq.items.map((item) => (
                <details
                  key={item.q}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-text)]">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="section-space pt-4">
          <div className="container-grid">
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--card-shadow-lg)]">
              <p className="mx-auto max-w-3xl text-lg font-medium leading-8 text-[var(--color-text)]">
                {t.finalCta.tagline}
              </p>
              <a href="#home" className="btn-primary mt-6 inline-flex">
                {t.finalCta.btn}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} t={t} onLocaleChange={setLocale} />
    </>
  );
}
