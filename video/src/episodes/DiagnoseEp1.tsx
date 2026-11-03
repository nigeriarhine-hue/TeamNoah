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
import {
  CaseChip,
  Caption,
  clamp,
  Countdown,
  NoahMark,
  OptionCard,
  SeriesBadge,
  SerifNote,
  useSpring,
} from '../components/ui';
import {AURORA, C, SANS} from '../theme';
import {ep1} from './ep1.data';

const E = ep1;
export const EP1_FRAMES = E.total;

const has = (p: string) => getStaticFiles().some((f) => f.name === p);

/* ---------- Host footage, framed by an animated card ---------- */
type Rect = {x: number; y: number; w: number; h: number; r: number};
const FULL: Rect = {x: 0, y: 0, w: 1080, h: 1920, r: 0};
const QUIZ: Rect = {x: 40, y: 160, w: 1000, h: 790, r: 44};
const REVEAL: Rect = {x: 40, y: 160, w: 1000, h: 470, r: 44};
const REVEAL_CAPTION_Y = REVEAL.y + REVEAL.h + 18;
const WINDOW_Y = REVEAL.y + REVEAL.h + 150;

const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
  r: a.r + (b.r - a.r) * t,
});

const HostMedia: React.FC<{src: string; startFrom?: number; focusY?: number; rate?: number}> = ({
  src,
  startFrom = 0,
  focusY = 30,
  rate = 1,
}) => {
  const style: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${focusY}%`};
  return has(src) ? (
    <OffthreadVideo src={staticFile(src)} startFrom={startFrom} playbackRate={rate} muted style={style} />
  ) : (
    <Img src={staticFile('host/host-still.png')} style={style} />
  );
};

const Host: React.FC = () => {
  const frame = useCurrentFrame();
  const toQuiz = interpolate(frame, [E.quizFrom - 4, E.quizFrom + 12], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const toReveal = interpolate(frame, [E.revealFrom - 6, E.revealFrom + 10], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const rect = lerpRect(lerpRect(FULL, QUIZ, toQuiz), REVEAL, toReveal);
  // Keep the face framed as the card gets shorter: shift the crop window toward the face.
  // Gentle push-in during the hook for energy.
  const push = interpolate(frame, [0, E.quizFrom], [1.0, 1.06], clamp);

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
          transform: `scale(${frame < E.quizFrom ? push : 1.06 - 0.06 * toQuiz})`,
          transformOrigin: '50% 35%',
        }}
      >
        {E.hostSegmentsA.map((g) => (
          <Sequence key={`a${g.from}`} from={g.from} durationInFrames={g.dur} layout="none">
            <HostMedia src={E.hostClipA} focusY={30 + 3 * toReveal} rate={g.rate} startFrom={g.startFrom} />
          </Sequence>
        ))}
        {E.hostSegmentsB.map((g) => (
          <Sequence key={`b${g.from}`} from={E.voBStart + g.from} durationInFrames={g.dur} layout="none">
            <HostMedia src={E.hostClipB} focusY={30 + 3 * toReveal} rate={g.rate} startFrom={g.startFrom} />
          </Sequence>
        ))}
      </div>
      {/* readability gradient for captions */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '42%',
          background: 'linear-gradient(180deg, rgba(14,16,48,0) 0%, rgba(14,16,48,.55) 100%)',
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

/* ---------- Captions: position depends on the phase ---------- */
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const line = E.captions.find((c) => frame >= c.from && frame < c.to);
  if (!line) return null;
  const inHook = frame < E.quizFrom;
  const inReveal = frame >= E.revealFrom - 6;
  const out = interpolate(frame, [line.to - 4, line.to], [1, 0], clamp);
  const top = inHook ? 1240 : inReveal ? REVEAL_CAPTION_Y : QUIZ.y + QUIZ.h - 180;
  const size = inHook ? 92 : inReveal ? 52 : 62;
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top, opacity: out}}>
      <Caption key={line.from} text={line.text} from={line.from} emphasis={line.emphasis} size={size} dark={inReveal} />
    </div>
  );
};

/* ---------- Quiz board ---------- */
const QuizBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const leave = interpolate(frame, [E.revealFrom - 10, E.revealFrom + 4], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const promptP = useSpring(E.countdownFrom + 6);
  if (frame < E.quizFrom - 2 || leave >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        top: 990,
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        opacity: 1 - leave,
        transform: `translateY(${leave * 140}px)`,
      }}
    >
      {E.options.map((o) => (
        <OptionCard
          key={o.key}
          letter={o.key}
          label={o.label}
          icon={o.icon}
          at={o.at}
          state="idle"
          stateAt={0}
        />
      ))}
      <div
        style={{
          marginTop: 10,
          textAlign: 'center',
          fontFamily: SANS,
          fontSize: 34,
          fontWeight: 700,
          color: C.ink2,
          opacity: promptP,
        }}
      >
        Lock in your guess — <SerifNote size={44} color={C.indigo}>A, B or C?</SerifNote>
      </div>
    </div>
  );
};

/* ---------- End sting ---------- */
const EndSting: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [E.endFrom, E.endFrom + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  if (frame < E.endFrom) return null;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: AURORA,
        opacity: p,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 26,
      }}
    >
      <div style={{transform: `scale(${0.8 + 0.2 * p})`}}>
        <NoahMark size={200} white />
      </div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 64, color: 'white', letterSpacing: -1.2}}>
        Next case soon.
      </div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 32, color: 'rgba(255,255,255,.8)'}}>
        Can You Diagnose This PC? · Ep {E.episode}
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
  <Sequence from={at} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const SoundDesign: React.FC = () => {
  const ticks = [0, 1, 2, 3, 4].map((i) => E.countdownFrom + i * 30);
  return (
    <>
      <Audio
        src={staticFile('sfx/bed.wav')}
        volume={(f) =>
          // duck under the voice, lift slightly during the silent countdown
          f >= E.countdownFrom + 40 && f < E.countdownTo ? 0.32 : 0.16
        }
      />
      <Sequence from={0} layout="none">
        <Audio src={staticFile(E.voA)} volume={1} />
      </Sequence>
      <Sequence from={E.voBStart} layout="none">
        <Audio src={staticFile(E.voB)} volume={1} />
      </Sequence>

      <Sfx at={E.quizFrom - 4} src="whoosh" volume={0.45} />
      {E.options.map((o) => (
        <Sfx key={o.key} at={o.at} src="pop" volume={0.55} />
      ))}
      {ticks.map((t, i) => (
        <Sfx key={t} at={t} src={i >= 3 ? 'tock' : 'tick'} volume={0.55} />
      ))}
      <Sfx at={E.countdownTo} src="timesup" volume={0.5} />
      <Sfx at={E.revealFrom - 6} src="whoosh" volume={0.45} />
      {E.evidence.map((e) => (
        <Sfx key={e.key} at={e.at} src={e.key === E.answer ? 'blip' : 'blip'} volume={0.4} />
      ))}
      <Sfx at={E.answerAt} src="reveal" volume={0.55} />
      {E.startupApps.map((_, i) => (
        <Sfx key={i} at={E.listFrom + i * 5} src="pop" volume={0.18} />
      ))}
      <Sfx at={E.endFrom - 4} src="whoosh" volume={0.4} />
    </>
  );
};

/* ---------- Composition ---------- */
export const DiagnoseEp1: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.page}}>
      <Backdrop />
      <Host />
      <QuizBoard />
      {frame >= E.revealFrom - 2 && (
        <div style={{position: 'absolute', left: 40, top: WINDOW_Y}}>
          <NoahWindow
            from={E.revealFrom}
            evidence={E.evidence}
            answer={E.answer}
            apps={E.startupApps}
            listFrom={E.listFrom}
            footnote={E.footnote}
            answerAt={E.answerAt}
            answerLabel={E.options.find((o) => o.key === E.answer)!.label}
          />
        </div>
      )}
      <div style={{position: 'absolute', left: QUIZ.x + QUIZ.w - 290, top: QUIZ.y + 30}}>
        <Countdown from={E.countdownFrom} to={E.countdownTo} />
      </div>
      <Captions />
      <SeriesBadge episode={E.episode} />
      <CaseChip caseNo={E.caseNo} symptom={E.symptom} at={44} out={E.quizFrom} />
      <EndSting />
      <SoundDesign />
    </AbsoluteFill>
  );
};
