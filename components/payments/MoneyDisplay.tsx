import { PriceDisplay } from "@/components/common/PriceDisplay";

interface MoneyDisplayProps {
  amount?: string | number | null;
  currency?: string | null;
  className?: string;
}

export function MoneyDisplay({ amount, currency, className }: MoneyDisplayProps) {
  return <PriceDisplay amount={amount} currency={currency} className={className} />;
}
