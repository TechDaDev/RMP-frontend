"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { buttonClassName } from "@/components/ui/Button";
import { PrescriptionDetailPanel } from "@/components/patient/PrescriptionDetailPanel";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMyPrescriptionDetail } from "@/lib/patient/patientService";
import type { PatientPrescriptionDetail } from "@/types/patient";

export default function PrescriptionDetailPage() {
  const { t } = useAppPreferences();
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<PatientPrescriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const data = await getMyPrescriptionDetail(params.id);
        if (active) {
          setDetail(data);
          setError(null);
        }
      } catch {
        if (active) {
          setError(t.patient.noDataDescription);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [params.id, t.patient.noDataDescription]);

  if (loading) {
    return (
      <DashboardStateCard state="loading" description={t.patient.loading} />
    );
  }

  if (error || !detail) {
    return (
      <DashboardStateCard
        state="error"
        title={t.patient.noDataTitle}
        description={error ?? t.patient.noDataDescription}
        action={
          <Link href="/app/patient/prescriptions" className={buttonClassName({ variant: "secondary" })}>
            {t.patient.backToPrescriptions}
          </Link>
        }
      />
    );
  }

  return (
    <PatientPageFrame>
      <PageHeader
        badge={<Badge tone="primary">{t.patient.prescriptionDetailTitle}</Badge>}
        title={t.patient.prescriptionDetailTitle}
        description={t.patient.prescriptionsSubtitle}
        actions={
          <Link href="/app/patient/prescriptions" className={buttonClassName({ variant: "secondary" })}>
            {t.patient.backToPrescriptions}
          </Link>
        }
      />
      <PrescriptionDetailPanel prescription={detail} />
    </PatientPageFrame>
  );
}
