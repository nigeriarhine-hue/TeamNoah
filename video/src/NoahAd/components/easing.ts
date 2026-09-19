import { Easing, interpolate } from 'remotion';

/** Premium easing curves — no linear motion unless deliberately mechanical (§26). */
export const ease = {
  /** Standard entrance: fast out of the gate, long settle. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Exits and dismissals. */
  in: Easing.bezier(0.7, 0, 0.84, 0),
  /** Symmetric moves — camera pushes, cross-scene drifts. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Gentler entrance for large objects so they feel weighty. */
  soft: Easing.bezier(0.33, 1, 0.68, 1),
} as const;

type FadeOpts = { from?: number; to?: number; easing?: (n: number) => number };

/** Frame-scoped interpolation that clamps at both ends — the workhorse. */
export const anim = (
  frame: number,
  [inStart, inEnd]: [number, number],
  [from, to]: [number, number],
  easing = ease.out,
) =>
  interpolate(frame, [inStart, inEnd], [from, to], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Opacity envelope: rise, hold, fall. Used by every scene for its own in/out. */
export const envelope = (
  frame: number,
  duration: number,
  riseFrames = 10,
  fallFrames = 10,
  opts: FadeOpts = {},
) => {
  const { from = 0, to = 1, easing = ease.inOut } = opts;
  return interpolate(
    frame,
    [0, riseFrames, Math.max(riseFrames + 1, duration - fallFrames), duration],
    [from, to, to, from],
    { easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
};
