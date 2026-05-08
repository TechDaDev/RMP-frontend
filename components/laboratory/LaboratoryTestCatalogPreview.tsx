import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileTextIcon } from "@/components/icons";
import type { LaboratoryTestCatalogItem } from "@/types/laboratory";

interface LaboratoryTestCatalogPreviewProps {
  items: LaboratoryTestCatalogItem[];
  loading?: boolean;
  error?: string | null;
}

export function LaboratoryTestCatalogPreview({ items, loading = false, error = null }: LaboratoryTestCatalogPreviewProps) {
  const { t } = useAppPreferences();
  const visibleItems = items.slice(0, 4);

  return (
    <Card className="rounded-[2rem]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.testCatalogPreview}</h2>
          <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">{t.laboratory.workflowStartsWithQr}</p>
        </div>
        <Badge tone="primary">{String(items.length)}</Badge>
      </div>

      {loading ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)]" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-5 rounded-2xl border border-[color:color-mix(in_srgb,var(--color-primary)_20%,var(--color-border))] bg-[color:color-mix(in_srgb,var(--color-primary)_6%,var(--color-surface))] p-4 text-sm leading-7 text-[var(--color-muted)]">
          {error}
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={<FileTextIcon size={20} />}
            title={t.laboratory.noLabTestsAvailable}
            description={t.laboratory.labPrivacyNotice}
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visibleItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-text)]">{item.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">{item.category || t.laboratory.testCategory}</p>
                </div>
                <Badge tone={item.is_active === false ? "neutral" : "success"}>{item.code || item.id.slice(0, 6)}</Badge>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {item.description || item.default_instructions || t.laboratory.workflowStartsWithQr}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--color-muted)]">
                {item.default_sample_type ? <span>{item.default_sample_type}</span> : null}
                {item.display_order !== undefined ? <span>#{item.display_order}</span> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
