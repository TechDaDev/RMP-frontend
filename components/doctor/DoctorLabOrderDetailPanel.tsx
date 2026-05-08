"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
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
    <Card className="space-y-5 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.doctorOnlyLabOrderDetails}</h3>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.labOrderStatus}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
            {t.patient.statusLabels[labOrder.status ?? "issued"] ?? labOrder.status ?? "-"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.patientSummary}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{labOrder.patient?.full_name ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.doctor}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{labOrder.doctor?.full_name ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.issuedAt}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{formatDate(labOrder.created_at)}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.expiresAt}</p>
          <p className="mt-2 text-sm text-[var(--color-text)]">{formatDate(labOrder.expires_at)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.cancelLabOrder}</p>
          <p className="mt-2 text-sm text-[var(--color-text)]">{formatDate(labOrder.cancelled_at)}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.qrToken}</p>
        <p className="mt-2 break-all text-sm text-[var(--color-muted)]">{labOrder.qr_token || "-"}</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.labOrderItems}</h4>
        {labOrder.items?.length ? (
          <div className="space-y-3">
            {labOrder.items.map((item, index) => (
              <div
                key={item.id ?? `${item.test_name}-${index}`}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
              >
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.testName}</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{item.test_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.testCategory}</p>
                    <p className="text-sm text-[var(--color-text)]">{item.category || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.testCode}</p>
                    <p className="text-sm text-[var(--color-text)]">{item.test || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.sampleType}</p>
                    <p className="text-sm text-[var(--color-text)]">{item.sample_type || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.labOrderStatus}</p>
                    <p className="text-sm text-[var(--color-text)]">
                      {t.patient.statusLabels[item.status ?? "pending"] ?? item.status ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.labOrderStatus}</p>
                    <p className="text-sm text-[var(--color-text)]">{formatDate(item.completed_at)}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-[var(--color-muted)]">{t.doctor.testInstructions}</p>
                  <p className="text-sm text-[var(--color-text)]">{item.instructions || "-"}</p>
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
