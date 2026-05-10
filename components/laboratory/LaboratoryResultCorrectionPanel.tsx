import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LaboratoryInfoRow } from "@/components/laboratory/ui/LaboratoryInfoRow";
import type { LaboratoryResultDetail } from "@/types/laboratory";

interface LaboratoryResultCorrectionPanelProps {
  result: LaboratoryResultDetail;
  resultId: string;
}

export function LaboratoryResultCorrectionPanel({
  result,
  resultId,
}: LaboratoryResultCorrectionPanelProps) {
  const { t } = useAppPreferences();

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          {t.laboratory.labResultCorrected}
        </h2>
        <Badge tone="success">{result.status || "corrected"}</Badge>
      </div>

      <p className="text-sm text-[var(--color-muted)]">
        {t.laboratory.correctedResultSummary}
      </p>

      <DashboardGrid columns="two">
        <LaboratoryInfoRow label="ID" value={result.id} mono />
        <LaboratoryInfoRow label={t.laboratory.status} value={result.status || "corrected"} />
      </DashboardGrid>

      <p className="text-sm text-[var(--color-muted)]">
        {t.laboratory.doctorReviewNext}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={`/app/lab/results/${resultId}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            {t.laboratory.viewCorrectedResult}
          </Button>
        </Link>
        <Link href="/app/lab" className="flex-1">
          <Button variant="secondary" className="w-full">
            {t.laboratory.backToLabDashboard}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
