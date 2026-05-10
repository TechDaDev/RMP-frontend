import type { ReactNode } from "react";
import { DashboardWorkflowCard } from "@/components/dashboard/DashboardWorkflowCard";

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
    <DashboardWorkflowCard
      title={title}
      description={description}
      href={href}
      actionLabel={ctaLabel}
      icon={icon}
    />
  );
}
