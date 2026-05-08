"use client";

import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";

interface DoctorQueueTabsProps {
  active: "pending" | "assigned";
  pendingHref: string;
  assignedHref: string;
  pendingLabel: string;
  assignedLabel: string;
}

export function DoctorQueueTabs({
  active,
  pendingHref,
  assignedHref,
  pendingLabel,
  assignedLabel,
}: DoctorQueueTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={pendingHref}
        className={buttonClassName({ variant: active === "pending" ? "primary" : "secondary" })}
      >
        {pendingLabel}
      </Link>
      <Link
        href={assignedHref}
        className={buttonClassName({ variant: active === "assigned" ? "primary" : "secondary" })}
      >
        {assignedLabel}
      </Link>
    </div>
  );
}
