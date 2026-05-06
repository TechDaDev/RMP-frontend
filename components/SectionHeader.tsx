import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  align?: "start" | "center";
  action?: ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  align = "start",
  action,
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-8 ${
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl text-start"
      }`}
    >
      <h2 className="text-2xl font-bold leading-tight text-[var(--color-text)] md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-base text-[var(--color-muted)] md:text-lg">{subtitle}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
