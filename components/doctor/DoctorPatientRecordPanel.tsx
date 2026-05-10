"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DoctorPatientRecordEntriesSection } from "@/components/doctor/DoctorPatientRecordEntriesSection";
import { DoctorPatientRecordSummaryCard } from "@/components/doctor/DoctorPatientRecordSummaryCard";
import { Card } from "@/components/ui/Card";
import type { DoctorPatientRecord } from "@/types/doctor";

interface DoctorPatientRecordPanelProps {
  record: DoctorPatientRecord;
}

export function DoctorPatientRecordPanel({ record }: DoctorPatientRecordPanelProps) {
  const { t } = useAppPreferences();
  const d = t.doctor;

  return (
    <div className="space-y-6">
      <Card className="text-sm leading-7 text-[var(--color-muted)]">
        {d.patientRecordReadOnlyNotice}
      </Card>
      <DoctorPatientRecordSummaryCard record={record} />
      <DashboardSection title={d.recordEntries}>
        <DoctorPatientRecordEntriesSection entries={record.entries ?? []} />
      </DashboardSection>
    </div>
  );
}
