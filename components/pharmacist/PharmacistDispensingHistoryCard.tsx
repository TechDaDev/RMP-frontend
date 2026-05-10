"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { PharmacistHistoryStatusBadge } from "@/components/pharmacist/PharmacistHistoryStatusBadge";
import { PharmacistInfoRow } from "@/components/pharmacist/ui/PharmacistInfoRow";
import { PharmacistListCard } from "@/components/pharmacist/ui/PharmacistListCard";
import type { PharmacistDispensingHistoryItem } from "@/types/pharmacist";

interface PharmacistDispensingHistoryCardProps {
  record: PharmacistDispensingHistoryItem;
}

export function PharmacistDispensingHistoryCard({
  record,
}: PharmacistDispensingHistoryCardProps) {
  const { t, locale } = useAppPreferences();

  const dispensedAtDate = record.dispensed_at
    ? new Date(record.dispensed_at).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <PharmacistListCard
      title={record.medication_name || t.pharmacist.historyMedication}
      meta={record.strength}
      badge={<PharmacistHistoryStatusBadge status={record.status} />}
    >
      <div className="space-y-4">
        <DashboardGrid columns="four">
          {record.dosage && (
            <PharmacistInfoRow label={t.pharmacist.dosage} value={record.dosage} />
          )}
          {record.frequency && (
            <PharmacistInfoRow label={t.pharmacist.frequency} value={record.frequency} />
          )}
          {record.duration && (
            <PharmacistInfoRow label={t.pharmacist.duration} value={record.duration} />
          )}
          {record.route && (
            <PharmacistInfoRow label={t.pharmacist.route} value={record.route} />
          )}
        </DashboardGrid>

        <DashboardGrid columns="two" className="border-t border-[var(--color-border)] pt-4">
          <PharmacistInfoRow label={t.pharmacist.dispensedQuantity} value={record.dispensed_quantity || "-"} />
          <PharmacistInfoRow label={t.pharmacist.dispensedAt} value={dispensedAtDate} muted />
          {record.patient && (
            <PharmacistInfoRow label={t.pharmacist.historyPatient} value={record.patient.full_name || "-"} />
          )}
          {record.doctor && (
            <PharmacistInfoRow label={t.pharmacist.historyDoctor} value={record.doctor.full_name || "-"} />
          )}
          {record.prescription_status && (
            <PharmacistInfoRow label={t.pharmacist.historyStatus} value={record.prescription_status} />
          )}
        </DashboardGrid>

        {record.prescription_id && (
          <div className="border-t border-[var(--color-border)] pt-4">
            <p className="text-xs text-[var(--color-muted)]">
              {t.pharmacist.historyPrescriptionId}
            </p>
            <p className="font-mono text-xs text-[var(--color-muted)]">
              {record.prescription_id.substring(0, 8)}...
            </p>
          </div>
        )}
      </div>
    </PharmacistListCard>
  );
}
