import { type Translations } from "@/types/i18n";

interface FinalCTASectionProps {
  t: Translations;
}

export function FinalCTASection({ t }: FinalCTASectionProps) {
  return (
    <section id="cta" className="section-space pt-4">
      <div className="container-grid">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--card-shadow-lg)]">
          <p className="mx-auto max-w-3xl text-lg font-medium leading-8 text-[var(--color-text)]">
            {t.finalCta.tagline}
          </p>
          <a href="/login" className="btn-primary mt-6 inline-flex">
            {t.finalCta.btn}
          </a>
        </div>
      </div>
    </section>
  );
}
