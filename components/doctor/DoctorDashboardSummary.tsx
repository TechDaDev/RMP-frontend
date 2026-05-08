"use client";

import { Card } from "@/components/ui/Card";

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
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => (
        <Card key={card.label} className="rounded-[2rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{card.label}</p>
          <p className="mt-2 text-3xl font-extrabold text-[var(--color-text)]">{card.value}</p>
        </Card>
      ))}
    </div>
  );
}
