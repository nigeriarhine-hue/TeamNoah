import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import timing from '../../public/vo/mac-cleaner/timing.json';
import {MacWindow} from '../components/MacWindow';
import {Caption, clamp, NoahMark, useSpring} from '../components/ui';
import {AURORA, C, MONO, SANS} from '../theme';
import {MacScene} from './MacAiHomework';

// Short: "Do You Actually Need a Mac Cleaner App?" (script 4 in drafts/noah-mac-shorts-scripts.md).
// No on-screen host. Voice placed with tools/build_short_vo.py into public/vo/mac-cleaner/.
// The scareware pop-up is a generic mock-up: no real product, brand or domain (".example").
// Layout stays inside the mobile safe area: x 60–920, y 150–1500.

const L = timing.lines;
const f = (s: number) => Math.round(s * 30);
const at = (i: number, frac: number) => Math.round(L[i].startFrame + frac * (L[i].endFrame - L[i].startFrame));
const pause = (i: number, k: number, frac: number) => (L[i].pauses[k] !== undefined ? f(L[i].pauses[k]) : at(i, frac));

export const MAC_CLEANER_FRAMES = timing.totalFrames;

const T = {
  popup: 0,
  nope: L[1].startFrame,
  tactics: L[2].startFrame - 4,
  list: L[3].startFrame - 4,
  item: [L[4].startFrame, L[5].startFrame, L[6].startFrame, L[7].startFrame],
  sayNo: pause(7, 0, 0.45),
  noThanksClick: pause(7, 0, 0.45) + 22,
  noah: L[8].startFrame - 4,
  notarized: pause(8, 0, 0.5),
  end: L[9].startFrame - 4,
  loop: L[10].startFrame - 6,
  closeClick: L[10].endFrame - 4,
  total: timing.totalFrames,
};

const CAPTIONS: {text: string; from: number; to: number; emphasis?: string[]}[] = [
  {text: 'Some Mac cleaner apps scare you first, and explain never.', from: L[2].startFrame, to: L[2].endFrame + 6, emphasis: ['scare', 'explain', 'never.']},
  {text: 'Here’s what you actually want instead.', from: L[3].startFrame, to: L[3].endFrame + 6, emphasis: ['actually']},
  {text: 'One: it shows you exactly what it’ll do, before it does it.', from: L[4].startFrame, to: L[4].endFrame + 6, emphasis: ['before']},
  {text: 'Two: nothing gets erased. Cleared files go to the Trash.', from: L[5].startFrame, to: L[5].endFrame + 6, emphasis: ['Trash.']},
  {text: 'Three: a log of every change.', from: L[6].startFrame, to: L[6].endFrame + 6, emphasis: ['every']},
  {text: 'Four: no fake alarms. And you can always say no.', from: L[7].startFrame, to: L[7].endFrame + 6, emphasis: ['say', 'no.']},
  {text: 'That’s how Noah works. It’s notarized by Apple.', from: L[8].startFrame, to: L[8].endFrame + 6, emphasis: ['Noah']},
  {text: 'Noah for Mac. Free to start.', from: L[9].startFrame, to: L[9].endFrame + 8, emphasis: ['Noah']},
  {text: 'And close that pop-up.', from: L[10].startFrame, to: T.total, emphasis: ['close']},
];

/* ======================= realistic macOS-style desktop ======================= */
const Wallpaper: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(70% 45% at 20% 25%, rgba(255,140,90,.85) 0%, rgba(255,140,90,0) 60%),' +
        'radial-gradient(70% 50% at 85% 40%, rgba(124,58,237,.9) 0%, rgba(124,58,237,0) 65%),' +
        'radial-gradient(90% 60% at 40% 85%, rgba(37,99,235,.95) 0%, rgba(37,99,235,0) 70%),' +
        'linear-gradient(160deg,#1E1B4B 0%,#312E81 50%,#0F172A 100%)',
    }}
  />
);

