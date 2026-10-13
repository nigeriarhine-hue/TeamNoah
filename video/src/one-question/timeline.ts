// Every beat of "I Asked Noah One Question", in seconds. Voice placements are
// tuned to the stems' word timings (see scripts/build_audio.py).
export const FPS = 30;
export const DURATION_S = 24;
export const f = (s: number) => Math.round(s * FPS);

export const T = {
  // Scene 1–2: creator hook (Higgsfield clip, lip-synced)
  hookEnd: 4.0,
  settingsText: 0.75, // "five different settings"
  icons: 1.05,
  oneQuestionText: 2.95, // "one question"
  toUi: 3.72,

  // Scene 3: typing into the real composer
  typeStart: 4.15,
  typeEnd: 5.6,
  send: 5.82,

  // Scene 4: Noah checks
  looking: 6.0,
  checks: [6.4, 6.75, 7.1, 7.45],
  checkedHeadline: 6.2,
  noGuessSticker: 6.95,
  tiles: 7.75,

  // Scene 5: diagnosis
  situation: 9.0,

  // Scene 6: the plan
  plan: 11.05,
  planRows: [11.35, 11.75, 12.15, 12.55],

  // Scene 7: approval
  approval: 13.15,
  approvalZoom: 13.55,
  youDecide: 14.2,
  cursorIn: 14.7,
  cursorArrive: 16.25,
  click: 17.0,

  // Scene 8: done + CTA
  done: 17.35,
  closer: 18.3,
  noGuessing: 19.55,
  cta: 20.3,
};

export const VO = [
  { src: 'audio/vo-01-opening.wav', at: 0.0 },
  { src: 'audio/vo-02-question.wav', at: 4.15 },
  { src: 'audio/vo-03-checked.wav', at: 6.2 },
  { src: 'audio/vo-04-explained.wav', at: 9.05 },
  { src: 'audio/vo-05-recommended.wav', at: 11.15 },
  { src: 'audio/vo-06-approval.wav', at: 13.3 },
  { src: 'audio/vo-07-no-guessing.wav', at: 18.4 },
  { src: 'audio/vo-08-cta.wav', at: 20.45 },
];

// Phrase captions (spoken words only). Highlighted phrases take the accent.
export const CAPTIONS: { from: number; to: number; text: string; hi?: string }[] = [
  { from: 0.0, to: 1.95, text: "I didn't check five different settings.", hi: 'five different settings' },
  { from: 2.2, to: 3.8, text: 'I just asked Noah one question.', hi: 'one question' },
  { from: 4.15, to: 5.95, text: 'Why is my PC so slow?' },
  { from: 6.2, to: 8.75, text: 'Noah checked what was actually happening,', hi: 'what was actually happening' },
  { from: 9.05, to: 10.6, text: 'explained what it found,' },
  { from: 11.15, to: 12.85, text: 'showed me what it recommended,', hi: 'what it recommended' },
  { from: 13.3, to: 15.15, text: 'and still waited for my approval', hi: 'my approval' },
  { from: 15.15, to: 16.95, text: 'before changing anything.' },
  // 18.4–24: the big on-screen type *is* the caption (identical words).
];

export const SFX: { src: string; at: number; volume?: number }[] = [
  { src: 'audio/sfx-reveal.wav', at: 0.7, volume: 0.5 },
  ...[0, 1, 2, 3, 4].map((i) => ({ src: 'audio/sfx-tick.wav', at: 1.05 + i * 0.09, volume: 0.35 })),
  { src: 'audio/sfx-reveal.wav', at: 2.9, volume: 0.6 },
  { src: 'audio/sfx-reveal.wav', at: 3.7, volume: 0.45 },
  { src: 'audio/sfx-send.wav', at: 5.82, volume: 0.8 },
  { src: 'audio/sfx-reveal.wav', at: 6.0, volume: 0.35 },
  ...[6.4, 6.75, 7.1, 7.45].map((at) => ({ src: 'audio/sfx-tick.wav', at, volume: 0.55 })),
  { src: 'audio/sfx-reveal.wav', at: 7.7, volume: 0.45 },
  ...[0, 1, 2, 3].map((i) => ({ src: 'audio/sfx-tick.wav', at: 7.9 + i * 0.2, volume: 0.4 })),
  { src: 'audio/sfx-reveal.wav', at: 9.0, volume: 0.4 },
  { src: 'audio/sfx-reveal.wav', at: 11.05, volume: 0.4 },
  ...[11.35, 11.75, 12.15, 12.55].map((at) => ({ src: 'audio/sfx-tick.wav', at, volume: 0.5 })),
  { src: 'audio/sfx-reveal.wav', at: 13.15, volume: 0.55 },
  { src: 'audio/sfx-click.wav', at: 17.0, volume: 0.9 },
  { src: 'audio/sfx-approve.wav', at: 17.03, volume: 0.7 },
  { src: 'audio/sfx-chime.wav', at: 17.45, volume: 0.6 },
  { src: 'audio/sfx-reveal.wav', at: 18.3, volume: 0.4 },
  { src: 'audio/sfx-reveal.wav', at: 20.3, volume: 0.5 },
];
