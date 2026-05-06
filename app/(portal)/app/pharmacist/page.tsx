"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { CheckCircleIcon, FileTextIcon, PharmacyIcon, PrescriptionIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProfilePromptCard } from "@/components/profile/ProfilePromptCard";

export default function PharmacistPortalPage() {
  const { t } = useAppPreferences();

  const modules = [
    { title: t.dashboards.modules.prescriptionReview, Icon: PrescriptionIcon },
    { title: t.dashboards.modules.medicationDispensing, Icon: PharmacyIcon },
    { title: t.dashboards.modules.dispensingLog, Icon: FileTextIcon },
    { title: t.dashboards.modules.messages, Icon: CheckCircleIcon },
  ];

  return (
    <div className="space-y-6">
      <PageHeader badge={<Badge tone="primary">{t.roles.pharmacist}</Badge>} title={t.dashboards.pharmacistTitle} description={t.dashboards.pharmacistSubtitle} />
      <ProfilePromptCard />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map(({ title, Icon }) => (
          <Card key={title} hoverable className="rounded-[2rem]">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
              <Icon size={20} />
            </span>
            <h2 className="mt-4 text-base font-bold text-[var(--color-text)]">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{t.dashboards.previewNotice}</p>
          </Card>
        ))}
      </div>
      <EmptyState title={t.common.uiOnlyBadge} description={t.portal.previewNotice} />
    </div>
  );
}