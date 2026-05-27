interface PriceDisplayProps {
  amount?: string | number | null;
  currency?: string | null;
  className?: string;
}

export function PriceDisplay({ amount, currency, className }: PriceDisplayProps) {
  if (amount === undefined || amount === null || amount === "") {
    return <span className={className}>-</span>;
  }

  const numeric = typeof amount === "number" ? amount : Number(amount);
  const formattedAmount = Number.isFinite(numeric) ? numeric.toFixed(2) : String(amount);

  return <span className={className}>{currency ? `${currency} ${formattedAmount}` : formattedAmount}</span>;
}
