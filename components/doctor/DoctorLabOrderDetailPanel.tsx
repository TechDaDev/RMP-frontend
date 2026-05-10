"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DoctorInfoRow } from "@/components/doctor/ui/DoctorInfoRow";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { DoctorLabOrderDetail } from "@/types/doctor";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface DoctorLabOrderDetailPanelProps {
  labOrder: DoctorLabOrderDetail;
}

export function DoctorLabOrderDetailPanel({ labOrder }: DoctorLabOrderDetailPanelProps) {
  const { t } = useAppPreferences();
  const resultLinks =
    labOrder.completion_records
      ?.map((record) => record.lab_result_id ?? record.result_id)
      .filter((value): value is string => Boolean(value)) ?? [];

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.doctorOnlyLabOrderDetails}</h3>
        <Badge tone="primary">{t.patient.statusLabels[labOrder.status ?? "issued"] ?? labOrder.status ?? "-"}</Badge>
      </div>

      <DashboardGrid columns="four">
        <DoctorInfoRow label={t.doctor.labOrderStatus} value={t.patient.statusLabels[labOrder.status ?? "issued"] ?? labOrder.status ?? "-"} />
        <DoctorInfoRow label={t.doctor.patientSummary} value={labOrder.patient?.full_name ?? "-"} />
        <DoctorInfoRow label={t.patient.doctor} value={labOrder.doctor?.full_name ?? "-"} />
        <DoctorInfoRow label={t.patient.issuedAt} value={formatDate(labOrder.created_at)} />
      </DashboardGrid>

      <DashboardGrid columns="two">
        <DoctorInfoRow label={t.patient.expiresAt} value={formatDate(labOrder.expires_at)} muted />
        <DoctorInfoRow label={t.doctor.cancelLabOrder} value={formatDate(labOrder.cancelled_at)} muted />
      </DashboardGrid>

      <DoctorInfoRow label={t.patient.qrToken} value={<span className="break-all">{labOrder.qr_token || "-"}</span>} muted />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.labOrderItems}</h4>
        {labOrder.items?.length ? (
          <div className="space-y-3">
            {labOrder.items.map((item, index) => (
              <div
                key={item.id ?? `${item.test_name}-${index}`}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
              >
                <DashboardGrid columns="three">
                  <DoctorInfoRow label={t.doctor.testName} value={item.test_name || "-"} />
                  <DoctorInfoRow label={t.doctor.testCategory} value={item.category || "-"} muted />
                  <DoctorInfoRow label={t.doctor.testCode} value={item.test || "-"} muted />
                  <DoctorInfoRow label={t.doctor.sampleType} value={item.sample_type || "-"} muted />
                  <DoctorInfoRow label={t.doctor.labOrderStatus} value={t.patient.statusLabels[item.status ?? "pending"] ?? item.status ?? "-"} muted />
                  <DoctorInfoRow label={t.doctor.labOrderStatus} value={formatDate(item.completed_at)} muted />
                </DashboardGrid>

                <div className="mt-3">
                  <DoctorInfoRow label={t.doctor.testInstructions} value={item.instructions || "-"} muted />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">-</p>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.labResults}</h4>
        {resultLinks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {resultLinks.map((resultId) => (
              <Link
                key={resultId}
                href={`/app/doctor/lab-results/${resultId}`}
                className="text-sm font-medium text-[var(--color-primary)] underline"
              >
                {t.doctor.labResult} {resultId}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">{t.doctor.resultsUnavailable}</p>
        )}
      </div>
    </Card>
  );
}
