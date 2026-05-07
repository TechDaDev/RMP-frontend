"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Card } from "@/components/ui/Card";
import type { PatientLabOrderDetail } from "@/types/patient";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface LabOrderDetailPanelProps {
  order: PatientLabOrderDetail;
}

export function LabOrderDetailPanel({ order }: LabOrderDetailPanelProps) {
  const { t } = useAppPreferences();

  return (
    <Card className="space-y-5 rounded-[2rem]">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.status}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{t.patient.statusLabels[order.status ?? "issued"] ?? order.status ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.doctor}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{order.doctor.full_name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.issuedAt}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{formatDate(order.issued_at)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.expiresAt}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{formatDate(order.expires_at)}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.qrToken}</p>
          <p className="mt-2 break-all text-sm text-[var(--color-muted)]">{order.qr_token || "-"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.guidance}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{order.guidance || "-"}</p>
        </div>
      </div>
      <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-muted)]">
        {t.patient.labOrderPrivacyNote}
      </p>
    </Card>
  );
}