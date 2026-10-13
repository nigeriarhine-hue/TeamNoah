import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SAFE} from './theme';

/**
 * Positions children inside the YouTube Shorts / TikTok safe content box.
 * Pass `debug` to visualise the platform UI exclusion zones while designing.
 */
export const ShortsSafeArea: React.FC<{children?: React.ReactNode; debug?: boolean; style?: React.CSSProperties}> = ({children, debug, style}) => (
	<AbsoluteFill>
		<div
			style={{
				position: 'absolute',
				left: SAFE.left,
				top: SAFE.top,
				width: SAFE.right - SAFE.left,
				height: SAFE.bottom - SAFE.top,
				display: 'flex',
				flexDirection: 'column',
				outline: debug ? '3px dashed rgba(255,0,0,0.7)' : undefined,
				...style,
			}}
		>
			{children}
		</div>
	</AbsoluteFill>
);
