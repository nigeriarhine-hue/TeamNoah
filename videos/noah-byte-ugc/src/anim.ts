import { Easing } from "remotion";
import { Expr, lerpExpr } from "./byte/face";
import { lerpPose, Pose } from "./byte/Byte";
import timeline from "./data/timeline.json";

export const TL = timeline as {
  fps: number; durationInFrames: number; seconds: number;
  scenes: { id: number; from: number; to: number }[];
  lines: { line: number; text: string; start: number; end: number; words: { w: string; s: number; e: number }[] }[];
  mouth: number[];
  cues: { name: string; t: number; frame: number }[];
};

export const ease = Easing.bezier(0.45, 0, 0.25, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// piecewise keyframes
const seg = <T,>(f: number, keys: [number, T][]): [T, T, number] => {
  if (f <= keys[0][0]) return [keys[0][1], keys[0][1], 0];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, a] = keys[i];
    const [f1, b] = keys[i + 1];
    if (f <= f1) return [a, b, (f - f0) / Math.max(1e-6, f1 - f0)];
  }
  const last = keys[keys.length - 1][1];
  return [last, last, 1];
};
export const kf = (f: number, keys: [number, number][], e = ease) => {
  const [a, b, t] = seg(f, keys);
  return a + (b - a) * e(clamp01(t));
};
export const kfPose = (f: number, keys: [number, Pose][], e = ease) => {
  const [a, b, t] = seg(f, keys);
  return lerpPose(a, b, e(clamp01(t)));
};
export const kfExpr = (f: number, keys: [number, Expr][], e = ease) => {
  const [a, b, t] = seg(f, keys);
  return lerpExpr(a, b, e(clamp01(t)));
};

// natural blinks (closing 3f, opening 4f)
export const blinkAmount = (f: number, at: number[]) => {
  let v = 0;
  for (const b of at) {
    const d = f - b;
    if (d >= 0 && d < 3) v = Math.max(v, (d + 1) / 3);
    else if (d >= 3 && d < 7) v = Math.max(v, 1 - (d - 2) / 4);
  }
  return v;
};

export const mouthAt = (f: number) => TL.mouth[Math.max(0, Math.min(TL.mouth.length - 1, Math.round(f)))] ?? 0;

// living face: expression + lipsync + blinks + eye darts
export const liveExpr = (f: number, base: Expr, blinks: number[], opts: { look?: [number, number] } = {}): Expr => {
  const m = mouthAt(f);
  const b = blinkAmount(f, blinks);
  const e = { ...base };
  e.mouthOpen = Math.max(e.mouthOpen, m * 0.95);
  e.mouthW = e.mouthW * (1 - m * 0.12 + Math.sin(f * 1.7) * 0.05 * m);
  e.lidTopL = Math.min(1, e.lidTopL + b * (1 - e.lidTopL));
  e.lidTopR = Math.min(1, e.lidTopR + b * (1 - e.lidTopR));
  e.browY += m * 0.12; // brows lift slightly on emphasis
  const dartX = Math.sin(f * 0.21) * 0.05 + Math.sin(f * 0.07) * 0.06;
  const dartY = Math.sin(f * 0.13) * 0.04;
  e.pupilX += (opts.look?.[0] ?? 0) + dartX;
  e.pupilY += (opts.look?.[1] ?? 0) + dartY;
  return e;
};

// talking body language on top of a pose
export const liveBody = (f: number, p: Pose, amt = 1): Pose => {
  const m = mouthAt(f);
  const t = f / 30;
  return {
    ...p,
    y: p.y + Math.sin(t * 2.4) * 0.025,
    headPitch: p.headPitch + (Math.sin(t * 6.1) * 0.03 + m * 0.05) * amt,
    headYaw: p.headYaw + Math.sin(t * 1.9) * 0.04 * amt,
    headRoll: p.headRoll + Math.sin(t * 2.7) * 0.03 * amt,
    roll: p.roll + Math.sin(t * 1.6) * 0.015 * amt,
  };
};

// handheld phone camera motion (deterministic layered sines)
export const handheld = (f: number, amp = 1) => {
  const t = f / 30;
  return {
    x: (Math.sin(t * 1.3) * 0.03 + Math.sin(t * 3.7 + 1) * 0.012) * amp,
    y: (Math.sin(t * 1.7 + 2) * 0.025 + Math.sin(t * 4.3) * 0.01) * amp,
    roll: (Math.sin(t * 1.1 + 0.5) * 0.012 + Math.sin(t * 3.1) * 0.004) * amp,
  };
};

export const wordFrame = (line: number, startsWith: string) => {
  const L = TL.lines[line - 1];
  const w = L.words.find((x) => x.w.toLowerCase().replace(/[^a-z0-9']/g, "").startsWith(startsWith));
  if (!w) throw new Error(`word ${startsWith} not in line ${line}`);
  return Math.round(w.s * TL.fps);
};
export const cueFrame = (name: string) => TL.cues.find((c) => c.name === name)!.frame;
