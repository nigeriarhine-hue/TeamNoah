import React from 'react';
import { edu, FONT, SERIES } from './theme';
import { pop, ramp } from './motion';

/**
 * Small editorial series identifier. Always smaller than the episode title —
 * it says "this is part of a series", not "this is an ad".
 */
export const SeriesTag: React.FC<{ t?: number; dark?: boolean; episode?: string }> = ({ t = 10, dark = false, episode }) => {
  const o = ramp(t, 0, 0.4);
  const ink = dark ? 'rgba(255,255,255,0.92)' : edu.ink;
  const sub = dark ? 'rgba(255,255,255,0.62)' : edu.ink3;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, opacity: o }}>
      <span style={{ width: 14, height: 14, borderRadius: 4, background: edu.grad }} />
      <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '0.16em', color: ink }}>{SERIES}</span>
      {episode && (
        <>
          <span style={{ width: 1.5, height: 22, background: sub, opacity: 0.6 }} />
          <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: '0.04em', color: sub }}>{episode}</span>
        </>
      )}
    </div>
  );
};

/**
 * 01–05 chapter rail. The active chapter fills; finished chapters stay solid,
 * upcoming ones are outlines — the viewer always knows where they are.
 */
export const ChapterRail: React.FC<{ active: number; count?: number; t: number; dark?: boolean }> = ({
  active,
  count = 5,
  t,
  dark = false,
}) => (
  <div style={{ display: 'flex', gap: 10, fontFamily: FONT }}>
    {Array.from({ length: count }).map((_, i) => {
      const n = i + 1;
      const done = n < active;
      const on = n === active;
      const fill = on ? ramp(t, 0.05, 0.5) : done ? 1 : 0;
      return (
        <div
          key={n}
          style={{
            width: on ? 86 : 54,
            height: 44,
            borderRadius: 11,
            position: 'relative',
            overflow: 'hidden',
            border: `2px solid ${on || done ? 'transparent' : dark ? 'rgba(255,255,255,0.25)' : edu.line}`,
            background: done ? (dark ? 'rgba(255,255,255,0.14)' : edu.bg2) : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {on && <div style={{ position: 'absolute', inset: 0, background: edu.grad, transform: `scaleX(${fill})`, transformOrigin: 'left' }} />}
          <span
            style={{
              position: 'relative',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '0.04em',
              fontVariantNumeric: 'tabular-nums',
              color: on ? '#fff' : done ? (dark ? '#fff' : edu.ink2) : dark ? 'rgba(255,255,255,0.45)' : edu.ink3,
            }}
          >
            {String(n).padStart(2, '0')}
          </span>
        </div>
      );
    })}
  </div>
);

/**
 * Chapter header: big gradient numeral, icon badge, title.
 * `t` is seconds since the chapter started.
 */
export const ChapterHeader: React.FC<{
  n: number;
  title: string[];
  icon: React.ReactNode;
  t: number;
  titleSize?: number;
}> = ({ n, title, icon, t, titleSize = 96 }) => {
  const num = pop(t, 0.0, 14, 0.7);
  const badge = pop(t, 0.12, 12, 0.6);
  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
        <div
          style={{
            fontSize: 220,
            lineHeight: 0.86,
            fontWeight: 800,
            letterSpacing: '-0.06em',
            backgroundImage: edu.gradText,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            transform: `translateY(${(1 - num) * 70}px)`,
            opacity: num,
            fontVariantNumeric: 'tabular-nums',
            paddingRight: 8,
          }}
        >
          {String(n).padStart(2, '0')}
        </div>
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 30,
            background: edu.card,
            border: `2px solid ${edu.line}`,
            boxShadow: '0 14px 34px rgba(30,36,80,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: edu.accent,
            transform: `scale(${0.6 + badge * 0.4}) rotate(${(1 - badge) * -12}deg)`,
            opacity: badge,
          }}
        >
          {icon}
        </div>
      </div>
      <div style={{ marginTop: 26 }}>
        {title.map((line, i) => {
          const p = pop(t, 0.18 + i * 0.1, 16, 0.6);
          return (
            <div key={line} style={{ overflow: 'hidden', paddingBottom: 6 }}>
              <div
                style={{
                  fontSize: titleSize,
                  fontWeight: 800,
                  lineHeight: 1.0,
                  letterSpacing: '-0.035em',
                  color: edu.ink,
                  transform: `translateY(${(1 - p) * 110}%)`,
                }}
              >
                {line}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
