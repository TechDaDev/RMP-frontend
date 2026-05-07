"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { ArrowIcon, PrescriptionIcon } from "@/components/icons";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PatientPrescriptionListItem } from "@/types/patient";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface PrescriptionListProps {
  prescriptions: PatientPrescriptionListItem[];
}

export function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  const { t } = useAppPreferences();

  if (prescriptions.length === 0) {
    return <EmptyState icon={<PrescriptionIcon size={20} />} title={t.patient.prescriptionsEmptyTitle} description={t.patient.prescriptionsEmptyDescription} />;
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription) => (
        <Card key={prescription.id} className="rounded-[2rem]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.status}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{t.patient.statusLabels[prescription.status ?? "issued"] ?? prescription.status ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.doctor}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{prescription.doctor.full_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.issuedAt}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{formatDate(prescription.issued_at)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.qrToken}</p>
                <p className="mt-2 truncate text-sm font-semibold text-[var(--color-text)]">{prescription.qr_token || "-"}</p>
              </div>
            </div>
            <Link href={`/app/patient/prescriptions/${prescription.id}`} className={buttonClassName({ variant: "secondary" })}>
              {t.patient.prescriptionDetailTitle}
              <ArrowIcon size={16} />
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}