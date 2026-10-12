import React from 'react';

/**
 * Generic line icons for the series (24×24 grid, round caps).
 * Deliberately not any vendor's logo — no Windows flag, no app marks.
 */
type P = { size?: number; color?: string; stroke?: number };

const Svg: React.FC<P & { children: React.ReactNode }> = ({ size = 48, color = 'currentColor', stroke = 1.9, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}
  >
    {children}
  </svg>
);

export const IconStartup: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3v8" />
    <path d="M6.6 6.4a8 8 0 1010.8 0" />
  </Svg>
);

export const IconLayers: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3.4 12.5L12 17l8.6-4.5" />
    <path d="M3.4 16.5L12 21l8.6-4.5" />
  </Svg>
);

export const IconDrive: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <path d="M6 14.5h6" />
    <circle cx="17" cy="14.5" r="0.6" fill={p.color ?? 'currentColor'} />
  </Svg>
);

export const IconChip: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" />
    <path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5" />
  </Svg>
);

export const IconSplit: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="4" width="8" height="16" rx="2" />
    <rect x="13.5" y="4" width="8" height="16" rx="2" />
    <path d="M5 8h3M16 8h3" />
  </Svg>
);

export const IconWindow: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <path d="M3 9h18" />
    <circle cx="6.2" cy="6.8" r="0.4" fill={p.color ?? 'currentColor'} />
    <circle cx="8.4" cy="6.8" r="0.4" fill={p.color ?? 'currentColor'} />
  </Svg>
);

export const IconMonitor: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
    <path d="M9 20.5h6M12 16.5v4" />
  </Svg>
);

export const IconArrowDown: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </Svg>
);

export const IconArrowRight: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Svg>
);

export const IconCheck: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4.5 12.5l5 5L19.5 7" />
  </Svg>
);

export const IconSearch: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L21 21" />
  </Svg>
);

export const IconEyeOff: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.1A9.7 9.7 0 0112 5c5 0 8.5 4.5 9.5 7a13 13 0 01-2.8 3.9M6.2 6.6C4.3 7.9 3 9.8 2.5 12c1 2.5 4.5 7 9.5 7 1.8 0 3.4-.6 4.7-1.4" />
    <path d="M9.9 9.9a3 3 0 004.2 4.2" />
  </Svg>
);

/** Small coloured app tile used in diagrams: rounded square + glyph. */
export const AppGlyph: React.FC<{ kind: 'chat' | 'game' | 'cloud' | 'update' | 'music' | 'browser' | 'photo'; size?: number; bg: string }> = ({
  kind,
  size = 56,
  bg,
}) => {
  const g: Record<string, React.ReactNode> = {
    chat: <path d="M5 6h14v9H10l-4 3v-3H5z" />,
    game: (
      <>
        <rect x="3" y="8" width="18" height="9" rx="4.5" />
        <path d="M7.5 11v3M6 12.5h3" />
        <circle cx="15.5" cy="11.6" r="0.5" fill="#fff" />
        <circle cx="17.2" cy="13.4" r="0.5" fill="#fff" />
      </>
    ),
    cloud: <path d="M7 18h10a4 4 0 00.6-8 6 6 0 00-11.4 1.6A3.3 3.3 0 007 18z" />,
    update: (
      <>
        <path d="M19 12a7 7 0 11-2.1-5" />
        <path d="M19 4v4h-4" />
      </>
    ),
    music: (
      <>
        <path d="M9 17V6l10-2v11" />
        <circle cx="6.5" cy="17" r="2.5" />
        <circle cx="16.5" cy="15" r="2.5" />
      </>
    ),
    browser: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16" />
      </>
    ),
    photo: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M4 16l5-5 4 4 2-2 5 5" />
      </>
    ),
  };
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {g[kind]}
      </svg>
    </div>
  );
};
