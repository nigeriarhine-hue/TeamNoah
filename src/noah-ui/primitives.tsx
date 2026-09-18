import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../brand';

/** Cream-system tints, all taken from the brand kit's palette. */
export const ink = {
  full: colors.warmInk,
  dim: 'rgba(42,37,31,0.60)',
  faint: 'rgba(42,37,31,0.42)',
  card: '#F4F0E6',
  line: '#E0DCCF',
} as const;

/** Rows land one after another so the app looks like it is thinking. */
export const Stagger: React.FC<{
  index: number;
  delay?: number;
  step?: number;
  children: React.ReactNode;
}> = ({index, delay = 0, step = 4, children}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay - index * step, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (v) => 1 - Math.pow(1 - v, 3),
  });
  return (
    <div style={{opacity: t, transform: `translateY(${(1 - t) * 14}px)`}}>{children}</div>
  );
};

export const Eyebrow: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      fontFamily: fonts.sans,
      fontWeight: 700,
      fontSize: 23,
      letterSpacing: '0.13em',
      textTransform: 'uppercase',
      color: ink.faint,
    }}
  >
    {children}
  </div>
);

export const Headline: React.FC<{children: React.ReactNode; size?: number}> = ({
  children,
  size = 50,
}) => (
  <div
    style={{
      fontFamily: fonts.sans,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.14,
      letterSpacing: '-0.035em',
      color: ink.full,
    }}
  >
    {children}
  </div>
);

export const Mono: React.FC<{children: React.ReactNode; color?: string}> = ({
  children,
  color = ink.faint,
}) => (
  <div
    style={{
      fontFamily: fonts.mono,
      fontWeight: 400,
      fontSize: 24,
      letterSpacing: '-0.01em',
      color,
      marginTop: 7,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}
  >
    {children}
  </div>
);

type Marker = 'caution' | 'confirm' | 'pending' | 'running';

const Check: React.FC<{color: string}> = ({color}) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12.6 L10 17.4 L19 7"
      stroke={color}
      strokeWidth="3.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Marker: React.FC<{kind: Marker; progress?: number}> = ({
  kind,
  progress = 1,
}) => {
  const size = 38;
  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: size / 2,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  };

  if (kind === 'caution') {
    return (
      <div style={{...base, backgroundColor: 'rgba(217,119,6,0.14)'}}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 6 V13.4"
            stroke={colors.amber}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="12" cy="18" r="1.75" fill={colors.amber} />
        </svg>
      </div>
    );
  }

  if (kind === 'confirm') {
    return (
      <div style={{...base, backgroundColor: 'rgba(13,148,136,0.15)'}}>
        <Check color={colors.teal} />
      </div>
    );
  }

  if (kind === 'running') {
    return (
      <div style={{...base, backgroundColor: 'rgba(37,99,235,0.13)'}}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 11,
            border: `3px solid rgba(37,99,235,0.24)`,
            borderTopColor: colors.auroraFrom,
            transform: `rotate(${progress * 900}deg)`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        ...base,
        border: `2px solid ${ink.line}`,
        backgroundColor: 'transparent',
      }}
    />
  );
};

/** One line of what Noah found, or of what Noah is about to do. */
export const Row: React.FC<{
  marker: Marker;
  progress?: number;
  title: string;
  detail?: string;
  strong?: boolean;
}> = ({marker, progress, title, detail, strong = false}) => (
  <div
    style={{
      display: 'flex',
      gap: 20,
      alignItems: 'flex-start',
      padding: '20px 24px',
      backgroundColor: ink.card,
      border: `1px solid ${ink.line}`,
      borderRadius: 12,
    }}
  >
    <Marker kind={marker} progress={progress} />
    <div style={{minWidth: 0, flex: 1}}>
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: strong ? 700 : 600,
          fontSize: 32,
          lineHeight: 1.22,
          letterSpacing: '-0.022em',
          color: ink.full,
        }}
      >
        {title}
      </div>
      {detail ? <Mono>{detail}</Mono> : null}
    </div>
  </div>
);

/** The padded page inside the window. */
export const Screen: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: colors.cream,
      padding: '40px 40px 36px',
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
    }}
  >
    {children}
  </div>
);