const MenuBar: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 52,
      background: 'rgba(30,30,40,.35)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 26px',
      gap: 26,
      fontFamily: SANS,
      fontSize: 24,
      color: 'white',
    }}
  >
    <span style={{width: 18, height: 18, borderRadius: 9, background: 'white', opacity: 0.9}} />
    <span style={{fontWeight: 800}}>Browser</span>
    {['File', 'Edit', 'View', 'History'].map((m) => (
      <span key={m} style={{opacity: 0.9}}>
        {m}
      </span>
    ))}
    <span style={{flex: 1}} />
    {/* wifi */}
    <svg width={26} height={20} viewBox="0 0 26 20">
      <path d="M13 18l3-3.5a4.5 4.5 0 0 0-6 0zM5.5 10.2a10.5 10.5 0 0 1 15 0M1.5 6a16.5 16.5 0 0 1 23 0" stroke="white" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </svg>
    {/* battery */}
    <svg width={38} height={18} viewBox="0 0 38 18">
      <rect x={1} y={1} width={32} height={16} rx={4} stroke="white" strokeWidth={2} fill="none" />
      <rect x={4} y={4} width={22} height={10} rx={2} fill="white" />
      <rect x={34} y={6} width={3} height={6} rx={1} fill="white" />
    </svg>
    <span style={{fontWeight: 600}}>Thu 9:41</span>
  </div>
);

const Dock: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center'}}>
    <div style={{display: 'flex', gap: 16, padding: '14px 18px', borderRadius: 30, background: 'rgba(255,255,255,.22)', border: '1px solid rgba(255,255,255,.35)', backdropFilter: 'blur(20px)'}}>
      {['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#94A3B8'].map((c, i) => (
        <div key={i} style={{width: 86, height: 86, borderRadius: 22, background: `linear-gradient(160deg, ${c}, ${c}CC)`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4)'}} />
      ))}
    </div>
  </div>
);

/* ---------- browser with the scareware pop-up (generic mock-up) ---------- */
const Scareware: React.FC<{frozen?: boolean; closeAt?: number}> = ({frozen, closeAt}) => {
  const frame = useCurrentFrame();
  const flash = frozen ? 0 : (Math.floor(frame / 6) % 2 === 0 ? 1 : 0);
  const pulse = frozen ? 1 : 1 + 0.05 * Math.sin(frame / 3);
  const secs = Math.max(0, 179 - Math.floor(frame / 30));
  const closing = closeAt !== undefined ? interpolate(frame, [closeAt, closeAt + 10], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)}) : 0;
  return (
    <div style={{position: 'absolute', left: 60, top: 150, width: 860, transform: `scale(${1 - 0.6 * closing})`, opacity: 1 - closing, transformOrigin: '10% 0%'}}>
      {/* browser window */}
      <div style={{borderRadius: 26, overflow: 'hidden', background: '#F5F5F7', boxShadow: '0 40px 90px -30px rgba(0,0,0,.7)'}}>
        <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px', background: '#ECECEF', borderBottom: '1px solid #D4D4D8'}}>
          <div style={{display: 'flex', gap: 10}}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <span key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />
            ))}
          </div>
          <div style={{flex: 1, height: 38, borderRadius: 10, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: SANS, fontSize: 21, color: '#52525B'}}>
            <span style={{color: '#DC2626'}}>⚠ Not secure</span> free-mac-scan.example
          </div>
        </div>
        {/* fake page behind the modal */}
        <div style={{height: 1080, position: 'relative', background: 'linear-gradient(180deg,#FDFDFD,#EDEDED)'}}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{margin: '30px 40px 0', height: 22 + (i % 2) * 12, borderRadius: 8, background: '#DADADF', width: `${70 + ((i * 13) % 25)}%`}} />
          ))}
          <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)'}} />
          {/* modal */}
          <div
            style={{
              position: 'absolute',
              left: 50,
              right: 50,
              top: 80,
              borderRadius: 24,
              background: 'white',
              overflow: 'hidden',
              border: `6px solid ${flash ? '#EF4444' : '#B91C1C'}`,
              boxShadow: flash ? '0 0 60px 10px rgba(239,68,68,.7)' : '0 0 30px 4px rgba(185,28,28,.5)',
              fontFamily: SANS,
            }}
          >
            <div style={{background: flash ? '#EF4444' : '#B91C1C', color: 'white', padding: '20px 26px', fontSize: 40, fontWeight: 800, letterSpacing: 1}}>⚠ WARNING!</div>
            <div style={{padding: '24px 28px 30px'}}>
              <div style={{fontSize: 46, fontWeight: 800, color: '#111', lineHeight: 1.1}}>Your Mac is severely damaged</div>
              <div style={{fontSize: 30, fontWeight: 700, color: '#DC2626', margin: '12px 0 16px'}}>7 threats found on this device</div>
              {['Trojan.Generic.Mac', 'Adware.Tracker.X', 'Spyware.Agent.B'].map((v) => (
                <div key={v} style={{display: 'flex', gap: 12, alignItems: 'center', fontFamily: MONO, fontSize: 24, color: '#3F3F46', margin: '6px 0'}}>
                  <span style={{color: '#DC2626', fontWeight: 800}}>✕</span>
                  {v}
                </div>
              ))}
              <div style={{fontSize: 28, fontWeight: 700, color: '#111', margin: '18px 0'}}>
                Act within <span style={{color: '#DC2626', fontFamily: MONO}}>0{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}</span> or data may be lost
              </div>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: 40,
                  fontWeight: 800,
                  color: 'white',
                  background: 'linear-gradient(180deg,#22C55E,#15803D)',
                  borderRadius: 16,
                  padding: '20px 0',
                  transform: `scale(${pulse})`,
                }}
              >
                CLEAN NOW
              </div>
              <div style={{textAlign: 'center', fontSize: 20, color: '#71717A', marginTop: 12}}>Full scan requires a paid license</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Desktop: React.FC<{children?: React.ReactNode; gray?: number}> = ({children, gray = 0}) => (
  <AbsoluteFill style={{filter: gray ? `grayscale(${gray}) brightness(${1 - 0.25 * gray})` : undefined}}>
    <Wallpaper />
    <MenuBar />
    <Dock />
    {children}
  </AbsoluteFill>
);

