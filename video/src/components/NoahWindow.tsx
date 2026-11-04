import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import type {Evidence, EpisodeData} from '../series/types';
import {AURORA, CARD_SHADOW, C, SANS} from '../theme';
import {AppGlyph} from './PcGraphics';
import {clamp, Icon, NoahMark, useSpring} from './ui';

// Enhanced light recreation of the Noah desktop app's result view.
// Noah visibly checks each possibility (one card per answer option), then the one that
// stands out is highlighted while the others settle into a secondary "checked" state.

const SectionLabel: React.FC<{children: React.ReactNode; at: number}> = ({children, at}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 8], [0, 1], clamp);
  return (
    <div style={{fontFamily: SANS, fontSize: 21, fontWeight: 700, letterSpacing: 3, color: C.mute, opacity: o, margin: '0 0 10px'}}>
      — {children}
    </div>
  );
};

const ICON_FOR: Record<string, 'ram' | 'storage' | 'startup'> = {A: 'ram', B: 'storage', C: 'startup'};

const EvidenceCard: React.FC<{
  e: Evidence;
  isAnswer: boolean;
  answerAt: number;
  scanFrom: number;
  ep: EpisodeData;
}> = ({e, isAnswer, answerAt, scanFrom, ep}) => {
  const frame = useCurrentFrame();
  const checkStart = Math.max(scanFrom, e.at - 22);
  const checking = frame >= checkStart && frame < e.at;
  const scanP = interpolate(frame, [checkStart, e.at], [0, 1], clamp);
  const done = useSpring(e.at, {damping: 15, stiffness: 170, mass: 0.6});
  const settled = interpolate(frame, [answerAt, answerAt + 10], [0, 1], clamp);
  const warn = e.tone === 'warn';
  const hi = isAnswer ? interpolate(frame, [answerAt - 2, answerAt + 8], [0, 1], clamp) : 0;
  const dim = !isAnswer ? settled : 0;
  const appear = interpolate(frame, [scanFrom + 2, scanFrom + 10], [0, 1], clamp);

  // startup animation (only on the startup card): "Windows starts" then app icons pop in fast
  const anim = isAnswer && warn;
  const animFrom = ep.startupAnimFrom;
  const appsShown = anim ? Math.max(0, Math.min(ep.startupApps.length, Math.floor((frame - animFrom - 6) / 2.4) + 1)) : 0;
  const booting = anim ? interpolate(frame, [animFrom - 2, animFrom + 4, animFrom + 8], [0, 1, 0], clamp) : 0;

  const statusLabel = frame >= answerAt ? e.settled : e.verdict;

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 26,
        padding: anim && frame >= animFrom ? '16px 22px 16px' : '16px 22px',
        background: hi > 0 ? `rgba(217,119,6,${0.08 * hi})` : C.page2,
        border: `${2 + 2 * hi}px solid ${hi > 0 ? `rgba(217,119,6,${0.25 + 0.6 * hi})` : C.line}`,
        boxShadow: hi > 0 ? `0 0 0 ${8 * hi}px rgba(217,119,6,${0.1 * hi})` : undefined,
        opacity: appear * (1 - 0.45 * dim),
        transform: `scale(${1 - 0.03 * dim + 0.015 * hi})`,
        overflow: 'hidden',
      }}
    >
      {checking && (
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
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: hi > 0.5 ? C.amber : 'white',
            border: `1.5px solid ${C.line2}`,
            flexShrink: 0,
          }}
        >
          <Icon name={ICON_FOR[e.key]} color={hi > 0.5 ? 'white' : C.indigo} size={38} />
        </div>
        <div style={{flex: 1, fontFamily: SANS, minWidth: 0}}>
          <div style={{fontSize: 21, fontWeight: 800, letterSpacing: 2.6, color: C.mute, textTransform: 'uppercase'}}>
            {e.key} · {e.title}
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap'}}>
            {frame < checkStart ? (
              <span style={{fontSize: 38, fontWeight: 800, color: 'rgba(60,50,40,.25)', letterSpacing: 4}}>···</span>
            ) : (
              <span style={{fontSize: 38, fontWeight: 800, letterSpacing: -0.6, color: warn && done > 0.5 ? C.amber : C.ink}}>
                {/* the finding itself only lands once the check completes */}
                {warn && frame < e.at ? 'Counting…' : e.primary}
              </span>
            )}
            <span style={{fontSize: 25, fontWeight: 600, color: C.ink2, opacity: done}}>{e.secondary}</span>
          </div>
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 23,
            fontWeight: 800,
            padding: '10px 16px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            color: warn ? C.amber : C.commit,
            background: warn ? C.amberSoft : C.commitSoft,
            opacity: checking ? 1 : done,
            transform: `scale(${checking ? 1 : 0.7 + 0.3 * done})`,
            textTransform: frame >= answerAt ? 'uppercase' : undefined,
          }}
        >
          {checking ? (
            <span style={{color: C.indigo}}>Checking…</span>
          ) : (
            <>
              {warn ? '▲ ' : '✓ '}
              {statusLabel}
            </>
          )}
        </div>
      </div>

      {/* startup animation row */}
      {anim && frame >= animFrom - 2 && (
        <div style={{marginTop: 12, display: 'flex', alignItems: 'center', gap: 12}}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: 1.6,
              color: 'white',
              background: `rgba(26,29,97,${0.85})`,
              borderRadius: 10,
              padding: '8px 10px',
              whiteSpace: 'nowrap',
              opacity: interpolate(frame, [animFrom - 2, animFrom + 3], [0, 1], clamp),
              boxShadow: booting > 0 ? `0 0 0 ${4 * booting}px rgba(96,165,250,.35)` : undefined,
            }}
          >
            WINDOWS STARTS →
          </div>
          <div style={{display: 'flex', gap: 7}}>
            {ep.startupApps.map((a, i) => {
              const shown = i < appsShown;
              const t = animFrom + 6 + i * 2.4;
              const s = interpolate(frame, [t, t + 5], [0.4, 1], {...clamp, easing: Easing.out(Easing.back(2))});
              return (
                <div key={a.label} style={{opacity: shown ? 1 : 0, transform: `scale(${shown ? s : 0.4})`}}>
                  <AppGlyph name={a.icon} size={44} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const NoahWindow: React.FC<{ep: EpisodeData}> = ({ep}) => {
  const frame = useCurrentFrame();
  const from = ep.revealFrom;
  const enter = useSpring(from, {damping: 16, stiffness: 140, mass: 0.8});
  const lastCheck = ep.evidence[ep.evidence.length - 1].at;
  const bar = interpolate(frame, [from + 4, lastCheck], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const ans = useSpring(ep.answerAt, {damping: 16, stiffness: 210, mass: 0.6});
  const answerLabel = ep.options.find((o) => o.key === ep.answer)!.label;
  const footO = interpolate(frame, [ep.answerAt + 8, ep.answerAt + 16], [0, 1], clamp);

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
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 26px', borderBottom: `1px solid ${C.line}`, background: C.page2}}>
        <NoahMark size={38} />
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 27, color: C.ink}}>Noah</span>
        <div style={{flex: 1}} />
        <div
          style={{
            fontFamily: SANS,
            fontSize: 23,
            fontWeight: 600,
            color: C.ink2,
            background: 'white',
            border: `1px solid ${C.line2}`,
            borderRadius: 18,
            padding: '9px 16px',
          }}
        >
          My PC is slow every time it starts
        </div>
      </div>
      <div style={{position: 'relative', height: 5, background: C.line}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${bar * 100}%`, background: AURORA}} />
      </div>

      <div style={{padding: '16px 26px 20px'}}>
        {/* status → answer banner */}
        <div style={{height: 84, marginBottom: 12, position: 'relative'}}>
          {frame < ep.answerAt ? (
            <div style={{display: 'flex', alignItems: 'center', gap: 12, height: '100%', fontFamily: SANS, fontSize: 30, fontWeight: 700, color: C.indigo}}>
              <span style={{width: 16, height: 16, borderRadius: 8, background: C.indigo, opacity: 0.5 + 0.5 * Math.sin(frame / 2.5)}} />
              Checking memory, storage and startup…
            </div>
          ) : (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 16,
                height: '100%',
                padding: '0 26px 0 22px',
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
              <span style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, opacity: 0.9, whiteSpace: 'nowrap'}}>THE ANSWER</span>
              <span
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 20,
                  background: 'white',
                  color: C.indigo,
                  fontSize: 38,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {ep.answer}
              </span>
              <span style={{fontSize: 44, fontWeight: 800, letterSpacing: -0.6, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
                {answerLabel}
              </span>
            </div>
          )}
        </div>

        <SectionLabel at={from + 6}>WHAT NOAH CHECKED ON THIS PC</SectionLabel>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {ep.evidence.map((e) => (
            <EvidenceCard key={e.key} e={e} isAnswer={e.key === ep.answer} answerAt={ep.answerAt} scanFrom={from} ep={ep} />
          ))}
        </div>

        <div
          style={{
            marginTop: 14,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 10,
            opacity: footO,
            transform: `translateY(${(1 - footO) * 8}px)`,
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 1.6,
              color: C.amber,
              background: C.amberSoft,
              borderRadius: 10,
              padding: '7px 12px',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
            }}
          >
            {ep.finding}
          </span>
          <span style={{fontFamily: SANS, fontSize: 23, fontWeight: 600, color: C.ink2, lineHeight: 1.3}}>{ep.footnote}</span>
        </div>
      </div>
    </div>
  );
};
