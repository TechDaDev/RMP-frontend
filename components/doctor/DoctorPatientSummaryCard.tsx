"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DoctorInfoRow } from "@/components/doctor/ui/DoctorInfoRow";
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
        <DashboardGrid columns="two">
          <DoctorInfoRow label={t.roles.patient} value={patientName || "-"} />
          <DoctorInfoRow label={t.auth.emailLabel} value={<span className="break-all">{patient?.email ?? "—"}</span>} />
          <DoctorInfoRow label={t.patient.createdAt} value={consultation.created_at ? new Date(consultation.created_at).toLocaleDateString() : "—"} />
          <DoctorInfoRow label={d.statusAccepted} value={consultation.accepted_at ? new Date(consultation.accepted_at).toLocaleDateString() : "—"} />
        </DashboardGrid>
      </div>
    </Card>
  );
}
