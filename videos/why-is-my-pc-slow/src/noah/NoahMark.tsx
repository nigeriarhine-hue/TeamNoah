import React from 'react';

/**
 * The Noah mark, inline from brand-pack/svg/noah-mark-light.svg /-dark.svg
 * geometry. Unmodified proportions, no effects (brand-pack rules).
 * Used ONCE in this video — on the end card.
 */
export const NoahMark: React.FC<{ size: number; onDark?: boolean }> = ({ size, onDark = false }) => {
  const stroke = onDark ? '#C7CBFF' : '#1A1D61';
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Noah">
      <defs>
        <clipPath id="nm-c">
          <circle cx="60" cy="58" r="34" />
        </clipPath>
        <radialGradient id="nm-rg" cx="0.5" cy="0.94" r="0.9">
          <stop offset="0" stopColor="#8b8ff8" />
          <stop offset="0.45" stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </radialGradient>
      </defs>
      <g clipPath="url(#nm-c)">
        <rect x="24" y="74" width="72" height="20" fill="url(#nm-rg)" />
      </g>
      <circle cx="60" cy="58" r="34" fill="none" stroke={stroke} strokeWidth="7" />
      <line x1="16" y1="74" x2="104" y2="74" stroke={stroke} strokeWidth="7" />
    </svg>
  );
};
