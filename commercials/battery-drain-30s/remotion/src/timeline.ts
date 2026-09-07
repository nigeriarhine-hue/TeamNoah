/**
 * The 21 clips, in order, with the exact frame counts from 10-master-timeline.md.
 * Total must be 816 frames = 34.000s at 24fps. There is a runtime assertion below.
 */
export type Kind = 'LIVE' | 'PLATE+UI' | 'GFX';

export type Clip = {
  n: string;
  dur: number;
  kind: Kind;
  desc: string;
  camera: string;
  /** Composition id of the UI screen this clip carries, if any. */
  ui?: string;
};

export const CLIPS: Clip[] = [
  {n: '01', dur: 78, kind: 'LIVE', desc: 'Establishing wide — night home office', camera: 'Slow dolly push in, 35mm'},
  {n: '02', dur: 43, kind: 'PLATE+UI', desc: 'ECU battery cluster — plugged, 41% → 38%', camera: 'Slider right, rack focus, 100mm macro', ui: 'UI-01'},
  {n: '03', dur: 38, kind: 'LIVE', desc: 'CU her face — she notices', camera: '2cm push, 50mm'},
  {n: '04', dur: 38, kind: 'LIVE', desc: 'Macro — she unplugs the charger', camera: 'Locked, 100mm macro'},
  {n: '05', dur: 34, kind: 'PLATE+UI', desc: 'ECU battery cluster — on battery, 34% → 29%', camera: 'Slider left, 100mm macro', ui: 'UI-02'},
  {n: '06', dur: 29, kind: 'PLATE+UI', desc: 'Macro phone — stopwatch 00:15:12', camera: 'Slow drift down, 100mm macro', ui: 'UI-03'},
  {n: '07', dur: 34, kind: 'LIVE', desc: 'Macro keyboard — she types', camera: 'Slider R→L along the keys, 100mm'},
  {n: '08', dur: 38, kind: 'PLATE+UI', desc: 'Noah composer — her sentence', camera: 'Very slow push, 50mm', ui: 'UI-04'},
  {n: '09', dur: 24, kind: 'LIVE', desc: 'Macro vent — air moving hard', camera: 'Locked, rack to the dust, 100mm'},
  {n: '10', dur: 29, kind: 'PLATE+UI', desc: 'Noah measuring — named checks', camera: 'Slow slider down, 50mm', ui: 'UI-05'},
  {n: '11', dur: 19, kind: 'LIVE', desc: 'Macro palm rest — hand lifts off warm metal', camera: 'Locked, 100mm macro'},
  {n: '12', dur: 53, kind: 'PLATE+UI', desc: 'Noah names the cause', camera: 'Slow push, eases to rest, 50mm', ui: 'UI-06'},
  {n: '13', dur: 53, kind: 'PLATE+UI', desc: 'The proposal · APPROVE / Not now', camera: 'LOCKED OFF — no movement', ui: 'UI-07'},
  {n: '14', dur: 24, kind: 'LIVE', desc: 'Macro — finger arrives at the trackpad', camera: 'Locked, 100mm macro'},
  {n: '15', dur: 19, kind: 'LIVE', desc: 'CU — the click', camera: 'Locked, 100mm macro'},
  {n: '16', dur: 34, kind: 'PLATE+UI', desc: 'Noah acting · Done. · Undo', camera: 'Very slow push, 50mm', ui: 'UI-08'},
  {n: '17', dur: 19, kind: 'LIVE', desc: 'Macro vent — the air goes still', camera: 'Locked — same setup as clip 09'},
  {n: '18', dur: 53, kind: 'PLATE+UI', desc: 'Before / after — same check, run again', camera: 'Very slow push to rest, 50mm', ui: 'UI-09'},
  {n: '19', dur: 24, kind: 'LIVE', desc: 'Medium — shoulders drop, exhale', camera: '2cm push, 50mm'},
  {n: '20', dur: 67, kind: 'LIVE', desc: 'Wide pull-back — she resumes work', camera: 'Slow dolly back ~60cm, 35mm', ui: 'UI-11'},
  {n: '21', dur: 66, kind: 'GFX', desc: 'End card', camera: 'Flat on, no camera', ui: 'UI-10'},
];

export const TOTAL = CLIPS.reduce((a, c) => a + c.dur, 0);
if (TOTAL !== 816) {
  throw new Error(`Timeline is ${TOTAL} frames, expected 816 — see 10-master-timeline.md`);
}

/** Absolute start frame of each clip. */
export const STARTS: number[] = CLIPS.reduce<number[]>((acc, c, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + CLIPS[i - 1].dur);
  return acc;
}, []);

export const ACTS = [
  {name: 'I — the invisible drain', from: 0, to: 260},
  {name: 'II — she asks, Noah measures', from: 260, to: 404},
  {name: 'III — the cause, and the gate', from: 404, to: 553},
  {name: 'IV — done, and checked again', from: 553, to: 683},
  {name: 'V — rest', from: 683, to: 816},
];

export const tc = (f: number) =>
  `${String(Math.floor(f / 24)).padStart(2, '0')}:${String(f % 24).padStart(2, '0')}`;
