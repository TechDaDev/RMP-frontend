"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DoctorConsultationDetail } from "@/types/doctor";
import { Card } from "@/components/ui/Card";

interface DoctorPatientSummaryCardProps {
  consultation: DoctorConsultationDetail;
}

export default function DoctorPatientSummaryCard({
  consultation,
}: DoctorPatientSummaryCardProps) {
  const { t, locale } = useAppPreferences();
  const d = t.doctor;
  const patient = consultation.patient;
  const dir = locale === "en" ? "ltr" : "rtl";
  const patientName = patient?.full_name ?? `${patient?.first_name ?? ""} ${patient?.last_name ?? ""}`.trim();

  return (
    <Card>
      <div dir={dir} className="space-y-3">
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          {d.patientSummary}
        </h3>
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
          <div>
            <dt className="font-medium text-[var(--color-muted)] text-xs uppercase tracking-wide">
              {t.roles.patient}
            </dt>
            <dd className="text-[var(--color-text)] font-semibold">
              {patientName || "-"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--color-muted)] text-xs uppercase tracking-wide">
              Email
            </dt>
            <dd className="text-[var(--color-text)] break-all">
              {patient?.email ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--color-muted)] text-xs uppercase tracking-wide">
              {t.patient.createdAt}
            </dt>
            <dd className="text-[var(--color-text)]">
              {consultation.created_at
                ? new Date(consultation.created_at).toLocaleDateString()
                : "—"}
            </dd>
          </div>
          {consultation.accepted_at && (
            <div>
              <dt className="font-medium text-[var(--color-muted)] text-xs uppercase tracking-wide">
                {d.statusAccepted}
              </dt>
              <dd className="text-[var(--color-text)]">
                {new Date(consultation.accepted_at).toLocaleDateString()}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </Card>
  );
}
