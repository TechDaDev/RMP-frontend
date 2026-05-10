"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { LabOrderList } from "@/components/patient/LabOrderList";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMyLabOrders } from "@/lib/patient/patientService";
import type { PatientLabOrderListItem } from "@/types/patient";

export default function LabOrdersPage() {
  const { t } = useAppPreferences();
  const [orders, setOrders] = useState<PatientLabOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getMyLabOrders();
        if (active) {
          setOrders(data);
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
        badge={<Badge tone="primary">{t.patient.labOrdersTitle}</Badge>}
        title={t.patient.labOrdersTitle}
        description={t.patient.labOrdersSubtitle}
      />

      <DashboardSection title={t.patient.labOrdersTitle} description={t.patient.labOrdersSubtitle}>
        {loading ? (
          <DashboardStateCard state="loading" description={t.patient.loading} />
        ) : error ? (
          <DashboardStateCard state="error" title={t.patient.noDataTitle} description={error} />
        ) : (
          <LabOrderList orders={orders} />
        )}
      </DashboardSection>
    </PatientPageFrame>
  );
}
