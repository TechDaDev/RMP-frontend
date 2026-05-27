"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { ConsultationStatusBadge } from "@/components/patient/ConsultationStatusBadge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatusBadge";
import { PatientInfoRow } from "@/components/patient/ui/PatientInfoRow";
import { Card } from "@/components/ui/Card";
import { getConsultationLifecycle } from "@/lib/patient/consultationStatus";
import type { ConsultationDetail } from "@/types/patient";

interface ConsultationDetailPanelProps {
  consultation: ConsultationDetail;
}

export function ConsultationDetailPanel({ consultation }: ConsultationDetailPanelProps) {
  const { t } = useAppPreferences();
  const lifecycle = getConsultationLifecycle(consultation.status);
  const assignedDoctor = consultation.assigned_doctor ?? consultation.doctor ?? null;
  const isWaitingForDoctor = lifecycle === "pending_review" && !assignedDoctor;
  const statusHelp = isWaitingForDoctor
    ? t.patient.waitingForDoctor
    : lifecycle === "pending_review"
      ? t.patient.statusHelpPending
      : lifecycle === "accepted" || lifecycle === "in_progress"
        ? t.patient.statusHelpAccepted
        : lifecycle === "closed"
          ? t.patient.statusHelpClosed
          : t.patient.statusHelpCancelled;

  function formatDate(value?: string | null) {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  }

  function formatSpecialty(value?: string | null) {
    if (!value) {
      return "-";
    }

    return t.patient.specialtyLabels[value] ?? value;
  }

  function formatResponses() {
    const responses = consultation.responses ?? [];
    if (responses.length === 0) {
      return null;
    }

    return (
      <div className="space-y-3">
        {responses.map((response, index) => (
          <div key={response.id ?? `${index}`} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-muted)]">
              <span>{response.doctor?.full_name || t.patient.doctor}</span>
              <span>{formatDate(response.created_at)}</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text)]">{response.response_text || "-"}</p>
            {response.recommendation_type ? (
              <p className="mt-2 text-xs font-medium text-[var(--color-muted)]">{response.recommendation_type}</p>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--color-text)]">{t.patient.consultationDetailTitle}</h2>
        <ConsultationStatusBadge status={consultation.status} />
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))] px-4 py-3 text-sm leading-7 text-[var(--color-muted)]">
        {statusHelp}
      </div>

      <DashboardGrid columns="four">
        <PatientInfoRow label={t.patient.consultationId} value={consultation.id} />
        <PatientInfoRow label={t.patient.status} value={t.patient.statusLabels[consultation.status] ?? consultation.status} />
        <PatientInfoRow label={t.patient.recommendedSpecialty} value={formatSpecialty(consultation.recommended_specialty)} />
        <PatientInfoRow label={t.patient.selectedSpecialty} value={formatSpecialty(consultation.selected_specialty)} />
      </DashboardGrid>

      <DashboardGrid columns="three">
        <PatientInfoRow
          label="Consultation fee"
          value={<PriceDisplay amount={consultation.consultation_fee} currency={consultation.consultation_currency} />}
        />
        <PatientInfoRow label="Fee snapshot at" value={formatDate(consultation.fee_snapshot_at)} />
        <PatientInfoRow label="Payment status" value={<PaymentStatusBadge status={consultation.payment_status} />} />
      </DashboardGrid>

      <DashboardGrid columns="three">
        <PatientInfoRow label={t.patient.assignedDoctor} value={assignedDoctor?.full_name || t.patient.waitingForDoctor} />
        <PatientInfoRow label={t.patient.acceptedAt} value={formatDate(consultation.accepted_at)} />
        <PatientInfoRow label={t.patient.createdAt} value={formatDate(consultation.created_at)} />
      </DashboardGrid>

      <DashboardGrid columns="three">
        <PatientInfoRow label={t.patient.consultationRefresh} value={formatDate(consultation.updated_at)} />
        <PatientInfoRow label={t.patient.symptoms} value={consultation.symptoms?.length ? consultation.symptoms.map((symptom) => symptom.name).join("، ") : "-"} />
        <PatientInfoRow label={t.patient.updatedAt} value={formatDate(consultation.updated_at)} />
      </DashboardGrid>

      <div>
        <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.responses}</p>
        <div className="mt-2">{formatResponses() ?? <p className="text-sm leading-7 text-[var(--color-muted)]">-</p>}</div>
      </div>

      <div>
        <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.additionalNotes}</p>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{consultation.additional_notes || "-"}</p>
      </div>
    </Card>
  );
}
