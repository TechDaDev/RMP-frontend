import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LaboratoryInfoRow } from "@/components/laboratory/ui/LaboratoryInfoRow";
import { getLabResultStatusTone } from "@/lib/laboratory/laboratoryStatus";
import type { LaboratoryResultDetail } from "@/types/laboratory";

interface LaboratoryResultDetailPanelProps {
  result: LaboratoryResultDetail;
  canCorrect: boolean;
  isApproved: boolean;
}

export function LaboratoryResultDetailPanel({
  result,
  canCorrect,
  isApproved,
}: LaboratoryResultDetailPanelProps) {
  const { t } = useAppPreferences();

  const renderResultValue = () => {
    switch (result.value_type) {
      case "numeric":
        return (
          <DashboardGrid columns="two">
            <LaboratoryInfoRow
              label={t.laboratory.resultValue}
              value={
                <span>
                  {result.numeric_value}
                  {result.unit ? <span className="block text-xs font-normal text-[var(--color-muted)]">{result.unit}</span> : null}
                </span>
              }
            />
            {result.reference_range && (
              <LaboratoryInfoRow label={t.laboratory.referenceRange} value={result.reference_range} muted />
            )}
          </DashboardGrid>
        );
      case "text":
        return (
          <LaboratoryInfoRow label={t.laboratory.resultValue} value={result.text_value} />
        );
      case "blood_group":
        return (
          <LaboratoryInfoRow label={t.laboratory.bloodGroup} value={result.blood_group_value} />
        );
      case "positive_negative":
        return (
          <LaboratoryInfoRow label={t.laboratory.resultValue} value={result.text_value} />
        );
      case "file_only":
        return (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">{t.laboratory.resultFile}</p>
            {result.result_file ? (
              <a
                href={result.result_file}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                {t.laboratory.downloadFile}
              </a>
            ) : (
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {t.laboratory.noFileUploaded}
              </p>
            )}
          </div>
        );
      default:
        return <LaboratoryInfoRow label={t.laboratory.resultValue} value={t.laboratory.valueTypeNotSupported} muted />;
    }
  };

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          {t.laboratory.labResultDetail}
        </h2>
        <Badge tone={getLabResultStatusTone(result.status || "submitted")}>
          {result.status || "submitted"}
        </Badge>
      </div>

      <DashboardGrid columns="two">
        <LaboratoryInfoRow label="ID" value={result.id} mono />
        <LaboratoryInfoRow label={t.laboratory.resultValueType} value={result.value_type || "—"} />
      </DashboardGrid>

      <div className="border-t border-[var(--color-border)] pt-4">
        <p className="mb-3 text-xs font-medium uppercase text-[var(--color-muted)]">
          {t.laboratory.currentResult}
        </p>
        {renderResultValue()}
      </div>

      {result.laboratorian_notes && (
        <div className="border-t border-[var(--color-border)] pt-4">
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
            {t.laboratory.labNotes}
          </p>
          <p className="mt-2 text-sm text-[var(--color-text)]">{result.laboratorian_notes}</p>
        </div>
      )}

      {result.flag && (
        <LaboratoryInfoRow label={t.laboratory.flag} value={result.flag} />
      )}

      <p className="text-sm text-[var(--color-muted)]">
        {t.laboratory.doctorReviewNext}
      </p>

      {canCorrect && isApproved && (
        <Link href={`/app/lab/results/${result.id}/correct`} className="block">
          <Button variant="primary" className="w-full">
            {t.laboratory.correctLabResult}
          </Button>
        </Link>
      )}
    </Card>
  );
}
