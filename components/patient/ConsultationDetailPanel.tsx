"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { ConsultationStatusBadge } from "@/components/patient/ConsultationStatusBadge";
import { Card } from "@/components/ui/Card";
import type { ConsultationDetail } from "@/types/patient";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

interface ConsultationDetailPanelProps {
  consultation: ConsultationDetail;
}

export function ConsultationDetailPanel({ consultation }: ConsultationDetailPanelProps) {
  const { t } = useAppPreferences();

  return (
    <Card className="space-y-5 rounded-[2rem]">
      <div className="flex flex-wrap items-center gap-3">
        <ConsultationStatusBadge status={consultation.status} />
        <span className="text-sm text-[var(--color-muted)]">
          {t.patient.createdAt}: {formatDate(consultation.created_at)}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.specialty}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
            {consultation.selected_specialty
              ? t.patient.specialtyLabels[consultation.selected_specialty] ?? consultation.selected_specialty
              : consultation.selected_specialty_other || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.duration}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{t.patient.durationLabels[consultation.duration] ?? consultation.duration}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.severity}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{t.patient.severityLabels[consultation.severity] ?? consultation.severity}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.doctor}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{consultation.doctor?.full_name || "-"}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text)]">
          {t.patient.fever}: {consultation.has_fever ? t.common.previewBadge : "-"}
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text)]">
          {t.patient.pain}: {consultation.has_pain ? t.common.previewBadge : "-"}
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text)]">
          {t.patient.consultationRefresh}: {formatDate(consultation.updated_at)}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.additionalNotes}</p>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{consultation.additional_notes || "-"}</p>
      </div>
    </Card>
  );
}