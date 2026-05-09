import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { getPrescriptionStatusTone } from "@/lib/pharmacist/pharmacistStatus";
import type { PharmacistPrescriptionStatus } from "@/types/pharmacist";

export interface PharmacistPrescriptionStatusBadgeProps {
  status: PharmacistPrescriptionStatus;
}

export function PharmacistPrescriptionStatusBadge({ status }: PharmacistPrescriptionStatusBadgeProps) {
  const { t } = useAppPreferences();

  const labels: Record<string, string> = {
    issued: t.pharmacist.prescriptionIssued,
    partially_dispensed: t.pharmacist.prescriptionPartiallyDispensed,
    fully_dispensed: t.pharmacist.prescriptionFullyDispensed,
    expired: t.pharmacist.prescriptionExpired,
    cancelled: t.pharmacist.prescriptionCancelled,
  };

  return <Badge tone={getPrescriptionStatusTone(status)}>{labels[status] ?? status}</Badge>;
}
