"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
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
    <Card className="space-y-5 rounded-[2rem]">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.status}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{t.patient.statusLabels[result.status ?? "released"] ?? result.status ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.value}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{displayValue}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.category}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{t.patient.valueTypeLabels[result.value_type] ?? result.value_type}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.verifiedAt}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{formatDate(result.released_at)}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.notes}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{result.reference_range || "-"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.updatedAt}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{formatDate(result.created_at)}</p>
        </div>
      </div>
      <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-muted)]">
        {t.patient.labResultPrivacyNote}
      </p>
    </Card>
  );
}