"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getRechargeRequests } from "@/lib/payments/paymentsService";
import type { RechargeRequest } from "@/types/payments";

function statusLabel(status: string, t: ReturnType<typeof useAppPreferences>["t"]): string {
  if (status === "pending_review") return t.patient.rechargeRequestStatusPendingReview;
  if (status === "approved") return t.patient.rechargeRequestStatusApproved;
  if (status === "rejected") return t.patient.rechargeRequestStatusRejected;
  return t.patient.rechargeRequestStatusUnknown;
}

function statusVariant(status: string): "neutral" | "success" | "warning" | "danger" {
  if (status === "pending_review") return "warning";
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "neutral";
}

export default function RechargeRequestsListPage() {
  const { t } = useAppPreferences();
  const [requests, setRequests] = useState<RechargeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRechargeRequests();
      setRequests(data);
    } catch {
      setError(t.patient.rechargeRequestLoadFailed);
    } finally {
      setLoading(false);
    }
  }, [t.patient.rechargeRequestLoadFailed]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return (
    <PatientPageFrame>
      <PageHeader
        title={t.patient.rechargeRequestsTitle}
        description={t.patient.rechargeRequestsSubtitle}
        actions={
          <Link href="/app/patient/wallet/recharge-request">
            <Button>{t.patient.rechargeRequestNew}</Button>
          </Link>
        }
      />

      {loading && <p className="text-sm text-muted-foreground">{t.common.loading}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground text-sm">
          {t.patient.rechargeRequestEmpty}
        </Card>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone={statusVariant(req.status)}>
                      {statusLabel(req.status, t)}
                    </Badge>
                    <span className="font-semibold text-sm">{req.amount} {req.currency ?? ""}</span>
                  </div>
                  {req.created_at && (
                    <p className="text-xs text-muted-foreground">
                      {t.patient.walletTransactionsDate}: {new Date(req.created_at).toLocaleString()}
                    </p>
                  )}
                  {req.review_note && (
                    <p className="text-xs text-muted-foreground">{t.patient.rechargeRequestReviewNote}: {req.review_note}</p>
                  )}
                </div>
                <Link href={`/app/patient/wallet/recharge-requests/${req.id}`}>
                  <Button variant="secondary">{t.admin.viewDetails}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PatientPageFrame>
  );
}
