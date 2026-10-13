import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ease} from './theme';
import {NoahUIFocus, FocusKey} from './NoahUIFocus';
import {Cursor} from './icons';

/**
 * Focuses the genuine Noah approval dialog ("Can Noah do this?") with a
 * spotlight, and glides a cursor toward the approve button WITHOUT clicking —
 * the point is that the user decides.
 */
export const ApprovalModalFocus: React.FC<{
	src: string;
	imgW: number;
	imgH: number;
	viewW: number;
	viewH: number;
	keys: FocusKey[];
	modal: {x: number; y: number; w: number; h: number};
	/** Button the cursor drifts toward, in source-image px. */
	target: {x: number; y: number};
	spotAt: number;
	cursorAt: number;
	cursorDur?: number;
}> = ({src, imgW, imgH, viewW, viewH, keys, modal, target, spotAt, cursorAt, cursorDur = 40}) => {
	const frame = useCurrentFrame();
	// approximate camera transform at the final key so the cursor lands on target in view space
	const k = keys[keys.length - 1];
	const s = (viewW / imgW) * k.zoom;
	const tx = Math.min(0, Math.max(viewW - imgW * s, viewW / 2 - k.x * s));
	const ty = Math.min(0, Math.max(viewH - imgH * s, viewH / 2 - k.y * s));
	const endX = tx + target.x * s;
	const endY = ty + target.y * s;
	const p = interpolate(frame, [cursorAt, cursorAt + cursorDur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
	const cx = interpolate(p, [0, 1], [viewW * 0.92, endX]);
	const cy = interpolate(p, [0, 1], [viewH * 0.95, endY]) + Math.sin(p * Math.PI) * -40;
	const hover = interpolate(frame, [cursorAt + cursorDur - 6, cursorAt + cursorDur + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<NoahUIFocus src={src} imgW={imgW} imgH={imgH} viewW={viewW} viewH={viewH} keys={keys} spot={{...modal, at: spotAt, radius: 22}}>
			{/* soft hover halo on the approve button: the cursor waits, it does not click */}
			<div
				style={{
					position: 'absolute',
					left: endX - 90,
					top: endY - 44,
					width: 180,
					height: 88,
					borderRadius: 26,
					boxShadow: `0 0 ${50 * hover}px rgba(124,58,237,${0.65 * hover})`,
					border: `3px solid rgba(199,203,255,${0.8 * hover})`,
				}}
			/>
			<div style={{position: 'absolute', left: cx - 4, top: cy - 2, opacity: p > 0 ? 1 : 0}}>
				<Cursor size={46} />
			</div>
		</NoahUIFocus>
	);
};
