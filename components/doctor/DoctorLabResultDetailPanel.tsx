"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Card } from "@/components/ui/Card";
import type { DoctorLabResultDetail } from "@/types/doctor";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

function formatValue(result: DoctorLabResultDetail) {
  if (result.value_type === "numeric") {
    return result.numeric_value ?? "-";
  }
  if (result.value_type === "blood_group") {
    return result.blood_group_value || "-";
  }
  return result.text_value || "-";
}

interface DoctorLabResultDetailPanelProps {
  result: DoctorLabResultDetail;
}

export function DoctorLabResultDetailPanel({ result }: DoctorLabResultDetailPanelProps) {
  const { t } = useAppPreferences();

  const labOrderId =
    typeof result.lab_order === "string" ? result.lab_order : result.lab_order?.id;
  const itemSummary =
    typeof result.lab_order_item === "object" && result.lab_order_item
      ? `${result.lab_order_item.test_name ?? "-"} (${result.lab_order_item.category ?? "-"})`
      : result.lab_order_item ?? "-";

  return (
    <Card className="space-y-5 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.doctorOnlyLabResultDetails}</h3>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.labResult}</p>
          <p className="mt-2 break-all text-sm font-semibold text-[var(--color-text)]">{result.id}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.labResultDetail}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
            {t.patient.statusLabels[result.status ?? "submitted"] ?? result.status ?? "-"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.patientSummary}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{result.patient?.full_name ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.doctor}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{result.doctor?.full_name ?? "-"}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs text-[var(--color-muted)]">{t.doctor.resultValue}</p>
          <p className="text-sm text-[var(--color-text)]">{String(formatValue(result))}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-muted)]">{t.doctor.resultUnit}</p>
          <p className="text-sm text-[var(--color-text)]">{result.unit || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-muted)]">{t.doctor.referenceRange}</p>
          <p className="text-sm text-[var(--color-text)]">{result.reference_range || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-muted)]">{t.doctor.interpretation}</p>
          <p className="text-sm text-[var(--color-text)]">{result.flag || "-"}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs text-[var(--color-muted)]">{t.doctor.reviewLabResult}</p>
          <p className="text-sm text-[var(--color-text)]">{formatDate(result.reviewed_at)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-muted)]">{t.doctor.releaseLabResult}</p>
          <p className="text-sm text-[var(--color-text)]">{formatDate(result.released_at)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-muted)]">{t.doctor.labResult}</p>
          <p className="text-sm text-[var(--color-text)]">{itemSummary}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-muted)]">{t.doctor.resultFile}</p>
          {result.result_file ? (
            <a
              className="text-sm font-medium text-[var(--color-primary)] underline"
              href={result.result_file}
              target="_blank"
              rel="noreferrer"
            >
              {result.original_file_name || t.doctor.resultFile}
            </a>
          ) : (
            <p className="text-sm text-[var(--color-text)]">-</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs text-[var(--color-muted)]">{t.doctor.doctorNotes}</p>
          <p className="text-sm whitespace-pre-wrap text-[var(--color-text)]">{result.doctor_notes || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-muted)]">{t.doctor.laboratorianNotes}</p>
          <p className="text-sm whitespace-pre-wrap text-[var(--color-text)]">{result.laboratorian_notes || "-"}</p>
        </div>
      </div>

      {labOrderId ? (
        <div>
          <Link href={`/app/doctor/lab-orders/${labOrderId}`} className="text-sm font-medium text-[var(--color-primary)] underline">
            {t.doctor.backToLabOrder}
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
