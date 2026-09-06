import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { color } from './brand';
import { loadFonts } from './fonts';
import { S1Symptom } from './scenes/S1Symptom';
import { S2NotJunk } from './scenes/S2NotJunk';
import { S3Diagnose } from './scenes/S3Diagnose';
import { S4Approve } from './scenes/S4Approve';
import { S5Run } from './scenes/S5Run';
import { S6Proof } from './scenes/S6Proof';
import { S7Caveat } from './scenes/S7Caveat';
import { S8End } from './scenes/S8End';

loadFonts();

/**
 * Audio is off until a recording exists. See VOICEOVER.md for the timed script,
 * the read direction, and the file spec.
 *
 * Two ways in, and they are mutually exclusive:
 *
 *   voiceover      one continuous 57s file, public/audio/voiceover.mp3, with the
 *                  pauses baked in. Right for a human take against the timing
 *                  sheet — the reader controls the pacing.
 *   voiceoverLines eight clips, public/audio/vo-1.wav … vo-8.wav, each placed at
 *                  its own mark below. Right for synthesised speech, which has no
 *                  way to hold a 6-second pause, and for re-cutting one line
 *                  without redoing the whole take.
 *
 * Flipping a flag on without the matching files under public/audio will fail the
 * render rather than quietly shipping a silent video — that is the point.
 */
const AUDIO = { voiceover: false, voiceoverLines: false, music: false };

/**
 * Line in-points from VOICEOVER.md, in frames at 30 fps. Change them here and in
 * the script table together, or the two drift apart.
 */
const VO_MARKS = [15, 135, 306, 588, 855, 1038, 1317, 1572];

/**
 * A bed, if used at all, must not change dynamics at the fix. Swelling into the
 * proof turns relief into rescue, which is the one feeling this brand refuses.
 * Mix the level in the file; this is a coarse trim, not a mix.
 */
const MUSIC_GAIN = 0.06;

/**
 * Scene order is the brand's messaging order, and it is not negotiable:
 * symptom, then the real cause, then the approval. Proof and the honest
 * caveat follow because this is a fix log, not an ad.
 */
export const SCENES = [
  { id: 'symptom', dur: 120, Comp: S1Symptom },
  { id: 'not-junk', dur: 165, Comp: S2NotJunk },
  { id: 'diagnose', dur: 285, Comp: S3Diagnose },
  { id: 'approve', dur: 270, Comp: S4Approve },
  { id: 'run', dur: 180, Comp: S5Run },
  { id: 'proof', dur: 285, Comp: S6Proof },
  { id: 'caveat', dur: 255, Comp: S7Caveat },
  { id: 'end', dur: 150, Comp: S8End },
] as const;

/** Scenes butt against each other; each fades itself in and out. */
export const TOTAL = SCENES.reduce((n, s) => n + s.dur, 0);

export const NoahGoogleSlow: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: color.cream }}>
      {AUDIO.voiceover ? <Audio src={staticFile('audio/voiceover.mp3')} /> : null}
      {AUDIO.voiceoverLines
        ? VO_MARKS.map((at, i) => (
            <Sequence key={`vo-${i}`} from={at} name={`vo-${i + 1}`}>
              <Audio src={staticFile(`audio/vo-${i + 1}.wav`)} />
            </Sequence>
          ))
        : null}
      {AUDIO.music ? (
        <Audio src={staticFile('audio/music.mp3')} volume={MUSIC_GAIN} />
      ) : null}

      {SCENES.map(({ id, dur, Comp }) => {
        const from = at;
        at += dur;
        return (
          <Sequence key={id} from={from} durationInFrames={dur} name={id}>
            <Comp dur={dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
