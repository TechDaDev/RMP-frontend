"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { PatientInfoRow } from "@/components/patient/ui/PatientInfoRow";
import { PatientListCard } from "@/components/patient/ui/PatientListCard";
import { FileTextIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import type { PatientLabOrderListItem } from "@/types/patient";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface LabOrderListProps {
  orders: PatientLabOrderListItem[];
}

export function LabOrderList({ orders }: LabOrderListProps) {
  const { t } = useAppPreferences();

  if (orders.length === 0) {
    return <DashboardStateCard state="empty" icon={<FileTextIcon size={20} />} title={t.patient.labOrdersEmptyTitle} description={t.patient.labOrdersEmptyDescription} />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <PatientListCard
          key={order.id}
          title={order.doctor.full_name}
          meta={`${t.patient.issuedAt}: ${formatDate(order.issued_at)}`}
          badge={<Badge tone="primary">{t.patient.statusLabels[order.status ?? "issued"] ?? order.status ?? "-"}</Badge>}
          href={`/app/patient/lab-orders/${order.id}`}
          actionLabel={t.patient.labOrderDetailTitle}
        >
          <DashboardGrid columns="four">
            <PatientInfoRow label={t.patient.status} value={t.patient.statusLabels[order.status ?? "issued"] ?? order.status ?? "-"} />
            <PatientInfoRow label={t.patient.testCount} value={order.test_count || "-"} />
            <PatientInfoRow label={t.patient.issuedAt} value={formatDate(order.issued_at)} />
            <PatientInfoRow label={t.patient.doctor} value={order.doctor.full_name} />
          </DashboardGrid>
        </PatientListCard>
      ))}
    </div>
  );
}
