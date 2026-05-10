"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { ConsultationList } from "@/components/patient/ConsultationList";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMyConsultations } from "@/lib/patient/patientService";
import type { ConsultationListItem } from "@/types/patient";

export default function PatientConsultationsPage() {
  const { t } = useAppPreferences();
  const [consultations, setConsultations] = useState<ConsultationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyConsultations();
        if (active) {
          setConsultations(data);
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
  }, [t.patient.noDataDescription]);

  return (
    <PatientPageFrame>
      <PageHeader
        badge={<Badge tone="primary">{t.patient.consultationsTitle}</Badge>}
        title={t.patient.consultationsTitle}
        description={t.patient.consultationsSubtitle}
        actions={
          <Link href="/app/patient/consultations/new" className={buttonClassName({ variant: "primary" })}>
            {t.patient.requestConsultation}
          </Link>
        }
      />

      <DashboardSection title={t.patient.consultationsTitle} description={t.patient.consultationsSubtitle}>
        {loading ? (
          <DashboardStateCard state="loading" description={t.patient.loading} />
        ) : error ? (
          <DashboardStateCard state="error" title={t.patient.noDataTitle} description={error} />
        ) : (
          <ConsultationList consultations={consultations} />
        )}
      </DashboardSection>
    </PatientPageFrame>
  );
}
