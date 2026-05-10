"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { PatientInfoRow } from "@/components/patient/ui/PatientInfoRow";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { PatientLabOrderDetail } from "@/types/patient";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface LabOrderDetailPanelProps {
  order: PatientLabOrderDetail;
}

export function LabOrderDetailPanel({ order }: LabOrderDetailPanelProps) {
  const { t } = useAppPreferences();

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--color-text)]">{t.patient.labOrderDetailTitle}</h2>
        <Badge tone="primary">{t.patient.statusLabels[order.status ?? "issued"] ?? order.status ?? "-"}</Badge>
      </div>
      <DashboardGrid columns="four">
        <PatientInfoRow label={t.patient.status} value={t.patient.statusLabels[order.status ?? "issued"] ?? order.status ?? "-"} />
        <PatientInfoRow label={t.patient.doctor} value={order.doctor.full_name} />
        <PatientInfoRow label={t.patient.issuedAt} value={formatDate(order.issued_at)} />
        <PatientInfoRow label={t.patient.expiresAt} value={formatDate(order.expires_at)} />
      </DashboardGrid>
      <DashboardGrid columns="two">
        <PatientInfoRow label={t.patient.qrToken} value={<span className="break-all">{order.qr_token || "-"}</span>} muted />
        <PatientInfoRow label={t.patient.guidance} value={order.guidance || "-"} muted />
      </DashboardGrid>
      <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-muted)]">
        {t.patient.labOrderPrivacyNote}
      </p>
    </Card>
  );
}
