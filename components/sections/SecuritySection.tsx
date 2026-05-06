import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeader } from "@/components/SectionHeader";
import { sectionIcon } from "@/components/sections/sectionIcons";
import type { Translations } from "@/types/i18n";

interface SecuritySectionProps {
  t: Translations;
}

export function SecuritySection({ t }: SecuritySectionProps) {
  return (
    <section id="security" className="section-space">
      <div className="container-grid">
        <SectionHeader
          title={t.security.title}
          subtitle={t.security.subtitle}
          action={<p className="text-sm text-[var(--color-muted)]">{t.security.tagline}</p>}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.security.items.map((item) => (
            <FeatureCard
              key={item.label}
              title={item.label}
              desc={item.desc}
              icon={sectionIcon("security")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
