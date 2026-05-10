"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { PatientInfoRow } from "@/components/patient/ui/PatientInfoRow";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { PatientLabResultDetail } from "@/types/patient";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface LabResultDetailPanelProps {
  result: PatientLabResultDetail;
}

export function LabResultDetailPanel({ result }: LabResultDetailPanelProps) {
  const { t } = useAppPreferences();
  const displayValue = result.numeric_value || result.text_value || result.blood_group_value || "-";

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--color-text)]">{t.patient.labResultDetailTitle}</h2>
        <Badge tone="success">{t.patient.statusLabels[result.status ?? "released"] ?? result.status ?? "-"}</Badge>
      </div>
      <DashboardGrid columns="four">
        <PatientInfoRow label={t.patient.status} value={t.patient.statusLabels[result.status ?? "released"] ?? result.status ?? "-"} />
        <PatientInfoRow label={t.patient.value} value={displayValue} />
        <PatientInfoRow label={t.patient.category} value={t.patient.valueTypeLabels[result.value_type] ?? result.value_type} />
        <PatientInfoRow label={t.patient.verifiedAt} value={formatDate(result.released_at)} />
      </DashboardGrid>
      <DashboardGrid columns="two">
        <PatientInfoRow label={t.patient.notes} value={result.reference_range || "-"} muted />
        <PatientInfoRow label={t.patient.updatedAt} value={formatDate(result.created_at)} muted />
      </DashboardGrid>
      <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-muted)]">
        {t.patient.labResultPrivacyNote}
      </p>
    </Card>
  );
}
