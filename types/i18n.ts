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
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    emailLabel: string;
    passwordLabel: string;
    rememberMe: string;
    enterPlatform: string;
    forgotPassword: string;
    noAccount: string;
    createAccount: string;
    registerTitle: string;
    registerSubtitle: string;
    chooseAccountType: string;
    continue: string;
    haveAccount: string;
    nameLabel: string;
    registerAction: string;
    loginPreviewNotice: string;
    registerPreviewNotice: string;
  };
  portal: {
    dashboard: string;
    profile: string;
    notifications: string;
    messages: string;
    settings: string;
    logout: string;
    previewNotice: string;
    demoUser: string;
    entryTitle: string;
    entrySubtitle: string;
    currentRole: string;
    chooseRole: string;
    roleAutoRoutingNotice: string;
  };
  roles: {
    patient: string;
    doctor: string;
    pharmacist: string;
    laboratory: string;
    admin: string;
  };
  dashboards: {
    previewNotice: string;
    patientTitle: string;
    patientSubtitle: string;
    doctorTitle: string;
    doctorSubtitle: string;
    pharmacistTitle: string;
    pharmacistSubtitle: string;
    laboratoryTitle: string;
    laboratorySubtitle: string;
    adminTitle: string;
    adminSubtitle: string;
    modules: {
      consultations: string;
      prescriptions: string;
      labResults: string;
      messages: string;
      patients: string;
      labRequests: string;
      prescriptionReview: string;
      medicationDispensing: string;
      dispensingLog: string;
      testRequests: string;
      uploadResults: string;
      sentResults: string;
      users: string;
      staffVerification: string;
      knowledgeBase: string;
      auditLog: string;
      systemStatus: string;
    };
  };
  common: {
    backToHome: string;
    previewBadge: string;
    uiOnlyBadge: string;
    viewPreview: string;
    previewLogin: string;
    accountType: string;
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
    openPortalNavigation: string;
    closePortalNavigation: string;
    portalNavigation: string;
  };
}
