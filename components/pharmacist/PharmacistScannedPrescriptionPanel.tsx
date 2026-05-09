import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { PharmacistDispensePrescriptionResult, PharmacistPrescriptionItem, PharmacistScanResponse } from "@/types/pharmacist";
import { canDispensePrescription } from "@/lib/pharmacist/pharmacistStatus";
import { PharmacistDispensingForm } from "./PharmacistDispensingForm";
import { PharmacistPrescriptionItemsList } from "./PharmacistPrescriptionItemsList";
import { PharmacistPrescriptionStatusBadge } from "./PharmacistPrescriptionStatusBadge";

export interface PharmacistScannedPrescriptionPanelProps {
  scanResponse: PharmacistScanResponse;
  dispensedItems?: PharmacistPrescriptionItem[];
  onDispenseComplete?: (result: PharmacistDispensePrescriptionResult) => void;
}

function formatDate(value?: string | null): string {
  if (!value) {
    return "-";
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function PharmacistScannedPrescriptionPanel({
  scanResponse,
  dispensedItems = [],
  onDispenseComplete,
}: PharmacistScannedPrescriptionPanelProps) {
  const { t } = useAppPreferences();
  const prescription = scanResponse.prescription;
  const status = prescription?.status ?? "issued";
  const pendingItems = scanResponse.remaining_items ?? [];
  const isLocked = scanResponse.locked === true;
  const isDispensable = canDispensePrescription(status) && !isLocked;

  return (
    <Card className="space-y-6 rounded-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.pharmacist.scannedPrescription}</h2>
          {scanResponse.message ? (
            <p className="mt-1 text-sm text-[var(--color-muted)]">{scanResponse.message}</p>
          ) : null}
        </div>
        <PharmacistPrescriptionStatusBadge status={status} />
      </div>

      {isLocked ? (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 text-sm text-[var(--color-muted)]">
          {t.pharmacist.lockedPrescriptionNotice}
        </div>
      ) : null}

      <div className="grid gap-4 rounded-xl border border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)] sm:grid-cols-2">
        <div>
          <span className="font-medium">ID:</span> {prescription.id ?? "-"}
        </div>
        <div>
          <span className="font-medium">{t.pharmacist.prescriptionStatus}:</span> {status}
        </div>
        <div>
          <span className="font-medium">{t.pharmacist.doctorInfo}:</span> {prescription.doctor?.full_name ?? "-"}
        </div>
        <div>
          <span className="font-medium">{t.pharmacist.issuedAt}:</span> {formatDate(prescription.issued_at)}
        </div>
        <div>
          <span className="font-medium">{t.pharmacist.prescriptionExpiresAt}:</span> {formatDate(prescription.expires_at)}
        </div>
      </div>

      {/* Dispensed items section */}
      {dispensedItems.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--color-text)]">{t.pharmacist.dispensedItems}</h3>
            <Badge tone="success">{dispensedItems.length}</Badge>
          </div>
          <div className="space-y-2">
            {dispensedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2"
              >
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {item.medication_name || "-"}
                  {item.strength ? (
                    <span className="ml-1 font-normal text-[var(--color-muted)]">{item.strength}</span>
                  ) : null}
                </span>
                <Badge tone="success">{t.pharmacist.statusDispensed}</Badge>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Pending items or dispensing form */}
      {isDispensable && onDispenseComplete ? (
        <PharmacistDispensingForm
          prescriptionId={prescription.id ?? ""}
          prescriptionStatus={status}
          items={pendingItems}
          locked={isLocked}
          onSuccess={onDispenseComplete}
        />
      ) : (
        <PharmacistPrescriptionItemsList items={pendingItems} locked={isLocked} />
      )}

      {/* Privacy notice */}
      <p className="text-xs text-[var(--color-muted)]">
        {t.pharmacist.patientDoesNotSeeInternalNotes}
      </p>
    </Card>
  );
}
