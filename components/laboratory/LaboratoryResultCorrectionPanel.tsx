import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
    <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          {t.laboratory.labResultCorrected || "Result Corrected"}
        </h2>
        <Badge tone="success">{result.status || "corrected"}</Badge>
      </div>

      <p className="text-sm text-[var(--color-muted)]">
        {t.laboratory.correctedResultSummary || "Your correction has been submitted successfully"}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">ID</p>
          <p className="mt-1 text-sm font-mono text-[var(--color-text)]">{result.id}</p>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
            {t.laboratory.status || "Status"}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text)]">{result.status || "corrected"}</p>
        </div>
      </div>

      <p className="text-sm text-[var(--color-muted)]">
        {t.laboratory.doctorReviewNext || "Doctor will review the corrected result"}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={`/app/lab/results/${resultId}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            {t.laboratory.viewCorrectedResult || "View Result"}
          </Button>
        </Link>
        <Link href="/app/lab" className="flex-1">
          <Button variant="secondary" className="w-full">
            {t.laboratory.backToLabDashboard || "Back to Lab Dashboard"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