/* ---------- Scene 1: hook + "Yeah… no." ---------- */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const gray = interpolate(frame, [T.nope - 2, T.nope + 6], [0, 1], clamp);
  const stamp = useSpring(T.nope + 2, {damping: 9, stiffness: 230, mass: 0.5});
  const out = interpolate(frame, [T.tactics - 4, T.tactics + 6], [1, 0], clamp);
  if (frame > T.tactics + 6) return null;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Desktop gray={gray}>
        <Scareware frozen={frame >= T.nope} />
      </Desktop>
      {frame >= T.nope && (
        <div style={{position: 'absolute', left: 60, right: 160, top: 1250, display: 'flex', justifyContent: 'center'}}>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 110,
              color: 'white',
              backgroundImage: AURORA,
              borderRadius: 26,
              padding: '4px 34px 14px',
              letterSpacing: -2,
              transform: `scale(${0.5 + 0.5 * stamp}) rotate(${-4 + (1 - stamp) * -8}deg)`,
              opacity: Math.min(1, stamp * 1.5),
              boxShadow: '0 20px 50px -14px rgba(79,70,229,.9)',
              display: 'inline-block',
            }}
          >
            YEAH… NO.
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- Scene 2: the tactics ---------- */
const TACTICS = [
  {icon: '⚠️', big: '7 threats found!', small: 'fake virus count', r: -3},
  {icon: '⏱️', big: 'Act within 02:59', small: 'fake countdown', r: 2},
  {icon: '💳', big: 'Buy to fix', small: 'pay before you see anything', r: 2},
  {icon: '🔴', big: 'CLEAN NOW', small: 'no idea what it’ll change', r: -2},
];

const TacticCard: React.FC<{t: (typeof TACTICS)[number]; at: number; i: number}> = ({t, at: a, i}) => {
  const p = useSpring(a, {damping: 11, stiffness: 200, mass: 0.6});
  return (
    <div
      style={{
        position: 'absolute',
        left: i % 2 === 0 ? 60 : 500,
        top: 560 + Math.floor(i / 2) * 330,
        width: 410,
        height: 290,
        borderRadius: 28,
        background: 'white',
        border: '3px solid #FCA5A5',
        boxShadow: '0 24px 50px -20px rgba(15,23,41,.45)',
        padding: '26px 26px',
        fontFamily: SANS,
        transform: `rotate(${t.r}deg) scale(${0.6 + 0.4 * p})`,
        opacity: Math.min(1, p * 1.4),
      }}
    >
      <div style={{fontSize: 56}}>{t.icon}</div>
      <div style={{fontSize: 42, fontWeight: 800, color: '#B91C1C', margin: '8px 0', lineHeight: 1.05}}>{t.big}</div>
      <div style={{fontSize: 26, fontWeight: 700, color: C.ink2}}>{t.small}</div>
      {/* pin */}
      <div style={{position: 'absolute', top: -14, left: '50%', marginLeft: -14, width: 28, height: 28, borderRadius: 14, background: '#EF4444', boxShadow: '0 3px 6px rgba(0,0,0,.3)'}} />
    </div>
  );
};

