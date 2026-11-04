import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AURORA, CARD_SHADOW, C, MONO, SANS, SERIF} from '../theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const useSpring = (at: number, config = {damping: 14, stiffness: 160, mass: 0.7}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config});
};

export const NoahMark: React.FC<{size: number; white?: boolean}> = ({size, white}) => (
  <Img
    src={staticFile(white ? 'brand/noah-mark-1color-white.svg' : 'brand/noah-mark-light.svg')}
    style={{width: size, height: size}}
  />
);

/* ---------- Icons (simple line glyphs, drawn in code) ---------- */
export const Icon: React.FC<{name: 'ram' | 'storage' | 'startup'; color: string; size?: number}> = ({
  name,
  color,
  size = 56,
}) => {
  const s = {fill: 'none', stroke: color, strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      {name === 'ram' && (
        <g {...s}>
          <rect x="3" y="10" width="26" height="12" rx="2" />
          <path d="M8 22v3M13 22v3M19 22v3M24 22v3" />
          <rect x="7" y="13.5" width="4" height="5" rx="0.6" />
          <rect x="14" y="13.5" width="4" height="5" rx="0.6" />
          <rect x="21" y="13.5" width="4" height="5" rx="0.6" />
        </g>
      )}
      {name === 'storage' && (
        <g {...s}>
          <rect x="4" y="7" width="24" height="18" rx="3" />
          <path d="M4 18h24" />
          <circle cx="23" cy="21.5" r="1" fill={color} />
          <path d="M8 12.5h9" />
        </g>
      )}
      {name === 'startup' && (
        <g {...s}>
          <path d="M16 4v10" />
          <path d="M9.5 8.2a10 10 0 1 0 13 0" />
        </g>
      )}
    </svg>
  );
};

/* ---------- Series badge ---------- */
export const SeriesBadge: React.FC<{episode: number; at?: number}> = ({episode, at = 2}) => {
  const p = useSpring(at);
  return (
    <div
      style={{
        position: 'absolute',
        top: 64,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        transform: `translateY(${(1 - p) * -40}px)`,
        opacity: p,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '14px 18px 14px 16px',
          borderRadius: 999,
          background: 'rgba(255,255,255,.92)',
          boxShadow: CARD_SHADOW,
          border: `1px solid ${C.line}`,
          fontFamily: SANS,
        }}
      >
        <NoahMark size={44} />
        <span style={{fontSize: 30, fontWeight: 800, color: C.ink, letterSpacing: -0.3}}>
          Can You Diagnose This PC?
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: 'white',
            background: AURORA,
            borderRadius: 999,
            padding: '6px 14px',
            letterSpacing: 1,
          }}
        >
          EP. {String(episode).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

/* ---------- Case chip (shown in the hook) ---------- */
export const CaseChip: React.FC<{caseNo: string; symptom: string; at: number; out: number}> = ({
  caseNo,
  symptom,
  at,
  out,
}) => {
  const frame = useCurrentFrame();
  const p = useSpring(at);
  const o = interpolate(frame, [out - 8, out], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        top: 168,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: p * o,
        transform: `scale(${0.9 + 0.1 * p})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 22px',
          borderRadius: 18,
          background: 'rgba(26,29,97,.78)',
          color: 'white',
          fontFamily: SANS,
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <span style={{fontFamily: MONO, fontSize: 26, opacity: 0.75, letterSpacing: 2}}>CASE {caseNo}</span>
        <span style={{width: 6, height: 6, borderRadius: 3, background: '#F59E0B'}} />
        <span>Symptom: {symptom}</span>
      </div>
    </div>
  );
};

/* ---------- Kinetic caption ---------- */
export const Caption: React.FC<{
  text: string;
  from: number;
  emphasis?: string[];
  size: number;
  dark?: boolean;
}> = ({text, from, emphasis = [], size, dark}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: `${size * 0.12}px ${size * 0.26}px`,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: -size * 0.02,
        textAlign: 'center',
      }}
    >
      {words.map((w, i) => {
        const t = from + i * 2.5;
        const p = interpolate(frame, [t, t + 6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const em = emphasis.includes(w);
        return (
          <span
            key={i}
            style={{
              opacity: p,
              transform: `translateY(${(1 - p) * 18}px)`,
              display: 'inline-block',
              color: em ? 'white' : dark ? C.ink : 'white',
              background: em ? AURORA : undefined,
              padding: em ? `0 ${size * 0.16}px ${size * 0.04}px` : undefined,
              borderRadius: em ? size * 0.2 : undefined,
              boxShadow: em ? '0 8px 24px -8px rgba(79,70,229,.7)' : undefined,
              textShadow: em ? undefined : dark ? undefined : '0 4px 24px rgba(10,12,40,.55), 0 2px 4px rgba(10,12,40,.4)',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- Answer option card ---------- */
export const OptionCard: React.FC<{
  letter: string;
  label: string;
  icon: 'ram' | 'storage' | 'startup';
  at: number;
  state: 'idle' | 'ruled-out' | 'correct';
  stateAt: number;
  pulseAt?: number;
  height?: number;
}> = ({letter, label, icon, at, state, stateAt, pulseAt = -999, height = 168}) => {
  const frame = useCurrentFrame();
  const p = useSpring(at);
  const s = useSpring(stateAt, {damping: 12, stiffness: 180, mass: 0.6});
  const out = state === 'ruled-out' ? s : 0;
  const win = state === 'correct' ? s : 0;
  // gentle idle "breathing" while the viewer thinks
  const breathe = 1 + 0.008 * Math.sin((frame - at) / 7);
  const pulse = interpolate(frame, [pulseAt, pulseAt + 4, pulseAt + 12], [0, 1, 0], clamp);
  return (
    <div
      style={{
        position: 'relative',
        height,
        borderRadius: 36,
        background: win > 0.01 ? undefined : C.card,
        backgroundImage: win > 0.01 ? AURORA : undefined,
        boxShadow: CARD_SHADOW,
        border: `2px solid ${win > 0.01 ? 'transparent' : C.line}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 34px',
        gap: 28,
        opacity: p * (1 - 0.55 * out),
        transform: `translateX(${(1 - p) * 120}px) scale(${(0.94 + 0.06 * p) * breathe * (1 + 0.04 * win) * (1 - 0.04 * out) * (1 + 0.06 * pulse)})`,
        outline: pulse > 0.01 ? `${6 * pulse}px solid rgba(79,70,229,${0.35 * pulse})` : undefined,
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 52,
          fontWeight: 800,
          color: win > 0.01 ? C.indigo : 'white',
          background: win > 0.01 ? 'white' : out > 0.01 ? '#B9B3A8' : AURORA,
        }}
      >
        {letter}
      </div>
      <div
        style={{
          flex: 1,
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: -1.2,
          color: win > 0.01 ? 'white' : C.ink,
          position: 'relative',
        }}
      >
        {label}
        {/* strike-through for ruled out */}
        <div
          style={{
            position: 'absolute',
            left: -4,
            top: '54%',
            height: 6,
            borderRadius: 3,
            background: C.ink2,
            width: `${out * 100}%`,
          }}
        />
      </div>
      <Icon name={icon} color={win > 0.01 ? 'white' : out > 0.01 ? '#B9B3A8' : C.indigo} size={64} />
    </div>
  );
};

