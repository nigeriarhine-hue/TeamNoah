import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {t, font} from '../theme';
import {COPY, CULPRIT, METRICS} from '../copy';
import {
  Cursor, Desktop, Eyebrow, Fonts, MenuBar, NoahWindow, Tick, Arrow, UndoGlyph,
} from '../components/chrome';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const Shell: React.FC<{clock: string; app?: string; children: React.ReactNode}> = ({
  clock, app, children,
}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Fonts />
    <Desktop />
    <MenuBar clock={clock} pct={29} app={app} />
    {children}
  </AbsoluteFill>
);

/* ── UI-04 · the composer · clip 08 · 38 frames ───────────────────────────── */
export const UI04: React.FC = () => {
  const f = useCurrentFrame();
  const shown = Math.round(interpolate(f, [0, 16], [21, COPY.userSentence.length], clamp));
  const caretOn = Math.floor(f / 8) % 2 === 0;
  const sendLit = f >= 20;
  return (
    <Shell clock="23:57">
      <NoahWindow>
        <div style={{fontSize: 34, color: t.mute, lineHeight: 1.5}}>
          <b style={{display: 'block', fontSize: 44, fontWeight: 700, letterSpacing: '-.03em',
            color: t.ink2, margin: '0 0 12px'}}>{COPY.composerGreeting}</b>
          {COPY.composerHint}
        </div>
        <div style={{flex: 1, minHeight: 60}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 26, background: t.page3,
          border: `1px solid ${t.line2}`, borderRadius: 22, padding: '30px 30px 30px 38px'}}>
          <span style={{fontSize: 38, color: t.ink, whiteSpace: 'pre'}}>
            {COPY.userSentence.slice(0, shown)}
          </span>
          <span style={{display: 'inline-block', width: 3, height: 42, background: t.indigo,
            opacity: caretOn ? 1 : 0}} />
          <span style={{marginLeft: 'auto', width: 66, height: 66, borderRadius: '50%',
            background: sendLit ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>
            <svg width={28} height={28} viewBox="0 0 24 24">
              <path d="M12 19V5m0 0l-6.5 6.5M12 5l6.5 6.5" fill="none"
                stroke={sendLit ? t.ink : t.ink2} strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </NoahWindow>
    </Shell>
  );
};

/* ── UI-05 · Noah measuring · clip 10 · 29 frames ─────────────────────────── */
export const UI05: React.FC = () => {
  const f = useCurrentFrame();
  // Named checks completing, never a progress bar — see 00-brand-notes.
  const doneCount = f >= 20 ? 4 : f >= 6 ? 3 : 2;
  const runningIdx = doneCount;
  return (
    <Shell clock="23:58">
      <NoahWindow centered>
        <Eyebrow>{COPY.measuringEyebrow}</Eyebrow>
        <div style={{display: 'flex', flexDirection: 'column', gap: 30, margin: '0 0 44px'}}>
          {COPY.checks.map((c, i) => {
            const done = i < doneCount;
            const running = i === runningIdx;
            return (
              <div key={c} style={{display: 'flex', alignItems: 'center', gap: 26, fontSize: 34,
                fontWeight: 500, color: done ? t.ink : t.ink2}}>
                <span style={{width: 34, height: 34, flex: 'none', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'}}>
                  {done ? <Tick size={34} /> : running ? (
                    <span style={{width: 30, height: 30, borderRadius: '50%',
                      border: '4px solid rgba(99,102,241,.28)', borderTopColor: t.indigo,
                      transform: `rotate(${f * 14}deg)`}} />
                  ) : (
                    <span style={{width: 10, height: 10, borderRadius: '50%', background: t.mute}} />
                  )}
                </span>
                {c}
              </div>
            );
          })}
        </div>
        <p style={{fontFamily: font.mono, fontSize: 28, color: t.mute, margin: 0,
          fontVariantNumeric: 'tabular-nums'}}>{METRICS.sampled}</p>
      </NoahWindow>
    </Shell>
  );
};

/* ── UI-06 · the finding · clip 12 · 53 frames ────────────────────────────── */
export const UI06: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [8, 20], [0, 1], clamp);
  const y = interpolate(f, [8, 20], [10, 0], clamp);
  return (
    <Shell clock="23:59">
      <NoahWindow centered>
        <Eyebrow>{COPY.findingEyebrow}</Eyebrow>
        <h1 style={{fontSize: 62, fontWeight: 700, letterSpacing: '-.035em', lineHeight: 1.08,
          color: t.ink, margin: 0, maxWidth: '22ch'}}>{COPY.findingHeadline}</h1>
        <div style={{background: 'rgba(255,255,255,.03)', border: `1px solid ${t.line}`,
          borderRadius: 24, padding: '34px 40px', margin: '44px 0',
          opacity: o, transform: `translateY(${y}px)`}}>
          <div style={{display: 'flex', fontFamily: font.mono, fontSize: 28, color: t.ink,
            fontVariantNumeric: 'tabular-nums'}}>
            <span>{CULPRIT.process}</span>
            <span style={{marginLeft: 'auto', color: t.mute}}>{CULPRIT.pid}</span>
          </div>
          <div style={{fontFamily: font.mono, fontSize: 28, color: t.ink2, marginTop: 12,
            fontVariantNumeric: 'tabular-nums'}}>
            Energy impact <span style={{color: t.amber}}>{METRICS.energyBefore}</span> avg ·{' '}
            <span style={{color: t.amber}}>{METRICS.cpuBefore}</span> · {METRICS.atThisLevel} at this level
          </div>
        </div>
        <p style={{fontSize: 34, lineHeight: 1.5, color: t.ink2, margin: 0, maxWidth: '60ch'}}>
          {COPY.findingBody}
        </p>
      </NoahWindow>
    </Shell>
  );
};

/* ── UI-07 · the proposal · clip 13 · 53 frames ───────────────────────────────
   The card is completely static. Only the cursor moves — it arrives at the edge
   of APPROVE and stops. Nothing has been clicked. This is the frame the
   campaign turns on; protect its length before anything else in the edit.      */
export const UI07: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [26, 44], [0, 1], clamp);
  const cx = interpolate(p, [0, 1], [1150, 566]);
  const cy = interpolate(p, [0, 1], [1450, 1248]);
  const Step: React.FC<{n: string; title: string; mono: string}> = ({n, title, mono}) => (
    <div style={{display: 'grid', gridTemplateColumns: '74px 1fr', gap: 22}}>
      <span style={{fontFamily: font.mono, fontSize: 26, color: t.indigo, paddingTop: 9}}>{n}</span>
      <div>
        <p style={{fontSize: 38, fontWeight: 600, letterSpacing: '-.02em', color: t.ink,
          margin: '0 0 10px'}}>{title}</p>
        <p style={{fontFamily: font.mono, fontSize: 26, color: t.ink2, margin: 0,
          wordBreak: 'break-all'}}>{mono}</p>
      </div>
    </div>
  );
  return (
    <Shell clock="23:59">
      <NoahWindow>
        <Eyebrow>{COPY.proposalEyebrow}</Eyebrow>
        <div style={{display: 'flex', flexDirection: 'column', gap: 38, margin: '0 0 44px'}}>
          <Step n="01" title={COPY.step1} mono={`${CULPRIT.process} (${CULPRIT.pid})`} />
          <Step n="02" title={COPY.step2} mono={`${CULPRIT.agent} → ${CULPRIT.backupSuffix}`} />
        </div>
        <p style={{fontSize: 31, color: t.ink2, margin: '0 0 22px', maxWidth: '64ch'}}>
          {COPY.reassure}
        </p>
        <p style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 29, fontWeight: 500,
          color: t.commit, margin: 0}}>
          <UndoGlyph size={30} />{COPY.reversible}
        </p>
        <div style={{display: 'flex', alignItems: 'center', gap: 52, marginTop: 'auto'}}>
          {/* The one thing to do next — the film's first of exactly two uses of the gradient. */}
          <div style={{background: t.aurora, color: '#fff', fontWeight: 700, fontSize: 34,
            letterSpacing: '.06em', borderRadius: 18, padding: '32px 84px'}}>
            {COPY.approve}
          </div>
          {/* No border, no fill. The asymmetry is the brand rule, not a styling accident. */}
          <div style={{color: t.mute, fontWeight: 500, fontSize: 32}}>{COPY.notNow}</div>
        </div>
      </NoahWindow>
      <div style={{position: 'absolute', left: cx, top: cy}}><Cursor size={34} /></div>
    </Shell>
  );
};

