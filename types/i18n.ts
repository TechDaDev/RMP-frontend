export type Locale = "ar" | "ku" | "en";

export interface Translations {
  nav: {
    home: string;
    features: string;
    whoItServes: string;
    security: string;
    howItWorks: string;
    faq: string;
    cta: string;
  };
  hero: {
    title: string;
    subtitle: string;
    exploreBtn: string;
    howBtn: string;
  };
  trust: {
    title: string;
    items: { label: string; desc: string }[];
  };
  features: {
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  whoItServes: {
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  security: {
    title: string;
    subtitle: string;
    tagline: string;
    items: { label: string; desc: string }[];
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: { title: string; desc: string }[];
  };
  preview: {
    title: string;
    subtitle: string;
    items: { title: string; status: string }[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: { q: string; a: string }[];
  };
  finalCta: {
    tagline: string;
    btn: string;
  };
  footer: {
    description: string;
    copyright: string;
  };
  lang: {
    ar: string;
    ku: string;
    en: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  ui: {
    phaseBadge: string;
    languageSwitcherLabel: string;
    themeToggleLabel: string;
    openMenu: string;
    closeMenu: string;
    primaryNavigation: string;
    mobileMenu: string;
    heroFlowLabel: string;
  };
}
