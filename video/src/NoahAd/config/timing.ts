/**
 * Timing sheet — single source of truth for scene placement (§56 deliverable 7).
 * 30 fps. Scenes are laid out back to back; each one overlaps the next by
 * OVERLAP frames and fades itself out, so cuts breathe instead of snapping.
 */
export const FPS = 30;
export const OVERLAP = 8;

const s = (sec: number) => Math.round(sec * FPS);

type Beat = { id: string; start: number; duration: number };

const build = (spec: Array<[string, number]>): Record<string, Beat> => {
  const out: Record<string, Beat> = {};
  let cursor = 0;
  for (const [id, seconds] of spec) {
    const duration = s(seconds);
    out[id] = { id, start: cursor, duration };
    cursor += duration;
  }
  return out;
};

export const scenes = build([
  ['hook', 4.4],          // 0.00 – 4.40   the contradiction
  ['oldWay', 3.9],        // 4.40 – 8.30   the old way, then the turn
  ['reveal', 2.5],        // 8.30 – 10.80  Noah appears
  ['investigate', 2.8],   // 10.80 – 13.60 Noah actually checks
  ['diagnose', 2.9],      // 13.60 – 16.50 the real cause
  ['approval', 4.7],      // 16.50 – 21.20 the trust moment
  ['execution', 2.8],     // 21.20 – 24.00 diagnose / explain / approve / fix
  ['verify', 2.7],        // 24.00 – 26.70 proof
  ['brand', 4.7],         // 26.70 – 31.40 logo, promise, CTA
]);

export const TOTAL_FRAMES =
  scenes.brand.start + scenes.brand.duration;

/** Absolute frame at which each audio event should land. */
export const cues = {
  hookImpact: scenes.hook.start + 5,
  hookLine2: scenes.hook.start + s(1.55),
  hookLine3: scenes.hook.start + s(2.95),
  montage: scenes.oldWay.start + s(0.05),
  montage2: scenes.oldWay.start + s(0.7),
  montage3: scenes.oldWay.start + s(1.35),
  blackout: scenes.oldWay.start + s(2.1),
  turn: scenes.oldWay.start + s(2.45),
  noahLift: scenes.reveal.start + s(0.12),
  windowIn: scenes.reveal.start + s(0.95),
  check1: scenes.investigate.start + s(0.5),
  check2: scenes.investigate.start + s(1.0),
  check3: scenes.investigate.start + s(1.5),
  check4: scenes.investigate.start + s(2.0),
  diagnosis: scenes.diagnose.start + s(0.45),
  tiles: scenes.diagnose.start + s(1.55),
  stop: scenes.approval.start + s(0.1),
  showFix: scenes.approval.start + s(1.1),
  typed: scenes.approval.start + s(2.15),
  dialog: scenes.approval.start + s(2.95),
  click: scenes.approval.start + s(3.95),
  beat1: scenes.execution.start + s(0.12),
  beat2: scenes.execution.start + s(0.72),
  beat3: scenes.execution.start + s(1.32),
  beat4: scenes.execution.start + s(1.92),
  verify: scenes.verify.start + s(0.05),
  proof: scenes.verify.start + s(1.15),
  logo: scenes.brand.start + s(0.15),
  promise1: scenes.brand.start + s(1.1),
  promise2: scenes.brand.start + s(1.55),
  promise3: scenes.brand.start + s(2.0),
  cta: scenes.brand.start + s(2.95),
} as const;
