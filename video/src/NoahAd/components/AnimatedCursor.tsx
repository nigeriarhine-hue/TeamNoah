import React from 'react';
import { useCurrentFrame } from 'remotion';
import { anim, ease } from './easing';

export type Pt = { x: number; y: number };

/** Quadratic bezier so the pointer travels an arc, never a ruler line (§27). */
const bezier = (a: Pt, b: Pt, c: Pt, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * b.x + t * t * c.x,
    y: u * u * a.y + 2 * u * t * b.y + t * t * c.y,
  };
};

type Props = {
  from: Pt;
  to: Pt;
  /** Scene-relative frame the move begins. */
  at: number;
  /** Frames the travel takes. */
  travel?: number;
  /** Frame the click lands (scene-relative). Omit for a move with no click. */
  clickAt?: number;
  /** Curvature of the arc, px perpendicular to the straight line. */
  bow?: number;
  size?: number;
  opacity?: number;
  /** Render a soft ring on click. */
  ripple?: boolean;
};

/**
 * macOS-style arrow. Accelerates out, decelerates in, holds briefly before the
 * click, then compresses. Never moves faster than a hand plausibly would.
 */
export const AnimatedCursor: React.FC<Props> = ({
  from,
  to,
  at,
  travel = 26,
  clickAt,
  bow = 90,
  size = 46,
  opacity = 1,
  ripple = true,
}) => {
  const frame = useCurrentFrame();
  const t = anim(frame, [at, at + travel], [0, 1], ease.inOut);

  // control point offset perpendicular to the travel vector
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const ctrl: Pt = {
    x: (from.x + to.x) / 2 - (dy / len) * bow,
    y: (from.y + to.y) / 2 + (dx / len) * bow,
  };
  const p = bezier(from, ctrl, to, t);

  // click compression — a 4-frame squash, then release
  const press =
    clickAt === undefined
      ? 0
      : anim(frame, [clickAt - 2, clickAt], [0, 1], ease.out) *
        (1 - anim(frame, [clickAt, clickAt + 7], [0, 1], ease.out));
  const rippleP =
    clickAt === undefined ? 0 : anim(frame, [clickAt, clickAt + 22], [0, 1], ease.out);

  const appear = anim(frame, [at - 8, at + 2], [0, 1], ease.out);

  return (
    <div
      style={{
        position: 'absolute',
        left: p.x,
        top: p.y,
        width: 0,
        height: 0,
        opacity: opacity * appear,
        zIndex: 60,
        pointerEvents: 'none',
      }}
    >
      {ripple && rippleP > 0 && rippleP < 1 && (
        <div
          style={{
            position: 'absolute',
            left: -4,
            top: -4,
            width: 8 + rippleP * 96,
            height: 8 + rippleP * 96,
            marginLeft: -(rippleP * 48),
            marginTop: -(rippleP * 48),
            borderRadius: '50%',
            border: '2px solid rgba(199,203,255,0.55)',
            opacity: (1 - rippleP) * 0.9,
          }}
        />
      )}
      <svg
        width={size}
        height={size * 1.32}
        viewBox="0 0 24 32"
        style={{
          display: 'block',
          transform: `scale(${1 - press * 0.16})`,
          transformOrigin: '2px 2px',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.75))',
        }}
      >
        <path
          d="M2 2 L2 23.4 L7.6 18.1 L11.2 26.9 L14.9 25.3 L11.3 16.7 L19 16.4 Z"
          fill="#FFFFFF"
          stroke="rgba(10,12,20,0.9)"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
