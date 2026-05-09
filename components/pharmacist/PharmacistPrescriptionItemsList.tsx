import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
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
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 text-sm text-[var(--color-muted)]">
          {t.pharmacist.cannotDispenseLockedPrescription}
        </div>
      ) : null}

      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">{t.pharmacist.noPendingItems}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[var(--color-border)] p-4"
            >
              <h4 className="font-semibold text-[var(--color-text)]">{item.medication_name || "-"}</h4>
              <div className="mt-2 grid gap-2 text-sm text-[var(--color-muted)]">
                <ValueRow label={t.pharmacist.dosage} value={item.dosage} />
                <ValueRow label={t.pharmacist.frequency} value={item.frequency} />
                <ValueRow label={t.pharmacist.duration} value={item.duration} />
                <ValueRow label={t.pharmacist.route} value={item.route} />
                <ValueRow label={t.pharmacist.instructions} value={item.instructions} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
