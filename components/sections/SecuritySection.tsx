import { FeatureCard } from "@/components/FeatureCard";
import {
  FileTextIcon,
  LockIcon,
  MessageIcon,
  ShieldIcon,
} from "@/components/icons";
import { SectionHeader } from "@/components/SectionHeader";
import type { ReactNode } from "react";
import type { Translations } from "@/types/i18n";

interface SecuritySectionProps {
  t: Translations;
}

const securityIcons: ReactNode[] = [
  <LockIcon key="lock" size={20} />,
  <ShieldIcon key="shield" size={20} />,
  <FileTextIcon key="file" size={20} />,
  <FileTextIcon key="file2" size={20} />,
  <MessageIcon key="msg" size={20} />,
];

export function SecuritySection({ t }: SecuritySectionProps) {
  return (
    <section id="security" className="section-space section-alt">
      <div className="container-grid">
        <SectionHeader
          title={t.security.title}
          subtitle={t.security.subtitle}
          action={<p className="text-sm text-[var(--color-muted)]">{t.security.tagline}</p>}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.security.items.map((item, idx) => (
            <FeatureCard
              key={item.label}
              title={item.label}
              desc={item.desc}
              icon={securityIcons[idx % securityIcons.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
