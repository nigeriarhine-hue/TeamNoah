import React from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Creator footage layer. Plays a section of the host clip (muted — the
 * narration track is mixed separately) with a slow camera push-in and an
 * optional bottom scrim so overlaid type stays legible.
 */
export const TechHostScene: React.FC<{
	src: string;
	/** Seconds into the source clip where this shot starts. */
	trimStart: number;
	pushFrom?: number;
	pushTo?: number;
	/** transform-origin for the push-in, e.g. '50% 35%' to push toward the face. */
	origin?: string;
	scrim?: boolean;
	children?: React.ReactNode;
	style?: React.CSSProperties;
}> = ({src, trimStart, pushFrom = 1.0, pushTo = 1.08, origin = '50% 32%', scrim = true, children, style}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const scale = interpolate(frame, [0, durationInFrames], [pushFrom, pushTo], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#0b1024', ...style}}>
			<AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: origin}}>
				<OffthreadVideo src={staticFile(src)} muted startFrom={Math.round(trimStart * fps)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
			{scrim && (
				<AbsoluteFill
					style={{
						background:
							'linear-gradient(180deg, rgba(11,16,36,0.28) 0%, rgba(11,16,36,0) 18%, rgba(11,16,36,0) 46%, rgba(11,16,36,0.72) 72%, rgba(11,16,36,0.88) 100%)',
					}}
				/>
			)}
			{children}
		</AbsoluteFill>
	);
};
