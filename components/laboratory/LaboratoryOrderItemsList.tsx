import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import type { LaboratoryOrderItem } from "@/types/laboratory";

export interface LaboratoryOrderItemsListProps {
  remainingItems?: LaboratoryOrderItem[];
  completedItems?: LaboratoryOrderItem[];
}

function ItemRow({ item }: { item: LaboratoryOrderItem }) {
  const { t } = useAppPreferences();

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-[var(--color-border)] p-3">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[var(--color-text)]">{item.test_name || "—"}</h4>
        <div className="mt-2 grid gap-2 text-sm text-[var(--color-muted)]">
          {item.category && (
            <div>
              <span className="font-medium">{t.laboratory.testCategory}:</span> {item.category}
            </div>
          )}
          {item.sample_type && (
            <div>
              <span className="font-medium">{t.laboratory.sampleType}:</span> {item.sample_type}
            </div>
          )}
          {item.instructions && (
            <div>
              <span className="font-medium">{t.laboratory.instructions}:</span> {item.instructions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LaboratoryOrderItemsList({ remainingItems = [], completedItems = [] }: LaboratoryOrderItemsListProps) {
  const { t } = useAppPreferences();

  return (
    <div className="space-y-6">
      {remainingItems.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--color-text)]">{t.laboratory.pendingItems}</h3>
            <Badge tone="primary">{remainingItems.length}</Badge>
          </div>
          <div className="space-y-3">
            {remainingItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--color-muted)]">{t.laboratory.itemCompletionPhaseComing}</p>
        </div>
      )}

      {completedItems.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--color-text)]">{t.laboratory.completedItems}</h3>
            <Badge tone="success">{completedItems.length}</Badge>
          </div>
          <div className="space-y-3">
            {completedItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {remainingItems.length === 0 && completedItems.length === 0 && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 text-center">
          <p className="text-sm text-[var(--color-muted)]">{t.laboratory.noRemainingItems}</p>
        </div>
      )}
    </div>
  );
}
