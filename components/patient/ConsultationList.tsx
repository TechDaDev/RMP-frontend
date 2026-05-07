"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { ConsultationStatusBadge } from "@/components/patient/ConsultationStatusBadge";
import { ArrowIcon, MessageIcon } from "@/components/icons";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
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
      <EmptyState
        icon={<MessageIcon size={20} />}
        title={t.patient.consultationEmptyTitle}
        description={t.patient.consultationEmptyDescription}
      />
    );
  }

  return (
    <div className="space-y-4">
      {consultations.map((consultation) => (
        <Card key={consultation.id} className="rounded-[2rem]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <ConsultationStatusBadge status={consultation.status} />
                <span className="text-sm text-[var(--color-muted)]">
                  {t.patient.createdAt}: {formatDate(consultation.created_at)}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.specialty}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                    {consultation.selected_specialty
                      ? t.patient.specialtyLabels[consultation.selected_specialty] ?? consultation.selected_specialty
                      : consultation.selected_specialty_other || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.severity}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                    {t.patient.severityLabels[consultation.severity] ?? consultation.severity}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.duration}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                    {t.patient.durationLabels[consultation.duration] ?? consultation.duration}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.additionalNotes}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text)]">
                    {consultation.additional_notes || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex w-full shrink-0 lg:w-auto">
              <Link
                href={`/app/patient/consultations/${consultation.id}`}
                className={buttonClassName({ variant: "secondary", className: "w-full lg:w-auto" })}
              >
                {t.patient.consultationDetailTitle}
                <ArrowIcon size={16} />
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}