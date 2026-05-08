"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { buttonClassName } from "@/components/ui/Button";
import { LabOrderDetailPanel } from "@/components/patient/LabOrderDetailPanel";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMyLabOrderDetail } from "@/lib/patient/patientService";
import type { PatientLabOrderDetail } from "@/types/patient";

export default function LabOrderDetailPage() {
  const { t } = useAppPreferences();
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<PatientLabOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getMyLabOrderDetail(params.id);
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
    return (
      <div className="space-y-4">
        <EmptyState title={t.patient.noDataTitle} description={error ?? t.patient.noDataDescription} />
        <div className="flex justify-center">
          <Link href="/app/patient/lab-orders" className={buttonClassName({ variant: "secondary" })}>
            {t.patient.backToLabOrders}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.patient.labOrderDetailTitle}</Badge>}
        title={t.patient.labOrderDetailTitle}
        description={t.patient.labOrdersSubtitle}
      />
      <LabOrderDetailPanel order={detail} />
    </div>
  );
}