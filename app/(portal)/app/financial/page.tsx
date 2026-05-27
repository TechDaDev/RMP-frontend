"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPaymentIntents, getWalletTransactions } from "@/lib/payments/paymentsService";

export default function FinancialDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntentCount, setPaymentIntentCount] = useState(0);
  const [walletTxCount, setWalletTxCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [intents, transactions] = await Promise.all([
          getPaymentIntents(),
          getWalletTransactions(),
        ]);

        if (!active) return;

        setPaymentIntentCount(intents.length);
        setWalletTxCount(transactions.length);
      } catch {
        if (active) {
          setError("Unable to load finance dashboard data.");
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
        title="Finance Dashboard"
        description="Monitor payment intents, wallet movements, and manual recharges."
      />

      {error ? <Card className="text-sm text-red-600 dark:text-red-300">{error}</Card> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Payment intents</p>
          <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">{loading ? "..." : paymentIntentCount}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Wallet transactions</p>
          <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">{loading ? "..." : walletTxCount}</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/app/financial/wallet-transactions" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm font-semibold text-[var(--color-text)] shadow-[var(--card-shadow)]">
          View wallet transactions
        </Link>
        <Link href="/app/financial/payment-intents" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm font-semibold text-[var(--color-text)] shadow-[var(--card-shadow)]">
          View payment intents
        </Link>
        <Link href="/app/financial/manual-recharge" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm font-semibold text-[var(--color-text)] shadow-[var(--card-shadow)]">
          Create manual recharge
        </Link>
        <Link href="/app/financial/provider-earnings" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm font-semibold text-[var(--color-text)] shadow-[var(--card-shadow)]">
          Provider earnings
        </Link>
      </div>
    </div>
  );
}
