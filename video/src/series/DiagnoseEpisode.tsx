import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  getStaticFiles,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {NoahWindow} from '../components/NoahWindow';
import {CaseFilePanel} from '../components/PcGraphics';
import {Caption, clamp, Countdown, NoahMark, OptionCard, SeriesBadge, useSpring} from '../components/ui';
import {AURORA, C, SANS} from '../theme';
import type {EpisodeData} from './types';

// "Can You Diagnose This PC?" — one composition for every episode; all content comes from `ep`.
//
// Beats: symptom hook on the real PC → "Can you diagnose it?" → case file (specs) + A/B/C +
// countdown → "Got your answer?" → Noah checks each option on this PC → answer + why → CTA.

const has = (p: string) => getStaticFiles().some((f) => f.name === p);

/* ---------- Layout ---------- */
type Rect = {x: number; y: number; w: number; h: number; r: number};
const FULL: Rect = {x: 0, y: 0, w: 1080, h: 1920, r: 0};
const QUIZ: Rect = {x: 40, y: 160, w: 1000, h: 600, r: 44};
const REVEAL: Rect = {x: 40, y: 160, w: 1000, h: 470, r: 44};
const CASE_Y = QUIZ.y + QUIZ.h + 18;
const OPTIONS_Y = CASE_Y + 210 + 20;
const REVEAL_CAPTION_Y = REVEAL.y + REVEAL.h + 18;
const WINDOW_Y = REVEAL.y + REVEAL.h + 168;

const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
  r: a.r + (b.r - a.r) * t,
});

const ease = Easing.bezier(0.65, 0, 0.35, 1);

/* ---------- Host footage ---------- */
const HostMedia: React.FC<{src: string; still: string; startFrom?: number; focusY: number; rate?: number}> = ({
  src,
  still,
  startFrom = 0,
  focusY,
  rate = 1,
}) => {
  const style: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${focusY}%`};
  return has(src) ? (
    <OffthreadVideo src={staticFile(src)} startFrom={startFrom} playbackRate={rate} muted style={style} />
  ) : (
    <Img src={staticFile(still)} style={style} />
  );
};

const Host: React.FC<{ep: EpisodeData}> = ({ep}) => {
  const frame = useCurrentFrame();
  const toQuiz = interpolate(frame, [ep.quizFrom - 4, ep.quizFrom + 12], [0, 1], {...clamp, easing: ease});
  const toReveal = interpolate(frame, [ep.revealFrom - 6, ep.revealFrom + 10], [0, 1], {...clamp, easing: ease});
  const rect = lerpRect(lerpRect(FULL, QUIZ, toQuiz), REVEAL, toReveal);
  const push = interpolate(frame, [0, ep.quizFrom], [1.0, 1.05], clamp);
  // Quiz card keeps the PC tower in frame above his shoulder; the reveal card centres the face.
  const focusY = 30 - 6 * toQuiz + 9 * toReveal;
  const segs = [
    ...ep.hostSegmentsA.map((g) => ({...g, src: ep.hostClipA, at: g.from})),
    ...ep.hostSegmentsB.map((g) => ({...g, src: ep.hostClipB, at: ep.voBStart + g.from})),
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        borderRadius: rect.r,
        overflow: 'hidden',
        boxShadow: toQuiz > 0 ? `0 30px 70px -30px rgba(26,29,97,${0.5 * toQuiz})` : undefined,
        background: '#ddd',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${frame < ep.quizFrom ? push : 1.05 - 0.05 * toQuiz})`,
          transformOrigin: '50% 35%',
        }}
      >
        {segs.map((g) => (
          <Sequence key={`${g.src}${g.at}`} from={g.at} durationInFrames={g.dur} layout="none">
            <HostMedia src={g.src} still={ep.hostStill} focusY={focusY} rate={g.rate} startFrom={g.startFrom} />
          </Sequence>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: `${42 + 14 * (1 - toQuiz)}%`,
          background: 'linear-gradient(180deg, rgba(14,16,48,0) 0%, rgba(14,16,48,.66) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 260,
          opacity: 1 - toQuiz,
          background: 'linear-gradient(0deg, rgba(14,16,48,0) 0%, rgba(14,16,48,.35) 100%)',
        }}
      />
    </div>
  );
};

