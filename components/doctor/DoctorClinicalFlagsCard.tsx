"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Card } from "@/components/ui/Card";
import type { DoctorConsultationDetail } from "@/types/doctor";

interface DoctorClinicalFlagsCardProps {
  consultation: DoctorConsultationDetail;
}

export function DoctorClinicalFlagsCard({ consultation }: DoctorClinicalFlagsCardProps) {
  const { t } = useAppPreferences();

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.clinicalFlags}</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <p className="text-sm text-[var(--color-text)]">
          <span className="font-semibold">{t.patient.severity}: </span>
          {consultation.severity ? t.patient.severityLabels[consultation.severity] ?? consultation.severity : "-"}
        </p>
        <p className="text-sm text-[var(--color-text)]">
          <span className="font-semibold">{t.patient.duration}: </span>
          {consultation.duration ? t.patient.durationLabels[consultation.duration] ?? consultation.duration : "-"}
        </p>
        <p className="text-sm text-[var(--color-text)]">{t.patient.fever}: {consultation.has_fever ? t.common.yes : t.common.no}</p>
        <p className="text-sm text-[var(--color-text)]">{t.patient.pain}: {consultation.has_pain ? t.common.yes : t.common.no}</p>
        <p className="text-sm text-[var(--color-text)]">Breathing difficulty: {consultation.has_breathing_difficulty ? t.common.yes : t.common.no}</p>
        <p className="text-sm text-[var(--color-text)]">Emergency warning: {consultation.has_emergency_warning ? t.common.yes : t.common.no}</p>
        <p className="text-sm text-[var(--color-text)]">Previous visit: {consultation.previous_visit_for_same_issue ? t.common.yes : t.common.no}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.patientNotes}</p>
        <p className="text-sm text-[var(--color-muted)]">{consultation.additional_notes || "-"}</p>
      </div>
    </Card>
  );
}
