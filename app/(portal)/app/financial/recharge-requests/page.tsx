"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { getRechargeRequests } from "@/lib/payments/paymentsService";
import type { RechargeRequest, RechargeRequestListParams } from "@/types/payments";

function statusVariant(status: string): "neutral" | "success" | "warning" | "danger" {
  if (status === "pending_review") return "warning";
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "neutral";
}

export default function FinancialRechargeRequestsPage() {
  const { t } = useAppPreferences();
  const [requests, setRequests] = useState<RechargeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [appliedEmail, setAppliedEmail] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");

  const statusOptions = [
    { value: "", label: t.admin.financeRechargeQueueFilterAll },
    { value: "pending_review", label: t.admin.financeRechargeStatusPendingReview },
    { value: "approved", label: t.admin.financeRechargeStatusApproved },
    { value: "rejected", label: t.admin.financeRechargeStatusRejected },
  ];

  const load = useCallback(async (params: RechargeRequestListParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRechargeRequests(params);
      setRequests(data);
    } catch {
      setError(t.admin.financeRechargeQueueLoadFailed);
    } finally {
      setLoading(false);
    }
  }, [t.admin.financeRechargeQueueLoadFailed]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load({ status: appliedStatus || undefined, email: appliedEmail || undefined });
  }, [load, appliedStatus, appliedEmail]);

  function handleApplyFilters() {
    setAppliedStatus(filterStatus);
    setAppliedEmail(filterEmail);
  }

  function statusLabel(status: string): string {
    if (status === "pending_review") return t.admin.financeRechargeStatusPendingReview;
    if (status === "approved") return t.admin.financeRechargeStatusApproved;
    if (status === "rejected") return t.admin.financeRechargeStatusRejected;
    return status;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.admin.financeRechargeQueueTitle}
        description={t.admin.financeRechargeQueueSubtitle}
      />

      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label htmlFor="rr-filter-status" className="block text-xs font-medium mb-1">
              {t.admin.financeRechargeQueueFilterStatus}
            </label>
            <select
              id="rr-filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Input
              id="rr-filter-email"
              label={t.admin.financeRechargeQueueFilterEmail}
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
              placeholder={t.admin.financeRechargeQueueFilterEmailPlaceholder}
              className="w-56"
            />
          </div>
          <Button onClick={handleApplyFilters}>{t.admin.financeRechargeQueueApplyFilters}</Button>
        </div>
      </Card>

      {loading && <p className="text-sm text-muted-foreground">{t.common.loading}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          {t.admin.financeRechargeQueueEmpty}
        </Card>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-start font-medium text-xs uppercase tracking-wide">ID</th>
                <th className="px-4 py-3 text-start font-medium text-xs uppercase tracking-wide">
                  {t.admin.financeRechargeDetailUserLabel}
                </th>
                <th className="px-4 py-3 text-start font-medium text-xs uppercase tracking-wide">
                  {t.patient.rechargeRequestAmountLabel}
                </th>
                <th className="px-4 py-3 text-start font-medium text-xs uppercase tracking-wide">
                  {t.patient.walletTransactionsStatus}
                </th>
                <th className="px-4 py-3 text-start font-medium text-xs uppercase tracking-wide">
                  {t.patient.walletTransactionsDate}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{req.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3">{req.user_email ?? req.user ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold">{req.amount} {req.currency ?? ""}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusVariant(req.status)}>{statusLabel(req.status)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {req.created_at ? new Date(req.created_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Link href={`/app/financial/recharge-requests/${req.id}`}>
                      <Button variant="secondary">{t.admin.viewDetails}</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