const Tactics: React.FC = () => {
  const frame = useCurrentFrame();
  const h = useSpring(T.tactics + 2, {damping: 12, stiffness: 190, mass: 0.6});
  const h2 = useSpring(T.tactics + 34, {damping: 12, stiffness: 190, mass: 0.6});
  const out = interpolate(frame, [T.list - 6, T.list + 4], [1, 0], clamp);
  if (frame < T.tactics - 2 || frame > T.list + 4) return null;
  const span = L[2].endFrame - L[2].startFrame;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 170, left: 60, right: 160, textAlign: 'center', fontFamily: SANS, fontWeight: 800, letterSpacing: -2, lineHeight: 1}}>
        <div style={{fontSize: 96, color: '#DC2626', opacity: h, transform: `translateY(${(1 - h) * -20}px)`}}>SCARE FIRST.</div>
        <div style={{fontSize: 96, color: C.navy, opacity: h2, transform: `translateY(${(1 - h2) * -20}px)`, marginTop: 10}}>EXPLAIN NEVER.</div>
      </div>
      {TACTICS.map((t, i) => (
        <TacticCard key={t.big} t={t} i={i} at={T.tactics + 10 + Math.round((i * span) / 5)} />
      ))}
    </AbsoluteFill>
  );
};

/* ---------- Scene 3: the checklist + proof for each item ---------- */
const ITEMS = ['Shows the plan first', 'Trash, not delete', 'Logs every change', 'No fake alarms · you can say no'];

const CheckRow: React.FC<{label: string; on: number; idx: number}> = ({label, on, idx}) => {
  const frame = useCurrentFrame();
  const p = useSpring(on, {damping: 10, stiffness: 220, mass: 0.5});
  const appear = interpolate(frame, [T.list + 6 + idx * 4, T.list + 14 + idx * 4], [0, 1], clamp);
  const active = frame >= on;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '16px 22px',
        borderRadius: 22,
        background: active ? 'white' : 'rgba(255,255,255,.55)',
        border: `2px solid ${active ? 'rgba(13,148,136,.45)' : C.line}`,
        opacity: appear,
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          border: `3px solid ${active ? C.commit : C.line2}`,
          background: active ? C.commit : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 36,
          fontWeight: 800,
        }}
      >
        <span style={{transform: `scale(${active ? p : 0})`}}>✓</span>
      </div>
      <span style={{fontSize: 38, fontWeight: 800, color: active ? C.ink : C.mute, letterSpacing: -0.5}}>{label}</span>
    </div>
  );
};

const PANEL_TOP = 720;

