"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Card } from "@/components/ui/Card";
import type { DoctorPatientRecordEntry } from "@/types/doctor";

const CATEGORY_ORDER = [
  "allergy",
  "chronic_condition",
  "current_medication",
  "past_surgery",
  "family_history",
  "smoking_status",
  "pregnancy_status",
  "blood_group",
  "general_note",
];

interface DoctorPatientRecordEntriesSectionProps {
  entries: DoctorPatientRecordEntry[];
}

export function DoctorPatientRecordEntriesSection({
  entries,
}: DoctorPatientRecordEntriesSectionProps) {
  const { t } = useAppPreferences();
  const d = t.doctor;

  if (!entries || entries.length === 0) {
    return (
      <Card>
        <p className="text-sm text-[var(--color-text-secondary)]">{d.noRecordEntries}</p>
      </Card>
    );
  }

  // Group by category
  const grouped = new Map<string, DoctorPatientRecordEntry[]>();
  for (const entry of entries) {
    const cat = entry.category ?? "general_note";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(entry);
  }

  // Sort categories using known order, then remaining alphabetically
  const sortedCategories = [
    ...CATEGORY_ORDER.filter((c) => grouped.has(c)),
    ...[...grouped.keys()].filter((c) => !CATEGORY_ORDER.includes(c)).sort(),
  ];

  return (
    <div className="space-y-4">
      {sortedCategories.map((category) => {
        const categoryEntries = grouped.get(category)!;
        const categoryLabel = d.categoryLabels?.[category] ?? category;

        return (
          <Card key={category} className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--color-text)]">{categoryLabel}</h4>
            <div className="divide-y divide-[var(--color-border)]">
              {categoryEntries.map((entry) => {
                const verLabel = entry.verification_status
                  ? (d.verificationStatusLabels?.[entry.verification_status] ??
                    entry.verification_status)
                  : null;
                const isConfirmed =
                  entry.verification_status === "doctor_confirmed" ||
                  entry.verification_status === "laboratory_confirmed";

                return (
                  <div key={entry.id} className="py-3 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {entry.title ?? "-"}
                      </p>
                      {verLabel && (
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                            isConfirmed
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {verLabel}
                        </span>
                      )}
                    </div>
                    {entry.value && (
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        <span className="font-medium text-[var(--color-text)]">{d.recordValue}:</span>{" "}
                        {entry.value}
                      </p>
                    )}
                    {entry.notes && (
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        <span className="font-medium">{d.recordNotes}:</span> {entry.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
