import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { f, FPS } from '../timeline';
import { clamp, easeInOut, Finish, LightSweep, Scene } from '../components/primitives';
import { KineticText, KLine } from '../components/KineticText';
import { StageBackdrop } from '../components/StageBackdrop';
import { GameCard, ReadinessGauge } from '../scenes/HeroScenes';
import { CTAEndCard } from '../scenes/CTAEndCard';
import { CONTENT_H, CONTENT_W, NoahScreen, WIN } from '../noah/NoahScreen';
import { APPROVAL_CLICK, NoahApproval, NoahChecked, NoahChecking, NoahPlan, NoahResult, NoahTell, TELL } from '../noah/screens';

// ~16 s vertical cut of the main ad, built from the same scenes and VO clips.
const S = { hook: 0, question: 5.0, noah: 7.0, cta: 11.0, end: 16.3 };
export const SHORT_FRAMES = f(S.end);
const XF = 6; // cross-dissolve frames

const VO = [
  { file: 'vo01', at: 0.2, dur: 4.77 },
  { file: 'vo02', at: 5.15, dur: 1.8 },
  { file: 'vo04', at: 7.2, dur: 2.47 },
  { file: 'vo12', at: 11.1, dur: 1.16 },
  { file: 'vo13', at: 12.4, dur: 3.47 },
];

/* Noah montage: each screen enters part-way through its own animation (offset). */
const NOAH_LEN = f(S.cta - S.noah);
const MONTAGE: { from: number; len: number; offset: number; el: React.ReactNode }[] = [
  { from: 0, len: 45, offset: 30, el: <NoahTell /> },
  { from: 45, len: 15, offset: 12, el: <NoahChecking /> },
  { from: 60, len: 18, offset: 22, el: <NoahChecked /> },
  { from: 78, len: 24, offset: 0, el: <NoahPlan t={200} /> },
  { from: 102, len: NOAH_LEN - 102, offset: 30, el: <NoahResult /> },
];
const APPROVAL = { from: 78, len: 24, offset: 56 };
const CAPTIONS: { from: number; len: number; lines: KLine[] }[] = [
  { from: 0, len: 60, lines: [{ text: 'Tell Noah' }, { text: "what's wrong.", accent: true }] },
  { from: 60, len: 42, lines: [{ text: 'Nothing changes' }, { text: 'until you approve.', accent: true }] },
  { from: 102, len: NOAH_LEN - 102, lines: [{ text: 'Know what' }, { text: 'changed.', accent: true }] },
];

const Headline: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center' }}>{children}</div>
);

const HookV: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cards = [
    { chip: 'NEW RELEASE', art: 'img/games/cod-bo7.png' },
    { chip: 'COMING SOON', art: 'img/games/gta6.png' },
    { chip: 'UPCOMING', art: 'img/games/wolverine.jpg', chipAt: 'bottom' as const },
  ];
  const drift = interpolate(frame, [0, 150], [1, 1.06]);
  return (
    <AbsoluteFill>
      <StageBackdrop seed="sh1" />
      <LightSweep start={6} duration={60} opacity={0.3} />
      <AbsoluteFill style={{ perspective: 1800, transform: `scale(${drift})`, transformOrigin: '50% 60%' }}>
        {cards.map((c, i) => {
          const p = spring({ frame: frame - 6 - i * 7, fps, config: { damping: 18, stiffness: 90 } });
          const x = [215, 540, 865][i];
          const bob = Math.sin(frame / 28 + i * 1.3) * 10;
          const prog = i === 1 ? interpolate(frame, [30, 150], [0.05, 0.62], clamp) : undefined;
          return (
            <div
              key={c.chip}
              style={{
                position: 'absolute',
                left: x - 150,
                top: 880 + bob + (i === 1 ? -40 : 0),
                opacity: Math.min(1, p * 1.3),
                transform: `translateY(${(1 - p) * 220}px) translateZ(${i === 1 ? 140 : 0}px) rotateY(${(i - 1) * -10}deg)`,
                filter: i === 1 ? undefined : 'brightness(0.8)',
                zIndex: i === 1 ? 2 : 1,
              }}
            >
              <GameCard variant={i} chip={c.chip} line="" art={c.art} chipAt={c.chipAt} progress={prog} w={300} />
            </div>
          );
        })}
      </AbsoluteFill>
      <Headline top={300}>
        <KineticText align="center" start={6} stagger={4} size={118} lines={[{ text: 'The next' }, { text: 'big games', accent: true }, { text: 'are coming.' }]} />
      </Headline>
      <Finish />
    </AbsoluteFill>
  );
};

