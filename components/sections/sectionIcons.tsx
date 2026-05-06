import type { ReactNode } from "react";

export function sectionIcon(kind: "trust" | "feature" | "audience" | "security"): ReactNode {
  const paths = {
    trust: "M12 3l7 3v6c0 5-3.4 9.8-7 11-3.6-1.2-7-6-7-11V6l7-3z",
    feature: "M12 3a9 9 0 100 18 9 9 0 000-18zm0 4v10m-5-5h10",
    audience: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0",
    security: "M7 12h10M9 8h6m-8 8h10m2-13v18",
  };

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d={paths[kind]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
