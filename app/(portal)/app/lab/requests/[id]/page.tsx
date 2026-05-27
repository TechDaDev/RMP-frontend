"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LaboratoryPageFrame } from "@/components/laboratory/ui/LaboratoryPageFrame";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { LabQuoteBuilder } from "@/components/laboratory/LabQuoteBuilder";
import { Button } from "@/components/ui/Button";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatusBadge";
import {
  acceptLabRequest,
  getLabRequest,
  quoteLabRequest,
  rejectLabRequest,
} from "@/lib/laboratory/labRequestsService";
import type { LabServiceRequest } from "@/types/laboratory";

export default function LabRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<LabServiceRequest | null>(null);

  async function refresh() {
    const data = await getLabRequest(params.id);
    setItem(data);
  }

  useEffect(() => {
    let active = true;
    void getLabRequest(params.id).then((data) => {
      if (active) {
        setItem(data);
      }
    });

    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <LaboratoryPageFrame>
      <PageHeader title="Lab request detail" description={params.id} />
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
              <Button variant="secondary" onClick={() => void acceptLabRequest(item.id).then(refresh)}>Accept</Button>
              <Button variant="secondary" onClick={() => void rejectLabRequest(item.id).then(refresh)}>Reject</Button>
            </div>
          </Card>
          <LabQuoteBuilder
            onSubmit={async (payload) => {
              await quoteLabRequest(item.id, payload);
              await refresh();
            }}
          />
        </>
      ) : null}
    </LaboratoryPageFrame>
  );
}
