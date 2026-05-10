import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LaboratoryInfoRow } from "@/components/laboratory/ui/LaboratoryInfoRow";
import { canCorrectResult } from "@/lib/laboratory/laboratoryStatus";
import type { LaboratoryResultDetail } from "@/types/laboratory";

interface LaboratoryResultCreatedPanelProps {
  result: LaboratoryResultDetail;
  backToScanHref: string;
}

export function LaboratoryResultCreatedPanel({ result, backToScanHref }: LaboratoryResultCreatedPanelProps) {
  const { t } = useAppPreferences();
  const canCorrect = result.status ? canCorrectResult(result.status) : false;

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.labResultCreated}</h2>
        <Badge tone="success">{result.status || "submitted"}</Badge>
      </div>

      <p className="text-sm text-[var(--color-muted)]">{t.laboratory.createdResultSummary}</p>

      <DashboardGrid columns="two">
        <LaboratoryInfoRow label="ID" value={result.id} mono />
        <LaboratoryInfoRow label={t.laboratory.resultValueType} value={result.value_type || "—"} />
      </DashboardGrid>

      <p className="text-sm text-[var(--color-muted)]">{t.laboratory.doctorReviewNext}</p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href={`/app/lab/results/${result.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            {t.laboratory.viewLabResult}
          </Button>
        </Link>
        {canCorrect && (
          <Link href={`/app/lab/results/${result.id}/correct`} className="flex-1">
            <Button variant="secondary" className="w-full">
              {t.laboratory.correctLabResult}
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={backToScanHref} className="flex-1">
          <Button className="w-full">{t.laboratory.backToScan}</Button>
        </Link>
        <Link href="/app/lab" className="flex-1">
          <Button variant="secondary" className="w-full">{t.laboratory.backToLabDashboard}</Button>
        </Link>
      </div>
    </Card>
  );
}
