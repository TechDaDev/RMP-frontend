import { FeatureCard } from "@/components/FeatureCard";
import {
  DoctorIcon,
  LabIcon,
  PatientIcon,
  PharmacyIcon,
} from "@/components/icons";
import { SectionHeader } from "@/components/SectionHeader";
import type { ReactNode } from "react";
import type { Translations } from "@/types/i18n";

interface WhoItServesSectionProps {
  t: Translations;
}

const audienceIcons: ReactNode[] = [
  <PatientIcon key="patient" size={28} />,
  <DoctorIcon key="doctor" size={28} />,
  <PharmacyIcon key="pharmacy" size={28} />,
  <LabIcon key="lab" size={28} />,
];

export function WhoItServesSection({ t }: WhoItServesSectionProps) {
  return (
    <section id="who" className="section-space">
      <div className="container-grid">
        <SectionHeader title={t.whoItServes.title} subtitle={t.whoItServes.subtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.whoItServes.items.map((item, idx) => (
            <FeatureCard
              key={item.title}
              title={item.title}
              desc={item.desc}
              icon={audienceIcons[idx % audienceIcons.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