/* ---------- Countdown ring ---------- */
export const Countdown: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const total = to - from;
  const t = frame - from;
  const appear = useSpring(from - 8);
  if (t < -10 || t > total + 26) return null;
  const progress = interpolate(t, [0, total], [0, 1], clamp);
  const step = total / 5;
  const remaining = Math.max(1, 5 - Math.floor(t / step));
  const inSec = ((t % step) + step) % step;
  const pulse = t >= 0 && t < total ? interpolate(inSec, [0, 4, 14], [1.14, 1.04, 1], clamp) : 1;
  const done = t >= total;
  const doneP = interpolate(t, [total, total + 6], [0, 1], clamp);
  const fadeOut = interpolate(t, [total + 16, total + 26], [1, 0], clamp);
  const r = 104;
  const circ = 2 * Math.PI * r;
  const urgent = remaining <= 2 && !done;
  return (
    <div
      style={{
        width: 260,
        height: 260,
        borderRadius: 130,
        background: 'white',
        boxShadow: '0 20px 50px -14px rgba(26,29,97,.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transform: `scale(${appear * pulse})`,
        opacity: fadeOut,
      }}
    >
      <svg width={260} height={260} style={{position: 'absolute', inset: 0, transform: 'rotate(-90deg)'}}>
        <defs>
          <linearGradient id="cd" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2563EB" />
            <stop offset="0.5" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <circle cx={130} cy={130} r={r} fill="none" stroke={C.page} strokeWidth={18} />
        <circle
          cx={130}
          cy={130}
          r={r}
          fill="none"
          stroke={urgent ? C.amber : 'url(#cd)'}
          strokeWidth={18}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * progress}
        />
      </svg>
      {!done ? (
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 132,
            letterSpacing: -4,
            color: urgent ? C.amber : C.navy,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {remaining}
        </span>
      ) : (
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 50,
            lineHeight: 1,
            textAlign: 'center',
            color: C.navy,
            transform: `scale(${0.6 + 0.4 * doneP})`,
          }}
        >
          TIME’S
          <br />
          UP
        </span>
      )}
    </div>
  );
};

/* ---------- Serif accent line ---------- */
export const SerifNote: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({
  children,
  size = 40,
  color = C.ink2,
}) => (
  <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: size, color}}>{children}</span>
);
