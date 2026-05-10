"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DoctorInfoRow } from "@/components/doctor/ui/DoctorInfoRow";
import { Card } from "@/components/ui/Card";
import type { DoctorPatientRecord } from "@/types/doctor";

interface DoctorPatientRecordSummaryCardProps {
  record: DoctorPatientRecord;
}

export function DoctorPatientRecordSummaryCard({ record }: DoctorPatientRecordSummaryCardProps) {
  const { t } = useAppPreferences();
  const d = t.doctor;
  const patient = record.patient;
  const bg = record.blood_group;

  const fullName =
    patient
      ? [patient.first_name, patient.last_name].filter(Boolean).join(" ") || patient.email || "-"
      : "-";

  const bloodGroupValue = bg?.blood_group && bg.blood_group !== "unknown" ? bg.blood_group : "-";
  const bgVerification = bg?.verification_status
    ? (d.verificationStatusLabels?.[bg.verification_status] ?? bg.verification_status)
    : "-";

  return (
    <Card className="space-y-4">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{d.recordSummary}</h3>
      <DashboardGrid columns="three">
        <DoctorInfoRow label={d.patientSummary} value={fullName} />
        <DoctorInfoRow label={d.bloodGroup} value={bloodGroupValue} />
        <DoctorInfoRow label={d.bloodGroupVerification} value={bgVerification} muted />
      </DashboardGrid>
    </Card>
  );
}
