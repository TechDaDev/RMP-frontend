"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DoctorPatientRecordEntriesSection } from "@/components/doctor/DoctorPatientRecordEntriesSection";
import { DoctorPatientRecordSummaryCard } from "@/components/doctor/DoctorPatientRecordSummaryCard";
import type { DoctorPatientRecord } from "@/types/doctor";

interface DoctorPatientRecordPanelProps {
  record: DoctorPatientRecord;
}

export function DoctorPatientRecordPanel({ record }: DoctorPatientRecordPanelProps) {
  const { t } = useAppPreferences();
  const d = t.doctor;

  return (
    <div className="space-y-6">
      <p className="text-xs text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded px-3 py-2">
        {d.patientRecordReadOnlyNotice}
      </p>
      <DoctorPatientRecordSummaryCard record={record} />
      <div>
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-3">{d.recordEntries}</h3>
        <DoctorPatientRecordEntriesSection entries={record.entries ?? []} />
      </div>
    </div>
  );
}
