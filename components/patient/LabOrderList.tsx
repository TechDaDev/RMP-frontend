"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { ArrowIcon, FileTextIcon } from "@/components/icons";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
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
    return <EmptyState icon={<FileTextIcon size={20} />} title={t.patient.labOrdersEmptyTitle} description={t.patient.labOrdersEmptyDescription} />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="rounded-[2rem]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.status}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{t.patient.statusLabels[order.status ?? "issued"] ?? order.status ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.testCount}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{order.test_count || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.issuedAt}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{formatDate(order.issued_at)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.doctor}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{order.doctor.full_name}</p>
              </div>
            </div>
            <Link href={`/app/patient/lab-orders/${order.id}`} className={buttonClassName({ variant: "secondary" })}>
              {t.patient.labOrderDetailTitle}
              <ArrowIcon size={16} />
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}