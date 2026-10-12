import data from './timeline.json';
import { FPS } from './edu/motion';

/**
 * Every scene boundary is derived from the measured voice-over
 * (scripts/build-audio.py writes timeline.json). Re-record the VO and the whole
 * cut re-times itself.
 */
type SegId = keyof typeof data.segments;

export const seg = (id: SegId) => data.segments[id];
export const S = (id: SegId) => data.segments[id].start;
export const E = (id: SegId) => data.segments[id].end;

export const TOTAL = data.total;
export const TOTAL_FRAMES = Math.ceil(data.total * FPS);
export const WORDS = data.words;

/** Lead-in so each section's visual change lands just before its voice line. */
const LEAD = 0.35;

export const SCENES = {
  hook: [0, S('t1a') - LEAD],
  tip1: [S('t1a') - LEAD, S('t2a') - LEAD],
  tip2: [S('t2a') - LEAD, S('t3a') - LEAD],
  tip3: [S('t3a') - LEAD, S('t4a') - LEAD],
  tip4: [S('t4a') - LEAD, S('t5a') - LEAD],
  tip5: [S('t5a') - LEAD, S('n1') - 0.3],
  noah: [S('n1') - 0.3, S('n5') - 0.3],
  cta: [S('n5') - 0.3, TOTAL],
} as const;

export type SceneId = keyof typeof SCENES;
