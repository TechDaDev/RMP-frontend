"use client";

import { useEffect, useMemo, useState } from "react";
import { MoneyDisplay } from "@/components/payments/MoneyDisplay";
import { PaymentIntentStatusBadge } from "@/components/payments/PaymentIntentStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPaymentIntentDetail, getPaymentIntents } from "@/lib/payments/paymentsService";
import type { PaymentIntent } from "@/types/payments";

export default function FinancialPaymentIntentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intents, setIntents] = useState<PaymentIntent[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<PaymentIntent | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getPaymentIntents();
        if (!active) return;
        setIntents(data);
      } catch {
        if (active) {
          setError("Failed to load payment intents.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const selectedOptions = useMemo(
    () => intents.map((item) => ({ id: item.id, label: `${item.id} (${item.status ?? "unknown"})` })),
    [intents],
  );

  async function handleLoadDetail() {
    if (!selectedId) {
      return;
    }

    try {
      const item = await getPaymentIntentDetail(selectedId);
      setDetail(item);
    } catch {
      setDetail(null);
      setError("Failed to load selected intent details.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">Financial</Badge>}
        title="Payment Intents"
        description="Inspect payment intents and verify status transitions."
      />

      {error ? <Card className="text-sm text-red-600 dark:text-red-300">{error}</Card> : null}

      <Card className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="block space-y-2" htmlFor="intent-id">
            <span className="text-sm font-semibold text-[var(--color-text)]">Load by intent ID</span>
            <select
              id="intent-id"
              className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)]"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              <option value="">Select an intent</option>
              {selectedOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </label>
          <Button variant="secondary" onClick={() => void handleLoadDetail()} disabled={!selectedId}>Load details</Button>
        </div>

        {detail ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[var(--color-text)]">{detail.id}</p>
              <PaymentIntentStatusBadge status={detail.status} />
            </div>
            <div className="mt-3 grid gap-2 text-sm text-[var(--color-muted)] sm:grid-cols-2">
              <p>Service type: {detail.service_type ?? "-"}</p>
              <p>Reference: {detail.reference_id ?? "-"}</p>
              <p>Method: {detail.payment_method ?? "-"}</p>
              <p>Amount: <MoneyDisplay amount={detail.amount} currency={detail.currency} /></p>
              <p>Provider txn: {detail.provider_transaction_id ?? "-"}</p>
              <p>Created: {detail.created_at ? new Date(detail.created_at).toLocaleString() : "-"}</p>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="space-y-3 overflow-x-auto">
        {loading ? <p className="text-sm text-[var(--color-muted)]">Loading intents...</p> : null}
        {!loading && intents.length === 0 ? <p className="text-sm text-[var(--color-muted)]">No payment intents found.</p> : null}

        {!loading && intents.length > 0 ? (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
                <th className="px-2 py-2">ID</th>
                <th className="px-2 py-2">Service</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Payment Method</th>
                <th className="px-2 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {intents.map((item) => (
                <tr key={item.id} className="border-b border-[var(--color-border)] text-[var(--color-text)]">
                  <td className="px-2 py-2">{item.id}</td>
                  <td className="px-2 py-2">{item.service_type}</td>
                  <td className="px-2 py-2"><MoneyDisplay amount={item.amount} currency={item.currency} /></td>
                  <td className="px-2 py-2"><PaymentIntentStatusBadge status={item.status} /></td>
                  <td className="px-2 py-2">{item.payment_method ?? "-"}</td>
                  <td className="px-2 py-2">{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </Card>
    </div>
  );
}
