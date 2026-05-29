"use client";

import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
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
  const { t } = useAppPreferences();
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
      setError(t.admin.financeManualRechargeSelectWalletError);
      return;
    }

    if (!canRechargeWallet(selectedWallet)) {
      setError(t.admin.financeManualRechargeWalletStatusError);
      return;
    }

    if (!amount.trim() || Number(amount) <= 0) {
      setError(t.admin.financeManualRechargeAmountError);
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

      setSuccess(t.admin.financeManualRechargeSuccess.replace("{id}", result.id));
      window.dispatchEvent(new Event(WALLET_UPDATED_EVENT));
      setConfirmOpen(false);
      setAmount("");
      setDescription("");
    } catch {
      setError(t.admin.financeManualRechargeFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.admin.financeRoleBadge}</Badge>}
        title={t.admin.financeManualRechargeTitle}
        description={t.admin.financeManualRechargeSubtitle}
      />

      <AdminWalletSelector
        selectedWallet={selectedWallet}
        onSelect={setSelectedWallet}
        title={t.admin.financeManualRechargeSelectWallet}
        description={t.admin.financeManualRechargeSelectWalletDescription}
      />

      <Card className="space-y-4">
        {selectedWallet ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm text-[var(--color-muted)]">
            <p className="font-semibold text-[var(--color-text)]">{selectedWallet.user_full_name || selectedWallet.user_email || selectedWallet.user}</p>
            <p dir="ltr">{selectedWallet.user_email || "-"}</p>
            <p>{t.admin.walletIdLabel}: {selectedWallet.id}</p>
            <p>{t.admin.walletOwnerIdLabel}: {selectedWallet.user}</p>
            <p>{t.admin.financeManualRechargeAmountLabel}: <MoneyDisplay amount={selectedWallet.cached_balance} currency={selectedWallet.currency} /></p>
            <p>{t.admin.walletStatusLabel}: {selectedWallet.status || t.admin.walletUnknown}</p>
          </div>
        ) : null}

        <Input
          id="recharge-amount"
          label={t.admin.financeManualRechargeAmountLabel}
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
          label={t.admin.financeManualRechargeDescriptionLabel}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t.admin.financeManualRechargeDescriptionPlaceholder}
        />

        {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}
        {success ? <p className="text-sm font-medium text-green-700 dark:text-green-300">{success}</p> : null}

        <Button onClick={handleOpenConfirm} disabled={submitting || !canRechargeWallet(selectedWallet)}>{t.admin.financeManualRechargeReviewSubmit}</Button>
      </Card>

      <ConfirmActionModal
        open={confirmOpen}
        title={t.admin.financeManualRechargeConfirmTitle}
        message={`Recharge wallet owner ${selectedWallet?.user_email || selectedWallet?.user || "-"} with amount ${amount || "0"}?`}
        confirmLabel={t.admin.financeManualRechargeConfirmLabel}
        cancelLabel={t.common.cancel}
        busy={submitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmRecharge}
      />
    </div>
  );
}
