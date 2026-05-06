import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeader } from "@/components/SectionHeader";
import { sectionIcon } from "@/components/sections/sectionIcons";
import type { Translations } from "@/types/i18n";

interface FeaturesSectionProps {
  t: Translations;
}

export function FeaturesSection({ t }: FeaturesSectionProps) {
  return (
    <section id="features" className="section-space">
      <div className="container-grid">
        <SectionHeader title={t.features.title} subtitle={t.features.subtitle} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((item) => (
            <FeatureCard
              key={item.title}
              title={item.title}
              desc={item.desc}
              icon={sectionIcon("feature")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
