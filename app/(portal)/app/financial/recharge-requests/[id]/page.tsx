"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmActionModal } from "@/components/ui/ConfirmActionModal";
import { ApiError } from "@/lib/api/errors";
import {
  approveRechargeRequest,
  getRechargeRequestDetail,
  rejectRechargeRequest,
} from "@/lib/payments/paymentsService";
import { requestRechargePendingCountRefresh } from "@/lib/payments/rechargeEvents";
import type { RechargeRequest } from "@/types/payments";

const WALLET_UPDATED_EVENT = "payments:wallet-updated";

function statusVariant(status: string): "neutral" | "success" | "warning" | "danger" {
  if (status === "pending_review") return "warning";
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "neutral";
}

export default function FinancialRechargeRequestDetailPage() {
  const router = useRouter();
  const { t } = useAppPreferences();
  const params = useParams();
  const id = params.id as string;

  const [request, setRequest] = useState<RechargeRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [decisionSuccess, setDecisionSuccess] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setShowRetry(false);
    try {
      const data = await getRechargeRequestDetail(id);
      setRequest(data);
      setPermissionDenied(false);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.push("/login");
        return;
      }

      if (err instanceof ApiError && err.status === 403) {
        setPermissionDenied(true);
        setError(t.admin.financeRechargePermissionDenied);
        return;
      }

      if (err instanceof ApiError && err.status >= 500) {
        setShowRetry(true);
      }

      if (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 404) {
        setError(t.admin.financeRechargeDetailNotFound);
      } else {
        setError(t.admin.financeRechargeDetailLoadFailed);
      }
    } finally {
      setLoading(false);
    }
  }, [
    id,
    router,
    t.admin.financeRechargeDetailLoadFailed,
    t.admin.financeRechargeDetailNotFound,
    t.admin.financeRechargePermissionDenied,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function handleDecision(action: "approve" | "reject") {
    if (submitting) return;
    setSubmitting(true);
    setDecisionError(null);
    setDecisionSuccess(null);
    setConfirmAction(null);

    try {
      const payload = reviewNote.trim() ? { review_note: reviewNote.trim() } : undefined;
      let updated: RechargeRequest;
      if (action === "approve") {
        updated = await approveRechargeRequest(id, payload);
        window.dispatchEvent(new Event(WALLET_UPDATED_EVENT));
      } else {
        updated = await rejectRechargeRequest(id, payload);
      }
      setRequest(updated);
      setDecisionSuccess(t.admin.financeRechargeDecisionSucceeded);
      requestRechargePendingCountRefresh();
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.push("/login");
        return;
      }

      if (err instanceof ApiError && err.status === 403) {
        setPermissionDenied(true);
        setDecisionError(t.admin.financeRechargePermissionDenied);
        return;
      }

      if (err instanceof ApiError && err.status >= 500) {
        setShowRetry(true);
      }

      setDecisionError(t.admin.financeRechargeDecisionFailed);
    } finally {
      setSubmitting(false);
    }
  }

  function statusLabel(status: string): string {
    if (status === "pending_review") return t.admin.financeRechargeStatusPendingReview;
    if (status === "approved") return t.admin.financeRechargeStatusApproved;
    if (status === "rejected") return t.admin.financeRechargeStatusRejected;
    return status;
  }

  const isPending = request?.status === "pending_review";

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.admin.financeRechargeDetailTitle}
        description={t.admin.financeRechargeDetailSubtitle}
        actions={
          <Link href="/app/financial/recharge-requests">
            <Button variant="secondary">{t.admin.financeRechargeBackToQueue}</Button>
          </Link>
        }
      />

      {loading && <p className="text-sm text-muted-foreground">{t.common.loading}</p>}
      {showRetry && (
        <Card className="p-4 border border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm">{t.admin.financeRechargeDetailServerError}</p>
            <Button variant="secondary" onClick={() => { void load(); }}>{t.common.retry}</Button>
          </div>
        </Card>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && request && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge tone={statusVariant(request.status)}>{statusLabel(request.status)}</Badge>
              <span className="text-xl font-bold">{request.amount} {request.currency ?? ""}</span>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block">{t.admin.financeRechargeDetailUserLabel}</span>
              <p className="text-sm">{request.user_full_name ?? request.user_email ?? request.user ?? "—"}</p>
              {request.user_email && request.user_full_name && (
                <p className="text-xs text-muted-foreground">{request.user_email}</p>
              )}
            </div>

            {request.created_at && (
              <div>
                <span className="text-xs text-muted-foreground block">{t.patient.walletTransactionsDate}</span>
                <p className="text-sm">{new Date(request.created_at).toLocaleString()}</p>
              </div>
            )}

            {request.note && (
              <div>
                <span className="text-xs text-muted-foreground block">{t.admin.financeRechargeDetailNoteLabel}</span>
                <p className="text-sm">{request.note}</p>
              </div>
            )}

            {request.receipt_file_url ? (
              <div>
                <a
                  href={request.receipt_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary underline"
                >
                  {t.admin.financeRechargeDetailReceiptLink}
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t.admin.financeRechargeDetailReceiptMissing}</p>
            )}

            {request.review_note && (
              <div>
                <span className="text-xs text-muted-foreground block">{t.patient.rechargeRequestReviewNote}</span>
                <p className="text-sm">{request.review_note}</p>
              </div>
            )}

            {request.reviewed_by_email && (
              <div>
                <span className="text-xs text-muted-foreground block">{t.patient.rechargeRequestReviewedBy}</span>
                <p className="text-sm">{request.reviewed_by_email}</p>
              </div>
            )}

            {request.reviewed_at && (
              <div>
                <span className="text-xs text-muted-foreground block">{t.patient.rechargeRequestReviewedAt}</span>
                <p className="text-sm">{new Date(request.reviewed_at).toLocaleString()}</p>
              </div>
            )}
          </Card>

          {isPending && !permissionDenied && (
            <Card className="p-6 space-y-4">
              <div>
                <label htmlFor="review-note" className="block text-sm font-medium mb-1">
                  {t.admin.financeRechargeDetailReviewNoteLabel}
                </label>
                <textarea
                  id="review-note"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder={t.admin.financeRechargeDetailReviewNoteHint}
                />
              </div>

              {decisionError && <p className="text-sm text-destructive">{decisionError}</p>}
              {decisionSuccess && <p className="text-sm text-green-600 dark:text-green-400">{decisionSuccess}</p>}

              <div className="flex gap-3">
                <Button
                  onClick={() => setConfirmAction("approve")}
                  disabled={submitting}
                  className="flex-1"
                >
                  {t.admin.financeRechargeApproveAction}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setConfirmAction("reject")}
                  disabled={submitting}
                  className="flex-1"
                >
                  {t.admin.financeRechargeRejectAction}
                </Button>
              </div>
            </Card>
          )}

          {!isPending && (decisionSuccess || request.status !== "pending_review") && (
            <Card className="p-6 flex items-center justify-center text-sm text-muted-foreground">
              {t.admin.noMoreActionsAvailable}
            </Card>
          )}
        </div>
      )}

      {confirmAction === "approve" && (
        <ConfirmActionModal
          open={true}
          title={t.admin.financeRechargeApproveConfirmTitle}
          message={t.admin.financeRechargeApproveConfirmLabel}
          confirmLabel={t.admin.financeRechargeApproveAction}
          cancelLabel={t.common.cancel}
          onConfirm={() => { void handleDecision("approve"); }}
          onCancel={() => setConfirmAction(null)}
          busy={submitting}
        />
      )}

      {confirmAction === "reject" && (
        <ConfirmActionModal
          open={true}
          title={t.admin.financeRechargeRejectConfirmTitle}
          message={t.admin.financeRechargeRejectConfirmLabel}
          confirmLabel={t.admin.financeRechargeRejectAction}
          cancelLabel={t.common.cancel}
          onConfirm={() => { void handleDecision("reject"); }}
          onCancel={() => setConfirmAction(null)}
          busy={submitting}
        />
      )}
    </div>
  );
}
