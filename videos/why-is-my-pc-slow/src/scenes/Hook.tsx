import React from 'react';
import { edu, FONT, SAFE } from '../edu/theme';
import { Stage } from '../edu/Stage';
import { SlowPC } from '../edu/SlowPC';
import { KineticLines } from '../edu/Kinetic';
import { SeriesTag } from '../edu/Series';
import { pop, ramp } from '../edu/motion';
import { IconChip, IconDrive, IconLayers, IconSplit, IconStartup } from '../edu/icons';
import { S } from '../timeline';

export const FIVE = [
  { n: 1, label: 'Startup', Icon: IconStartup },
  { n: 2, label: 'Background', Icon: IconLayers },
  { n: 3, label: 'Storage', Icon: IconDrive },
  { n: 4, label: 'CPU + RAM', Icon: IconChip },
  { n: 5, label: 'App or PC', Icon: IconSplit },
];

/** 0:00 — the slow PC, the question, the promise. No Noah anywhere. */
export const Hook: React.FC<{ t: number; dur: number }> = ({ t, dur }) => {
  const strikeAt = S('hook1') + 1.55; // "...don't start deleting random files"
  const fiveAt = S('hook2') - 0.05;
  const chip = pop(t, strikeAt, 15, 0.6);
  const strike = ramp(t, strikeAt + 0.35, strikeAt + 0.75);
  const chipOut = ramp(t, fiveAt - 0.25, fiveAt);
  return (
    <Stage t={t} dur={dur} dark glow="rgba(111,106,230,0.26)">
      {/* the problem, shown: an app stuck loading, CPU pegged */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 268, display: 'flex', justifyContent: 'center', transform: `scale(${1 + 0.04 * Math.min(1, t / dur)})` }}>
        <SlowPC t={t} width={770} />
      </div>
      <div style={{ position: 'absolute', left: SAFE.left, top: 196 }}>
        <SeriesTag dark t={t} />
      </div>

      {/* the instinct he's warning against */}
      <div style={{ position: 'absolute', left: SAFE.left, top: 870, opacity: chip * (1 - chipOut), transform: `translateY(${(1 - chip) * 20}px)` }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.22)', fontFamily: FONT, color: '#fff' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16M9.5 7V5h5v2M6 7l1 12.5h10L18 7" />
          </svg>
          <span style={{ fontSize: 36, fontWeight: 700, position: 'relative' }}>
            Deleting random files
            <span style={{ position: 'absolute', left: -4, right: -4, top: '54%', height: 5, borderRadius: 3, background: edu.red, transform: `scaleX(${strike})`, transformOrigin: 'left' }} />
          </span>
          <span style={{ fontSize: 34, fontWeight: 800, color: edu.red, opacity: strike }}>✕</span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: SAFE.left, right: SAFE.left, top: 990 }}>
        <KineticLines
          t={t}
          at={0.15}
          size={112}
          color="#fff"
          lines={['WHY IS YOUR PC', { text: 'SO SLOW?', color: '#B9B6FF' }]}
        />
      </div>

      {/* the promise: five checks, previewed as the series' chapter icons */}
      <div style={{ position: 'absolute', left: SAFE.left, right: SAFE.left, top: 1262 }}>
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 52,
              fontWeight: 800,
              letterSpacing: '0.02em',
              color: '#fff',
              transform: `translateY(${(1 - pop(t, fiveAt, 16)) * 110}%)`,
            }}
          >
            <span style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 12, background: edu.grad, marginRight: 14 }}>5</span>
            THINGS TO CHECK FIRST
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 26 }}>
          {FIVE.map(({ n, Icon }, i) => {
            const p = pop(t, fiveAt + 0.25 + i * 0.09, 13, 0.55);
            return (
              <div
                key={n}
                style={{
                  flex: 1,
                  height: 92,
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.10)',
                  border: '2px solid rgba(255,255,255,0.20)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  color: '#fff',
                  fontFamily: FONT,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 26}px) scale(${0.8 + p * 0.2})`,
                }}
              >
                <span style={{ fontSize: 26, fontWeight: 800, color: '#B9B6FF' }}>0{n}</span>
                <Icon size={38} color="#fff" />
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};