const ProofPlan: React.FC = () => (
  <MacWindow title="Noah" noah width={860}>
    <div style={{padding: '22px 28px 26px', fontFamily: SANS}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <NoahMark size={42} />
        <span style={{fontSize: 34, fontWeight: 800, color: C.ink}}>Can Noah do this?</span>
      </div>
      <div style={{fontSize: 28, fontWeight: 700, color: C.ink, margin: '14px 0 8px'}}>Move 3.2 GB of old caches to the Trash</div>
      {[
        ['Browser cache', '2.1 GB'],
        ['Old app update files', '1.1 GB'],
      ].map(([a, b]) => (
        <div key={a} style={{display: 'flex', justifyContent: 'space-between', fontSize: 25, color: C.ink2, padding: '6px 0', borderBottom: `1px solid ${C.line}`}}>
          <span>• {a}</span>
          <span style={{fontWeight: 700}}>{b}</span>
        </div>
      ))}
      <div style={{fontSize: 24, fontWeight: 700, color: C.commit, margin: '14px 0 18px'}}>Nothing has changed yet.</div>
      <div style={{display: 'flex', gap: 16}}>
        <div style={{flex: 1, textAlign: 'center', fontSize: 28, fontWeight: 700, color: C.ink2, border: `2px solid ${C.line2}`, borderRadius: 18, padding: '14px 0'}}>No thanks</div>
        <div style={{flex: 1, textAlign: 'center', fontSize: 28, fontWeight: 800, color: 'white', backgroundImage: AURORA, borderRadius: 18, padding: '14px 0'}}>Go ahead</div>
      </div>
    </div>
  </MacWindow>
);

const ProofTrash: React.FC<{menuAt: number}> = ({menuAt}) => {
  const frame = useCurrentFrame();
  const menu = interpolate(frame, [menuAt, menuAt + 6], [0, 1], clamp);
  return (
    <MacWindow title="Trash" width={860}>
      <div style={{display: 'flex', fontFamily: SANS, height: 420}}>
        {/* sidebar */}
        <div style={{width: 210, background: '#F3F2EE', borderRight: `1px solid ${C.line}`, padding: '18px 16px', fontSize: 23, color: C.ink2}}>
          <div style={{fontSize: 18, fontWeight: 800, letterSpacing: 2, color: C.mute, marginBottom: 10}}>FAVORITES</div>
          {['Desktop', 'Documents', 'Downloads'].map((x) => (
            <div key={x} style={{padding: '7px 0'}}>📁 {x}</div>
          ))}
          <div style={{padding: '7px 10px', marginTop: 10, borderRadius: 10, background: 'rgba(79,70,229,.12)', color: C.indigo, fontWeight: 800}}>🗑 Trash</div>
        </div>
        {/* list */}
        <div style={{flex: 1, position: 'relative'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '14px 20px', fontSize: 20, fontWeight: 800, color: C.mute, borderBottom: `1px solid ${C.line}`}}>
            <span>NAME</span>
            <span>SIZE</span>
          </div>
          {[
            ['Browser cache', '2.1 GB', true],
            ['Old app update files', '1.1 GB', false],
          ].map(([a, b, sel]) => (
            <div
              key={a as string}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 20px',
                fontSize: 26,
                fontWeight: 600,
                color: sel && menu > 0 ? 'white' : C.ink,
                background: sel && menu > 0 ? '#3B82F6' : 'transparent',
              }}
            >
              <span>📄 {a}</span>
              <span>{b}</span>
            </div>
          ))}
          {/* right-click menu */}
          <div
            style={{
              position: 'absolute',
              left: 170,
              top: 120,
              width: 290,
              borderRadius: 14,
              background: 'rgba(250,250,250,.98)',
              border: '1px solid #D4D4D8',
              boxShadow: '0 18px 40px -12px rgba(0,0,0,.45)',
              padding: 8,
              fontSize: 24,
              opacity: menu,
              transform: `scale(${0.9 + 0.1 * menu})`,
              transformOrigin: '0 0',
            }}
          >
            <div style={{padding: '10px 14px', borderRadius: 8, background: '#3B82F6', color: 'white', fontWeight: 800}}>↩︎ Put Back</div>
            <div style={{padding: '10px 14px', color: C.ink2}}>Delete Immediately…</div>
            <div style={{padding: '10px 14px', color: C.ink2}}>Get Info</div>
          </div>
        </div>
      </div>
    </MacWindow>
  );
};

const ProofLog: React.FC<{from: number}> = ({from}) => {
  const frame = useCurrentFrame();
  const rows = [
    ['9:41', 'Moved 3.2 GB of old caches to the Trash', true],
    ['9:40', 'Checked storage (read-only)', false],
    ['9:39', 'Checked running apps (read-only)', false],
  ] as const;
  return (
    <MacWindow title="Noah · Action Log" noah width={860}>
      <div style={{padding: '18px 26px 22px', fontFamily: SANS}}>
        {rows.map(([t, txt, main], i) => (
          <div
            key={txt}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 6px',
              borderBottom: i < 2 ? `1px solid ${C.line}` : undefined,
              opacity: interpolate(frame, [from + i * 6, from + i * 6 + 6], [0, 1], clamp),
            }}
          >
            <span style={{fontFamily: MONO, fontSize: 22, color: C.mute}}>{t}</span>
            <span style={{fontSize: 28, color: main ? C.commit : C.mute, fontWeight: 800}}>✓</span>
            <span style={{flex: 1, fontSize: 27, fontWeight: main ? 800 : 600, color: main ? C.ink : C.ink2}}>{txt}</span>
            {main && <span style={{fontSize: 21, fontWeight: 700, color: C.indigo}}>Undo</span>}
          </div>
        ))}
      </div>
    </MacWindow>
  );
};

