import React from 'react';
import { edu, FONT } from './theme';
import { pop, ramp } from './motion';

/**
 * Line-by-line masked reveal. Each line is either a string or
 * { text, accent } where accent lines get the gradient.
 */
export type KLine = string | { text: string; accent?: boolean; color?: string };

export const KineticLines: React.FC<{
  lines: KLine[];
  t: number;
  at?: number;
  stagger?: number;
  size?: number;
  color?: string;
  align?: 'left' | 'center';
  weight?: number;
  lineHeight?: number;
  out?: number; // second at which the block exits (optional)
}> = ({ lines, t, at = 0, stagger = 0.09, size = 110, color = edu.ink, align = 'left', weight = 800, lineHeight = 0.98, out }) => {
  const exit = out === undefined ? 0 : ramp(t, out, out + 0.3);
  return (
    <div style={{ fontFamily: FONT, textAlign: align, opacity: 1 - exit, transform: `translateY(${-exit * 30}px)` }}>
      {lines.map((l, i) => {
        const L = typeof l === 'string' ? { text: l } : l;
        const p = pop(t, at + i * stagger, 17, 0.6);
        return (
          <div key={i} style={{ overflow: 'hidden', paddingBottom: size * 0.06 }}>
            <div
              style={{
                fontSize: size,
                fontWeight: weight,
                lineHeight,
                letterSpacing: '-0.035em',
                color: L.accent ? 'transparent' : L.color ?? color,
                backgroundImage: L.accent ? edu.gradText : undefined,
                WebkitBackgroundClip: L.accent ? 'text' : undefined,
                backgroundClip: L.accent ? 'text' : undefined,
                transform: `translateY(${(1 - p) * 105}%)`,
                display: 'inline-block',
              }}
            >
              {L.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Takeaway "stamp": the one-line lesson at the end of each chapter.
 * Ink block with a gradient rule, lands with a small overshoot.
 */
export const Takeaway: React.FC<{ lines: string[]; t: number; at: number; tone?: 'ink' | 'amber'; size?: number }> = ({ lines, t, at, tone = 'ink', size = 58 }) => {
  const p = pop(t, at, 13, 0.6);
  if (t < at) return null;
  return (
    <div
      style={{
        fontFamily: FONT,
        display: 'inline-flex',
        flexDirection: 'column',
        background: edu.ink,
        borderRadius: 22,
        padding: '24px 34px 26px',
        boxShadow: '0 24px 60px rgba(14,18,34,0.28)',
        transform: `scale(${0.85 + p * 0.15}) translateY(${(1 - p) * 30}px)`,
        opacity: Math.min(1, p * 1.4),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: tone === 'amber' ? edu.amber : edu.grad }} />
      {lines.map((l) => (
        <div key={l} style={{ fontSize: size, fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.025em', color: '#fff' }}>
          {l}
        </div>
      ))}
    </div>
  );
};

/** Small uppercase label with leading rule, for diagram sections. */
export const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = edu.ink3, size = 26 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontSize: size, fontWeight: 800, letterSpacing: '0.14em', color }}>
    <span style={{ width: 24, height: 3, borderRadius: 2, background: color, opacity: 0.6 }} />
    {children}
  </div>
);
