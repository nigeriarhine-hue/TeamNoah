import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, GRAD } from '../theme';
import { clamp, CursorClick, easeOut } from '../components/primitives';
import { MetricCard } from '../components/MetricCard';
import {
  IconArrowRight,
  IconCheck,
  IconDrive,
  IconLayers,
  IconPackage,
  IconRocket,
  IconShield,
  IconTrash,
} from '../components/Icons';
import { CONTENT_H, CONTENT_W, SectionLabel } from './NoahScreen';

const PAD = 44;
const Pane: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: 'absolute', inset: 0, padding: PAD, ...style }}>{children}</div>
);

const useT = (t?: number) => {
  const frame = useCurrentFrame();
  return t ?? frame;
};

const rise = (t: number, at: number, dist = 24) => {
  const p = interpolate(t, [at, at + 12], [0, 1], { ...clamp, easing: easeOut });
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
};

/* ------------------------------------------------------------------ */
/* Scene 4 — Tell Noah                                                 */
/* ------------------------------------------------------------------ */
export const USER_MESSAGE =
  'My games have been lagging lately. Can you check my PC and see what could be affecting performance?';
export const TELL = { typeStart: 8, cps: 2.3, click: 68 };
const typeEnd = TELL.typeStart + Math.ceil(USER_MESSAGE.length / TELL.cps);
const INPUT = { h: 132, bottom: 40 };
const SEND = { size: 64, x: CONTENT_W - PAD - 18 - 64, y: CONTENT_H - INPUT.bottom - INPUT.h + (INPUT.h - 64) / 2 };

export const UserBubble: React.FC<{ style?: React.CSSProperties; compact?: boolean }> = ({ style, compact }) => (
  <div
    style={{
      marginLeft: 'auto',
      maxWidth: compact ? 560 : 640,
      padding: compact ? '14px 20px' : '20px 26px',
      borderRadius: 22,
      borderBottomRightRadius: 6,
      background: '#EEF0FF',
      color: C.ink,
      fontSize: compact ? 18 : 24,
      lineHeight: 1.4,
      fontWeight: 500,
      ...style,
    }}
  >
    {USER_MESSAGE}
  </div>
);

export const NoahTell: React.FC = () => {
  const t = useCurrentFrame();
  const typed = USER_MESSAGE.slice(0, Math.max(0, Math.floor((t - TELL.typeStart) * TELL.cps)));
  const sent = t >= TELL.click + 1;
  const caretOn = Math.floor(t / 8) % 2 === 0;
  const ready = interpolate(t, [typeEnd - 4, typeEnd + 4], [0, 1], clamp);
  const pulse = ready * (0.5 + 0.5 * Math.sin((t - typeEnd) / 3));
  const bubble = interpolate(t, [TELL.click + 1, TELL.click + 12], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Pane>
      <div style={{ ...rise(t, 0), opacity: sent ? 1 - bubble : rise(t, 0).opacity }}>
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -0.8, color: C.ink }}>What's going on with your PC?</div>
        <div style={{ fontSize: 22, color: C.ink2, marginTop: 12, maxWidth: 760, lineHeight: 1.45 }}>
          Describe it in your own words. Noah checks first, explains what it finds, and asks before changing anything.
        </div>
      </div>
      {sent && (
        <div style={{ position: 'absolute', top: PAD, left: PAD, right: PAD }}>
          <div style={{ opacity: bubble, transform: `translateY(${(1 - bubble) * 120}px)` }}>
            <UserBubble />
          </div>
          <div
            style={{
              ...rise(t, TELL.click + 10),
              marginTop: 26,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 22,
              fontWeight: 700,
              color: C.ink,
            }}
          >
            <Dots t={t} />
            Looking into it…
          </div>
        </div>
      )}
      {/* input */}
      <div
        style={{
          position: 'absolute',
          left: PAD,
          right: PAD,
          bottom: INPUT.bottom,
          height: INPUT.h,
          borderRadius: 22,
          border: `2px solid ${typed.length && !sent ? 'rgba(79,70,229,0.55)' : C.line}`,
          background: '#FAFBFE',
          padding: '22px 110px 22px 26px',
          fontSize: 24,
          lineHeight: 1.4,
          color: C.ink,
          boxSizing: 'border-box',
          boxShadow: typed.length && !sent ? '0 0 0 6px rgba(79,70,229,0.08)' : 'none',
        }}
      >
        {sent || !typed.length ? (
          <span style={{ color: '#9AA1B5' }}>What's broken? Tell Noah and hit go.</span>
        ) : (
          <span>
            {typed}
            <span style={{ opacity: caretOn || t < typeEnd ? 1 : 0, color: C.indigo }}>|</span>
          </span>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          left: SEND.x,
          top: SEND.y,
          width: SEND.size,
          height: SEND.size,
          borderRadius: 18,
          background: GRAD,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          transform: `scale(${1 + 0.06 * pulse - (t >= TELL.click && t < TELL.click + 4 ? 0.1 : 0)})`,
          boxShadow: `0 0 ${10 + 30 * pulse}px rgba(99,102,241,${0.25 + 0.45 * pulse})`,
        }}
      >
        <IconArrowRight size={30} stroke={2.6} />
      </div>
      <CursorClick
        appearAt={typeEnd - 6}
        clickAt={TELL.click}
        path={[
          { f: typeEnd - 6, x: CONTENT_W * 0.62, y: CONTENT_H * 0.55 },
          { f: TELL.click - 4, x: SEND.x + 30, y: SEND.y + 28 },
        ]}
      />
    </Pane>
  );
};

