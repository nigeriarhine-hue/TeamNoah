import React from 'react';
import { Audio, Sequence, interpolate, staticFile } from 'remotion';
import { f, FPS, SCENES, vis, VO } from '../timeline';
import { ACTION_LEN, ACTION_START, ACTIONS, APPROVAL_CLICK, CHECK_STEP_LEN, CHECK_STEP_START, CHECK_STEPS, CHECKED_SPOT_LEN, CHECKED_SPOT_START, TELL, USER_MESSAGE } from '../noah/screens';
import { ISSUE_CUES, ISSUE_HEADLINE_AT } from '../scenes/S03Issues';

/** Voiceover: one clip per script line, placed on the timeline. */
export const VoiceoverTrack: React.FC = () => (
  <>
    {VO.map((v) => (
      <Sequence key={v.file} from={f(v.at)} durationInFrames={Math.ceil(v.dur * FPS) + 6} layout="none">
        <Audio src={staticFile(`audio/vo/${v.file}.wav`)} volume={0.85} />
      </Sequence>
    ))}
  </>
);

type Cue = { file: string; at: number; vol: number };

const cues = (): Cue[] => {
  const S = SCENES;
  const c: Cue[] = [];
  const add = (file: string, at: number, vol: number) => c.push({ file, at, vol });
  // 1–2 hook
  add('impact', 0.25, 0.35);
  add('riser', 3.6, 0.35);
  add('whoosh', S.s02Question - 0.25, 0.4);
  // 3 issues
  add('whoosh', S.s03Issues - 0.3, 0.45);
  ISSUE_CUES.forEach((q) => add('pop', vis(S.s03Issues) + q / FPS, 0.45));
  ISSUE_CUES.forEach((q) => add('tick', vis(S.s03Issues) + (q + 18) / FPS, 0.3));
  add('impact', vis(S.s03Issues) + ISSUE_HEADLINE_AT / FPS, 0.3);
  // 4 tell Noah — typing, send
  add('whoosh', S.s04Tell - 0.3, 0.45);
  const typeFrames = Math.ceil(USER_MESSAGE.length / TELL.cps);
  for (let k = 0; k < typeFrames; k += 3) add('key', vis(S.s04Tell) + (TELL.typeStart + k) / FPS, 0.28);
  add('click', vis(S.s04Tell) + TELL.click / FPS, 0.6);
  add('send', vis(S.s04Tell) + (TELL.click + 1) / FPS, 0.4);
  // 5 checking — tick per step
  CHECK_STEPS.forEach((_, i) => add('tick', vis(S.s05Checking) + (CHECK_STEP_START + (i + 1) * CHECK_STEP_LEN) / FPS, 0.35));
  // 6 diagnosis
  add('whoosh', S.s06Diagnosis - 0.1, 0.22);
  // 7 checked — pops, then spotlight ticks
  for (let i = 0; i < 5; i++) add('pop', vis(S.s07Checked) + (4 + i * 4) / FPS, 0.25);
  for (let i = 0; i < 5; i++) add('tick', vis(S.s07Checked) + (CHECKED_SPOT_START + i * CHECKED_SPOT_LEN) / FPS, 0.35);
  // 8 plan
  for (let i = 0; i < 4; i++) add('pop', vis(S.s08Plan) + (5 + i * 7) / FPS, 0.22);
  // 9 approval
  add('whoosh', S.s09Approval, 0.25);
  add('click', vis(S.s09Approval) + APPROVAL_CLICK / FPS, 0.7);
  add('approve', vis(S.s09Approval) + (APPROVAL_CLICK + 1) / FPS, 0.5);
  // 10 action
  ACTIONS.forEach((_, i) => add('tick', vis(S.s10Action) + (ACTION_START + (i + 1) * ACTION_LEN) / FPS, 0.4));
  // 11 result
  add('chime', vis(S.s11Result) + 2 / FPS, 0.55);
  // 12–15
  add('whoosh', S.s12Reaction - 0.25, 0.4);
  add('whoosh', S.s13BackToGaming - 0.25, 0.3);
  add('riser', S.s14CTA - 1.6, 0.3);
  add('impact', S.s14CTA, 0.3);
  add('whoosh', S.s15End - 0.25, 0.35);
  add('impact', S.s15End + 0.1, 0.22);
  return c;
};

const voActive = (t: number) => VO.some((v) => t >= v.at - 0.15 && t <= v.at + v.dur + 0.15);

export const SoundDesign: React.FC = () => (
  <>
    {/* music bed, ducked under the voiceover */}
    <Audio
      src={staticFile('audio/sfx/music.wav')}
      volume={(fr) => {
        const t = fr / FPS;
        const base = voActive(t) ? 0.13 : 0.26;
        return base * interpolate(fr, [f(SCENES.end) - 20, f(SCENES.end)], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      }}
    />
    {/* soft system/room hum */}
    <Audio
      src={staticFile('audio/sfx/hum.wav')}
      volume={(fr) => {
        const t = fr / FPS;
        const inRoom = t < SCENES.s04Tell || (t > SCENES.s12Reaction && t < SCENES.s14CTA) || t > SCENES.s15End;
        return inRoom ? 0.2 : 0.08;
      }}
    />
    {cues().map((q, i) => (
      <Sequence key={i} from={Math.max(0, f(q.at))} durationInFrames={f(2.4)} layout="none">
        <Audio src={staticFile(`audio/sfx/${q.file}.wav`)} volume={q.vol} />
      </Sequence>
    ))}
  </>
);
