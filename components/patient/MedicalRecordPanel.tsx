"use client";

import { useMemo } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
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
      <Card className="space-y-4 rounded-[2rem]">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.bloodGroup}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {typeof record.blood_group === "string" ? record.blood_group : record.blood_group?.blood_group || "-"}
          </p>
        </div>
        <EmptyState title={t.patient.medicalRecordEmptyTitle} description={t.patient.medicalRecordEmptyDescription} />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-[2rem]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.bloodGroup}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
              {typeof record.blood_group === "string" ? record.blood_group : record.blood_group?.blood_group || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.verifiedAt}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
              {typeof record.blood_group === "string" ? "-" : formatDate(record.blood_group?.verified_at)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.createdAt}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{formatDate(record.created_at)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.updatedAt}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{formatDate(record.updated_at)}</p>
          </div>
        </div>
      </Card>

      {Object.entries(groupedEntries).map(([category, entries]) => (
        <Card key={category} className="rounded-[2rem]">
          <h2 className="text-base font-bold text-[var(--color-text)]">
            {t.patient.medicalRecordCategoryLabels[category] ?? category}
          </h2>
          <div className="mt-4 space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{entry.title}</p>
                  <p className="text-xs text-[var(--color-muted)]">{t.patient.statusLabels[entry.verification_status ?? "pending"] ?? entry.verification_status ?? "-"}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text)]">{entry.value}</p>
                {entry.notes ? <p className="mt-2 text-sm text-[var(--color-muted)]">{entry.notes}</p> : null}
              </div>
            ))}
          </div>
        </Card>
      ))}

      <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-muted)]">
        {t.patient.medicalRecordReadOnlyNote}
      </p>
    </div>
  );
}