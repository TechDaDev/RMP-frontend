import { Card } from "@/components/ui/Card";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import type { Wallet } from "@/types/payments";

interface WalletBalanceCardProps {
  wallet: Wallet | null;
  loading?: boolean;
  error?: string | null;
}

export function WalletBalanceCard({ wallet, loading = false, error = null }: WalletBalanceCardProps) {
  return (
    <Card className="space-y-2">
      <h3 className="text-base font-semibold text-[var(--color-text)]">Wallet</h3>

      {loading ? <p className="text-sm text-[var(--color-muted)]">Loading wallet...</p> : null}
      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}

      {!loading && !error ? (
        <p className="text-2xl font-bold text-[var(--color-text)]">
          <PriceDisplay amount={wallet?.balance ?? "0"} currency={wallet?.currency} />
        </p>
      ) : null}
    </Card>
  );
}
