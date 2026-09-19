/**
 * build-audio.mjs — composes the film's original score and sound design.
 *
 * Every event is placed against the same cue times the picture is cut to
 * (src/NoahAd/config/timing.ts), so motion and audio land together by
 * construction rather than by eye.
 *
 * Output: public/audio/noah-score.wav (48 kHz stereo). Original material only —
 * replaceable by dropping a supplied track at the same path.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  Biquad, Bus, SR, TAU, adsr, limit, noise, pluck, reverb, sine, softSaw, toWav, tri,
} from './synth.mjs';

const FPS = 30;
const DURATION = 31.4;

/* Cue sheet — mirrors config/timing.ts. Seconds. */
const S = {
  hook: 0.0, oldWay: 4.4, reveal: 8.3, investigate: 10.8,
  diagnose: 13.6, approval: 16.5, execution: 21.2, verify: 24.0, brand: 26.7,
};
const C = {
  hookImpact: S.hook + 5 / FPS,
  hookLine2: S.hook + 1.55,
  hookLine3: S.hook + 2.95,
  montage: S.oldWay + 0.05,
  montage2: S.oldWay + 0.7,
  montage3: S.oldWay + 1.35,
  blackout: S.oldWay + 2.1,
  turn: S.oldWay + 2.45,
  noahLift: S.reveal + 0.12,
  windowIn: S.reveal + 0.95,
  check1: S.investigate + 0.5,
  check2: S.investigate + 1.0,
  check3: S.investigate + 1.5,
  check4: S.investigate + 2.0,
  diagnosis: S.diagnose + 0.45,
  tiles: S.diagnose + 1.55,
  stop: S.approval + 0.1,
  showFix: S.approval + 1.15,
  hover: S.approval + 2.0,
  clickAction: S.approval + 2.3,
  dialog: S.approval + 2.75,
  clickApprove: S.approval + 3.95,
  approved: S.approval + 4.15,
  beat1: S.execution + 0.12,
  beat2: S.execution + 0.72,
  beat3: S.execution + 1.32,
  beat4: S.execution + 1.92,
  verify: S.verify + 0.05,
  proof: S.verify + 1.15,
  logo: S.brand + 0.15,
  promise1: S.brand + 1.1,
  promise2: S.brand + 1.55,
  promise3: S.brand + 2.0,
  cta: S.brand + 2.95,
};

/* A minor — restrained, a little unresolved until the payoff. */
const N = {
  A1: 55, C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98,
  A2: 110, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196,
  A3: 220, C4: 261.63, E4: 329.63, F4: 349.23, G4: 392, A4: 440,
  C5: 523.25, E5: 659.25, A5: 880,
};

const dry = new Bus(DURATION);
const wet = new Bus(DURATION);   // reverb send
const idx = (t) => Math.round(t * SR);

/* ── instruments ───────────────────────────────────────────────────────────── */

/** Slow evolving pad: detuned stack through a moving lowpass. */
function pad(start, dur, freqs, { gain = 0.1, attack = 1.2, release = 1.6, cutoff = 900, sweep = 0, pan = 0, send = 0.55 } = {}) {
  const n = Math.ceil((dur + release) * SR);
  const filt = [new Biquad('lp', cutoff), new Biquad('lp', cutoff)];
  const phases = freqs.flatMap((f) => [0, 1, 2].map(() => Math.random() * TAU));
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = adsr(t, dur, attack, 0.6, 0.85, release);
    if (env <= 0) continue;
    const fc = cutoff + sweep * (t / Math.max(0.001, dur));
    if (i % 128 === 0) { filt[0].set('lp', fc, 0.8); filt[1].set('lp', fc, 0.8); }
    let v = 0, k = 0;
    for (const f of freqs) {
      for (const det of [-0.14, 0, 0.16]) {
        phases[k] += (TAU * (f + det)) / SR;
        v += softSaw(phases[k]) * 0.3;
        k++;
      }
    }
    v = filt[0].run(v / Math.max(1, freqs.length * 2));
    const lfo = 1 + Math.sin(t * 0.6 + start) * 0.09;
    const s = v * env * gain * lfo;
    const j = idx(start) + i;
    dry.add(j, s, pan);
    wet.add(j, s * send, pan);
  }
}

