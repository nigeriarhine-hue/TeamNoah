import React from 'react';
import { interpolate } from 'remotion';
import { noah } from '../theme';
import { FONT, NoahLabel, NoahMark } from './Base';

/**
 * The Noah side, built from the real Noah UI: title bar + mark, the
 * "What Noah did" bar, the gradient-topped card, the small-caps section labels,
 * the metric tiles and the numbered plan rows.
 *
 * Nothing here claims a capability Noah does not have: it checks, it reports what
 * it found, it proposes a plan, and it waits to be told to go.
 */

type Mode = 'prompt' | 'check' | 'finding' | 'plan';

const ICON = { w: 26, h: 26, stroke: noah.txt2, fill: 'none', strokeWidth: 1.7 } as const;

/** Generic glyphs for the metric tiles - never the Noah mark. */
const Icons: Record<string, React.FC> = {
  storage: () => (
    <svg width={ICON.w} height={ICON.h} viewBox="0 0 24 24" fill="none" stroke={ICON.stroke} strokeWidth={ICON.strokeWidth}>
      <rect x="2.5" y="5" width="19" height="6" rx="2" />
      <rect x="2.5" y="13" width="19" height="6" rx="2" />
      <circle cx="6.5" cy="8" r="0.9" fill={ICON.stroke} />
      <circle cx="6.5" cy="16" r="0.9" fill={ICON.stroke} />
    </svg>
  ),
  startup: () => (
    <svg width={ICON.w} height={ICON.h} viewBox="0 0 24 24" fill="none" stroke={ICON.stroke} strokeWidth={ICON.strokeWidth} strokeLinecap="round">
      <path d="M12 3v8" />
      <path d="M6.8 6.4a8 8 0 1010.4 0" />
    </svg>
  ),
  background: () => (
    <svg width={ICON.w} height={ICON.h} viewBox="0 0 24 24" fill="none" stroke={ICON.stroke} strokeWidth={ICON.strokeWidth} strokeLinejoin="round">
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3.4 12.5L12 17l8.6-4.5" />
      <path d="M3.4 16.5L12 21l8.6-4.5" />
    </svg>
  ),
  installers: () => (
    <svg width={ICON.w} height={ICON.h} viewBox="0 0 24 24" fill="none" stroke={ICON.stroke} strokeWidth={ICON.strokeWidth} strokeLinejoin="round">
      <path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9z" />
      <path d="M3 7.5L12 12l9-4.5M12 12v9" />
    </svg>
  ),
  temp: () => (
    <svg width={ICON.w} height={ICON.h} viewBox="0 0 24 24" fill="none" stroke={ICON.stroke} strokeWidth={ICON.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9.5 7V5h5v2" />
      <path d="M6 7l1 12.5h10L18 7" />
      <path d="M10.5 10.5v6M13.5 10.5v6" />
    </svg>
  ),
};

const TILES = [
  { k: 'Storage free', v: '38 GB', s: 'of 476 GB — 92% full', icon: 'storage', tone: noah.amber },
  { k: 'Startup apps', v: '9', s: 'launch at every boot', icon: 'startup', tone: noah.amber },
  { k: 'Background apps', v: '~28', s: 'running right now', icon: 'background', tone: noah.amber },
  { k: 'Old installers', v: '~14 GB', s: 'sitting in Downloads', icon: 'installers', tone: noah.amber },
  { k: 'Temp / cache data', v: '~6.2 GB', s: 'safe to clear', icon: 'temp', tone: noah.amber },
];

const STEPS = [
  { h: 'Stop unnecessary startup apps', p: 'Reversible anytime — they still open on demand' },
  { h: 'Reduce background activity', p: 'Only the apps you are not using' },
  { h: 'Clear temporary / cache data', p: 'Safe — apps rebuild what they need' },
  { h: 'Reclaim storage from old installers', p: 'Moves old setup files to Trash' },
];

/**
 * One checked item as a full-width row. Rows rather than a cramped grid: at half
 * frame width a 3-up grid truncates every label, and the label is the whole point.
 */
const Tile: React.FC<{ t: (typeof TILES)[number]; reveal: number; highlight: number }> = ({
  t,
  reveal,
  highlight,
}) => {
  const Icon = Icons[t.icon];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: noah.tile,
        border: `1px solid ${highlight > 0.5 ? noah.indigo : noah.tileLine}`,
        borderRadius: 14,
        padding: '18px 20px',
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 16}px) scale(${1 + highlight * 0.012})`,
        boxShadow: highlight > 0.5 ? `0 0 0 1px ${noah.indigo}55, 0 10px 30px #6d6ae022` : 'none',
      }}
    >
      <span style={{ flexShrink: 0, display: 'flex', opacity: 0.9 }}>
        <Icon />
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: noah.txt,
            letterSpacing: '-0.012em',
            whiteSpace: 'nowrap',
          }}
        >
          {t.k}
        </div>
        <div style={{ fontSize: 19, fontWeight: 500, color: noah.txt3, marginTop: 3, whiteSpace: 'nowrap' }}>
          {t.s}
        </div>
      </div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          color: t.tone,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {t.v}
      </div>
    </div>
  );
};

