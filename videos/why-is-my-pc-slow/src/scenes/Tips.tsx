import React from 'react';
import { interpolate } from 'remotion';
import { edu, FONT } from '../edu/theme';
import { TipLayout } from '../edu/TipLayout';
import { Card } from '../edu/Stage';
import { KineticLines, Label, Takeaway } from '../edu/Kinetic';
import { lerp, pop, ramp } from '../edu/motion';
import {
  AppGlyph,
  IconArrowDown,
  IconChip,
  IconDrive,
  IconLayers,
  IconMonitor,
  IconSearch,
  IconSplit,
  IconStartup,
  IconWindow,
} from '../edu/icons';
import { S, E } from '../timeline';

type SceneProps = { t: number; dur: number; t0: number };

const txt = (size: number, weight: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FONT,
  fontSize: size,
  fontWeight: weight,
  color,
  letterSpacing: '-0.012em',
  ...extra,
});

/* ───────────────────────────── 01 STARTUP APPS ───────────────────────────── */

const STARTUP = [
  { name: 'Game launcher', kind: 'game', bg: '#3B4AA8' },
  { name: 'Chat app', kind: 'chat', bg: '#5865D8' },
  { name: 'Cloud sync', kind: 'cloud', bg: '#2E86DE' },
  { name: 'Updater', kind: 'update', bg: '#16A574' },
  { name: 'Music app', kind: 'music', bg: '#D9488F' },
] as const;

