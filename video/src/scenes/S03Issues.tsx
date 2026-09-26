import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticText } from '../components/KineticText';
import { clamp, easeInOut, easeOut, Finish, SafeArea } from '../components/primitives';
import { IconDrive, IconGauge, IconLayers, IconRocket } from '../components/Icons';
import { AmbientBackdrop } from '../noah/NoahFlow';
import { FONT } from '../theme';

// Cards land on the matching words of the voiceover line (local frames).
export const ISSUE_CUES = [3, 37, 84, 132];
export const ISSUE_HEADLINE_AT = 158;

const ISSUES = [
  { icon: <IconRocket size={40} />, label: 'Slow startup', value: '7 apps at boot', level: 0.78 },
  { icon: <IconLayers size={40} />, label: 'Background apps', value: '12 running', level: 0.72 },
  { icon: <IconDrive size={42} />, label: 'Storage', value: '96% full', level: 0.96 },
  { icon: <IconGauge size={42} />, label: 'System load', value: 'High', level: 0.87 },
];

const IssueCard: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const it = ISSUES[i];
  const at = ISSUE_CUES[i];
  const p = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 150 } });
  const fill = interpolate(frame, [at + 4, at + 30], [0, it.level], { ...clamp, easing: easeOut });
  const jitter = frame > at + 30 ? Math.sin(frame / 2.3 + i) * 0.015 + Math.sin(frame / 5.1 + i * 2) * 0.012 : 0;
  const warn = frame > at + 20 ? 0.5 + 0.5 * Math.sin((frame - at) / 5) : 0;
  const active = frame >= at && frame < (ISSUE_CUES[i + 1] ?? ISSUE_HEADLINE_AT);
  return (
    <div
      style={{
        width: 390,
        height: 262,
        borderRadius: 24,
        padding: '26px 28px',
        boxSizing: 'border-box',
        background: 'linear-gradient(160deg, rgba(34,30,70,0.85), rgba(14,14,34,0.85))',
        border: `1.5px solid rgba(255,90,100,${0.2 + 0.35 * warn})`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 ${active ? 50 : 18}px rgba(255,70,90,${active ? 0.35 : 0.12})`,
        backdropFilter: 'blur(10px)',
        fontFamily: FONT,
        color: '#fff',
        opacity: Math.min(1, p * 1.3),
        transform: `translateY(${(1 - p) * 70}px) scale(${0.9 + 0.1 * p + (active ? 0.03 : 0)})`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 18,
            background: 'rgba(255,80,95,0.14)',
            color: '#FF6B78',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `rotate(${Math.sin(frame / 12 + i) * 4}deg)`,
          }}
        >
          {it.icon}
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>{it.label}</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 40, fontWeight: 800, color: '#FF8A94' }}>{it.value}</div>
      <div style={{ marginTop: 16, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div
          style={{
            width: `${Math.min(1, fill + jitter) * 100}%`,
            height: '100%',
            borderRadius: 7,
            background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
            boxShadow: '0 0 16px rgba(239,68,68,0.7)',
          }}
        />
      </div>
    </div>
  );
};

export const S03Issues: React.FC = () => {
  const frame = useCurrentFrame();
  const lift = interpolate(frame, [ISSUE_HEADLINE_AT - 8, ISSUE_HEADLINE_AT + 12], [0, 1], { ...clamp, easing: easeInOut });
  const drift = interpolate(frame, [0, 270], [1, 1.05]);
  return (
    <AbsoluteFill>
      <AmbientBackdrop strength={0.8} />
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, rgba(239,68,68,0.12), transparent 60%)' }} />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          transform: `translateY(${-60 - lift * 130}px) scale(${drift * (1 - lift * 0.1)})`,
        }}
      >
        {ISSUES.map((_, i) => (
          <IssueCard key={i} i={i} />
        ))}
      </AbsoluteFill>
      <SafeArea>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center' }}>
          <KineticText
            start={ISSUE_HEADLINE_AT}
            stagger={3}
            size={100}
            align="center"
            lines={[{ text: "The game isn't" }, { text: 'always the problem.', accent: true }]}
          />
        </div>
      </SafeArea>
      <Finish />
    </AbsoluteFill>
  );
};
