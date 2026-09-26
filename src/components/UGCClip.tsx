import React from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { color, font } from '../theme';
import assets from '../assets.json';

/**
 * A Higgsfield clip, cropped to fill 9:16 with a slow push so the cut has
 * motion underneath it. Falls back to a neutral slate while the footage is
 * still being generated, so the edit can be reviewed before any credits burn.
 */
export const UGCClip: React.FC<{
  src: string;
  present: boolean;
  /** push-in over the clip's life, e.g. 1.0 -> 1.06 */
  zoom?: [number, number];
  startFrom?: number;
  durationInFrames: number;
  placeholderLabel?: string;
}> = ({ src, present, zoom = [1.02, 1.09], startFrom = 0, durationInFrames, placeholderLabel }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], zoom, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (!present) {
    return (
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 70% at 50% 42%, #1a2142 0%, ${color.night} 68%)`,
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: '.22em',
            color: 'rgba(199,203,255,.34)',
          }}
        >
          {placeholderLabel ?? 'UGC CLIP'}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={startFrom}
        muted
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const CLIP = {
  gaming: 'ugc/ai-tech-support/clip-01-gaming-problem.mp4',
  waiting: 'ugc/ai-tech-support/clip-02-waiting.mp4',
} as const;

export const HAS = assets;