/** Sub — the floor of the mix. Pure, gently driven. */
function sub(start, dur, freq, { gain = 0.16, attack = 0.25, release = 1.0 } = {}) {
  const n = Math.ceil((dur + release) * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = adsr(t, dur, attack, 0.4, 0.9, release);
    if (env <= 0) continue;
    ph += (TAU * freq) / SR;
    const v = Math.tanh(sine(ph) * 1.35) * 0.7;
    dry.add(idx(start) + i, v * env * gain, 0);
  }
}

/** Bell / mallet: bright transient, long tail. Used for reveals and resolutions. */
function bell(at, freq, { gain = 0.16, decay = 1.5, pan = 0, send = 0.75, ratio = 2.76 } = {}) {
  const n = Math.ceil((decay * 4) * SR);
  let ph = 0, mph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const e = pluck(t, decay);
    if (e < 0.0002) break;
    const mEnv = pluck(t, decay * 0.22);
    mph += (TAU * freq * ratio) / SR;
    ph += (TAU * freq) / SR + sine(mph) * mEnv * 1.9;
    const s = sine(ph) * e * gain;
    const j = idx(at) + i;
    dry.add(j, s, pan);
    wet.add(j, s * send, pan);
  }
}

/** Muted impact: a short downward sine sweep plus a filtered noise body. */
function impact(at, { gain = 0.3, from = 150, to = 42, decay = 0.42, noiseAmt = 0.3 } = {}) {
  const n = Math.ceil(decay * 4 * SR);
  const lp = new Biquad('lp', 420, 0.8);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const e = pluck(t, decay);
    if (e < 0.0003) break;
    const f = to + (from - to) * Math.exp(-t / (decay * 0.35));
    ph += (TAU * f) / SR;
    const body = sine(ph) * e;
    const air = lp.run(noise()) * pluck(t, decay * 0.3) * noiseAmt;
    const s = (body + air) * gain;
    const j = idx(at) + i;
    dry.add(j, s, 0);
    wet.add(j, s * 0.25, 0);
  }
}

/** Tiny UI tick — a check completing, a state changing. */
function tick(at, { gain = 0.1, freq = 2100, decay = 0.028, pan = 0 } = {}) {
  const n = Math.ceil(decay * 6 * SR);
  const hp = new Biquad('hp', 1100, 0.7);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const e = pluck(t, decay);
    if (e < 0.0005) break;
    ph += (TAU * freq) / SR;
    const s = (sine(ph) * 0.65 + hp.run(noise()) * 0.5) * e * gain;
    const j = idx(at) + i;
    dry.add(j, s, pan);
    wet.add(j, s * 0.4, pan);
  }
}

/** Mouse click — press and release, 38 ms apart. */
function mouseClick(at, { gain = 0.26 } = {}) {
  const part = (t0, g, f) => {
    const n = Math.ceil(0.05 * SR);
    const bp = new Biquad('bp', f, 2.2);
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const e = pluck(t, 0.007);
      if (e < 0.0008) break;
      const s = bp.run(noise()) * e * g;
      const j = idx(t0) + i;
      dry.add(j, s, 0);
      wet.add(j, s * 0.3, 0);
    }
  };
  part(at, gain, 2600);
  part(at + 0.038, gain * 0.62, 2100);
}

/** Keyboard tap. */
function keyTap(at, { gain = 0.11, pan = 0 } = {}) {
  const n = Math.ceil(0.06 * SR);
  const bp = new Biquad('bp', 1500 + noise() * 260, 1.6);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const e = pluck(t, 0.009);
    if (e < 0.0008) break;
    const s = bp.run(noise()) * e * gain;
    dry.add(idx(at) + i, s, pan);
  }
}

/** Noise riser into a moment. */
function riser(start, dur, { gain = 0.07, fromF = 400, toF = 6000 } = {}) {
  const n = Math.ceil(dur * SR);
  const bp = new Biquad('bp', fromF, 1.1);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const p = t / dur;
    if (i % 96 === 0) bp.set('bp', fromF + (toF - fromF) * (p * p), 1.1);
    const e = Math.pow(p, 1.8) * (1 - Math.pow(p, 9));
    const s = bp.run(noise()) * e * gain;
    const j = idx(start) + i;
    dry.add(j, s, Math.sin(t * 5) * 0.3);
    wet.add(j, s * 0.5, 0);
  }
}

