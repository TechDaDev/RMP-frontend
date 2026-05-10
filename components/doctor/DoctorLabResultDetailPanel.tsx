"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DoctorInfoRow } from "@/components/doctor/ui/DoctorInfoRow";
import { Badge } from "@/components/ui/Badge";
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
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.doctorOnlyLabResultDetails}</h3>
        <Badge tone="primary">{t.patient.statusLabels[result.status ?? "submitted"] ?? result.status ?? "-"}</Badge>
      </div>

      <DashboardGrid columns="four">
        <DoctorInfoRow label={t.doctor.labResult} value={<span className="break-all">{result.id}</span>} />
        <DoctorInfoRow label={t.doctor.labResultDetail} value={t.patient.statusLabels[result.status ?? "submitted"] ?? result.status ?? "-"} />
        <DoctorInfoRow label={t.doctor.patientSummary} value={result.patient?.full_name ?? "-"} />
        <DoctorInfoRow label={t.patient.doctor} value={result.doctor?.full_name ?? "-"} />
      </DashboardGrid>

      <DashboardGrid columns="four">
        <DoctorInfoRow label={t.doctor.resultValue} value={String(formatValue(result))} />
        <DoctorInfoRow label={t.doctor.resultUnit} value={result.unit || "-"} muted />
        <DoctorInfoRow label={t.doctor.referenceRange} value={result.reference_range || "-"} muted />
        <DoctorInfoRow label={t.doctor.interpretation} value={result.flag || "-"} muted />
      </DashboardGrid>

      <DashboardGrid columns="four">
        <DoctorInfoRow label={t.doctor.reviewLabResult} value={formatDate(result.reviewed_at)} muted />
        <DoctorInfoRow label={t.doctor.releaseLabResult} value={formatDate(result.released_at)} muted />
        <DoctorInfoRow label={t.doctor.labResult} value={itemSummary} muted />
        <DoctorInfoRow label={t.doctor.resultFile} value={result.result_file ? <a className="text-sm font-medium text-[var(--color-primary)] underline" href={result.result_file} target="_blank" rel="noreferrer">{result.original_file_name || t.doctor.resultFile}</a> : "-"} muted />
      </DashboardGrid>

      <DashboardGrid columns="two">
        <DoctorInfoRow label={t.doctor.doctorNotes} value={<span className="whitespace-pre-wrap">{result.doctor_notes || "-"}</span>} muted />
        <DoctorInfoRow label={t.doctor.laboratorianNotes} value={<span className="whitespace-pre-wrap">{result.laboratorian_notes || "-"}</span>} muted />
      </DashboardGrid>

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
