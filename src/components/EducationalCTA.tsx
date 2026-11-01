import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AURORA, C, FONT} from '../brand/theme';
import {KineticHeadline, HeadlineLine} from './KineticHeadline';
import {PageBackground} from './EducationalSection';
import {SAFE} from './ShortsSafeArea';

/**
 * Calm educational end card: the takeaway first, then a low-key offer with the Noah mark
 * (the only place the logo appears in the video).
 */
export const EducationalCTA: React.FC<{
  lines: HeadlineLine[];
  offerAt: number;
  offer: string;
  url: string;
  tagline: string;
  taglineAt: number;
}> = ({lines, offerAt, offer, url, tagline, taglineAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 14});
  const offerP = spring({frame: frame - offerAt, fps, config: {damping: 16}, durationInFrames: 18});
  const tagP = interpolate(frame - taglineAt, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: enter}}>
      <PageBackground />
      <div style={{position: 'absolute', left: SAFE.side, right: SAFE.side, top: 300, fontFamily: FONT}}>
        <KineticHeadline lines={lines} size={80} lineHeight={1.04} style={{whiteSpace: 'nowrap'}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          right: SAFE.side,
          top: 1010,
          fontFamily: FONT,
          opacity: offerP,
          transform: `translateY(${(1 - offerP) * 40}px)`,
        }}
      >
        <div style={{height: 3, background: C.line2, marginBottom: 46, width: `${offerP * 100}%`}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <Img src={staticFile('brand/noah-mark-light.svg')} style={{width: 132, height: 132}} />
          <div>
            <div style={{fontSize: 40, fontWeight: 800, letterSpacing: '0.12em', color: C.ink2}}>{offer}</div>
            <div
              style={{
                fontSize: 78,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                backgroundImage: AURORA,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.05,
              }}
            >
              {url}
            </div>
          </div>
        </div>
        <div style={{marginTop: 40, fontSize: 36, fontWeight: 600, color: C.mute, opacity: tagP, letterSpacing: '-0.01em'}}>{tagline}</div>
      </div>
    </AbsoluteFill>
  );
};
