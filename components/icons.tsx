import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SunIcon(p: IconProps) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </Base>
  );
}

export function MoonIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </Base>
  );
}

export function GlobeIcon(p: IconProps) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 010 20" />
      <path d="M12 2a15.3 15.3 0 000 20" />
    </Base>
  );
}

export function MenuIcon(p: IconProps) {
  return (
    <Base {...p}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </Base>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <Base {...p}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Base>
  );
}

export function PatientIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Base>
  );
}

export function DoctorIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </Base>
  );
}

export function LabIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M9 3h6M11 3v8l-3.8 6.38A2 2 0 009 20h6a2 2 0 001.8-2.62L13 11V3" />
      <line x1="7.5" y1="15" x2="16.5" y2="15" />
    </Base>
  );
}

export function PharmacyIcon(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </Base>
  );
}

export function ShieldIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Base>
  );
}

export function LockIcon(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </Base>
  );
}

export function MessageIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </Base>
  );
}

export function PrescriptionIcon(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </Base>
  );
}

export function FileTextIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </Base>
  );
}

export function CheckCircleIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </Base>
  );
}

export function ArrowIcon(p: IconProps) {
  return (
    <Base {...p}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Base>
  );
}

export function PulseIcon(p: IconProps) {
  return (
    <Base {...p}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </Base>
  );
}

export function GridIcon(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Base>
  );
}

export function UserIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Base>
  );
}

export function BellIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5" />
      <path d="M10 21a2 2 0 004 0" />
    </Base>
  );
}

export function SettingsIcon(p: IconProps) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.54V21a2 2 0 01-4 0v-.09a1.7 1.7 0 00-1-1.54 1.7 1.7 0 00-1.87.34l-.06.06A2 2 0 014.34 17l.06-.06A1.7 1.7 0 004.74 15a1.7 1.7 0 00-1.54-1H3a2 2 0 010-4h.09a1.7 1.7 0 001.54-1 1.7 1.7 0 00-.34-1.87L4.23 7.1A2 2 0 017.06 4.3l.06.06a1.7 1.7 0 001.87.34H9A1.7 1.7 0 0010 3.17V3a2 2 0 014 0v.09a1.7 1.7 0 001 1.54h.07a1.7 1.7 0 001.87-.34l.06-.06a2 2 0 012.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87V9c0 .67.39 1.28 1 1.54H21a2 2 0 010 4h-.09a1.7 1.7 0 00-1.54 1z" />
    </Base>
  );
}

export function LogOutIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Base>
  );
}
