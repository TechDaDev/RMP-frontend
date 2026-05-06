import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeader } from "@/components/SectionHeader";
import { sectionIcon } from "@/components/sections/sectionIcons";
import type { Translations } from "@/types/i18n";

interface TrustSectionProps {
  t: Translations;
}

export function TrustSection({ t }: TrustSectionProps) {
  return (
    <section className="section-space" aria-label={t.trust.title}>
      <div className="container-grid">
        <SectionHeader title={t.trust.title} subtitle={t.security.tagline} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.trust.items.map((item) => (
            <FeatureCard
              key={item.label}
              title={item.label}
              desc={item.desc}
              icon={sectionIcon("trust")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
