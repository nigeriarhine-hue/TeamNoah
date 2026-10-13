import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {T, pop, prog} from './theme';

/**
 * Chapter marker used across Noah educational videos: a large "01" numeral
 * with a short topic label (e.g. "MEMORY") and an accent rule.
 */
export const EducationalNumber: React.FC<{
	n: string;
	label: string;
	at?: number;
	dark?: boolean;
	size?: number;
}> = ({n, label, at = 0, dark = false, size = 150}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, at);
	const rule = prog(frame, at + 6, 16);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 28, fontFamily: T.font}}>
			<div
				style={{
					fontSize: size,
					fontWeight: 900,
					lineHeight: 0.9,
					letterSpacing: -6,
					fontVariantNumeric: 'tabular-nums',
					...T.gradientText,
					transform: `translateY(${(1 - s) * 30}px) scale(${0.85 + 0.15 * s})`,
					transformOrigin: 'left bottom',
					opacity: s,
				}}
			>
				{n}
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 12, opacity: rule}}>
				<div style={{width: 120 * rule, height: 6, borderRadius: 3, background: T.gradient}} />
				<div
					style={{
						fontSize: 30,
						fontWeight: 800,
						letterSpacing: 5,
						color: dark ? T.lavender : T.slate,
						transform: `translateX(${(1 - rule) * -20}px)`,
					}}
				>
					{label}
				</div>
			</div>
		</div>
	);
};
