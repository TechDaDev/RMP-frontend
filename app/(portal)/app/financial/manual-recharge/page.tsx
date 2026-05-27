"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmActionModal } from "@/components/ui/ConfirmActionModal";
import { adminManualRecharge } from "@/lib/payments/paymentsService";

export default function FinancialManualRechargePage() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleOpenConfirm() {
    setError(null);
    setSuccess(null);

    if (!userId.trim()) {
      setError("User ID is required.");
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
        user: userId.trim(),
        amount,
        description: description.trim() || undefined,
      });

      setSuccess(`Manual recharge completed. Transaction: ${result.id}`);
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

      <Card className="space-y-4">
        <Input
          id="recharge-user"
          label="User ID"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="UUID or user identifier"
        />

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

        <Button onClick={handleOpenConfirm} disabled={submitting}>Review and submit</Button>
      </Card>

      <ConfirmActionModal
        open={confirmOpen}
        title="Confirm manual recharge"
        message={`Recharge user ${userId || "-"} with amount ${amount || "0"}?`}
        confirmLabel="Confirm recharge"
        busy={submitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmRecharge}
      />
    </div>
  );
}
