"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatusBadge";
import { PaymentIntentCheckout } from "@/components/payments/PaymentIntentCheckout";
import {
  acceptLabRequest,
  getLabRequest,
  rejectLabRequest,
} from "@/lib/laboratory/labRequestsService";
import type { LabServiceRequest } from "@/types/laboratory";

export default function PatientLabRequestDetailPage() {
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

  const showPay = item
    ? ["accepted", "quote_accepted"].includes((item.status ?? "").toLowerCase())
      && ["unpaid", "failed"].includes((item.payment_status ?? "unpaid").toLowerCase())
    : false;

  return (
    <PatientPageFrame>
      <PageHeader title="Lab request" description={params.id} />
      {item ? (
        <Card className="space-y-3">
          <p className="text-sm text-[var(--color-muted)]">Status: {item.status ?? "-"}</p>
          <p className="text-sm text-[var(--color-muted)]">
            Quoted total: <PriceDisplay amount={item.quoted_total} currency={item.currency} />
          </p>
          <div className="flex items-center gap-2"><span className="text-sm">Payment:</span><PaymentStatusBadge status={item.payment_status} /></div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void acceptLabRequest(item.id).then(refresh)}>Accept quote</Button>
            <Button variant="secondary" onClick={() => void rejectLabRequest(item.id).then(refresh)}>Reject quote</Button>
          </div>

          {showPay ? (
            <PaymentIntentCheckout
              serviceType="lab_request"
              referenceId={item.id}
              disabled={!showPay}
              onSuccess={refresh}
            />
          ) : null}
        </Card>
      ) : null}
    </PatientPageFrame>
  );
}
