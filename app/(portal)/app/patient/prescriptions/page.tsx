"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PrescriptionList } from "@/components/patient/PrescriptionList";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
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
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.patient.prescriptionsTitle}</Badge>}
        title={t.patient.prescriptionsTitle}
        description={t.patient.prescriptionsSubtitle}
      />

      {loading ? (
        <Card className="rounded-[2rem]">
          <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
        </Card>
      ) : error ? (
        <EmptyState title={t.patient.noDataTitle} description={error} />
      ) : (
        <PrescriptionList prescriptions={prescriptions} />
      )}
    </div>
  );
}