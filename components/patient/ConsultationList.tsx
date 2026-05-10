"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { ConsultationStatusBadge } from "@/components/patient/ConsultationStatusBadge";
import { PatientInfoRow } from "@/components/patient/ui/PatientInfoRow";
import { PatientListCard } from "@/components/patient/ui/PatientListCard";
import { MessageIcon } from "@/components/icons";
import type { ConsultationListItem } from "@/types/patient";

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

interface ConsultationListProps {
  consultations: ConsultationListItem[];
}

export function ConsultationList({ consultations }: ConsultationListProps) {
  const { t } = useAppPreferences();

  if (consultations.length === 0) {
    return (
      <DashboardStateCard
        state="empty"
        icon={<MessageIcon size={20} />}
        title={t.patient.consultationEmptyTitle}
        description={t.patient.consultationEmptyDescription}
      />
    );
  }

  return (
    <div className="space-y-4">
      {consultations.map((consultation) => (
        <PatientListCard
          key={consultation.id}
          title={consultation.selected_specialty
            ? t.patient.specialtyLabels[consultation.selected_specialty] ?? consultation.selected_specialty
            : consultation.selected_specialty_other || t.patient.consultationDetailTitle}
          meta={`${t.patient.createdAt}: ${formatDate(consultation.created_at)}`}
          badge={<ConsultationStatusBadge status={consultation.status} />}
          href={`/app/patient/consultations/${consultation.id}`}
          actionLabel={t.patient.consultationDetailTitle}
        >
          <DashboardGrid columns="four">
            <PatientInfoRow label={t.patient.specialty} value={consultation.selected_specialty ? t.patient.specialtyLabels[consultation.selected_specialty] ?? consultation.selected_specialty : consultation.selected_specialty_other || "-"} />
            <PatientInfoRow label={t.patient.severity} value={t.patient.severityLabels[consultation.severity] ?? consultation.severity} />
            <PatientInfoRow label={t.patient.duration} value={t.patient.durationLabels[consultation.duration] ?? consultation.duration} />
            <PatientInfoRow label={t.patient.additionalNotes} value={<span className="line-clamp-2">{consultation.additional_notes || "-"}</span>} muted />
          </DashboardGrid>
        </PatientListCard>
      ))}
    </div>
  );
}
