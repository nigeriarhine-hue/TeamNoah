import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {t, font} from './theme';
import {VO} from './copy';
import {ACTS, CLIPS, Clip, STARTS, tc} from './timeline';
import {Fonts} from './components/chrome';
import {UI01, UI02, UI03} from './screens/macro';
import {UI04, UI05, UI06, UI07, UI08, UI09, UI11} from './screens/app';
import {UI10} from './screens/endcard';

const W = 1920, H = 1080;

const SCREENS: Record<string, {C: React.FC; w: number; h: number}> = {
  'UI-01': {C: UI01, w: 1200, h: 300},
  'UI-02': {C: UI02, w: 1200, h: 300},
  'UI-03': {C: UI03, w: 1179, h: 2556},
  'UI-04': {C: UI04, w: 2560, h: 1600},
  'UI-05': {C: UI05, w: 2560, h: 1600},
  'UI-06': {C: UI06, w: 2560, h: 1600},
  'UI-07': {C: UI07, w: 2560, h: 1600},
  'UI-08': {C: UI08, w: 2560, h: 1600},
  'UI-09': {C: UI09, w: 2560, h: 1600},
  'UI-10': {C: UI10, w: 3840, h: 2160},
  'UI-11': {C: UI11, w: 2560, h: 1600},
};

/** Height of the 2.39:1 extraction the master is cut to. */
const MATTE_H = Math.round(W / 2.39);

/**
 * Scale a fixed-size screen to fit INSIDE the 2.39 extraction, not to fill the
 * 16:9 frame. Cover-scaling put the APPROVE button under the bottom matte bar,
 * and the whole point of the animatic is to test whether these screens can be
 * read in the time they are on for.
 */
const Fit: React.FC<{id: string}> = ({id}) => {
  const s = SCREENS[id];
  if (!s) return null;
  const k = Math.min(W / s.w, MATTE_H / s.h);
  const {C} = s;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: '#000'}}>
      <div style={{width: s.w, height: s.h, transform: `scale(${k})`, position: 'relative'}}>
        <C />
      </div>
    </AbsoluteFill>
  );
};

/** Placeholder for a clip Runway will generate. The animatic exists to test timing,
 *  not to look like the film — so these say what the shot is and get out of the way. */
const Slate: React.FC<{clip: Clip}> = ({clip}) => (
  <AbsoluteFill style={{background: '#101318', alignItems: 'center', justifyContent: 'center',
    fontFamily: font.sans, textAlign: 'center', padding: '0 180px'}}>
    <div style={{fontSize: 15, fontWeight: 700, letterSpacing: '.22em', color: t.mute,
      marginBottom: 26}}>RUNWAY · LIVE ACTION</div>
    <div style={{fontSize: 120, fontWeight: 700, letterSpacing: '-.04em', color: t.ink2,
      lineHeight: 1, marginBottom: 30}}>{clip.n}</div>
    <div style={{fontSize: 38, fontWeight: 700, letterSpacing: '-.02em', color: t.ink,
      lineHeight: 1.25, marginBottom: 18, maxWidth: '24ch'}}>{clip.desc}</div>
    <div style={{fontSize: 22, color: t.mute}}>{clip.camera}</div>
  </AbsoluteFill>
);

export const Animatic: React.FC = () => {
  const f = useCurrentFrame();
  const act = ACTS.find((a) => f >= a.from && f < a.to) ?? ACTS[ACTS.length - 1];
  const vo = VO.find((v) => f >= v.start && f < v.start + v.dur);
  const idx = Math.max(0, STARTS.findIndex((s, i) =>
    f >= s && f < s + CLIPS[i].dur));
  const clip = CLIPS[idx];
  const matte = Math.round((H - MATTE_H) / 2); // 2.39:1 extraction guide

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Fonts />
      {CLIPS.map((c, i) => (
        <Sequence key={c.n} from={STARTS[i]} durationInFrames={c.dur}>
          {c.kind === 'LIVE' && c.n !== '20'
            ? <Slate clip={c} />
            : <Fit id={c.ui as string} />}
          {c.kind === 'LIVE' && c.n === '20' ? (
            <AbsoluteFill style={{background: 'rgba(16,19,24,.82)'}}>
              <Slate clip={c} />
            </AbsoluteFill>
          ) : null}
        </Sequence>
      ))}

      {/* 2.39:1 matte guide */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: matte,
        background: 'rgba(0,0,0,.72)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: matte,
        background: 'rgba(0,0,0,.72)'}} />

      {/* burn-ins */}
      <div style={{position: 'absolute', top: 14, left: 24, right: 24, display: 'flex',
        gap: 22, alignItems: 'baseline', fontFamily: font.mono, fontSize: 19, color: '#8f97a4'}}>
        <span style={{color: '#fff', fontWeight: 700}}>{tc(f)}</span>
        <span>f{String(f).padStart(3, '0')}/816</span>
        <span>clip {clip.n} · {clip.kind}</span>
        <span style={{marginLeft: 'auto'}}>ACT {act.name}</span>
      </div>
      {vo ? (
        <div style={{position: 'absolute', bottom: 26, left: 0, right: 0, textAlign: 'center',
          fontFamily: font.sans, fontSize: 30, fontWeight: 500, color: '#fff',
          textShadow: '0 2px 12px rgba(0,0,0,.9)', padding: '0 200px'}}>
          <span style={{fontFamily: font.mono, fontSize: 17, color: '#7A8290', marginRight: 12}}>
            VO{String(vo.n).padStart(2, '0')}
          </span>
          {vo.text}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
