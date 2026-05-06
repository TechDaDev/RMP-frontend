import { SectionHeader } from "@/components/SectionHeader";
import type { Translations } from "@/types/i18n";

interface HowItWorksSectionProps {
  t: Translations;
}

export function HowItWorksSection({ t }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="section-space">
      <div className="container-grid">
        <SectionHeader title={t.howItWorks.title} subtitle={t.howItWorks.subtitle} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.howItWorks.steps.map((step) => (
            <article
              key={step.title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow)]"
            >
              <h3 className="text-base font-semibold text-[var(--color-text)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
