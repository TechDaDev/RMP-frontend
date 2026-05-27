"use client";

import { useEffect, useState } from "react";
import { MoneyDisplay } from "@/components/payments/MoneyDisplay";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getWalletTransactions } from "@/lib/payments/paymentsService";
import type { WalletTransaction } from "@/types/payments";

export default function FinancialWalletTransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getWalletTransactions();
        if (!active) return;
        setTransactions(data);
      } catch {
        if (active) {
          setError("Failed to load wallet transactions.");
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

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">Financial</Badge>}
        title="Wallet Transactions"
        description="Track incoming and outgoing wallet operations across the platform."
      />

      <Card className="space-y-3 overflow-x-auto">
        {loading ? <p className="text-sm text-[var(--color-muted)]">Loading transactions...</p> : null}
        {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}
        {!loading && !error && transactions.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">No wallet transactions found.</p>
        ) : null}

        {!loading && !error && transactions.length > 0 ? (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Reference</th>
                <th className="px-2 py-2">External Ref</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={item.id} className="border-b border-[var(--color-border)] text-[var(--color-text)]">
                  <td className="px-2 py-2">{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                  <td className="px-2 py-2">{item.transaction_type ?? "-"}</td>
                  <td className="px-2 py-2"><MoneyDisplay amount={item.amount} currency={item.currency} /></td>
                  <td className="px-2 py-2">{item.status ?? "-"}</td>
                  <td className="px-2 py-2">{item.reference_id ?? "-"}</td>
                  <td className="px-2 py-2">{item.external_reference ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </Card>
    </div>
  );
}
