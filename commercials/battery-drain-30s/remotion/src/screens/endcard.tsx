import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {t, font} from '../theme';
import {COPY} from '../copy';
import {Fonts, NoahMark} from '../components/chrome';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * UI-10 · end card · clip 21 · 66 frames · 3840x2160
 *
 * The mark sits level and unglowed, waterline overshoot intact, clear space on all
 * sides greater than the ring's stroke. brand-pack/README.md forbids glow, tilt,
 * cropping and recolouring — the brief's general "screen glow" direction does not
 * override that.
 *
 * "Approve it." carries the aurora gradient: the film's second and final use of it,
 * and the phrase the whole film turns on.
 *
 * "Done." is NOT teal here. On the end card it is a promise, not a confirmation,
 * and teal is reserved for something that actually succeeded.
 *
 * The legal super is fully up by local frame 16 = global frame 766, and holds 50
 * frames (2.08s) to the end. Two seconds is the floor; do not trim the end card.
 */
export const UI10: React.FC = () => {
  const f = useCurrentFrame();
  const main = interpolate(f, [0, 10], [0, 1], clamp);
  const legal = interpolate(f, [10, 16], [0, 1], clamp);
  const url = interpolate(f, [10, 18], [0, 1], clamp);
  const drift = interpolate(f, [0, 66], [1, 1.015], clamp);
  return (
    <AbsoluteFill style={{background: t.night, fontFamily: font.sans, alignItems: 'center',
      justifyContent: 'center', textAlign: 'center'}}>
      <Fonts />
      <div style={{marginBottom: 86, transform: `scale(${drift})`}}>
        <NoahMark size={240} id="endcard" />
      </div>
      <p style={{fontSize: 140, fontWeight: 700, letterSpacing: '-.035em', color: t.ink,
        margin: '0 0 54px', lineHeight: 1, opacity: main}}>{COPY.wordmark}</p>
      <p style={{fontSize: 104, fontWeight: 700, letterSpacing: '-.03em', color: t.ink,
        margin: '0 0 62px', lineHeight: 1.14, opacity: main}}>
        {COPY.tagline[0]}{' '}
        <span style={{background: t.aurora, WebkitBackgroundClip: 'text',
          backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{COPY.tagline[1]}</span>{' '}
        {COPY.tagline[2]}
      </p>
      <p style={{fontSize: 52, fontWeight: 400, color: t.ink2, margin: '0 0 78px',
        opacity: main}}>{COPY.descriptor}</p>
      <p style={{fontSize: 56, fontWeight: 500, color: t.indigo, margin: 0, opacity: url}}>
        {COPY.url}
      </p>
      <p style={{position: 'absolute', left: 0, right: 0, bottom: 120, fontSize: 30,
        fontWeight: 400, color: t.mute, lineHeight: 1.45, padding: '0 260px', margin: 0,
        opacity: legal}}>{COPY.legal}</p>
    </AbsoluteFill>
  );
};
