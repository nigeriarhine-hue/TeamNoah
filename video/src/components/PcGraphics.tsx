import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {AppIconName} from '../series/types';
import {C, SANS} from '../theme';
import {clamp, useSpring} from './ui';

/* ---------- Generic semantic app icons (no third-party logos) ---------- */
const APP_COLORS: Record<AppIconName, string> = {
  browser: '#2563EB',
  music: '#16A34A',
  chat: '#6366F1',
  games: '#334155',
  cloud: '#0EA5E9',
  office: '#EA580C',
  meeting: '#7C3AED',
  updater: '#0D9488',
  utility: '#64748B',
};

export const AppGlyph: React.FC<{name: AppIconName; size: number}> = ({name, size}) => {
  const s = {fill: 'none', stroke: 'white', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: APP_COLORS[name],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px -4px rgba(15,23,41,.35)',
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24">
        {name === 'browser' && (
          <g {...s}>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M3.5 12h17M12 3.5c2.6 2.6 2.6 14.4 0 17M12 3.5c-2.6 2.6-2.6 14.4 0 17" />
          </g>
        )}
        {name === 'music' && (
          <g {...s}>
            <path d="M9 17V6l10-2v11" />
            <circle cx="7" cy="17" r="2.2" />
            <circle cx="17" cy="15" r="2.2" />
          </g>
        )}
        {name === 'chat' && (
          <g {...s}>
            <path d="M5 6h14v9H10l-4 3v-3H5z" />
            <path d="M9 10.5h.01M12 10.5h.01M15 10.5h.01" strokeWidth={3} />
          </g>
        )}
        {name === 'games' && (
          <g {...s}>
            <path d="M7 9h10a4 4 0 0 1 3.8 5.2l-.6 1.8a2 2 0 0 1-3.4.6L15 15H9l-1.8 1.6a2 2 0 0 1-3.4-.6l-.6-1.8A4 4 0 0 1 7 9z" />
            <path d="M8 12v2M7 13h2M15.5 12.5h.01M17 13.5h.01" />
          </g>
        )}
        {name === 'cloud' && (
          <g {...s}>
            <path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 10.5 3.8 3.8 0 0 0 7 18z" />
            <path d="M10 13.5l2-2 2 2M12 11.5v4" />
          </g>
        )}
        {name === 'office' && (
          <g {...s}>
            <path d="M7 3.5h7l4 4v13H7z" />
            <path d="M14 3.5v4h4M9.5 12h6M9.5 15h6M9.5 18h4" />
          </g>
        )}
        {name === 'meeting' && (
          <g {...s}>
            <rect x="3.5" y="7" width="12" height="10" rx="2" />
            <path d="M15.5 10.5l5-3v9l-5-3" />
          </g>
        )}
        {name === 'updater' && (
          <g {...s}>
            <path d="M19 12a7 7 0 0 1-12 5M5 12a7 7 0 0 1 12-5" />
            <path d="M17 3.5V7h-3.5M7 20.5V17h3.5" />
          </g>
        )}
        {name === 'utility' && (
          <g {...s}>
            <path d="M12 3.5l7 3v5c0 4.2-3 7.6-7 9-4-1.4-7-4.8-7-9v-5z" />
            <path d="M9 12l2 2 4-4" />
          </g>
        )}
      </svg>
    </div>
  );
};

/* ---------- Windows 11-style desktop (drawn, generic: no Microsoft logo) ---------- */
export const DesktopScreen: React.FC<{w: number; h: number; booting?: number}> = ({w, h, booting = 0}) => {
  const tb = h * 0.1;
  return (
    <div
      style={{
        width: w,
        height: h,
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(120% 90% at 50% 115%, #1e3a8a 0%, rgba(30,58,138,0) 55%), radial-gradient(60% 70% at 50% 62%, #60a5fa 0%, #2563eb 38%, rgba(37,99,235,0) 70%), linear-gradient(180deg, #0b1f4d 0%, #1d4ed8 60%, #93c5fd 100%)',
      }}
    >
      {/* soft "bloom" petals */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: w * (0.32 + i * 0.06),
            top: h * (0.3 + i * 0.03),
            width: w * 0.3,
            height: h * 0.42,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(191,219,254,.55) 0%, rgba(191,219,254,0) 70%)',
            transform: `rotate(${-30 + i * 30}deg)`,
          }}
        />
      ))}
      {/* centered taskbar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: tb,
          background: 'rgba(240,244,255,.82)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: tb * 0.3,
        }}
      >
        {/* generic start glyph (four rounded tiles, not the Windows logo) */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tb * 0.06}}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{width: tb * 0.2, height: tb * 0.2, borderRadius: tb * 0.05, background: '#3b82f6'}} />
          ))}
        </div>
        {['#94a3b8', '#60a5fa', '#f59e0b', '#22c55e', '#a78bfa'].map((c, i) => (
          <div key={i} style={{width: tb * 0.46, height: tb * 0.46, borderRadius: tb * 0.12, background: c, opacity: 0.9}} />
        ))}
      </div>
      {/* boot overlay */}
      {booting > 0 && (
        <div style={{position: 'absolute', inset: 0, background: `rgba(5,10,30,${0.65 * booting})`}} />
      )}
    </div>
  );
};

