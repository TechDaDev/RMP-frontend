"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { ApiError } from "@/lib/api/errors";
import {
  buildServicePaymentIntentPayload,
  createPaymentIntent,
  payIntentWithWallet,
} from "@/lib/payments/paymentsService";
import type { PaymentIntent, ServiceType } from "@/types/payments";

interface PaymentIntentCheckoutProps {
  serviceType: Exclude<ServiceType, "wallet_recharge">;
  referenceId: string;
  disabled?: boolean;
  onSuccess?: (intent: PaymentIntent) => Promise<void> | void;
}

export function PaymentIntentCheckout({
  serviceType,
  referenceId,
  disabled = false,
  onSuccess,
}: PaymentIntentCheckoutProps) {
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateIntent() {
    setLoading(true);
    setError(null);

    try {
      const created = await createPaymentIntent(buildServicePaymentIntentPayload(serviceType, referenceId));
      setIntent(created);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to create payment intent.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handlePayWallet() {
    if (!intent?.id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const paid = await payIntentWithWallet(intent.id);
      setIntent(paid);
      await onSuccess?.(paid);
    } catch (err) {
      if (err instanceof ApiError) {
        const message = err.message.toLowerCase().includes("insufficient")
          ? "Insufficient wallet balance. Please recharge your wallet and retry."
          : err.message;
        setError(message);
      } else {
        setError("Wallet payment failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-semibold text-[var(--color-text)]">Service Payment</h3>

      {intent ? (
        <div className="space-y-2 text-sm">
          <p className="text-[var(--color-muted)]">Intent: {intent.id}</p>
          <p className="text-[var(--color-text)]">
            Amount: <PriceDisplay amount={intent.amount} currency={intent.currency} />
          </p>
          <p className="text-[var(--color-text)]">Status: {intent.status ?? "unpaid"}</p>

          <Button onClick={() => void handlePayWallet()} disabled={disabled || loading || intent.status === "paid"}>
            {loading ? "Processing..." : "Pay with wallet"}
          </Button>
        </div>
      ) : (
        <Button onClick={() => void handleCreateIntent()} disabled={disabled || loading}>
          {loading ? "Preparing..." : "Create payment intent"}
        </Button>
      )}

      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}
    </Card>
  );
}
