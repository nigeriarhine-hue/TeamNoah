import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {AUDIO} from './audioAssets';
import {D, S, SESSION, TOTAL} from './timeline';

/**
 * The mix.
 *
 * Rule of the room: the creator's voice wins. The bed ducks hard under the
 * talking scene and only comes back up where there is nothing to listen to.
 * Three SFX, each marking a real event — nothing decorative.
 */
const bedVolume = (f: number) =>
  interpolate(
    f,
    [
      0,
      12,
      S.talking - 6,
      S.talking + 8, // duck for the locked line
      S.broll - 4,
      S.broll + 10,
      S.session + SESSION.approval.from,
      S.payoff - 10,
      S.payoff + 14,
      TOTAL - 22,
      TOTAL,
    ],
    [0, 0.34, 0.34, 0.1, 0.1, 0.27, 0.23, 0.23, 0.36, 0.36, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

/** Absolute frame of the Approve press, matched to the pointer in ApprovalScreen. */
const CLICK_AT = S.session + SESSION.approval.from + 68;
/** Absolute frame where the result screen lands. */
const DONE_AT = S.session + SESSION.result.from;

export const SoundDesign: React.FC = () => (
  <>
    {AUDIO.music ? (
      <Audio src={staticFile(AUDIO.music)} volume={bedVolume} loop />
    ) : null}

    {AUDIO.glitch ? (
      <Sequence from={0} durationInFrames={D.hook} layout="none">
        <Audio src={staticFile(AUDIO.glitch)} volume={0.3} />
      </Sequence>
    ) : null}

    {AUDIO.click ? (
      <Sequence from={CLICK_AT} durationInFrames={24} layout="none">
        <Audio src={staticFile(AUDIO.click)} volume={0.38} />
      </Sequence>
    ) : null}

    {AUDIO.complete ? (
      <Sequence from={DONE_AT} durationInFrames={44} layout="none">
        <Audio src={staticFile(AUDIO.complete)} volume={0.3} />
      </Sequence>
    ) : null}
  </>
);
