import React from "react";

// Semantic functional icons (line style). The Noah logo is never used for these.
type P = { size?: number; color?: string; stroke?: number };
const Svg: React.FC<P & { children: React.ReactNode }> = ({ size = 32, color = "currentColor", stroke = 2, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const StartupIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 2v9" />
    <path d="M6.3 5.7a8 8 0 1 0 11.4 0" />
  </Svg>
);
export const DriveIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="13" width="19" height="7" rx="2" />
    <path d="M5 13 7.5 5h9L19 13" />
    <circle cx="17" cy="16.5" r=".6" fill={p.color ?? "currentColor"} />
  </Svg>
);
export const PackageIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </Svg>
);
export const LayersIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="m12 3 9 5-9 5-9-5z" />
    <path d="m3 13 9 5 9-5" />
  </Svg>
);
export const CheckIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
export const WarnIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </Svg>
);
export const ArrowRight: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const ChatIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z" />
  </Svg>
);
export const SearchIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);
export const BulbIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2.2h5c.1-1 .5-1.7 1.1-2.2A6 6 0 0 0 12 3z" />
  </Svg>
);
export const ListIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <circle cx="4.5" cy="6" r=".8" fill={p.color ?? "currentColor"} />
    <circle cx="4.5" cy="12" r=".8" fill={p.color ?? "currentColor"} />
    <circle cx="4.5" cy="18" r=".8" fill={p.color ?? "currentColor"} />
  </Svg>
);
export const ShieldCheckIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" />
    <path d="m8.8 12 2.3 2.3 4.3-4.6" />
  </Svg>
);
export const BroomIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M14 4 20 10" />
    <path d="M17 7 9.5 14.5" />
    <path d="M9.5 14.5c-2-1-4.5-.5-6 1.5L3 21l5-.5c2-1.5 2.5-4 1.5-6z" />
  </Svg>
);
export const ArchiveIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="5" rx="1" />
    <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4" />
  </Svg>
);
