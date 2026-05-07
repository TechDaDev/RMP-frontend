import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/icons";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PatientWorkflowCardProps {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  icon?: ReactNode;
}

export function PatientWorkflowCard({
  title,
  description,
  href,
  ctaLabel,
  icon,
}: PatientWorkflowCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4 rounded-[2rem]">
      {icon ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
          {icon}
        </span>
      ) : null}
      <div className="space-y-2">
        <h2 className="text-base font-bold text-[var(--color-text)]">{title}</h2>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{description}</p>
      </div>
      <div className="mt-auto">
        <Link href={href} className={buttonClassName({ variant: "secondary", className: "w-full" })}>
          {ctaLabel}
          <ArrowIcon size={16} />
        </Link>
      </div>
    </Card>
  );
}