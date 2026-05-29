"use client";

import { useState } from "react";
import { AdminWalletSelector } from "@/components/payments/AdminWalletSelector";
import { MoneyDisplay } from "@/components/payments/MoneyDisplay";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmActionModal } from "@/components/ui/ConfirmActionModal";
import { adminManualRecharge } from "@/lib/payments/paymentsService";
import type { AdminWalletSearchResult } from "@/types/payments";

const WALLET_UPDATED_EVENT = "payments:wallet-updated";

function canRechargeWallet(wallet: AdminWalletSearchResult | null): boolean {
  const status = (wallet?.status ?? "").toLowerCase();
  return Boolean(wallet) && status !== "frozen" && status !== "closed";
}

export default function FinancialManualRechargePage() {
  const [selectedWallet, setSelectedWallet] = useState<AdminWalletSearchResult | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleOpenConfirm() {
    setError(null);
    setSuccess(null);

    if (!selectedWallet?.user) {
      setError("Select a wallet before creating a recharge.");
      return;
    }

    if (!canRechargeWallet(selectedWallet)) {
      setError("Selected wallet cannot be recharged while it is frozen or closed.");
      return;
    }

    if (!amount.trim() || Number(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    setConfirmOpen(true);
  }

  async function handleConfirmRecharge() {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await adminManualRecharge({
        user: selectedWallet?.user,
        amount,
        description: description.trim() || undefined,
      });

      setSuccess(`Manual recharge completed. Transaction: ${result.id}`);
      window.dispatchEvent(new Event(WALLET_UPDATED_EVENT));
      setConfirmOpen(false);
      setAmount("");
      setDescription("");
    } catch {
      setError("Manual recharge failed. Please verify details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">Financial</Badge>}
        title="Manual Wallet Recharge"
        description="Create controlled manual credits for user wallets with confirmation."
      />

      <AdminWalletSelector
        selectedWallet={selectedWallet}
        onSelect={setSelectedWallet}
        title="Select wallet owner"
        description="Search by email or name, then use the selected wallet owner for the manual recharge payload."
      />

      <Card className="space-y-4">
        {selectedWallet ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm text-[var(--color-muted)]">
            <p className="font-semibold text-[var(--color-text)]">{selectedWallet.user_full_name || selectedWallet.user_email || selectedWallet.user}</p>
            <p dir="ltr">{selectedWallet.user_email || "-"}</p>
            <p>Wallet ID: {selectedWallet.id}</p>
            <p>User ID: {selectedWallet.user}</p>
            <p>Balance: <MoneyDisplay amount={selectedWallet.cached_balance} currency={selectedWallet.currency} /></p>
            <p>Status: {selectedWallet.status || "unknown"}</p>
          </div>
        ) : null}

        <Input
          id="recharge-amount"
          label="Amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.00"
        />

        <Input
          id="recharge-description"
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Reason for manual recharge"
        />

        {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}
        {success ? <p className="text-sm font-medium text-green-700 dark:text-green-300">{success}</p> : null}

        <Button onClick={handleOpenConfirm} disabled={submitting || !canRechargeWallet(selectedWallet)}>Review and submit</Button>
      </Card>

      <ConfirmActionModal
        open={confirmOpen}
        title="Confirm manual recharge"
        message={`Recharge wallet owner ${selectedWallet?.user_email || selectedWallet?.user || "-"} with amount ${amount || "0"}?`}
        confirmLabel="Confirm recharge"
        busy={submitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmRecharge}
      />
    </div>
  );
}
