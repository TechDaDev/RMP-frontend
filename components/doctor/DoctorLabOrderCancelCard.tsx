"use client";

import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DoctorLabOrderDetail } from "@/types/doctor";

interface DoctorLabOrderCancelCardProps {
  labOrder: DoctorLabOrderDetail;
  onCancel: () => Promise<void>;
}

const LOCKED_STATUSES = new Set(["cancelled", "fully_completed", "expired"]);

export function DoctorLabOrderCancelCard({ labOrder, onCancel }: DoctorLabOrderCancelCardProps) {
  const { t } = useAppPreferences();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hasCompletedItem = (labOrder.items ?? []).some((item) => item.status === "completed");
  const canCancel = !LOCKED_STATUSES.has(labOrder.status ?? "") && !hasCompletedItem;

  async function handleCancel() {
    if (!canCancel || loading) {
      return;
    }

    const confirmed = window.confirm(t.doctor.confirmCancelLabOrder);
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await onCancel();
      setSuccess(t.doctor.labOrderCancelled);
    } catch {
      setError(t.doctor.labOrderCancelFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-3 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.cancelLabOrder}</h3>
      <p className="text-sm text-[var(--color-muted)]">{t.doctor.cancelLabOrderDescription}</p>

      {!canCancel ? (
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">{t.doctor.cannotCancelLabOrder}</p>
      ) : null}

      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}
      {success ? <p className="text-sm font-medium text-green-600 dark:text-green-300">{success}</p> : null}

      <Button variant="secondary" disabled={!canCancel || loading} onClick={() => void handleCancel()}>
        {loading ? t.doctor.submittingLabOrder : t.doctor.cancelLabOrder}
      </Button>
    </Card>
  );
}
