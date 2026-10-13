import React from 'react';

/**
 * Semantic line icons for diagnostic categories. These are deliberately generic
 * functional icons — never the Noah mark.
 */
type P = {size?: number; color?: string; stroke?: number};

const Svg: React.FC<P & {children: React.ReactNode}> = ({size = 64, color = 'currentColor', stroke = 2, children}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
		{children}
	</svg>
);

export const RocketIcon: React.FC<P> = (p) => (
	<Svg {...p}>
		<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
		<path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
		<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
		<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
	</Svg>
);

export const ProcessesIcon: React.FC<P> = (p) => (
	<Svg {...p}>
		<rect x="3" y="3" width="7" height="7" rx="1.5" />
		<rect x="14" y="3" width="7" height="7" rx="1.5" />
		<rect x="3" y="14" width="7" height="7" rx="1.5" />
		<rect x="14" y="14" width="7" height="7" rx="1.5" />
	</Svg>
);

export const CpuIcon: React.FC<P> = (p) => (
	<Svg {...p}>
		<rect x="5" y="5" width="14" height="14" rx="2" />
		<rect x="9" y="9" width="6" height="6" rx="0.5" />
		<path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
	</Svg>
);

export const DriveIcon: React.FC<P> = (p) => (
	<Svg {...p}>
		<path d="M22 12H2" />
		<path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
		<path d="M6 16h.01M10 16h.01" />
	</Svg>
);

export const MemoryIcon: React.FC<P> = (p) => (
	<Svg {...p}>
		<rect x="2" y="7" width="20" height="10" rx="1.5" />
		<path d="M6 11v2M10 11v2M14 11v2M18 11v2M6 17v3M10 17v3M14 17v3M18 17v3" />
	</Svg>
);

export const AppWindowIcon: React.FC<P> = (p) => (
	<Svg {...p}>
		<rect x="2" y="4" width="20" height="16" rx="2" />
		<path d="M2 9h20M6 6.5h.01M9 6.5h.01" />
	</Svg>
);

export const MonitorIcon: React.FC<P> = (p) => (
	<Svg {...p}>
		<rect x="2" y="3" width="20" height="14" rx="2" />
		<path d="M8 21h8M12 17v4" />
	</Svg>
);

export const CheckIcon: React.FC<P> = (p) => (
	<Svg {...p}>
		<path d="M20 6L9 17l-5-5" />
	</Svg>
);

export const ArrowRight: React.FC<P> = (p) => (
	<Svg {...p}>
		<path d="M5 12h14M13 6l6 6-6 6" />
	</Svg>
);

/** A Windows-style arrow pointer, drawn in SVG. */
export const Cursor: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size * 1.4} viewBox="0 0 20 28" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.45))'}}>
		<path d="M1 1 L1 22 L6.5 16.8 L10.2 25.5 L13.6 24 L9.9 15.5 L17.5 15.5 Z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
	</svg>
);
