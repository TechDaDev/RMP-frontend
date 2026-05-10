"use client";

import { useCallback, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ApiError } from "@/lib/api/errors";
import { dispensePrescription } from "@/lib/pharmacist/pharmacistService";
import { canDispensePrescription } from "@/lib/pharmacist/pharmacistStatus";
import type { PharmacistDispensePrescriptionResult, PharmacistPrescriptionItem } from "@/types/pharmacist";

interface ItemSelection {
  selected: boolean;
  status: "dispensed" | "unavailable";
  dispensed_quantity: string;
  note: string;
}

export interface PharmacistDispensingFormProps {
  prescriptionId: string;
  prescriptionStatus?: string;
  items: PharmacistPrescriptionItem[];
  locked?: boolean;
  onSuccess: (result: PharmacistDispensePrescriptionResult) => void;
}

export function PharmacistDispensingForm({
  prescriptionId,
  prescriptionStatus,
  items,
  locked = false,
  onSuccess,
}: PharmacistDispensingFormProps) {
  const { t } = useAppPreferences();

  const [selections, setSelections] = useState<Record<string, ItemSelection>>(() =>
    Object.fromEntries(
      items.map((item) => [
        item.id,
        { selected: false, status: "dispensed", dispensed_quantity: "", note: "" },
      ]),
    ),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDispense = canDispensePrescription(prescriptionStatus) && !locked;

  const toggleItem = useCallback((id: string) => {
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], selected: !prev[id].selected },
    }));
  }, []);

  const setItemStatus = useCallback((id: string, status: "dispensed" | "unavailable") => {
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], status },
    }));
  }, []);

  const setItemField = useCallback(
    (id: string, field: "dispensed_quantity" | "note", value: string) => {
      setSelections((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: value },
      }));
    },
    [],
  );

  const selectedCount = items.filter((item) => selections[item.id]?.selected).length;

  const handleSubmit = useCallback(async () => {
    if (selectedCount === 0) {
      setError(t.pharmacist.selectAtLeastOneItem);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const itemsPayload = items
        .filter((item) => selections[item.id]?.selected)
        .map((item) => {
          const sel = selections[item.id];
          return {
            prescription_item_id: item.id,
            status: sel.status,
            ...(sel.dispensed_quantity ? { dispensed_quantity: sel.dispensed_quantity } : {}),
            ...(sel.note ? { note: sel.note } : {}),
          };
        });

      const result = await dispensePrescription(prescriptionId, { items: itemsPayload });
      onSuccess(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || t.pharmacist.dispensingFailed);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t.pharmacist.dispensingFailed);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCount, items, selections, prescriptionId, onSuccess, t.pharmacist]);

  if (!canDispense) {
    return (
      <DashboardStateCard
        state="empty"
        title={t.pharmacist.lockedPrescriptionNotice}
        description={locked
          ? t.pharmacist.cannotDispenseLockedPrescription
          : prescriptionStatus === "cancelled"
            ? t.pharmacist.cannotDispenseCancelledPrescription
            : prescriptionStatus === "expired"
              ? t.pharmacist.cannotDispenseExpiredPrescription
              : t.pharmacist.cannotDispenseFullyDispensedPrescription}
      />
    );
  }

  if (items.length === 0) {
    return (
      <DashboardStateCard
        state="empty"
        title={t.pharmacist.noPendingItems}
        description={t.pharmacist.noDispensableItems}
      />
    );
  }

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          {t.pharmacist.dispensePrescriptionTitle}
        </h3>
        <Badge tone={selectedCount > 0 ? "primary" : "neutral"}>
          {selectedCount} / {items.length}
        </Badge>
      </div>

      <p className="text-sm leading-7 text-[var(--color-muted)]">{t.pharmacist.dispensePrescriptionDescription}</p>

      <div className="space-y-3">
        {items.map((item) => {
          const sel = selections[item.id];
          if (!sel) return null;

          return (
            <div
              key={item.id}
              className={[
                "rounded-xl border p-4 transition",
                sel.selected
                  ? "border-[var(--color-primary)] bg-[color:color-mix(in_srgb,var(--color-primary)_5%,transparent)]"
                  : "border-[var(--color-border)]",
              ].join(" ")}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  name={`dispense-item-${item.id}`}
                  type="checkbox"
                  checked={sel.selected}
                  onChange={() => toggleItem(item.id)}
                  className="mt-0.5 size-4 cursor-pointer rounded accent-[var(--color-primary)]"
                />
                <div className="min-w-0 flex-1">
                  <span className="block font-semibold text-[var(--color-text)]">
                    {item.medication_name || "-"}
                    {item.strength ? (
                      <span className="ml-1 text-sm font-normal text-[var(--color-muted)]">
                        {item.strength}
                      </span>
                    ) : null}
                  </span>
                  {item.dosage || item.quantity ? (
                    <span className="text-xs text-[var(--color-muted)]">
                      {[item.dosage, item.quantity].filter(Boolean).join(" · ")}
                    </span>
                  ) : null}
                </div>
              </label>

              {sel.selected ? (
                <div className="mt-3 space-y-3 ps-7">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setItemStatus(item.id, "dispensed")}
                      className={[
                        "rounded-xl border px-3 py-1.5 text-xs font-medium transition",
                        sel.status === "dispensed"
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                          : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]",
                      ].join(" ")}
                    >
                      {t.pharmacist.statusDispensed}
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemStatus(item.id, "unavailable")}
                      className={[
                        "rounded-xl border px-3 py-1.5 text-xs font-medium transition",
                        sel.status === "unavailable"
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-orange-500",
                      ].join(" ")}
                    >
                      {t.pharmacist.statusUnavailable}
                    </button>
                  </div>

                  <label className="block space-y-1">
                    <span className="text-xs text-[var(--color-muted)]">
                      {t.pharmacist.quantityToDispense}
                    </span>
                    <input
                      name={`dispensed-quantity-${item.id}`}
                      type="text"
                      autoComplete="off"
                      value={sel.dispensed_quantity}
                      onChange={(e) => setItemField(item.id, "dispensed_quantity", e.target.value)}
                      placeholder={item.quantity || ""}
                      className="min-h-9 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs text-[var(--color-muted)]">
                      {t.pharmacist.itemDispensingNote}
                    </span>
                    <input
                      name={`dispensing-note-${item.id}`}
                      type="text"
                      autoComplete="off"
                      value={sel.note}
                      onChange={(e) => setItemField(item.id, "note", e.target.value)}
                      className="min-h-9 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                    />
                  </label>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {error ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300" aria-live="polite">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1 text-xs text-[var(--color-muted)]">{t.pharmacist.dispensingAuditedNotice}</p>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedCount === 0}
          className="w-full sm:w-auto sm:shrink-0"
        >
          {isSubmitting
            ? t.pharmacist.dispensingSelectedItems
            : `${t.pharmacist.confirmDispense} (${selectedCount})`}
        </Button>
      </div>
    </Card>
  );
}
