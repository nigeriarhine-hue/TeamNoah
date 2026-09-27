import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticText } from '../components/KineticText';
import { StageBackdrop } from '../components/StageBackdrop';
import { clamp, easeInOut, easeOut, Finish, LightSweep, NoahMark, SafeArea } from '../components/primitives';
import { IconCheck, IconDrive, IconGauge, IconLayers, IconRocket } from '../components/Icons';
import { C, FONT, GRAD } from '../theme';

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

const ART_VARIANTS = ['none', 'hue-rotate(38deg) saturate(1.2)', 'hue-rotate(-55deg) saturate(1.3)'];

/** Generic game-release poster card (no real titles or logos). */
export const GameCard: React.FC<{
  variant: number;
  chip: string;
  line: string;
  w?: number;
  progress?: number; // 0..1 optional pre-load bar
  ready?: number; // 0..1 "Ready to play" state
  play?: number; // 0..1 play-button pulse
}> = ({ variant, chip, line, w = 330, progress, ready = 0, play = 0 }) => {
  const h = w * 1.36;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        borderRadius: w * 0.07,
        overflow: 'hidden',
        boxShadow: '0 40px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.12)',
        fontFamily: FONT,
        color: '#fff',
        background: '#111',
      }}
    >
      <Img src={staticFile('img/game-art.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: ART_VARIANTS[variant % 3] }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 30%, rgba(5,5,20,0.92) 100%)' }} />
      <div
        style={{
          position: 'absolute',
          left: w * 0.06,
          top: w * 0.06,
          padding: `${w * 0.02}px ${w * 0.04}px`,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.16)',
          backdropFilter: 'blur(8px)',
          fontSize: w * 0.042,
          fontWeight: 800,
          letterSpacing: 1.5,
        }}
      >
        {chip}
      </div>
      <div style={{ position: 'absolute', left: w * 0.07, right: w * 0.07, bottom: w * 0.07 }}>
        <div style={{ fontSize: w * 0.075, fontWeight: 800, fontStyle: 'italic', lineHeight: 1.05, textTransform: 'uppercase' }}>{line}</div>
        {progress !== undefined && (
          <div style={{ marginTop: w * 0.04, height: w * 0.02, borderRadius: 99, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
            <div style={{ width: `${progress * 100}%`, height: '100%', background: GRAD }} />
          </div>
        )}
        {ready > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: w * 0.03, marginTop: w * 0.05, opacity: ready }}>
            <div
              style={{
                flex: 1,
                height: w * 0.13,
                borderRadius: w * 0.035,
                background: GRAD,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: w * 0.06,
                fontWeight: 800,
                letterSpacing: 2,
                transform: `scale(${1 + 0.04 * play})`,
                boxShadow: `0 0 ${20 + 40 * play}px rgba(124,58,237,${0.4 + 0.4 * play})`,
              }}
            >
              ▶&nbsp; PLAY
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GAUGE_LABELS = [
  { label: 'Storage', icon: <IconDrive size={30} />, a: -140 },
  { label: 'Startup', icon: <IconRocket size={28} />, a: -40 },
  { label: 'Background', icon: <IconLayers size={28} />, a: 40 },
  { label: 'System load', icon: <IconGauge size={30} />, a: 140 },
];

/** PC readiness gauge: scanning "?" (scene 2) or filled "READY" (scene 12). */
const ReadinessGauge: React.FC<{ mode: 'scan' | 'ready'; cx: number; cy: number; r?: number }> = ({ mode, cx, cy, r = 280 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const fill = mode === 'ready' ? interpolate(frame, [2, 24], [0.22, 1], { ...clamp, easing: easeInOut }) : 0;
  const done = mode === 'ready' ? spring({ frame: frame - 20, fps, config: { damping: 10, stiffness: 170 } }) : 0;
  const circ = 2 * Math.PI * r;
  const tone = mode === 'ready' ? C.tealBright : '#FF6B78';
  const q = 1 + 0.06 * Math.sin(frame / 5);
  return (
    <div style={{ position: 'absolute', left: cx - r - 60, top: cy - r - 60, width: (r + 60) * 2, height: (r + 60) * 2, transform: `scale(${0.85 + 0.15 * inP})`, opacity: Math.min(1, inP * 1.4) }}>
      <svg width={(r + 60) * 2} height={(r + 60) * 2} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id={`g-${mode}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={mode === 'ready' ? '#2DD4BF' : C.blue} />
            <stop offset="1" stopColor={mode === 'ready' ? '#0D9488' : C.violet} />
          </linearGradient>
        </defs>
        <circle cx={r + 60} cy={r + 60} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={26} fill="rgba(10,10,30,0.55)" />
        <circle cx={r + 60} cy={r + 60} r={r - 42} stroke="rgba(255,255,255,0.05)" strokeWidth={2} fill="none" strokeDasharray="4 14" />
        {mode === 'scan' ? (
          <circle
            cx={r + 60}
            cy={r + 60}
            r={r}
            stroke={`url(#g-${mode})`}
            strokeWidth={26}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${circ * 0.22} ${circ}`}
            transform={`rotate(${frame * 7 - 90} ${r + 60} ${r + 60})`}
          />
        ) : (
          <circle
            cx={r + 60}
            cy={r + 60}
            r={r}
            stroke={`url(#g-${mode})`}
            strokeWidth={26}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${circ * fill} ${circ}`}
            transform={`rotate(-90 ${r + 60} ${r + 60})`}
          />
        )}
      </svg>
      {/* centre */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
        {mode === 'scan' ? (
          <>
            <div
              style={{
                fontSize: 260,
                fontWeight: 800,
                fontStyle: 'italic',
                lineHeight: 1,
                color: 'transparent',
                backgroundImage: 'linear-gradient(95deg, #8FA8FF, #A78BFA, #C4B5FD)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                transform: `scale(${q})`,
              }}
            >
              ?
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 5, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>PC READINESS</div>
          </>
        ) : (
          <>
            <div
              style={{
                width: 190,
                height: 190,
                borderRadius: 95,
                background: C.teal,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${done})`,
                boxShadow: '0 0 80px rgba(20,184,166,0.55)',
              }}
            >
              <IconCheck size={120} stroke={3} color="#fff" />
            </div>
            <div style={{ fontSize: 58, fontWeight: 800, fontStyle: 'italic', letterSpacing: 4, color: '#fff', marginTop: 22, opacity: Math.min(1, done) }}>READY</div>
          </>
        )}
      </div>
      {/* orbit labels */}
      {GAUGE_LABELS.map((g, i) => {
        const rad = ((g.a - 90) * Math.PI) / 180;
        const lx = r + 60 + Math.cos(rad) * (r + 40);
        const ly = r + 60 + Math.sin(rad) * (r + 40);
        const o = mode === 'scan' ? interpolate(frame, [6 + i * 5, 14 + i * 5], [0, 1], clamp) : 1;
        const blink = mode === 'scan' ? 0.55 + 0.45 * Math.sin(frame / 4 + i) : 1;
        const ok = mode === 'ready' && frame > 8 + i * 4;
        return (
          <div
            key={g.label}
            style={{
              position: 'absolute',
              left: lx,
              top: ly,
              transform: `translate(${g.a < 0 ? '-100%' : '0%'}, -50%)`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 18px',
              borderRadius: 16,
              background: 'rgba(20,18,50,0.8)',
              border: `1.5px solid ${ok ? 'rgba(20,184,166,0.6)' : 'rgba(255,107,120,0.45)'}`,
              color: '#fff',
              fontFamily: FONT,
              fontSize: 24,
              fontWeight: 700,
              opacity: o,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: ok ? C.tealBright : tone, display: 'flex' }}>{g.icon}</span>
            {g.label}
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                background: ok ? C.teal : '#FF6B78',
                opacity: blink,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {ok ? <IconCheck size={15} stroke={3.5} color="#fff" /> : <span style={{ fontSize: 15, fontWeight: 800 }}>?</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const LeftShade: React.FC = () => (
  <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(3,4,12,0.75) 0%, rgba(3,4,12,0.3) 40%, transparent 60%)' }} />
);

/* ------------------------------------------------------------------ */
/* Scene 1 — Opening hook: next big releases                           */
/* ------------------------------------------------------------------ */
const RELEASES = [
  { chip: 'COMING SOON', line: 'Open-world epic' },
  { chip: 'NEW RELEASE', line: 'Next-gen shooter' },
  { chip: 'PRE-LOAD', line: 'Launch day is near' },
];

export const S01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = interpolate(frame, [0, 160], [0, 1]);
  return (
    <AbsoluteFill>
      <StageBackdrop seed="s1" />
      <LightSweep start={6} duration={60} opacity={0.3} />
      <LightSweep start={80} duration={70} opacity={0.2} color="rgba(190,150,255,1)" />
      {/* release cards fanned in 3D */}
      <AbsoluteFill style={{ perspective: 1800, transform: `translateX(${-40 * drift}px) scale(${1 + 0.06 * drift})`, transformOrigin: '70% 50%' }}>
        {RELEASES.map((r, i) => {
          const p = spring({ frame: frame - 6 - i * 7, fps, config: { damping: 18, stiffness: 90 } });
          const x = [1130, 1420, 1710][i];
          const z = i === 1 ? 120 : 0;
          const bob = Math.sin(frame / 28 + i * 1.3) * 10;
          const prog = i === 1 ? interpolate(frame, [30, 160], [0.05, 0.62], clamp) : undefined;
          return (
            <div
              key={r.chip}
              style={{
                position: 'absolute',
                left: x - 165,
                top: 300 + bob,
                opacity: Math.min(1, p * 1.3),
                transform: `translateY(${(1 - p) * 200}px) translateZ(${z}px) rotateY(${-16 + i * 8}deg) rotateZ(${(i - 1) * 2}deg)`,
                filter: i === 1 ? undefined : 'brightness(0.8)',
                zIndex: i === 1 ? 2 : 1,
              }}
            >
              <GameCard variant={i} chip={r.chip} line={r.line} progress={prog} />
            </div>
          );
        })}
      </AbsoluteFill>
      <LeftShade />
      <SafeArea>
        <div style={{ position: 'absolute', left: 0, top: 250 }}>
          <KineticText start={8} stagger={4} size={116} lines={[{ text: 'The next' }, { text: 'big games', accent: true }, { text: 'are coming.' }]} />
        </div>
      </SafeArea>
      <Finish />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 — The question                                              */
/* ------------------------------------------------------------------ */
export const S02Question: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 72], [1, 1.07], { easing: easeOut });
  return (
    <AbsoluteFill>
      <StageBackdrop seed="s2" tint="rgba(239,68,68,0.28)" gridOpacity={0.4} />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '68% 50%' }}>
        <ReadinessGauge mode="scan" cx={1330} cy={540} />
      </AbsoluteFill>
      <LeftShade />
      <SafeArea>
        <div style={{ position: 'absolute', left: 0, top: 290 }}>
          <KineticText start={2} stagger={3} size={136} lines={[{ text: 'Is your PC' }, { text: 'ready?', accent: true, emphasize: true, size: 190 }]} />
        </div>
      </SafeArea>
      <Finish vignette={0.7} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 12 — PC ready (replaces the gamer reaction)                   */
/* ------------------------------------------------------------------ */
export const S12Ready: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chip = spring({ frame: frame - 16, fps, config: { damping: 16, stiffness: 140 } });
  return (
    <AbsoluteFill>
      <StageBackdrop seed="s12" tint="rgba(20,184,166,0.35)" />
      <LightSweep start={0} duration={45} opacity={0.3} />
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, 50], [1, 1.05])})` }}>
        <ReadinessGauge mode="ready" cx={960} cy={500} r={250} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 880,
          transform: `translate(-50%, ${(1 - chip) * 40}px)`,
          padding: '18px 30px',
          borderRadius: 22,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.22)',
          backdropFilter: 'blur(14px)',
          color: '#fff',
          fontFamily: FONT,
          fontSize: 32,
          fontWeight: 700,
          opacity: Math.min(1, chip),
          whiteSpace: 'nowrap',
        }}
      >
        PC checked · 7.3 GB freed
      </div>
      <Finish />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 13 — Back to gaming: ready to play                            */
/* ------------------------------------------------------------------ */
export const S13BackToGaming: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 90 } });
  const ready = interpolate(frame, [18, 30], [0, 1], clamp);
  const play = frame > 30 ? 0.5 + 0.5 * Math.sin((frame - 30) / 5) : 0;
  const tiltY = interpolate(frame, [0, 118], [-14, 6], { easing: easeInOut });
  return (
    <AbsoluteFill>
      <StageBackdrop seed="s13" />
      <LightSweep start={10} duration={70} opacity={0.28} />
      {/* side cards, defocused */}
      {[0, 2].map((v, i) => (
        <div
          key={v}
          style={{
            position: 'absolute',
            left: i === 0 ? 820 : 1540,
            top: 250 + Math.sin(frame / 30 + i) * 8,
            filter: 'blur(6px) brightness(0.55)',
            transform: `scale(0.8) rotateZ(${i === 0 ? -4 : 4}deg)`,
          }}
        >
          <GameCard variant={v} chip={v === 0 ? 'COMING SOON' : 'PRE-LOAD'} line=" " />
        </div>
      ))}
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div
          style={{
            position: 'absolute',
            left: 1250 - 210,
            top: 130 + Math.sin(frame / 26) * 8,
            transform: `translateY(${(1 - p) * 120}px) rotateY(${tiltY}deg) scale(${0.9 + 0.1 * p})`,
            opacity: Math.min(1, p * 1.3),
          }}
        >
          <GameCard variant={1} chip="READY TO PLAY" line="Next-gen shooter" w={420} ready={ready} play={play} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(3,4,12,0.85) 0%, rgba(3,4,12,0.2) 40%, transparent 60%)' }} />
      <LeftShade />
      <SafeArea>
        <div style={{ position: 'absolute', left: 0, bottom: 40 }}>
          <KineticText start={8} stagger={3} size={120} lines={[{ text: 'Get your PC' }, { text: 'game-ready.', accent: true }]} />
        </div>
      </SafeArea>
      <Finish />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 15 — End frame                                                */
/* ------------------------------------------------------------------ */
export const S15End: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], clamp);
  const logo = interpolate(frame, [14, 26], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ opacity: out, background: '#000' }}>
      <StageBackdrop seed="s15" />
      {[0, 1, 2].map((v) => (
        <div
          key={v}
          style={{
            position: 'absolute',
            left: 1080 + v * 250,
            top: 230 + (v === 1 ? -30 : 0) + Math.sin(frame / 30 + v) * 8,
            filter: 'blur(3px) brightness(0.6)',
            transform: `rotateZ(${(v - 1) * 4}deg) scale(0.85)`,
          }}
        >
          <GameCard variant={v} chip={['COMING SOON', 'NEW RELEASE', 'PRE-LOAD'][v]} line=" " />
        </div>
      ))}
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(3,4,12,0.92) 0%, rgba(3,4,12,0.6) 45%, rgba(3,4,12,0.2) 100%)' }} />
      <SafeArea>
        <div style={{ position: 'absolute', left: 0, top: 250 }}>
          <KineticText
            start={2}
            stagger={3}
            size={128}
            kicker="BEFORE THE NEXT BIG GAME..."
            lines={[{ text: 'Check your PC' }, { text: 'first.', accent: true, emphasize: true }]}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            opacity: logo,
            transform: `translateY(${(1 - logo) * 16}px)`,
            fontFamily: FONT,
            color: '#fff',
          }}
        >
          <NoahMark size={64} variant="dark" />
          <span style={{ fontSize: 40, fontWeight: 700 }}>Noah</span>
          <span style={{ width: 2, height: 36, background: 'rgba(255,255,255,0.35)', margin: '0 8px' }} />
          <span style={{ fontSize: 34, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>onnoah.app</span>
        </div>
      </SafeArea>
      <Finish />
    </AbsoluteFill>
  );
};
