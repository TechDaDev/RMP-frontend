"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { ConsultationStatusBadge } from "@/components/patient/ConsultationStatusBadge";
import { PatientInfoRow } from "@/components/patient/ui/PatientInfoRow";
import { Card } from "@/components/ui/Card";
import { getConsultationLifecycle } from "@/lib/patient/consultationStatus";
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
  const lifecycle = getConsultationLifecycle(consultation.status);
  const statusHelp = lifecycle === "pending_review"
    ? t.patient.statusHelpPending
    : lifecycle === "accepted" || lifecycle === "in_progress"
      ? t.patient.statusHelpAccepted
      : lifecycle === "closed"
        ? t.patient.statusHelpClosed
        : t.patient.statusHelpCancelled;

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--color-text)]">{t.patient.consultationDetailTitle}</h2>
        <ConsultationStatusBadge status={consultation.status} />
      </div>
      <div className="text-sm text-[var(--color-muted)]">
        <span className="text-sm text-[var(--color-muted)]">
          {t.patient.createdAt}: {formatDate(consultation.created_at)}
        </span>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm leading-7 text-[var(--color-muted)]">
        {statusHelp}
      </div>

      <DashboardGrid columns="four">
        <PatientInfoRow label={t.patient.specialty} value={consultation.selected_specialty ? t.patient.specialtyLabels[consultation.selected_specialty] ?? consultation.selected_specialty : consultation.selected_specialty_other || "-"} />
        <PatientInfoRow label={t.patient.duration} value={t.patient.durationLabels[consultation.duration] ?? consultation.duration} />
        <PatientInfoRow label={t.patient.severity} value={t.patient.severityLabels[consultation.severity] ?? consultation.severity} />
        <PatientInfoRow label={t.patient.doctor} value={consultation.doctor?.full_name || "-"} />
      </DashboardGrid>

      <DashboardGrid columns="three">
        <PatientInfoRow label={t.patient.fever} value={consultation.has_fever ? t.common.yes : t.common.no} />
        <PatientInfoRow label={t.patient.pain} value={consultation.has_pain ? t.common.yes : t.common.no} />
        <PatientInfoRow label={t.patient.consultationRefresh} value={formatDate(consultation.updated_at)} />
      </DashboardGrid>

      <div>
        <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.additionalNotes}</p>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{consultation.additional_notes || "-"}</p>
      </div>
    </Card>
  );
}
