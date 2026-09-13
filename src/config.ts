/**
 * Single source of truth for the "Before You Let an App Touch Your Mac…" video.
 *
 * Timings live here (not in components) so a future video can reuse every
 * component with a different config.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/**
 * THE SPOKEN SCRIPT IS LOCKED. Do not rewrite, shorten, expand, paraphrase or
 * reword this string. Caption grouping may split it visually; the words
 * themselves never change.
 */
export const LOCKED_SCRIPT =
  "I tried Noah because my Mac was slow. I liked that the app showed me the fix and waited for my approval.";

/** Noah brand palette, taken from brand-kit.html. */
export const COLORS = {
  navy: "#1A1D61",
  blue: "#2563EB",
  indigo: "#4F46E5",
  violet: "#7C3AED",
  violetLight: "#8B5CF6",
  periwinkle: "#C7CBFF",
  ink: "#0B1024",
  /** Sampled from the genuine Noah screenshots. */
  appBg: "#1E2126",
  appBgDeep: "#141820",
  white: "#FFFFFF",
  mutedText: "#B4BCC8",
} as const;

/** Mobile safe areas for TikTok / YouTube Shorts, in 1080x1920 pixels. */
export const SAFE = { top: 220, bottom: 400, left: 72, right: 72 } as const;

const s = (seconds: number) => Math.round(seconds * FPS);

/**
 * Scene durations in frames. `ugc` is the only value driven by an external
 * constraint (the generated clip's real length); the rest are fitted around it
 * so the total lands on ~23s.
 */
export const SCENES = {
  ugc: s(7.0),
  diagnosis: s(3.6),
  approval: s(4.2),
  action: s(2.6),
  result: s(2.7),
  cta: s(2.9),
} as const;

export const SCENE_ORDER = [
  "ugc",
  "diagnosis",
  "approval",
  "action",
  "result",
  "cta",
] as const;

export type SceneName = (typeof SCENE_ORDER)[number];

/** Absolute start frame of each scene. */
export const SCENE_START: Record<SceneName, number> = (() => {
  const out = {} as Record<SceneName, number>;
  let at = 0;
  for (const name of SCENE_ORDER) {
    out[name] = at;
    at += SCENES[name];
  }
  return out;
})();

export const TOTAL_FRAMES = SCENE_ORDER.reduce((n, k) => n + SCENES[k], 0);

/**
 * Caption groups for the locked line. Every spoken word is represented exactly
 * once and in order; `emphasis` only changes how a word is drawn.
 *
 * Concatenating every `text` reproduces LOCKED_SCRIPT verbatim — asserted by
 * assertCaptionsMatchScript() below.
 */
export interface CaptionGroup {
  /** Lines as they should visually break on screen. */
  lines: string[];
  /** Seconds from the start of the UGC clip. */
  from: number;
  to: number;
  /** Lines rendered in the Noah accent. Must be a subset of `lines`. */
  emphasis?: string[];
}

/**
 * Timings come from a word-level Whisper transcript of the actual take
 * (voice "Hana", mean confidence 0.962), not from estimates. Each group leads
 * its first spoken word by ~60ms, which reads as in-sync rather than late.
 * Speech ends at 6.52s; the clip runs 7.0s.
 *
 * Word boundaries: I 0.00 | tried 0.40 | Noah 0.72 | because 1.14 | my 1.56 |
 * Mac 1.80 | was 2.00 | slow 2.26-2.56 | (pause) | I 3.16 | liked 3.38 |
 * that 3.68 | the 3.88 | app 4.06 | showed 4.24 | me 4.52 | the 4.70 |
 * fix 4.84 | and 5.16 | waited 5.48 | for 5.78 | my 5.96 | approval 6.14-6.52
 */
export const CAPTIONS: CaptionGroup[] = [
  { lines: ["I tried Noah"], from: 0.0, to: 1.1, emphasis: [] },
  { lines: ["because my Mac", "was slow."], from: 1.1, to: 3.08 },
  {
    lines: ["I liked that the app", "showed me the fix"],
    from: 3.08,
    to: 5.12,
    emphasis: ["showed me the fix"],
  },
  {
    lines: ["and waited for", "my approval."],
    from: 5.12,
    to: 6.95,
    emphasis: ["my approval."],
  },
];

/** The single word inside group 1 that carries the Noah accent. */
export const HERO_WORD = "Noah";

export const HOOK_LINES = ["BEFORE YOU LET AN APP", "TOUCH YOUR MAC…"];

export const CTA = {
  kicker: "FREE MAC CHECK",
  steps: ["Describe it.", "Approve it.", "Done."],
  action: ["Download Noah.", "Try it today."],
  url: "onnoah.app",
} as const;

export const THUMBNAIL = {
  headline: ["BEFORE YOU LET AN APP", "TOUCH YOUR MAC…"],
  support: "YOU DECIDE.",
} as const;

/**
 * Guards the locked script against accidental edits to CAPTIONS. Throws at
 * import time (so a bad render fails loudly instead of shipping wrong words).
 */
export function assertCaptionsMatchScript(): void {
  const spoken = CAPTIONS.flatMap((g) => g.lines)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (spoken !== LOCKED_SCRIPT) {
    throw new Error(
      "Caption groups no longer reproduce the locked script.\n" +
        `  expected: ${LOCKED_SCRIPT}\n` +
        `  captions: ${spoken}`,
    );
  }
}

assertCaptionsMatchScript();
