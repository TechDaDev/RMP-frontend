import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Card } from "@/components/ui/Card";
import type { PharmacistScanResponse } from "@/types/pharmacist";
import { PharmacistPrescriptionItemsList } from "./PharmacistPrescriptionItemsList";
import { PharmacistPrescriptionStatusBadge } from "./PharmacistPrescriptionStatusBadge";

export interface PharmacistScannedPrescriptionPanelProps {
  scanResponse: PharmacistScanResponse;
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
}: PharmacistScannedPrescriptionPanelProps) {
  const { t } = useAppPreferences();
  const prescription = scanResponse.prescription;
  const status = prescription?.status ?? "issued";
  const items = scanResponse.remaining_items ?? [];

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

      {scanResponse.locked ? (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 text-sm text-[var(--color-muted)]">
          {t.pharmacist.lockedPrescriptionNotice}
        </div>
      ) : null}

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 text-sm text-[var(--color-muted)]">
        {t.pharmacist.dispensingDeferredNotice}
      </div>

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

      <PharmacistPrescriptionItemsList items={items} locked={scanResponse.locked} />
    </Card>
  );
}
