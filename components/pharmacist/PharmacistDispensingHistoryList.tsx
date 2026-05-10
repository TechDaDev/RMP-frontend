"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
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
      <DashboardStateCard
        state="empty"
        title={t.pharmacist.noDispensingHistoryRecords}
        description={t.pharmacist.dispensingHistoryEmpty}
      />
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
