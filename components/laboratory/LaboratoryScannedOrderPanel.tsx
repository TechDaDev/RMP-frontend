import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LaboratoryInfoRow } from "@/components/laboratory/ui/LaboratoryInfoRow";
import { LaboratoryOrderStatusBadge } from "./LaboratoryOrderStatusBadge";
import { LaboratoryOrderItemsList } from "./LaboratoryOrderItemsList";
import { localizeLaboratoryMessage } from "@/lib/laboratory/laboratoryErrorMessages";
import type { LaboratoryCompletionResult, LaboratoryOrderScanResponse } from "@/types/laboratory";

export interface LaboratoryScannedOrderPanelProps {
  scanResponse: LaboratoryOrderScanResponse;
  onItemCompleted: (
    result: LaboratoryCompletionResult,
    completedItemIds?: string[],
  ) => Promise<void> | void;
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
  const localizedMessage = localizeLaboratoryMessage(message, t);

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.scannedOrder}</h2>
              {localizedMessage && (
                <p className="mt-2 text-sm leading-7 text-[var(--color-info)]">{localizedMessage}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <LaboratoryOrderStatusBadge status={lab_order.status || "issued"} />
              {locked ? <Badge tone="neutral">{t.laboratory.orderLocked}</Badge> : null}
            </div>
          </div>

          <DashboardGrid columns="two">
            <LaboratoryInfoRow label={t.laboratory.orderStatus} value={lab_order.status || "—"} />

            {lab_order.expires_at && (
              <LaboratoryInfoRow label={t.laboratory.orderExpiresAt} value={formatDate(lab_order.expires_at)} muted />
            )}

            {lab_order.doctor && (
              <LaboratoryInfoRow
                label={t.laboratory.doctorInfo}
                value={lab_order.doctor.full_name || lab_order.doctor.email || "—"}
              />
            )}

            {lab_order.created_at && (
              <LaboratoryInfoRow label={t.patient.createdAt} value={formatDate(lab_order.created_at)} muted />
            )}
          </DashboardGrid>
        </div>
      </Card>

      <Card>
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

      {locked && (
        <DashboardStateCard
          state="empty"
          title={t.laboratory.orderLocked}
          description={localizedMessage || t.laboratory.ordersCannotBeModified}
        />
      )}
    </div>
  );
}
