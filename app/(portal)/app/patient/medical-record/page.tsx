"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { MedicalRecordPanel } from "@/components/patient/MedicalRecordPanel";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMyMedicalRecord } from "@/lib/patient/patientService";
import type { PatientMedicalRecord } from "@/types/patient";

export default function MedicalRecordPage() {
  const { t } = useAppPreferences();
  const [record, setRecord] = useState<PatientMedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getMyMedicalRecord();
        if (active) {
          setRecord(data);
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

  if (loading) {
    return (
      <Card className="rounded-[2rem]">
        <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
      </Card>
    );
  }

  if (error || !record) {
    return <EmptyState title={t.patient.noDataTitle} description={error ?? t.patient.noDataDescription} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.patient.medicalRecordTitle}</Badge>}
        title={t.patient.medicalRecordTitle}
        description={t.patient.medicalRecordSubtitle}
      />
      <MedicalRecordPanel record={record} />
    </div>
  );
}