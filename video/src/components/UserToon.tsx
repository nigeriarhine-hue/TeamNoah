import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {RhubarbCue, RhubarbMouth} from './GamerToon';
import {clamp} from './ui';

// Original illustrated character (free, drawn in SVG): a young guy who uses a Mac. Own look:
// short ginger hair swept up at the front, freckles, round thin-framed glasses, forest-green
// crewneck sweater over a white tee. No logos anywhere. He speaks as a user; Noah is always
// talked about in the third person.
//
// The mouth is driven by Rhubarb Lip Sync cues (tools/lipsync.sh).

const SKIN = '#F3CDB0';
const SKIN_SHADE = '#E2A985';
const HAIR = '#C4602A';
const HAIR_DARK = '#9C4720';
const HAIR_LIGHT = '#DE8448';
const SWEATER = '#2E5B3C';
const SWEATER_DARK = '#23462E';
const FRAME = '#2C2522';

export const UserToon: React.FC<{
  cues: RhubarbCue[];
  size?: number;
  look?: (frame: number) => {x: number; y: number}; // pupil offset, -1..1
  browAt?: number[]; // brow raise moments
  squintAt?: [number, number][]; // suspicious squint ranges
  shake?: [number, number]; // head-shake range
  smileAfter?: number;
  waveFrom?: number;
}> = ({cues, size = 1000, look, browAt = [], squintAt = [], shake, smileAfter = 1e9, waveFrom = 1e9}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const cue = cues.find((c) => t >= c.start && t < c.end)?.value ?? 'X';
  const talking = cue !== 'X';

  const bt = (frame + 41) % 96;
  const blink = bt < 5 ? interpolate(bt, [0, 2, 5], [1, 0.08, 1], clamp) : 1;
  const brow = browAt.reduce((a, s) => Math.max(a, interpolate(frame, [s - 4, s + 3, s + 22, s + 30], [0, 1, 1, 0], clamp)), 0);
  const squint = squintAt.reduce((a, [s, e]) => Math.max(a, interpolate(frame, [s, s + 5, e - 5, e], [0, 1, 1, 0], clamp)), 0);
  const shakeAmt = shake ? interpolate(frame, [shake[0], shake[0] + 4, shake[1] - 6, shake[1]], [0, 1, 1, 0], clamp) : 0;
  const shakeX = shake ? Math.sin((frame - shake[0]) / 2.1) * 14 * shakeAmt : 0;
  const nod = talking ? Math.sin(frame / 3.2) * 1.6 : 0;
  const sway = Math.sin(frame / 22) * 1.3;
  const breathe = Math.sin(frame / 18) * 2.5;
  const p = look ? look(frame) : {x: 0, y: 0};
  const eyeH = blink * (1 - 0.45 * squint);

  const wave = interpolate(frame, [waveFrom, waveFrom + 8], [0, 1], clamp);
  const waveRot = Math.sin((frame - waveFrom) / 3.4) * 14 * wave;

  return (
    <svg width={(size * 600) / 800} height={size} viewBox="0 0 600 800" style={{overflow: 'visible'}}>
      {/* sweater body */}
      <g transform={`translate(0 ${breathe * 0.4})`}>
        <path d="M24 800 C 34 650, 150 582, 300 578 C 450 582, 566 650, 576 800 Z" fill={SWEATER} />
        {/* knit texture: soft vertical ribs */}
        {[90, 140, 190, 410, 460, 510].map((x) => (
          <path key={x} d={`M${x} ${x < 300 ? 660 - (x - 60) * 0.3 : 660 - (540 - x) * 0.3} L ${x} 800`} stroke={SWEATER_DARK} strokeWidth={4} opacity={0.35} />
        ))}
        {/* white tee peeking at the collar */}
        <path d="M244 578 C 262 612, 338 612, 356 578 L 346 600 C 330 626, 270 626, 254 600 Z" fill="#F7F6F2" />
        {/* crewneck rib */}
        <path d="M236 574 C 256 628, 344 628, 364 574" stroke={SWEATER_DARK} strokeWidth={20} fill="none" strokeLinecap="round" />
        <path d="M236 574 C 256 628, 344 628, 364 574" stroke="#3A6E4A" strokeWidth={4} fill="none" strokeDasharray="3 7" />
      </g>

      {/* waving arm (end card) */}
      {wave > 0 && (
        <g transform={`translate(0 ${(1 - wave) * 260})`} opacity={wave}>
          <g transform={`rotate(${waveRot} 470 640)`}>
            <path d="M440 700 C 470 620, 500 520, 520 440 L 580 456 C 566 540, 540 640, 520 720 Z" fill={SWEATER} />
            <path d="M516 452 L 582 468" stroke={SWEATER_DARK} strokeWidth={16} strokeLinecap="round" />
            {/* hand */}
            <g transform="translate(552 406)">
              <ellipse cx={0} cy={18} rx={38} ry={42} fill={SKIN} />
              {[-28, -10, 8, 26].map((x, i) => (
                <rect key={x} x={x - 8} y={-34 + (i === 0 || i === 3 ? 10 : 0)} width={17} height={50} rx={8.5} fill={SKIN} />
              ))}
              <rect x={30} y={6} width={17} height={38} rx={8.5} fill={SKIN} transform="rotate(-38 38 25)" />
              <path d="M-20 34 Q 0 44 20 34" stroke={SKIN_SHADE} strokeWidth={4} fill="none" strokeLinecap="round" />
            </g>
          </g>
        </g>
      )}

      {/* neck */}
      <path d="M258 470 L 258 588 Q 300 612 342 588 L 342 470 Z" fill={SKIN_SHADE} />

      {/* head */}
      <g transform={`translate(${shakeX} ${nod}) rotate(${sway + shakeX * 0.25} 300 470)`}>
        {/* ears */}
        <ellipse cx={156} cy={330} rx={22} ry={34} fill={SKIN_SHADE} />
        <ellipse cx={444} cy={330} rx={22} ry={34} fill={SKIN_SHADE} />
        {/* face: slightly long, defined jaw */}
        <path d="M158 290 C 158 170, 442 170, 442 290 C 442 410, 400 492, 300 500 C 200 492, 158 410, 158 290 Z" fill={SKIN} />
        <path d="M178 418 C 214 486, 386 486, 422 418 C 396 494, 204 494, 178 418 Z" fill={SKIN_SHADE} opacity={0.3} />
        {/* cheeks */}
        <ellipse cx={212} cy={392} rx={30} ry={16} fill="#F0A792" opacity={0.35} />
        <ellipse cx={388} cy={392} rx={30} ry={16} fill="#F0A792" opacity={0.35} />
        {/* freckles */}
        {[
          [205, 372], [222, 384], [238, 370], [214, 398], [246, 390],
          [355, 370], [372, 384], [390, 372], [362, 396], [386, 398],
          [282, 360], [318, 362],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.4} fill="#C47A52" opacity={0.75} />
        ))}

        {/* hair: short sides, swept-up front */}
        <path d="M160 296 C 156 236, 170 204, 196 186 L 194 252 C 180 262, 168 278, 164 304 Z" fill={HAIR_DARK} />
        <path d="M440 296 C 444 236, 430 204, 404 186 L 406 252 C 420 262, 432 278, 436 304 Z" fill={HAIR_DARK} />
        <path
          d="M176 236 C 168 170, 214 128, 276 116 C 300 92, 372 88, 410 120 C 446 150, 444 204, 428 240 C 410 212, 380 200, 350 200 C 330 182, 296 176, 268 186 C 236 192, 200 206, 176 236 Z"
          fill={HAIR}
        />
        {/* swept-up front lock */}
        <path d="M262 190 C 254 140, 300 96, 360 92 C 330 116, 318 144, 322 180 C 304 172, 282 176, 262 190 Z" fill={HAIR_LIGHT} />
        {[
          'M214 200 C 230 160, 262 140, 296 132',
          'M300 170 C 312 132, 344 112, 384 112',
          'M372 196 C 392 176, 412 168, 430 176',
        ].map((d, i) => (
          <path key={i} d={d} stroke={HAIR_DARK} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
        ))}

        {/* brows */}
        <g transform={`translate(0 ${-12 * brow + 7 * squint})`}>
          <path d={`M204 ${262 + 6 * squint} Q 234 248 266 ${258 + 4 * squint}`} stroke={HAIR_DARK} strokeWidth={11} fill="none" strokeLinecap="round" />
          <path d={`M334 ${258 + 4 * squint} Q 366 248 396 ${262 + 6 * squint}`} stroke={HAIR_DARK} strokeWidth={11} fill="none" strokeLinecap="round" />
        </g>

        {/* eyes */}
        {[234, 366].map((cx) => (
          <g key={cx} transform={`translate(${cx} 306) scale(1 ${eyeH})`}>
            <ellipse cx={0} cy={0} rx={24} ry={18} fill="white" />
            <circle cx={1 + p.x * 10} cy={1 + p.y * 6} r={12} fill="#3F7A78" />
            <circle cx={1 + p.x * 10} cy={1 + p.y * 6} r={6} fill="#14201F" />
            <circle cx={5 + p.x * 10} cy={-3 + p.y * 6} r={3.5} fill="white" />
          </g>
        ))}
        {/* round glasses */}
        <g fill="none" stroke={FRAME} strokeWidth={6}>
          <circle cx={234} cy={308} r={44} />
          <circle cx={366} cy={308} r={44} />
          <path d="M278 302 Q 300 290 322 302" />
          <path d="M190 300 L 160 292 M410 300 L 440 292" />
        </g>
        <path d="M206 284 Q 220 274 236 274" stroke="white" strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />
        <path d="M338 284 Q 352 274 368 274" stroke="white" strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />

        {/* nose */}
        <path d="M296 330 C 290 356, 286 372, 296 380 Q 306 388 318 380" stroke={SKIN_SHADE} strokeWidth={7} fill="none" strokeLinecap="round" />

        {/* mouth */}
        {frame > smileAfter ? (
          <g transform="translate(300 430)">
            <path d="M-44 0 Q 0 44 44 0 Z" fill="#5A2422" />
            <path d="M-44 0 Q 0 13 44 0 L 44 4 Q 0 19 -44 4 Z" fill="#F6F3EC" />
            <path d="M-44 0 Q 0 44 44 0" stroke="#A04A3E" strokeWidth={5} fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <g transform="translate(300 432)">
            <RhubarbMouth shape={cue} />
          </g>
        )}
      </g>
    </svg>
  );
};

