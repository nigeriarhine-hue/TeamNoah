// Single source of truth for timing (frames @ 30fps). Total 45.0s.
export const TOTAL = 1350;

export const SCENES = {
  hook: { from: 0, dur: 150 }, //            0:00–0:05  host + headline
  describe: { from: 150, dur: 120 }, //      0:05–0:09  1 describe the problem
  checks: { from: 270, dur: 180 }, //        0:09–0:15  2 Noah checks
  explains: { from: 450, dur: 150 }, //      0:15–0:20  3 explains what it found
  plan: { from: 600, dur: 150 }, //          0:20–0:25  4 shows the plan
  approval: { from: 750, dur: 180 }, //      0:25–0:31  5 you approve
  result: { from: 930, dur: 170 }, //        0:31–0:36.7 6 Noah reports the result
  recap: { from: 1100, dur: 140 }, //        0:36.7–0:41.3 workflow recap
  cta: { from: 1240, dur: 110 }, //          0:41.3–0:45 host + CTA
} as const;

// The product-UI block runs continuously from describe → result so the window feels like one app.
export const UI_FROM = SCENES.describe.from;
export const UI_TO = SCENES.recap.from;

// Voiceover cues. hostA/hostB are the exact padded tracks the host clips were lip-synced to.
export const VO = [
  { file: "audio/vo/hostA-audio.mp3", from: 0, dur: 151 },
  { file: "audio/vo/vo1.mp3", from: 258, dur: 73 },
  { file: "audio/vo/vo2.mp3", from: 465, dur: 52 },
  { file: "audio/vo/vo3.mp3", from: 612, dur: 59 },
  { file: "audio/vo/vo4.mp3", from: 762, dur: 102 },
  { file: "audio/vo/vo5.mp3", from: 876, dur: 49 },
  { file: "audio/vo/vo6.mp3", from: 939, dur: 92 },
  { file: "audio/vo/vo7.mp3", from: 1038, dur: 56 },
  { file: "audio/vo/vo8.mp3", from: 1110, dur: 109 },
  { file: "audio/vo/hostB-audio.mp3", from: 1240, dur: 110 },
];

// Spoken ranges (for music ducking) — tighter than the files (which include padding).
export const SPEECH: Array<[number, number]> = [
  [7, 136],
  [258, 331],
  [465, 517],
  [612, 671],
  [762, 864],
  [876, 925],
  [939, 1031],
  [1038, 1094],
  [1110, 1219],
  [1249, 1318],
];

// Phrase captions (spoken words). `em` = emphasised phrase inside `text`.
export type Cue = { from: number; to: number; text: string; em?: string; dark?: boolean };
export const CAPTIONS: Cue[] = [
  { from: 7, to: 64, text: "When you tell Noah your PC is slow,", dark: true },
  { from: 258, to: 334, text: "First, Noah checks what's actually happening.", em: "checks what's actually happening" },
  { from: 465, to: 522, text: "Then it explains what it found…", em: "explains what it found" },
  { from: 612, to: 676, text: "…and shows you what it recommends.", em: "what it recommends" },
  { from: 762, to: 808, text: "Before anything changes,", em: "Before anything changes" },
  { from: 808, to: 868, text: "Noah asks for your approval.", em: "your approval" },
  { from: 939, to: 978, text: "If you approve it,", em: "you approve" },
  { from: 978, to: 1034, text: "Noah performs the supported actions…" },
  { from: 1038, to: 1098, text: "…and then shows you what changed.", em: "shows you what changed" },
];

// Sound design cues: [frame, file, volume]
export const SFX: Array<[number, string, number]> = [
  [0, "whoosh", 0.25],
  [142, "whoosh", 0.45],
  // typing "My PC feels slow" (S2 local 22 → 70)
  ...Array.from({ length: 16 }, (_, i) => [172 + i * 3, `type${i % 4}`, 0.5] as [number, string, number]),
  [225, "send", 0.7],
  [264, "whoosh", 0.3],
  // progress items + scan
  [272, "scan", 0.5],
  [276, "check", 0.5],
  [288, "check", 0.5],
  [300, "check", 0.5],
  [312, "check", 0.5],
  [324, "check", 0.5],
  [348, "scan", 0.45],
  [372, "tick", 0.6],
  [384, "tick", 0.6],
  [396, "tick", 0.6],
  [408, "tick", 0.6],
  [450, "whoosh", 0.3],
  [480, "reveal", 0.5],
  [600, "whoosh", 0.3],
  [618, "reveal", 0.5],
  [636, "reveal2", 0.5],
  [654, "reveal", 0.5],
  [672, "reveal2", 0.5],
  [700, "reveal", 0.35],
  [754, "modal", 0.8],
  [876, "reveal2", 0.4],
  [916, "approve", 0.9],
  [934, "whoosh", 0.25],
  [968, "check", 0.55],
  [1004, "check", 0.55],
  [1030, "chime", 0.7],
  [1096, "whoosh", 0.4],
  [1110, "tick", 0.35],
  [1124, "tick", 0.35],
  [1138, "tick", 0.35],
  [1152, "tick", 0.35],
  [1166, "tick", 0.35],
  [1180, "tick", 0.35],
  [1222, "reveal2", 0.35],
  [1236, "whoosh", 0.4],
  [1262, "reveal", 0.4],
];
