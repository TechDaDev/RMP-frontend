"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Card } from "@/components/ui/Card";
import type { DoctorPrescriptionDetail } from "@/types/doctor";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface DoctorPrescriptionDetailPanelProps {
  prescription: DoctorPrescriptionDetail;
}

export function DoctorPrescriptionDetailPanel({ prescription }: DoctorPrescriptionDetailPanelProps) {
  const { t } = useAppPreferences();

  return (
    <Card className="space-y-5 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.doctorOnlyPrescriptionDetails}</h3>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.prescriptionStatus}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
            {t.patient.statusLabels[prescription.status ?? "issued"] ?? prescription.status ?? "-"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.patientSummary}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{prescription.patient?.full_name ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.doctor}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{prescription.doctor?.full_name ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.issuedAt}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{formatDate(prescription.issued_at)}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.expiresAt}</p>
          <p className="mt-2 text-sm text-[var(--color-text)]">{formatDate(prescription.expires_at)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.cancelPrescription}</p>
          <p className="mt-2 text-sm text-[var(--color-text)]">{formatDate(prescription.cancelled_at)}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.qrToken}</p>
        <p className="mt-2 break-all text-sm text-[var(--color-muted)]">{prescription.qr_token || "-"}</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.prescriptionItems}</h4>
        {prescription.items?.length ? (
          <div className="space-y-3">
            {prescription.items.map((item, index) => (
              <div key={item.id ?? `${item.medication_name}-${index}`} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.medicationName}</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{item.medication_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.dosage}</p>
                    <p className="text-sm text-[var(--color-text)]">{item.dosage || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.frequency}</p>
                    <p className="text-sm text-[var(--color-text)]">{item.frequency || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.duration}</p>
                    <p className="text-sm text-[var(--color-text)]">{item.duration || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.quantity}</p>
                    <p className="text-sm text-[var(--color-text)]">{item.quantity || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.prescriptionStatus}</p>
                    <p className="text-sm text-[var(--color-text)]">{item.status || "-"}</p>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.doctor.instructions}</p>
                    <p className="text-sm text-[var(--color-text)]">{item.instructions || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">Route</p>
                    <p className="text-sm text-[var(--color-text)]">{item.route || "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">-</p>
        )}
      </div>
    </Card>
  );
}
