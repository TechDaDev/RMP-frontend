interface PriceDisplayProps {
  amount?: string | number | null;
  currency?: string | null;
  className?: string;
}

function parseDecimalAmount(value: string | number): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = value.trim().replace(/,/g, "");
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function PriceDisplay({ amount, currency, className }: PriceDisplayProps) {
  if (amount === undefined || amount === null || amount === "") {
    return <span className={className}>-</span>;
  }

  const numeric = parseDecimalAmount(amount);
  const formattedAmount = numeric !== null
    ? new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric)
    : String(amount);

  return <span className={className}>{currency ? `${currency} ${formattedAmount}` : formattedAmount}</span>;
}
