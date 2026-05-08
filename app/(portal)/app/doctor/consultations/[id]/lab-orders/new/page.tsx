"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { DoctorLabOrderForm } from "@/components/doctor/DoctorLabOrderForm";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  createLabOrderFromConsultation,
  getDoctorConsultationDetail,
} from "@/lib/doctor/doctorService";
import { canDoctorCreateLabOrder } from "@/lib/doctor/doctorConsultationStatus";
import type { CreateDoctorLabOrderRequest, DoctorConsultationDetail } from "@/types/doctor";

export default function DoctorCreateLabOrderPage() {
  const { t } = useAppPreferences();
  const { verification } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const consultationId = params.id;

  const [consultation, setConsultation] = useState<DoctorConsultationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isApproved = verification?.is_approved === true;
  const canCreate = Boolean(consultation && canDoctorCreateLabOrder(consultation.status) && isApproved);

  const loadConsultation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDoctorConsultationDetail(consultationId);
      setConsultation(data);
    } catch {
      setError(t.patient.noDataDescription);
    } finally {
      setLoading(false);
    }
  }, [consultationId, t.patient.noDataDescription]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadConsultation();
  }, [loadConsultation]);

  async function handleCreateLabOrder(payload: CreateDoctorLabOrderRequest) {
    const created = await createLabOrderFromConsultation(consultationId, payload);
    if (created.id) {
      router.replace(`/app/doctor/lab-orders/${created.id}`);
      return;
    }
    router.replace(`/app/doctor/consultations/${consultationId}`);
  }

  if (loading) {
    return (
      <Card className="rounded-[2rem]">
        <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.doctor.createLabOrder}</Badge>}
        title={t.doctor.createLabOrder}
        description={t.doctor.createLabOrderSubtitle}
      />

      {error || !consultation ? (
        <Card className="space-y-4 rounded-[2rem]">
          <EmptyState title={t.patient.noDataTitle} description={error ?? t.patient.noDataDescription} />
        </Card>
      ) : canCreate ? (
        <DoctorLabOrderForm onSubmit={handleCreateLabOrder} />
      ) : (
        <Card className="space-y-4 rounded-[2rem]">
          <EmptyState
            title={t.doctor.createLabOrder}
            description={
              !isApproved
                ? t.doctor.verifiedDoctorRequiredDescription
                : t.doctor.labOrderRequiresAcceptedConsultation
            }
          />
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href={`/app/doctor/consultations/${consultationId}`} className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.backToConsultation}
        </Link>
        <Link href="/app/doctor" className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.backToDoctorDashboard}
        </Link>
      </div>
    </div>
  );
}
