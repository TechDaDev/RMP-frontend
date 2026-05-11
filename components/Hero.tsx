import type { Translations } from "@/types/i18n";
import type { Locale } from "@/types/i18n";
import {
  CheckCircleIcon,
  DoctorIcon,
  FileTextIcon,
  LabIcon,
  LockIcon,
  PatientIcon,
  PharmacyIcon,
  PulseIcon,
  ShieldIcon,
} from "@/components/icons";

interface HeroProps {
  t: Translations;
  locale: Locale;
}

const heroMockup: Record<
  Locale,
  {
    appBar: string;
    recordTitle: string;
    statusSecure: string;
    statusActive: string;
    statusVerified: string;
    patient: string;
    doctor: string;
    lab: string;
    pharmacy: string;
    patientStatus: string;
    doctorStatus: string;
    labStatus: string;
    pharmacyStatus: string;
    trust1: string;
    trust2: string;
    trust3: string;
  }
> = {
  ar: {
    appBar: "منصة الرافدين الطبية",
    recordTitle: "سجل طبي آمن",
    statusSecure: "محمي",
    statusActive: "نشط",
    statusVerified: "موثق",
    patient: "المريض",
    doctor: "الطبيب",
    lab: "المختبر",
    pharmacy: "الصيدلية",
    patientStatus: "متصل",
    doctorStatus: "يراجع",
    labStatus: "معالجة",
    pharmacyStatus: "جاهز",
    trust1: "بيانات آمنة",
    trust2: "وصول منظم",
    trust3: "متكامل",
  },
  ku: {
    appBar: "پلاتفۆرمی ڕافیدەین",
    recordTitle: "تۆماری پزیشکی پارێزراو",
    statusSecure: "پارێزراو",
    statusActive: "چالاک",
    statusVerified: "دڵنیاکراو",
    patient: "نەخۆش",
    doctor: "پزیشک",
    lab: "تاقیگە",
    pharmacy: "دەرمانخانە",
    patientStatus: "بەستراوە",
    doctorStatus: "پشکنین",
    labStatus: "کارلێکردن",
    pharmacyStatus: "ئامادە",
    trust1: "داتای پارێزراو",
    trust2: "دەستگەیشتنی ڕێکخراو",
    trust3: "یەکگرتوو",
  },
  en: {
    appBar: "Al-Rafidain Medical",
    recordTitle: "Secure Medical Record",
    statusSecure: "Secure",
    statusActive: "Active",
    statusVerified: "Verified",
    patient: "Patient",
    doctor: "Doctor",
    lab: "Laboratory",
    pharmacy: "Pharmacy",
    patientStatus: "Connected",
    doctorStatus: "Reviewing",
    labStatus: "Processing",
    pharmacyStatus: "Ready",
    trust1: "Secure Data",
    trust2: "Controlled Access",
    trust3: "Integrated",
  },
};

export function Hero({ t, locale }: HeroProps) {
  const m = heroMockup[locale];

  const roles = [
    { key: "patient", Icon: PatientIcon, label: m.patient, status: m.patientStatus, color: "text-[var(--color-primary)]" },
    { key: "doctor", Icon: DoctorIcon, label: m.doctor, status: m.doctorStatus, color: "text-[var(--color-secondary)]" },
    { key: "lab", Icon: LabIcon, label: m.lab, status: m.labStatus, color: "text-[var(--color-accent)]" },
    { key: "pharmacy", Icon: PharmacyIcon, label: m.pharmacy, status: m.pharmacyStatus, color: "text-[var(--color-primary)]" },
  ] as const;

  return (
    <section id="home" className="relative overflow-hidden py-12 md:py-20">
      <div className="hero-aura pointer-events-none" aria-hidden="true" />
      <div className="container-grid grid items-center gap-10 lg:grid-cols-[1.1fr,0.9fr]">

        {/* Text side */}
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)] bg-[color:color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-4 py-1.5 text-xs font-bold tracking-wide text-[var(--color-primary)]">
            <ShieldIcon size={12} />
            {t.ui.phaseBadge}
          </p>
          <h1 className="text-balance text-3xl font-extrabold leading-tight text-[var(--color-text)] md:text-5xl md:leading-[1.18]">
            {t.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-muted)] md:text-lg md:leading-8">
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 sm:flex-nowrap">
            <a className="btn-primary w-full sm:w-auto" href="#features">
              {t.hero.exploreBtn}
            </a>
            <a className="btn-secondary w-full sm:w-auto" href="#how-it-works">
              {t.hero.howBtn}
            </a>
          </div>

          {/* Trust micro-indicators */}
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)]">
              <LockIcon size={13} className="text-[var(--color-accent)]" />
              {m.trust1}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)]">
              <ShieldIcon size={13} className="text-[var(--color-primary)]" />
              {m.trust2}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)]">
              <CheckCircleIcon size={13} className="text-[var(--color-secondary)]" />
              {m.trust3}
            </span>
          </div>
        </div>

        {/* Visual mockup */}
        <div
          className="hero-float relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--card-shadow-lg)]"
          aria-label={t.ui.heroFlowLabel}
        >
          {/* Gradient overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(circle at 15% 15%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 48%), radial-gradient(circle at 85% 85%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 46%)",
            }}
            aria-hidden="true"
          />

          {/* Fake app bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400 opacity-70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 opacity-70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 opacity-70" />
            </div>
            <span className="text-xs font-semibold text-[var(--color-muted)]">{m.appBar}</span>
            <span className="flex items-center text-[var(--color-accent)]" aria-hidden="true">
              <LockIcon size={12} />
            </span>
          </div>

          <div className="relative z-10 p-5">
            {/* Central record card */}
            <div className="mb-4 rounded-2xl border border-[var(--color-primary)] bg-[color:color-mix(in_srgb,var(--color-primary)_6%,var(--color-surface))] p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
                  <FileTextIcon size={18} />
                </span>
                <p className="text-sm font-bold text-[var(--color-text)]">{m.recordTitle}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_srgb,var(--color-accent)_14%,transparent)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-accent)] border border-[color:color-mix(in_srgb,var(--color-accent)_30%,transparent)]">
                  <LockIcon size={8} />
                  {m.statusSecure}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_14%,transparent)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-primary)] border border-[color:color-mix(in_srgb,var(--color-primary)_30%,transparent)]">
                  <PulseIcon size={8} />
                  {m.statusActive}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-secondary)] border border-[color:color-mix(in_srgb,var(--color-secondary)_30%,transparent)]">
                  <CheckCircleIcon size={8} />
                  {m.statusVerified}
                </span>
              </div>
            </div>

            {/* Role cards 2x2 grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {roles.map(({ key, Icon, label, status, color }) => (
                <div
                  key={key}
                  className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 transition hover:border-[var(--color-primary)] hover:bg-[color:color-mix(in_srgb,var(--color-primary)_5%,var(--color-surface-alt))]"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface)] ${color}`}>
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[var(--color-text)]">{label}</p>
                    <p className="truncate text-[10px] text-[var(--color-muted)]">{status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