const Dots: React.FC<{ t: number }> = ({ t }) => (
  <span style={{ display: 'inline-flex', gap: 5 }}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 9,
          height: 9,
          borderRadius: 5,
          background: C.indigo,
          opacity: 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t / 3 - i * 1.2)),
        }}
      />
    ))}
  </span>
);

/* ------------------------------------------------------------------ */
/* Scene 5 — Noah starts checking                                      */
/* ------------------------------------------------------------------ */
export const CHECK_STEPS = [
  'Scanning system…',
  'Checking storage…',
  'Analyzing startup apps…',
  'Reviewing background processes…',
  'Looking for game-related files…',
];
export const CHECK_STEP_START = 4;
export const CHECK_STEP_LEN = 8;

export const NoahChecking: React.FC = () => {
  const t = useCurrentFrame();
  const total = CHECK_STEP_START + CHECK_STEPS.length * CHECK_STEP_LEN;
  const prog = interpolate(t, [0, total], [0.04, 1], clamp);
  const R = 70;
  const circ = 2 * Math.PI * R;
  const scanY = ((t * 14) % 760) - 40;
  return (
    <Pane>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scanY,
          height: 80,
          background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.08), transparent)',
        }}
      />
      <UserBubble compact style={{ ...rise(t, 0, 10), opacity: 0.9 }} />
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 34 }}>
        <div style={{ flex: 1, ...rise(t, 2) }}>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -0.8 }}>Checking your PC…</div>
          <div style={{ fontSize: 20, color: C.mute, marginTop: 8 }}>Read-only. Nothing changes during a check.</div>
        </div>
        <svg width={150} height={150} viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={90} cy={90} r={R} stroke="#EDEFF7" strokeWidth={14} fill="none" />
          <circle
            cx={90}
            cy={90}
            r={R}
            stroke="url(#ringGrad)"
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - prog)}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={C.blue} />
              <stop offset="1" stopColor={C.violet} />
            </linearGradient>
          </defs>
          <text
            x={90}
            y={100}
            textAnchor="middle"
            fontSize={30}
            fontWeight={800}
            fill={C.ink}
            style={{ transform: 'rotate(90deg)', transformOrigin: '90px 90px' }}
          >
            {Math.round(prog * 100)}%
          </text>
        </svg>
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CHECK_STEPS.map((s, i) => {
          const st = CHECK_STEP_START + i * CHECK_STEP_LEN;
          const active = t >= st && t < st + CHECK_STEP_LEN;
          const done = t >= st + CHECK_STEP_LEN;
          const vis = interpolate(t, [st - 6, st], [0.35, 1], clamp);
          return (
            <div
              key={s}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '10px 18px',
                borderRadius: 14,
                background: active ? 'rgba(79,70,229,0.07)' : 'transparent',
                fontSize: 24,
                fontWeight: active ? 700 : 500,
                color: done ? C.ink : active ? C.indigo : C.mute,
                opacity: vis,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  background: done ? C.teal : active ? 'transparent' : '#E7E9F2',
                  border: active ? `3px solid ${C.indigo}` : 'none',
                  borderRightColor: active ? 'transparent' : undefined,
                  transform: active ? `rotate(${t * 30}deg)` : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxSizing: 'border-box',
                }}
              >
                {done && <IconCheck size={20} stroke={3} />}
              </div>
              {s}
            </div>
          );
        })}
      </div>
    </Pane>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 6 — Diagnosis summary                                         */
