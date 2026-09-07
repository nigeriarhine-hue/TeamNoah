import React from 'react';
import {t, font} from '../theme';
import {FONT_FACE_CSS} from '../fonts';

/** Inline the faces once per composition. */
export const Fonts: React.FC = () => <style>{FONT_FACE_CSS}</style>;

export const NoahMark: React.FC<{size: number; id?: string}> = ({size, id = 'nm'}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{display: 'block'}}>
    <defs>
      <clipPath id={`${id}c`}>
        <circle cx="60" cy="58" r="34" />
      </clipPath>
      <radialGradient id={`${id}r`} cx="0.5" cy="0.94" r="0.9">
        <stop offset="0" stopColor="#8b8ff8" />
        <stop offset="0.45" stopColor="#6366f1" />
        <stop offset="1" stopColor="#8b5cf6" />
      </radialGradient>
      <linearGradient id={`${id}g3`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(43,53,122,0.140)" />
        <stop offset="1" stopColor="rgba(99,102,241,0.300)" />
      </linearGradient>
      <linearGradient id={`${id}g4`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(139,143,248,0.550)" />
        <stop offset="1" stopColor="rgba(139,143,248,0.000)" />
      </linearGradient>
    </defs>
    <g clipPath={`url(#${id}c)`}>
      <rect x="24" y="22" width="72" height="52" fill={`url(#${id}g3)`} />
      <rect x="24" y="74" width="72" height="20" fill={`url(#${id}r)`} />
    </g>
    <rect clipPath={`url(#${id}c)`} x="24" y="74" width="72" height="14" fill={`url(#${id}g4)`} />
    {/* the disc */}
    <circle cx="60" cy="58" r="34" fill="none" stroke="#C7CBFF" strokeWidth="7" />
    {/* the load line — it overshoots the disc deliberately. Never crop it. */}
    <line x1="16" y1="74" x2="104" y2="74" stroke="#C7CBFF" strokeWidth="7" />
  </svg>
);

export const Tick: React.FC<{size: number; color?: string}> = ({size, color = t.commit}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <path d="M4 12.5l5.2 5.2L20 6.9" fill="none" stroke={color} strokeWidth="2.6"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Arrow: React.FC<{w: number; color?: string}> = ({w, color = t.mute}) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 32 16" style={{display: 'block'}}>
    <path d="M1 8h28m0 0l-7-6m7 6l-7 6" fill="none" stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UndoGlyph: React.FC<{size: number; color?: string}> = ({size, color = t.commit}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <path d="M3.5 8.5h9a6 6 0 110 12H7" fill="none" stroke={color} strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 4L3.2 8.5 7 13" fill="none" stroke={color} strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Wifi: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <path d="M2 8.5a15 15 0 0120 0M5.5 12.5a10 10 0 0113 0M9 16.5a5 5 0 016 0"
      fill="none" stroke={t.ink2} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="20" r="1.4" fill={t.ink2} />
  </svg>
);

export const Bolt: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7z" fill={color} />
  </svg>
);

/** macOS-style pointer, for the cursor that arrives on the APPROVE button in clip 13. */
export const Cursor: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 20 28" style={{display: 'block'}}>
    <path d="M2 1.5l15 14.2h-7.4l-3.2 8.6z" fill="#fff" stroke="#0B1024" strokeWidth="1.4"
      strokeLinejoin="round" />
  </svg>
);

export const Battery: React.FC<{pct: number; charging?: boolean; scale?: number}> = ({
  pct, charging = false, scale = 1,
}) => {
  const w = 48 * scale, h = 24 * scale, b = 2.5 * scale, r = 7 * scale;
  return (
    <div style={{position: 'relative', width: w, height: h, border: `${b}px solid ${t.ink2}`,
      borderRadius: r, boxSizing: 'border-box'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`,
        background: t.ink, borderRadius: 3 * scale}} />
      {charging ? (
        /* the bolt sits over the filled part so it stays legible at any charge level */
        <div style={{position: 'absolute', left: 3 * scale, top: '50%', transform: 'translateY(-50%)'}}>
          <Bolt size={16 * scale} color={t.night} />
        </div>
      ) : null}
      <div style={{position: 'absolute', right: -3.5 * scale, top: '50%',
        transform: 'translateY(-50%)', width: 3.5 * scale, height: 9 * scale,
        background: t.ink2, borderRadius: `0 ${2 * scale}px ${2 * scale}px 0`}} />
    </div>
  );
};

export const MenuBar: React.FC<{app?: string; clock: string; pct: number}> = ({
  app = 'Noah', clock, pct,
}) => (
  <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 52, display: 'flex',
    alignItems: 'center', padding: '0 28px', gap: 36, background: 'rgba(8,12,28,.66)',
    borderBottom: '1px solid rgba(255,255,255,.05)', fontFamily: font.sans}}>
    <span style={{fontWeight: 700, fontSize: 26, color: t.ink}}>{app}</span>
    {['File', 'Edit', 'View', 'Help'].map((m) => (
      <span key={m} style={{fontWeight: 500, fontSize: 26, color: t.ink2}}>{m}</span>
    ))}
    <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 26}}>
      <Wifi size={26} />
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <Battery pct={pct} />
        <span style={{fontWeight: 500, fontSize: 26, color: t.ink,
          fontVariantNumeric: 'tabular-nums'}}>{pct}%</span>
      </div>
      <span style={{fontWeight: 500, fontSize: 26, color: t.ink,
        fontVariantNumeric: 'tabular-nums'}}>{clock}</span>
    </div>
  </div>
);

export const Desktop: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', inset: 0,
    background: 'linear-gradient(178deg,#0B1024 0%,#101427 52%,#14171C 100%)'}}>
    {children}
  </div>
);

/** The Noah window. Fixed size across every clip — the plate shows its edges, so a
 *  window that changed size between cuts would read as a continuity error. */
export const NoahWindow: React.FC<{children: React.ReactNode; centered?: boolean}> = ({
  children, centered = false,
}) => (
  <div style={{position: 'absolute', left: 440, top: 238, width: 1680, height: 1124,
    background: t.page2, border: `2px solid ${t.line}`, borderRadius: 24, overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,.3), 0 60px 120px -50px rgba(0,0,0,.75)',
    fontFamily: font.sans}}>
    <div style={{height: 98, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 16,
      borderBottom: `1px solid ${t.line}`, background: 'rgba(255,255,255,.015)'}}>
      <div style={{display: 'flex', gap: 14}}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{width: 16, height: 16, borderRadius: '50%',
            background: 'rgba(255,255,255,.14)'}} />
        ))}
      </div>
      <div style={{marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignItems: 'center',
        gap: 14, transform: 'translateX(-46px)'}}>
        <NoahMark size={42} />
        <span style={{fontWeight: 700, fontSize: 30, letterSpacing: '-.02em', color: t.ink2}}>
          Noah
        </span>
      </div>
    </div>
    <div style={{padding: '64px 76px', height: 'calc(100% - 98px)', display: 'flex',
      flexDirection: 'column', justifyContent: centered ? 'center' : 'flex-start',
      boxSizing: 'border-box'}}>
      {children}
    </div>
  </div>
);

export const Eyebrow: React.FC<{children: React.ReactNode}> = ({children}) => (
  <p style={{fontSize: 23, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
    color: t.indigo, display: 'flex', alignItems: 'center', gap: 18, margin: '0 0 34px'}}>
    <span style={{width: 34, height: 3, background: t.indigo, flex: 'none'}} />
    {children}
  </p>
);
