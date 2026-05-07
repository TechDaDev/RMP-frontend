"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { FileTextIcon, LabIcon, MessageIcon, PrescriptionIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import type { PatientDashboardSummary } from "@/types/patient";

interface PatientSummaryCardsProps {
  summary: PatientDashboardSummary;
}

export function PatientSummaryCards({ summary }: PatientSummaryCardsProps) {
  const { t } = useAppPreferences();

  const cards = [
    {
      title: t.patient.summaryConsultations,
      value: summary.consultationsCount,
      Icon: MessageIcon,
    },
    {
      title: t.patient.summaryPrescriptions,
      value: summary.prescriptionsCount,
      Icon: PrescriptionIcon,
    },
    {
      title: t.patient.summaryLabOrders,
      value: summary.labOrdersCount,
      Icon: FileTextIcon,
    },
    {
      title: t.patient.summaryLabResults,
      value: summary.labResultsCount,
      Icon: LabIcon,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, value, Icon }) => (
        <Card key={title} className="rounded-[2rem]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--color-muted)]">{title}</p>
              <p className="mt-3 text-3xl font-black text-[var(--color-text)]">{value}</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
              <Icon size={20} />
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}