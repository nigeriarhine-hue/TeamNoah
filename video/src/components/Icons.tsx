import React from 'react';

type P = { size?: number; color?: string; stroke?: number; style?: React.CSSProperties };

const Svg: React.FC<P & { children: React.ReactNode }> = ({ size = 24, color = 'currentColor', stroke = 2, style, children }) => (
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

export const IconDrive: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="2" y="13" width="20" height="8" rx="2" />
    <path d="M5 13 7.5 5h9L19 13" />
    <circle cx="6.5" cy="17" r="0.6" fill={p.color ?? 'currentColor'} />
    <path d="M11 17h7" />
  </Svg>
);

export const IconRocket: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </Svg>
);

export const IconLayers: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="m12 2 10 5-10 5L2 7z" />
    <path d="m2 17 10 5 10-5" />
    <path d="m2 12 10 5 10-5" />
  </Svg>
);

export const IconPackage: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
    <path d="m3 8 9 5 9-5" />
    <path d="M12 13v8" />
    <path d="m7.5 5.5 9 5" />
  </Svg>
);

export const IconTrash: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v5M14 11v5" />
  </Svg>
);

export const IconGauge: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </Svg>
);

export const IconHome: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5V21H3z" />
    <path d="M9 21v-6h6v6" />
  </Svg>
);

export const IconScan: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </Svg>
);

export const IconTools: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Svg>
);

export const IconGear: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3.2" />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI) / 4;
      return (
        <path
          key={i}
          d={`M${12 + Math.cos(a) * 6.2} ${12 + Math.sin(a) * 6.2}L${12 + Math.cos(a) * 9.4} ${12 + Math.sin(a) * 9.4}`}
          strokeWidth={(p.stroke ?? 2) * 1.6}
        />
      );
    })}
    <circle cx="12" cy="12" r="6.4" />
  </Svg>
);

export const IconCheck: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const IconArrowRight: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);

export const IconShield: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9.5 4.5-1 8-4.5 8-9.5V6z" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </Svg>
);

export const IconCpu: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="9.5" y="9.5" width="5" height="5" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </Svg>
);
