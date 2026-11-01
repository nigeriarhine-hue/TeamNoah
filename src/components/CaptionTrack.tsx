import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../brand/theme';
import {SAFE} from './ShortsSafeArea';

export type VoSegment = {start: number; end: number; text: string};
type Chunk = {start: number; end: number; text: string};

// Split narration segments into short phrases (<= maxWords), breaking at commas when possible.
// Each phrase gets a share of the segment's time proportional to its length.
export const chunkSegments = (segments: VoSegment[], maxWords = 5): Chunk[] => {
  const out: Chunk[] = [];
  for (const seg of segments) {
    // break at commas first, then split each clause into evenly sized phrases of <= maxWords
    const clauses = seg.text.split(/(?<=,)\s+/);
    const groups: string[][] = [];
    for (const cl of clauses) {
      const w = cl.split(/\s+/).filter(Boolean);
      const k = Math.ceil(w.length / maxWords);
      const per = Math.ceil(w.length / k);
      for (let i = 0; i < w.length; i += per) groups.push(w.slice(i, i + per));
    }
    const total = groups.reduce((a, g) => a + g.join(' ').length, 0);
    let t = seg.start;
    const span = seg.end - seg.start;
    for (const g of groups) {
      const txt = g.join(' ');
      const d = (txt.length / total) * span;
      out.push({start: t, end: t + d, text: txt});
      t += d;
    }
  }
  // hold each phrase until the next starts (max 0.6s gap) so captions don't flicker
  for (let i = 0; i < out.length - 1; i++) {
    const gap = out[i + 1].start - out[i].end;
    if (gap < 0.6) out[i].end = out[i + 1].start;
  }
  return out;
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Phrase-based captions: one phrase at a time, gentle fade, accent-colored key phrases. No word bouncing.
export const CaptionTrack: React.FC<{
  segments: VoSegment[];
  highlights?: string[];
  hideRanges?: [number, number][]; // seconds where captions are hidden (e.g. end card already shows the words)
  y?: number;
}> = ({segments, highlights = [], hideRanges = [], y = SAFE.captionY}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const chunks = React.useMemo(() => chunkSegments(segments), [segments]);
  if (hideRanges.some(([a, b]) => t >= a && t < b)) return null;
  const c = chunks.find((ch) => t >= ch.start - 0.05 && t < ch.end + 0.05);
  if (!c) return null;
  const o = interpolate(t, [c.start - 0.05, c.start + 0.06, c.end - 0.02, c.end + 0.05], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // split into highlighted / plain parts
  let parts: {text: string; hi: boolean}[] = [{text: c.text, hi: false}];
  for (const h of highlights) {
    const re = new RegExp(`(${escapeRe(h)})`, 'i');
    parts = parts.flatMap((p) =>
      p.hi ? [p] : p.text.split(re).filter(Boolean).map((s) => ({text: s, hi: re.test(s) && s.toLowerCase() === h.toLowerCase()})),
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        right: SAFE.side,
        top: y,
        display: 'flex',
        justifyContent: 'center',
        opacity: o,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 50,
          lineHeight: 1.2,
          letterSpacing: '-0.015em',
          color: '#FFFFFF',
          background: 'rgba(12,14,34,0.84)',
          padding: '16px 30px 18px',
          borderRadius: 22,
          textAlign: 'center',
          maxWidth: 860,
          boxShadow: '0 10px 30px -12px rgba(0,0,0,0.45)',
        }}
      >
        {parts.map((p, i) => (
          <span key={i} style={p.hi ? {color: C.blueLight} : undefined}>
            {p.text}
          </span>
        ))}
      </div>
    </div>
  );
};
