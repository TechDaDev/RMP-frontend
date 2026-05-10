"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { LabResultList } from "@/components/patient/LabResultList";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMyLabResults } from "@/lib/patient/patientService";
import type { PatientLabResultListItem } from "@/types/patient";

export default function LabResultsPage() {
  const { t } = useAppPreferences();
  const [results, setResults] = useState<PatientLabResultListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getMyLabResults();
        if (active) {
          setResults(data);
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
        badge={<Badge tone="primary">{t.patient.labResultsTitle}</Badge>}
        title={t.patient.labResultsTitle}
        description={t.patient.labResultsSubtitle}
      />

      <DashboardSection title={t.patient.labResultsTitle} description={t.patient.labResultsSubtitle}>
        {loading ? (
          <DashboardStateCard state="loading" description={t.patient.loading} />
        ) : error ? (
          <DashboardStateCard state="error" title={t.patient.noDataTitle} description={error} />
        ) : (
          <LabResultList results={results} />
        )}
      </DashboardSection>
    </PatientPageFrame>
  );
}
