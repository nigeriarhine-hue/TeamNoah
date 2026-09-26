import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile } from 'remotion';
import { W } from '../theme';
import hotspots from '../ui-hotspots.json';

export type Rect = { x: number; y: number; w: number; h: number };
export const spot = (key: keyof typeof hotspots): Rect => hotspots[key] as Rect;

/**
 * The screenshot is a 1.13:1 window and the frame is 0.56:1, so it can never
 * fill the frame without losing half its width. Rather than float the window
 * on empty ground, the film gives it a fixed screen — a rounded viewport in
 * the upper two thirds — and moves the UI *inside* it. The viewport edges
 * never move, so every push reads as zooming into a screen, and the band
 * below it is where the captions live.
 */
export const VIEWPORT = { top: 170, height: 1350 } as const;
const CENTER_Y = VIEWPORT.top + VIEWPORT.height / 2;

/**
 * A framing of the source image: how far in, and which point of the image
 * sits at the centre of the viewport.
 */
export type Shot = {
  /** image width as a multiple of the frame width */
  scale: number;
  /** normalised image point placed at the viewport centre */
  cx: number;
  cy: number;
};

const layout = (s: Shot, aspect: number) => {
  const imgW = W * s.scale;
  const imgH = imgW / aspect;
  return { imgW, imgH, left: W / 2 - imgW * s.cx, top: CENTER_Y - imgH * s.cy };
};

export const FocusZoom: React.FC<{
  src: string;
  aspect: number;
  from: Shot;
  to?: Shot;
  progress: number;
  easing?: (t: number) => number;
  children?: React.ReactNode;
}> = ({ src, aspect, from, to, progress, easing, children }) => {
  const p = easing ? easing(progress) : progress;
  const a = layout(from, aspect);
  const b = to ? layout(to, aspect) : a;
  const lerp = (x: number, y: number) => interpolate(p, [0, 1], [x, y]);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: VIEWPORT.top,
          width: W,
          height: VIEWPORT.height,
          overflow: 'hidden',
          borderRadius: 26,
          boxShadow:
            '0 44px 120px -24px rgba(0,0,0,.92), 0 0 0 1px rgba(160,170,220,.10)',
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            position: 'absolute',
            width: lerp(a.imgW, b.imgW),
            height: lerp(a.imgH, b.imgH),
            left: lerp(a.left, b.left),
            top: lerp(a.top, b.top) - VIEWPORT.top,
          }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Maps a point in source-image space into frame coordinates for a shot. */
export const projectPoint = (s: Shot, aspect: number, pt: { x: number; y: number }) => {
  const l = layout(s, aspect);
  return { x: l.left + l.imgW * pt.x, y: l.top + l.imgH * pt.y };
};

/**
 * A UI spotlight: everything outside the region dims slightly and the region
 * gets a faint lift. Used instead of cropping, so the whole answer stays
 * readable while the eye is told where to look.
 */
export const Spotlight: React.FC<{
  shot: Shot;
  aspect: number;
  rect: Rect;
  strength: number;
  pad?: number;
}> = ({ shot, aspect, rect, strength, pad = 16 }) => {
  if (strength <= 0.001) return null;
  const a = projectPoint(shot, aspect, { x: rect.x, y: rect.y });
  const b = projectPoint(shot, aspect, { x: rect.x + rect.w, y: rect.y + rect.h });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: VIEWPORT.top,
        width: W,
        height: VIEWPORT.height,
        overflow: 'hidden',
        borderRadius: 26,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: a.x - pad,
          top: a.y - VIEWPORT.top - pad,
          width: b.x - a.x + pad * 2,
          height: b.y - a.y + pad * 2,
          borderRadius: 16,
          boxShadow: `0 0 0 9999px rgba(4,6,14,${0.52 * strength}), 0 0 60px 6px rgba(99,102,241,${0.16 * strength})`,
        }}
      />
    </div>
  );
};
