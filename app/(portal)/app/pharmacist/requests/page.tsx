"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { PharmacistPageFrame } from "@/components/pharmacist/ui/PharmacistPageFrame";
import { Card } from "@/components/ui/Card";
import { QuoteStatusBadge } from "@/components/common/QuoteStatusBadge";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatusBadge";
import { listPharmacyRequests } from "@/lib/pharmacist/pharmacyRequestsService";
import type { PharmacyPrescriptionRequest } from "@/types/pharmacist";
import { buttonClassName } from "@/components/ui/Button";

export default function PharmacistRequestsPage() {
  const [items, setItems] = useState<PharmacyPrescriptionRequest[]>([]);

  useEffect(() => {
    void listPharmacyRequests().then(setItems);
  }, []);

  return (
    <PharmacistPageFrame>
      <PageHeader title="Pharmacy requests" description="Review and quote prescription requests" />
      <Card className="space-y-2">
        {items.length === 0 ? <p className="text-sm text-[var(--color-muted)]">No requests.</p> : null}
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--color-border)] p-3">
            <div>
              <p className="font-semibold text-[var(--color-text)]">Request {item.id}</p>
              <p className="text-xs text-[var(--color-muted)]">{item.patient?.full_name ?? "-"}</p>
            </div>
            <div className="flex items-center gap-2">
              <QuoteStatusBadge status={item.quote_status ?? item.status} />
              <PaymentStatusBadge status={item.payment_status} />
              <Link href={`/app/pharmacist/requests/${item.id}`} className={buttonClassName({ variant: "secondary" })}>Open</Link>
            </div>
          </div>
        ))}
      </Card>
    </PharmacistPageFrame>
  );
}
