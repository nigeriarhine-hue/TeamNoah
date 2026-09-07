import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, WATERLINE_Y, headline } from '../theme';

/**
 * The chrome is the mark, enlarged to fill the frame: the load line runs
 * level across every scene and never tilts, sky above carries the picture,
 * tide below carries the words. The line runs the full width because the
 * kit is explicit that the overshoot past the disc *is* the load line.
 */
export const Chrome: React.FC = () => (
  <>
    {/* tide zone — a deeper cream, never an aurora wash: the gradient is
        reserved for the single primary action in block nine. */}
    <div style={{ position: 'absolute', top: WATERLINE_Y, left: 0, right: 0, bottom: 0, backgroundColor: '#E4DFD2' }} />
    <div style={{ position: 'absolute', top: WATERLINE_Y - 3, left: 0, right: 0, height: 6, backgroundColor: C.navy }} />
    <div style={{ position: 'absolute', top: 56, left: 84, display: 'flex', alignItems: 'center', gap: 20 }}>
      <Img src={staticFile('noah-mark-light.svg')} style={{ width: 60, height: 60 }} />
      <span style={{ ...headline(34), letterSpacing: '-0.03em' }}>Noah</span>
    </div>
  </>
);

/** Word-by-word reveal, paced to the ~2.6 words/sec the script was written for. */
export const Caption: React.FC<{ text: string; startAt?: number; durationInFrames?: number }> = ({
  text,
  startAt = 4,
  durationInFrames = 250,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const per = durationInFrames / words.length;

  return (
    <p
      style={{
        ...headline(53),
        lineHeight: 1.26,
        margin: 0,
        maxWidth: 1660,
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: '0.30em',
        rowGap: '0.06em',
      }}
    >
      {words.map((w, i) => {
        const at = startAt + i * per;
        const o = interpolate(frame, [at, at + 7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const y = interpolate(frame, [at, at + 10], [9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <span key={i} style={{ opacity: o, transform: `translateY(${y}px)`, display: 'inline-block' }}>
            {w}
          </span>
        );
      })}
    </p>
  );
};