const ProofSayNo: React.FC<{clickAt: number}> = ({clickAt}) => {
  const frame = useCurrentFrame();
  const clicked = frame >= clickAt;
  const press = interpolate(frame, [clickAt - 2, clickAt + 2, clickAt + 8], [0, 1, 0], clamp);
  return (
    <MacWindow title="Noah" noah width={860}>
      <div style={{padding: '22px 28px 26px', fontFamily: SANS}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <NoahMark size={42} />
          <span style={{fontSize: 34, fontWeight: 800, color: C.ink}}>Can Noah do this?</span>
        </div>
        <div style={{fontSize: 28, fontWeight: 700, color: C.ink, margin: '14px 0 20px'}}>Turn off 2 apps that open at login</div>
        {!clicked ? (
          <div style={{display: 'flex', gap: 16}}>
            <div
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 28,
                fontWeight: 800,
                color: C.ink,
                border: `2px solid ${C.ink2}`,
                borderRadius: 18,
                padding: '14px 0',
                transform: `scale(${1 - 0.06 * press})`,
                boxShadow: `0 0 0 ${10 * press}px rgba(60,50,40,.12)`,
              }}
            >
              No thanks
            </div>
            <div style={{flex: 1, textAlign: 'center', fontSize: 28, fontWeight: 800, color: 'white', backgroundImage: AURORA, borderRadius: 18, padding: '14px 0'}}>Go ahead</div>
          </div>
        ) : (
          <div style={{fontSize: 30, fontWeight: 800, color: C.commit, padding: '12px 0'}}>👍 Okay. Nothing changed.</div>
        )}
      </div>
    </MacWindow>
  );
};

const Checklist: React.FC = () => {
  const frame = useCurrentFrame();
  const h = useSpring(T.list, {damping: 14, stiffness: 180, mass: 0.6});
  const out = interpolate(frame, [T.noah - 6, T.noah + 4], [1, 0], clamp);
  if (frame < T.list - 2 || frame > T.noah + 4) return null;
  const idx = T.item.filter((t) => frame >= t).length - 1; // which proof is showing
  const proofIn = idx >= 0 ? interpolate(frame, [T.item[idx], T.item[idx] + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;
  const cursorOn = idx === 3 && frame < T.noThanksClick + 10;
  const cx = interpolate(frame, [T.sayNo, T.noThanksClick], [700, 280], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cy = interpolate(frame, [T.sayNo, T.noThanksClick], [1290, 1012], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 160, left: 60, right: 160, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 52, letterSpacing: -1, color: C.navy, opacity: h}}>
        WHAT YOU <span style={{color: 'white', backgroundImage: AURORA, borderRadius: 14, padding: '0 14px 4px'}}>ACTUALLY</span> WANT
      </div>
      <div style={{position: 'absolute', left: 60, width: 860, top: 250, display: 'flex', flexDirection: 'column', gap: 10}}>
        {ITEMS.map((label, i) => (
          <CheckRow key={label} label={label} on={T.item[i] + 4} idx={i} />
        ))}
      </div>
      {idx >= 0 && (
        <div key={idx} style={{position: 'absolute', left: 60, top: PANEL_TOP, opacity: proofIn, transform: `translateY(${(1 - proofIn) * 60}px)`}}>
          {idx === 0 && <ProofPlan />}
          {idx === 1 && <ProofTrash menuAt={pause(5, 0, 0.45)} />}
          {idx === 2 && <ProofLog from={T.item[2] + 6} />}
          {idx === 3 && <ProofSayNo clickAt={T.noThanksClick} />}
        </div>
      )}
      {cursorOn && frame >= T.sayNo && (
        <svg style={{position: 'absolute', left: cx, top: cy}} width={46} height={56} viewBox="0 0 23 28">
          <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18 15.8 Z" fill="white" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      )}
    </AbsoluteFill>
  );
};

/* ---------- Scene 4: that's how Noah works ---------- */
const NoahCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(T.noah + 2, {damping: 14, stiffness: 170, mass: 0.7});
  const badge = useSpring(T.notarized, {damping: 10, stiffness: 220, mass: 0.5});
  const out = interpolate(frame, [T.end - 6, T.end + 2], [1, 0], clamp);
  if (frame < T.noah - 2 || frame > T.end + 2) return null;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', left: 60, width: 860, top: 260, opacity: p, transform: `translateY(${(1 - p) * 80}px)`}}>
        <MacWindow title="About Noah" width={860}>
          <div style={{padding: '40px 40px 44px', fontFamily: SANS, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
            <Img src={staticFile('brand/noah-appicon-light.svg')} style={{width: 220, height: 220, filter: 'drop-shadow(0 20px 30px rgba(26,29,97,.35))'}} />
            <div style={{fontSize: 64, fontWeight: 800, color: C.ink, letterSpacing: -1.5}}>Noah</div>
            <div style={{fontSize: 30, fontWeight: 600, color: C.ink2}}>Fixes your Mac. Asks first.</div>
            <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10, width: '100%'}}>
              {['Shows the plan first', 'Cleared files go to the Trash', 'Every change in the Action Log', 'No fake alarms. You can say no.'].map((x) => (
                <div key={x} style={{display: 'flex', gap: 14, fontSize: 30, fontWeight: 700, color: C.ink}}>
                  <span style={{color: C.commit}}>✓</span>
                  {x}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 22,
                fontSize: 32,
                fontWeight: 800,
                color: C.commit,
                background: C.commitSoft,
                border: '2px solid rgba(13,148,136,.4)',
                borderRadius: 999,
                padding: '12px 26px',
                transform: `scale(${0.6 + 0.4 * badge})`,
                opacity: Math.min(1, badge * 1.5),
              }}
            >
              ✓ Notarized by Apple
            </div>
          </div>
        </MacWindow>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Scene 5: end card + loop ---------- */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(T.end + 6, {damping: 14, stiffness: 170, mass: 0.7});
  if (frame < T.end || frame >= T.loop + 6) return null;
  const out = interpolate(frame, [T.loop - 2, T.loop + 6], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <MacScene zoomFrom={T.end} zoomTo={T.loop} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', background: 'linear-gradient(180deg,rgba(14,16,48,0),rgba(14,16,48,.85))'}} />
      <div style={{position: 'absolute', left: 60, right: 160, top: 1150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'white', borderRadius: 999, padding: '14px 30px 14px 18px'}}>
          <NoahMark size={64} />
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.ink, letterSpacing: -1}}>Noah for Mac</span>
        </div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: 'white'}}>No scare tactics. Just answers.</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 32, color: '#FCD34D', letterSpacing: 1}}>FREE TO START · onnoah.app</div>
      </div>
    </AbsoluteFill>
  );
};

