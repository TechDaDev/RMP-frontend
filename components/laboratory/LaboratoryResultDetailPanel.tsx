import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
              <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
                {t.laboratory.resultValue || "Value"}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                {result.numeric_value}
              </p>
              {result.unit && (
                <p className="text-xs text-[var(--color-muted)]">{result.unit}</p>
              )}
            </div>
            {result.reference_range && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
                <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
                  {t.laboratory.referenceRange || "Reference Range"}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text)]">{result.reference_range}</p>
              </div>
            )}
          </div>
        );
      case "text":
        return (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
              {t.laboratory.resultValue || "Value"}
            </p>
            <p className="mt-2 text-sm text-[var(--color-text)]">{result.text_value}</p>
          </div>
        );
      case "blood_group":
        return (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
              {t.laboratory.bloodGroup || "Blood Group"}
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">
              {result.blood_group_value}
            </p>
          </div>
        );
      case "positive_negative":
        return (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
              {t.laboratory.resultValue || "Value"}
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">
              {result.text_value}
            </p>
          </div>
        );
      case "file_only":
        return (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
              {t.laboratory.resultFile || "File"}
            </p>
            {result.result_file ? (
              <a
                href={result.result_file}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                {t.laboratory.downloadFile || "Download File"}
              </a>
            ) : (
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {t.laboratory.noFileUploaded || "No file uploaded"}
              </p>
            )}
          </div>
        );
      default:
        return (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
            <p className="text-sm text-[var(--color-muted)]">{t.laboratory.valueTypeNotSupported || "Value type not supported"}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          {t.laboratory.labResultDetail || "Lab Result"}
        </h2>
        <Badge tone={getLabResultStatusTone(result.status || "submitted")}>
          {result.status || "submitted"}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">ID</p>
          <p className="mt-1 text-sm font-mono text-[var(--color-text)]">{result.id}</p>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
            {t.laboratory.resultValueType || "Value Type"}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text)]">{result.value_type || "—"}</p>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-4">
        <p className="mb-3 text-xs font-medium uppercase text-[var(--color-muted)]">
          {t.laboratory.currentResult || "Current Result"}
        </p>
        {renderResultValue()}
      </div>

      {result.laboratorian_notes && (
        <div className="border-t border-[var(--color-border)] pt-4">
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
            {t.laboratory.labNotes || "Lab Notes"}
          </p>
          <p className="mt-2 text-sm text-[var(--color-text)]">{result.laboratorian_notes}</p>
        </div>
      )}

      {result.flag && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
            {t.laboratory.flag || "Flag"}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text)]">{result.flag}</p>
        </div>
      )}

      <p className="text-sm text-[var(--color-muted)]">
        {t.laboratory.doctorReviewNext || "Doctor will review and release to patient"}
      </p>

      {canCorrect && isApproved && (
        <Link href={`/app/lab/results/${result.id}/correct`} className="block">
          <Button variant="primary" className="w-full">
            {t.laboratory.correctLabResult || "Correct Result"}
          </Button>
        </Link>
      )}
    </div>
  );
}