export const NoahPanel: React.FC<{ mode: Mode; local: number }> = ({ mode, local }) => {
  const fade = (a: number, b: number) =>
    interpolate(local, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: noah.bg,
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* title bar — the Noah mark lives here, as branding */}
      <div
        style={{
          height: 54,
          background: noah.titlebar,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 20px',
          flexShrink: 0,
        }}
      >
        <NoahMark size={26} />
        <span style={{ fontSize: 22, fontWeight: 600, color: '#d5d5e0' }}>Noah</span>
      </div>

      <div style={{ flex: 1, padding: '26px 26px 30px', display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
        {/* what the user asked for */}
        <div
          style={{
            alignSelf: 'flex-end',
            maxWidth: '88%',
            background: '#222230',
            color: '#e6e6f0',
            fontSize: 25,
            fontWeight: 500,
            lineHeight: 1.36,
            letterSpacing: '-0.01em',
            padding: '18px 24px',
            borderRadius: 18,
            opacity: fade(0, 10),
            transform: `translateY(${(1 - fade(0, 10)) * 12}px)`,
          }}
        >
          My games have been lagging. Check my PC for anything affecting performance.
        </div>

        {/* while the other side is already deleting things, Noah is still looking */}
        {mode === 'prompt' && (
          <div
            style={{
              border: `1px solid ${noah.cardLine}`,
              borderRadius: 16,
              background: noah.card,
              position: 'relative',
              overflow: 'hidden',
              padding: '26px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: fade(12, 24),
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: noah.accentGrad }} />
            <span style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 99,
                    background: noah.indigoSoft,
                    opacity: 0.35 + 0.65 * Math.abs(Math.sin((local - i * 5) / 7)),
                  }}
                />
              ))}
            </span>
            <b style={{ fontSize: 27, fontWeight: 700, color: '#e6e6f2', letterSpacing: '-0.012em' }}>
              Looking into it…
            </b>
          </div>
        )}

        {/* what Noah did */}
        {mode !== 'prompt' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 13,
            border: `1px solid ${noah.cardLine}`,
            background: '#14141b',
            borderRadius: 14,
            padding: '15px 20px',
            opacity: fade(8, 18),
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 99,
              background: noah.green,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6.2l2.4 2.4L9.6 3.9" stroke="#0b1f18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <b style={{ fontSize: 21, fontWeight: 700, color: '#e2e2ee' }}>What Noah did</b>
          <span style={{ fontSize: 20, fontWeight: 500, color: noah.txt2 }}>· 1m 12s</span>
          <span style={{ marginLeft: 'auto', fontSize: 19, fontWeight: 500, color: '#9d9db2' }}>Show work ⌄</span>
        </div>
        )}

        {/* the card */}
        {mode !== 'prompt' && (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            border: `1px solid ${noah.cardLine}`,
            borderRadius: 16,
            background: noah.card,
            position: 'relative',
            overflow: 'hidden',
            padding: '28px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            opacity: fade(10, 20),
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: noah.accentGrad }} />

          {mode === 'check' && (
            <>
              <NoahLabel>WHAT NOAH CHECKED</NoahLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {TILES.map((t, idx) => (
                  <Tile
                    key={t.k}
                    t={t}
                    reveal={fade(20 + idx * 9, 32 + idx * 9)}
                    highlight={interpolate(local, [26 + idx * 9, 34 + idx * 9, 46 + idx * 9], [0, 1, 0], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    })}
                  />
                ))}
              </div>
              <div
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 21,
                  fontWeight: 500,
                  color: noah.txt3,
                  opacity: fade(70, 82),
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 99,
                    background: noah.green,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.2l2.4 2.4L9.6 3.9" stroke="#0b1f18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                5 checks complete — nothing changed yet
              </div>
            </>
          )}

          {mode === 'finding' && (
            <>
              <NoahLabel>SITUATION</NoahLabel>
              <div style={{ fontSize: 34, fontWeight: 700, color: '#f0f0f8', letterSpacing: '-0.02em' }}>
                Here's what I found.
              </div>
              <div style={{ fontSize: 29, fontWeight: 400, lineHeight: 1.45, color: '#e4e4ef', letterSpacing: '-0.01em' }}>
                Your PC has low free storage, background apps, startup items and old installers that may be
                affecting performance.
              </div>
              {/* kept high in the card so the caption band below stays clear */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
                {TILES.slice(0, 4).map((t, i) => (
                  <Tile key={t.k} t={t} reveal={fade(18 + i * 6, 30 + i * 6)} highlight={0} />
                ))}
              </div>
            </>
          )}

          {mode === 'plan' && (
            <>
              <NoahLabel>WHAT NOAH WOULD DO</NoahLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 4 }}>
                {STEPS.map((s, i) => {
                  const r = fade(12 + i * 10, 24 + i * 10);
                  const focus = interpolate(local, [12 + i * 10, 22 + i * 10, 36 + i * 10], [0, 1, 0.45], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });
                  return (
                    <div
                      key={s.h}
                      style={{
                        display: 'flex',
                        gap: 17,
                        opacity: r,
                        transform: `translateX(${(1 - r) * 22}px)`,
                      }}
                    >
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 99,
                          border: `1.6px solid ${noah.indigo}`,
                          color: noah.indigoSoft,
                          fontSize: 18,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 3,
                          background: `rgba(109,106,224,${0.1 + focus * 0.18})`,
                        }}
                      >
                        {i + 1}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 27, fontWeight: 700, color: '#e9e9f3', letterSpacing: '-0.015em' }}>
                          {s.h}
                        </div>
                        <div style={{ fontSize: 21, fontWeight: 500, color: noah.txt3, marginTop: 5 }}>{s.p}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* the promise that the next beat pays off */}
              <div
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '18px 20px',
                  borderRadius: 13,
                  border: `1px solid ${noah.indigo}55`,
                  background: 'rgba(109,106,224,0.10)',
                  fontSize: 23,
                  fontWeight: 600,
                  color: '#c9c7f2',
                  opacity: fade(56, 70),
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={noah.indigoSoft} strokeWidth="1.9" strokeLinecap="round">
                  <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
                  <path d="M8 10.5V7.5a4 4 0 018 0v3" />
                </svg>
                Nothing runs until you approve it.
              </div>
            </>
          )}
        </div>
        )}
      </div>
    </div>
  );
};
