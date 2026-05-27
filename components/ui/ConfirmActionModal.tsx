"use client";

import { Button } from "@/components/ui/Button";

interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmActionModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busy = false,
  onCancel,
  onConfirm,
}: ConfirmActionModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow)]">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-[var(--color-text)]">{title}</h2>
          <p className="text-sm text-[var(--color-muted)]">{message}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>{cancelLabel}</Button>
          <Button onClick={() => void onConfirm()} disabled={busy}>{busy ? "Processing..." : confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
