"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DoctorAcceptButton } from "@/components/doctor/DoctorAcceptButton";
import { ArrowIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    <Card className="rounded-[2rem]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={badgeToneFromStatus(consultation.status)}>
              {t.doctor[statusLabelKey]}
            </Badge>
            {redFlagCount > 0 ? (
              <Badge tone="primary">{`${redFlagCount} ${t.patient.redFlagSymptom}`}</Badge>
            ) : null}
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.roles.patient}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                {consultation.patient?.full_name ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.specialty}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                {consultation.selected_specialty_display ?? consultation.selected_specialty ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.severity}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                {consultation.severity ? (t.patient.severityLabels[consultation.severity] ?? consultation.severity) : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.createdAt}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{formatDate(consultation.created_at)}</p>
            </div>
          </div>

          <p className="text-sm leading-7 text-[var(--color-muted)]">
            {symptomNames || "-"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:w-auto">
          <Link href={detailHref} className={buttonClassName({ variant: "secondary" })}>
            {t.doctor.viewDetails}
            <ArrowIcon size={16} />
          </Link>
          {showAccept && onAccept ? (
            <DoctorAcceptButton
              status={consultation.status}
              isApproved={isApproved}
              loading={accepting}
              onAccept={() => onAccept(consultation.id)}
              label={t.doctor.acceptConsultation}
              loadingLabel={t.doctor.acceptingConsultation}
            />
          ) : null}
        </div>
      </div>
    </Card>
  );
}
