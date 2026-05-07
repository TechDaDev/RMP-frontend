"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { ConsultationList } from "@/components/patient/ConsultationList";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
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
    <div className="space-y-6">
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

      {loading ? (
        <Card className="rounded-[2rem]">
          <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
        </Card>
      ) : error ? (
        <EmptyState title={t.patient.noDataTitle} description={error} />
      ) : (
        <ConsultationList consultations={consultations} />
      )}
    </div>
  );
}