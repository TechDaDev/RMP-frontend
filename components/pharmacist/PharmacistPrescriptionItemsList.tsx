import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Badge } from "@/components/ui/Badge";
import { PharmacistListCard } from "@/components/pharmacist/ui/PharmacistListCard";
import type { PharmacistPrescriptionItem } from "@/types/pharmacist";

export interface PharmacistPrescriptionItemsListProps {
  items: PharmacistPrescriptionItem[];
  locked?: boolean;
}

function ValueRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <span className="font-medium">{label}:</span> {value}
    </div>
  );
}

export function PharmacistPrescriptionItemsList({
  items,
  locked = false,
}: PharmacistPrescriptionItemsListProps) {
  const { t } = useAppPreferences();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--color-text)]">{t.pharmacist.pendingItems}</h3>
        <Badge tone="primary">{items.length}</Badge>
      </div>

      {locked ? (
        <DashboardStateCard
          state="empty"
          title={t.pharmacist.lockedPrescriptionNotice}
          description={t.pharmacist.cannotDispenseLockedPrescription}
        />
      ) : null}

      {items.length === 0 ? (
        <DashboardStateCard
          state="empty"
          title={t.pharmacist.noPendingItems}
          description={t.pharmacist.noDispensableItems}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <PharmacistListCard
              key={item.id}
              title={item.medication_name || "-"}
              meta={item.strength}
              badge={<Badge tone="primary">{t.pharmacist.prescriptionIssued}</Badge>}
            >
              <div className="mt-2 grid gap-2 text-sm text-[var(--color-muted)]">
                <ValueRow label={t.pharmacist.dosage} value={item.dosage} />
                <ValueRow label={t.pharmacist.frequency} value={item.frequency} />
                <ValueRow label={t.pharmacist.duration} value={item.duration} />
                <ValueRow label={t.pharmacist.route} value={item.route} />
                <ValueRow label={t.pharmacist.instructions} value={item.instructions} />
              </div>
            </PharmacistListCard>
          ))}
        </div>
      )}
    </div>
  );
}
