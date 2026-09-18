#!/usr/bin/env node
/**
 * Loudness-masters a rendered ad in place.
 *
 * Remotion's bundled ffmpeg is a reduced build with no `loudnorm` or `ebur128`,
 * so the measurement here is an ITU-R BS.1770-4 implementation in plain Node —
 * no extra dependencies, so `npm run render:video2` works anywhere the project
 * installs.
 *
 * The raw render sits around -21 LUFS, because the mix deliberately keeps the
 * bed far under the voice. Feeds normalise, and an ad that plays quieter than
 * the post above it loses before anyone hears the line — so the whole thing is
 * lifted to -14 LUFS with a gentle limiter holding the ceiling at -1 dBFS.
 *
 *   node tools/master.mjs <file.mp4> [targetLufs]
 *
 * Video is stream-copied; only the audio is touched.
 */
import {execFileSync} from 'node:child_process';
import {mkdtempSync, readFileSync, rmSync, writeFileSync, renameSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const SR = 48_000;
const CEILING_DB = -1.0;

const ff = (args) =>
  execFileSync('npx', ['remotion', 'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', ...args], {
    stdio: ['ignore', 'pipe', 'inherit'],
  });

// ---------------------------------------------------------------- wav io ---
/**
 * Reads a WAV as float channels. Remotion's reduced ffmpeg only encodes
 * pcm_s16le / pcm_s24le, so integer formats are handled here rather than
 * asking it for float.
 */
const readWav = (path) => {
  const buf = readFileSync(path);
  let off = 12; // skip RIFF....WAVE
  let data = null;
  let channels = 2;
  let bits = 24;
  let format = 1;
  while (off + 8 <= buf.length) {
    const id = buf.toString('ascii', off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === 'fmt ') {
      format = buf.readUInt16LE(off + 8);
      channels = buf.readUInt16LE(off + 10);
      bits = buf.readUInt16LE(off + 22);
    }
    if (id === 'data') {
      data = buf.subarray(off + 8, off + 8 + size);
      break;
    }
    off += 8 + size + (size % 2);
  }
  if (!data) throw new Error('no data chunk in wav');

  const bytes = bits / 8;
  const frame = bytes * channels;
  const n = Math.floor(data.length / frame);
  const ch = Array.from({length: channels}, () => new Float32Array(n));
  const scale = 1 / 2 ** (bits - 1);

  for (let i = 0; i < n; i++) {
    for (let c = 0; c < channels; c++) {
      const at = i * frame + c * bytes;
      let v;
      if (format === 3) v = data.readFloatLE(at);
      else if (bits === 16) v = data.readInt16LE(at) * scale;
      else if (bits === 24) {
        const u = data[at] | (data[at + 1] << 8) | (data[at + 2] << 16);
        v = (u & 0x800000 ? u - 0x1000000 : u) * scale;
      } else if (bits === 32) v = data.readInt32LE(at) * scale;
      else throw new Error(`unsupported wav depth ${bits}`);
      ch[c][i] = v;
    }
  }
  return ch;
};

/** Writes 24-bit PCM, which the reduced ffmpeg can read back. */
const writeWav24 = (path, ch) => {
  const n = ch[0].length;
  const channels = ch.length;
  const bytes = n * channels * 3;
  const head = Buffer.alloc(44);
  head.write('RIFF', 0);
  head.writeUInt32LE(36 + bytes, 4);
  head.write('WAVE', 8);
  head.write('fmt ', 12);
  head.writeUInt32LE(16, 16);
  head.writeUInt16LE(1, 20); // integer PCM
  head.writeUInt16LE(channels, 22);
  head.writeUInt32LE(SR, 24);
  head.writeUInt32LE(SR * channels * 3, 28);
  head.writeUInt16LE(channels * 3, 32);
  head.writeUInt16LE(24, 34);
  head.write('data', 36);
  head.writeUInt32LE(bytes, 40);
  const body = Buffer.alloc(bytes);
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < channels; c++) {
      const v = Math.max(-1, Math.min(1, ch[c][i]));
      let q = Math.round(v * 0x7fffff);
      if (q < 0) q += 0x1000000;
      const at = (i * channels + c) * 3;
      body[at] = q & 0xff;
      body[at + 1] = (q >> 8) & 0xff;
      body[at + 2] = (q >> 16) & 0xff;
    }
  }
  writeFileSync(path, Buffer.concat([head, body]));
};

// ------------------------------------------------------------ BS.1770-4 ---
const biquad = (x, b, a) => {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = b[0] * x[i] + b[1] * x1 + b[2] * x2 - a[0] * y1 - a[1] * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v;
    y[i] = v;
  }
  return y;
};

