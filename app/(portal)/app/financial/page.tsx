"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAllowedAdminSections, hasAdminSection } from "@/lib/admin/adminSections";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { getPaymentIntents, getRechargeRequests, getWalletTransactions } from "@/lib/payments/paymentsService";
import { requestRechargePendingCountRefresh } from "@/lib/payments/rechargeEvents";

export default function FinancialDashboardPage() {
  const { t } = useAppPreferences();
  const { user, profile, effectiveRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntentCount, setPaymentIntentCount] = useState(0);
  const [walletTxCount, setWalletTxCount] = useState(0);
  const [pendingRechargeCount, setPendingRechargeCount] = useState(0);
  const allowedSections = getAllowedAdminSections({ user, profile, role: effectiveRole });
  const canOpenRechargeQueue = hasAdminSection(allowedSections, "recharge_requests") || hasAdminSection(allowedSections, "finance_dashboard");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [intents, transactions, pendingRecharges] = await Promise.all([
          getPaymentIntents(),
          getWalletTransactions(),
          getRechargeRequests({ status: "pending_review", limit: 50 }),
        ]);

        if (!active) return;

        setPaymentIntentCount(intents.length);
        setWalletTxCount(transactions.length);
        setPendingRechargeCount(pendingRecharges.length);
        requestRechargePendingCountRefresh();
      } catch {
        if (active) {
          setError(t.admin.financeDashboardLoadFailed);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    const pollId = window.setInterval(() => {
      void load();
    }, 25000);

    function handleFocus() {
      void load();
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      window.clearInterval(pollId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [t.admin.financeDashboardLoadFailed]);

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.admin.financeRoleBadge}</Badge>}
        title={t.admin.financeDashboardTitle}
        description={t.admin.financeDashboardSubtitle}
      />

      {error ? <Card className="text-sm text-red-600 dark:text-red-300">{error}</Card> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">{t.admin.financeMetricPaymentIntents}</p>
          <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">{loading ? "..." : paymentIntentCount}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">{t.admin.financeMetricWalletTransactions}</p>
          <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">{loading ? "..." : walletTxCount}</p>
        </Card>
        {canOpenRechargeQueue ? (
          <Link
            href="/app/financial/recharge-requests"
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--card-shadow)]"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">{t.admin.financeViewRechargeRequests}</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-2xl font-bold text-[var(--color-text)]">{loading ? "..." : pendingRechargeCount}</p>
              {!loading && pendingRechargeCount > 0 ? (
                <Badge tone="warning">{pendingRechargeCount}</Badge>
              ) : null}
            </div>
            {!loading && pendingRechargeCount === 0 ? (
              <p className="mt-2 text-xs text-[var(--color-muted)]">{t.admin.financeRechargeNoPending}</p>
            ) : null}
          </Link>
        ) : (
          <Card>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">{t.admin.financeViewRechargeRequests}</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-2xl font-bold text-[var(--color-text)]">{loading ? "..." : pendingRechargeCount}</p>
              {!loading && pendingRechargeCount > 0 ? (
                <Badge tone="warning">{pendingRechargeCount}</Badge>
              ) : null}
            </div>
          </Card>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/app/financial/wallet-transactions" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm font-semibold text-[var(--color-text)] shadow-[var(--card-shadow)]">
          {t.admin.financeViewWalletTransactions}
        </Link>
        <Link href="/app/financial/payment-intents" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm font-semibold text-[var(--color-text)] shadow-[var(--card-shadow)]">
          {t.admin.financeViewPaymentIntents}
        </Link>
        <Link href="/app/financial/manual-recharge" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm font-semibold text-[var(--color-text)] shadow-[var(--card-shadow)]">
          {t.admin.financeCreateManualRecharge}
        </Link>
        <Link href="/app/financial/provider-earnings" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm font-semibold text-[var(--color-text)] shadow-[var(--card-shadow)]">
          {t.admin.financeProviderEarnings}
        </Link>
      </div>
    </div>
  );
}
