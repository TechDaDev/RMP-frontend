import { isLabOrderLocked } from "@/lib/laboratory/laboratoryStatus";
import type {
  LaboratoryCompletionResult,
  LaboratoryOrderItem,
  LaboratoryOrderScanResponse,
} from "@/types/laboratory";

interface NormalizeScannedOrderStateInput {
  previousScan: LaboratoryOrderScanResponse;
  completionResponse: LaboratoryCompletionResult;
  rescanResponse?: LaboratoryOrderScanResponse | null;
  completedItemIds?: string[];
}

function uniqueItemsById(items: LaboratoryOrderItem[]): LaboratoryOrderItem[] {
  const byId = new Map<string, LaboratoryOrderItem>();

  items.forEach((item) => {
    if (!item?.id) {
      return;
    }

    const previous = byId.get(item.id);
    if (!previous) {
      byId.set(item.id, item);
      return;
    }

    byId.set(item.id, { ...previous, ...item });
  });

  return Array.from(byId.values());
}

function maybeArray<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) ? (value as T[]) : undefined;
}

export function normalizeScannedOrderState({
  previousScan,
  completionResponse,
  rescanResponse,
  completedItemIds = [],
}: NormalizeScannedOrderStateInput): LaboratoryOrderScanResponse {
  const completionRemaining = maybeArray<LaboratoryOrderItem>(completionResponse.remaining_items);
  const rescanRemaining = maybeArray<LaboratoryOrderItem>(rescanResponse?.remaining_items);

  const nextRemainingBase =
    rescanRemaining ?? completionRemaining ?? previousScan.remaining_items;

  const completionCompletedTop = maybeArray<LaboratoryOrderItem>(completionResponse.completed_items);
  const completionCompletedNested = maybeArray<LaboratoryOrderItem>(
    completionResponse.lab_order?.completed_items,
  );
  const rescanCompletedNested = maybeArray<LaboratoryOrderItem>(
    rescanResponse?.lab_order?.completed_items,
  );

  const completedIdSet = new Set<string>(completedItemIds.filter(Boolean));
  const nextRemainingIds = new Set(nextRemainingBase.map((item) => item.id));

  const inferredFromRemoval = previousScan.remaining_items.filter(
    (item) => item.id && !nextRemainingIds.has(item.id),
  );
  inferredFromRemoval.forEach((item) => {
    if (item.id) {
      completedIdSet.add(item.id);
    }
  });

  const inferredFromIds = previousScan.remaining_items.filter(
    (item) => item.id && completedIdSet.has(item.id),
  );

  const completedCandidates = uniqueItemsById([
    ...(previousScan.lab_order.completed_items ?? []),
    ...(completionCompletedTop ?? []),
    ...(completionCompletedNested ?? []),
    ...(rescanCompletedNested ?? []),
    ...inferredFromRemoval,
    ...inferredFromIds,
  ]);

  const completedIds = new Set(completedCandidates.map((item) => item.id));
  const normalizedRemaining = nextRemainingBase.filter((item) => !completedIds.has(item.id));

  const status =
    rescanResponse?.lab_order?.status ??
    completionResponse.lab_order?.status ??
    previousScan.lab_order.status;

  const locked =
    rescanResponse?.locked ??
    completionResponse.locked ??
    (status ? isLabOrderLocked(status) : previousScan.locked);

  return {
    lab_order: {
      ...previousScan.lab_order,
      ...completionResponse.lab_order,
      ...rescanResponse?.lab_order,
      status,
      completed_items: completedCandidates,
    },
    remaining_items: normalizedRemaining,
    locked,
    message:
      rescanResponse?.message ??
      completionResponse.message ??
      previousScan.message,
  };
}