import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * A macOS pointer that travels to a target and clicks it once. The click is
 * the point of the whole film, so it is unhurried: arrive, settle, press.
 */
export const CursorClick: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** frame the pointer starts moving, relative to its Sequence */
  travelStart: number;
  travelFrames: number;
  clickAt: number;
}> = ({ from, to, travelStart, travelFrames, clickAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = interpolate(frame, [travelStart, travelStart + travelFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // ease-out-cubic: quick departure, soft arrival
  const e = 1 - Math.pow(1 - t, 3);
  const x = interpolate(e, [0, 1], [from.x, to.x]);
  const y = interpolate(e, [0, 1], [from.y, to.y]);

  const press = spring({ frame: frame - clickAt, fps, config: { damping: 14, mass: 0.35 } });
  const pressed = frame >= clickAt && frame < clickAt + 6;
  const ripple = interpolate(frame, [clickAt, clickAt + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const appear = interpolate(frame, [travelStart - 6, travelStart + 2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {frame >= clickAt ? (
        <div
          style={{
            position: 'absolute',
            left: to.x - 90,
            top: to.y - 90,
            width: 180,
            height: 180,
            borderRadius: '50%',
            border: '3px solid rgba(199,203,255,.55)',
            transform: `scale(${interpolate(ripple, [0, 1], [0.18, 1])})`,
            opacity: interpolate(ripple, [0, 1], [0.85, 0]),
            pointerEvents: 'none',
          }}
        />
      ) : null}
      <svg
        width="58"
        height="70"
        viewBox="0 0 24 29"
        style={{
          position: 'absolute',
          left: x,
          top: y,
          opacity: appear,
          transform: `scale(${pressed ? 0.86 + press * 0.1 : 1})`,
          transformOrigin: '2px 2px',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.6))',
        }}
      >
        <path
          d="M2 1.4 2 22.2l5.1-5 3.1 7.6 3.9-1.6-3.2-7.5 7.1-.5L2 1.4Z"
          fill="#fff"
          stroke="#111"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