/* ------------------------------------------------------------------ */
const DIAG_BODY =
  'Your PC is low on free storage and has several background apps and startup items. I also found older installers and temporary files that can affect performance.';

export const NoahDiagnosis: React.FC = () => {
  const t = useCurrentFrame();
  const words = DIAG_BODY.split(' ');
  return (
    <Pane style={{ paddingTop: 56 }}>
      <div style={rise(t, 0)}>
        <SectionLabel>Situation</SectionLabel>
      </div>
      <div style={{ fontSize: 62, fontWeight: 800, letterSpacing: -1.4, marginTop: 20, ...rise(t, 3, 30) }}>Here's what I found.</div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 800,
          marginTop: 14,
          color: 'transparent',
          backgroundImage: GRAD,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          ...rise(t, 8, 30),
        }}
      >
        Your PC may be holding back gaming performance.
      </div>
      <div style={{ fontSize: 26, lineHeight: 1.55, color: C.ink2, marginTop: 28, maxWidth: 900 }}>
        {words.map((w, i) => {
          const o = interpolate(t, [14 + i * 0.9, 20 + i * 0.9], [0, 1], clamp);
          return (
            <span key={i} style={{ opacity: o, display: 'inline-block', marginRight: 7, transform: `translateY(${(1 - o) * 8}px)` }}>
              {w}
            </span>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 34 }}>
        {[
          ['Low free storage', C.red],
          ['Busy background', C.red],
          ['Startup load', C.amber],
          ['Leftover files', C.amber],
        ].map(([label, tone], i) => {
          const p = spring({ frame: t - 34 - i * 4, fps: 30, config: { damping: 14, stiffness: 180 } });
          return (
            <div
              key={label}
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                background: `${tone}12`,
                color: tone,
                fontSize: 19,
                fontWeight: 700,
                transform: `scale(${p})`,
                opacity: Math.min(1, p),
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: 5, background: tone }} />
              {label}
            </div>
          );
        })}
      </div>
    </Pane>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 7 — What Noah checked                                         */
/* ------------------------------------------------------------------ */
export const CHECKED_SPOT_START = 24;
export const CHECKED_SPOT_LEN = 9;
const CHECKED = [
  { icon: <IconDrive size={34} />, label: 'Storage Free', value: '42 GB', sub: 'free of 1 TB · 96% full', tone: C.red, bar: 0.96 },
  { icon: <IconRocket size={32} />, label: 'Startup Apps', value: '7 apps', sub: 'Launch every time you boot', tone: C.amber },
  { icon: <IconLayers size={32} />, label: 'Background Apps', value: '12 apps', sub: 'Using CPU & memory', tone: C.red },
  { icon: <IconPackage size={32} />, label: 'Old Installers', value: '3.2 GB', sub: 'Old game installers found', tone: C.amber },
  { icon: <IconTrash size={32} />, label: 'Temp / Cache Data', value: '4.1 GB', sub: 'Temporary files, safe to clear', tone: C.amber },
];

