import React from 'react';

// Semantic line icons for the PC areas people usually dig through by hand.
// (The Noah mark is never used as a functional icon.)
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const StartupIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%">
    <path {...stroke} d="M12 3v8" />
    <path {...stroke} d="M7.05 6.05a7 7 0 1 0 9.9 0" />
  </svg>
);

export const BackgroundAppsIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%">
    <rect {...stroke} x="7" y="3" width="14" height="11" rx="2" />
    <path {...stroke} d="M4 7.5v9A2.5 2.5 0 0 0 6.5 19H17" />
  </svg>
);

export const StorageIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%">
    <rect {...stroke} x="3" y="5" width="18" height="14" rx="2.5" />
    <path {...stroke} d="M3 13h18" />
    <circle cx="17" cy="16" r="1" fill="currentColor" />
  </svg>
);

export const CpuIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%">
    <rect {...stroke} x="6" y="6" width="12" height="12" rx="2" />
    <rect {...stroke} x="9.5" y="9.5" width="5" height="5" rx="0.8" />
    <path {...stroke} d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
  </svg>
);

export const MemoryIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%">
    <rect {...stroke} x="2.5" y="7" width="19" height="9" rx="1.5" />
    <path {...stroke} d="M6.5 10v3M10 10v3M14 10v3M17.5 10v3M5 16v2.5M19 16v2.5" />
  </svg>
);
