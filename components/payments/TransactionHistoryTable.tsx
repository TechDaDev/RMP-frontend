import { Card } from "@/components/ui/Card";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import type { WalletTransaction } from "@/types/payments";

interface TransactionHistoryTableProps {
  transactions: WalletTransaction[];
  loading?: boolean;
  error?: string | null;
}

export function TransactionHistoryTable({
  transactions,
  loading = false,
  error = null,
}: TransactionHistoryTableProps) {
  return (
    <Card className="space-y-3 overflow-x-auto">
      <h3 className="text-base font-semibold text-[var(--color-text)]">Transaction history</h3>

      {loading ? <p className="text-sm text-[var(--color-muted)]">Loading transactions...</p> : null}
      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}

      {!loading && !error && transactions.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">No wallet transactions yet.</p>
      ) : null}

      {!loading && !error && transactions.length > 0 ? (
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
              <th className="px-2 py-2">Date</th>
              <th className="px-2 py-2">Type</th>
              <th className="px-2 py-2">Amount</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Reference</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id} className="border-b border-[var(--color-border)] text-[var(--color-text)]">
                <td className="px-2 py-2">{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                <td className="px-2 py-2">{item.transaction_type ?? "-"}</td>
                <td className="px-2 py-2"><PriceDisplay amount={item.amount} currency={item.currency} /></td>
                <td className="px-2 py-2">{item.status ?? "-"}</td>
                <td className="px-2 py-2">{item.reference_id ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </Card>
  );
}
