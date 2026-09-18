import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {aurora, colors, fonts, HEADLINE_TRACKING} from '../brand';

/**
 * The narrator line that sits over a scene — "It found the real cause.",
 * "YOU decide.", and so on.
 *
 * The short aurora rule is the only decorative gradient in the whole ad, and it
 * appears once per beat. The brand reserves the gradient for the one thing that
 * matters on a surface; here that is the sentence itself.
 */
export const Statement: React.FC<{
  text: string;
  durationInFrames: number;
  size?: number;
  /** `top` pins it above the Noah window; `bottom` sits it over footage. */
  anchor?: 'top' | 'bottom';
  offset?: number;
  /** Emphasised beats ("YOU decide.") get the accent colour on the rule. */
  emphasis?: boolean;
  align?: 'center' | 'left';
}> = ({
  text,
  durationInFrames,
  size = 62,
  anchor = 'top',
  offset = 250,
  emphasis = false,
  align = 'center',
}) => {
  const frame = useCurrentFrame();

  const IN = 9;
  const OUT = 6;
  const enter = interpolate(frame, [0, IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const exit = interpolate(frame, [durationInFrames - OUT, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ruleWidth = interpolate(enter, [0, 1], [0, emphasis ? 122 : 74], {
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        [anchor]: offset,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        paddingLeft: align === 'left' ? 84 : 0,
        opacity: enter * exit,
        transform: `translateY(${(1 - enter) * 18}px)`,
      }}
    >
      <div
        style={{
          width: ruleWidth,
          height: 5,
          borderRadius: 3,
          background: aurora,
          marginBottom: 22,
        }}
      />
      <div
        style={{
          maxWidth: 880,
          textAlign: align,
          fontFamily: fonts.sans,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.12,
          letterSpacing: HEADLINE_TRACKING,
          color: colors.white,
          whiteSpace: 'pre-line',
          textShadow: '0 3px 30px rgba(4,6,16,0.72), 0 1px 3px rgba(4,6,16,0.55)',
        }}
      >
        {text}
      </div>
    </div>
  );
};
