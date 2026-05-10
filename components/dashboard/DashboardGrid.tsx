import type { ReactNode } from "react";

type DashboardGridColumns = "two" | "three" | "four" | "auto";

interface DashboardGridProps {
  columns?: DashboardGridColumns;
  children: ReactNode;
  className?: string;
}

const columnClasses = {
  two: "md:grid-cols-2",
  three: "md:grid-cols-2 xl:grid-cols-3",
  four: "md:grid-cols-2 xl:grid-cols-4",
  auto: "sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]",
} satisfies Record<DashboardGridColumns, string>;

export function DashboardGrid({
  columns = "three",
  children,
  className,
}: DashboardGridProps) {
  return (
    <div className={["grid gap-4", columnClasses[columns], className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