/** The two-stage K-weighting curve, coefficients as specified at 48 kHz. */
const kWeight = (x) =>
  biquad(
    biquad(x, [1.53512485958697, -2.69169618940638, 1.19839281085285], [-1.69065929318241, 0.73248077421585]),
    [1.0, -2.0, 1.0],
    [-1.99004745483398, 0.99007225036621],
  );

/** Gated integrated loudness, in LUFS. */
const integratedLufs = (ch) => {
  const k = ch.map(kWeight);
  const block = Math.round(0.4 * SR);
  const step = Math.round(0.1 * SR); // 75% overlap
  const loud = [];
  const power = [];
  for (let s = 0; s + block <= k[0].length; s += step) {
    let sum = 0;
    for (const c of k) {
      let ms = 0;
      for (let i = s; i < s + block; i++) ms += c[i] * c[i];
      sum += ms / block; // both channels weighted 1.0
    }
    power.push(sum);
    loud.push(-0.691 + 10 * Math.log10(sum + 1e-30));
  }
  // Absolute gate, then a relative gate 10 LU below what survives it.
  const keep1 = power.filter((_, i) => loud[i] > -70);
  if (!keep1.length) return -Infinity;
  const mean1 = keep1.reduce((a, b) => a + b, 0) / keep1.length;
  const rel = -0.691 + 10 * Math.log10(mean1 + 1e-30) - 10;
  const keep2 = power.filter((_, i) => loud[i] > -70 && loud[i] > rel);
  if (!keep2.length) return -Infinity;
  const mean2 = keep2.reduce((a, b) => a + b, 0) / keep2.length;
  return -0.691 + 10 * Math.log10(mean2 + 1e-30);
};

// -------------------------------------------------------------- limiter ---
/**
 * Gain, then a soft peak limiter. Attack is short enough to catch a consonant
 * and release slow enough that it never pumps under the bed.
 */
const applyGainAndLimit = (ch, gainDb, ceilingDb) => {
  const g = 10 ** (gainDb / 20);
  const ceil = 10 ** (ceilingDb / 20);
  const n = ch[0].length;
  const atk = Math.exp(-1 / (0.0015 * SR));
  const rel = Math.exp(-1 / (0.12 * SR));

  let env = 0;
  const reduction = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let peak = 0;
    for (const c of ch) peak = Math.max(peak, Math.abs(c[i] * g));
    env = peak > env ? atk * env + (1 - atk) * peak : rel * env + (1 - rel) * peak;
    reduction[i] = env > ceil ? ceil / env : 1;
  }
  // Smooth the reduction curve so limiting never becomes audible as distortion.
  let sm = 1;
  for (let i = 0; i < n; i++) {
    sm = Math.min(reduction[i], rel * sm + (1 - rel) * reduction[i]);
    for (const c of ch) c[i] = Math.max(-ceil, Math.min(ceil, c[i] * g * sm));
  }
  return ch;
};

// ------------------------------------------------------------------ main ---
const file = process.argv[2];
const target = Number(process.argv[3] ?? -14);
if (!file) {
  console.error('usage: node tools/master.mjs <file.mp4> [targetLufs]');
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), 'noah-master-'));
try {
  const raw = join(dir, 'raw.wav');
  const mastered = join(dir, 'mastered.wav');
  const out = join(dir, 'out.mp4');

  ff(['-i', file, '-vn', '-c:a', 'pcm_s24le', '-ar', String(SR), '-ac', '2', raw]);

  const ch = readWav(raw);
  const before = integratedLufs(ch);
  const gain = target - before;
  console.log(`  measured ${before.toFixed(1)} LUFS → target ${target.toFixed(1)} (${gain >= 0 ? '+' : ''}${gain.toFixed(1)} dB)`);

  writeWav24(mastered, applyGainAndLimit(ch, gain, CEILING_DB));

  const check = readWav(mastered);
  const after = integratedLufs(check);
  let peak = 0;
  for (const c of check) for (const v of c) peak = Math.max(peak, Math.abs(v));
  console.log(`  result   ${after.toFixed(1)} LUFS, peak ${(20 * Math.log10(peak)).toFixed(1)} dBFS`);

  ff([
    '-i', file, '-i', mastered,
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k',
    '-movflags', '+faststart', out,
  ]);
  renameSync(out, file);
  console.log(`  wrote    ${file}`);
} finally {
  rmSync(dir, {recursive: true, force: true});
}
