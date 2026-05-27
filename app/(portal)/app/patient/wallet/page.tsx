"use client";

import { useEffect, useState } from "react";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { PageHeader } from "@/components/ui/PageHeader";
import { WalletBalanceCard } from "@/components/payments/WalletBalanceCard";
import { TransactionHistoryTable } from "@/components/payments/TransactionHistoryTable";
import { getWallet, getWalletTransactions } from "@/lib/payments/paymentsService";
import type { Wallet, WalletTransaction } from "@/types/payments";

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [walletData, txData] = await Promise.all([
          getWallet(),
          getWalletTransactions({ limit: 50 }),
        ]);
        setWallet(walletData);
        setTransactions(txData);
      } catch {
        setError("Unable to load wallet right now.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  return (
    <PatientPageFrame>
      <PageHeader title="Wallet" description="Balance and transaction history" />
      <WalletBalanceCard wallet={wallet} loading={loading} error={error} />
      <TransactionHistoryTable transactions={transactions} loading={loading} error={error} />
    </PatientPageFrame>
  );
}