export const NoahChecked: React.FC = () => {
  const t = useCurrentFrame();
  const spotIdx = Math.floor((t - CHECKED_SPOT_START) / CHECKED_SPOT_LEN);
  const spotting = t >= CHECKED_SPOT_START && spotIdx < CHECKED.length;
  const card = (i: number, width: number | string) => {
    const c = CHECKED[i];
    const appear = spring({ frame: t - 4 - i * 4, fps: 30, config: { damping: 16, stiffness: 150 } });
    const hl = spotting && spotIdx === i ? interpolate((t - CHECKED_SPOT_START) % CHECKED_SPOT_LEN, [0, 4], [0, 1], clamp) : 0;
    const bar = c.bar !== undefined ? interpolate(t, [10, 30], [0, c.bar], { ...clamp, easing: easeOut }) : undefined;
    return (
      <MetricCard
        key={c.label}
        {...c}
        bar={bar}
        appear={Math.min(1, appear)}
        highlight={hl}
        dimmed={spotting && spotIdx !== i ? 0.5 : 0}
        width={width}
        vertical={i < 3}
        height={i < 3 ? 232 : 196}
      />
    );
  };
  const w3 = (CONTENT_W - PAD * 2 - 40) / 3;
  const w2 = (CONTENT_W - PAD * 2 - 20) / 2;
  return (
    <Pane style={{ paddingTop: 52 }}>
      <div style={rise(t, 0)}>
        <SectionLabel>What Noah checked</SectionLabel>
        <div style={{ fontSize: 22, color: C.ink2, marginTop: 10 }}>The areas that most often slow down a gaming PC.</div>
      </div>
      <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>{[0, 1, 2].map((i) => card(i, w3))}</div>
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>{[3, 4].map((i) => card(i, w2))}</div>
    </Pane>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 8 — The plan                                                  */
/* ------------------------------------------------------------------ */
export const PLAN = [
  { title: 'Stop unnecessary apps from launching at startup', sub: '4 of 7 startup apps · reversible anytime' },
  { title: 'Reduce background activity', sub: 'Close 7 idle background apps · they still open on demand' },
  { title: 'Clear temporary cache data', sub: '~4.1 GB of temp files · safe to remove' },
  { title: 'Reclaim storage from old installers and files', sub: '~3.2 GB of old game installers · moved to Recycle Bin' },
];

export const NoahPlan: React.FC<{ t?: number }> = ({ t: tOverride }) => {
  const t = useT(tOverride);
  const shimmer = interpolate((t - 44) % 40, [0, 22], [-0.3, 1.3], clamp);
  return (
    <Pane style={{ paddingTop: 50 }}>
      <div style={rise(t, 0)}>
        <SectionLabel>What Noah would do</SectionLabel>
      </div>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PLAN.map((p, i) => {
          const s = interpolate(t, [5 + i * 7, 17 + i * 7], [0, 1], { ...clamp, easing: easeOut });
          return (
            <div
              key={p.title}
              style={{
                display: 'flex',
                gap: 22,
                alignItems: 'center',
                padding: '16px 22px',
                borderRadius: 18,
                border: `1.5px solid ${C.line}`,
                background: '#fff',
                opacity: s,
                transform: `translateX(${(1 - s) * 80}px)`,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  border: `2.5px solid ${C.indigo}`,
                  color: C.indigo,
                  fontWeight: 800,
                  fontSize: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: '0 0 auto',
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 25, fontWeight: 700, color: C.ink }}>{p.title}</div>
                <div style={{ fontSize: 18, color: C.mute, marginTop: 4 }}>{p.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          ...rise(t, 36),
          position: 'relative',
          overflow: 'hidden',
          marginTop: 26,
          height: 70,
          borderRadius: 18,
          background: GRAD,
          color: '#fff',
          fontSize: 24,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          boxShadow: '0 12px 30px rgba(79,70,229,0.35)',
        }}
      >
        Review &amp; approve <IconArrowRight size={26} stroke={2.6} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${shimmer * 100}%`,
            width: 120,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
      </div>
    </Pane>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 9 — Approval                                                  */
/* ------------------------------------------------------------------ */
export const APPROVAL_CLICK = 74;
const MODAL = { w: 660, h: 600 };
const GO = { w: 190, h: 60 };

export const NoahApproval: React.FC = () => {
  const t = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: t - 3, fps, config: { damping: 15, stiffness: 160 } });
  const approved = t >= APPROVAL_CLICK;
  const pulse = t > 36 && !approved ? 0.5 + 0.5 * Math.sin((t - 36) / 3.2) : 0;
  const mx = (CONTENT_W - MODAL.w) / 2;
  const my = (CONTENT_H - MODAL.h) / 2;
  // "Go ahead" button position in content coordinates (for the cursor)
  const goX = mx + MODAL.w - 36 - GO.w;
  const goY = my + MODAL.h - 34 - GO.h;
  const items = ['Stop unnecessary startup apps', 'Reduce background activity', 'Clear temporary cache data', 'Reclaim storage from old installers'];
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: mx,
          top: my,
          width: MODAL.w,
          height: MODAL.h,
          borderRadius: 26,
          background: '#fff',
          boxShadow: '0 40px 100px rgba(10,10,60,0.45)',
          fontFamily: FONT,
          color: C.ink,
          padding: '34px 36px',
          boxSizing: 'border-box',
          transform: `scale(${0.85 + 0.15 * pop})`,
          opacity: Math.min(1, pop * 1.5),
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              background: 'rgba(79,70,229,0.1)',
              color: C.indigo,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconShield size={40} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, marginTop: 16, letterSpacing: -0.6 }}>Can Noah do this?</div>
          <div style={{ fontSize: 21, color: C.ink2, marginTop: 6 }}>Noah needs your OK to continue.</div>
        </div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((it, i) => {
            const o = interpolate(t, [10 + i * 4, 18 + i * 4], [0, 1], clamp);
            return (
              <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, fontWeight: 600, opacity: o }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: C.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconCheck size={18} stroke={3} />
                </div>
                {it}
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 36, right: 36, bottom: 34, display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: C.mute, padding: '0 10px' }}>No thanks</div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              height: GO.h,
              padding: '0 24px',
              borderRadius: 16,
              border: `2px solid ${C.line}`,
              fontSize: 20,
              fontWeight: 700,
              color: C.ink2,
              display: 'flex',
              alignItems: 'center',
              boxSizing: 'border-box',
            }}
          >
            Approve all
          </div>
          <div
            style={{
              width: GO.w,
              height: GO.h,
              borderRadius: 16,
              background: approved ? C.teal : GRAD,
              color: '#fff',
              fontSize: 22,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transform: `scale(${1 + 0.05 * pulse - (t >= APPROVAL_CLICK && t < APPROVAL_CLICK + 4 ? 0.06 : 0)})`,
              boxShadow: `0 0 ${12 + 28 * pulse}px rgba(99,102,241,${0.3 + 0.4 * pulse})`,
            }}
          >
            {approved ? (
              <>
                <IconCheck size={22} stroke={3} /> Approved
              </>
            ) : (
              'Go ahead'
            )}
          </div>
        </div>
      </div>
      <CursorClick
        appearAt={30}
        clickAt={APPROVAL_CLICK}
        path={[
          { f: 30, x: mx + 120, y: my + MODAL.h + 60 },
          { f: 52, x: mx + MODAL.w - 330, y: goY + 30 },
          { f: 68, x: goX + GO.w / 2 - 4, y: goY + GO.h / 2 - 6 },
        ]}
      />
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 10 — Taking action                                            */
/* ------------------------------------------------------------------ */
export const ACTIONS = ['Disabling selected startup apps', 'Closing unnecessary background apps', 'Clearing temporary files', 'Removing old game installers'];
export const ACTION_START = 4;
export const ACTION_LEN = 11;

export const NoahAction: React.FC = () => {
  const t = useCurrentFrame();
  const total = ACTION_START + ACTIONS.length * ACTION_LEN;
  const prog = interpolate(t, [0, total], [0.02, 1], clamp);
  return (
    <Pane style={{ paddingTop: 52 }}>
      <div style={rise(t, 0)}>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 2.4, color: C.teal }}>✓ APPROVED BY YOU · 4 ACTIONS</div>
        <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: -1, marginTop: 12 }}>Making changes…</div>
      </div>
      <div style={{ marginTop: 22, height: 10, borderRadius: 5, background: '#EDEFF7', overflow: 'hidden' }}>
        <div style={{ width: `${prog * 100}%`, height: '100%', background: GRAD, borderRadius: 5 }} />
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ACTIONS.map((a, i) => {
          const st = ACTION_START + i * ACTION_LEN;
          const active = t >= st && t < st + ACTION_LEN;
          const done = t >= st + ACTION_LEN;
          const pop = done ? spring({ frame: t - st - ACTION_LEN, fps: 30, config: { damping: 10, stiffness: 200 } }) : 0;
          return (
            <div
              key={a}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '18px 22px',
                borderRadius: 16,
                background: active ? 'rgba(79,70,229,0.07)' : done ? 'rgba(13,148,136,0.05)' : '#fff',
                border: `1.5px solid ${active ? 'rgba(79,70,229,0.35)' : C.line}`,
                fontSize: 25,
                fontWeight: active ? 700 : 600,
                color: done ? C.ink : active ? C.indigo : C.mute,
                transform: `scale(${active ? 1.015 : 1})`,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  background: done ? C.teal : 'transparent',
                  border: done ? 'none' : `3px solid ${active ? C.indigo : '#D5D9E6'}`,
                  borderRightColor: active ? 'transparent' : undefined,
                  transform: active ? `rotate(${t * 28}deg)` : `scale(${done ? pop : 1})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxSizing: 'border-box',
                }}
              >
                {done && <IconCheck size={22} stroke={3} />}
              </div>
              {a}
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 18, fontWeight: 600, color: done ? C.teal : C.mute }}>{done ? 'Done' : active ? 'Working…' : 'Queued'}</span>
            </div>
          );
        })}
      </div>
    </Pane>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 11 — Results                                                  */
