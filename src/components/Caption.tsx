import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts, HEADLINE_TRACKING} from '../brand';

/**
 * Captions for the creator's spoken line.
 *
 * Deliberately NOT karaoke: a whole phrase lands at once, holds, and leaves.
 * Word-by-word highlighting reads as a template, and the brief asked for the
 * opposite of that.
 */
export const Caption: React.FC<{
  text: string;
  durationInFrames: number;
  /** Distance from the bottom of the 1920px frame to the caption baseline. */
  bottom?: number;
}> = ({text, durationInFrames, bottom = 470}) => {
  const frame = useCurrentFrame();

  const IN = 7;
  const OUT = 5;

  const enter = interpolate(frame, [0, IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const exit = interpolate(
    frame,
    [durationInFrames - OUT, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const opacity = enter * exit;
  const y = (1 - enter) * 22 - (1 - exit) * 10;
  const scale = 0.982 + enter * 0.018;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
      }}
    >
      {/* A soft pool of shade rather than a caption box — keeps the footage
          visible and stops the type shimmering against a busy background. */}
      <div
        style={{
          position: 'absolute',
          left: -120,
          right: -120,
          top: -120,
          bottom: -120,
          background:
            'radial-gradient(58% 62% at 50% 50%, rgba(4,6,16,0.66) 0%, rgba(4,6,16,0.30) 52%, rgba(4,6,16,0) 100%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          maxWidth: 860,
          textAlign: 'center',
          fontFamily: fonts.sans,
          fontWeight: 800,
          fontSize: 70,
          lineHeight: 1.14,
          letterSpacing: HEADLINE_TRACKING,
          color: colors.white,
          whiteSpace: 'pre-line',
          textShadow: '0 3px 26px rgba(4,6,16,0.62), 0 1px 3px rgba(4,6,16,0.5)',
        }}
      >
        {text}
      </div>
    </div>
  );
};
