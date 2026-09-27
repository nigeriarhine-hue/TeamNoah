import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { StageBackdrop } from '../components/StageBackdrop';
import { f, SCENES } from '../timeline';
import { clamp, easeOut, FocusZoom, LightSweep, Scene } from '../components/primitives';
import { KineticText, KLine } from '../components/KineticText';
import { CONTENT_H, CONTENT_W, NoahScreen, WIN } from './NoahScreen';
import { NoahAction, NoahApproval, NoahChecked, NoahChecking, NoahDiagnosis, NoahPlan, NoahResult, NoahTell } from './screens';

// Local (flow-relative) frame for each sub-scene.
const base = SCENES.s04Tell;
const L = {
  tell: 0,
  checking: f(SCENES.s05Checking - base),
  diagnosis: f(SCENES.s06Diagnosis - base),
  checked: f(SCENES.s07Checked - base),
  plan: f(SCENES.s08Plan - base),
  approval: f(SCENES.s09Approval - base),
  action: f(SCENES.s10Action - base),
  result: f(SCENES.s11Result - base),
  end: f(SCENES.s12Reaction - base),
};

const SCREENS: { key: keyof typeof L; next: keyof typeof L; el: React.ReactNode }[] = [
  { key: 'tell', next: 'checking', el: <NoahTell /> },
  { key: 'checking', next: 'diagnosis', el: <NoahChecking /> },
  { key: 'diagnosis', next: 'checked', el: <NoahDiagnosis /> },
  { key: 'checked', next: 'plan', el: <NoahChecked /> },
  { key: 'plan', next: 'approval', el: <NoahPlan /> },
  // During approval the plan stays underneath, settled, behind the dimmed layer.
  { key: 'approval', next: 'action', el: <NoahPlan t={200} /> },
  { key: 'action', next: 'result', el: <NoahAction /> },
  { key: 'result', next: 'end', el: <NoahResult /> },
];

const CAPTIONS: { key: keyof typeof L; next: keyof typeof L; lines: KLine[]; kicker?: string }[] = [
  { key: 'tell', next: 'checking', lines: [{ text: 'Stop guessing.' }, { text: 'Tell Noah', accent: true }, { text: "what's wrong.", accent: true }] },
  { key: 'checking', next: 'diagnosis', lines: [{ text: 'Noah starts' }, { text: 'checking.', accent: true }] },
  { key: 'diagnosis', next: 'checked', lines: [{ text: 'It explains' }, { text: 'what it finds.', accent: true }] },
  { key: 'checked', next: 'plan', lines: [{ text: 'What Noah' }, { text: 'checked.', accent: true }] },
  { key: 'plan', next: 'approval', lines: [{ text: 'See the plan' }, { text: 'before anything', accent: true }, { text: 'changes.', accent: true }] },
  { key: 'approval', next: 'action', lines: [{ text: 'Your PC.' }, { text: 'Your approval.', accent: true }] },
  { key: 'action', next: 'result', lines: [{ text: 'Then Noah' }, { text: 'gets to work.', accent: true }] },
  { key: 'result', next: 'end', lines: [{ text: 'Know what' }, { text: 'changed.', accent: true, emphasize: true }] },
];

const WindowCamera = [
  { f: 0, s: 0.96, x: 0, y: 0 },
  { f: 60, s: 1.0, x: 0, y: -10 },
  { f: L.checking, s: 1.0, x: 0, y: 0 },
  { f: L.diagnosis + 4, s: 1.0, x: 0, y: 0 },
  { f: L.diagnosis + 40, s: 1.07, x: 40, y: 50 },
  { f: L.checked + 6, s: 1.0, x: 0, y: 0 },
  { f: L.checked + 26, s: 1.05, x: 40, y: 30 },
  { f: L.checked + 58, s: 1.05, x: -30, y: -40 },
  { f: L.plan + 6, s: 1.0, x: 0, y: 0 },
  { f: L.approval + 10, s: 1.04, x: 0, y: 0 },
  { f: L.approval + 66, s: 1.1, x: -60, y: -50 },
  { f: L.action + 6, s: 1.0, x: 0, y: 0 },
  { f: L.result + 10, s: 1.0, x: 0, y: 0 },
  { f: L.end, s: 1.05, x: 0, y: -24 },
];

export const AmbientBackdrop: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill>
    <StageBackdrop seed="flow" gridOpacity={0.3 * strength} />
    <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(5,6,18,0.7) 0%, rgba(8,8,30,0.35) 38%, transparent 70%)' }} />
  </AbsoluteFill>
);

export const NoahFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });
  const dim =
    interpolate(frame, [L.approval, L.approval + 8], [0, 1], clamp) * interpolate(frame, [L.action - 6, L.action + 2], [1, 0], clamp);
  const tilt = -4 + Math.sin(frame / 60) * 1.5;

  return (
    <AbsoluteFill>
      <AmbientBackdrop />
      <LightSweep start={L.result} duration={50} opacity={0.25} />

      {/* Noah window with focus-zoom camera */}
      <AbsoluteFill
        style={{
          perspective: 2200,
          opacity: Math.min(1, enter * 1.4),
          transform: `translateX(${(1 - enter) * 520}px)`,
        }}
      >
        <AbsoluteFill style={{ transform: `rotateY(${tilt - (1 - enter) * 16}deg) translateY(${Math.sin(frame / 38) * 5}px)`, transformOrigin: '70% 50%' }}>
          <FocusZoom keys={WindowCamera} origin={`${WIN.x + WIN.w / 2}px ${WIN.y + WIN.h / 2}px`}>
            <NoahScreen dim={dim}>
              {SCREENS.map((s) => (
                <Sequence key={s.key} from={L[s.key]} durationInFrames={L[s.next] - L[s.key]} layout="none">
                  <Scene fadeIn={s.key === 'tell' || s.key === 'approval' ? 0 : 5} fadeOut={s.key === 'plan' || s.next === 'end' ? 0 : 4}>
                    {s.el}
                  </Scene>
                </Sequence>
              ))}
            </NoahScreen>
            {/* Approval modal sits above the dim layer */}
            <div
              style={{
                position: 'absolute',
                left: WIN.x + WIN.rail,
                top: WIN.y + WIN.bar,
                width: CONTENT_W,
                height: CONTENT_H,
              }}
            >
              <Sequence from={L.approval} durationInFrames={L.action - L.approval} layout="none">
                <Scene fadeIn={0} fadeOut={6}>
                  <NoahApproval />
                </Scene>
              </Sequence>
            </div>
          </FocusZoom>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* left-column kinetic captions */}
      {CAPTIONS.map((c) => {
        const dur = L[c.next] - L[c.key];
        return (
          <Sequence key={c.key} from={L[c.key]} durationInFrames={dur} layout="none">
            <div style={{ position: 'absolute', left: 96, top: 360, width: 560 }}>
              <KineticText lines={c.lines} size={60} start={3} stagger={2} exitAt={c.next === 'end' ? undefined : dur - 8} />
            </div>
          </Sequence>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 98,
          top: 318,
          width: interpolate(frame, [4, 24], [0, 90], { ...clamp, easing: easeOut }),
          height: 6,
          borderRadius: 3,
          background: 'linear-gradient(90deg,#2563EB,#7C3AED)',
        }}
      />
    </AbsoluteFill>
  );
};
