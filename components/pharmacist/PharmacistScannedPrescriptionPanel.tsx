import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PharmacistInfoRow } from "@/components/pharmacist/ui/PharmacistInfoRow";
import { PharmacistListCard } from "@/components/pharmacist/ui/PharmacistListCard";
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
  const localizedMessage =
    scanResponse.message === "This prescription is no longer available for dispensing."
      ? t.pharmacist.lockedPrescriptionNotice
      : scanResponse.message;

  return (
    <div className="space-y-6">
      <Card className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[var(--color-text)]">{t.pharmacist.scannedPrescription}</h2>
            {localizedMessage ? (
              <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">{localizedMessage}</p>
            ) : null}
          </div>
          <PharmacistPrescriptionStatusBadge status={status} />
        </div>

        {isLocked ? (
          <DashboardStateCard state="empty" title={t.pharmacist.lockedPrescriptionNotice} description={t.pharmacist.cannotDispenseLockedPrescription} />
        ) : null}

        <DashboardGrid columns="two">
          <PharmacistInfoRow label="ID" value={prescription.id ?? "-"} mono />
          <PharmacistInfoRow label={t.pharmacist.prescriptionStatus} value={status} />
          <PharmacistInfoRow label={t.pharmacist.doctorInfo} value={prescription.doctor?.full_name ?? "-"} />
          <PharmacistInfoRow label={t.pharmacist.issuedAt} value={formatDate(prescription.issued_at)} muted />
          <PharmacistInfoRow label={t.pharmacist.prescriptionExpiresAt} value={formatDate(prescription.expires_at)} muted />
        </DashboardGrid>
      </Card>

      {dispensedItems.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--color-text)]">{t.pharmacist.dispensedItems}</h3>
            <Badge tone="success">{dispensedItems.length}</Badge>
          </div>
          <div className="space-y-2">
            {dispensedItems.map((item) => (
              <PharmacistListCard
                key={item.id}
                title={item.medication_name || "-"}
                meta={item.strength}
                badge={<Badge tone="success">{t.pharmacist.statusDispensed}</Badge>}
              >
                <p className="text-sm leading-7 text-[var(--color-muted)]">{t.pharmacist.dispensingAuditedNotice}</p>
              </PharmacistListCard>
            ))}
          </div>
        </div>
      ) : null}

      {isDispensable && onDispenseComplete ? (
        <PharmacistDispensingForm
          key={`${status}-${isLocked ? "locked" : "open"}-${pendingItems.map((item) => item.id).join("-")}`}
          prescriptionId={prescription.id ?? ""}
          prescriptionStatus={status}
          items={pendingItems}
          locked={isLocked}
          onSuccess={onDispenseComplete}
        />
      ) : (
        <PharmacistPrescriptionItemsList items={pendingItems} locked={isLocked} />
      )}

      <p className="text-xs text-[var(--color-muted)]">
        {t.pharmacist.patientDoesNotSeeInternalNotes}
      </p>
    </div>
  );
}