/** Soft transition sweep — air moving, not a whoosh. */
function sweep(at, dur, { gain = 0.08, down = false } = {}) {
  const n = Math.ceil(dur * SR);
  const bp = new Biquad('bp', 1000, 0.9);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const p = t / dur;
    const f = down ? 5000 - 4400 * p : 600 + 4400 * p;
    if (i % 96 === 0) bp.set('bp', f, 0.9);
    const e = Math.sin(Math.PI * p);
    const s = bp.run(noise()) * e * gain;
    const j = idx(at) + i;
    dry.add(j, s, (p - 0.5) * 1.2);
    wet.add(j, s * 0.6, 0);
  }
}

/** Muted rhythmic pulse bed — the "old way" clutter, and the fix cadence. */
function pulse(start, end, period, { gain = 0.07, freq = 180, decay = 0.09 } = {}) {
  for (let t = start; t < end; t += period) {
    const n = Math.ceil(decay * 5 * SR);
    const lp = new Biquad('lp', 900, 1.1);
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const tt = i / SR;
      const e = pluck(tt, decay);
      if (e < 0.0006) break;
      ph += (TAU * freq) / SR;
      const s = lp.run(tri(ph) * 0.6 + noise() * 0.25) * e * gain;
      dry.add(idx(t) + i, s, 0);
    }
  }
}

/* ── the arrangement ───────────────────────────────────────────────────────── */

// SCENE 1 — quiet, unresolved. A minor with no third at first.
sub(0, 4.6, N.A1, { gain: 0.15, attack: 0.9, release: 1.4 });
pad(0.1, 4.4, [N.A2, N.E3], { gain: 0.055, attack: 1.6, cutoff: 560, sweep: 260, release: 1.4 });
impact(C.hookImpact, { gain: 0.3, from: 160, to: 44, decay: 0.5 });
bell(C.hookLine2, N.A4, { gain: 0.055, decay: 1.5, pan: -0.25 });
impact(C.hookLine3, { gain: 0.2, from: 120, to: 40, decay: 0.45, noiseAmt: 0.18 });
bell(C.hookLine3 + 0.02, N.E5, { gain: 0.05, decay: 1.9, pan: 0.2 });
riser(C.hookLine3 - 0.75, 0.75, { gain: 0.045, toF: 4200 });

// SCENE 2 — the clutter. Pulse enters, tightens, then is cut off.
sub(S.oldWay, 2.2, N.A1, { gain: 0.13, attack: 0.1, release: 0.25 });
pad(S.oldWay, 2.1, [N.A2, N.C3, N.E3], { gain: 0.05, attack: 0.3, cutoff: 780, release: 0.3 });
pulse(C.montage, C.blackout, 0.3, { gain: 0.075, freq: 165, decay: 0.085 });
pulse(C.montage2, C.blackout, 0.15, { gain: 0.035, freq: 330, decay: 0.045 });
[C.montage, C.montage2, C.montage3].forEach((t, i) => {
  sweep(t - 0.12, 0.34, { gain: 0.05 + i * 0.012 });
  tick(t, { gain: 0.085, freq: 1700 + i * 260, pan: i === 1 ? 0.3 : -0.28 });
  for (let k = 0; k < 4; k++) keyTap(t + 0.05 + k * 0.055, { gain: 0.05, pan: (k % 2 ? 0.2 : -0.2) });
});
// the cut to silence
impact(C.blackout, { gain: 0.26, from: 110, to: 34, decay: 0.7, noiseAmt: 0.1 });
sweep(C.blackout, 0.5, { gain: 0.05, down: true });
// the turn: one note, lots of room
sub(C.turn, 1.2, N.A1, { gain: 0.12, attack: 0.25, release: 1.0 });
bell(C.turn, N.A3, { gain: 0.1, decay: 2.4, send: 0.9 });

// SCENE 3 — Noah. The first warmth in the film: F major over the A pedal.
sub(S.reveal, 2.4, N.F2, { gain: 0.12, attack: 0.5, release: 1.1 });
pad(C.noahLift, 2.4, [N.F3, N.A3, N.C4], { gain: 0.075, attack: 0.9, cutoff: 700, sweep: 1500, release: 1.2 });
bell(C.noahLift, N.F4, { gain: 0.11, decay: 2.2, pan: -0.15, send: 0.85 });
bell(C.noahLift + 0.12, N.C5, { gain: 0.07, decay: 2.0, pan: 0.2, send: 0.85 });
riser(C.windowIn - 0.5, 0.5, { gain: 0.04, toF: 3600 });
sweep(C.windowIn - 0.1, 0.4, { gain: 0.055 });
bell(C.windowIn, N.A4, { gain: 0.085, decay: 1.8, send: 0.8 });

