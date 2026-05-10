"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DoctorAcceptButton } from "@/components/doctor/DoctorAcceptButton";
import { DoctorInfoRow } from "@/components/doctor/ui/DoctorInfoRow";
import { DoctorListCard } from "@/components/doctor/ui/DoctorListCard";
import { Badge } from "@/components/ui/Badge";
import {
  getDoctorConsultationStatusLabelKey,
  getDoctorConsultationStatusTone,
} from "@/lib/doctor/doctorConsultationStatus";
import type { DoctorConsultationListItem } from "@/types/doctor";

interface DoctorConsultationCardProps {
  consultation: DoctorConsultationListItem;
  isApproved: boolean;
  detailHref: string;
  onAccept?: (id: string) => void;
  accepting?: boolean;
  showAccept?: boolean;
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

function badgeToneFromStatus(status: string): "neutral" | "primary" | "success" {
  const tone = getDoctorConsultationStatusTone(status);
  if (tone === "info") {
    return "primary";
  }

  if (tone === "success") {
    return "success";
  }

  return "neutral";
}

export function DoctorConsultationCard({
  consultation,
  isApproved,
  detailHref,
  onAccept,
  accepting = false,
  showAccept = false,
}: DoctorConsultationCardProps) {
  const { t } = useAppPreferences();
  const redFlagCount = (consultation.symptoms ?? []).filter((symptom) => symptom.is_red_flag).length;
  const symptomNames = (consultation.symptoms ?? []).slice(0, 4).map((symptom) => symptom.name).join("، ");

  const statusLabelKey = getDoctorConsultationStatusLabelKey(consultation.status);

  return (
    <DoctorListCard
      title={consultation.patient?.full_name ?? t.roles.patient}
      meta={`${t.patient.createdAt}: ${formatDate(consultation.created_at)}`}
      badge={
        <div className="flex flex-wrap gap-2">
          <Badge tone={badgeToneFromStatus(consultation.status)}>{t.doctor[statusLabelKey]}</Badge>
          {redFlagCount > 0 ? <Badge tone="primary">{`${redFlagCount} ${t.patient.redFlagSymptom}`}</Badge> : null}
        </div>
      }
      href={detailHref}
      actionLabel={t.doctor.viewDetails}
      action={
        showAccept && onAccept ? (
          <div className="flex w-full lg:w-auto">
            <DoctorAcceptButton
              status={consultation.status}
              isApproved={isApproved}
              loading={accepting}
              onAccept={() => onAccept(consultation.id)}
              label={t.doctor.acceptConsultation}
              loadingLabel={t.doctor.acceptingConsultation}
            />
          </div>
        ) : null
      }
    >
      <DashboardGrid columns="four">
        <DoctorInfoRow label={t.roles.patient} value={consultation.patient?.full_name ?? "-"} />
        <DoctorInfoRow label={t.patient.specialty} value={consultation.selected_specialty_display ?? consultation.selected_specialty ?? "-"} />
        <DoctorInfoRow label={t.patient.severity} value={consultation.severity ? (t.patient.severityLabels[consultation.severity] ?? consultation.severity) : "-"} />
        <DoctorInfoRow label={t.patient.createdAt} value={formatDate(consultation.created_at)} />
      </DashboardGrid>
      <p className="text-sm leading-7 text-[var(--color-muted)]">{symptomNames || "-"}</p>
    </DoctorListCard>
  );
}
