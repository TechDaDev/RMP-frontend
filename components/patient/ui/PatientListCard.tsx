import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/icons";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PatientListCardProps {
  title: string;
  meta?: ReactNode;
  badge?: ReactNode;
  href: string;
  actionLabel: string;
  children: ReactNode;
}

export function PatientListCard({
  title,
  meta,
  badge,
  href,
  actionLabel,
  children,
}: PatientListCardProps) {
  return (
    <Card className="h-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="break-words text-base font-bold text-[var(--color-text)]">{title}</h2>
              {meta ? <div className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{meta}</div> : null}
            </div>
            {badge}
          </div>
          {children}
        </div>
        <div className="flex w-full shrink-0 lg:w-auto">
          <Link href={href} className={buttonClassName({ variant: "secondary", className: "w-full lg:w-auto" })}>
            <span className="min-w-0 truncate">{actionLabel}</span>
            <ArrowIcon size={16} />
          </Link>
        </div>
      </div>
    </Card>
  );
}
