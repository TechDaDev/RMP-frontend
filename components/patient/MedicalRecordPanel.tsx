"use client";

import { useMemo } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { PatientInfoRow } from "@/components/patient/ui/PatientInfoRow";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { MedicalRecordEntry, PatientMedicalRecord } from "@/types/patient";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface MedicalRecordPanelProps {
  record: PatientMedicalRecord;
}

export function MedicalRecordPanel({ record }: MedicalRecordPanelProps) {
  const { t } = useAppPreferences();

  const groupedEntries = useMemo(() => {
    return record.entries.reduce<Record<string, MedicalRecordEntry[]>>((groups, entry) => {
      const key = entry.category;
      groups[key] = groups[key] ? [...groups[key], entry] : [entry];
      return groups;
    }, {});
  }, [record.entries]);

  if (record.entries.length === 0) {
    return (
      <Card className="space-y-4">
        <PatientInfoRow
          label={t.patient.bloodGroup}
          value={typeof record.blood_group === "string" ? record.blood_group : record.blood_group?.blood_group || "-"}
        />
        <DashboardStateCard state="empty" title={t.patient.medicalRecordEmptyTitle} description={t.patient.medicalRecordEmptyDescription} />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <DashboardGrid columns="four">
          <PatientInfoRow label={t.patient.bloodGroup} value={typeof record.blood_group === "string" ? record.blood_group : record.blood_group?.blood_group || "-"} />
          <PatientInfoRow label={t.patient.verifiedAt} value={typeof record.blood_group === "string" ? "-" : formatDate(record.blood_group?.verified_at)} />
          <PatientInfoRow label={t.patient.createdAt} value={formatDate(record.created_at)} />
          <PatientInfoRow label={t.patient.updatedAt} value={formatDate(record.updated_at)} />
        </DashboardGrid>
      </Card>

      {Object.entries(groupedEntries).map(([category, entries]) => (
        <DashboardSection key={category} title={t.patient.medicalRecordCategoryLabels[category] ?? category}>
          <Card className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{entry.title}</p>
                  <Badge tone="primary">{t.patient.statusLabels[entry.verification_status ?? "pending"] ?? entry.verification_status ?? "-"}</Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text)]">{entry.value}</p>
                {entry.notes ? <p className="mt-2 text-sm text-[var(--color-muted)]">{entry.notes}</p> : null}
              </div>
            ))}
          </Card>
        </DashboardSection>
      ))}

      <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-muted)]">
        {t.patient.medicalRecordReadOnlyNote}
      </p>
    </div>
  );
}
