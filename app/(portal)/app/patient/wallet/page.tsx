"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { WalletBalanceCard } from "@/components/payments/WalletBalanceCard";
import { TransactionHistoryTable } from "@/components/payments/TransactionHistoryTable";
import { getWallet, getWalletTransactions } from "@/lib/payments/paymentsService";
import type { Wallet, WalletTransaction } from "@/types/payments";

const WALLET_UPDATED_EVENT = "payments:wallet-updated";
const WALLET_POLL_INTERVAL_MS = 20000;

export default function WalletPage() {
  const { t } = useAppPreferences();
  const pathname = usePathname();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = useCallback(async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const [walletData, txData] = await Promise.all([
        getWallet(),
        getWalletTransactions({ limit: 50 }),
      ]);
      setWallet(walletData);
      setTransactions(txData);
    } catch {
      setError(t.patient.walletLoadFailed);
    } finally {
      if (silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [t.patient.walletLoadFailed]);

  useEffect(() => {
    if (!pathname.startsWith("/app/patient/wallet")) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadWallet();
  }, [loadWallet, pathname]);

  useEffect(() => {
    function handleWindowFocus() {
      if (pathname.startsWith("/app/patient/wallet")) {
        void loadWallet(true);
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && pathname.startsWith("/app/patient/wallet")) {
        void loadWallet(true);
      }
    }

    function handleWalletUpdated() {
      if (pathname.startsWith("/app/patient/wallet")) {
        void loadWallet(true);
      }
    }

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener(WALLET_UPDATED_EVENT, handleWalletUpdated);

    return () => {
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener(WALLET_UPDATED_EVENT, handleWalletUpdated);
    };
  }, [loadWallet, pathname]);

  useEffect(() => {
    if (!pathname.startsWith("/app/patient/wallet")) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadWallet(true);
    }, WALLET_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadWallet, pathname]);

  return (
    <PatientPageFrame>
      <PageHeader
        title={t.patient.walletTitle}
        description={t.patient.walletSubtitle}
        actions={
          <div className="flex gap-2 flex-wrap">
            <Link href="/app/patient/wallet/recharge-request">
              <Button>{t.patient.rechargeRequestNew}</Button>
            </Link>
            <Button variant="secondary" onClick={() => void loadWallet(true)} disabled={loading || refreshing}>{refreshing ? t.common.loading : t.common.retry}</Button>
          </div>
        }
      />
      <WalletBalanceCard wallet={wallet} loading={loading} error={error} />
      <TransactionHistoryTable transactions={transactions} loading={loading} error={error} />
    </PatientPageFrame>
  );
}
