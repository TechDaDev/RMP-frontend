"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getRechargeRequestDetail } from "@/lib/payments/paymentsService";
import { ApiError } from "@/lib/api/errors";
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

export default function RechargeRequestDetailPage() {
  const { t } = useAppPreferences();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [request, setRequest] = useState<RechargeRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    setShowRetry(false);
    try {
      const data = await getRechargeRequestDetail(id);
      setRequest(data);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          router.push("/login");
          return;
        }
        if (err.status === 404) {
          setNotFound(true);
          return;
        }
        if (err.status >= 500) {
          setShowRetry(true);
          return;
        }
      }
      setError(t.patient.rechargeRequestDetailLoadFailed);
    } finally {
      setLoading(false);
    }
  }, [id, router, t.patient.rechargeRequestDetailLoadFailed]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const showReceipt = Boolean(request?.receipt_file_url);

  return (
    <PatientPageFrame>
      <PageHeader
        title={t.patient.rechargeRequestTitle}
        description={t.patient.rechargeRequestSubtitle}
        actions={
          <Link href="/app/patient/wallet/recharge-requests">
            <Button variant="secondary">{t.patient.rechargeRequestBackToList}</Button>
          </Link>
        }
      />

      {loading && <p className="text-sm text-muted-foreground">{t.common.loading}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {notFound && (
        <p className="text-sm text-muted-foreground">{t.patient.rechargeRequestDetailNotFound}</p>
      )}

      {showRetry && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-destructive">{t.patient.rechargeRequestDetailServerError}</p>
          <Button variant="secondary" onClick={() => { void load(); }}>
            {t.common.retry}
          </Button>
        </div>
      )}

      {!loading && !error && request && (
        <Card className="max-w-lg p-6 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge tone={statusVariant(request.status)}>
              {statusLabel(request.status, t)}
            </Badge>
            <span className="text-xl font-bold">
              {request.amount} {request.currency ?? ""}
            </span>
          </div>

          {request.created_at && (
            <div>
              <span className="text-xs text-muted-foreground block">
                {t.patient.walletTransactionsDate}
              </span>
              <span className="text-sm">{new Date(request.created_at).toLocaleString()}</span>
            </div>
          )}

          {request.note && (
            <div>
              <span className="text-xs text-muted-foreground block">
                {t.patient.rechargeRequestNoteLabel}
              </span>
              <p className="text-sm">{request.note}</p>
            </div>
          )}

          {request.review_note && (
            <div>
              <span className="text-xs text-muted-foreground block">
                {t.patient.rechargeRequestReviewNote}
              </span>
              <p className="text-sm">{request.review_note}</p>
            </div>
          )}

          {request.reviewed_by_email && (
            <div>
              <span className="text-xs text-muted-foreground block">
                {t.patient.rechargeRequestReviewedBy}
              </span>
              <p className="text-sm">{request.reviewed_by_email}</p>
            </div>
          )}

          {request.reviewed_at && (
            <div>
              <span className="text-xs text-muted-foreground block">
                {t.patient.rechargeRequestReviewedAt}
              </span>
              <p className="text-sm">{new Date(request.reviewed_at).toLocaleString()}</p>
            </div>
          )}

          {showReceipt && request.receipt_file_url && (
            <div>
              <a
                href={request.receipt_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary underline"
              >
                {t.patient.rechargeRequestReceiptLink}
              </a>
            </div>
          )}
        </Card>
      )}
    </PatientPageFrame>
  );
}
