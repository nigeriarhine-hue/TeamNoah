import React from 'react';

/**
 * "The Carrying Tide" — a Plimsoll load-line disc, cut low.
 *
 * Traced from brand-pack/svg/noah-mark-{light,dark}.svg. Do not recolour,
 * rotate, stretch, or crop the waterline: the overshoot past the disc *is*
 * the load line, and a disc on its own is not the logo.
 */
export const NoahMark: React.FC<{
  size?: number;
  variant?: 'light' | 'dark';
}> = ({size = 120, variant = 'light'}) => {
  const id = variant; // ids must not collide when both variants mount
  const stroke = variant === 'light' ? '#1A1D61' : '#C7CBFF';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Noah"
      style={{display: 'block'}}
    >
      <defs>
        <clipPath id={`clip-${id}`}>
          <circle cx="60" cy="58" r="34" />
        </clipPath>
        {variant === 'light' ? (
          <>
            <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(37,99,235,0.068)" />
              <stop offset="1" stopColor="rgba(37,99,235,0.150)" />
            </linearGradient>
            <linearGradient id={`tide-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2563eb" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </>
        ) : (
          <>
            <radialGradient id={`tide-${id}`} cx="0.5" cy="0.94" r="0.9">
              <stop offset="0" stopColor="#8b8ff8" />
              <stop offset="0.45" stopColor="#6366f1" />
              <stop offset="1" stopColor="#8b5cf6" />
            </radialGradient>
            <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(43,53,122,0.140)" />
              <stop offset="1" stopColor="rgba(99,102,241,0.300)" />
            </linearGradient>
            <linearGradient id={`glow-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(139,143,248,0.550)" />
              <stop offset="1" stopColor="rgba(139,143,248,0.000)" />
            </linearGradient>
          </>
        )}
      </defs>

      <g clipPath={`url(#clip-${id})`}>
        <rect x="24" y="22" width="72" height="52" fill={`url(#sky-${id})`} />
        <rect x="24" y="74" width="72" height="20" fill={`url(#tide-${id})`} />
      </g>
      {variant === 'dark' ? (
        <rect
          clipPath={`url(#clip-${id})`}
          x="24"
          y="74"
          width="72"
          height="14"
          fill={`url(#glow-${id})`}
        />
      ) : null}

      <circle cx="60" cy="58" r="34" fill="none" stroke={stroke} strokeWidth="7" />
      <line x1="16" y1="74" x2="104" y2="74" stroke={stroke} strokeWidth="7" strokeLinecap="butt" />
    </svg>
  );
};
