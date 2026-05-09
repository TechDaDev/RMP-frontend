import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LaboratoryOrderStatusBadge } from "./LaboratoryOrderStatusBadge";
import { LaboratoryOrderItemsList } from "./LaboratoryOrderItemsList";
import type { LaboratoryCompletionResult, LaboratoryOrderScanResponse } from "@/types/laboratory";

export interface LaboratoryScannedOrderPanelProps {
  scanResponse: LaboratoryOrderScanResponse;
  onItemCompleted: (result: LaboratoryCompletionResult) => Promise<void> | void;
  completionDisabled?: boolean;
  resultActionDisabled?: boolean;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export function LaboratoryScannedOrderPanel({
  scanResponse,
  onItemCompleted,
  completionDisabled = false,
  resultActionDisabled = false,
}: LaboratoryScannedOrderPanelProps) {
  const { t } = useAppPreferences();
  const { lab_order, remaining_items, locked, message } = scanResponse;

  return (
    <div className="space-y-6">
      {/* Order Summary Card */}
      <Card className="rounded-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.scannedOrder}</h2>
            {message && (
              <p className="mt-2 text-sm text-[var(--color-info)]">{message}</p>
            )}
          </div>

          {/* Status and Lock Warning */}
          <div className="flex flex-wrap items-center gap-3">
            <LaboratoryOrderStatusBadge status={lab_order.status || "issued"} />
            {locked && (
              <Badge tone="neutral">{t.laboratory.orderLocked}</Badge>
            )}
          </div>

          {/* Order Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
              <p className="text-xs font-medium uppercase text-[var(--color-muted)]">{t.laboratory.orderStatus}</p>
              <p className="mt-2 text-sm text-[var(--color-text)]">{lab_order.status || "—"}</p>
            </div>

            {lab_order.expires_at && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
                <p className="text-xs font-medium uppercase text-[var(--color-muted)]">{t.laboratory.orderExpiresAt}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{formatDate(lab_order.expires_at)}</p>
              </div>
            )}

            {lab_order.doctor && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
                <p className="text-xs font-medium uppercase text-[var(--color-muted)]">{t.laboratory.doctorInfo}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{lab_order.doctor.full_name || lab_order.doctor.email || "—"}</p>
              </div>
            )}

            {lab_order.created_at && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
                  <p className="text-xs font-medium uppercase text-[var(--color-muted)]">{t.patient.createdAt}</p>
                <p className="mt-2 text-sm text-[var(--color-text)]">{formatDate(lab_order.created_at)}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Items List */}
      <Card className="rounded-2xl">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.labOrderItems}</h2>
          <LaboratoryOrderItemsList
            orderId={lab_order.id}
            orderStatus={lab_order.status}
            locked={locked}
            remainingItems={remaining_items}
            completedItems={lab_order.completed_items}
            onItemCompleted={onItemCompleted}
            completionDisabled={completionDisabled}
            resultActionDisabled={resultActionDisabled}
          />
        </div>
      </Card>

      {/* Locked Message */}
      {locked && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 text-center">
          <p className="text-sm font-semibold text-[var(--color-text)]">{t.laboratory.orderLocked}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{message || t.laboratory.ordersCannotBeModified}</p>
        </div>
      )}
    </div>
  );
}
