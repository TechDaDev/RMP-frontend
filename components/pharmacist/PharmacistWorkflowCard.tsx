import type { ComponentType } from "react";
import { DashboardWorkflowCard } from "@/components/dashboard/DashboardWorkflowCard";
import type { IconProps } from "@/components/icons";

interface PharmacistWorkflowCardProps {
  title: string;
  subtitle: string;
  status: string;
  statusTone?: "neutral" | "primary" | "success" | "info" | "warning" | "danger";
  actionLabel: string;
  icon: ComponentType<IconProps>;
  href?: string;
  disabled?: boolean;
}

export function PharmacistWorkflowCard({
  title,
  subtitle,
  status,
  statusTone = "neutral",
  actionLabel,
  icon: Icon,
  href,
  disabled = false,
}: PharmacistWorkflowCardProps) {
  return (
    <DashboardWorkflowCard
      title={title}
      description={subtitle}
      status={status}
      statusTone={statusTone}
      actionLabel={actionLabel}
      icon={<Icon size={18} />}
      href={href}
      disabled={disabled}
    />
  );
}