/* ------------------------------------------------------------------ */
export const NoahResult: React.FC = () => {
  const t = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: t - 2, fps, config: { damping: 9, stiffness: 160 } });
  const count = (from: number, to: number, at: number, dp = 1) =>
    interpolate(t, [at, at + 20], [from, to], { ...clamp, easing: easeOut }).toFixed(dp);
  const res = [
    { icon: <IconDrive size={34} />, label: 'Storage Freed', value: `${count(0, 7.3, 16)} GB`, sub: 'Installers + temp files' },
    { icon: <IconRocket size={32} />, label: 'Startup Apps Reduced', value: `7 → ${Math.round(Number(count(7, 3, 20, 2)))}`, sub: 'Reversible anytime' },
    { icon: <IconTrash size={32} />, label: 'Temp Data Cleared', value: `${count(0, 4.1, 24)} GB`, sub: 'Safe cache files only' },
    { icon: <IconLayers size={32} />, label: 'Background Apps Reduced', value: `12 → ${Math.round(Number(count(12, 5, 28, 2)))}`, sub: 'Still open on demand' },
  ];
  const w2 = (CONTENT_W - PAD * 2 - 20) / 2;
  return (
    <Pane style={{ paddingTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            background: C.teal,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${pop})`,
            boxShadow: '0 10px 30px rgba(13,148,136,0.35)',
          }}
        >
          <IconCheck size={44} stroke={3.2} />
        </div>
        <div style={rise(t, 4)}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 2.4, color: C.mute }}>— RESULT</div>
          <div style={{ fontSize: 60, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1 }}>Done.</div>
        </div>
      </div>
      <div style={{ fontSize: 23, lineHeight: 1.5, color: C.ink2, marginTop: 18, maxWidth: 920, ...rise(t, 8) }}>
        Noah freed up storage space, reduced background activity, adjusted selected startup apps, and cleared temporary data. Your PC is in better
        shape for your next game.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 24 }}>
        {res.map((r, i) => {
          const appear = spring({ frame: t - 12 - i * 4, fps, config: { damping: 15, stiffness: 150 } });
          return <MetricCard key={r.label} {...r} tone={C.teal} appear={Math.min(1, appear)} width={w2} height={158} />;
        })}
      </div>
    </Pane>
  );
};

