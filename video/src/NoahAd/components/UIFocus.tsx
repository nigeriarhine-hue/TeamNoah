import React from 'react';
import { useCurrentFrame } from 'remotion';
import { anim, ease } from './easing';

type Props = {
  /** Highlight rectangle in canvas coordinates. */
  rect: { x: number; y: number; w: number; h: number };
  at?: number;
  until?: number;
  radius?: number;
  /** How far the surroundings drop away. */
  dim?: number;
  /** Ring around the focused region. */
  ring?: boolean;
  bloom?: number;
};

/**
 * Directs the eye without touching the UI itself (§28): everything outside the
 * rect dims, the region gets a restrained ring and a whisper of bloom.
 */
export const UIFocus: React.FC<Props> = ({
  rect,
  at = 0,
  until,
  radius = 14,
  dim = 0.62,
  ring = true,
  bloom = 0.5,
}) => {
  const frame = useCurrentFrame();
  const inP = anim(frame, [at, at + 14], [0, 1], ease.out);
  const outP = until === undefined ? 0 : anim(frame, [until, until + 12], [0, 1], ease.in);
  const p = inP * (1 - outP);
  if (p <= 0.001) return null;

  const grow = (1 - inP) * 16;
  const r = {
    x: rect.x - grow,
    y: rect.y - grow,
    w: rect.w + grow * 2,
    h: rect.h + grow * 2,
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none' }}>
      {/* four-panel scrim: dims everything but the rect, with no mask-image support needed */}
      <Scrim style={{ left: 0, top: 0, right: 0, height: Math.max(0, r.y) }} o={dim * p} />
      <Scrim style={{ left: 0, top: r.y + r.h, right: 0, bottom: 0 }} o={dim * p} />
      <Scrim style={{ left: 0, top: r.y, width: Math.max(0, r.x), height: r.h }} o={dim * p} />
      <Scrim style={{ left: r.x + r.w, top: r.y, right: 0, height: r.h }} o={dim * p} />

      {bloom > 0 && (
        <div
          style={{
            position: 'absolute',
            left: r.x - r.w * 0.16,
            top: r.y - r.h * 0.5,
            width: r.w * 1.32,
            height: r.h * 2,
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(139,143,248,0.24) 0%, rgba(139,143,248,0) 70%)',
            opacity: bloom * p,
            filter: 'blur(26px)',
          }}
        />
      )}
      {ring && (
        <div
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: r.w,
            height: r.h,
            borderRadius: radius,
            boxShadow: `0 0 0 2px rgba(199,203,255,${0.4 * p}), 0 0 34px rgba(99,102,241,${0.32 * p})`,
          }}
        />
      )}
    </div>
  );
};

const Scrim: React.FC<{ style: React.CSSProperties; o: number }> = ({ style, o }) => (
  <div style={{ position: 'absolute', background: `rgba(6,8,14,${o})`, ...style }} />
);