/* ── UI-08 · Noah acting · clip 16 · 34 frames ────────────────────────────── */
export const UI08: React.FC = () => {
  const f = useCurrentFrame();
  const at = (s: number) => ({
    opacity: interpolate(f, [s, s + 6], [0, 1], clamp),
    transform: `translateY(${interpolate(f, [s, s + 6], [8, 0], clamp)}px)`,
  });
  return (
    <Shell clock="00:00">
      <NoahWindow centered>
        <div style={{display: 'flex', flexDirection: 'column', gap: 30, margin: '0 0 54px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24, fontSize: 34, color: t.ink,
            ...at(2)}}><Tick size={34} />{COPY.acted1}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 24, fontSize: 34, color: t.ink,
            ...at(10)}}><Tick size={34} />{COPY.acted2}</div>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 26, ...at(18)}}>
          {/* teal = a confirmation, the only thing teal is allowed to mean */}
          <b style={{fontSize: 58, fontWeight: 700, letterSpacing: '-.035em', color: t.commit}}>
            {COPY.done}
          </b>
          <span style={{fontFamily: font.mono, fontSize: 28, color: t.mute, marginLeft: 'auto'}}>
            {METRICS.elapsed}
          </span>
        </div>
        <span style={{fontSize: 31, fontWeight: 500, color: t.indigo, alignSelf: 'flex-start',
          borderBottom: '2px solid rgba(99,102,241,.4)', marginTop: 34, ...at(22)}}>
          {COPY.undo}
        </span>
      </NoahWindow>
    </Shell>
  );
};

