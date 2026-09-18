import {interpolate} from 'remotion';
import {WINDOW_H, WINDOW_W} from './MacWindow';

/** Where the window sits before any camera move. */
export const WINDOW_LEFT = (1080 - WINDOW_W) / 2;
export const WINDOW_TOP = 470;

export type Shot = {
  /** Zoom on the window. 1 = drawn at its natural size. */
  scale: number;
  /** The point of the WINDOW to look at, 0–1 in window space. */
  fx: number;
  fy: number;
  /**
   * Screen y the point of interest lands on. Per-shot rather than fixed,
   * because it is what decides whether the narrator line has clear dark to
   * sit in — above the window on the wide shots, below it on the close ones.
   */
  ty?: number;
};

const TARGET_X = 540;
const DEFAULT_TY = 1020;

const solve = ({scale, fx, fy, ty = DEFAULT_TY}: Shot) => {
  const cx = WINDOW_LEFT + WINDOW_W / 2;
  const cy = WINDOW_TOP + WINDOW_H / 2;
  const px = WINDOW_LEFT + fx * WINDOW_W;
  const py = WINDOW_TOP + fy * WINDOW_H;
  return {
    tx: TARGET_X - (cx + scale * (px - cx)),
    ty: ty - (cy + scale * (py - cy)),
  };
};

export const shotTransform = (shot: Shot) => {
  const {tx, ty} = solve(shot);
  return {transform: `translate(${tx}px, ${ty}px) scale(${shot.scale})`};
};

export const mixShot = (a: Shot, b: Shot, t: number): Shot => ({
  scale: a.scale + (b.scale - a.scale) * t,
  fx: a.fx + (b.fx - a.fx) * t,
  fy: a.fy + (b.fy - a.fy) * t,
  ty: (a.ty ?? DEFAULT_TY) + ((b.ty ?? DEFAULT_TY) - (a.ty ?? DEFAULT_TY)) * t,
});

/** Where the point of interest ends up on screen — the spotlight follows it. */
export const shotScreenPoint = (shot: Shot) => ({
  x: TARGET_X,
  y: shot.ty ?? DEFAULT_TY,
});

/** Screen-space edges of the window under a shot. Used to check that a
 *  narrator line has somewhere clear to live. */
export const windowBounds = (shot: Shot) => {
  const {ty} = solve(shot);
  const cy = WINDOW_TOP + WINDOW_H / 2;
  const top = cy + shot.scale * (WINDOW_TOP - cy) + ty;
  return {top, bottom: top + WINDOW_H * shot.scale};
};

/** Slow in, slow out — an operator's push, not a CSS transition. */
export const pushIn = (frame: number, from: number, to: number, a: Shot, b: Shot) => {
  const t = interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (v) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2),
  });
  return mixShot(a, b, t);
};
