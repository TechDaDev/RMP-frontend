"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PrescriptionDetailPanel } from "@/components/patient/PrescriptionDetailPanel";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
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
      <Card className="rounded-[2rem]">
        <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
      </Card>
    );
  }

  if (error || !detail) {
    return <EmptyState title={t.patient.noDataTitle} description={error ?? t.patient.noDataDescription} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.patient.prescriptionDetailTitle}</Badge>}
        title={t.patient.prescriptionDetailTitle}
        description={t.patient.prescriptionsSubtitle}
      />
      <PrescriptionDetailPanel prescription={detail} />
    </div>
  );
}