"use client";

import { useEffect, useMemo, useState } from "react";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { defaultLocale, getTranslation, localeDirection } from "@/lib/i18n";
import {
  detectPreferredTheme,
  languageStorageKey,
  themeStorageKey,
  type Theme,
} from "@/lib/theme";
import type { Locale } from "@/types/i18n";

function isLocale(value: string): value is Locale {
  return value === "ar" || value === "ku" || value === "en";
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return defaultLocale;
    }
    const storedLocale = window.localStorage.getItem(languageStorageKey);
    return storedLocale && isLocale(storedLocale) ? storedLocale : defaultLocale;
  });
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
    return detectPreferredTheme();
  });

  useEffect(() => {
    window.localStorage.setItem(languageStorageKey, locale);
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute("dir", localeDirection[locale]);
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem(themeStorageKey, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const t = useMemo(() => getTranslation(locale), [locale]);
  const previewLabels: Record<Locale, { title: string; status: string }[]> = {
    ar: [
      { title: "الاستشارة", status: "بانتظار رد الطبيب" },
      { title: "نتيجة المختبر", status: "قيد المعالجة" },
      { title: "الوصفة", status: "جاهزة للمراجعة" },
      { title: "إشعار", status: "تحديث آمن جديد" },
      { title: "شارة الأمان", status: "تواصل طبي محمي" },
    ],
    ku: [
      { title: "ڕاوێژ", status: "چاوەڕێی وەڵامی پزیشک" },
      { title: "ئەنجامی تاقیگە", status: "لە ژێر کارکردن" },
      { title: "ڕەچەتە", status: "ئامادەی پشکنینە" },
      { title: "ئاگادارکردنەوە", status: "نوێکردنەوەیەکی پارێزراو" },
      { title: "نیشانی ئاسایش", status: "پەیوەندی پزیشکی پارێزراو" },
    ],
    en: [
      { title: "Consultation", status: "Awaiting doctor response" },
      { title: "Lab Result", status: "In progress" },
      { title: "Prescription", status: "Ready for review" },
      { title: "Notification", status: "New secure update" },
      { title: "Security Badge", status: "Protected medical communication" },
    ],
  };

  return (
    <>
      <Header
        locale={locale}
        t={t}
        theme={theme}
        onThemeToggle={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
        onLocaleChange={setLocale}
      />

      <main>
        <Hero t={t} locale={locale} />

        <section className="section-space">
          <div className="container-grid">
            <SectionHeader title={t.trust.title} subtitle={t.security.tagline} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {t.trust.items.map((item) => (
                <FeatureCard key={item.label} title={item.label} desc={item.desc} icon="T" />
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="section-space">
          <div className="container-grid">
            <SectionHeader title={t.features.title} subtitle={t.features.subtitle} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {t.features.items.map((item) => (
                <FeatureCard key={item.title} title={item.title} desc={item.desc} />
              ))}
            </div>
          </div>
        </section>

        <section id="who" className="section-space">
          <div className="container-grid">
            <SectionHeader title={t.whoItServes.title} subtitle={t.whoItServes.subtitle} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.whoItServes.items.map((item) => (
                <FeatureCard key={item.title} title={item.title} desc={item.desc} icon="O" />
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
                <FeatureCard key={item.label} title={item.label} desc={item.desc} icon="S" />
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
                <p className="text-xs font-medium text-[var(--color-muted)]">{previewLabels[locale][0].title}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{previewLabels[locale][0].status}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">{previewLabels[locale][1].title}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{previewLabels[locale][1].status}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">{previewLabels[locale][2].title}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{previewLabels[locale][2].status}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">{previewLabels[locale][3].title}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{previewLabels[locale][3].status}</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 lg:col-span-2">
                <p className="text-xs font-medium text-[var(--color-muted)]">{previewLabels[locale][4].title}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{previewLabels[locale][4].status}</p>
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
