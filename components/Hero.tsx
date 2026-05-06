import type { Translations } from "@/types/i18n";
import type { Locale } from "@/types/i18n";

interface HeroProps {
  t: Translations;
  locale: Locale;
}

const flowItems: Record<Locale, string[]> = {
  ar: ["المريض", "الطبيب", "المختبر", "الصيدلية", "سجل آمن"],
  ku: ["نەخۆش", "پزیشک", "تاقیگە", "دەرمانخانە", "تۆمارێکی پارێزراو"],
  en: ["Patient", "Doctor", "Lab", "Pharmacy", "Secure Record"],
};

export function Hero({ t, locale }: HeroProps) {
  return (
    <section id="home" className="relative overflow-hidden py-12 md:py-20">
      <div className="hero-aura pointer-events-none" aria-hidden="true" />
      <div className="container-grid items-center gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1 text-xs font-semibold tracking-wide text-[var(--color-primary)]">
            Phase 0 - Landing Page
          </p>
          <h1 className="text-balance text-3xl font-bold leading-tight text-[var(--color-text)] md:text-5xl">
            {t.hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-muted)] md:text-lg">
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn-primary" href="#features">
              {t.hero.exploreBtn}
            </a>
            <a className="btn-secondary" href="#how-it-works">
              {t.hero.howBtn}
            </a>
          </div>
        </div>

        <div className="relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow-lg)]">
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-60"
            style={{
              background:
                "radial-gradient(circle at 20% 10%, color-mix(in srgb, var(--color-primary) 20%, transparent), transparent 52%), radial-gradient(circle at 80% 90%, color-mix(in srgb, var(--color-accent) 24%, transparent), transparent 50%)",
            }}
          />

          <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {flowItems[locale].map((item, idx) => (
              <div
                key={item}
                className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 text-center text-xs font-semibold text-[var(--color-text)] ${
                  idx === 4 ? "sm:col-span-3" : ""
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <svg
            aria-label="Connected healthcare flow"
            className="relative z-10 mt-4 h-24 w-full"
            viewBox="0 0 280 90"
          >
            <path
              d="M10 44 C 55 8, 98 78, 142 44 S 230 11, 270 44"
              stroke="var(--color-primary)"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
              className="path-flow"
            />
            <path
              d="M10 56 C 55 20, 98 88, 142 56 S 230 24, 270 56"
              stroke="var(--color-accent)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              className="path-flow path-flow-slow"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