/* ---------- The PC: monitor + plain dark tower ---------- */
export const PcSetup: React.FC<{scale?: number; booting?: number}> = ({scale = 1, booting = 0}) => {
  const frame = useCurrentFrame();
  const led = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 14 * scale}}>
      {/* monitor */}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
          style={{
            padding: 7 * scale,
            paddingBottom: 9 * scale,
            borderRadius: 10 * scale,
            background: '#0f1115',
            boxShadow: '0 10px 24px -12px rgba(15,23,41,.6)',
          }}
        >
          <DesktopScreen w={232 * scale} h={138 * scale} booting={booting} />
        </div>
        <div style={{width: 18 * scale, height: 22 * scale, background: 'linear-gradient(#2a2d33,#16181c)'}} />
        <div style={{width: 92 * scale, height: 7 * scale, borderRadius: 4 * scale, background: '#1b1d22'}} />
      </div>
      {/* tower */}
      <div
        style={{
          width: 84 * scale,
          height: 176 * scale,
          borderRadius: 8 * scale,
          background: 'linear-gradient(180deg,#24272d 0%,#121418 100%)',
          boxShadow: '0 12px 26px -12px rgba(15,23,41,.7), inset 0 0 0 1px rgba(255,255,255,.05)',
          position: 'relative',
        }}
      >
        {/* front vents */}
        <div style={{position: 'absolute', left: 12 * scale, right: 12 * scale, top: 40 * scale, display: 'flex', flexDirection: 'column', gap: 6 * scale}}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} style={{height: 3 * scale, borderRadius: 2, background: 'rgba(255,255,255,.07)'}} />
          ))}
        </div>
        {/* power button + LED */}
        <div
          style={{
            position: 'absolute',
            top: 14 * scale,
            left: '50%',
            width: 12 * scale,
            height: 12 * scale,
            marginLeft: -6 * scale,
            borderRadius: 6 * scale,
            border: `${1.5 * scale}px solid rgba(255,255,255,.25)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 30 * scale,
            left: '50%',
            width: 14 * scale,
            height: 2 * scale,
            marginLeft: -7 * scale,
            borderRadius: 2,
            background: `rgba(96,165,250,${led})`,
          }}
        />
      </div>
    </div>
  );
};

/* ---------- Case file panel: the PC + its specs + the symptom ---------- */
export const CaseFilePanel: React.FC<{
  at: number;
  caseNo: string;
  symptom: string;
  specs: {label: string; value: string}[];
}> = ({at, caseNo, symptom, specs}) => {
  const p = useSpring(at, {damping: 16, stiffness: 150, mass: 0.7});
  return (
    <div
      style={{
        width: 1000,
        height: 210,
        borderRadius: 36,
        background: 'rgba(255,255,255,.96)',
        border: `1px solid ${C.line}`,
        boxShadow: '0 2px 4px rgba(15,23,41,.05), 0 24px 60px -24px rgba(15,23,41,.28)',
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        padding: '0 30px 0 24px',
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px)`,
        fontFamily: SANS,
      }}
    >
      <div style={{flexShrink: 0}}>
        <PcSetup scale={0.78} />
      </div>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <span style={{fontSize: 20, fontWeight: 800, letterSpacing: 2.6, color: C.mute}}>CASE {caseNo} · THIS PC</span>
        </div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          {specs.map((s, i) => (
            <SpecChip key={s.label} text={s.value} at={at + 6 + i * 5} />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 28,
            fontWeight: 800,
            color: C.amber,
          }}
        >
          <span style={{width: 12, height: 12, borderRadius: 6, background: C.amber}} />
          {symptom}
        </div>
      </div>
    </div>
  );
};

const SpecChip: React.FC<{text: string; at: number}> = ({text, at}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 6], [0, 1], clamp);
  return (
    <span
      style={{
        fontSize: 27,
        fontWeight: 800,
        letterSpacing: 0.4,
        color: C.navy,
        background: C.page2,
        border: `1.5px solid ${C.line2}`,
        borderRadius: 14,
        padding: '8px 14px',
        opacity: o,
        transform: `translateY(${(1 - o) * 10}px)`,
        textTransform: 'uppercase',
      }}
    >
      {text}
    </span>
  );
};
