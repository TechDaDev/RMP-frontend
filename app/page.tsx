"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
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
import { Reveal } from "@/components/ui/Reveal";

export default function Home() {
  return <LandingPage />;
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
        <Reveal delay={0}>
          <Hero t={t} locale={locale} />
        </Reveal>
        <Reveal delay={60}>
          <TrustSection t={t} />
        </Reveal>
        <Reveal delay={100}>
          <FeaturesSection t={t} />
        </Reveal>
        <Reveal delay={140}>
          <WhoItServesSection t={t} />
        </Reveal>
        <Reveal delay={180}>
          <SecuritySection t={t} />
        </Reveal>
        <Reveal delay={220}>
          <HowItWorksSection t={t} />
        </Reveal>
        <Reveal delay={260}>
          <PlatformPreviewSection t={t} locale={locale} />
        </Reveal>
        <Reveal delay={300}>
          <FAQSection t={t} />
        </Reveal>
        <Reveal delay={340}>
          <FinalCTASection t={t} />
        </Reveal>
      </main>

      <Footer locale={locale} t={t} onLocaleChange={setLocale} />
    </>
  );
}
