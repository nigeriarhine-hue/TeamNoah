/**
 * synth.mjs — a tiny offline synthesiser.
 *
 * Everything the film hears is generated here: there is no sampled or licensed
 * material in the project, so the score and SFX are original and royalty-free.
 */
export const SR = 48000;

const TAU = Math.PI * 2;

export class Bus {
  constructor(seconds) {
    this.n = Math.ceil(seconds * SR);
    this.L = new Float32Array(this.n);
    this.R = new Float32Array(this.n);
  }
  add(i, v, pan = 0) {
    if (i < 0 || i >= this.n) return;
    const l = Math.cos(((pan + 1) * Math.PI) / 4);
    const r = Math.sin(((pan + 1) * Math.PI) / 4);
    this.L[i] += v * l;
    this.R[i] += v * r;
  }
  mixInto(target, gain = 1) {
    for (let i = 0; i < this.n; i++) {
      target.L[i] += this.L[i] * gain;
      target.R[i] += this.R[i] * gain;
    }
  }
}

/* ── envelopes ─────────────────────────────────────────────────────────────── */

/** Attack / decay / sustain / release, in seconds. */
export const adsr = (t, dur, a, d, s, r) => {
  if (t < 0) return 0;
  if (t < a) return t / a;
  if (t < a + d) return 1 + (s - 1) * ((t - a) / d);
  if (t < dur) return s;
  const rel = t - dur;
  if (rel < r) return s * (1 - rel / r);
  return 0;
};

/** Exponential percussive decay. */
export const pluck = (t, decay) => (t < 0 ? 0 : Math.exp(-t / decay));

/* ── filters ───────────────────────────────────────────────────────────────── */

/** Biquad, Robert Bristow-Johnson cookbook. type: 'lp' | 'hp' | 'bp' */
export class Biquad {
  constructor(type, freq, q = 0.707) {
    this.set(type, freq, q);
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
  }
  set(type, freq, q) {
    const w = (TAU * Math.max(20, Math.min(freq, SR / 2 - 200))) / SR;
    const cw = Math.cos(w);
    const sw = Math.sin(w);
    const alpha = sw / (2 * q);
    let b0, b1, b2;
    const a0 = 1 + alpha;
    const a1 = -2 * cw;
    const a2 = 1 - alpha;
    if (type === 'lp') {
      b0 = (1 - cw) / 2; b1 = 1 - cw; b2 = (1 - cw) / 2;
    } else if (type === 'hp') {
      b0 = (1 + cw) / 2; b1 = -(1 + cw); b2 = (1 + cw) / 2;
    } else {
      b0 = alpha; b1 = 0; b2 = -alpha;
    }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0;
    this.a1 = a1 / a0; this.a2 = a2 / a0;
  }
  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x;
    this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

/* ── oscillators ───────────────────────────────────────────────────────────── */

export const sine = (ph) => Math.sin(ph);
export const tri = (ph) => {
  const p = (ph / TAU) % 1;
  return 4 * Math.abs(p - 0.5) - 1;
};
/** Band-limited-ish saw: a small harmonic stack, cheap and clean enough. */
export const softSaw = (ph) => {
  let v = 0;
  for (let h = 1; h <= 7; h++) v += Math.sin(ph * h) / h;
  return v * 0.55;
};

let seed = 0x2f6e2b1;
export const noise = () => {
  seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
  return ((seed >>> 0) / 0xffffffff) * 2 - 1;
};

/* ── reverb: 4 combs + 2 allpass per channel (Schroeder) ───────────────────── */

class Comb {
  constructor(ms, fb, damp = 0.3) {
    this.buf = new Float32Array(Math.round((ms / 1000) * SR));
    this.i = 0; this.fb = fb; this.damp = damp; this.store = 0;
  }
  run(x) {
    const y = this.buf[this.i];
    this.store = y * (1 - this.damp) + this.store * this.damp;
    this.buf[this.i] = x + this.store * this.fb;
    this.i = (this.i + 1) % this.buf.length;
    return y;
  }
}
class Allpass {
  constructor(ms, g = 0.5) {
    this.buf = new Float32Array(Math.round((ms / 1000) * SR));
    this.i = 0; this.g = g;
  }
  run(x) {
    const b = this.buf[this.i];
    const y = -x + b;
    this.buf[this.i] = x + b * this.g;
    this.i = (this.i + 1) % this.buf.length;
    return y;
  }
}

export const reverb = (bus, { mix = 0.3, size = 1 } = {}) => {
  const mk = (off) => ({
    combs: [29.7, 37.1, 41.1, 43.7].map((ms) => new Comb(ms * size + off, 0.82, 0.28)),
    aps: [5.0, 1.7].map((ms) => new Allpass(ms * size + off, 0.5)),
    hp: new Biquad('hp', 180, 0.7),
    lp: new Biquad('lp', 5200, 0.7),
  });
  const chans = [mk(0), mk(1.3)];
  const src = [bus.L, bus.R];
  for (let c = 0; c < 2; c++) {
    const ch = chans[c];
    const arr = src[c];
    for (let i = 0; i < arr.length; i++) {
      const x = arr[i];
      let w = 0;
      for (const cb of ch.combs) w += cb.run(x);
      w /= ch.combs.length;
      for (const ap of ch.aps) w = ap.run(w);
      w = ch.lp.run(ch.hp.run(w));
      arr[i] = x * (1 - mix) + w * mix;
    }
  }
};

/* ── output ────────────────────────────────────────────────────────────────── */

/** Soft-knee limiter so transients round off instead of clipping. */
export const limit = (bus, ceiling = 0.92) => {
  const soft = (x) => {
    const a = Math.abs(x);
    if (a <= ceiling * 0.7) return x;
    const t = ceiling * 0.7;
    const over = a - t;
    const range = 1.2;
    const comp = t + range * Math.tanh(over / range);
    return Math.sign(x) * Math.min(comp, ceiling);
  };
  for (let i = 0; i < bus.n; i++) {
    bus.L[i] = soft(bus.L[i]);
    bus.R[i] = soft(bus.R[i]);
  }
};

export const toWav = (bus) => {
  const n = bus.n;
  const data = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const l = Math.max(-1, Math.min(1, bus.L[i]));
    const r = Math.max(-1, Math.min(1, bus.R[i]));
    data.writeInt16LE(Math.round(l * 32767), i * 4);
    data.writeInt16LE(Math.round(r * 32767), i * 4 + 2);
  }
  const head = Buffer.alloc(44);
  head.write('RIFF', 0);
  head.writeUInt32LE(36 + data.length, 4);
  head.write('WAVE', 8);
  head.write('fmt ', 12);
  head.writeUInt32LE(16, 16);
  head.writeUInt16LE(1, 20);
  head.writeUInt16LE(2, 22);
  head.writeUInt32LE(SR, 24);
  head.writeUInt32LE(SR * 4, 28);
  head.writeUInt16LE(4, 32);
  head.writeUInt16LE(16, 34);
  head.write('data', 36);
  head.writeUInt32LE(data.length, 40);
  return Buffer.concat([head, data]);
};

export { TAU };
