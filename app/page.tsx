"use client";

import { AppPreferencesProvider, useAppPreferences } from "@/components/AppPreferencesProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import {
  FeaturesSection,
  FAQSection,
  FinalCTASection,
  HowItWorksSection,
  PlatformPreviewSection,
  SecuritySection,
  TrustSection,
  WhoItServesSection,
} from "@/components/sections";

export default function Home() {
  return (
    <AppPreferencesProvider>
      <LandingPage />
    </AppPreferencesProvider>
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
        <TrustSection t={t} />
        <FeaturesSection t={t} />
        <WhoItServesSection t={t} />
        <SecuritySection t={t} />
        <HowItWorksSection t={t} />
        <PlatformPreviewSection t={t} />
        <FAQSection t={t} />
        <FinalCTASection t={t} />
      </main>

      <Footer locale={locale} t={t} onLocaleChange={setLocale} />
    </>
  );
}
