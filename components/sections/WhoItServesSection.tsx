import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeader } from "@/components/SectionHeader";
import { sectionIcon } from "@/components/sections/sectionIcons";
import type { Translations } from "@/types/i18n";

interface WhoItServesSectionProps {
  t: Translations;
}

export function WhoItServesSection({ t }: WhoItServesSectionProps) {
  return (
    <section id="who" className="section-space">
      <div className="container-grid">
        <SectionHeader title={t.whoItServes.title} subtitle={t.whoItServes.subtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.whoItServes.items.map((item) => (
            <FeatureCard
              key={item.title}
              title={item.title}
              desc={item.desc}
              icon={sectionIcon("audience")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
