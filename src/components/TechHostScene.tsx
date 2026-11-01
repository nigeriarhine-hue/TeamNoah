import React from 'react';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Full-bleed host footage (Higgsfield image-to-video of the recurring creator) with a subtle push-in.
 * The footage is muted: narration is the single VO track so the voice stays identical everywhere.
 */
export const TechHostScene: React.FC<{
  src: string; // path inside public/
  startFrom?: number; // frames into the clip
  pushFrom?: number;
  pushTo?: number;
  focusY?: number; // transform-origin Y in % (face height)
  children?: React.ReactNode;
  vignette?: boolean;
}> = ({src, startFrom = 0, pushFrom = 1.0, pushTo = 1.06, focusY = 30, children, vignette = true}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const s = interpolate(frame, [0, durationInFrames], [pushFrom, pushTo], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `50% ${focusY}%`}}>
        <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {vignette ? (
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(10,12,30,0) 45%, rgba(10,12,30,0.35) 75%, rgba(10,12,30,0.55) 100%)',
          }}
        />
      ) : null}
      {children}
    </AbsoluteFill>
  );
};
