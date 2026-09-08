import {interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

export type Stage = {
  width: number;
  height: number;
  /** true for the 9:16 cut */
  tall: boolean;
  /** type/rhythm scale unit — multiply every hard-coded px by this */
  u: number;
  /** safe horizontal padding */
  pad: number;
};

export const useStage = (): Stage => {
  const {width, height} = useVideoConfig();
  const tall = height > width;
  return {
    width,
    height,
    tall,
    u: tall ? width / 1180 : width / 1920,
    pad: tall ? width * 0.075 : width * 0.078,
  };
};

/**
 * Calm entrance: a short rise and a fade, no overshoot. The brand is unhurried —
 * nothing in here bounces.
 */
export const rise = (
  frame: number,
  start: number,
  opts: {distance?: number; duration?: number; axis?: 'y' | 'x'} = {},
) => {
  const {distance = 22, duration = 22, axis = 'y'} = opts;
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const offset = (1 - p) * distance;
  return {
    opacity: p,
    transform: axis === 'y' ? `translateY(${offset}px)` : `translateX(${offset}px)`,
  };
};

/** Plain fade, for things that shouldn't move at all. */
export const fade = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

/** Fade in, hold, fade out — for a scene's own envelope. */
export const envelope = (frame: number, length: number, inDur = 16, outDur = 16) =>
  interpolate(
    frame,
    [0, inDur, length - outDur, length],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)},
  );

export const useFrameIn = () => useCurrentFrame();

/** Deterministic noise so every render of frame N is identical. */
export const seeded = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};
