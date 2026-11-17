import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp} from './ui';

// Original illustrated presenter (free, drawn in SVG). Vibe: young gamer/tech creator —
// black hoodie, white tee, silver over-ear headphones around the neck. Own look: short dark
// curly hair with faded sides, warm brown skin, round face. No logos anywhere.
//
// Lip-sync: `mouth[]` = per-frame openness from tools/build_short_vo.py. `visemes` = one mouth
// shape per syllable in order ('O' rounded, 'A' wide, 'E' spread); syllables are found as peaks
// in the mouth track. The mouth closes fully on silence (and on a final 'P' if given).

export type Viseme = 'O' | 'A' | 'E';
export type RhubarbCue = {start: number; end: number; value: string};

// Rhubarb Lip Sync mouth shapes (Preston Blair set), drawn around (0,0):
// A closed (M/B/P) · B slightly open, teeth (K/S/T/EE) · C open (EH/AE) · D wide (AA)
// E rounded (AO/ER) · F puckered (UW/OW/W) · G F/V (teeth on lip) · H L (tongue up) · X rest
const LIP = '#6E3328';
const MOUTH_IN = '#4A1E1E';
const TEETH = '#F6F3EC';
const TONGUE = '#C45A5A';
const RhubarbMouth: React.FC<{shape: string}> = ({shape}) => {
  const open = (w: number, h: number, teeth: number, tongue = true, tongueUp = false) => (
    <>
      <clipPath id={`rm${shape}`}>
        <ellipse cx={0} cy={0} rx={w / 2} ry={h / 2} />
      </clipPath>
      <ellipse cx={0} cy={0} rx={w / 2} ry={h / 2} fill={MOUTH_IN} />
      <g clipPath={`url(#rm${shape})`}>
        {teeth > 0 && <rect x={-w / 2} y={-h / 2} width={w} height={teeth} fill={TEETH} />}
        {tongue && !tongueUp && <ellipse cx={0} cy={h / 2} rx={w * 0.32} ry={h * 0.3} fill={TONGUE} />}
        {tongueUp && <ellipse cx={0} cy={-h * 0.05} rx={w * 0.22} ry={h * 0.32} fill={TONGUE} />}
      </g>
      <ellipse cx={0} cy={0} rx={w / 2} ry={h / 2} fill="none" stroke={LIP} strokeWidth={4} />
    </>
  );
  switch (shape) {
    case 'A':
      return <path d="M-30 0 Q 0 6 30 0" stroke={LIP} strokeWidth={9} fill="none" strokeLinecap="round" />;
    case 'B':
      return (
        <>
          <rect x={-34} y={-9} width={68} height={18} rx={9} fill={MOUTH_IN} />
          <rect x={-30} y={-7} width={60} height={14} rx={4} fill={TEETH} />
          <path d="M-30 0 L 30 0" stroke="#D9D4C8" strokeWidth={2} />
          <rect x={-34} y={-9} width={68} height={18} rx={9} fill="none" stroke={LIP} strokeWidth={4} />
        </>
      );
    case 'C':
      return open(70, 30, 10);
    case 'D':
      return open(80, 52, 12);
    case 'E':
      return open(52, 34, 6);
    case 'F':
      return open(30, 26, 0);
    case 'G':
      return (
        <>
          <path d="M-34 -2 Q 0 18 34 -2 Q 0 6 -34 -2 Z" fill={MOUTH_IN} />
          <rect x={-22} y={-4} width={44} height={9} rx={3} fill={TEETH} />
          <path d="M-34 -2 Q 0 6 34 -2" stroke={LIP} strokeWidth={4} fill="none" />
          <path d="M-30 6 Q 0 18 30 6" stroke={LIP} strokeWidth={6} fill="none" strokeLinecap="round" />
        </>
      );
    case 'H':
      return open(62, 40, 8, false, true);
    default:
      return <path d="M-32 -4 Q 0 12 32 -4" stroke={LIP} strokeWidth={7} fill="none" strokeLinecap="round" />;
  }
};

