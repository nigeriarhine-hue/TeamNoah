import React from 'react';
import { edu, FONT } from './theme';

export type Word = { seg: string; w: string; start: number; end: number };

/**
 * Phrase captions for sound-off viewing. Words always come from the locked
 * script (timings from the VO), chunked to ≤ `max` words and never across a
 * VO segment boundary. The spoken word is highlighted.
 */
export const chunk = (words: Word[], max = 4): Word[][] => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    const breakHere =
      cur.length > 0 && (cur[cur.length - 1].seg !== w.seg || cur.length >= max || /[,.:;?]$/.test(cur[cur.length - 1].w));
    if (breakHere) {
      out.push(cur);
      cur = [];
    }
    cur.push(w);
  }
  if (cur.length) out.push(cur);
  return out;
};

export const Captions: React.FC<{ words: Word[]; t: number; y: number; dark?: boolean; hideAfter?: number }> = ({
  words,
  t,
  y,
  dark = true,
  hideAfter = Infinity,
}) => {
  if (t >= hideAfter) return null;
  const groups = chunk(words);
  const g = groups.find((c, i) => {
    const next = groups[i + 1];
    const end = next ? Math.min(next[0].start, c[c.length - 1].end + 0.5) : c[c.length - 1].end + 0.5;
    return t >= c[0].start - 0.05 && t < end;
  });
  if (!g) return null;
  const inT = Math.min(1, (t - (g[0].start - 0.05)) / 0.12);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 50 }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 46,
          fontWeight: 800,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          padding: '14px 26px 16px',
          borderRadius: 18,
          background: dark ? 'rgba(11,12,18,0.82)' : 'rgba(255,255,255,0.94)',
          color: dark ? '#fff' : edu.ink,
          maxWidth: 900,
          textAlign: 'center',
          transform: `translateY(${(1 - inT) * 10}px)`,
          opacity: inT,
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
        }}
      >
        {g.map((w, i) => {
          const on = t >= w.start - 0.03;
          return (
            <span key={i} style={{ color: on ? (dark ? '#fff' : edu.ink) : dark ? 'rgba(255,255,255,0.45)' : edu.ink3 }}>
              {w.w}
              {i < g.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};