const Loop: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.loop - 2) return null;
  const cx = interpolate(frame, [T.loop + 4, T.closeClick], [600, 82], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cy = interpolate(frame, [T.loop + 4, T.closeClick], [700, 168], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const fadeIn = interpolate(frame, [T.loop - 2, T.loop + 6], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      <Desktop>
        <Scareware closeAt={T.closeClick + 2} />
      </Desktop>
      <svg style={{position: 'absolute', left: cx, top: cy}} width={46} height={56} viewBox="0 0 23 28">
        <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18 15.8 Z" fill="white" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- captions, sound, background ---------- */
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const line = CAPTIONS.find((c) => frame >= c.from && frame < c.to);
  if (!line) return null;
  const onDark = frame >= T.end;
  const out = interpolate(frame, [line.to - 4, line.to], [1, 0], clamp);
  const top = frame >= T.loop ? 1240 : onDark ? 1420 : frame >= T.noah ? 1290 : frame >= T.list ? 1330 : 1270;
  return (
    <div style={{position: 'absolute', left: 60, right: 160, top, opacity: out}}>
      <Caption key={line.from} text={line.text} from={line.from} emphasis={line.emphasis} size={48} dark={!onDark} />
    </div>
  );
};

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at: a, src, volume = 1}) => (
  <Sequence from={Math.round(a)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const Sound: React.FC = () => (
  <>
    <Audio src={staticFile('sfx/bed.wav')} loop volume={(fr) => (fr < T.nope ? 0.06 : 0.15)} />
    <Audio src={staticFile('vo/mac-cleaner/vo.wav')} />
    {[0, 12, 24, 36, 48, 60].map((d) => (
      <Sfx key={d} at={T.popup + d} src="tock" volume={0.18} />
    ))}
    <Sfx at={T.nope} src="ruleout" volume={0.5} />
    <Sfx at={T.tactics} src="whoosh" volume={0.35} />
    {TACTICS.map((_, i) => (
      <Sfx key={i} at={T.tactics + 10 + Math.round((i * (L[2].endFrame - L[2].startFrame)) / 5)} src="pop" volume={0.35} />
    ))}
    <Sfx at={T.list} src="whoosh" volume={0.35} />
    {T.item.map((t) => (
      <Sfx key={t} at={t + 4} src="blip" volume={0.45} />
    ))}
    <Sfx at={T.noThanksClick} src="pop" volume={0.45} />
    <Sfx at={T.noah} src="whoosh" volume={0.35} />
    <Sfx at={T.notarized} src="reveal" volume={0.45} />
    <Sfx at={T.end - 4} src="whoosh" volume={0.35} />
    <Sfx at={T.closeClick} src="pop" volume={0.5} />
  </>
);

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 40;
  return (
    <AbsoluteFill style={{background: C.page}}>
      <div style={{position: 'absolute', width: 1100, height: 1100, borderRadius: 550, left: -300 + drift, top: 900, background: 'radial-gradient(circle, rgba(99,102,241,.22) 0%, rgba(99,102,241,0) 65%)'}} />
      <div style={{position: 'absolute', width: 1000, height: 1000, borderRadius: 500, right: -360 - drift, top: 1250, background: 'radial-gradient(circle, rgba(139,92,246,.18) 0%, rgba(139,92,246,0) 65%)'}} />
    </AbsoluteFill>
  );
};

export const MacCleaner: React.FC = () => (
  <AbsoluteFill style={{background: C.page}}>
    <Backdrop />
    <Tactics />
    <Checklist />
    <NoahCard />
    <Hook />
    <EndCard />
    <Loop />
    <Captions />
    <Sound />
  </AbsoluteFill>
);

/* ---------- 9:16 thumbnail ---------- */
// Render with: npm run thumb:mac-cleaner
export const MacCleanerThumb: React.FC = () => {
  const head: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, color: 'white', letterSpacing: -3, lineHeight: 0.95, whiteSpace: 'nowrap'};
  return (
    <AbsoluteFill>
      <Wallpaper />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,12,40,.55) 0%, rgba(15,12,40,.1) 30%, rgba(15,12,40,.1) 60%, rgba(15,12,40,.7) 100%)'}} />
      {/* headline */}
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
        <span style={{...head, fontSize: 100}}>DO YOU NEED A</span>
        <span style={{...head, fontSize: 124, color: '#FDE047', textShadow: '0 10px 30px rgba(0,0,0,.35)'}}>MAC CLEANER?</span>
      </div>
      {/* the scareware, tilted */}
      <div style={{position: 'absolute', left: 0, top: 360, width: 1080, height: 900, transform: 'rotate(-4deg) scale(0.86)', transformOrigin: '50% 0%'}}>
        <Scareware frozen />
      </div>
      {/* red flags sticker */}
      <div
        style={{
          position: 'absolute',
          left: 700,
          top: 420,
          width: 300,
          height: 300,
          borderRadius: 150,
          background: '#DC2626',
          border: '10px solid white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(12deg)',
          boxShadow: '0 20px 40px -12px rgba(0,0,0,.55)',
          fontFamily: SANS,
          color: 'white',
        }}
      >
        <span style={{fontSize: 80, lineHeight: 1}}>🚩</span>
        <span style={{fontSize: 46, fontWeight: 800, letterSpacing: 1}}>RED</span>
        <span style={{fontSize: 46, fontWeight: 800, letterSpacing: 1, lineHeight: 0.9}}>FLAGS</span>
      </div>
      {/* Noah: asks first */}
      <div style={{position: 'absolute', left: 60, top: 1250, transform: 'rotate(1.5deg)'}}>
        <MacWindow title="Noah" noah width={960}>
          <div style={{padding: '24px 32px 30px', fontFamily: SANS}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <NoahMark size={50} />
              <span style={{fontSize: 46, fontWeight: 800, color: C.ink}}>Can Noah do this?</span>
            </div>
            <div style={{fontSize: 32, fontWeight: 700, color: C.ink2, margin: '12px 0 22px'}}>Shows the plan. Trash, not delete. You decide.</div>
            <div style={{display: 'flex', gap: 18}}>
              <div style={{flex: 1, textAlign: 'center', fontSize: 34, fontWeight: 700, color: C.ink2, border: `2px solid ${C.line2}`, borderRadius: 20, padding: '18px 0'}}>No thanks</div>
              <div style={{flex: 1, textAlign: 'center', fontSize: 34, fontWeight: 800, color: 'white', backgroundImage: AURORA, borderRadius: 20, padding: '18px 0'}}>Go ahead</div>
            </div>
          </div>
        </MacWindow>
      </div>
      {/* branding */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1775, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.95)', borderRadius: 999, padding: '10px 22px 10px 14px'}}>
          <NoahMark size={42} />
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.ink}}>Noah for Mac</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
