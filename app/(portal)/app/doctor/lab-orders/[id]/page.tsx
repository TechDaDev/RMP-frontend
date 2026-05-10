"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { DoctorLabOrderCancelCard } from "@/components/doctor/DoctorLabOrderCancelCard";
import { DoctorLabOrderDetailPanel } from "@/components/doctor/DoctorLabOrderDetailPanel";
import { DoctorPageFrame } from "@/components/doctor/ui/DoctorPageFrame";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
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
      <DashboardStateCard state="loading" description={t.patient.loading} />
    );
  }

  if (error || !labOrder) {
    return (
      <DashboardStateCard
        state="error"
        title={t.patient.noDataTitle}
        description={error ?? t.patient.noDataDescription}
        action={
          <Link href="/app/doctor" className={buttonClassName({ variant: "secondary" })}>
            {t.doctor.backToDoctorDashboard}
          </Link>
        }
      />
    );
  }

  return (
    <DoctorPageFrame>
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
    </DoctorPageFrame>
  );
}
