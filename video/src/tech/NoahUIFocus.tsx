import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ease} from './theme';

export type FocusKey = {
	/** frame */
	at: number;
	/** focus centre in source-image pixels */
	x: number;
	y: number;
	/** zoom relative to "fit width" */
	zoom: number;
};

export type Spot = {x: number; y: number; w: number; h: number; at: number; until?: number; radius?: number};

/**
 * Presents a genuine Noah UI screenshot inside a viewport and animates a
 * virtual camera across it (focus zoom). Optional spotlight dims everything
 * except one rectangle of the real interface.
 */
export const NoahUIFocus: React.FC<{
	src: string;
	imgW: number;
	imgH: number;
	viewW: number;
	viewH: number;
	keys: FocusKey[];
	spot?: Spot;
	radius?: number;
	children?: React.ReactNode;
}> = ({src, imgW, imgH, viewW, viewH, keys, spot, radius = 28, children}) => {
	const frame = useCurrentFrame();
	const ats = keys.map((k) => k.at);
	const opt = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: ease};
	const one = keys.length === 1;
	const x = one ? keys[0].x : interpolate(frame, ats, keys.map((k) => k.x), opt);
	const y = one ? keys[0].y : interpolate(frame, ats, keys.map((k) => k.y), opt);
	const zoom = one ? keys[0].zoom : interpolate(frame, ats, keys.map((k) => k.zoom), opt);
	const s = (viewW / imgW) * zoom;
	// keep the camera inside the image bounds
	const tx = Math.min(0, Math.max(viewW - imgW * s, viewW / 2 - x * s));
	const ty = Math.min(0, Math.max(viewH - imgH * s, viewH / 2 - y * s));
	const toView = (px: number, py: number) => [tx + px * s, ty + py * s] as const;

	let spotEl: React.ReactNode = null;
	if (spot) {
		const pin = interpolate(frame, [spot.at, spot.at + 12], [0, 1], opt);
		const pout = spot.until ? interpolate(frame, [spot.until, spot.until + 10], [1, 0], opt) : 1;
		const p = pin * pout;
		const [sx, sy] = toView(spot.x, spot.y);
		const pad = 10;
		spotEl = (
			<div
				style={{
					position: 'absolute',
					left: sx - pad,
					top: sy - pad,
					width: spot.w * s + pad * 2,
					height: spot.h * s + pad * 2,
					borderRadius: spot.radius ?? 18,
					boxShadow: `0 0 0 4000px rgba(5,8,20,${0.55 * p}), 0 0 0 ${4 * p}px rgba(140,130,255,${0.9 * p}), 0 0 ${40 * p}px rgba(124,58,237,${0.6 * p})`,
					pointerEvents: 'none',
				}}
			/>
		);
	}

	return (
		<div
			style={{
				position: 'relative',
				width: viewW,
				height: viewH,
				overflow: 'hidden',
				borderRadius: radius,
				background: '#16181f',
				boxShadow: '0 40px 90px rgba(5,8,30,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
			}}
		>
			<Img
				src={staticFile(src)}
				style={{position: 'absolute', left: 0, top: 0, width: imgW, height: imgH, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}
			/>
			{spotEl}
			{children}
		</div>
	);
};
