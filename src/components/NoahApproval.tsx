import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {fontStack, noah} from '../theme';

/**
 * Highlights the genuine approval affordance already present in the supplied
 * Noah screenshots. It draws attention to real UI — it never redraws it.
 */
export const NoahApproval: React.FC<{
  /** box to ring, as percentages of the frame */
  box: {left: number; top: number; width: number; height: number};
  appearAt?: number;
  caption?: string;
}> = ({box, appearAt = 6, caption}) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [appearAt, appearAt + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = 1 + Math.sin(frame / 7) * 0.012;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: `${box.left}%`,
          top: `${box.top}%`,
          width: `${box.width}%`,
          height: `${box.height}%`,
          borderRadius: 20,
          border: `4px solid ${noah.periwinkle}`,
          boxShadow: `0 0 0 9999px rgba(4,6,12,${0.5 * a}), 0 0 34px rgba(199,203,255,0.5)`,
          opacity: a,
          transform: `scale(${pulse})`,
        }}
      />
      {caption ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${box.top + box.height + 3}%`,
            textAlign: 'center',
            opacity: a,
          }}
        >
          <span
            style={{
              fontFamily: fontStack,
              fontSize: 40,
              fontWeight: 800,
              color: noah.periwinkle,
              letterSpacing: '-0.02em',
              textShadow: '0 3px 18px rgba(0,0,0,0.8)',
            }}
          >
            {caption}
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
