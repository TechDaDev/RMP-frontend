"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|webp|gif)(\?.*)?$/i.test(url);
}

function ReceiptModal({ url, onClose }: { url: string; onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <span className="text-sm font-medium">Receipt</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-2 flex items-center justify-center min-h-0">
          {isImageUrl(url) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt="Receipt"
              className="max-w-full max-h-[75vh] object-contain rounded"
            />
          ) : (
            <iframe
              src={url}
              title="Receipt"
              className="w-full h-[75vh] rounded border-0"
            />
          )}
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t shrink-0">
          <a
            href={url}
            download
            className="text-sm text-primary underline"
          >
            Download
          </a>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

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
  const [receiptOpen, setReceiptOpen] = useState(false);

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
              <button
                type="button"
                onClick={() => setReceiptOpen(true)}
                className="inline-flex items-center gap-1 text-sm text-primary underline hover:no-underline"
              >
                {t.patient.rechargeRequestReceiptLink}
              </button>
            </div>
          )}
        </Card>
      )}

      {receiptOpen && request?.receipt_file_url && (
        <ReceiptModal url={request.receipt_file_url} onClose={() => setReceiptOpen(false)} />
      )}
    </PatientPageFrame>
  );
}
