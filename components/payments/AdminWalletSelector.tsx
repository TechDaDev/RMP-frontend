"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { MoneyDisplay } from "@/components/payments/MoneyDisplay";
import { getAdminWallets } from "@/lib/payments/paymentsService";
import type { AdminWalletSearchResult } from "@/types/payments";

interface AdminWalletSelectorProps {
  selectedWallet: AdminWalletSearchResult | null;
  onSelect: (wallet: AdminWalletSearchResult) => void;
  title?: string;
  description?: string;
}

function normalizeStatus(value?: string | null): string {
  return (value ?? "unknown").toLowerCase();
}

export function AdminWalletSelector({
  selectedWallet,
  onSelect,
  title,
  description,
}: AdminWalletSelectorProps) {
  const { t } = useAppPreferences();
  const resolvedTitle = title ?? t.admin.walletLookupTitle;
  const resolvedDescription = description ?? t.admin.walletLookupDescription;
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<AdminWalletSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch() {
    if (!search.trim()) {
      setError(t.admin.walletSearchInputError);
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await getAdminWallets({ search: search.trim() });
      setResults(data);
    } catch {
      setResults([]);
      setError(t.admin.walletSearchFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[var(--color-text)]">{resolvedTitle}</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{resolvedDescription}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <Input
          id="wallet-search"
          label={t.admin.walletSearchLabel}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t.admin.walletSearchPlaceholder}
        />
        <Button onClick={() => void handleSearch()} disabled={loading}>
          {loading ? t.admin.walletSearching : t.admin.walletSearchButton}
        </Button>
      </div>

      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}
      {hasSearched && !loading && results.length === 0 && !error ? (
        <p className="text-sm text-[var(--color-muted)]">{t.admin.walletSearchEmpty}</p>
      ) : null}

      {results.length > 0 ? (
        <div className="space-y-2">
          {results.map((wallet) => {
            const isSelected = selectedWallet?.id === wallet.id;
            const status = normalizeStatus(wallet.status);
            const isClosed = status === "closed" || status === "frozen";

            return (
              <button
                key={wallet.id}
                type="button"
                className={[
                  "w-full rounded-2xl border p-4 text-left transition",
                  isSelected
                    ? "border-[var(--color-primary)] bg-[color:color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))]"
                    : "border-[var(--color-border)] bg-[var(--color-surface-alt)] hover:border-[var(--color-primary)]",
                ].join(" ")}
                onClick={() => onSelect(wallet)}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[var(--color-text)]">{wallet.user_full_name || wallet.user_email || wallet.user}</p>
                    <p className="text-xs text-[var(--color-muted)]" dir="ltr">{wallet.user_email || "-"}</p>
                    <p className="text-xs text-[var(--color-muted)]">{t.admin.walletIdLabel}: {wallet.id}</p>
                    <p className="text-xs text-[var(--color-muted)]">{t.admin.walletOwnerIdLabel}: {wallet.user}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      <MoneyDisplay amount={wallet.cached_balance} currency={wallet.currency} />
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">{t.admin.walletStatusLabel}: {wallet.status || t.admin.walletUnknown}</p>
                    {isClosed ? (
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-300">{t.admin.walletRechargeDisabledHint}</p>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </Card>
  );
}