// SCENE 4 — working. An arpeggio under the checks, a tick per completion.
sub(S.investigate, 2.8, N.A1, { gain: 0.1, attack: 0.4, release: 0.9 });
pad(S.investigate, 2.8, [N.A2, N.C3, N.E3, N.G3], { gain: 0.05, attack: 0.7, cutoff: 900, release: 0.9 });
[N.A4, N.C5, N.E5, N.G4].forEach((f, i) => bell(S.investigate + 0.18 + i * 0.5, f, { gain: 0.045, decay: 0.9, pan: i % 2 ? 0.3 : -0.3, send: 0.7 }));
[C.check1, C.check2, C.check3, C.check4].forEach((t, i) => tick(t, { gain: 0.075, freq: 1900 + i * 190, pan: i % 2 ? 0.22 : -0.22 }));

// SCENE 5 — the real cause. A subdued impact, then the pad opens.
riser(C.diagnosis - 0.6, 0.6, { gain: 0.055, toF: 5200 });
impact(C.diagnosis, { gain: 0.3, from: 175, to: 40, decay: 0.75, noiseAmt: 0.22 });
sub(C.diagnosis, 2.5, N.F2, { gain: 0.14, attack: 0.05, release: 1.0 });
pad(C.diagnosis, 2.5, [N.F3, N.A3, N.C4, N.E4], { gain: 0.07, attack: 0.5, cutoff: 620, sweep: 2100, release: 1.0 });
bell(C.diagnosis + 0.01, N.F4, { gain: 0.1, decay: 2.6, send: 0.9 });
tick(C.tiles, { gain: 0.08, freq: 2300 });
bell(C.tiles, N.C5, { gain: 0.06, decay: 1.4, pan: 0.25 });

// SCENE 6 — the trust moment. Everything thins out. Space is the point.
sub(S.approval, 4.6, N.A1, { gain: 0.11, attack: 0.8, release: 1.4 });
pad(C.stop, 4.4, [N.A2, N.E3], { gain: 0.045, attack: 1.4, cutoff: 480, sweep: 420, release: 1.4 });
bell(C.stop, N.A3, { gain: 0.08, decay: 3.0, send: 0.95 });
sweep(C.showFix - 0.1, 0.36, { gain: 0.04 });
bell(C.showFix, N.E4, { gain: 0.055, decay: 1.8, pan: -0.2, send: 0.85 });
// the pointer settles on the button, waits, then commits
tick(C.hover, { gain: 0.05, freq: 1400, decay: 0.05 });
mouseClick(C.clickAction, { gain: 0.24 });
bell(C.clickAction + 0.02, N.E4, { gain: 0.06, decay: 1.3, pan: -0.15, send: 0.8 });
// and Noah asks anyway
riser(C.dialog - 0.4, 0.4, { gain: 0.05, toF: 4800 });
impact(C.dialog, { gain: 0.19, from: 130, to: 38, decay: 0.5, noiseAmt: 0.12 });
bell(C.dialog + 0.01, N.C5, { gain: 0.06, decay: 2.2, send: 0.9 });
// the pause before answering is deliberately empty
mouseClick(C.clickApprove, { gain: 0.3 });
bell(C.clickApprove + 0.02, N.A4, { gain: 0.085, decay: 1.6, send: 0.8 });
impact(C.clickApprove + 0.02, { gain: 0.16, from: 120, to: 44, decay: 0.34, noiseAmt: 0.1 });
tick(C.approved, { gain: 0.06, freq: 2200 });

// SCENE 7 — execution. The cadence, accelerating.
sub(S.execution, 2.9, N.A1, { gain: 0.13, attack: 0.08, release: 0.7 });
pad(S.execution, 2.8, [N.A2, N.C3, N.E3, N.G3], { gain: 0.055, attack: 0.25, cutoff: 1100, release: 0.7 });
pulse(S.execution, S.verify, 0.3, { gain: 0.06, freq: 150, decay: 0.08 });
[C.beat1, C.beat2, C.beat3, C.beat4].forEach((t, i) => {
  impact(t, { gain: 0.2 + i * 0.022, from: 150, to: 44, decay: 0.3, noiseAmt: 0.16 });
  bell(t, [N.A4, N.C5, N.E5, N.A5][i], { gain: 0.06, decay: 1.0, pan: i % 2 ? 0.25 : -0.25, send: 0.75 });
});

