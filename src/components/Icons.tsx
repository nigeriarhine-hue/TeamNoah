import React from 'react';

// Simple semantic line icons (24x24 grid). Never use the Noah mark as a functional icon.
type P = {size?: number; color?: string; stroke?: number; style?: React.CSSProperties};

const Svg: React.FC<P & {children: React.ReactNode}> = ({size = 48, color = 'currentColor', stroke = 2, style, children}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {children}
  </svg>
);

export const RestartIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 1 1-2.34-5.66" />
    <path d="M20 4v5h-5" />
  </Svg>
);

export const PowerIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3v8" />
    <path d="M6.3 6.7a8 8 0 1 0 11.4 0" />
  </Svg>
);

// Stuck process: a gear
export const ProcessIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
    <circle cx="12" cy="12" r="6.2" />
  </Svg>
);

// Temporary activity: a clock with sweep
export const TempIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);

// System services: stacked layers
export const ServicesIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" />
    <path d="m3 12 9 4.5 9-4.5" />
    <path d="m3 16.5 9 4.5 9-4.5" />
  </Svg>
);

// Startup apps: rocket-free "launch at boot" = power + arrow up
export const StartupIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M12 14V8" />
    <path d="m9 10.5 3-3 3 3" />
    <path d="M8 21h8" />
  </Svg>
);

// Background programs: overlapping windows
export const BackgroundIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="7" y="3" width="14" height="11" rx="2" />
    <path d="M17 17v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1" />
  </Svg>
);

// Storage: hard drive
export const StorageIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="13" width="18" height="7" rx="2" />
    <path d="M5.5 13 8 5h8l2.5 8" />
    <circle cx="17" cy="16.5" r="0.6" fill="currentColor" />
    <path d="M6.5 16.5h5" />
  </Svg>
);

// One problem app: window with alert
export const AppAlertIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 8.5h18" />
    <path d="M12 11.5v3.5" />
    <circle cx="12" cy="17.6" r="0.5" fill="currentColor" />
  </Svg>
);

export const CpuIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="9.5" y="9.5" width="5" height="5" />
    <path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3" />
  </Svg>
);

export const MonitorIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
    <path d="M8 20.5h8M12 16.5v4" />
  </Svg>
);

export const SlowIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 18a8 8 0 1 1 16 0" />
    <path d="m12 18-4.5-5" />
    <circle cx="12" cy="18" r="1" fill="currentColor" />
  </Svg>
);

export const SmileIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 14.2a4.5 4.5 0 0 0 7 0" />
    <path d="M9 9.5h.01M15 9.5h.01" />
  </Svg>
);

export const CheckIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const WarningIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 2.5 20h19L12 3.5Z" />
    <path d="M12 10v4.5" />
    <circle cx="12" cy="17.3" r="0.5" fill="currentColor" />
  </Svg>
);

export const ReturnIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </Svg>
);

export const SearchIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Svg>
);

export const ArrowRightIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowDownIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Svg>
);

export const ShieldCheckIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8 7.5 9.5 4.3-1.5 7.5-4.9 7.5-9.5V6L12 3Z" />
    <path d="m8.8 12 2.3 2.3 4.2-4.6" />
  </Svg>
);

// Mouse pointer (filled)
export const Cursor: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 56, style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path
      d="M5 2.5v17.2l4.6-4.3 2.9 6.6 2.7-1.2-2.9-6.5h6.3L5 2.5Z"
      fill="#12142A"
      stroke="#fff"
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);
