"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DoctorLabOrderCancelCard } from "@/components/doctor/DoctorLabOrderCancelCard";
import { DoctorLabOrderDetailPanel } from "@/components/doctor/DoctorLabOrderDetailPanel";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { cancelDoctorLabOrder, getDoctorLabOrderDetail } from "@/lib/doctor/doctorService";
import type { DoctorLabOrderDetail } from "@/types/doctor";

export default function DoctorLabOrderDetailPage() {
  const { t } = useAppPreferences();
  const params = useParams<{ id: string }>();
  const labOrderId = params.id;

  const [labOrder, setLabOrder] = useState<DoctorLabOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDoctorLabOrderDetail(labOrderId);
      setLabOrder(data);
    } catch {
      setError(t.patient.noDataDescription);
    } finally {
      setLoading(false);
    }
  }, [labOrderId, t.patient.noDataDescription]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDetail();
  }, [loadDetail]);

  async function handleCancelLabOrder() {
    if (!labOrder) {
      return;
    }
    const updated = await cancelDoctorLabOrder(labOrder.id);
    setLabOrder(updated);
  }

  if (loading) {
    return (
      <Card className="rounded-[2rem]">
        <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
      </Card>
    );
  }

  if (error || !labOrder) {
    return (
      <Card className="space-y-4 rounded-[2rem]">
        <EmptyState title={t.patient.noDataTitle} description={error ?? t.patient.noDataDescription} />
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/app/doctor" className={buttonClassName({ variant: "secondary" })}>
            {t.doctor.backToDoctorDashboard}
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.doctor.labOrderDetail}</Badge>}
        title={t.doctor.labOrderDetail}
        description={t.doctor.doctorOnlyLabOrderDetails}
        actions={
          <Button variant="secondary" onClick={() => void loadDetail()}>
            {t.patient.retry}
          </Button>
        }
      />

      <DoctorLabOrderDetailPanel labOrder={labOrder} />
      <DoctorLabOrderCancelCard labOrder={labOrder} onCancel={handleCancelLabOrder} />

      <div className="flex flex-wrap gap-2">
        {labOrder.consultation_id ? (
          <Link
            href={`/app/doctor/consultations/${labOrder.consultation_id}`}
            className={buttonClassName({ variant: "secondary" })}
          >
            {t.doctor.backToConsultation}
          </Link>
        ) : null}
        <Link href="/app/doctor" className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.backToDoctorDashboard}
        </Link>
      </div>
    </div>
  );
}
