import { FeatureCard } from "@/components/FeatureCard";
import {
  LockIcon,
  MessageIcon,
  PulseIcon,
  ShieldIcon,
} from "@/components/icons";
import { SectionHeader } from "@/components/SectionHeader";
import type { ReactNode } from "react";
import type { Translations } from "@/types/i18n";

interface TrustSectionProps {
  t: Translations;
}

const trustIcons: ReactNode[] = [
  <LockIcon key="lock" size={28} />,
  <ShieldIcon key="shield" size={28} />,
  <MessageIcon key="msg" size={28} />,
  <PulseIcon key="pulse" size={28} />,
];

export function TrustSection({ t }: TrustSectionProps) {
  return (
    <section className="section-space" aria-label={t.trust.title}>
      <div className="container-grid">
        <SectionHeader title={t.trust.title} subtitle={t.security.tagline} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.trust.items.map((item, idx) => (
            <FeatureCard
              key={item.label}
              title={item.label}
              desc={item.desc}
              icon={trustIcons[idx % trustIcons.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
