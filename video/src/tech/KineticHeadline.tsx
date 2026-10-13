import React from 'react';
import {useCurrentFrame} from 'remotion';
import {T, prog} from './theme';

export type HeadlineLine = {
	text: string;
	/** Render this line with the blue→violet gradient. */
	accent?: boolean;
	size?: number;
	color?: string;
	/** Frame (relative to the sequence) at which this line reveals. */
	at?: number;
};

/**
 * Line-by-line masked reveal headline. Each line wipes up from behind a mask,
 * which reads as clean editorial motion rather than bouncy kinetic type.
 */
export const KineticHeadline: React.FC<{
	lines: HeadlineLine[];
	color?: string;
	align?: 'left' | 'center';
	stagger?: number;
	lineHeight?: number;
	shadow?: boolean;
	style?: React.CSSProperties;
}> = ({lines, color = T.ink, align = 'left', stagger = 5, lineHeight = 1.0, shadow, style}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{fontFamily: T.font, textAlign: align, display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', ...style}}>
			{lines.map((l, i) => {
				const at = l.at ?? i * stagger;
				const p = prog(frame, at, 16);
				const size = l.size ?? 96;
				return (
					<div key={i} style={{overflow: 'hidden', paddingBottom: size * 0.08, marginBottom: -size * 0.04}}>
						<div
							style={{
								fontSize: size,
								fontWeight: 900,
								letterSpacing: -size * 0.03,
								lineHeight,
								color: l.color ?? color,
								transform: `translateY(${(1 - p) * 105}%)`,
								opacity: p > 0 ? 1 : 0,
								textShadow: shadow && !l.accent ? '0 4px 24px rgba(0,0,0,0.35)' : undefined,
								...(l.accent ? T.gradientText : {}),
								...(l.accent && shadow ? {filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.35))'} : {}),
								whiteSpace: 'pre',
							}}
						>
							{l.text}
						</div>
					</div>
				);
			})}
		</div>
	);
};
