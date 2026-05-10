"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DoctorInfoRow } from "@/components/doctor/ui/DoctorInfoRow";
import { Badge } from "@/components/ui/Badge";
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
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.doctorOnlyPrescriptionDetails}</h3>
        <Badge tone="primary">{t.patient.statusLabels[prescription.status ?? "issued"] ?? prescription.status ?? "-"}</Badge>
      </div>

      <DashboardGrid columns="four">
        <DoctorInfoRow label={t.doctor.prescriptionStatus} value={t.patient.statusLabels[prescription.status ?? "issued"] ?? prescription.status ?? "-"} />
        <DoctorInfoRow label={t.doctor.patientSummary} value={prescription.patient?.full_name ?? "-"} />
        <DoctorInfoRow label={t.patient.doctor} value={prescription.doctor?.full_name ?? "-"} />
        <DoctorInfoRow label={t.patient.issuedAt} value={formatDate(prescription.issued_at)} />
      </DashboardGrid>

      <DashboardGrid columns="two">
        <DoctorInfoRow label={t.patient.expiresAt} value={formatDate(prescription.expires_at)} />
        <DoctorInfoRow label={t.doctor.cancelPrescription} value={formatDate(prescription.cancelled_at)} muted />
      </DashboardGrid>

      <DoctorInfoRow label={t.patient.qrToken} value={<span className="break-all">{prescription.qr_token || "-"}</span>} muted />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.prescriptionItems}</h4>
        {prescription.items?.length ? (
          <div className="space-y-3">
            {prescription.items.map((item, index) => (
              <div key={item.id ?? `${item.medication_name}-${index}`} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <DashboardGrid columns="three">
                  <DoctorInfoRow label={t.doctor.medicationName} value={item.medication_name || "-"} />
                  <DoctorInfoRow label={t.doctor.dosage} value={item.dosage || "-"} muted />
                  <DoctorInfoRow label={t.doctor.frequency} value={item.frequency || "-"} muted />
                  <DoctorInfoRow label={t.doctor.duration} value={item.duration || "-"} muted />
                  <DoctorInfoRow label={t.doctor.quantity} value={item.quantity || "-"} muted />
                  <DoctorInfoRow label={t.doctor.prescriptionStatus} value={item.status || "-"} muted />
                </DashboardGrid>
                <DashboardGrid columns="two" className="mt-3">
                  <DoctorInfoRow label={t.doctor.instructions} value={item.instructions || "-"} muted />
                  <DoctorInfoRow label={t.doctor.route} value={item.route ? ((t.doctor[`route${item.route.charAt(0).toUpperCase()}${item.route.slice(1)}` as keyof typeof t.doctor] as string) ?? item.route) : "-"} muted />
                </DashboardGrid>
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