const QuestionV: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StageBackdrop seed="sh2" tint="rgba(239,68,68,0.28)" />
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, 66], [1, 1.06])})`, transformOrigin: '50% 65%' }}>
        <ReadinessGauge mode="scan" cx={540} cy={1200} r={270} />
      </AbsoluteFill>
      <Headline top={330}>
        <KineticText align="center" start={2} stagger={3} size={130} lines={[{ text: 'Is your PC' }, { text: 'ready?', accent: true, emphasize: true, size: 190 }]} />
      </Headline>
      <Finish vignette={0.7} />
    </AbsoluteFill>
  );
};

const NoahV: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 110 } });
  const dim = interpolate(frame, [APPROVAL.from, APPROVAL.from + 5, APPROVAL.from + APPROVAL.len - 4, APPROVAL.from + APPROVAL.len], [0, 1, 1, 0], clamp);
  const scale = 0.9 * interpolate(frame, [0, NOAH_LEN], [1, 1.04], { easing: easeInOut });
  const w = WIN.w * scale;
  return (
    <AbsoluteFill>
      <StageBackdrop seed="sh3" />
      {/* Noah window, centred and scaled to fit the 1080px width */}
      <div
        style={{
          position: 'absolute',
          left: 540 - w / 2,
          top: 800 + (1 - enter) * 300,
          opacity: Math.min(1, enter * 1.4),
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <div style={{ position: 'relative', transform: `translate(${-WIN.x}px, ${-WIN.y}px)` }}>
          <NoahScreen dim={dim}>
            {MONTAGE.map((m, i) => (
              <Sequence key={i} from={m.from} durationInFrames={m.len} layout="none">
                <Scene fadeIn={i === 0 ? 0 : 3}>
                  <OffsetClock offset={m.offset}>{m.el}</OffsetClock>
                </Scene>
              </Sequence>
            ))}
          </NoahScreen>
          <div style={{ position: 'absolute', left: WIN.x + WIN.rail, top: WIN.y + WIN.bar, width: CONTENT_W, height: CONTENT_H }}>
            <Sequence from={APPROVAL.from} durationInFrames={APPROVAL.len} layout="none">
              <OffsetClock offset={APPROVAL.offset}>
                <NoahApproval />
              </OffsetClock>
            </Sequence>
          </div>
        </div>
      </div>
      {CAPTIONS.map((c, i) => (
        <Sequence key={i} from={c.from} durationInFrames={c.len} layout="none">
          <Headline top={330}>
            <KineticText align="center" start={1} stagger={2} size={92} lines={c.lines} exitAt={i < CAPTIONS.length - 1 ? c.len - 6 : undefined} />
          </Headline>
        </Sequence>
      ))}
      <Finish />
    </AbsoluteFill>
  );
};

/**
 * Re-bases the clock for children so a screen can start part-way through its
 * own animation: children see (sequenceFrame + offset).
 */
const OffsetClock: React.FC<{ offset: number; children: React.ReactNode }> = ({ offset, children }) => (
  <Sequence from={-offset} layout="none">
    {children}
  </Sequence>
);

const CTA_CARDS = ['img/games/cod-bo7.png', 'img/games/gta6.png', 'img/games/wolverine.jpg'];

const CtaV: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: '#F6F5FF', opacity: out }}>
      <AbsoluteFill style={{ transform: 'scale(0.84) translateY(140px)' }}>
        <CTAEndCard />
      </AbsoluteFill>
      {/* the games again, above the CTA: "before your next big game" */}
      {CTA_CARDS.map((art, i) => {
        const p = spring({ frame: frame - 4 - i * 4, fps, config: { damping: 16, stiffness: 120 } });
        return (
          <div
            key={art}
            style={{
              position: 'absolute',
              left: [300, 540, 780][i] - 105,
              top: 250 + (i === 1 ? -20 : 10) + Math.sin(frame / 26 + i) * 6,
              opacity: Math.min(1, p * 1.3),
              transform: `translateY(${(1 - p) * -80}px) rotateZ(${(i - 1) * 5}deg) scale(${i === 1 ? 1.08 : 1})`,
              zIndex: i === 1 ? 2 : 1,
            }}
          >
            <GameCard variant={i} chip="" line="" art={art} w={210} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const TRACK = [
  { at: S.hook, to: S.question, el: <HookV /> },
  { at: S.question, to: S.noah, el: <QuestionV /> },
  { at: S.noah, to: S.cta, el: <NoahV /> },
  { at: S.cta, to: S.end, el: <CtaV /> },
];

const voActive = (t: number) => VO.some((v) => t >= v.at - 0.15 && t <= v.at + v.dur + 0.15);

const SFX: { file: string; at: number; vol: number }[] = [
  { file: 'impact', at: 0.2, vol: 0.35 },
  { file: 'riser', at: 3.4, vol: 0.3 },
  { file: 'whoosh', at: S.question - 0.2, vol: 0.4 },
  { file: 'whoosh', at: S.noah - 0.2, vol: 0.4 },
  ...Array.from({ length: 8 }, (_, k) => ({ file: 'key', at: S.noah + (k * 3) / FPS, vol: 0.25 })),
  { file: 'click', at: S.noah + (TELL.click - 30) / FPS, vol: 0.6 },
  { file: 'send', at: S.noah + (TELL.click - 29) / FPS, vol: 0.4 },
  { file: 'tick', at: S.noah + 52 / FPS, vol: 0.35 },
  { file: 'pop', at: S.noah + 62 / FPS, vol: 0.3 },
  { file: 'tick', at: S.noah + 70 / FPS, vol: 0.35 },
  { file: 'click', at: S.noah + (APPROVAL.from + APPROVAL_CLICK - APPROVAL.offset) / FPS, vol: 0.7 },
  { file: 'approve', at: S.noah + (APPROVAL.from + APPROVAL_CLICK - APPROVAL.offset + 1) / FPS, vol: 0.5 },
  { file: 'chime', at: S.noah + 104 / FPS, vol: 0.5 },
  { file: 'riser', at: S.cta - 1.2, vol: 0.25 },
  { file: 'impact', at: S.cta, vol: 0.3 },
];

export const NoahShort: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    {TRACK.map((s, i) => {
      const from = i === 0 ? 0 : f(s.at) - XF;
      return (
        <Sequence key={i} from={from} durationInFrames={f(s.to) - from + (i === TRACK.length - 1 ? 0 : XF)}>
          <Scene fadeIn={i === 0 ? 8 : XF}>{s.el}</Scene>
        </Sequence>
      );
    })}
    {VO.map((v) => (
      <Sequence key={v.file} from={f(v.at)} durationInFrames={Math.ceil(v.dur * FPS) + 6} layout="none">
        <Audio src={staticFile(`audio/vo/${v.file}.wav`)} volume={0.85} />
      </Sequence>
    ))}
    <Audio
      src={staticFile('audio/sfx/music.wav')}
      volume={(fr) => (voActive(fr / FPS) ? 0.14 : 0.28) * interpolate(fr, [SHORT_FRAMES - 25, SHORT_FRAMES], [1, 0], clamp)}
    />
    {SFX.map((q, i) => (
      <Sequence key={i} from={Math.max(0, f(q.at))} durationInFrames={f(2.4)} layout="none">
        <Audio src={staticFile(`audio/sfx/${q.file}.wav`)} volume={q.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
