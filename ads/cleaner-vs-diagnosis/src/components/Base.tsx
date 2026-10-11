import React from 'react';
import { staticFile, interpolate, Img } from 'remotion';
import { noah } from '../theme';

/** Figtree, shipped locally with the repo - matches the Noah product UI. */
export const Fonts: React.FC = () => (
  <style>{[400, 500, 600, 700, 800]
    .map(
      (w) => `@font-face{font-family:'Figtree';font-weight:${w};font-display:block;
        src:url('${staticFile(`fonts/figtree-latin-${w}-normal.woff2`)}') format('woff2');}`,
    )
    .join('\n')}</style>
);

export const FONT = "'Figtree', system-ui, sans-serif";

/**
 * The Noah mark, inline from brand-pack/svg/noah-mark-dark.svg.
 * Branding only - never used as an icon inside diagnostic cards.
 */
export const NoahMark: React.FC<{ size: number; stroke?: string }> = ({
  size,
  stroke = '#C7CBFF',
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <defs>
      <clipPath id="noahClip">
        <circle cx="60" cy="58" r="34" />
      </clipPath>
      <radialGradient id="noahFill" cx="0.5" cy="0.94" r="0.9">
        <stop offset="0" stopColor="#8b8ff8" />
        <stop offset="0.45" stopColor="#6366f1" />
        <stop offset="1" stopColor="#8b5cf6" />
      </radialGradient>
    </defs>
    <g clipPath="url(#noahClip)">
      <rect x="24" y="74" width="72" height="20" fill="url(#noahFill)" />
    </g>
    <circle cx="60" cy="58" r="34" fill="none" stroke={stroke} strokeWidth="8" />
    <line x1="16" y1="74" x2="104" y2="74" stroke={stroke} strokeWidth="8" />
  </svg>
);

/** Noah wordmark lockup for branding moments. */
export const NoahLockup: React.FC<{ size?: number; color?: string }> = ({
  size = 58,
  color = '#ffffff',
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
    <NoahMark size={size} />
    <span
      style={{
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size * 0.92,
        color,
        letterSpacing: '-0.02em',
      }}
    >
      Noah
    </span>
  </div>
);

/**
 * A still of the recurring young Black gamer, with a slow parallax push so the
 * frame never sits static. Same four stills are used across the whole ad, so the
 * character identity is identical throughout.
 */
export const Character: React.FC<{
  src: string;
  frame: number;
  /** 0..1 progress used to drive the push-in */
  progress: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  focusX?: number;
  focusY?: number;
  grayscale?: number;
  brightness?: number;
}> = ({
  src,
  progress,
  zoomFrom = 1.06,
  zoomTo = 1.16,
  panX = 0,
  focusX = 50,
  focusY = 28,
  grayscale = 0,
  brightness = 1,
}) => {
  const scale = interpolate(progress, [0, 1], [zoomFrom, zoomTo]);
  const tx = interpolate(progress, [0, 1], [0, panX]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Img
        src={staticFile(src)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${focusX}% ${focusY}%`,
          transform: `scale(${scale}) translateX(${tx}px)`,
          filter: `grayscale(${grayscale}) brightness(${brightness})`,
        }}
      />
    </div>
  );
};

/** Small uppercase section label, as used in the Noah cards. */
export const NoahLabel: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 19,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '0.155em',
      color: noah.label,
    }}
  >
    <span style={{ width: 18, height: 2, background: '#5a5a72' }} />
    {children}
  </div>
);
