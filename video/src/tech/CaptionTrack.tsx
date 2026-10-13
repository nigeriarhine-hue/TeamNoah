import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {T} from './theme';

export type Caption = {
	start: number; // seconds
	end: number; // seconds
	/** Wrap accent words in [brackets]: "buying [MORE RAM?]" */
	text: string;
};

/**
 * Phrase-based captions rendered in Remotion. One phrase at a time, in a
 * high-contrast pill, with bracketed words highlighted in the brand accent.
 * No per-word bouncing.
 */
export const CaptionTrack: React.FC<{
	captions: Caption[];
	/** Start frame of the enclosing Sequence, so captions can be authored in absolute seconds. */
	from?: number;
	y?: number;
	maxWidth?: number;
}> = ({captions, from = 0, y = 1395, maxWidth = 880}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = (frame + from) / fps;
	const cap = captions.find((c) => t >= c.start && t < c.end);
	if (!cap) return null;
	const local = (t - cap.start) * fps;
	const left = (cap.end - t) * fps;
	const p = Math.min(interpolate(local, [0, 5], [0, 1], {extrapolateRight: 'clamp'}), interpolate(left, [0, 3], [0, 1], {extrapolateRight: 'clamp'}));
	const parts = cap.text.split(/(\[[^\]]+\])/g).filter(Boolean);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
			<div
				style={{
					maxWidth,
					padding: '16px 28px 18px',
					borderRadius: 22,
					background: 'rgba(11,16,36,0.86)',
					boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
					fontFamily: T.font,
					fontSize: 46,
					fontWeight: 800,
					lineHeight: 1.18,
					letterSpacing: -0.6,
					color: T.white,
					textAlign: 'center',
					opacity: p,
					transform: `translateY(${(1 - p) * 10}px)`,
				}}
			>
				{parts.map((s, i) =>
					s.startsWith('[') ? (
						<span key={i} style={{color: '#A9B4FF'}}>
							{s.slice(1, -1)}
						</span>
					) : (
						<span key={i}>{s}</span>
					),
				)}
			</div>
		</div>
	);
};
