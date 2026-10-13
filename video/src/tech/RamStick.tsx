import React from 'react';

/**
 * Clean, unbranded DIMM memory-module illustration (no product packaging, no
 * vendor marks). Width-driven; height follows the DIMM proportions.
 */
export const RamStick: React.FC<{width?: number; style?: React.CSSProperties}> = ({width = 560, style}) => {
	const chips = Array.from({length: 8});
	const pins = Array.from({length: 46});
	return (
		<svg width={width} height={width * 0.3} viewBox="0 0 400 120" style={style}>
			<defs>
				<linearGradient id="ram-pcb" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#1d2350" />
					<stop offset="1" stopColor="#12163a" />
				</linearGradient>
				<linearGradient id="ram-spreader" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#3B6CF0" />
					<stop offset="1" stopColor="#7C3AED" />
				</linearGradient>
				<linearGradient id="ram-gold" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#f3d27a" />
					<stop offset="1" stopColor="#c99a2e" />
				</linearGradient>
			</defs>
			{/* PCB with notch */}
			<path d="M6 8 h388 a4 4 0 0 1 4 4 v86 h-170 v8 h-12 v-8 h-210 v-86 a4 4 0 0 1 4-4z" fill="url(#ram-pcb)" />
			{/* heat spreader */}
			<rect x="14" y="14" width="372" height="58" rx="6" fill="url(#ram-spreader)" />
			<rect x="14" y="14" width="372" height="58" rx="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
			<path d="M30 30 h120 M30 40 h80" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
			{chips.map((_, i) => (
				<rect key={i} x={24 + i * 46} y={58} width={34} height={8} rx={2} fill="rgba(255,255,255,0.18)" />
			))}
			{pins.map((_, i) => {
				const x = 12 + i * 8.2;
				if (x > 214 && x < 232) return null;
				return <rect key={i} x={x} y={88} width={5.2} height={18} rx={1} fill="url(#ram-gold)" />;
			})}
		</svg>
	);
};
