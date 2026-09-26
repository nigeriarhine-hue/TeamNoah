import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { color } from './theme';
import { AnimatedCaption } from './components/AnimatedCaption';
import { TextHook } from './components/TextHook';
import { UGCClip, CLIP, HAS } from './components/UGCClip';
import { VoiceoverTrack } from './components/VoiceoverTrack';
import { CTAEndCard } from './components/CTAEndCard';
import {
  NoahAction,
  NoahApproval,
  NoahDiagnosis,
  NoahPlan,
  NoahProblem,
  NoahResult,
} from './components/NoahScenes';

/** The cut, in frames at 30fps. */
const S = {
  clip1: { from: 0, dur: 89 },
  clip2: { from: 89, dur: 59 },
  problem: { from: 148, dur: 35 },
  diagnosis: { from: 183, dur: 61 },
  plan: { from: 244, dur: 53 },
  approval: { from: 297, dur: 90 },
  action: { from: 387, dur: 15 },
  result: { from: 402, dur: 18 },
  cta: { from: 420, dur: 30 },
} as const;

/**
 * A short blur-and-dip across the cut from the room into the software. It is
 * the one moment the film changes worlds, so it gets a transition; every
 * other join is a straight cut or a continued push.
 */
const BlurBridge: React.FC<{ at: number; span: number }> = ({ at, span }) => {
  const frame = useCurrentFrame();
  const d = Math.abs(frame - at);
  if (d > span) return null;
  const k = 1 - d / span;
  return (
    <AbsoluteFill
      style={{
        background: color.night,
        opacity: k * 0.82,
        backdropFilter: `blur(${k * 22}px)`,
        pointerEvents: 'none',
      }}
    />
  );
};

export const NoahAd: React.FC = () => (
  <AbsoluteFill style={{ background: color.night }}>
    <VoiceoverTrack />

    {/* ---------- 0:00–0:03 — the problem, in a real room ---------- */}
    <Sequence from={S.clip1.from} durationInFrames={S.clip1.dur} name="Clip 1 — gaming problem">
      <UGCClip
        src={CLIP.gaming}
        present={HAS.clip1}
        durationInFrames={S.clip1.dur}
        zoom={[1.02, 1.1]}
        placeholderLabel="HIGGSFIELD CLIP 1 — GAMING PROBLEM"
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,6,14,.34) 0%, rgba(4,6,14,0) 26%, rgba(4,6,14,.30) 58%, rgba(4,6,14,.88) 100%)',
        }}
      />
      <TextHook lines={['AI TECH SUPPORT', 'FOR YOUR MAC?']} from={7} durationInFrames={80} y={1120} size={94} />
      <AnimatedCaption
        text="Why does everything start lagging when I open my game?"
        from={12}
        durationInFrames={74}
        y={1448}
        size={44}
      />
    </Sequence>

    {/* ---------- 0:03–0:05 — waiting, while something checks ---------- */}
    <Sequence from={S.clip2.from} durationInFrames={S.clip2.dur} name="Clip 2 — waiting">
      <UGCClip
        src={CLIP.waiting}
        present={HAS.clip2}
        durationInFrames={S.clip2.dur}
        zoom={[1.03, 1.12]}
        placeholderLabel="HIGGSFIELD CLIP 2 — WAITING"
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,6,14,.22) 0%, rgba(4,6,14,0) 30%, rgba(4,6,14,.86) 100%)',
        }}
      />
      <AnimatedCaption text="Imagine AI tech support…" from={4} durationInFrames={50} y={1420} size={48} />
    </Sequence>

    {/* ---------- 0:05–0:06 — Noah takes the problem ---------- */}
    <Sequence from={S.problem.from} durationInFrames={S.problem.dur} name="Noah — problem">
      <NoahProblem durationInFrames={S.problem.dur} />
    </Sequence>

    {/* ---------- 0:06–0:08 — it actually checks ---------- */}
    <Sequence from={S.diagnosis.from} durationInFrames={S.diagnosis.dur} name="Noah — diagnosis">
      <NoahDiagnosis durationInFrames={S.diagnosis.dur} />
      <TextHook lines={['IT ACTUALLY CHECKS.']} from={4} durationInFrames={42} y={1622} size={74} />
      <TextHook lines={['NO GUESSING.']} from={48} durationInFrames={38} y={1622} size={74} />
    </Sequence>

    {/* ---------- 0:08–0:10 — what it would do ---------- */}
    <Sequence from={S.plan.from} durationInFrames={S.plan.dur} name="Noah — plan">
      <NoahPlan durationInFrames={S.plan.dur} />
      <TextHook lines={['CHECKS THE PROBLEM']} from={2} durationInFrames={46} y={1622} size={70} />
    </Sequence>

    {/* ---------- 0:10–0:13 — the gate ---------- */}
    <Sequence from={S.approval.from} durationInFrames={S.approval.dur} name="Noah — approval">
      <NoahApproval durationInFrames={S.approval.dur} travelStart={51} travelFrames={22} clickAt={74} />
      <TextHook lines={['SHOWS THE FIX']} from={0} durationInFrames={40} y={1622} size={70} />
      <TextHook lines={['WITH YOUR APPROVAL.']} from={44} durationInFrames={44} y={1622} size={70} />
    </Sequence>

    {/* ---------- 0:13–0:14 — approved, and working ---------- */}
    <Sequence from={S.action.from} durationInFrames={S.action.dur} name="Noah — action">
      <NoahAction durationInFrames={S.action.dur} />
    </Sequence>

    {/* ---------- 0:14 — done ---------- */}
    <Sequence from={S.result.from} durationInFrames={S.result.dur} name="Noah — result">
      <NoahResult durationInFrames={S.result.dur} />
    </Sequence>

    {/* ---------- 0:14–0:15 — end card ---------- */}
    <Sequence from={S.cta.from} durationInFrames={S.cta.dur} name="CTA">
      <CTAEndCard durationInFrames={S.cta.dur} />
    </Sequence>

    <BlurBridge at={S.problem.from} span={7} />
  </AbsoluteFill>
);
