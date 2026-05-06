import {
  CheckCircleIcon,
  DoctorIcon,
  FileTextIcon,
  LabIcon,
  LockIcon,
  MessageIcon,
  PatientIcon,
  PharmacyIcon,
  PrescriptionIcon,
  PulseIcon,
  ShieldIcon,
} from "@/components/icons";
import { SectionHeader } from "@/components/SectionHeader";
import type { Locale, Translations } from "@/types/i18n";

interface PlatformPreviewSectionProps {
  t: Translations;
  locale: Locale;
}

const dashboardLabels: Record<
  Locale,
  {
    appTitle: string;
    secure: string;
    connected: string;
    consultation: string;
    consultStatus: string;
    labResult: string;
    labStatus: string;
    prescription: string;
    rxStatus: string;
    notification: string;
    notifMsg: string;
    secureComms: string;
    secureStatus: string;
    pulse: string;
    roles: string[];
  }
> = {
  ar: {
    appTitle: "لوحة التحكم الطبية",
    secure: "محمي",
    connected: "متصل",
    consultation: "الاستشارة",
    consultStatus: "بانتظار رد الطبيب",
    labResult: "نتيجة المختبر",
    labStatus: "قيد المعالجة",
    prescription: "الوصفة الطبية",
    rxStatus: "جاهزة للمراجعة",
    notification: "إشعار جديد",
    notifMsg: "تحديث آمن في سجلك الطبي",
    secureComms: "تواصل محمي",
    secureStatus: "تشفير نشط",
    pulse: "نبضات الأنشطة اليوم",
    roles: ["المريض", "الطبيب", "المختبر", "الصيدلية"],
  },
  ku: {
    appTitle: "داشبۆردی پزیشکی",
    secure: "پارێزراو",
    connected: "بەستراوە",
    consultation: "ڕاوێژ",
    consultStatus: "چاوەڕێی وەڵامی پزیشک",
    labResult: "ئەنجامی تاقیگە",
    labStatus: "لە ژێر کارکردن",
    prescription: "ڕەچەتەی پزیشکی",
    rxStatus: "ئامادەی پشکنین",
    notification: "ئاگادارکردنەوەی نوێ",
    notifMsg: "نوێکردنەوەی پارێزراو لە تۆماری پزیشکیتدا",
    secureComms: "پەیوەندی پارێزراو",
    secureStatus: "ڕەمزکردن چالاکە",
    pulse: "چالاکییەکانی ئەمڕۆ",
    roles: ["نەخۆش", "پزیشک", "تاقیگە", "دەرمانخانە"],
  },
  en: {
    appTitle: "Medical Dashboard",
    secure: "Secure",
    connected: "Connected",
    consultation: "Consultation",
    consultStatus: "Awaiting doctor response",
    labResult: "Lab Result",
    labStatus: "In progress",
    prescription: "Prescription",
    rxStatus: "Ready for review",
    notification: "New notification",
    notifMsg: "A secure update was added to your record",
    secureComms: "Secure Comms",
    secureStatus: "Encryption active",
    pulse: "Today's activity",
    roles: ["Patient", "Doctor", "Lab", "Pharmacy"],
  },
};

export function PlatformPreviewSection({ t, locale }: PlatformPreviewSectionProps) {
  const d = dashboardLabels[locale];

  return (
    <section className="section-space section-alt">
      <div className="container-grid">
        <SectionHeader title={t.preview.title} subtitle={t.preview.subtitle} />

        <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--card-shadow-lg)]">

          {/* Fake title bar */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400 opacity-60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 opacity-60" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 opacity-60" />
              </div>
              <span className="text-sm font-bold text-[var(--color-text)]">{d.appTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_srgb,var(--color-accent)_12%,transparent)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-accent)]">
                <LockIcon size={8} />
                {d.secure}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_12%,transparent)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
                <PulseIcon size={8} />
                {d.connected}
              </span>
            </div>
          </div>

          <div className="p-5">
            {/* Role chips row */}
            <div className="mb-4 flex flex-wrap gap-2">
              {[PatientIcon, DoctorIcon, LabIcon, PharmacyIcon].map((Icon, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--color-muted)]"
                >
                  <Icon size={12} className="text-[var(--color-primary)]" />
                  {d.roles[i]}
                </span>
              ))}
            </div>

            {/* Main dashboard grid */}
            <div className="grid gap-3 lg:grid-cols-5">
              {/* Consultation card (wide) */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 lg:col-span-2">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:color-mix(in_srgb,var(--color-primary)_12%,var(--color-surface))] text-[var(--color-primary)]">
                    <MessageIcon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text)]">{d.consultation}</p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">{d.consultStatus}</p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] px-2 py-0.5 text-[9px] font-bold text-[var(--color-secondary)]">
                      <DoctorIcon size={8} />
                      {d.roles[1]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lab Result */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:color-mix(in_srgb,var(--color-accent)_12%,var(--color-surface))] text-[var(--color-accent)]">
                    <LabIcon size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text)]">{d.labResult}</p>
                    <p className="mt-1 text-[10px] text-[var(--color-muted)]">{d.labStatus}</p>
                  </div>
                </div>
              </div>

              {/* Prescription */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:color-mix(in_srgb,var(--color-primary)_12%,var(--color-surface))] text-[var(--color-primary)]">
                    <PrescriptionIcon size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text)]">{d.prescription}</p>
                    <p className="mt-1 text-[10px] text-[var(--color-muted)]">{d.rxStatus}</p>
                  </div>
                </div>
              </div>

              {/* Secure Comms */}
              <div className="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-accent)_30%,var(--color-border))] bg-[color:color-mix(in_srgb,var(--color-accent)_5%,var(--color-surface-alt))] p-4">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:color-mix(in_srgb,var(--color-accent)_15%,var(--color-surface))] text-[var(--color-accent)]">
                    <ShieldIcon size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text)]">{d.secureComms}</p>
                    <p className="mt-1 text-[10px] text-[var(--color-muted)]">{d.secureStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {/* Notification */}
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_12%,var(--color-surface))] text-[var(--color-secondary)]">
                  <MessageIcon size={14} />
                </span>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text)]">{d.notification}</p>
                  <p className="text-[10px] text-[var(--color-muted)]">{d.notifMsg}</p>
                </div>
              </div>

              {/* Activity pulse */}
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_12%,var(--color-surface))] text-[var(--color-primary)]">
                  <PulseIcon size={14} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--color-text)]">{d.pulse}</p>
                  <div className="mt-1.5 flex gap-0.5" aria-hidden="true">
                    {[5,8,4,9,6,7,5,8,10,7,9,6].map((h, i) => (
                      <span
                        key={i}
                        className="w-2 rounded-sm bg-[var(--color-primary)] opacity-60"
                        style={{ height: `${h * 2}px` }}
                      />
                    ))}
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[var(--color-accent)] ms-2">
                  <CheckCircleIcon size={14} />
                  <FileTextIcon size={14} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