/* ── UI-09 · the recheck · clip 18 · 53 frames ────────────────────────────── */
export const UI09: React.FC = () => {
  const f = useCurrentFrame();
  const energy = interpolate(f, [6, 20], [94.2, 0.4], clamp).toFixed(1);
  const cpu = `${Math.round(interpolate(f, [12, 26], [61, 2], clamp))}%`;
  const mins = interpolate(f, [18, 34], [126, 341], clamp);
  const life = `${Math.floor(mins / 60)}h ${String(Math.round(mins % 60)).padStart(2, '0')}m`;
  const th: React.CSSProperties = {fontSize: 23, fontWeight: 700, letterSpacing: '.13em',
    textTransform: 'uppercase', textAlign: 'right', padding: '0 0 26px', color: t.mute};
  const td: React.CSSProperties = {padding: '26px 0', borderTop: `1px solid ${t.line}`,
    fontSize: 32, textAlign: 'right', fontFamily: font.mono,
    fontVariantNumeric: 'tabular-nums', color: t.ink2};
  const rows: [string, string, string][] = [
    [COPY.rowEnergy, METRICS.energyBefore, energy],
    [COPY.rowCpu, METRICS.cpuBefore, cpu],
    [COPY.rowLife, METRICS.lifeBefore, life],
  ];
  return (
    <Shell clock="00:01">
      <NoahWindow centered>
        <Eyebrow>{COPY.recheckEyebrow}</Eyebrow>
        <table style={{width: '100%', borderCollapse: 'collapse', margin: '0 0 34px'}}>
          <tbody>
            <tr>
              <th style={{...th, textAlign: 'left'}} />
              <th style={th}>{COPY.before}</th>
              <th style={th} />
              <th style={{...th, color: t.commit}}>{COPY.after}</th>
            </tr>
            {rows.map(([label, before, after]) => (
              <tr key={label}>
                <td style={{...td, textAlign: 'left', fontFamily: font.sans, fontWeight: 500,
                  maxWidth: '22ch', lineHeight: 1.3}}>{label}</td>
                <td style={td}>{before}</td>
                <td style={{...td, width: 96, textAlign: 'center'}}>
                  <div style={{display: 'flex', justifyContent: 'center'}}><Arrow w={36} /></div>
                </td>
                <td style={{...td, color: t.ink, fontWeight: 500}}>{after}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Not fine print hedging a claim — it is the claim, stated accurately. */}
        <p style={{fontSize: 26, color: t.mute, margin: 0}}>{COPY.measuredFoot}</p>
      </NoahWindow>
    </Shell>
  );
};

/* ── UI-11 · resting desktop · clip 20 · 67 frames · nothing moves ────────── */
export const UI11: React.FC = () => (
  <Shell clock="00:02" app="Notes">
    <div style={{position: 'absolute', left: 520, top: 300, width: 1520, height: 1030,
      background: t.page2, border: `2px solid ${t.line}`, borderRadius: 24, overflow: 'hidden',
      filter: 'blur(3px)', opacity: 0.9,
      boxShadow: '0 60px 120px -50px rgba(0,0,0,.75)'}}>
      <div style={{height: 82, borderBottom: `1px solid ${t.line}`,
        background: 'rgba(255,255,255,.015)'}} />
      <div style={{padding: '70px 90px', display: 'flex', flexDirection: 'column', gap: 34}}>
        {[82, 94, 71, 88, 44, 90, 64].map((w, i) => (
          <span key={i} style={{display: 'block', height: 20, borderRadius: 10, width: `${w}%`,
            background: 'rgba(255,255,255,.07)'}} />
        ))}
      </div>
    </div>
  </Shell>
);
