import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AURORA, C} from '../brand/theme';
import {ArrowRightIcon, CheckIcon, Cursor, WarningIcon} from './Icons';
import {NoahLabel, NoahTopLine} from './EnhancedLightNoahScreen';
import {NOAH_UI} from './noahScreenData';

const ease = Easing.inOut(Easing.cubic);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * "What Noah would do" plan → the real approval dialog ("Can Noah do this?") → approved state.
 * The cursor clicks the plan button, the dialog appears with a spotlight, the cursor clicks
 * "Go ahead", and the real "Approved: Action approved" line confirms. Nothing runs before approval.
 */
export const NoahApprovalFocus: React.FC<{
  planAt: number;
  planClickAt: number;
  modalAt: number;
  goClickAt: number;
  approvedAt: number;
}> = ({planAt, planClickAt, modalAt, goClickAt, approvedAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const planIn = spring({frame: frame - planAt, fps, config: {damping: 200}, durationInFrames: 14});
  const modalP = spring({frame: frame - modalAt, fps, config: {damping: 15, mass: 0.6}, durationInFrames: 16});
  const modalOut = interpolate(frame, [approvedAt - 2, approvedAt + 8], [0, 1], clamp);
  const dim = interpolate(frame, [modalAt, modalAt + 8], [0, 1], clamp) * (1 - modalOut);
  const planPress = interpolate(frame - planClickAt, [0, 3, 8], [0, 1, 0], clamp);
  const goPress = interpolate(frame - goClickAt, [0, 3, 8], [0, 1, 0], clamp);
  const spotlight = interpolate(frame - goClickAt, [0, 6, 22], [0, 1, 0], clamp);

  // cursor path (coordinates within the chat column)
  const planBtn = {x: 560, y: 585};
  const goBtn = {x: 470, y: 560};
  const start = {x: 760, y: 980};
  const cx = interpolate(frame, [planAt + 6, planClickAt - 2, modalAt + 6, goClickAt - 2], [start.x, planBtn.x, planBtn.x, goBtn.x], {...clamp, easing: ease});
  const cy = interpolate(frame, [planAt + 6, planClickAt - 2, modalAt + 6, goClickAt - 2], [start.y, planBtn.y, planBtn.y, goBtn.y], {...clamp, easing: ease});
  const cursorOpacity = interpolate(frame, [planAt + 4, planAt + 10, approvedAt, approvedAt + 6], [0, 1, 1, 0], clamp);
  const approvedP = spring({frame: frame - approvedAt, fps, config: {damping: 14}, durationInFrames: 16});

  return (
    <div style={{position: 'absolute', inset: 0, padding: '30px 30px 0'}}>
      <div style={{opacity: planIn, transform: `translateY(${(1 - planIn) * 160}px)`}}>
        <div style={{background: '#FFFFFF', border: `2px solid ${C.line}`, borderRadius: 26, overflow: 'hidden'}}>
          <NoahTopLine />
          <div style={{padding: '26px 28px 30px'}}>
            <NoahLabel text={NOAH_UI.wouldDoLabel} />
            <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 22}}>
              {NOAH_UI.wouldDo.map((w, i) => {
                const p = interpolate(frame - planAt - 4 - i * 4, [0, 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
                return (
                  <div key={w.title} style={{display: 'flex', gap: 20, alignItems: 'flex-start', opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        border: `2.5px solid rgba(79,70,229,0.35)`,
                        color: C.indigo,
                        fontSize: 26,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div style={{fontSize: 31, fontWeight: 800, color: C.ink, lineHeight: 1.2, letterSpacing: '-0.01em'}}>{w.title}</div>
                      <div style={{fontSize: 23, color: C.mute, marginTop: 4, lineHeight: 1.3}}>{w.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 30,
                height: 92,
                borderRadius: 22,
                background: AURORA,
                color: '#fff',
                fontSize: 32,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                boxShadow: '0 14px 30px -14px rgba(79,70,229,0.8)',
                transform: `scale(${1 - planPress * 0.04})`,
              }}
            >
              {NOAH_UI.planButton}
              <ArrowRightIcon size={32} color="#fff" stroke={2.8} />
            </div>
          </div>
        </div>
      </div>

      {/* dim + blur behind the dialog (like the real app) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(18,20,42,${0.42 * dim})`,
          backdropFilter: dim > 0.01 ? `blur(${6 * dim}px)` : undefined,
        }}
      />

      {/* approval dialog */}
      {frame >= modalAt && modalOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 40,
            right: 40,
            top: 300,
            background: '#FFFFFF',
            borderRadius: 30,
            boxShadow: `0 0 0 ${14 * spotlight}px rgba(124,58,237,0.18), 0 40px 80px -24px rgba(18,20,42,0.6)`,
            overflow: 'hidden',
            opacity: modalP * (1 - modalOut),
            transform: `scale(${(0.88 + 0.12 * modalP) * (1 - 0.06 * modalOut)})`,
          }}
        >
          <div style={{padding: '34px 34px 28px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{width: 76, height: 76, borderRadius: 20, background: C.amberSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <WarningIcon size={42} color={C.amber} stroke={2.4} />
              </div>
              <div style={{fontSize: 38, fontWeight: 800, color: C.ink, letterSpacing: '-0.02em'}}>{NOAH_UI.approval.title}</div>
            </div>
            <div style={{fontSize: 31, color: C.ink2, marginTop: 24}}>{NOAH_UI.approval.body}</div>
          </div>
          <div style={{borderTop: `2px solid ${C.line}`, padding: '24px 30px 28px', display: 'flex', justifyContent: 'flex-end', gap: 16}}>
            <div style={{fontSize: 28, fontWeight: 700, color: C.ink2, background: C.page3, borderRadius: 16, padding: '18px 24px'}}>{NOAH_UI.approval.no}</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: '#fff',
                background: AURORA,
                borderRadius: 16,
                padding: '18px 30px',
                transform: `scale(${1 + 0.06 * spotlight - goPress * 0.05})`,
                boxShadow: `0 0 0 ${10 * spotlight}px rgba(79,70,229,0.22), 0 10px 22px -10px rgba(79,70,229,0.8)`,
              }}
            >
              {NOAH_UI.approval.go}
            </div>
            <div style={{fontSize: 28, fontWeight: 700, color: C.indigo, border: `2.5px solid rgba(79,70,229,0.5)`, borderRadius: 16, padding: '16px 24px'}}>
              {NOAH_UI.approval.all}
            </div>
          </div>
        </div>
      ) : null}

      {/* approved state */}
      {frame >= approvedAt ? (
        <div
          style={{
            position: 'absolute',
            left: 40,
            right: 40,
            top: 380,
            background: '#FFFFFF',
            border: `2.5px solid rgba(14,159,110,0.45)`,
            borderRadius: 26,
            padding: '30px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            boxShadow: `0 0 0 ${10 * approvedP}px ${C.successSoft}, 0 30px 60px -24px rgba(18,20,42,0.45)`,
            opacity: approvedP,
            transform: `scale(${0.9 + 0.1 * approvedP})`,
          }}
        >
          <div style={{width: 70, height: 70, borderRadius: 35, background: C.success, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <CheckIcon size={42} color="#fff" stroke={3.2} />
          </div>
          <div style={{fontSize: 36, fontWeight: 800, color: C.ink}}>{NOAH_UI.approved}</div>
        </div>
      ) : null}

      <div style={{position: 'absolute', left: cx, top: cy, opacity: cursorOpacity, transform: `scale(${1 - 0.15 * Math.max(planPress, goPress)})`}}>
        <Cursor size={64} />
      </div>
    </div>
  );
};
