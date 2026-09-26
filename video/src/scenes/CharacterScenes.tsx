import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GamerCharacterScene } from '../components/GamerCharacterScene';
import { KineticText } from '../components/KineticText';
import { clamp, easeOut, Finish, LightSweep, NoahMark, Particles, SafeArea } from '../components/primitives';
import { IconCheck } from '../components/Icons';
import { C, FONT } from '../theme';

const LeftShade: React.FC<{ strength?: number }> = ({ strength = 0.85 }) => (
  <AbsoluteFill
    style={{ background: `linear-gradient(90deg, rgba(3,4,12,${strength}) 0%, rgba(3,4,12,${strength * 0.45}) 38%, transparent 62%)` }}
  />
);

/* Scene 1 — Opening hook */
export const S01Hook: React.FC = () => (
  <AbsoluteFill>
    <GamerCharacterScene
      cam={[
        { f: 0, s: 1.0, x: 0, y: 0 },
        { f: 160, s: 1.13, x: -70, y: 30 },
      ]}
      bgBlur={4}
      glow={1.1}
    />
    <LeftShade />
    <Particles seed="s1" count={30} opacity={0.45} />
    <LightSweep start={6} duration={60} opacity={0.3} />
    <LightSweep start={80} duration={70} opacity={0.2} color="rgba(190,150,255,1)" />
    <SafeArea>
      <div style={{ position: 'absolute', left: 0, top: 250 }}>
        <KineticText
          start={8}
          stagger={4}
          size={116}
          lines={[{ text: 'The next' }, { text: 'big games', accent: true }, { text: 'are coming.' }]}
        />
      </div>
    </SafeArea>
    <Finish />
  </AbsoluteFill>
);

/* Scene 2 — The question */
export const S02Question: React.FC = () => (
  <AbsoluteFill>
    <GamerCharacterScene
      cam={[
        { f: 0, s: 1.5, x: 0, y: 330 },
        { f: 72, s: 1.62, x: -20, y: 368 },
      ]}
      bgBlur={7}
      grade="saturate(0.8) brightness(0.92) contrast(1.05)"
      tint="rgba(40,70,200,0.35)"
      rimPulse={0.8}
    />
    <LeftShade strength={0.8} />
    <Particles seed="s2" count={18} opacity={0.35} />
    <SafeArea>
      <div style={{ position: 'absolute', left: 0, top: 290 }}>
        <KineticText start={2} stagger={3} size={136} lines={[{ text: 'Is your PC' }, { text: 'ready?', accent: true, emphasize: true, size: 190 }]} />
      </div>
    </SafeArea>
    <Finish vignette={0.7} />
  </AbsoluteFill>
);

/* Scene 12 — Gamer reaction */
export const S12Reaction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chip = spring({ frame: frame - 8, fps, config: { damping: 16, stiffness: 140 } });
  return (
    <AbsoluteFill>
      <GamerCharacterScene
        cam={[
          { f: 0, s: 1.3, x: -80, y: 250 },
          { f: 50, s: 1.42, x: -110, y: 290 },
        ]}
        bgBlur={6}
        grade="saturate(1.12) brightness(1.06)"
        tint="rgba(255,170,90,0.28)"
        glow={1.3}
        rimPulse={1}
      />
      <LeftShade strength={0.6} />
      <Particles seed="s12" count={24} opacity={0.5} color="#C9B8FF" />
      <LightSweep start={0} duration={45} opacity={0.3} />
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 430,
          padding: '20px 30px',
          borderRadius: 22,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.25)',
          backdropFilter: 'blur(14px)',
          color: '#fff',
          fontFamily: FONT,
          fontSize: 32,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          opacity: Math.min(1, chip),
          transform: `translateY(${(1 - chip) * 40}px)`,
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 22, background: C.tealBright, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconCheck size={28} stroke={3} color="#fff" />
        </div>
        PC checked · 7.3 GB freed
      </div>
      <Finish />
    </AbsoluteFill>
  );
};

/* Scene 13 — Back to gaming */
export const S13BackToGaming: React.FC = () => (
  <AbsoluteFill>
    <GamerCharacterScene
      cam={[
        { f: 0, s: 1.3, x: 280, y: 60 },
        { f: 118, s: 1.14, x: -80, y: 10 },
      ]}
      bgBlur={2.5}
      glow={1.5}
      rimPulse={1}
    />
    <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(3,4,12,0.85) 0%, rgba(3,4,12,0.2) 45%, transparent 60%)' }} />
    <Particles seed="s13" count={30} opacity={0.45} />
    <LightSweep start={10} duration={70} opacity={0.28} />
    <SafeArea>
      <div style={{ position: 'absolute', left: 0, bottom: 40 }}>
        <KineticText start={8} stagger={3} size={120} lines={[{ text: 'Get your PC' }, { text: 'game-ready.', accent: true }]} />
      </div>
    </SafeArea>
    <Finish />
  </AbsoluteFill>
);

/* Scene 15 — End frame */
export const S15End: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], clamp);
  const logo = interpolate(frame, [14, 26], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ opacity: out, background: '#000' }}>
      <GamerCharacterScene
        cam={[
          { f: 0, s: 1.12, x: 20, y: 40 },
          { f: 70, s: 1.18, x: 0, y: 50 },
        ]}
        bgBlur={5}
        glow={1.2}
        rimPulse={0.9}
      />
      <LeftShade strength={0.9} />
      <Particles seed="s15" count={22} opacity={0.4} />
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
