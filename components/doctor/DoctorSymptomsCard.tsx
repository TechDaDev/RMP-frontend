"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { DoctorConsultationDetail } from "@/types/doctor";

interface DoctorSymptomsCardProps {
  consultation: DoctorConsultationDetail;
}

export function DoctorSymptomsCard({ consultation }: DoctorSymptomsCardProps) {
  const { t } = useAppPreferences();
  const symptoms = consultation.symptoms ?? [];

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.symptomsAndRouting}</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.specialty}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
            {consultation.selected_specialty
              ? (t.patient.specialtyLabels[consultation.selected_specialty] ?? consultation.selected_specialty)
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.matchingSpecialtyQueue}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
            {consultation.recommended_specialty
              ? (t.patient.specialtyLabels[consultation.recommended_specialty] ?? consultation.recommended_specialty)
              : "-"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.symptoms}</p>
        {symptoms.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">-</p>
        ) : (
          <div className="space-y-2">
            {symptoms.map((symptom) => (
              <div
                key={symptom.id}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{symptom.name}</p>
                  {symptom.is_red_flag ? <Badge tone="primary">{t.patient.redFlagSymptom}</Badge> : null}
                </div>
                {symptom.category?.name ? (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">{symptom.category.name}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
