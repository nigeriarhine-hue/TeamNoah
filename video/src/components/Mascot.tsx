import React from 'react';

// Noah mascot (concept v2: robot; v1 'soft' still available via variant="soft").
// A calm, silent helper character for Shorts.
//
// Brand guardrails (from brand-kit.html):
// - Noah is always third person. The mascot never speaks as "I"; it acts, the narrator talks.
// - The waterline across the body is ALWAYS level (the mark's one rule: a level line).
// - It is not the logo: a soft pebble (not a circle) and the line does not overshoot the body.
// - No boats, arks or animals. Calm, plain, unhurried — never a wizard or a salesperson.

export type MascotExpression = 'calm' | 'curious' | 'found' | 'waiting' | 'relieved';
export type MascotPose = 'idle' | 'point' | 'holdCard' | 'thumbsUp' | 'wave';

const NAVY = '#1A1D61';
const SKY = '#E4E6FF';
const SKY_SHADE = '#C7CBFF';

export const Mascot: React.FC<{
  size?: number; // rendered height
  expression?: MascotExpression;
  pose?: MascotPose;
  blink?: number; // 1 open … 0 closed
  glow?: number; // 0..1 inner tide glow
  bob?: number; // vertical offset in px (for idle float)
  look?: number; // -1 left … 1 right (pupils)
  cardText?: string;
  variant?: 'soft' | 'robot';
}> = ({size = 400, expression = 'calm', pose = 'idle', blink = 1, glow = 0.6, bob = 0, look = 0, cardText = 'Plan', variant = 'robot'}) => {
  const robot = variant === 'robot';
  const W = 400;
  const H = 440;
  // body: soft pebble, slightly wider at the bottom
  const body = 'M200 40 C 300 40, 352 110, 352 210 C 352 320, 290 392, 200 392 C 110 392, 48 320, 48 210 C 48 110, 100 40, 200 40 Z';
  const LINE_Y = 232; // the level waterline

  const eyeOpen = expression === 'found' ? 1.2 : expression === 'waiting' ? 0.85 : 1;
  const happy = expression === 'relieved';
  const browL = expression === 'curious' ? -14 : expression === 'found' ? -10 : 0;
  const browR = expression === 'found' ? -10 : 0;
  const px = look * 7;

  const arm = (side: 'L' | 'R', angle: number, extra?: React.ReactNode) => {
    const x = side === 'L' ? 62 : 338;
    return (
      <g transform={`rotate(${angle} ${x} 260)`}>
        <rect x={x - 17} y={250} width={34} height={92} rx={robot ? 10 : 17} fill={robot ? 'url(#mMetal)' : 'url(#mTide)'} stroke={NAVY} strokeWidth={9} />
        {robot && <circle cx={x} cy={296} r={9} fill={NAVY} />}
        {robot && <rect x={x - 21} y={330} width={42} height={24} rx={10} fill="url(#mTide)" stroke={NAVY} strokeWidth={8} />}
        {extra}
      </g>
    );
  };

  // arms per pose (angles rotate around the shoulder)
  let left: React.ReactNode = arm('L', 18);
  let right: React.ReactNode = arm('R', -18);
  let prop: React.ReactNode = null;
  if (pose === 'point') {
    right = (
      <g transform="rotate(-100 338 260)">
        <rect x={321} y={250} width={34} height={100} rx={17} fill="url(#mTide)" stroke={NAVY} strokeWidth={9} />
        <circle cx={338} cy={352} r={14} fill={SKY} stroke={NAVY} strokeWidth={7} />
      </g>
    );
  }
  if (pose === 'wave') {
    right = (
      <g transform="rotate(-150 338 260)">
        <rect x={321} y={250} width={34} height={92} rx={17} fill="url(#mTide)" stroke={NAVY} strokeWidth={9} />
      </g>
    );
  }
  if (pose === 'thumbsUp') {
    right = (
      <g transform="rotate(-160 338 262)">
        <rect x={321} y={250} width={34} height={84} rx={17} fill="url(#mTide)" stroke={NAVY} strokeWidth={9} />
        <g transform="translate(338 344) rotate(180)">
          <rect x={-22} y={-8} width={44} height={36} rx={12} fill={SKY} stroke={NAVY} strokeWidth={7} />
          <rect x={-8} y={-38} width={16} height={36} rx={8} fill={SKY} stroke={NAVY} strokeWidth={7} />
        </g>
      </g>
    );
  }
  if (pose === 'holdCard') {
    left = arm('L', -40);
    right = arm('R', 40);
    prop = (
      <g transform="translate(200 300) rotate(-4)">
        <rect x={-120} y={-58} width={240} height={128} rx={18} fill="white" stroke={NAVY} strokeWidth={8} />
        <rect x={-120} y={-58} width={240} height={34} rx={18} fill="url(#mTide)" />
        <rect x={-120} y={-36} width={240} height={12} fill="url(#mTide)" />
        <text x={0} y={30} textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={800} fontSize={40} fill={NAVY}>
          {cardText}
        </text>
      </g>
    );
  }

  return (
    <svg width={(size * W) / H} height={size} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="mTide" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563EB" />
          <stop offset="0.5" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <radialGradient id="mGlow" cx="0.5" cy="0.35" r="0.6">
          <stop offset="0" stopColor="#C7CBFF" stopOpacity={0.9 * glow} />
          <stop offset="1" stopColor="#C7CBFF" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="mSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3F4FF" />
          <stop offset="1" stopColor={SKY_SHADE} />
        </linearGradient>
        <linearGradient id="mMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F5FF" />
          <stop offset="0.45" stopColor="#D9DCF7" />
          <stop offset="1" stopColor="#AEB3E3" />
        </linearGradient>
        <linearGradient id="mVisor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B1F4F" />
          <stop offset="1" stopColor="#0B1024" />
        </linearGradient>
        <filter id="mLed" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="mBody">
          <path d={body} />
        </clipPath>
      </defs>

      {/* ground shadow (stays put while the body floats) */}
      <ellipse cx={200} cy={420} rx={110 - bob * 0.8} ry={14} fill="rgba(26,29,97,.18)" />

      <g transform={`translate(0 ${bob})`}>
        {left}
        {/* feet */}
        {robot ? (
          <>
            <rect x={108} y={374} width={84} height={34} rx={12} fill={NAVY} />
            <rect x={208} y={374} width={84} height={34} rx={12} fill={NAVY} />
            {[120, 140, 160, 180, 220, 240, 260, 280].map((x) => (
              <rect key={x} x={x - 3} y={380} width={6} height={22} rx={3} fill="#3A3F8F" />
            ))}
          </>
        ) : (
          <>
            <ellipse cx={150} cy={392} rx={36} ry={20} fill={NAVY} />
            <ellipse cx={250} cy={392} rx={36} ry={20} fill={NAVY} />
          </>
        )}
        {/* body: sky above, tide below, level line between */}
        <g clipPath="url(#mBody)">
          <rect x={0} y={0} width={W} height={LINE_Y} fill={robot ? 'url(#mMetal)' : 'url(#mSky)'} />
          {robot && <path d="M90 70 C 150 52, 230 50, 300 68" stroke="white" strokeWidth={10} opacity={0.7} fill="none" strokeLinecap="round" />}
          <rect x={0} y={LINE_Y} width={W} height={H} fill="url(#mTide)" />
          <rect x={0} y={LINE_Y} width={W} height={H} fill="url(#mGlow)" />
        </g>
        <path d={body} fill="none" stroke={NAVY} strokeWidth={11} />
        <line x1={52} y1={LINE_Y} x2={348} y2={LINE_Y} stroke={NAVY} strokeWidth={11} strokeLinecap="butt" />

        {robot ? (
          <>
        {/* antenna */}
        <line x1={200} y1={42} x2={200} y2={6} stroke={NAVY} strokeWidth={9} strokeLinecap="round" />
        <circle cx={200} cy={0} r={15} fill="url(#mTide)" stroke={NAVY} strokeWidth={7} />
        <circle cx={195} cy={-5} r={4} fill="white" opacity={0.8} />
        {/* ear bolts */}
        {[46, 354].map((x) => (
          <g key={x}>
            <circle cx={x} cy={150} r={22} fill="url(#mMetal)" stroke={NAVY} strokeWidth={8} />
            <circle cx={x} cy={150} r={7} fill={NAVY} />
          </g>
        ))}
        {/* rivets on the waterline band */}
        {[100, 150, 200, 250, 300].map((x) => (
          <circle key={x} cx={x} cy={LINE_Y} r={4} fill="#C7CBFF" />
        ))}
        {/* chest panel */}
        <rect x={150} y={262} width={100} height={62} rx={14} fill="rgba(11,16,36,.25)" stroke={NAVY} strokeWidth={6} />
        {[172, 200, 228].map((x, i) => (
          <circle key={x} cx={x} cy={293} r={8} fill={i === 1 ? '#C7CBFF' : 'rgba(199,203,255,.45)'} filter="url(#mLed)" opacity={i === 1 ? 0.6 + 0.4 * glow : 1} />
        ))}
        {/* visor face */}
        <rect x={86} y={92} width={228} height={124} rx={46} fill="url(#mVisor)" stroke={NAVY} strokeWidth={8} />
        <path d="M108 108 C 150 98, 200 98, 236 104" stroke="white" strokeWidth={6} opacity={0.18} fill="none" strokeLinecap="round" />
        <g filter="url(#mLed)">
          {[156, 244].map((cx, i) => {
            const lift = (i === 0 ? browL : browR) * 0.6;
            if (happy) return <path key={cx} d={`M${cx - 20} ${158} Q ${cx} ${138} ${cx + 20} ${158}`} stroke="#C7CBFF" strokeWidth={10} fill="none" strokeLinecap="round" />;
            if (expression === 'found') return <circle key={cx} cx={cx + px} cy={150} r={20 * blink} fill="#C7CBFF" />;
            if (expression === 'waiting')
              return <rect key={cx} x={cx - 20 + px} y={150 - 6 * blink} width={40} height={12 * blink} rx={6} fill="#C7CBFF" />;
            const h = (expression === 'curious' && i === 0 ? 30 : 40) * blink;
            return <rect key={cx} x={cx - 13 + px} y={148 - h / 2 + lift} width={26} height={Math.max(4, h)} rx={13} fill="#C7CBFF" />;
          })}
          {/* LED mouth */}
          {expression === 'found' ? (
            <circle cx={200} cy={194} r={8} fill="#C7CBFF" />
          ) : happy ? (
            <path d="M178 188 Q 200 206 222 188" stroke="#C7CBFF" strokeWidth={7} fill="none" strokeLinecap="round" />
          ) : expression === 'curious' ? (
            <path d="M182 194 L 200 190 L 218 196" stroke="#C7CBFF" strokeWidth={7} fill="none" strokeLinecap="round" />
          ) : (
            [184, 196, 208, 220].map((x, i) => <rect key={x} x={x - 4} y={190 + (i === 1 || i === 2 ? 3 : 0)} width={8} height={6} rx={3} fill="#C7CBFF" />)
          )}
        </g>
          </>
        ) : (
          <>
        {/* face (in the sky) */}
        {[150, 250].map((cx, i) => (
          <g key={cx}>
            {/* brows */}
            <rect x={cx - 26} y={98 + (i === 0 ? browL : browR)} width={52} height={10} rx={5} fill={NAVY} opacity={0.85} />
            {happy ? (
              <path d={`M${cx - 22} ${158} Q ${cx} ${136} ${cx + 22} ${158}`} stroke={NAVY} strokeWidth={10} fill="none" strokeLinecap="round" />
            ) : (
              <g transform={`translate(${cx} 152) scale(1 ${blink * eyeOpen})`}>
                <ellipse cx={0} cy={0} rx={22} ry={27} fill={NAVY} />
                <circle cx={7 + px} cy={-9} r={8} fill="white" />
                <circle cx={-6 + px} cy={8} r={3.5} fill="white" opacity={0.7} />
              </g>
            )}
          </g>
        ))}
        {/* cheeks */}
        <ellipse cx={112} cy={192} rx={20} ry={10} fill="#F5A3C7" opacity={0.45} />
        <ellipse cx={288} cy={192} rx={20} ry={10} fill="#F5A3C7" opacity={0.45} />
        {/* mouth */}
        {expression === 'found' ? (
          <ellipse cx={200} cy={200} rx={14} ry={12} fill={NAVY} />
        ) : expression === 'curious' ? (
          <path d="M184 202 Q 200 196 218 204" stroke={NAVY} strokeWidth={8} fill="none" strokeLinecap="round" />
        ) : (
          <path d={happy ? 'M176 194 Q 200 222 224 194' : 'M182 196 Q 200 212 218 196'} stroke={NAVY} strokeWidth={8} fill="none" strokeLinecap="round" />
        )}
          </>
        )}
        {right}
        {prop}
      </g>
    </svg>
  );
};
