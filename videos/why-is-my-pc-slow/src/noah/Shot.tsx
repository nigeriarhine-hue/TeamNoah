import React from 'react';
import { Img, interpolate, staticFile } from 'remotion';

/**
 * Real Noah screenshots (IMG_0583–0595 from the product, 2× Lanczos copies in
 * public/noah-ui). Nothing is redrawn or invented — the camera only moves.
 *
 * Camera rects are in ORIGINAL screenshot pixels (1170 px wide) so they can be
 * read straight off the source captures.
 */
export const SHOTS = {
  disk: { src: 'noah-ui/02-checking-disk.jpg', h: 989 },
  steps: { src: 'noah-ui/03-checking-startup.jpg', h: 985 },
  plan: { src: 'noah-ui/04-checked-and-plan.jpg', h: 977 },
  approve: { src: 'noah-ui/05-can-noah-do-this.jpg', h: 985 },
} as const;

const SRC_W = 1170;
const UPS = 2; // files are 2× the original capture

export type Cam = { x: number; y: number; w: number };
export type Key = { t: number; cam: Cam };

const camAt = (keys: Key[], t: number): Cam => {
  const ts = keys.map((k) => k.t);
  const pick = (f: (c: Cam) => number) =>
    interpolate(t, ts, keys.map((k) => f(k.cam)), {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (x) => 1 - Math.pow(1 - x, 3),
    });
  return keys.length === 1 ? keys[0].cam : { x: pick((c) => c.x), y: pick((c) => c.y), w: pick((c) => c.w) };
};

export const Shot: React.FC<{ shot: keyof typeof SHOTS; keys: Key[]; t: number; vw: number; vh: number }> = ({ shot, keys, t, vw, vh }) => {
  const s = SHOTS[shot];
  const cam = camAt(keys, t);
  const scale = vw / cam.w; // screen px per original px
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#16171d' }}>
      <Img
        src={staticFile(s.src)}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SRC_W * UPS,
          height: s.h * UPS,
          transformOrigin: '0 0',
          transform: `translate(${-cam.x * scale}px, ${-cam.y * scale}px) scale(${scale / UPS})`,
        }}
      />
    </div>
  );
};

/** Map an original-screenshot point to viewport px for a given camera. */
export const toView = (keys: Key[], t: number, vw: number, px: number, py: number) => {
  const cam = camAt(keys, t);
  const scale = vw / cam.w;
  return { x: (px - cam.x) * scale, y: (py - cam.y) * scale };
};
