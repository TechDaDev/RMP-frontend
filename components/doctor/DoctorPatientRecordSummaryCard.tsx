"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
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
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-[var(--color-text-secondary)]">{d.patientSummary}</dt>
          <dd className="text-sm font-medium text-[var(--color-text)]">{fullName}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--color-text-secondary)]">{d.bloodGroup}</dt>
          <dd className="text-sm font-medium text-[var(--color-text)]">{bloodGroupValue}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--color-text-secondary)]">{d.bloodGroupVerification}</dt>
          <dd className="text-sm text-[var(--color-text-secondary)]">{bgVerification}</dd>
        </div>
      </dl>
    </Card>
  );
}
