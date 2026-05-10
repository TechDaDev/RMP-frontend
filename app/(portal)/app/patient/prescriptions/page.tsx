"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { PrescriptionList } from "@/components/patient/PrescriptionList";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMyPrescriptions } from "@/lib/patient/patientService";
import type { PatientPrescriptionListItem } from "@/types/patient";

export default function PrescriptionsPage() {
  const { t } = useAppPreferences();
  const [prescriptions, setPrescriptions] = useState<PatientPrescriptionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getMyPrescriptions();
        if (active) {
          setPrescriptions(data);
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
  }, [t.patient.noDataDescription]);

  return (
    <PatientPageFrame>
      <PageHeader
        badge={<Badge tone="primary">{t.patient.prescriptionsTitle}</Badge>}
        title={t.patient.prescriptionsTitle}
        description={t.patient.prescriptionsSubtitle}
      />

      <DashboardSection title={t.patient.prescriptionsTitle} description={t.patient.prescriptionsSubtitle}>
        {loading ? (
          <DashboardStateCard state="loading" description={t.patient.loading} />
        ) : error ? (
          <DashboardStateCard state="error" title={t.patient.noDataTitle} description={error} />
        ) : (
          <PrescriptionList prescriptions={prescriptions} />
        )}
      </DashboardSection>
    </PatientPageFrame>
  );
}
