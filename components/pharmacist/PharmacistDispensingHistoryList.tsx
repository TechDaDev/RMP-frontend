"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PharmacistDispensingHistoryCard } from "@/components/pharmacist/PharmacistDispensingHistoryCard";
import type { PharmacistDispensingHistoryItem } from "@/types/pharmacist";

interface PharmacistDispensingHistoryListProps {
  records: PharmacistDispensingHistoryItem[];
}

export function PharmacistDispensingHistoryList({
  records,
}: PharmacistDispensingHistoryListProps) {
  const { t } = useAppPreferences();

  if (!records || records.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t.pharmacist.noDispensingHistoryRecords}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <PharmacistDispensingHistoryCard key={record.id} record={record} />
      ))}
    </div>
  );
}
