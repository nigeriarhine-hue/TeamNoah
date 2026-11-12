import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp} from './ui';

// "Toon host": a 2D animated presenter drawn entirely in SVG (no AI footage needed).
// Look echoes the live-action host: side-parted black hair, warm skin, olive overshirt, charcoal tee.
//
// Animation inputs:
//   mouth[]  one 0..1 openness value per frame (from tools/build_short_vo.py)
//   browAt[] frames where he raises his brows (skeptical: left brow higher)
//   smirkFrom/smirkTo  frames where his closed mouth is a sideways smirk

const SKIN = '#E8C3A0';
const SKIN_SHADE = '#D4A880';
const HAIR = '#18181D';
const SHIRT = '#5B6148';
const SHIRT_DARK = '#4A4F3A';
const TEE = '#2E3036';

export const Toon: React.FC<{
  mouth: number[];
  browAt?: number[];
  smirk?: [number, number][];
  size?: number; // rendered height in px
  frameOffset?: number; // shift into the mouth[] timeline
}> = ({mouth, browAt = [], smirk = [], size = 1000, frameOffset = 0}) => {
  const frame = useCurrentFrame() + frameOffset;
  const m = mouth[Math.max(0, Math.min(mouth.length - 1, frame))] ?? 0;
  const mPrev = mouth[Math.max(0, frame - 2)] ?? 0;
  const talking = m > 0.05;

  // blink: quick close every ~3.3s, offset so it doesn't feel mechanical
  const bt = (frame + 17) % 100;
  const blink = bt < 5 ? interpolate(bt, [0, 2, 5], [1, 0.08, 1], clamp) : 1;

  // brows: ease up for ~1.2s at each event
  const brow = browAt.reduce((acc, t) => Math.max(acc, interpolate(frame, [t - 4, t + 4, t + 30, t + 40], [0, 1, 1, 0], clamp)), 0);
  const smirking = smirk.some(([a, b]) => frame >= a && frame <= b) && !talking;

  // head motion: gentle sway + nods driven by speech energy
  const sway = Math.sin(frame / 22) * 1.6;
  const nod = talking ? Math.sin(frame / 3.1) * 2.2 * m : 0;
  const breathe = Math.sin(frame / 18) * 3;

  // mouth shape: open height from energy, width narrows on rising energy ("o"-ish)
  const rising = Math.max(0, m - mPrev);
  const mv = Math.sqrt(m);
  const openH = 6 + 44 * mv;
  const openW = 76 - 20 * Math.min(1, rising * 4) - 8 * mv;

  return (
    <svg width={(size * 600) / 800} height={size} viewBox="0 0 600 800" style={{overflow: 'visible'}}>
      {/* torso */}
      <g transform={`translate(0 ${breathe * 0.4})`}>
        <path d="M40 800 C 50 650, 150 590, 300 588 C 450 590, 550 650, 560 800 Z" fill={SHIRT} />
        <path d="M228 592 L300 700 L372 592 C 350 585, 250 585, 228 592 Z" fill={TEE} />
        {/* collar flaps */}
        <path d="M228 592 L300 700 L262 708 L200 610 Z" fill={SHIRT_DARK} />
        <path d="M372 592 L300 700 L338 708 L400 610 Z" fill={SHIRT_DARK} />
        {/* placket + buttons */}
        <path d="M300 700 L300 800" stroke={SHIRT_DARK} strokeWidth={6} />
        <circle cx={312} cy={735} r={5} fill="#3C402F" />
        <circle cx={312} cy={780} r={5} fill="#3C402F" />
        {/* pocket */}
        <path d="M395 690 h70 v58 q-35 10 -70 0 Z" fill="none" stroke={SHIRT_DARK} strokeWidth={4} />
      </g>

      {/* neck */}
      <path d="M255 470 L255 590 Q300 615 345 590 L345 470 Z" fill={SKIN_SHADE} />

      {/* head */}
      <g transform={`rotate(${sway + nod * 0.4} 300 470) translate(0 ${nod})`}>
        {/* ears */}
        <ellipse cx={152} cy={345} rx={22} ry={36} fill={SKIN_SHADE} />
        <ellipse cx={448} cy={345} rx={22} ry={36} fill={SKIN_SHADE} />
        {/* face */}
        <path d="M155 300 C 155 170, 445 170, 445 300 C 445 420, 390 500, 300 505 C 210 500, 155 420, 155 300 Z" fill={SKIN} />
        {/* jaw shade */}
        <path d="M175 420 C 210 490, 390 490, 425 420 C 400 495, 200 495, 175 420 Z" fill={SKIN_SHADE} opacity={0.35} />
        {/* hair: volume on top, side part, fringe swept to his left */}
        <path
          d="M150 315 C 126 190, 196 92, 312 94 C 428 97, 486 182, 455 310 C 450 266, 436 238, 414 224
             C 396 254, 350 266, 298 256 C 258 248, 234 230, 222 206 C 206 234, 184 266, 164 322 Z"
          fill={HAIR}
        />
        {/* fringe swoop + sheen */}
        <path d="M222 206 C 262 150, 352 132, 430 176 C 398 170, 360 172, 326 186 C 290 200, 252 208, 222 206 Z" fill="#2C2C34" />
        <path d="M250 150 C 290 122, 352 118, 398 136" stroke="#3A3A44" strokeWidth={7} fill="none" strokeLinecap="round" />
        {/* side part line */}
        <path d="M232 128 C 228 150, 224 176, 222 204" stroke="#0E0E12" strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* sideburns */}
        <path d="M154 292 L158 332 L165 330 L166 290 Z" fill={HAIR} />
        <path d="M446 292 L442 332 L435 330 L434 290 Z" fill={HAIR} />
        {/* brows */}
        <g transform={`translate(0 ${-14 * brow})`}>
          <rect x={196} y={256 - 8 * brow} width={74} height={13} rx={6.5} fill={HAIR} transform={`rotate(${-4 - 6 * brow} 233 262)`} />
        </g>
        <g transform={`translate(0 ${-5 * brow})`}>
          <rect x={330} y={256} width={74} height={13} rx={6.5} fill={HAIR} transform={`rotate(${4 + 3 * brow} 367 262)`} />
        </g>
        {/* eyes */}
        {[233, 367].map((cx) => (
          <g key={cx} transform={`translate(${cx} 312) scale(1 ${blink})`}>
            <ellipse cx={0} cy={0} rx={27} ry={16} fill="white" />
            <circle cx={2} cy={1} r={12} fill="#2B1E16" />
            <circle cx={6} cy={-3} r={3.2} fill="white" />
            <path d="M-29 -3 Q0 -21 29 -3" stroke={HAIR} strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        ))}
        {/* nose */}
        <path d="M300 330 C 296 360, 288 378, 296 386 Q 306 392 318 384" stroke={SKIN_SHADE} strokeWidth={6} fill="none" strokeLinecap="round" />
        {/* cheeks */}
        <ellipse cx={205} cy={395} rx={26} ry={13} fill="#E79F86" opacity={0.25} />
        <ellipse cx={395} cy={395} rx={26} ry={13} fill="#E79F86" opacity={0.25} />
        {/* mouth */}
        {talking ? (
          <g transform="translate(300 436)">
            <ellipse cx={0} cy={0} rx={openW / 2} ry={openH / 2} fill="#5A2626" />
            <clipPath id="toonMouth">
              <ellipse cx={0} cy={0} rx={openW / 2} ry={openH / 2} />
            </clipPath>
            <g clipPath="url(#toonMouth)">
              <rect x={-openW / 2} y={-openH / 2} width={openW} height={Math.min(12, openH * 0.3)} fill="#F4F1EA" />
              <ellipse cx={0} cy={openH / 2} rx={openW * 0.32} ry={openH * 0.28} fill="#C65A5A" />
            </g>
          </g>
        ) : smirking ? (
          <path d="M262 440 Q 300 446 345 428" stroke="#8E4A3E" strokeWidth={7} fill="none" strokeLinecap="round" />
        ) : (
          <path d="M266 434 Q 300 452 334 434" stroke="#8E4A3E" strokeWidth={7} fill="none" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
};

/* ---------- Illustrated home office with an all-in-one Mac (no logos) ---------- */
export const ToonRoom: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.1 * Math.sin(frame / 30);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9E6F2" />
          <stop offset="1" stopColor="#DCD8E8" />
        </linearGradient>
        <radialGradient id="wallGlow" cx="0.8" cy="0.35" r="0.6">
          <stop offset="0" stopColor="#8B7CF6" stopOpacity={glow} />
          <stop offset="1" stopColor="#8B7CF6" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6D5BEF" />
          <stop offset="0.55" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E7D9C3" />
          <stop offset="1" stopColor="#D5C3A6" />
        </linearGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#wall)" />
      <rect width="1080" height="1920" fill="url(#wallGlow)" />
      {/* window */}
      <rect x="40" y="160" width="250" height="520" rx="10" fill="#F6F4FA" stroke="#CFCADC" strokeWidth="10" />
      <rect x="60" y="180" width="210" height="480" fill="#D7EAD9" opacity="0.7" />
      {/* shelf + plant */}
      <rect x="800" y="380" width="260" height="14" rx="4" fill="#C9AE86" />
      <rect x="830" y="320" width="60" height="60" rx="10" fill="#F2F0EC" />
      <path d="M860 320 C 840 270, 820 250, 790 240 M860 320 C 870 260, 900 240, 930 230 M860 320 C 860 280, 860 250, 865 215" stroke="#3E8E5A" strokeWidth="10" fill="none" strokeLinecap="round" />
      <rect x="930" y="350" width="90" height="30" rx="4" fill="#B9B4C8" />
      {/* desk */}
      <rect x="0" y="1030" width="1080" height="890" fill="url(#desk)" />
      <rect x="0" y="1030" width="1080" height="14" fill="#CDB896" />
      {/* all-in-one Mac (generic, no logo) */}
      <g transform="translate(655 604)">
        <rect x="0" y="0" width="400" height="290" rx="18" fill="#E7E8EC" stroke="#C9CBD1" strokeWidth="4" />
        <rect x="14" y="14" width="372" height="236" rx="6" fill="url(#screen)" />
        <rect x="14" y="14" width="372" height="12" fill="rgba(255,255,255,.55)" />
        <rect x="120" y="226" width="160" height="16" rx="8" fill="rgba(255,255,255,.45)" />
        <rect x="0" y="250" width="400" height="40" rx="0" fill="#D9DADF" />
        <path d="M170 290 L230 290 L245 420 L155 420 Z" fill="#CFD1D6" />
        <rect x="120" y="416" width="160" height="10" rx="5" fill="#BFC1C7" />
      </g>
      {/* keyboard */}
      <rect x="700" y="1052" width="300" height="30" rx="8" fill="#F5F5F7" stroke="#D8D8DC" strokeWidth="3" />
    </svg>
  );
};
