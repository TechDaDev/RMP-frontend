"use client";

import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { DoctorIcon, MessageIcon } from "@/components/icons";

interface DoctorDashboardSummaryProps {
  pendingCount: number;
  assignedCount: number;
  pendingLabel: string;
  assignedLabel: string;
}

export function DoctorDashboardSummary({
  pendingCount,
  assignedCount,
  pendingLabel,
  assignedLabel,
}: DoctorDashboardSummaryProps) {
  const cards = [
    { label: pendingLabel, value: pendingCount },
    { label: assignedLabel, value: assignedCount },
  ];

  return (
    <DashboardGrid columns="two">
      <DashboardStatCard label={cards[0].label} value={cards[0].value} icon={<MessageIcon size={20} />} tone="warning" />
      <DashboardStatCard label={cards[1].label} value={cards[1].value} icon={<DoctorIcon size={20} />} tone="primary" />
    </DashboardGrid>
  );
}
