"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PharmacistHistoryStatusBadge } from "@/components/pharmacist/PharmacistHistoryStatusBadge";
import type { PharmacistDispensingHistoryItem } from "@/types/pharmacist";

interface PharmacistDispensingHistoryCardProps {
  record: PharmacistDispensingHistoryItem;
}

export function PharmacistDispensingHistoryCard({
  record,
}: PharmacistDispensingHistoryCardProps) {
  const { t } = useAppPreferences();

  const dispensedAtDate = record.dispensed_at
    ? new Date(record.dispensed_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              {record.medication_name || t.pharmacist.historyMedication}
            </h3>
            {record.strength && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {record.strength}
              </p>
            )}
          </div>
          <PharmacistHistoryStatusBadge status={record.status} />
        </div>

        {/* Medication Details */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {record.dosage && (
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.pharmacist.dosage}
              </p>
              <p className="text-sm text-neutral-900 dark:text-white">
                {record.dosage}
              </p>
            </div>
          )}
          {record.frequency && (
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.pharmacist.frequency}
              </p>
              <p className="text-sm text-neutral-900 dark:text-white">
                {record.frequency}
              </p>
            </div>
          )}
          {record.duration && (
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.pharmacist.duration}
              </p>
              <p className="text-sm text-neutral-900 dark:text-white">
                {record.duration}
              </p>
            </div>
          )}
          {record.route && (
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t.pharmacist.route}
              </p>
              <p className="text-sm text-neutral-900 dark:text-white">
                {record.route}
              </p>
            </div>
          )}
        </div>

        {/* Dispensing Info */}
        <div className="space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {t.pharmacist.dispensedQuantity}
            </span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {record.dispensed_quantity || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {t.pharmacist.dispensedAt}
            </span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {dispensedAtDate}
            </span>
          </div>
        </div>

        {/* Context */}
        <div className="space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          {record.patient && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {t.pharmacist.historyPatient}
              </span>
              <span className="text-sm text-neutral-900 dark:text-white">
                {record.patient.full_name || "-"}
              </span>
            </div>
          )}
          {record.doctor && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {t.pharmacist.historyDoctor}
              </span>
              <span className="text-sm text-neutral-900 dark:text-white">
                {record.doctor.full_name || "-"}
              </span>
            </div>
          )}
          {record.prescription_status && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {t.pharmacist.historyStatus}
              </span>
              <span className="text-sm text-neutral-900 dark:text-white">
                {record.prescription_status}
              </span>
            </div>
          )}
        </div>

        {/* Prescription ID */}
        {record.prescription_id && (
          <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t.pharmacist.historyPrescriptionId}
            </p>
            <p className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
              {record.prescription_id.substring(0, 8)}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
