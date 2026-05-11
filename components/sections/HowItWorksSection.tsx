import {
  CheckCircleIcon,
  DoctorIcon,
  LabIcon,
  PatientIcon,
} from "@/components/icons";
import { SectionHeader } from "@/components/SectionHeader";
import type { ReactNode } from "react";
import type { Translations } from "@/types/i18n";

interface HowItWorksSectionProps {
  t: Translations;
}

const stepIcons: ReactNode[] = [
  <PatientIcon key="patient" size={24} />,
  <DoctorIcon key="doctor" size={24} />,
  <LabIcon key="lab" size={24} />,
  <CheckCircleIcon key="check" size={24} />,
];

export function HowItWorksSection({ t }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="section-space">
      <div className="container-grid">
        <SectionHeader title={t.howItWorks.title} subtitle={t.howItWorks.subtitle} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.howItWorks.steps.map((step, idx) => (
            <article
              key={step.title}
              className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow)] transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-[var(--card-shadow-lg)]"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-xs font-black">
                  {idx + 1}
                </span>
                <span className="text-[var(--color-primary)]">
                  {stepIcons[idx]}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text)] leading-snug">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

