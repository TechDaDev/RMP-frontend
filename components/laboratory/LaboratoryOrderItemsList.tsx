import type { ReactNode } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LaboratoryListCard } from "@/components/laboratory/ui/LaboratoryListCard";
import { canCompleteLabOrder, canCreateResultForItem } from "@/lib/laboratory/laboratoryStatus";
import type { LaboratoryCompletionResult, LaboratoryOrderItem } from "@/types/laboratory";
import { LaboratoryCompleteItemButton } from "./LaboratoryCompleteItemButton";

export interface LaboratoryOrderItemsListProps {
  orderId: string;
  orderStatus?: string;
  locked?: boolean;
  remainingItems?: LaboratoryOrderItem[];
  completedItems?: LaboratoryOrderItem[];
  onItemCompleted: (
    result: LaboratoryCompletionResult,
    completedItemIds?: string[],
  ) => Promise<void> | void;
  completionDisabled?: boolean;
  resultActionDisabled?: boolean;
}

function getItemResultId(item: LaboratoryOrderItem): string | null {
  if (item.result_id) {
    return item.result_id;
  }

  if (item.lab_result_id) {
    return item.lab_result_id;
  }

  if (item.lab_result?.id) {
    return item.lab_result.id;
  }

  return null;
}

function hasResultMarker(item: LaboratoryOrderItem): boolean {
  return "result_id" in item || "lab_result_id" in item || "lab_result" in item;
}

function formatItemDate(dateString?: string | null): string {
  if (!dateString) {
    return "—";
  }

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

function ItemRow({ item, action }: { item: LaboratoryOrderItem; action?: ReactNode }) {
  const { t } = useAppPreferences();

  return (
    <LaboratoryListCard
      title={item.test_name || "—"}
      badge={<Badge tone={item.status === "completed" ? "success" : "primary"}>{item.status || "pending"}</Badge>}
      action={action ? <div className="min-w-0 lg:min-w-40">{action}</div> : undefined}
    >
      <div className="grid gap-2 text-sm leading-7 text-[var(--color-muted)]">
        {item.category ? (
          <p>
            <span className="font-semibold text-[var(--color-text)]">{t.laboratory.testCategory}:</span> {item.category}
          </p>
        ) : null}
        {item.sample_type ? (
          <p>
            <span className="font-semibold text-[var(--color-text)]">{t.laboratory.sampleType}:</span> {item.sample_type}
          </p>
        ) : null}
        {item.instructions ? (
          <p>
            <span className="font-semibold text-[var(--color-text)]">{t.laboratory.instructions}:</span> {item.instructions}
          </p>
        ) : null}
        {item.completed_at ? (
          <p>
            <span className="font-semibold text-[var(--color-text)]">{t.laboratory.completedAt}:</span> {formatItemDate(item.completed_at)}
          </p>
        ) : null}
      </div>
    </LaboratoryListCard>
  );
}

export function LaboratoryOrderItemsList({
  orderId,
  orderStatus,
  locked = false,
  remainingItems = [],
  completedItems = [],
  onItemCompleted,
  completionDisabled = false,
  resultActionDisabled = false,
}: LaboratoryOrderItemsListProps) {
  const { t } = useAppPreferences();
  const canComplete = !locked && canCompleteLabOrder(orderStatus ?? "issued");

  return (
    <div className="space-y-6">
      {locked ? (
        <DashboardStateCard
          state="empty"
          title={t.laboratory.orderLocked}
          description={t.laboratory.cannotCompleteLockedOrder}
        />
      ) : null}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[var(--color-text)]">{t.laboratory.pendingItems}</h3>
          <Badge tone="primary">{remainingItems.length}</Badge>
        </div>
        {remainingItems.length > 0 ? (
          <div className="space-y-3">
            {remainingItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                action={canComplete ? (
                  <LaboratoryCompleteItemButton
                    orderId={orderId}
                    item={item}
                    disabled={completionDisabled}
                    onCompleted={onItemCompleted}
                  />
                ) : undefined}
              />
            ))}
          </div>
        ) : (
          <DashboardStateCard
            state="empty"
            title={t.laboratory.noRemainingItems}
            description={t.laboratory.resultCreationStillDeferred}
          />
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[var(--color-text)]">{t.laboratory.completedItems}</h3>
          <Badge tone="success">{completedItems.length}</Badge>
        </div>
        {completedItems.length > 0 ? (
          <div className="space-y-3">
            {completedItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                action={(() => {
                  const existingResultId = getItemResultId(item);

                  if (existingResultId) {
                    return (
                      <div className="space-y-2">
                        <p className="text-xs text-[var(--color-muted)]">{t.laboratory.resultAlreadySubmitted}</p>
                        <Link href={`/app/lab/results/${existingResultId}`}>
                          <Button variant="secondary" className="w-full">{t.laboratory.createResult}</Button>
                        </Link>
                      </div>
                    );
                  }

                  if (hasResultMarker(item)) {
                    return (
                      <p className="text-xs text-[var(--color-muted)]">{t.laboratory.resultAlreadySubmitted}</p>
                    );
                  }

                  if (!canCreateResultForItem(item.status ?? "completed", orderStatus)) {
                    return (
                      <p className="text-xs text-[var(--color-muted)]">{t.laboratory.resultCreationUnavailable}</p>
                    );
                  }

                  if (resultActionDisabled) {
                    return (
                      <Button className="w-full" disabled>
                        {t.laboratory.createLabResult}
                      </Button>
                    );
                  }

                  return (
                    <Link href={`/app/lab/items/${item.id}/results/new?orderId=${orderId}`}>
                      <Button className="w-full">
                        {t.laboratory.createLabResult}
                      </Button>
                    </Link>
                  );
                })()}
              />
            ))}
          </div>
        ) : (
          <DashboardStateCard
            state="empty"
            title={t.laboratory.noCompletedItems}
            description={t.laboratory.noCompletedItems}
          />
        )}
      </div>

      {remainingItems.length === 0 && completedItems.length === 0 && (
        <DashboardStateCard
          state="empty"
          title={t.laboratory.noRemainingItems}
          description={t.laboratory.noCompletedItems}
        />
      )}
    </div>
  );
}
