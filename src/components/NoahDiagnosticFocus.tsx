import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../brand/theme';
import {BackgroundIcon, CheckIcon, RestartIcon, StartupIcon, StorageIcon} from './Icons';
import {NoahLabel, NoahTopLine} from './EnhancedLightNoahScreen';
import {NOAH_UI} from './noahScreenData';

const tileIcon: Record<string, React.FC<{size?: number; color?: string}>> = {
  startup: StartupIcon,
  storage: StorageIcon,
  installers: StorageIcon,
  background: BackgroundIcon,
};

/**
 * Noah's diagnostic pass, enhanced for video:
 * 1. the user's message bubble, 2. the real step list ticking through (spinner → check),
 * 3. the "What Noah did" result: Situation + enlarged "What Noah checked" tiles.
 * All labels/values come from NOAH_UI (genuine screenshots).
 */
export const NoahDiagnosticFocus: React.FC<{
  prompt: string;
  bubbleAt: number;
  stepsStart: number;
  stepEvery: number;
  resultAt: number; // frame the result card replaces the step list
  spotlight?: string[]; // tile keys to spotlight
}> = ({prompt, bubbleAt, stepsStart, stepEvery, resultAt, spotlight = ['startup', 'background']}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bubble = spring({frame: frame - bubbleAt, fps, config: {damping: 200}, durationInFrames: 10});
  const steps = NOAH_UI.steps;
  const stepsDone = (frame - stepsStart) / stepEvery;
  const toResult = interpolate(frame, [resultAt, resultAt + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <div style={{position: 'absolute', inset: 0, padding: '30px 30px 0'}}>
      {/* scrolled chat column */}
      <div style={{transform: `translateY(${-toResult * 380}px)`}}>
        <div style={{display: 'flex', justifyContent: 'flex-end', opacity: bubble, transform: `translateY(${(1 - bubble) * 30}px)`}}>
          <div
            style={{
              maxWidth: 660,
              background: '#E9E8FF',
              color: C.ink,
              fontSize: 32,
              fontWeight: 600,
              lineHeight: 1.3,
              padding: '22px 28px',
              borderRadius: 28,
              borderBottomRightRadius: 10,
            }}
          >
            {prompt}
          </div>
        </div>

        {/* step list card */}
        <div
          style={{
            marginTop: 30,
            background: '#FFFFFF',
            border: `2px solid ${C.line}`,
            borderRadius: 26,
            overflow: 'hidden',
            opacity: interpolate(frame, [stepsStart - 4, stepsStart + 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * (1 - toResult),
          }}
        >
          <NoahTopLine progress={Math.min(1, Math.max(0.05, stepsDone / steps.length))} />
          <div style={{padding: '22px 30px 26px', display: 'flex', flexDirection: 'column', gap: 18}}>
            {steps.map((s, i) => {
              const state = stepsDone >= i + 1 ? 'done' : stepsDone >= i ? 'run' : 'wait';
              if (state === 'wait') return null;
              return (
                <div key={s} style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 31, fontWeight: state === 'run' ? 800 : 600, color: state === 'run' ? C.ink : C.ink2}}>
                  {state === 'done' ? (
                    <CheckIcon size={32} color={C.success} stroke={3} />
                  ) : (
                    <RestartIcon size={32} color={C.indigo} stroke={2.6} style={{transform: `rotate(${frame * 18}deg)`}} />
                  )}
                  {s}
                  {state === 'run' ? <span style={{fontSize: 24, color: C.mute, fontWeight: 600}}>1s</span> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* result card: What Noah did → Situation → What Noah checked */}
      {toResult > 0 ? (
        <div style={{position: 'absolute', left: 30, right: 30, top: 30, opacity: toResult, transform: `translateY(${(1 - toResult) * 200}px)`}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 27,
              fontWeight: 700,
              color: C.ink,
              background: '#FFFFFF',
              border: `2px solid ${C.line}`,
              borderRadius: 20,
              padding: '14px 22px',
              marginBottom: 18,
            }}
          >
            <CheckIcon size={28} color={C.success} stroke={3} />
            {NOAH_UI.whatNoahDid}
            <span style={{color: C.mute, fontWeight: 600}}>· 1m 47s</span>
          </div>
          <div style={{background: '#FFFFFF', border: `2px solid ${C.line}`, borderRadius: 26, overflow: 'hidden'}}>
            <NoahTopLine />
            <div style={{padding: '24px 28px 30px'}}>
              <NoahLabel text={NOAH_UI.situationLabel} />
              <div style={{fontSize: 30, lineHeight: 1.42, color: C.ink, fontWeight: 500, margin: '12px 0 26px'}}>{NOAH_UI.situation}</div>
              <NoahLabel text={NOAH_UI.checkedLabel} />
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16}}>
                {NOAH_UI.checked.map((t, i) => {
                  const p = spring({frame: frame - resultAt - 4 - i * 2, fps, config: {damping: 14, mass: 0.6}, durationInFrames: 16});
                  const spot = spotlight.includes(t.key);
                  const pulse = spot ? interpolate(frame - resultAt - 16, [0, 10, 24], [0, 1, 0.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
                  const Icon = tileIcon[t.key];
                  return (
                    <div
                      key={t.key}
                      style={{
                        background: '#FBFBFE',
                        border: `2px solid ${spot && pulse > 0 ? 'rgba(79,70,229,0.55)' : C.line}`,
                        boxShadow: spot ? `0 0 0 ${8 * pulse}px rgba(79,70,229,0.12)` : 'none',
                        borderRadius: 20,
                        padding: '18px 20px',
                        opacity: p,
                        transform: `scale(${0.9 + 0.1 * p})`,
                      }}
                    >
                      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, fontWeight: 800, letterSpacing: '0.1em', color: C.mute}}>
                        <Icon size={26} color={C.indigo} />
                        <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{t.label}</span>
                      </div>
                      <div style={{fontSize: 40, fontWeight: 800, color: C.amber, margin: '8px 0 4px', letterSpacing: '-0.02em'}}>{t.value}</div>
                      <div style={{fontSize: 21, color: C.mute, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{t.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