/* ---------- Hook: "THIS PC" tag on the real tower ---------- */
const ThisPcTag: React.FC<{ep: EpisodeData}> = ({ep}) => {
  const frame = useCurrentFrame();
  const p = useSpring(6, {damping: 12, stiffness: 170, mass: 0.6});
  const out = interpolate(frame, [ep.quizFrom - 6, ep.quizFrom + 2], [1, 0], clamp);
  if (frame > ep.quizFrom + 2) return null;
  const bob = Math.sin(frame / 5) * 5;
  return (
    <div
      style={{
        position: 'absolute',
        left: 650,
        top: 214 + bob,
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: p * out,
        transform: `scale(${0.6 + 0.4 * p})`,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 2,
          color: 'white',
          backgroundImage: AURORA,
          padding: '10px 18px',
          borderRadius: 16,
          boxShadow: '0 12px 30px -10px rgba(79,70,229,.8)',
          whiteSpace: 'nowrap',
        }}
      >
        THIS PC
      </div>
      <svg width={40} height={56} viewBox="0 0 40 56">
        <path d="M20 4 V44 M8 32 L20 46 L32 32" stroke="white" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/* ---------- Hook headline: the symptom, then "CAN YOU DIAGNOSE IT?" ---------- */
const HookHeadline: React.FC<{ep: EpisodeData}> = ({ep}) => {
  const frame = useCurrentFrame();
  const swap = interpolate(frame, [ep.diagnosePromptAt - 4, ep.diagnosePromptAt + 2], [0, 1], clamp);
  const promptP = useSpring(ep.diagnosePromptAt, {damping: 11, stiffness: 190, mass: 0.6});
  const out = interpolate(frame, [ep.quizFrom + 2, ep.quizFrom + 10], [1, 0], clamp);
  if (frame > ep.quizFrom + 10) return null;
  const lineStyle = (i: number): React.CSSProperties => {
    const t = ep.hookLineAt[i];
    const q = interpolate(frame, [t, t + 7], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
    return {opacity: q, transform: `translateY(${(1 - q) * 30}px) scale(${0.9 + 0.1 * q})`};
  };
  const text: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 800,
    color: 'white',
    letterSpacing: -2,
    lineHeight: 1.02,
    textShadow: '0 6px 30px rgba(10,12,40,.6), 0 2px 4px rgba(10,12,40,.4)',
  };
  const pill: React.CSSProperties = {
    backgroundImage: AURORA,
    borderRadius: 22,
    padding: '0 22px 6px',
    textShadow: 'none',
    boxShadow: '0 14px 34px -12px rgba(79,70,229,.8)',
  };
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 1150, opacity: out}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: 1 - swap,
          transform: `translateY(${-swap * 40}px)`,
        }}
      >
        <span style={{...text, fontSize: 96, ...lineStyle(0)}}>{ep.symptomLines[0]}</span>
        <span style={{...text, fontSize: 112, ...pill, ...lineStyle(1)}}>{ep.symptomLines[1]}</span>
        <span style={{...text, fontSize: 80, ...lineStyle(2)}}>{ep.symptomLines[2]}</span>
      </div>
      {frame >= ep.diagnosePromptAt - 2 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            opacity: Math.min(1, promptP * 1.4),
            transform: `scale(${0.7 + 0.3 * promptP})`,
          }}
        >
          <span style={{...text, fontSize: 110}}>CAN YOU</span>
          <span style={{...text, fontSize: 120, ...pill}}>DIAGNOSE IT?</span>
        </div>
      )}
    </div>
  );
};

