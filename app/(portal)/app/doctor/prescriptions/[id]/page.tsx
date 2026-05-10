"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { DoctorPrescriptionCancelCard } from "@/components/doctor/DoctorPrescriptionCancelCard";
import { DoctorPrescriptionDetailPanel } from "@/components/doctor/DoctorPrescriptionDetailPanel";
import { DoctorPageFrame } from "@/components/doctor/ui/DoctorPageFrame";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { cancelDoctorPrescription, getDoctorPrescriptionDetail } from "@/lib/doctor/doctorService";
import type { DoctorPrescriptionDetail } from "@/types/doctor";

export default function DoctorPrescriptionDetailPage() {
  const { t } = useAppPreferences();
  const params = useParams<{ id: string }>();
  const prescriptionId = params.id;

  const [prescription, setPrescription] = useState<DoctorPrescriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDoctorPrescriptionDetail(prescriptionId);
      setPrescription(data);
    } catch {
      setError(t.patient.noDataDescription);
    } finally {
      setLoading(false);
    }
  }, [prescriptionId, t.patient.noDataDescription]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDetail();
  }, [loadDetail]);

  async function handleCancelPrescription() {
    if (!prescription) {
      return;
    }
    const updated = await cancelDoctorPrescription(prescription.id);
    setPrescription(updated);
  }

  if (loading) {
    return (
      <DashboardStateCard state="loading" description={t.patient.loading} />
    );
  }

  if (error || !prescription) {
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
        badge={<Badge tone="primary">{t.doctor.prescriptionDetail}</Badge>}
        title={t.doctor.prescriptionDetail}
        description={t.doctor.doctorOnlyPrescriptionDetails}
        actions={
          <Button variant="secondary" onClick={() => void loadDetail()}>
            {t.patient.retry}
          </Button>
        }
      />

      <DoctorPrescriptionDetailPanel prescription={prescription} />
      <DoctorPrescriptionCancelCard prescription={prescription} onCancel={handleCancelPrescription} />

      <div className="flex flex-wrap gap-2">
        {prescription.consultation_id ? (
          <Link
            href={`/app/doctor/consultations/${prescription.consultation_id}`}
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
