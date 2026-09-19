import React from 'react';
import { useCurrentFrame } from 'remotion';
import { font, theme } from '../theme';
import { anim, ease } from './easing';

/** Final call to action (§25) — clean, high contrast, held long enough to read. */
export const CTA: React.FC<{
  action: string;
  url: string;
  line?: string;
  at?: number;
}> = ({ action, url, line, at = 0 }) => {
  const frame = useCurrentFrame();
  const p = anim(frame, [at, at + 22], [0, 1], ease.out);
  const p2 = anim(frame, [at + 8, at + 30], [0, 1], ease.out);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 26,
      }}
    >
      <div
        style={{
          padding: '22px 52px',
          borderRadius: 999,
          background: theme.aurora,
          fontFamily: font.sans,
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          opacity: p,
          transform: `translateY(${(1 - p) * 16}px) scale(${0.96 + p * 0.04})`,
          boxShadow: '0 16px 44px -14px rgba(99,102,241,0.75)',
          whiteSpace: 'nowrap',
        }}
      >
        {action}
      </div>
      <div
        style={{
          fontFamily: font.sans,
          fontSize: 48,
          fontWeight: 600,
          letterSpacing: '-0.015em',
          color: theme.ink,
          opacity: p2,
          transform: `translateY(${(1 - p2) * 12}px)`,
        }}
      >
        {url}
      </div>
      {line && (
        <div
          style={{
            fontFamily: font.sans,
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '0.01em',
            color: theme.mute,
            opacity: p2 * 0.95,
          }}
        >
          {line}
        </div>
      )}
    </div>
  );
};
