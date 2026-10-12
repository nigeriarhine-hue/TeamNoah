import React from 'react';
import { edu, FONT, SAFE } from '../edu/theme';
import { Stage } from '../edu/Stage';
import { KineticLines } from '../edu/Kinetic';
import { SeriesTag } from '../edu/Series';
import { HOST, HostPlate } from '../edu/Host';
import { inOut, pop, ramp } from '../edu/motion';
import { Key, Shot, toView } from '../noah/Shot';
import { FIVE } from './Hook';
import { S } from '../timeline';

/**
 * 0:41 — the product, for the first time. Everything inside the device frame is
 * a real Noah screenshot; we only move the camera and annotate.
 * Claims stay inside what the captures show: it inspects, it explains what it
 * found, it shows the plan, it asks before acting.
 */

const VW = 1000;
const VH = 860; // full height once results are on screen
const VH_SHORT = 520; // while Noah is still working
const VX = 40;
const VY = 540;

type Phase = { id: string; a: number; b: number };

const Badge: React.FC<{ n: string; x: number; y: number; p: number }> = ({ n, x, y, p }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${p})`,
      opacity: p,
      fontFamily: FONT,
      fontSize: 28,
      fontWeight: 800,
      color: '#fff',
      background: edu.grad,
      padding: '6px 14px',
      borderRadius: 12,
      boxShadow: '0 8px 22px rgba(0,0,0,0.45)',
      zIndex: 5,
    }}
  >
    {n}
  </div>
);

const Ring: React.FC<{ x: number; y: number; w: number; h: number; p: number; color?: string }> = ({ x, y, w, h, p, color = '#9F9BFF' }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 14,
      border: `4px solid ${color}`,
      boxShadow: `0 0 0 6px rgba(159,155,255,${0.18 * p})`,
      opacity: p,
      transform: `scale(${0.96 + 0.04 * p})`,
      zIndex: 4,
    }}
  />
);

export const NoahSection: React.FC<{ t: number; dur: number; t0: number }> = ({ t, dur, t0 }) => {
  const n2 = S('n2') - t0;
  const n3 = S('n3') - t0;
  const n4 = S('n4') - t0;
  const P: Phase[] = [
    { id: 'bridge', a: 0, b: n2 - 0.15 },
    { id: 'ask', a: n2 - 0.15, b: n2 + 0.75 },
    { id: 'steps', a: n2 + 0.75, b: n3 - 0.05 },
    { id: 'checked', a: n3 - 0.05, b: n4 },
    { id: 'plan', a: n4, b: n4 + 1.65 },
    { id: 'approve', a: n4 + 1.65, b: dur + 0.3 },
  ];
  const ph = (id: string) => P.find((p) => p.id === id)!;
  const active = P.find((p) => t >= p.a && t < p.b)?.id ?? 'approve';
  const clickAt = n4 + 2.35;

  // ── camera keys (original screenshot px) ──
  const K: Record<string, Key[]> = {
    ask: [
      { t: ph('ask').a, cam: { x: 355, y: 30, w: 800 } },
      { t: ph('ask').b, cam: { x: 365, y: 45, w: 770 } },
    ],
    steps: [
      { t: ph('steps').a, cam: { x: 370, y: 140, w: 700 } },
      { t: ph('steps').b, cam: { x: 378, y: 150, w: 620 } },
    ],
    checked: [
      { t: ph('checked').a, cam: { x: 380, y: 100, w: 740 } },
      { t: ph('checked').b, cam: { x: 390, y: 110, w: 720 } },
    ],
    plan: [
      { t: ph('plan').a, cam: { x: 390, y: 110, w: 720 } },
      { t: ph('plan').a + 0.6, cam: { x: 385, y: 450, w: 730 } },
    ],
    approve: [
      { t: ph('approve').a, cam: { x: 300, y: 340, w: 580 } },
      { t: ph('approve').a + 1.6, cam: { x: 330, y: 372, w: 520 } },
    ],
  };
  const shotOf: Record<string, 'disk' | 'steps' | 'plan' | 'approve'> = { ask: 'disk', steps: 'steps', checked: 'plan', plan: 'plan', approve: 'approve' };

  const device = pop(t, ph('ask').a - 0.25, 16, 0.75);
  const vh = VH_SHORT + (VH - VH_SHORT) * ramp(t, ph('checked').a - 0.15, ph('checked').a + 0.35);
  const bridgeOut = ramp(t, ph('bridge').b - 0.4, ph('bridge').b);

  // headline per phase
  const heads: Record<string, { lines: (string | { text: string; accent?: boolean })[]; at: number }> = {
    ask: { lines: ['NOAH INSPECTS', { text: 'YOUR PC', accent: true }], at: ph('ask').a },
    steps: { lines: ['NOAH INSPECTS', { text: 'YOUR PC', accent: true }], at: ph('ask').a },
    checked: { lines: ['WHAT NOAH', { text: 'CHECKED', accent: true }], at: ph('checked').a },
    plan: { lines: ['WHAT NOAH', { text: 'WOULD DO', accent: true }], at: ph('plan').a },
    approve: { lines: [{ text: 'YOU DECIDE.', accent: true }], at: ph('approve').a },
  };

  const renderShot = (id: string) => {
    const p = ph(id);
    const vis = inOut(t, p.a, p.b + 0.2, 0.2);
    if (vis <= 0) return null;
    return (
      <div key={id} style={{ position: 'absolute', inset: 0, opacity: vis }}>
        <Shot shot={shotOf[id]} keys={K[id]} t={t} vw={VW} vh={VH} />
      </div>
    );
  };

  // annotation helpers (positions follow the camera)
  const at = (id: string, x: number, y: number) => toView(K[id], t, VW, x, y);
  const sc = (id: string) => {
    const a = at(id, 0, 0);
    const b = at(id, 100, 0);
    return (b.x - a.x) / 100;
  };

  return (
    <Stage t={t} dur={dur} dark glow="rgba(111,106,230,0.22)">
      {/* host at his desk behind the bridge question, handing over to the product */}
      {t < ph('ask').a + 0.4 && (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - ramp(t, ph('ask').a - 0.3, ph('ask').a + 0.3) }}>
          <HostPlate src={HOST.atDesk} t={t} dur={ph('ask').a + 0.4} fx={60} fy={40} zoomFrom={1.05} zoomTo={1.12} drift={-20} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,12,18,0.78) 0%, rgba(11,12,18,0.7) 45%, rgba(11,12,18,0.9) 100%)' }} />
        </div>
      )}
      <div style={{ position: 'absolute', left: SAFE.left, top: 196 }}>
        <SeriesTag dark t={t} />
      </div>

      {/* bridge: the five checks you'd otherwise do by hand */}
      {t < ph('bridge').b && (
        <div style={{ position: 'absolute', left: SAFE.left, right: SAFE.left, top: 380, opacity: 1 - bridgeOut, transform: `translateY(${-bridgeOut * 80}px)` }}>
          <KineticLines t={t} at={0.1} size={112} color="#fff" lines={['DON’T WANT TO', { text: 'CHECK ALL 5', accent: true }, 'MANUALLY?']} />
          <div style={{ marginTop: 54, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FIVE.map(({ n, label, Icon }, i) => {
              const p = pop(t, 0.5 + i * 0.1, 15);
              return (
                <div
                  key={n}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    padding: '14px 22px',
                    borderRadius: 18,
                    background: 'rgba(255,255,255,0.06)',
                    border: '2px solid rgba(255,255,255,0.12)',
                    opacity: p,
                    transform: `translateX(${(1 - p) * -40}px)`,
                    fontFamily: FONT,
                  }}
                >
                  <span style={{ width: 34, height: 34, borderRadius: 9, border: '3px solid rgba(255,255,255,0.4)' }} />
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#B9B6FF' }}>0{n}</span>
                  <Icon size={36} color="#fff" />
                  <span style={{ fontSize: 36, fontWeight: 700, color: '#fff' }}>{label === 'App or PC' ? 'One app or whole PC' : label === 'CPU + RAM' ? 'CPU + memory' : label === 'Storage' ? 'Free storage' : `${label} apps`}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* phase headline */}
      {active !== 'bridge' && (
        <div style={{ position: 'absolute', left: SAFE.left, right: SAFE.left, top: 270 }}>
          <KineticLines key={heads[active].at} t={t} at={heads[active].at} size={active === 'approve' ? 128 : 104} color="#fff" lines={heads[active].lines} />
        </div>
      )}

      {/* the device: real Noah screenshots only */}
      {t >= ph('ask').a - 0.3 && (
        <div
          style={{
            position: 'absolute',
            left: VX,
            top: VY,
            width: VW,
            height: vh,
            borderRadius: 28,
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.14)',
            boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.6)',
            transform: `translateY(${(1 - device) * 500}px) scale(${0.94 + device * 0.06})`,
            opacity: Math.min(1, device * 1.5),
          }}
        >
          {['ask', 'steps', 'checked', 'plan', 'approve'].map(renderShot)}

          {/* steps: map Noah's own checklist to the chapters */}
          {active === 'steps' &&
            [
              { n: '04', y: 194, w: 190 },
              { n: '01', y: 232, w: 245 },
              { n: '03', y: 270, w: 520 },
            ].map((r, i) => {
              const p = pop(t, ph('steps').a + 0.12 + i * 0.18, 15);
              const o = at('steps', 420, r.y - 20);
              const s = sc('steps');
              return (
                <React.Fragment key={r.n}>
                  <Ring x={o.x - 8} y={o.y} w={r.w * s + 16} h={40 * s} p={p} />
                  <Badge n={r.n} x={o.x - 8 + r.w * s + 16 + 34} y={o.y + 20 * s} p={p} />
                </React.Fragment>
              );
            })}

          {/* checked: the result tiles, tied back to the chapters */}
          {active === 'checked' &&
            [
              { n: '01', x: 402, w: 173 },
              { n: '03', x: 576, w: 172 },
              { n: '02', x: 922, w: 174 },
            ].map((r, i) => {
              const p = pop(t, ph('checked').a + 0.35 + i * 0.2, 15);
              const o = at('checked', r.x, 326);
              const s = sc('checked');
              return (
                <React.Fragment key={r.n}>
                  <Ring x={o.x} y={o.y} w={r.w * s} h={104 * s} p={p} />
                  <Badge n={r.n} x={o.x + (r.w * s) / 2} y={o.y + 104 * s + 6} p={p} />
                </React.Fragment>
              );
            })}

          {/* plan: walk the four proposed steps */}
          {active === 'plan' &&
            [512, 577, 642, 707].map((y, i) => {
              const p = inOut(t, ph('plan').a + 0.6 + i * 0.22, ph('plan').b + 0.2, 0.15);
              const o = at('plan', 398, y - 26);
              const s = sc('plan');
              return <Ring key={y} x={o.x} y={o.y} w={490 * s} h={56 * s} p={p} color="rgba(159,155,255,0.9)" />;
            })}

          {/* approval: cursor → Go ahead */}
          {active === 'approve' &&
            (() => {
              const target = at('approve', 599, 589);
              const travel = ramp(t, ph('approve').a + 0.2, clickAt);
              const x = target.x + (1 - travel) * 260;
              const y = target.y + (1 - travel) * 300;
              const pressed = t >= clickAt && t < clickAt + 0.18;
              const rip = ramp(t, clickAt, clickAt + 0.55, (v) => v);
              return (
                <>
                  {t >= clickAt && (
                    <span
                      style={{
                        position: 'absolute',
                        left: target.x - 30,
                        top: target.y - 30,
                        width: 60,
                        height: 60,
                        borderRadius: 99,
                        border: '4px solid #fff',
                        transform: `scale(${1 + rip * 2.6})`,
                        opacity: 1 - rip,
                        zIndex: 6,
                      }}
                    />
                  )}
                  <svg
                    width="62"
                    height="62"
                    viewBox="0 0 24 24"
                    style={{ position: 'absolute', left: x - 8, top: y - 6, zIndex: 7, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.7))', transform: `scale(${pressed ? 0.85 : 1})` }}
                  >
                    <path d="M5 2.5l13.2 7.7-5.8 1.2-2.6 5.6L5 2.5z" fill="#fff" stroke="#14141b" strokeWidth="1.1" strokeLinejoin="round" />
                  </svg>
                </>
              );
            })()}
        </div>
      )}

      {/* "YOU SEE THE PLAN." lands on the plan */}
      {(active === 'plan' || active === 'approve') && (
        <div
          style={{
            position: 'absolute',
            left: SAFE.left,
            top: 1240,
            opacity: active === 'plan' ? ramp(t, ph('plan').a + 0.7, ph('plan').a + 0.9) : 1 - ramp(t, ph('approve').a, ph('approve').a + 0.2),
          }}
        >
          <div style={{ display: 'inline-block', padding: '20px 30px', borderRadius: 20, background: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', fontFamily: FONT, fontSize: 60, fontWeight: 800, letterSpacing: '-0.025em', color: edu.ink, transform: `scale(${0.9 + 0.1 * pop(t, ph('plan').a + 0.7, 13)})` }}>
            YOU SEE THE PLAN.
          </div>
        </div>
      )}
    </Stage>
  );
};