// SCENE 8 — verification. A minor resolves up to C major: relief, not triumph.
riser(C.verify - 0.4, 0.4, { gain: 0.045, toF: 4000 });
impact(C.verify, { gain: 0.24, from: 160, to: 42, decay: 0.55 });
sub(C.verify, 2.7, N.C2, { gain: 0.14, attack: 0.1, release: 1.2 });
pad(C.verify, 2.6, [N.C3, N.E3, N.G3], { gain: 0.07, attack: 0.5, cutoff: 800, sweep: 2400, release: 1.3 });
bell(C.proof, N.C5, { gain: 0.1, decay: 2.4, pan: -0.15, send: 0.9 });
bell(C.proof + 0.09, N.E5, { gain: 0.075, decay: 2.2, pan: 0.18, send: 0.9 });
tick(C.proof, { gain: 0.06, freq: 2600 });

// SCENE 9 — the mark. One controlled impact, then a clean, open chord.
riser(C.logo - 0.55, 0.55, { gain: 0.055, toF: 5000 });
impact(C.logo, { gain: 0.3, from: 170, to: 38, decay: 0.95, noiseAmt: 0.18 });
sub(C.logo, 4.4, N.F2, { gain: 0.13, attack: 0.15, release: 1.6 });
pad(C.logo, 4.3, [N.F3, N.A3, N.C4], { gain: 0.08, attack: 0.9, cutoff: 700, sweep: 2000, release: 1.6 });
bell(C.logo + 0.02, N.F4, { gain: 0.12, decay: 3.2, send: 0.95 });
bell(C.logo + 0.16, N.A4, { gain: 0.07, decay: 2.8, pan: 0.2, send: 0.95 });
[C.promise1, C.promise2, C.promise3].forEach((t, i) => {
  tick(t, { gain: 0.055 + i * 0.012, freq: 2000 + i * 300, pan: [-0.2, 0.2, 0][i] });
  if (i === 2) {
    impact(t, { gain: 0.17, from: 130, to: 40, decay: 0.42, noiseAmt: 0.1 });
    bell(t + 0.01, N.C5, { gain: 0.075, decay: 2.6, send: 0.9 });
  }
});
bell(C.cta, N.F4, { gain: 0.055, decay: 2.4, pan: -0.12, send: 0.9 });
bell(C.cta + 0.1, N.C5, { gain: 0.045, decay: 2.2, pan: 0.16, send: 0.9 });

/* ── mixdown ───────────────────────────────────────────────────────────────── */

reverb(wet, { mix: 1.0, size: 1.25 });
wet.mixInto(dry, 0.42);

// gentle high-pass to keep the sub tidy on phone speakers
const hp = [new Biquad('hp', 32, 0.7), new Biquad('hp', 32, 0.7)];
for (let i = 0; i < dry.n; i++) {
  dry.L[i] = hp[0].run(dry.L[i]);
  dry.R[i] = hp[1].run(dry.R[i]);
}

// top and tail
const fadeIn = Math.round(0.12 * SR);
const fadeOut = Math.round(0.45 * SR);
for (let i = 0; i < fadeIn; i++) {
  const g = i / fadeIn;
  dry.L[i] *= g; dry.R[i] *= g;
}
for (let i = 0; i < fadeOut; i++) {
  const j = dry.n - 1 - i;
  const g = i / fadeOut;
  dry.L[j] *= g; dry.R[j] *= g;
}

// master gain: normalise toward a social-platform-friendly level, then limit
let pk = 0;
for (let i = 0; i < dry.n; i++) pk = Math.max(pk, Math.abs(dry.L[i]), Math.abs(dry.R[i]));
const makeup = Math.min(3.2, 0.72 / Math.max(1e-6, pk));
for (let i = 0; i < dry.n; i++) { dry.L[i] *= makeup; dry.R[i] *= makeup; }

limit(dry, 0.84);

let peak = 0, sum = 0;
for (let i = 0; i < dry.n; i++) {
  peak = Math.max(peak, Math.abs(dry.L[i]), Math.abs(dry.R[i]));
  sum += dry.L[i] * dry.L[i] + dry.R[i] * dry.R[i];
}
const rms = Math.sqrt(sum / (dry.n * 2));

mkdirSync('public/audio', { recursive: true });
writeFileSync('public/audio/noah-score.wav', toWav(dry));
console.log(
  `wrote public/audio/noah-score.wav  ${DURATION.toFixed(2)}s  ` +
  `peak ${(20 * Math.log10(peak)).toFixed(1)} dBFS  rms ${(20 * Math.log10(rms)).toFixed(1)} dBFS`,
);