/* ---------- soft studio backdrop: cream wall, desk lamp glow, shelf (no logos) ---------- */
export const UserRoom: React.FC = () => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="urWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F1EDE4" />
        <stop offset="1" stopColor="#E3DDD0" />
      </linearGradient>
      <radialGradient id="urGlow" cx="0.5" cy="0.35" r="0.6">
        <stop offset="0" stopColor="#C7CBFF" stopOpacity="0.55" />
        <stop offset="1" stopColor="#C7CBFF" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x={-100} y={-100} width={1280} height={2120} fill="url(#urWall)" />
    <rect x={-100} y={-100} width={1280} height={1400} fill="url(#urGlow)" />
    {/* shelf, plant, books */}
    <rect x={-40} y={1060} width={300} height={16} rx={4} fill="#CDBFA8" />
    {[[30, 70, '#8FA7C9'], [62, 84, '#D9A86B'], [96, 64, '#A9B89A'], [126, 78, '#C98F7A']].map(([x, h, c], i) => (
      <rect key={i} x={x as number} y={1060 - (h as number)} width={28} height={h as number} rx={3} fill={c as string} />
    ))}
    <path d="M200 1060 L 190 1010 L 240 1010 L 230 1060 Z" fill="#B98563" />
    <path d="M215 1012 C 196 970, 180 960, 168 952 M215 1012 C 220 960, 236 944, 250 936 M215 1012 C 206 976, 214 950, 212 930" stroke="#5E8C5A" strokeWidth={9} fill="none" strokeLinecap="round" />
    {/* framed print, abstract */}
    <rect x={830} y={980} width={210} height={150} rx={8} fill="#F8F6F0" stroke="#CDBFA8" strokeWidth={8} />
    <circle cx={900} cy={1060} r={34} fill="#C7CBFF" />
    <path d="M850 1110 L 930 1040 L 1010 1110 Z" fill="#9AA6D6" />
    {/* desk edge */}
    <rect x={-100} y={1780} width={1280} height={240} fill="#CDBFA8" />
  </svg>
);
