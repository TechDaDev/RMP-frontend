"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { LabOrderList } from "@/components/patient/LabOrderList";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
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
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.patient.labOrdersTitle}</Badge>}
        title={t.patient.labOrdersTitle}
        description={t.patient.labOrdersSubtitle}
      />

      {loading ? (
        <Card className="rounded-[2rem]">
          <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
        </Card>
      ) : error ? (
        <EmptyState title={t.patient.noDataTitle} description={error} />
      ) : (
        <LabOrderList orders={orders} />
      )}
    </div>
  );
}