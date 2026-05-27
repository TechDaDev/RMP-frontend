"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { PharmacistPageFrame } from "@/components/pharmacist/ui/PharmacistPageFrame";
import { Card } from "@/components/ui/Card";
import { PharmacyQuoteBuilder } from "@/components/pharmacist/PharmacyQuoteBuilder";
import { Button } from "@/components/ui/Button";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatusBadge";
import {
  acceptPharmacyRequest,
  getPharmacyRequest,
  quotePharmacyRequest,
  rejectPharmacyRequest,
} from "@/lib/pharmacist/pharmacyRequestsService";
import type { PharmacyPrescriptionRequest } from "@/types/pharmacist";

export default function PharmacistRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<PharmacyPrescriptionRequest | null>(null);

  async function refresh() {
    const data = await getPharmacyRequest(params.id);
    setItem(data);
  }

  useEffect(() => {
    let active = true;
    void getPharmacyRequest(params.id).then((data) => {
      if (active) {
        setItem(data);
      }
    });

    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <PharmacistPageFrame>
      <PageHeader title="Pharmacy request detail" description={params.id} />
      {item ? (
        <>
          <Card className="space-y-2">
            <p className="text-sm text-[var(--color-muted)]">Patient: {item.patient?.full_name ?? "-"}</p>
            <p className="text-sm text-[var(--color-muted)]">Status: {item.status ?? "-"}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm">Payment:</span>
              <PaymentStatusBadge status={item.payment_status} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => void acceptPharmacyRequest(item.id).then(refresh)}>Accept</Button>
              <Button variant="secondary" onClick={() => void rejectPharmacyRequest(item.id).then(refresh)}>Reject</Button>
            </div>
          </Card>
          <PharmacyQuoteBuilder
            onSubmit={async (payload) => {
              await quotePharmacyRequest(item.id, payload);
              await refresh();
            }}
          />
        </>
      ) : null}
    </PharmacistPageFrame>
  );
}
