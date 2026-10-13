import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {T, pop, prog} from './theme';

/**
 * Diagnostic category card: semantic icon, label, and a small animated
 * resource bar. `level` is an illustrative fill (0–1), not a measurement.
 */
export const ResourceCard: React.FC<{
	icon: React.ReactNode;
	title: string;
	sub: string;
	level: number;
	at: number;
	/** Bar colour; defaults to the brand gradient. */
	bar?: string;
	active?: boolean;
}> = ({icon, title, sub, level, at, bar = T.gradient, active = false}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, at);
	const fill = prog(frame, at + 6, 22) * level;
	// a gentle "live" wobble so the bars feel like activity, not a static chart
	const live = fill > 0 ? Math.sin((frame - at) / 6) * 0.025 * level : 0;
	return (
		<div
			style={{
				fontFamily: T.font,
				background: T.white,
				borderRadius: 30,
				padding: '30px 30px 32px',
				border: `2px solid ${active ? 'rgba(124,58,237,0.55)' : T.line}`,
				boxShadow: active ? '0 18px 50px rgba(79,70,229,0.22)' : '0 14px 40px rgba(26,29,97,0.08)',
				opacity: s,
				transform: `translateY(${(1 - s) * 50}px) scale(${0.94 + 0.06 * s})`,
				display: 'flex',
				flexDirection: 'column',
				gap: 18,
			}}
		>
			<div
				style={{
					width: 84,
					height: 84,
					borderRadius: 24,
					background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.14))',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: T.indigo,
				}}
			>
				{icon}
			</div>
			<div style={{fontSize: 34, fontWeight: 900, lineHeight: 1.05, color: T.ink, letterSpacing: -0.5}}>{title}</div>
			<div style={{fontSize: 22, fontWeight: 600, color: T.muted, marginTop: -8}}>{sub}</div>
			<div style={{height: 16, borderRadius: 8, background: '#ECEEF4', overflow: 'hidden'}}>
				<div
					style={{
						height: '100%',
						width: `${interpolate(fill + live, [0, 1], [0, 100], {extrapolateRight: 'clamp'})}%`,
						borderRadius: 8,
						background: bar,
					}}
				/>
			</div>
		</div>
	);
};
