import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface PharmacistListCardProps {
  title: string;
  meta?: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}

export function PharmacistListCard({
  title,
  meta,
  badge,
  action,
  children,
}: PharmacistListCardProps) {
  return (
    <Card className="h-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="break-words text-base font-bold text-[var(--color-text)]">{title}</h3>
              {meta ? <div className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{meta}</div> : null}
            </div>
            {badge}
          </div>
          {children}
        </div>
        {action ? <div className="w-full shrink-0 lg:w-auto">{action}</div> : null}
      </div>
    </Card>
  );
}
