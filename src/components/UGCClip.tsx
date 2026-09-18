import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Wraps a generated UGC take. If the mp4 has not been pulled into public/ yet
 * it falls back to the locked creator reference still, and failing that to a
 * neutral plate, so the composition always renders end to end.
 */
export const UGCClip: React.FC<{
  src: string;
  fallbackStill?: string;
  hasClip: boolean;
  hasStill: boolean;
  startFrom?: number;
  volume?: number;
}> = ({src, fallbackStill, hasClip, hasStill, startFrom = 0, volume = 1}) => {
  const {width, height} = useVideoConfig();
  const frame = useCurrentFrame();

  if (hasClip) {
    return (
      <AbsoluteFill style={{backgroundColor: '#0c0c0e'}}>
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={startFrom}
          volume={volume}
          style={{width, height, objectFit: 'cover'}}
        />
      </AbsoluteFill>
    );
  }

  if (hasStill && fallbackStill) {
    return (
      <AbsoluteFill style={{backgroundColor: '#0c0c0e'}}>
        <Img src={staticFile(fallbackStill)} style={{width, height, objectFit: 'cover'}} />
      </AbsoluteFill>
    );
  }

  // Neutral plate: keeps the graphics cut watchable for timing review.
  const drift = Math.sin(frame / 90) * 3;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(78% 52% at ${50 + drift}% 34%, #24304A 0%, #141A28 52%, #0A0D14 100%)`,
      }}
    />
  );
};

/** Bottom scrim so captions stay readable over any footage. */
export const CaptionScrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.44) 24%, rgba(0,0,0,0) 48%)',
    }}
  />
);
