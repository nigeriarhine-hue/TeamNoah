// All timing in seconds, converted to frames at 30 fps.
// Scene boundaries follow the storyboard order; durations are driven by the
// recorded voiceover so every line lands inside its scene.
export const FPS = 30;
export const f = (s: number) => Math.round(s * FPS);

export const SCENES = {
  s01Hook: 0,
  s02Question: 5.1,
  s03Issues: 7.2,
  s04Tell: 16.2, // Noah UI flow starts here (scenes 4–11 share one window)
  s05Checking: 19.1,
  s06Diagnosis: 20.8,
  s07Checked: 22.7,
  s08Plan: 25.0,
  s09Approval: 27.0,
  s10Action: 30.2,
  s11Result: 32.1,
  s12Reaction: 35.0,
  s13BackToGaming: 36.3,
  s14CTA: 40.1,
  s15End: 43.9,
  end: 46.0,
} as const;

export const TOTAL_FRAMES = f(SCENES.end);

// Scenes cross-dissolve: each one (after the first) starts OVERLAP frames early,
// so its local frame 0 lands at vis(sceneStart). SFX synced to UI use this.
export const OVERLAP = 8;
export const vis = (sceneStart: number) => (sceneStart === 0 ? 0 : sceneStart - OVERLAP / FPS);

// Voiceover clip placements (seconds). Clip lengths measured after trimming.
export const VO: { file: string; at: number; dur: number; text: string }[] = [
  { file: 'vo01', at: 0.3, dur: 4.77, text: 'The next big games, like Grand Theft Auto 6 and Call of Duty, are coming.' },
  { file: 'vo02', at: 5.2, dur: 1.8, text: 'But is your PC actually ready?' },
  { file: 'vo03', at: 7.3, dur: 8.79, text: 'Slow startup, background activity, low storage, and extra system load can all affect your gaming experience before you even start playing.' },
  { file: 'vo04', at: 16.35, dur: 2.47, text: "Instead of guessing, tell Noah what's happening." },
  { file: 'vo05', at: 19.2, dur: 1.41, text: 'Noah checks your PC,' },
  { file: 'vo06', at: 20.9, dur: 1.52, text: 'explains what it finds,' },
  { file: 'vo07', at: 25.1, dur: 1.53, text: 'shows you what it recommends,' },
  { file: 'vo08', at: 27.2, dur: 2.48, text: 'and nothing changes until you approve it.' },
  { file: 'vo09', at: 30.3, dur: 1.43, text: 'Then Noah gets to work,' },
  { file: 'vo10', at: 32.3, dur: 1.41, text: 'and shows you what changed.' },
  { file: 'vo11', at: 36.4, dur: 3.45, text: 'So before your next big download, check your PC first.' },
  { file: 'vo12', at: 40.25, dur: 1.16, text: 'Free PC Check.' },
  { file: 'vo13', at: 41.6, dur: 3.47, text: 'Download Noah, and try it today at onnoah.app.' },
];

// Lip-sync mouth patches (Wav2Lip, generated locally). Each clip has 0.3 s of
// silence padding before the line, so it starts 0.3 s before the VO.
export const LIPSYNC: Record<string, { at: number; frames: number }> = {
  vo01: { at: 0.3 - 0.3, frames: 157 },
  vo02: { at: 5.2 - 0.3, frames: 68 },
  vo11: { at: 36.4 - 0.3, frames: 118 },
  vo13: { at: 41.6 - 0.3, frames: 118 },
};
/** Lip clip placement relative to a scene's local frame 0. */
export const lipFor = (file: string, sceneStart: number) => ({
  file,
  from: f(LIPSYNC[file].at) - f(vis(sceneStart)),
  frames: LIPSYNC[file].frames,
});
