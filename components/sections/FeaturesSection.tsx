import { FeatureCard } from "@/components/FeatureCard";
import {
  CheckCircleIcon,
  FileTextIcon,
  LabIcon,
  LockIcon,
  MessageIcon,
  PrescriptionIcon,
} from "@/components/icons";
import { SectionHeader } from "@/components/SectionHeader";
import type { ReactNode } from "react";
import type { Translations } from "@/types/i18n";

interface FeaturesSectionProps {
  t: Translations;
}

const featureIcons: ReactNode[] = [
  <MessageIcon key="msg" size={20} />,
  <PrescriptionIcon key="rx" size={20} />,
  <LabIcon key="lab" size={20} />,
  <FileTextIcon key="file" size={20} />,
  <LockIcon key="lock" size={20} />,
  <CheckCircleIcon key="check" size={20} />,
];

export function FeaturesSection({ t }: FeaturesSectionProps) {
  return (
    <section id="features" className="section-space section-alt">
      <div className="container-grid">
        <SectionHeader title={t.features.title} subtitle={t.features.subtitle} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((item, idx) => (
            <FeatureCard
              key={item.title}
              title={item.title}
              desc={item.desc}
              icon={featureIcons[idx % featureIcons.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
