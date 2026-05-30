"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { createRechargeRequest } from "@/lib/payments/paymentsService";
import { ApiError } from "@/lib/api/errors";

const WALLET_UPDATED_EVENT = "payments:wallet-updated";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export default function RechargeRequestPage() {
  const { t } = useAppPreferences();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amountFieldError, setAmountFieldError] = useState<string | null>(null);
  const [receiptFieldError, setReceiptFieldError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const picked = e.target.files?.[0] ?? null;
    if (!picked) {
      setFile(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(picked.type)) {
      setFileError(t.patient.rechargeRequestFileTypeError);
      setFile(null);
      return;
    }
    if (picked.size > MAX_FILE_BYTES) {
      setFileError(t.patient.rechargeRequestFileSizeError);
      setFile(null);
      return;
    }
    setFile(picked);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setAmountFieldError(null);
    setReceiptFieldError(null);

    if (!amount.trim() || Number(amount) <= 0) {
      setError(t.patient.rechargeRequestAmountError);
      return;
    }
    if (!file) {
      setError(t.patient.rechargeRequestFileRequired);
      return;
    }

    setSubmitting(true);

    try {
      await createRechargeRequest({
        amount: amount.trim(),
        note: note.trim() || undefined,
        receipt_file: file,
      });

      window.dispatchEvent(new Event(WALLET_UPDATED_EVENT));
      setSuccess(t.patient.rechargeRequestSuccess);
      setAmount("");
      setNote("");
      setFile(null);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 400) {
        const amtErr = err.fieldErrors?.amount?.[0] ?? null;
        const fileErr = err.fieldErrors?.receipt_file?.[0] ?? null;
        if (amtErr) setAmountFieldError(amtErr);
        if (fileErr) setReceiptFieldError(fileErr);
        const generalMsg = err.message ?? t.patient.rechargeRequestPendingExists;
        setError(generalMsg);
      } else {
        setError(t.patient.rechargeRequestLoadFailed);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PatientPageFrame>
      <PageHeader
        title={t.patient.rechargeRequestTitle}
        description={t.patient.rechargeRequestSubtitle}
        actions={
          <Link href="/app/patient/wallet/recharge-requests">
            <Button variant="secondary">{t.patient.rechargeRequestViewAll}</Button>
          </Link>
        }
      />

      <Card className="max-w-lg mx-auto p-6">
        <form onSubmit={(e) => { void handleSubmit(e); }} noValidate>
          <div className="space-y-5">
            <div>
              <Input
                id="rr-amount"
                label={t.patient.rechargeRequestAmountLabel}
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t.patient.rechargeRequestAmountPlaceholder}
                required
                errorText={amountFieldError ?? undefined}
              />
            </div>

            <div>
              <label htmlFor="rr-note" className="block text-sm font-medium mb-1">
                {t.patient.rechargeRequestNoteLabel}
              </label>
              <textarea
                id="rr-note"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.patient.rechargeRequestNotePlaceholder}
              />
            </div>

            <div>
              <label htmlFor="rr-receipt" className="block text-sm font-medium mb-1">
                {t.patient.rechargeRequestReceiptLabel}
              </label>
              <input
                id="rr-receipt"
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="block w-full text-sm text-foreground file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">{t.patient.rechargeRequestReceiptHint}</p>
              {fileError && <p className="text-xs text-destructive mt-1">{fileError}</p>}
              {receiptFieldError && <p className="text-xs text-destructive mt-1">{receiptFieldError}</p>}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && (
              <div className="rounded-md bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3">
                <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                <Link href="/app/patient/wallet/recharge-requests" className="text-sm underline mt-1 inline-block text-green-700 dark:text-green-300">
                  {t.patient.rechargeRequestViewAll}
                </Link>
              </div>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? t.patient.rechargeRequestSubmitting : t.patient.rechargeRequestSubmit}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/app/patient/wallet")}
              >
                {t.patient.rechargeRequestBackToList.replace("requests", "wallet")}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </PatientPageFrame>
  );
}