/* ---------- Captions ---------- */
const Captions: React.FC<{ep: EpisodeData}> = ({ep}) => {
  const frame = useCurrentFrame();
  const line = ep.captions.find((c) => frame >= c.from && frame < c.to);
  if (!line || frame >= ep.endFrom || frame < ep.quizFrom + 8) return null;
  const inReveal = frame >= ep.revealFrom - 6;
  const out = interpolate(frame, [line.to - 4, line.to], [1, 0], clamp);
  const top = inReveal ? REVEAL_CAPTION_Y : QUIZ.y + QUIZ.h - 150;
  const size = inReveal ? 50 : 60;
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top, opacity: out}}>
      <Caption key={line.from} text={line.text} from={line.from} emphasis={line.emphasis} size={size} dark={inReveal} />
    </div>
  );
};

/* ---------- Quiz board: case file (clues) + A/B/C ---------- */
const QuizBoard: React.FC<{ep: EpisodeData}> = ({ep}) => {
  const frame = useCurrentFrame();
  const leave = interpolate(frame, [ep.revealFrom - 10, ep.revealFrom + 4], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const lockP = useSpring(ep.countdownFrom + 10);
  if (frame < ep.quizFrom - 2 || leave >= 1) return null;
  return (
    <div style={{position: 'absolute', left: 40, top: CASE_Y, opacity: 1 - leave, transform: `translateY(${leave * 140}px)`}}>
      <CaseFilePanel at={ep.caseFrom} caseNo={ep.caseNo} symptom={ep.symptomShort} specs={ep.specs} />
      <div style={{marginTop: OPTIONS_Y - CASE_Y - 210, width: 1000, display: 'flex', flexDirection: 'column', gap: 16}}>
        {ep.options.map((o, i) => (
          <OptionCard
            key={o.key}
            letter={o.key}
            label={o.label}
            icon={o.icon}
            at={o.at}
            state="idle"
            stateAt={0}
            height={150}
            pulseAt={ep.answerPromptAt + 3 + i * 6}
          />
        ))}
        <div
          style={{
            marginTop: 10,
            textAlign: 'center',
            fontFamily: SANS,
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 3,
            color: C.navy,
            opacity: lockP,
            transform: `scale(${0.8 + 0.2 * lockP})`,
          }}
        >
          LOCK IT IN.
        </div>
      </div>
    </div>
  );
};

/* ---------- End: "Did you get it right?" + comment prompt + small Noah branding ---------- */
const EndCard: React.FC<{ep: EpisodeData}> = ({ep}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [ep.endFrom, ep.endFrom + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const q = useSpring(ep.endFrom + 4, {damping: 11, stiffness: 180, mass: 0.6});
  const r = useSpring(ep.endFrom + 12, {damping: 12, stiffness: 180, mass: 0.6});
  if (frame < ep.endFrom) return null;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: AURORA,
        opacity: p,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: SANS,
        color: 'white',
      }}
    >
      <div style={{textAlign: 'center', fontWeight: 800, fontSize: 132, lineHeight: 0.98, letterSpacing: -3, transform: `scale(${0.7 + 0.3 * q})`, opacity: q}}>
        DID YOU
        <br />
        GET IT RIGHT?
      </div>
      <div style={{marginTop: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: r, transform: `translateY(${(1 - r) * 30}px)`}}>
        <div style={{fontSize: 40, fontWeight: 800, letterSpacing: 6, opacity: 0.9}}>COMMENT:</div>
        <div style={{display: 'flex', gap: 22, alignItems: 'center'}}>
          {['A', 'B', 'C'].map((k, i) => (
            <React.Fragment key={k}>
              <span
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 36,
                  background: 'white',
                  color: C.indigo,
                  fontSize: 76,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {k}
              </span>
              {i === 1 && <span style={{fontSize: 44, fontWeight: 800, opacity: 0.85}}>OR</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 210, display: 'flex', alignItems: 'center', gap: 14, opacity: r * 0.92}}>
        <NoahMark size={54} white />
        <span style={{fontSize: 34, fontWeight: 800}}>Noah</span>
        <span style={{fontSize: 30, fontWeight: 600, opacity: 0.8}}>· onnoah.app</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Background ---------- */
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 40;
  return (
    <AbsoluteFill style={{background: C.page}}>
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: 550,
          left: -300 + drift,
          top: 900,
          background: 'radial-gradient(circle, rgba(99,102,241,.22) 0%, rgba(99,102,241,0) 65%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          borderRadius: 500,
          right: -360 - drift,
          top: 1250,
          background: 'radial-gradient(circle, rgba(139,92,246,.18) 0%, rgba(139,92,246,0) 65%)',
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- Sound ---------- */
const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 1}) => (
  <Sequence from={Math.round(at)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const SoundDesign: React.FC<{ep: EpisodeData}> = ({ep}) => {
  const step = (ep.countdownTo - ep.countdownFrom) / 5;
  const ticks = [0, 1, 2, 3, 4].map((i) => ep.countdownFrom + i * step);
  const vo2End = ep.captions.find((c) => c.from >= ep.options[ep.options.length - 1].at)?.to ?? ep.countdownFrom;
  return (
    <>
      <Audio
        src={staticFile('sfx/bed.wav')}
        loop
        volume={(f) => (f >= vo2End && f < ep.countdownTo ? 0.32 : f >= ep.endFrom ? 0.22 : 0.15)}
      />
      <Audio src={staticFile(ep.vo)} volume={1} />

      {ep.hookLineAt.map((t, i) => (
        <Sfx key={`h${t}`} at={t} src="pop" volume={0.35 - i * 0.05} />
      ))}
      <Sfx at={ep.diagnosePromptAt - 2} src="whoosh" volume={0.4} />
      <Sfx at={ep.quizFrom - 4} src="whoosh" volume={0.35} />
      {ep.specs.map((s, i) => (
        <Sfx key={s.label} at={ep.caseFrom + 6 + i * 5} src="blip" volume={0.22} />
      ))}
      {ep.options.map((o) => (
        <Sfx key={o.key} at={o.at} src="pop" volume={0.5} />
      ))}
      {ticks.map((t, i) => (
        <Sfx key={t} at={t} src={i >= 3 ? 'tock' : 'tick'} volume={0.45} />
      ))}
      <Sfx at={ep.countdownTo} src="timesup" volume={0.45} />
      {ep.options.map((o, i) => (
        <Sfx key={`p${o.key}`} at={ep.answerPromptAt + 3 + i * 6} src="pop" volume={0.25} />
      ))}
      <Sfx at={ep.revealFrom - 6} src="whoosh" volume={0.4} />
      {ep.evidence.map((e) => (
        <Sfx key={e.key} at={e.at} src="blip" volume={0.4} />
      ))}
      {ep.startupApps.map((_, i) =>
        i % 2 === 0 ? <Sfx key={`s${i}`} at={ep.startupAnimFrom + 6 + i * 2.4} src="pop" volume={0.16} /> : null,
      )}
      <Sfx at={ep.answerAt} src="reveal" volume={0.5} />
      <Sfx at={ep.endFrom - 4} src="whoosh" volume={0.4} />
    </>
  );
};

/* ---------- Composition ---------- */
export const DiagnoseEpisode: React.FC<{ep: EpisodeData}> = ({ep}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.page}}>
      <Backdrop />
      <Host ep={ep} />
      <ThisPcTag ep={ep} />
      <HookHeadline ep={ep} />
      <QuizBoard ep={ep} />
      {frame >= ep.revealFrom - 2 && (
        <div style={{position: 'absolute', left: 40, top: WINDOW_Y}}>
          <NoahWindow ep={ep} />
        </div>
      )}
      <div style={{position: 'absolute', left: QUIZ.x + QUIZ.w - 290, top: QUIZ.y + 30}}>
        <Countdown from={ep.countdownFrom} to={ep.countdownTo} />
      </div>
      <Captions ep={ep} />
      <SeriesBadge episode={ep.episode} />
      <EndCard ep={ep} />
      <SoundDesign ep={ep} />
    </AbsoluteFill>
  );
};
