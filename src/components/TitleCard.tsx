import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {aurora, colors, fonts, HEADLINE_TRACKING} from '../brand';

/**
 * A deterministic, three-hit stutter on the opening frames. It reads as the
 * dropped frames the creator is complaining about, then stops dead — the point
 * is the contrast with how still everything else in the ad is.
 *
 * Fixed table rather than random() so every render is identical.
 */
const STUTTER: Record<number, {x: number; o: number}> = {
  2: {x: -9, o: 0.72},
  3: {x: 6, o: 1},
  7: {x: 7, o: 0.8},
  8: {x: -4, o: 1},
  13: {x: -5, o: 0.86},
};

const Line: React.FC<{
  children: React.ReactNode;
  delay: number;
  size: number;
}> = ({children, delay, size}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 11], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (v) => 1 - Math.pow(1 - v, 3),
  });

  return (
    <div style={{overflow: 'hidden', paddingBottom: 6}}>
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.03,
          letterSpacing: HEADLINE_TRACKING,
          color: colors.white,
          textShadow: '0 4px 40px rgba(4,6,16,0.8), 0 2px 4px rgba(4,6,16,0.6)',
          transform: `translateY(${(1 - t) * 100}%)`,
          opacity: t,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const TitleCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const glitch = STUTTER[frame] ?? {x: 0, o: 1};

  const exit = interpolate(frame, [durationInFrames - 9, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // The rule under the payoff word draws itself after both lines have landed.
  const rule = interpolate(frame, [22, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 84,
        right: 84,
        top: 300,
        transform: `translateX(${glitch.x}px)`,
        opacity: glitch.o * exit,
      }}
    >
      <Line delay={0} size={104}>
        YOUR GAME
      </Line>
      <Line delay={3} size={104}>
        MIGHT NOT BE
      </Line>
      <Line delay={6} size={104}>
        THE PROBLEM
      </Line>
      <div
        style={{
          marginTop: 26,
          width: 330 * rule,
          height: 7,
          borderRadius: 4,
          background: aurora,
        }}
      />
    </div>
  );
};
