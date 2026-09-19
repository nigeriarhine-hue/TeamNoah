import React from 'react';
import { useCurrentFrame } from 'remotion';
import { font, theme } from '../theme';
import { anim, ease } from './easing';

/**
 * A small system-toast card that drifts in at an angle — used to layer the
 * "old way" montage with depth. Generic by design; names no product.
 */
export const Notification: React.FC<{
  title: string;
  body?: string;
  at?: number;
  until?: number;
  x: number;
  y: number;
  from?: 'left' | 'right';
  tiltY?: number;
  width?: number;
  scale?: number;
  accent?: string;
}> = ({ title, body, at = 0, until, x, y, from = 'right', tiltY = 0, width = 460, scale = 1, accent = theme.amber }) => {
  const frame = useCurrentFrame();
  const inP = anim(frame, [at, at + 20], [0, 1], ease.out);
  const outP = until === undefined ? 0 : anim(frame, [until, until + 14], [0, 1], ease.in);
  const p = inP * (1 - outP);
  const dir = from === 'right' ? 1 : -1;
  const dx = (1 - inP) * 120 * dir + outP * 50 * dir;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        opacity: p,
        transform: `translateX(${dx}px) perspective(1600px) rotateY(${tiltY}deg) scale(${scale})`,
        borderRadius: 18,
        border: `1px solid ${theme.line}`,
        background: 'rgba(22,26,34,0.94)',
        boxShadow: '0 18px 44px -18px rgba(0,0,0,0.9)',
        padding: '20px 24px',
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
        willChange: 'transform, opacity',
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 6,
          background: accent,
          marginTop: 8,
          flexShrink: 0,
          boxShadow: `0 0 14px ${accent}`,
        }}
      />
      <div>
        <div
          style={{
            fontFamily: font.sans,
            fontSize: 26,
            fontWeight: 600,
            color: theme.ink,
            letterSpacing: '-0.015em',
          }}
        >
          {title}
        </div>
        {body && (
          <div
            style={{
              fontFamily: font.sans,
              fontSize: 21,
              fontWeight: 400,
              color: theme.mute,
              marginTop: 5,
              letterSpacing: '-0.005em',
            }}
          >
            {body}
          </div>
        )}
      </div>
    </div>
  );
};
