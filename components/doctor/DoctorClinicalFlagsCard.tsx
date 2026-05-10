"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DoctorInfoRow } from "@/components/doctor/ui/DoctorInfoRow";
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

      <DashboardGrid columns="three">
        <DoctorInfoRow label={t.patient.severity} value={consultation.severity ? t.patient.severityLabels[consultation.severity] ?? consultation.severity : "-"} />
        <DoctorInfoRow label={t.patient.duration} value={consultation.duration ? t.patient.durationLabels[consultation.duration] ?? consultation.duration : "-"} />
        <DoctorInfoRow label={t.patient.fever} value={consultation.has_fever ? t.common.yes : t.common.no} />
        <DoctorInfoRow label={t.patient.pain} value={consultation.has_pain ? t.common.yes : t.common.no} />
        <DoctorInfoRow label={t.patient.breathingDifficulty} value={consultation.has_breathing_difficulty ? t.common.yes : t.common.no} />
        <DoctorInfoRow label={t.patient.emergencyWarning} value={consultation.has_emergency_warning ? t.common.yes : t.common.no} />
        <DoctorInfoRow label={t.patient.previousVisit} value={consultation.previous_visit_for_same_issue ? t.common.yes : t.common.no} />
      </DashboardGrid>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.patientNotes}</p>
        <p className="text-sm text-[var(--color-muted)]">{consultation.additional_notes || "-"}</p>
      </div>
    </Card>
  );
}
