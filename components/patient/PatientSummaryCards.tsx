"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { FileTextIcon, LabIcon, MessageIcon, PrescriptionIcon } from "@/components/icons";
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
    <DashboardGrid columns="four">
      {cards.map(({ title, value, Icon }) => (
        <DashboardStatCard key={title} label={title} value={value} icon={<Icon size={20} />} tone="primary" />
      ))}
    </DashboardGrid>
  );
}