const SKIN = '#A86B4C';
const SKIN_SHADE = '#8C5639';
const HAIR = '#1B1412';
const HOODIE = '#1E1F25';
const HOODIE_DARK = '#15161B';

const findPeaks = (m: number[]) => {
  const peaks: number[] = [];
  for (let i = 1; i < m.length - 1; i++) {
    if (m[i] > 0.3 && m[i] >= m[i - 1] && m[i] > m[i + 1] && (peaks.length === 0 || i - peaks[peaks.length - 1] >= 4)) peaks.push(i);
  }
  return peaks;
};

export const GamerToon: React.FC<{
  mouth: number[];
  visemes?: Viseme[];
  size?: number;
  smileAfter?: number; // frame after which he grins (closed-mouth smile)
  browAt?: number[];
  cues?: RhubarbCue[]; // Rhubarb Lip Sync output; when given, it drives the mouth
}> = ({mouth, visemes = [], size = 1100, smileAfter = 1e9, browAt = [], cues}) => {
  const frame = useCurrentFrame();
  const m = mouth[Math.max(0, Math.min(mouth.length - 1, frame))] ?? 0;
  const peaks = React.useMemo(() => findPeaks(mouth), [mouth]);
  // nearest syllable peak decides the shape
  let vis: Viseme = 'A';
  if (peaks.length && visemes.length) {
    let best = 0;
    for (let i = 1; i < peaks.length; i++) if (Math.abs(peaks[i] - frame) < Math.abs(peaks[best] - frame)) best = i;
    vis = visemes[Math.min(best, visemes.length - 1)];
  }
  const talking = cues ? cues.some((c) => c.value !== 'X' && frame / 30 >= c.start && frame / 30 < c.end) : m > 0.06;

  const bt = (frame + 23) % 90;
  const blink = bt < 5 ? interpolate(bt, [0, 2, 5], [1, 0.08, 1], clamp) : 1;
  const brow = browAt.reduce((a, t) => Math.max(a, interpolate(frame, [t - 4, t + 3, t + 24, t + 32], [0, 1, 1, 0], clamp)), 0);
  const nod = talking ? Math.sin(frame / 3) * 2 * m : 0;
  const sway = Math.sin(frame / 20) * 1.4;
  const breathe = Math.sin(frame / 18) * 2.5;

  const mv = Math.sqrt(m);
  const shape =
    vis === 'O' ? {w: 40 + 6 * mv, h: 14 + 40 * mv} : vis === 'E' ? {w: 84, h: 8 + 22 * mv} : {w: 70 + 8 * mv, h: 10 + 46 * mv};

  return (
    <svg width={(size * 600) / 800} height={size} viewBox="0 0 600 800" style={{overflow: 'visible'}}>
      {/* hoodie body */}
      <g transform={`translate(0 ${breathe * 0.4})`}>
        <path d="M30 800 C 40 640, 150 575, 300 572 C 450 575, 560 640, 570 800 Z" fill={HOODIE} />
        {/* hood folded behind the neck */}
        <path d="M170 560 C 200 520, 400 520, 430 560 C 410 600, 190 600, 170 560 Z" fill={HOODIE_DARK} />
        {/* tee */}
        <path d="M240 584 C 270 640, 330 640, 360 584 L 350 800 L 250 800 Z" fill="#F4F4F2" />
        {/* zip edges */}
        <path d="M250 600 L 250 800 M350 600 L 350 800" stroke="#2C2D34" strokeWidth={10} />
        {/* drawstrings */}
        <path d="M262 600 C 258 650, 262 690, 258 730" stroke="#E7E7E3" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M338 600 C 342 650, 338 690, 342 730" stroke="#E7E7E3" strokeWidth={6} fill="none" strokeLinecap="round" />
        <circle cx={258} cy={734} r={6} fill="#C9C9C4" />
        <circle cx={342} cy={734} r={6} fill="#C9C9C4" />
      </g>

      {/* neck */}
      <path d="M255 470 L 255 585 Q 300 610 345 585 L 345 470 Z" fill={SKIN_SHADE} />

      {/* headphones resting around the neck */}
      <path d="M180 560 C 190 640, 410 640, 420 560" stroke="#B9BDC6" strokeWidth={16} fill="none" strokeLinecap="round" />
      {[176, 424].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={566} rx={44} ry={52} fill="#2B2D33" stroke="#C9CDD5" strokeWidth={9} />
          <ellipse cx={x} cy={566} rx={22} ry={28} fill="#3A3D45" />
        </g>
      ))}

      {/* head */}
      <g transform={`rotate(${sway + nod * 0.4} 300 470) translate(0 ${nod})`}>
        <ellipse cx={150} cy={340} rx={22} ry={34} fill={SKIN_SHADE} />
        <ellipse cx={450} cy={340} rx={22} ry={34} fill={SKIN_SHADE} />
        {/* round face */}
        <path d="M150 300 C 150 175, 450 175, 450 300 C 450 425, 395 500, 300 503 C 205 500, 150 425, 150 300 Z" fill={SKIN} />
        <path d="M172 420 C 210 490, 390 490, 428 420 C 400 498, 200 498, 172 420 Z" fill={SKIN_SHADE} opacity={0.35} />
        {/* hair: faded sides + curly top */}
        <path d="M152 300 C 150 230, 175 200, 196 192 L 196 260 C 180 270, 166 285, 158 312 Z" fill={HAIR} opacity={0.45} />
        <path d="M448 300 C 450 230, 425 200, 404 192 L 404 260 C 420 270, 434 285, 442 312 Z" fill={HAIR} opacity={0.45} />
        <path d="M180 220 C 190 150, 410 150, 420 220 C 380 205, 220 205, 180 220 Z" fill={HAIR} />
        {[
          [196, 196, 30],
          [236, 168, 34],
          [282, 152, 36],
          [330, 154, 35],
          [374, 170, 33],
          [408, 198, 28],
          [214, 216, 24],
          [258, 200, 28],
          [304, 194, 28],
          [350, 200, 27],
          [392, 218, 22],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={HAIR} />
        ))}
        {[
          [250, 160],
          [300, 146],
          [350, 158],
          [276, 192],
          [326, 190],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x - 10} ${y} q 10 -10 20 0`} stroke="#3A2B24" strokeWidth={4} fill="none" strokeLinecap="round" />
        ))}
        {/* brows */}
        <g transform={`translate(0 ${-12 * brow})`}>
          <path d="M200 270 Q 232 256 266 266" stroke={HAIR} strokeWidth={13} fill="none" strokeLinecap="round" />
          <path d="M334 266 Q 368 256 400 270" stroke={HAIR} strokeWidth={13} fill="none" strokeLinecap="round" />
        </g>
        {/* eyes */}
        {[232, 368].map((cx) => (
          <g key={cx} transform={`translate(${cx} 312) scale(1 ${blink})`}>
            <ellipse cx={0} cy={0} rx={28} ry={19} fill="white" />
            <circle cx={1} cy={1} r={14} fill="#3B2416" />
            <circle cx={1} cy={1} r={7} fill="#140C08" />
            <circle cx={6} cy={-4} r={4} fill="white" />
          </g>
        ))}
        {/* nose */}
        <path d="M292 330 C 286 360, 282 376, 292 384 Q 304 392 318 384" stroke={SKIN_SHADE} strokeWidth={7} fill="none" strokeLinecap="round" />
        {/* mouth */}
        {cues && !(frame > smileAfter) ? (
          <g transform="translate(300 438)">
            <RhubarbMouth shape={cues.find((c) => frame / 30 >= c.start && frame / 30 < c.end)?.value ?? 'X'} />
          </g>
        ) : talking && !cues ? (
          <g transform="translate(300 440)">
            <clipPath id="gMouth">
              <ellipse cx={0} cy={0} rx={shape.w / 2} ry={shape.h / 2} />
            </clipPath>
            <ellipse cx={0} cy={0} rx={shape.w / 2} ry={shape.h / 2} fill="#4A1E1E" />
            <g clipPath="url(#gMouth)">
              {vis !== 'O' && <rect x={-shape.w / 2} y={-shape.h / 2} width={shape.w} height={Math.min(14, shape.h * 0.32)} fill="#F6F3EC" />}
              <ellipse cx={0} cy={shape.h / 2} rx={shape.w * 0.32} ry={shape.h * 0.3} fill="#C45A5A" />
            </g>
            <ellipse cx={0} cy={0} rx={shape.w / 2} ry={shape.h / 2} fill="none" stroke="#6E3328" strokeWidth={4} />
          </g>
        ) : frame > smileAfter ? (
          <g transform="translate(300 432)">
            <path d="M-46 0 Q 0 46 46 0 Z" fill="#4A1E1E" />
            <path d="M-46 0 Q 0 14 46 0 L 46 4 Q 0 20 -46 4 Z" fill="#F6F3EC" />
            <path d="M-46 0 Q 0 46 46 0" stroke="#6E3328" strokeWidth={5} fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <path d="M268 436 Q 300 450 332 436" stroke="#6E3328" strokeWidth={7} fill="none" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
};

/* ---------- generic gamer room (no logos) ---------- */
export const GamerRoom: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.8 + 0.2 * Math.sin(frame / 12);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <defs>
        <linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A1438" />
          <stop offset="1" stopColor="#2A1B55" />
        </linearGradient>
        <radialGradient id="gGlowL" cx="0.1" cy="0.3" r="0.6">
          <stop offset="0" stopColor="#3B82F6" stopOpacity={0.45 * pulse} />
          <stop offset="1" stopColor="#3B82F6" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="gGlowR" cx="0.9" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#EC4899" stopOpacity={0.35 * pulse} />
          <stop offset="1" stopColor="#EC4899" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-1200} y={-600} width={3480} height={3120} fill="url(#gWall)" />
      <rect x={-1200} y={-600} width={3480} height={3120} fill="url(#gGlowL)" />
      <rect x={-1200} y={-600} width={3480} height={3120} fill="url(#gGlowR)" />
      {/* neon strip */}
      <rect x={60} y={170} width={960} height={10} rx={5} fill="#A78BFA" opacity={0.9 * pulse} />
      {/* neon controller sign (generic shape) */}
      <g transform="translate(760 300)" opacity={pulse}>
        <path d="M30 20 h140 a50 50 0 0 1 48 64 l-16 54 a28 28 0 0 1 -48 10 l-24 -30 h-60 l-24 30 a28 28 0 0 1 -48 -10 l-16 -54 a50 50 0 0 1 48 -64 z" fill="none" stroke="#60A5FA" strokeWidth={9} />
        <path d="M58 70 v34 M41 87 h34" stroke="#60A5FA" strokeWidth={9} strokeLinecap="round" />
        <circle cx={150} cy={78} r={8} fill="#60A5FA" />
        <circle cx={172} cy={98} r={8} fill="#60A5FA" />
      </g>
      {/* posters */}
      <rect x={80} y={260} width={150} height={210} rx={10} fill="#33275F" stroke="#4C3D86" strokeWidth={4} />
      <rect x={250} y={290} width={120} height={160} rx={10} fill="#2C2252" stroke="#4C3D86" strokeWidth={4} />
      {/* desk */}
      <rect x={-1200} y={1180} width={3480} height={1200} fill="#141026" />
      <rect x={-1200} y={1180} width={3480} height={12} fill="#7C3AED" opacity={0.6} />
    </svg>
  );
};
