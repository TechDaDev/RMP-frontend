import type { ReactNode } from "react";

interface DoctorInfoRowProps {
  label: string;
  value: ReactNode;
  muted?: boolean;
}

export function DoctorInfoRow({ label, value, muted = false }: DoctorInfoRowProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">{label}</p>
      <div
        className={[
          "mt-2 break-words text-sm leading-6",
          muted ? "text-[var(--color-muted)]" : "font-semibold text-[var(--color-text)]",
        ].join(" ")}
      >
        {value || "-"}
      </div>
    </div>
  );
}
