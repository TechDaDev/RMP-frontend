import { SectionHeader } from "@/components/SectionHeader";
import type { Translations } from "@/types/i18n";

interface FAQSectionProps {
  t: Translations;
}

export function FAQSection({ t }: FAQSectionProps) {
  return (
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
  );
}
