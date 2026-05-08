import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { LaboratoryResultDetail } from "@/types/laboratory";

interface LaboratoryResultCreatedPanelProps {
  result: LaboratoryResultDetail;
  backToScanHref: string;
}

export function LaboratoryResultCreatedPanel({ result, backToScanHref }: LaboratoryResultCreatedPanelProps) {
  const { t } = useAppPreferences();

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.labResultCreated}</h2>
        <Badge tone="success">{result.status || "submitted"}</Badge>
      </div>

      <p className="text-sm text-[var(--color-muted)]">{t.laboratory.createdResultSummary}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">ID</p>
          <p className="mt-1 text-sm text-[var(--color-text)]">{result.id}</p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">{t.laboratory.resultValueType}</p>
          <p className="mt-1 text-sm text-[var(--color-text)]">{result.value_type || "—"}</p>
        </div>
      </div>

      <p className="text-sm text-[var(--color-muted)]">{t.laboratory.doctorReviewNext}</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={backToScanHref} className="flex-1">
          <Button className="w-full">{t.laboratory.backToScan}</Button>
        </Link>
        <Link href="/app/lab" className="flex-1">
          <Button variant="secondary" className="w-full">{t.laboratory.backToLabDashboard}</Button>
        </Link>
      </div>
    </div>
  );
}
