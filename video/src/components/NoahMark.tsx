import React from 'react';
import {c} from '../theme';

/**
 * "The Carrying Tide" — a Plimsoll load-line disc, cut low.
 * Redrawn from brand-pack/svg/noah-mark-light.svg. Rules that are not negotiable:
 * the waterline stays level, it overshoots the disc on both sides, and the mark
 * carries no shadow, glow or outline.
 */
export const NoahMark: React.FC<{size?: number; dark?: boolean; draw?: number}> = ({
  size = 120,
  dark = false,
  draw = 1,
}) => {
  const stroke = dark ? c.litHorizon : c.structure;
  const id = dark ? 'd' : 'l';
  // the waterline grows outward from centre; it must always overshoot the disc
  const half = 44 * Math.max(0.001, draw);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Noah">
      <defs>
        <clipPath id={`clip-${id}`}>
          <circle cx="60" cy="58" r="34" />
        </clipPath>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dark ? 'rgba(199,203,255,0.05)' : 'rgba(37,99,235,0.068)'} />
          <stop offset="1" stopColor={dark ? 'rgba(199,203,255,0.12)' : 'rgba(37,99,235,0.150)'} />
        </linearGradient>
        <linearGradient id={`tide-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.auroraFrom} />
          <stop offset="1" stopColor={c.auroraTo} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#clip-${id})`}>
        <rect x="24" y="22" width="72" height="52" fill={`url(#sky-${id})`} />
        <rect x="24" y="74" width="72" height="20" fill={`url(#tide-${id})`} opacity={draw} />
      </g>
      <circle cx="60" cy="58" r="34" fill="none" stroke={stroke} strokeWidth="7" />
      <line
        x1={60 - half}
        y1="74"
        x2={60 + half}
        y2="74"
        stroke={stroke}
        strokeWidth="7"
        strokeLinecap="butt"
      />
    </svg>
  );
};

export const NoahLockup: React.FC<{size?: number; dark?: boolean; u?: number}> = ({
  size = 44,
  dark = false,
  u = 1,
}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12 * u}}>
    <NoahMark size={size} dark={dark} />
    <span
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 800,
        fontSize: size * 0.52,
        letterSpacing: '-0.035em',
        color: dark ? c.litHorizon : c.structure,
      }}
    >
      Noah
    </span>
  </div>
);
