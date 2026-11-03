import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {AURORA, CARD_SHADOW, C, MONO, SANS} from '../theme';
import type {Evidence} from '../episodes/ep1.data';
import {clamp, NoahMark, useSpring} from './ui';

// Enhanced light recreation of the Noah desktop app's result view
// ("What Noah checked" tiles + situation), sized for a 9:16 frame.

const SectionLabel: React.FC<{children: React.ReactNode; at: number}> = ({children, at}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 8], [0, 1], clamp);
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: 3,
        color: C.mute,
        opacity: o,
        margin: '0 0 10px',
      }}
    >
      — {children}
    </div>
  );
};

const EvidenceRow: React.FC<{e: Evidence; letter: string; highlight: boolean}> = ({e, letter, highlight}) => {
  const frame = useCurrentFrame();
  const p = useSpring(e.at, {damping: 15, stiffness: 170, mass: 0.6});
  // scanning shimmer before the value lands
  const scanning = frame >= e.at - 9 && frame < e.at;
  const scanP = interpolate(frame, [e.at - 9, e.at], [0, 1], clamp);
  const warn = e.tone === 'warn';
  const hi = highlight && warn ? interpolate(frame, [e.at + 2, e.at + 10], [0, 1], clamp) : 0;
  const visible = frame >= e.at - 9;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '13px 22px',
        borderRadius: 22,
        background: warn ? `rgba(217,119,6,${0.1 * hi})` : C.page2,
        border: `2px solid ${warn && hi > 0 ? `rgba(217,119,6,${0.55 * hi})` : C.line}`,
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : 20}px)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {scanning && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${-30 + scanP * 130}%`,
            width: '30%',
            background: 'linear-gradient(90deg, transparent, rgba(79,70,229,.16), transparent)',
          }}
        />
      )}
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 28,
          color: warn ? 'white' : C.mute,
          background: warn ? C.amber : 'rgba(60,50,40,.08)',
        }}
      >
        {letter}
      </div>
      <div style={{flex: 1, fontFamily: SANS}}>
        <div style={{fontSize: 22, fontWeight: 700, letterSpacing: 2.4, color: C.mute, textTransform: 'uppercase'}}>
          {e.title}
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 14, opacity: p}}>
          <span
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: -0.8,
              color: warn ? C.amber : C.ink,
            }}
          >
            {e.value}
          </span>
          <span style={{fontSize: 24, fontWeight: 500, color: C.mute}}>{e.detail}</span>
        </div>
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 24,
          fontWeight: 800,
          padding: '10px 18px',
          borderRadius: 999,
          color: warn ? C.amber : C.commit,
          background: warn ? C.amberSoft : C.commitSoft,
          opacity: p,
          transform: `scale(${0.7 + 0.3 * p})`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>{warn ? '▲' : '✓'}</span>
        {e.verdict}
      </div>
    </div>
  );
};

const AppChip: React.FC<{name: string; i: number; at: number}> = ({name, i, at}) => {
  const t = at + i * 5;
  const p = useSpring(t, {damping: 13, stiffness: 220, mass: 0.5});
  const hue = [222, 243, 262, 210, 250, 232, 270, 200, 255][i % 9];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px 10px 10px',
        borderRadius: 16,
        background: 'white',
        border: `1.5px solid ${C.line2}`,
        fontFamily: SANS,
        fontSize: 24,
        fontWeight: 700,
        color: C.ink,
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px) scale(${0.8 + 0.2 * p})`,
      }}
    >
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          background: `hsl(${hue} 70% 58%)`,
          color: 'white',
          fontSize: 17,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {i + 1}
      </span>
      {name}
    </div>
  );
};

export const NoahWindow: React.FC<{
  from: number;
  evidence: Evidence[];
  answer: string;
  apps: string[];
  listFrom: number;
  footnote: string;
  answerAt: number;
  answerLabel: string;
}> = ({from, evidence, answer, apps, listFrom, footnote, answerAt, answerLabel}) => {
  const frame = useCurrentFrame();
  const enter = useSpring(from, {damping: 16, stiffness: 140, mass: 0.8});
    const bar = interpolate(frame, [from + 4, evidence[evidence.length - 1].at], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const count = Math.min(apps.length, Math.max(0, Math.floor((frame - listFrom) / 5) + 1));
  const ans = useSpring(answerAt, {damping: 10, stiffness: 210, mass: 0.6});
  const footO = interpolate(frame, [listFrom + 30, listFrom + 40], [0, 1], clamp);

  return (
    <div
      style={{
        width: 1000,
        borderRadius: 44,
        background: 'rgba(255,255,255,.97)',
        boxShadow: CARD_SHADOW,
        border: `1px solid ${C.line}`,
        overflow: 'hidden',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 260}px)`,
      }}
    >
      {/* window chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 26px',
          borderBottom: `1px solid ${C.line}`,
          background: C.page2,
        }}
      >
        <NoahMark size={40} />
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 28, color: C.ink}}>Noah</span>
        <div style={{flex: 1}} />
        <div
          style={{
            fontFamily: SANS,
            fontSize: 24,
            fontWeight: 600,
            color: C.ink2,
            background: 'white',
            border: `1px solid ${C.line2}`,
            borderRadius: 18,
            padding: '10px 18px',
          }}
        >
          My PC feels slow
        </div>
      </div>

      {/* progress / status line */}
      <div style={{position: 'relative', height: 5, background: C.line}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${bar * 100}%`, background: AURORA}} />
      </div>

      <div style={{padding: '18px 28px 22px'}}>
        <div style={{height: 82, marginBottom: 12, position: 'relative'}}>
          {frame < answerAt ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                height: '100%',
                fontFamily: SANS,
                fontSize: 30,
                fontWeight: 700,
                color: C.indigo,
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  background: C.indigo,
                  opacity: 0.5 + 0.5 * Math.sin(frame / 2.5),
                }}
              />
              Checking this PC…
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                height: '100%',
                padding: '0 28px 0 14px',
                borderRadius: 28,
                backgroundImage: AURORA,
                boxShadow: '0 18px 40px -14px rgba(79,70,229,.75)',
                fontFamily: SANS,
                color: 'white',
                transform: `scale(${0.6 + 0.4 * ans})`,
                transformOrigin: '20% 50%',
                opacity: Math.min(1, ans * 1.5),
              }}
            >
              <span
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: 20,
                  background: 'white',
                  color: C.indigo,
                  fontSize: 40,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {answer}
              </span>
              <span style={{fontSize: 24, fontWeight: 700, letterSpacing: 3, opacity: 0.85}}>DIAGNOSIS</span>
              <span style={{fontSize: 50, fontWeight: 800, letterSpacing: -1}}>{answerLabel}</span>
            </div>
          )}
        </div>

        <SectionLabel at={from + 6}>WHAT NOAH CHECKED</SectionLabel>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {evidence.map((e) => (
            <EvidenceRow key={e.key} e={e} letter={e.key} highlight={e.key === answer} />
          ))}
        </div>

        {frame >= listFrom - 4 && (
          <div style={{marginTop: 16}}>
            <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
              <SectionLabel at={listFrom - 4}>LAUNCHING AT STARTUP</SectionLabel>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 30,
                  fontWeight: 700,
                  color: C.amber,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {count}/{apps.length}
              </span>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
              {apps.map((a, i) => (
                <AppChip key={a} name={a} i={i} at={listFrom} />
              ))}
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily: SANS,
                fontSize: 21,
                fontWeight: 500,
                color: C.mute,
                opacity: footO,
              }}
            >
              {footnote}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
