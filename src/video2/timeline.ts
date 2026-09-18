/**
 * "Your Game Might Not Be the Problem" — the edit, in one file.
 *
 * Every number below was measured off the source clips rather than guessed:
 *   • Internal cuts came from frame-differencing each clip (see notes per clip).
 *   • The caption beats came from the talking clip's own speech envelope —
 *     three utterances at 0.65–3.33, 3.70–4.60 and 5.00–6.86 seconds, which is
 *     exactly the locked line's three breath groups.
 *
 * Change a duration here and the whole composition follows; nothing downstream
 * hard-codes a frame number.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Cross-dissolve length. Short enough to stay punchy on a phone. */
export const XFADE = 8;

const sec = (s: number) => Math.round(s * FPS);

/**
 * Where each UGC clip is cut. `inPoint` is in seconds of the SOURCE file;
 * `cut` records the clip's own internal edit so scene lengths can be chosen to
 * land it somewhere useful instead of on an awkward frame.
 */
export const clips = {
  /** Wide desk shot, then a hard cut at 2.00s to the frustrated close-up. */
  hook: {src: 'ugc/gamer/video2-hook.mp4', inPoint: 0.6, cut: 2.0},
  /** Three shots: 0–4.92, 4.92–6.88, 6.88–end. The line ends at 6.86, so we
   *  cut out before the third shot (eyes-closed close-up) begins. */
  talking: {src: 'ugc/gamer/video2-talking.mp4', inPoint: 0.5, cut: 4.917},
  /** Profile at the desk, then a hand-on-mouse macro at 2.375s. */
  broll: {src: 'ugc/gamer/video2-broll.mp4', inPoint: 1.1, cut: 2.375},
  /** Wide, then the relieved close-up at 1.958s. */
  payoff: {src: 'ugc/gamer/video2-payoff.mp4', inPoint: 0.82, cut: 1.958},
} as const;

/** Scene lengths in frames. */
export const D = {
  hook: sec(2.9),
  talking: sec(6.4),
  broll: sec(2.7),
  /** One continuous Noah window: diagnosis → approval → action → result. */
  session: sec(4.4) + sec(4.2) + sec(3.3),
  payoff: sec(3.2),
} as const;

const cum = (...xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** Absolute start frame of each scene. */
export const S = {
  hook: 0,
  talking: cum(D.hook),
  broll: cum(D.hook, D.talking),
  session: cum(D.hook, D.talking, D.broll),
  payoff: cum(D.hook, D.talking, D.broll, D.session),
} as const;

export const TOTAL = cum(D.hook, D.talking, D.broll, D.session, D.payoff);

/**
 * Beats inside the persistent Noah window, relative to the start of `session`.
 * The window itself never unmounts — only its contents change — so the whole
 * stretch reads as one real app session rather than four screenshots.
 */
export const SESSION = {
  diagnosis: {from: 0, duration: sec(4.4)},
  approval: {from: sec(4.4), duration: sec(4.2)},
  action: {from: sec(4.4) + sec(4.2), duration: sec(1.9)},
  result: {from: sec(4.4) + sec(4.2) + sec(1.9), duration: sec(1.4)},
} as const;

/**
 * The locked spoken line, split at the pauses the speaker actually takes.
 * Times are in frames relative to the start of the `talking` scene.
 *
 * Concatenated, `text` is verbatim:
 * "My game kept stuttering, so I thought the game was the problem. Noah
 *  checked my Mac and found what was actually slowing it down."
 */
export const CAPTIONS: {text: string; from: number; duration: number}[] = [
  {text: 'My game kept stuttering,', from: sec(0.1), duration: sec(1.18)},
  {
    text: 'so I thought the game\nwas the problem.',
    from: sec(1.28),
    duration: sec(1.66),
  },
  {text: 'Noah checked my Mac', from: sec(3.14), duration: sec(1.02)},
  {
    text: 'and found what was\nactually slowing it down.',
    from: sec(4.44),
    duration: sec(1.98),
  },
];

/** Sanity net: the ad has to stay inside the 25–28s brief. */
if (TOTAL < sec(25) || TOTAL > sec(28)) {
  throw new Error(
    `Composition is ${(TOTAL / FPS).toFixed(2)}s — the brief is 25–28s. Adjust D.`,
  );
}