export const Tip1: React.FC<SceneProps> = ({ t, dur, t0 }) => {
  const b = S('t1b') - t0;
  const pill = pop(t, 0.9, 15);
  const arrow = ramp(t, b + 0.2, b + 0.5);
  const stampAt = E('t1b') - t0 - 1.3;
  return (
    <TipLayout n={1} title={['STARTUP APPS']} icon={<IconStartup size={60} />} t={t} dur={dur}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '20px 36px',
            borderRadius: 999,
            background: edu.ink,
            color: '#fff',
            opacity: pill,
            transform: `scale(${0.85 + pill * 0.15})`,
          }}
        >
          <IconStartup size={40} color="#B9B6FF" />
          <span style={txt(40, 800, '#fff', { letterSpacing: '0.08em' })}>WINDOWS STARTS</span>
        </div>
        <div style={{ height: 58, display: 'flex', alignItems: 'center', color: edu.accent, opacity: arrow, transform: `translateY(${(1 - arrow) * -14}px)` }}>
          <IconArrowDown size={54} stroke={2.4} />
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STARTUP.map((a, j) => {
            const at = b + 0.55 + j * 0.16;
            const p = pop(t, at, 13, 0.55);
            const load = ramp(t, at + 0.1, at + 2.2 + j * 0.3);
            return (
              <Card
                key={a.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  padding: '10px 22px',
                  borderRadius: 22,
                  opacity: p,
                  transform: `translateY(${(1 - p) * -40}px) scale(${0.92 + p * 0.08})`,
                }}
              >
                <AppGlyph kind={a.kind} bg={a.bg} size={52} />
                <div style={{ flex: 1 }}>
                  <div style={txt(36, 700, edu.ink)}>{a.name}</div>
                </div>
                <div style={{ width: 230, height: 14, borderRadius: 8, background: edu.bg2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${load * 100}%`, background: edu.grad, borderRadius: 8 }} />
                </div>
                <span style={txt(26, 700, edu.ink3, { width: 110, textAlign: 'right' })}>{load < 1 ? 'loading' : 'running'}</span>
              </Card>
            );
          })}
        </div>
        <div style={{ marginTop: 22, height: 130, display: 'flex', alignItems: 'center' }}>
          <Takeaway t={t} at={stampAt} lines={['TOO MUCH AT ONCE.']} tone="amber" />
        </div>
      </div>
    </TipLayout>
  );
};

/* ──────────────────────────── 02 BACKGROUND APPS ─────────────────────────── */

const BG = [
  { name: 'Cloud sync', kind: 'cloud', bg: '#2E86DE', cpu: 6, ram: 410 },
  { name: 'Game launcher', kind: 'game', bg: '#3B4AA8', cpu: 4, ram: 620 },
  { name: 'Chat app', kind: 'chat', bg: '#5865D8', cpu: 3, ram: 380 },
  { name: 'Photo backup', kind: 'photo', bg: '#E07B2E', cpu: 8, ram: 290 },
] as const;

export const Tip2: React.FC<SceneProps> = ({ t, dur, t0 }) => {
  const b = S('t2b') - t0;
  const screen = pop(t, 0.6, 15);
  const behind = pop(t, b + 0.25, 15);
  const stampAt = E('t2b') - t0 - 0.6;
  return (
    <TipLayout n={2} title={['BACKGROUND APPS']} titleSize={88} icon={<IconLayers size={60} />} t={t} dur={dur}>
      {/* what you see */}
      <Card style={{ padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 20, opacity: screen, transform: `translateY(${(1 - screen) * 20}px)` }}>
        <span style={{ color: edu.accent }}>
          <IconWindow size={50} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={txt(24, 800, edu.ink3, { letterSpacing: '0.14em' })}>ON YOUR SCREEN</div>
          <div style={txt(38, 800, edu.ink, { marginTop: 2 })}>Just your browser</div>
        </div>
        <AppGlyph kind="browser" bg="#4F5BEA" size={58} />
      </Card>

      {/* what's actually running */}
      <div style={{ marginTop: 18, opacity: behind, transform: `translateY(${(1 - behind) * 24}px)` }}>
        <Card style={{ padding: '20px 26px 16px', background: '#FBFBFE' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: edu.ink3 }}>
                <IconLayers size={34} />
              </span>
              <span style={txt(24, 800, edu.ink3, { letterSpacing: '0.14em' })}>STILL RUNNING IN THE BACKGROUND</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 0, marginTop: 10, paddingRight: 4 }}>
            <span style={txt(22, 800, edu.ink3, { width: 120, textAlign: 'right', letterSpacing: '0.1em' })}>CPU</span>
            <span style={txt(22, 800, edu.ink3, { width: 160, textAlign: 'right', letterSpacing: '0.1em' })}>MEMORY</span>
          </div>
          {BG.map((a, j) => {
            const at = b + 0.5 + j * 0.42;
            const p = pop(t, at, 14);
            const wob = Math.sin(t * 3.2 + j * 1.7);
            const cpu = Math.max(1, Math.round(a.cpu + wob * 2));
            const ram = Math.round(a.ram + Math.sin(t * 1.3 + j) * 18);
            return (
              <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '7px 4px', borderTop: `2px solid ${edu.lineSoft}`, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
                <AppGlyph kind={a.kind} bg={a.bg} size={48} />
                <span style={txt(34, 700, edu.ink, { flex: 1 })}>{a.name}</span>
                <span style={{ width: 120, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                  <span style={{ width: 40, height: 10, borderRadius: 6, background: edu.bg2, overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '100%', width: `${cpu * 7}%`, background: edu.accent }} />
                  </span>
                  <span style={txt(30, 700, edu.ink2, { fontVariantNumeric: 'tabular-nums', width: 54, textAlign: 'right' })}>{cpu}%</span>
                </span>
                <span style={txt(30, 700, edu.ink2, { width: 160, textAlign: 'right', fontVariantNumeric: 'tabular-nums' })}>{ram} MB</span>
              </div>
            );
          })}
        </Card>
      </div>

      <div style={{ position: 'absolute', left: 0, bottom: 0 }}>
        <Takeaway t={t} at={stampAt} size={52} lines={['NOT OPEN', 'DOESN’T ALWAYS MEAN', 'NOT RUNNING.']} />
      </div>
    </TipLayout>
  );
};

/* ───────────────────────────── 03 FREE STORAGE ───────────────────────────── */

const STORAGE = [
  { k: 'Apps', gb: 168, c: '#4F5BEA' },
  { k: 'Downloads', gb: 64, c: '#2E86DE' },
  { k: 'Old installers', gb: 22, c: '#7C5CF0' },
  { k: 'Temporary files', gb: 9, c: '#E39410' },
];
const TOTAL_GB = 476;
const USED_GB = 441;

export const Tip3: React.FC<SceneProps> = ({ t, dur, t0 }) => {
  const a = S('t3a') - t0;
  const b = S('t3b') - t0;
  const fill = ramp(t, a + 0.5, a + 1.45);
  const used = Math.round(USED_GB * fill);
  const pct = used / TOTAL_GB;
  const barColor = pct > 0.85 ? edu.red : pct > 0.7 ? edu.amber : edu.green;
  const drive = pop(t, a + 0.3, 15);
  const qAt = b + 0.55;
  const breakdown = pop(t, b + 0.85, 15);
  const segOther = USED_GB - STORAGE.reduce((s, x) => s + x.gb, 0);
  return (
    <TipLayout n={3} title={['FREE STORAGE']} icon={<IconDrive size={60} />} t={t} dur={dur}>
      <Card style={{ padding: '24px 28px', opacity: drive, transform: `translateY(${(1 - drive) * 20}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: edu.ink2 }}>
            <IconDrive size={44} />
          </span>
          <span style={txt(34, 800, edu.ink, { flex: 1 })}>Local Disk (C:)</span>
          <span style={txt(34, 800, barColor, { fontVariantNumeric: 'tabular-nums' })}>{Math.round(pct * 100)}% full</span>
        </div>
        <div style={{ marginTop: 18, height: 38, borderRadius: 14, background: edu.bg2, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${pct * 100}%`, background: barColor, borderRadius: 14 }} />
          {/* 85% caution marker */}
          <div style={{ position: 'absolute', left: '85%', top: 0, bottom: 0, width: 3, background: 'rgba(14,18,34,0.25)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <span style={txt(28, 600, edu.ink2, { fontVariantNumeric: 'tabular-nums' })}>{used} GB used</span>
          <span style={txt(28, 700, edu.ink, { fontVariantNumeric: 'tabular-nums' })}>{TOTAL_GB - used} GB free</span>
        </div>
      </Card>

      <div style={{ marginTop: 28 }}>
        <KineticLines t={t} at={qAt} size={68} lines={['WHAT’S USING', { text: 'YOUR STORAGE?', accent: true }]} />
      </div>

      <Card style={{ marginTop: 16, padding: '22px 28px 18px', opacity: breakdown, transform: `translateY(${(1 - breakdown) * 20}px)` }}>
        <div style={{ display: 'flex', height: 26, borderRadius: 10, overflow: 'hidden', background: edu.bg2 }}>
          {STORAGE.map((s, j) => {
            const p = ramp(t, b + 1.0 + j * 0.28, b + 1.35 + j * 0.28);
            return <div key={s.k} style={{ width: `${(s.gb / TOTAL_GB) * 100 * p}%`, background: s.c, borderRight: p > 0 ? '3px solid #fff' : 'none' }} />;
          })}
          <div style={{ width: `${(segOther / TOTAL_GB) * 100 * ramp(t, b + 2.2, b + 2.5)}%`, background: '#C9CDD9' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 26, rowGap: 6, marginTop: 14 }}>
          {STORAGE.map((s, j) => {
            const p = pop(t, b + 1.0 + j * 0.28, 15);
            return (
              <div key={s.k} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
                <span style={{ width: 18, height: 18, borderRadius: 5, background: s.c }} />
                <span style={txt(30, 700, edu.ink, { flex: 1 })}>{s.k}</span>
                <span style={txt(28, 700, edu.ink3, { fontVariantNumeric: 'tabular-nums' })}>{s.gb} GB</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `2px solid ${edu.lineSoft}`, display: 'flex', alignItems: 'center', gap: 12, opacity: ramp(t, b + 2.4, b + 2.8) }}>
          <IconSearch size={28} color={edu.accent} />
          <span style={txt(28, 700, edu.ink2)}>Review it first — not everything should go.</span>
        </div>
      </Card>
    </TipLayout>
  );
};

/* ───────────────────────────── 04 CPU + MEMORY ───────────────────────────── */

const PROCS = [
  { name: 'Browser', kind: 'browser', bg: '#4F5BEA', cpu: 7, ram: 1.4 },
  { name: 'Chat app', kind: 'chat', bg: '#5865D8', cpu: 2, ram: 0.4 },
  { name: 'Game launcher', kind: 'game', bg: '#3B4AA8', cpu: 3, ram: 0.6 },
  { name: 'Sync helper', kind: 'cloud', bg: '#2E86DE', cpu: 4, ram: 0.3, outlier: { cpu: 62, ram: 2.8 } },
  { name: 'Music app', kind: 'music', bg: '#D9488F', cpu: 1, ram: 0.2 },
] as const;

const ROW_H = 66;

export const Tip4: React.FC<SceneProps> = ({ t, dur, t0 }) => {
  const a = S('t4a') - t0;
  const b = S('t4b') - t0;
  const spikeAt = b + 1.6;
  const spike = ramp(t, spikeAt, spikeAt + 0.9);
  const graphs = pop(t, a + 0.35, 15);
  const table = pop(t, b + 0.05, 15);
  const stampAt = E('t4b') - t0 - 0.45;

  // live CPU line: calm, then the sustained climb
  const N = 40;
  const progress = ramp(t, a + 0.4, b + 3.4, (x) => x);
  const pts = Array.from({ length: N }).map((_, i) => {
    const x = i / (N - 1);
    const calm = 18 + Math.sin(i * 1.3) * 5 + Math.sin(i * 0.37) * 4;
    const climb = x > 0.62 ? (x - 0.62) / 0.38 : 0;
    return { x, y: calm + climb * 52 };
  });
  const shown = Math.max(2, Math.floor(progress * N));
  const path = pts
    .slice(0, shown)
    .map((p, i) => `${i ? 'L' : 'M'}${(p.x * 420).toFixed(1)},${(130 - p.y * 1.5).toFixed(1)}`)
    .join(' ');
  const cpuNow = Math.round(pts[shown - 1].y);
  const memPct = Math.round(lerp(spike, 58, 79));

  // rows sorted by current CPU — the outlier rises to the top
  const rows = PROCS.map((p) => {
    const o = 'outlier' in p ? p.outlier : undefined;
    return { ...p, c: o ? lerp(spike, p.cpu, o.cpu) : p.cpu, r: o ? lerp(spike, p.ram, o.ram) : p.ram, isOut: !!o };
  });
  const order = [...rows].sort((x, y) => y.c - x.c);

  return (
    <TipLayout n={4} title={['CPU + MEMORY']} icon={<IconChip size={60} />} t={t} dur={dur}>
      <div style={{ display: 'flex', gap: 18, opacity: graphs, transform: `translateY(${(1 - graphs) * 20}px)` }}>
        <Card style={{ flex: 1.45, padding: '18px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={txt(24, 800, edu.ink3, { letterSpacing: '0.14em' })}>CPU</span>
            <span style={txt(38, 800, cpuNow > 50 ? edu.red : edu.ink, { fontVariantNumeric: 'tabular-nums' })}>{cpuNow}%</span>
          </div>
          <svg width="100%" height="130" viewBox="0 0 420 130" preserveAspectRatio="none" style={{ marginTop: 6, display: 'block' }}>
            {[30, 65, 100].map((y) => (
              <line key={y} x1="0" x2="420" y1={y} y2={y} stroke={edu.lineSoft} strokeWidth="2" />
            ))}
            <path d={`${path} L${(pts[shown - 1].x * 420).toFixed(1)},130 L0,130 Z`} fill="rgba(79,91,234,0.10)" />
            <path d={path} fill="none" stroke={cpuNow > 50 ? edu.red : edu.accent} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </Card>
        <Card style={{ flex: 1, padding: '18px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={txt(24, 800, edu.ink3, { letterSpacing: '0.14em' })}>MEMORY</span>
            <span style={txt(38, 800, memPct > 75 ? edu.amber : edu.ink, { fontVariantNumeric: 'tabular-nums' })}>{memPct}%</span>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 6, height: 116, alignItems: 'flex-end' }}>
            {Array.from({ length: 10 }).map((_, i) => {
              const on = i < Math.round(memPct / 10);
              return <div key={i} style={{ flex: 1, height: '100%', borderRadius: 6, background: on ? (memPct > 75 && i >= 7 ? edu.amber : edu.accent2) : edu.bg2 }} />;
            })}
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 18, padding: '14px 24px 10px', opacity: table, transform: `translateY(${(1 - table) * 20}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0 8px' }}>
          <span style={txt(22, 800, edu.ink3, { flex: 1, letterSpacing: '0.12em' })}>PROCESS</span>
          <span style={txt(22, 800, edu.ink3, { width: 150, textAlign: 'right', letterSpacing: '0.12em' })}>CPU</span>
          <span style={txt(22, 800, edu.ink3, { width: 170, textAlign: 'right', letterSpacing: '0.12em' })}>MEMORY</span>
        </div>
        <div style={{ position: 'relative', height: ROW_H * PROCS.length }}>
          {rows.map((r, i) => {
            const idx = order.indexOf(r);
            const y = interpolate(spike, [0, 1], [i, idx]) * ROW_H;
            const hot = r.isOut ? spike : 0;
            return (
              <div
                key={r.name}
                style={{
                  position: 'absolute',
                  left: -12,
                  right: -12,
                  top: y,
                  height: ROW_H - 6,
                  padding: '0 12px',
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: hot ? `rgba(224,69,75,${0.1 * hot})` : 'transparent',
                  boxShadow: hot ? `inset 0 0 0 ${2 * hot}px rgba(224,69,75,0.55)` : 'none',
                  zIndex: r.isOut ? 2 : 1,
                }}
              >
                <AppGlyph kind={r.kind} bg={r.bg} size={44} />
                <span style={txt(32, 700, edu.ink, { flex: 1 })}>{r.name}</span>
                <span style={txt(32, 800, hot > 0.5 ? edu.red : edu.ink2, { width: 150, textAlign: 'right', fontVariantNumeric: 'tabular-nums' })}>{Math.round(r.c)}%</span>
                <span style={txt(32, 700, hot > 0.5 ? edu.red : edu.ink2, { width: 170, textAlign: 'right', fontVariantNumeric: 'tabular-nums' })}>{r.r.toFixed(1)} GB</span>
              </div>
            );
          })}
        </div>
        <div style={{ borderTop: `2px solid ${edu.lineSoft}`, paddingTop: 10, marginTop: 2, opacity: ramp(t, spikeAt + 0.9, spikeAt + 1.3) }}>
          <span style={txt(26, 600, edu.ink2)}>A quick spike is normal. Usage that <b style={{ color: edu.ink }}>stays</b> high is worth a look.</span>
        </div>
      </Card>

      <div style={{ position: 'absolute', left: 0, bottom: 0 }}>
        <Takeaway t={t} at={stampAt} lines={['LOOK FOR THE OUTLIER.']} />
      </div>
    </TipLayout>
  );
};

/* ─────────────────────── 05 ONE APP OR THE WHOLE PC? ─────────────────────── */

const MiniScreen: React.FC<{ mode: 'one' | 'all'; t: number }> = ({ mode, t }) => {
  const spin = (t * 300) % 360;
  const win = (slow: boolean, x: number, y: number, w: number, h: number, key: number) => (
    <div
      key={key}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 10,
        background: slow ? edu.redSoft : '#fff',
        border: `2.5px solid ${slow ? edu.red : edu.line}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {slow && (
        <svg width="34" height="34" viewBox="0 0 24 24" style={{ transform: `rotate(${spin}deg)` }}>
          <circle cx="12" cy="12" r="9" fill="none" stroke={edu.red} strokeOpacity="0.25" strokeWidth="3" />
          <path d="M12 3a9 9 0 019 9" fill="none" stroke={edu.red} strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
  const all = mode === 'all';
  return (
    <div style={{ position: 'relative', width: 300, height: 196, margin: '0 auto' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: all ? '#FFF6F6' : edu.bg, border: `4px solid ${edu.ink}` }} />
      {win(true, 22, 22, 130, 84, 0)}
      {win(all, 166, 22, 112, 84, 1)}
      {win(all, 22, 118, 256, 56, 2)}
    </div>
  );
};

export const Tip5: React.FC<SceneProps> = ({ t, dur, t0 }) => {
  const a = S('t5a') - t0;
  const b = S('t5b') - t0;
  const splitAt = a + 1.6;
  const left = pop(t, splitAt, 15);
  const right = pop(t, splitAt + 0.25, 15);
  const lRes = pop(t, b - 0.1, 14);
  const rRes = pop(t, b + 0.8, 14);
  const col = (side: 'one' | 'all', p: number, res: number) => {
    const one = side === 'one';
    return (
      <Card style={{ flex: 1, padding: '22px 20px 22px', opacity: p, transform: `translateY(${(1 - p) * 30}px)`, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
          <span style={{ color: edu.ink }}>{one ? <IconWindow size={40} /> : <IconMonitor size={40} />}</span>
          <span style={txt(40, 800, edu.ink, { letterSpacing: '0.02em' })}>{one ? 'ONE APP' : 'WHOLE PC'}</span>
        </div>
        <div style={{ transform: 'scale(1.1)', transformOrigin: 'top center', height: 196 * 1.1 }}>
          <MiniScreen mode={side} t={t} />
        </div>
        <div style={txt(30, 700, edu.red, { textAlign: 'center', marginTop: 16 })}>{one ? 'Only this app is slow' : 'Everything is slow'}</div>
        <div style={{ display: 'flex', justifyContent: 'center', color: edu.accent, height: 54, alignItems: 'center', opacity: res, transform: `translateY(${(1 - res) * -10}px)` }}>
          <IconArrowDown size={46} stroke={2.4} />
        </div>
        <div
          style={{
            borderRadius: 20,
            padding: '20px 18px',
            background: one ? edu.accentSoft : edu.ink,
            opacity: res,
            transform: `scale(${0.9 + res * 0.1})`,
            minHeight: 170,
          }}
        >
          <div style={txt(24, 800, one ? edu.accent : '#B9B6FF', { letterSpacing: '0.12em' })}>NEXT STEP</div>
          <div style={txt(38, 800, one ? edu.ink : '#fff', { lineHeight: 1.1, marginTop: 6 })}>{one ? 'Troubleshoot that app' : 'Investigate the system'}</div>
          {!one && (
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {['01', '02', '03', '04'].map((n, i) => (
                <span
                  key={n}
                  style={{
                    ...txt(24, 800, '#fff'),
                    padding: '5px 10px',
                    borderRadius: 9,
                    background: 'rgba(255,255,255,0.14)',
                    opacity: ramp(t, b + 1.0 + i * 0.12, b + 1.25 + i * 0.12),
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          )}
          {one && <div style={txt(28, 600, edu.ink2, { marginTop: 12, lineHeight: 1.25 })}>Start with the app itself.</div>}
        </div>
      </Card>
    );
  };
  return (
    <TipLayout n={5} title={['ONE APP', 'OR THE WHOLE PC?']} titleSize={84} icon={<IconSplit size={60} />} t={t} dur={dur} diagramTop={772}>
      <div style={{ display: 'flex', gap: 22, height: '100%' }}>
        {col('one', left, lRes)}
        {col('all', right, rRes)}
      </div>
    </TipLayout>
  );
};
