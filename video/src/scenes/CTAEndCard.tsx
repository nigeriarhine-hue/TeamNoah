import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeOut, NoahLockup } from '../components/primitives';
import { IconArrowRight } from '../components/Icons';
import { C, FONT, GRAD } from '../theme';

/* Scene 14 — Call to action */
export const CTAEndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = (at: number) => spring({ frame: frame - at, fps, config: { damping: 17, stiffness: 140 } });
  const rise = (at: number, d = 40) => {
    const p = sp(at);
    return { opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - p) * d}px)` };
  };
  const pulse = frame > 40 ? 0.5 + 0.5 * Math.sin((frame - 40) / 5) : 0;
  const shimmer = interpolate((frame - 30) % 45, [0, 26], [-0.3, 1.3], clamp);
  const tagline = ['Describe it.', 'Approve it.', 'Done.'];
  return (
    <AbsoluteFill style={{ background: '#F6F5FF', fontFamily: FONT, overflow: 'hidden' }}>
      {/* drifting soft brand-colour fields */}
      {[
        { c: 'rgba(37,99,235,0.18)', x: 260, y: 200, r: 700, sp: 70 },
        { c: 'rgba(124,58,237,0.16)', x: 1620, y: 860, r: 800, sp: 90 },
        { c: 'rgba(99,102,241,0.12)', x: 1500, y: 150, r: 520, sp: 55 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x - b.r / 2 + Math.sin(frame / b.sp + i) * 60,
            top: b.y - b.r / 2 + Math.cos(frame / b.sp + i) * 40,
            width: b.r,
            height: b.r,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${b.c}, transparent 70%)`,
          }}
        />
      ))}
      {/* waterline motif, echoing the mark's level line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1010,
          height: 3,
          background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.35), rgba(124,58,237,0.35), transparent)',
          transform: `scaleX(${interpolate(frame, [0, 30], [0, 1], { ...clamp, easing: easeOut })})`,
        }}
      />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + frame * 0.0004})` }}>
        <div style={rise(0, 30)}>
          <NoahLockup size={124} />
        </div>
        <div
          style={{
            ...rise(5),
            marginTop: 26,
            fontSize: 128,
            fontWeight: 800,
            fontStyle: 'italic',
            letterSpacing: -2.5,
            color: C.navy,
            lineHeight: 1,
          }}
        >
          FREE PC CHECK
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 22, fontSize: 42, fontWeight: 600, color: C.ink2 }}>
          {tagline.map((w, i) => (
            <span key={w} style={{ ...rise(12 + i * 5, 20), color: i === 2 ? C.indigo : undefined, fontWeight: i === 2 ? 800 : 600 }}>
              {w}
            </span>
          ))}
        </div>
        <div
          style={{
            ...rise(24),
            marginTop: 44,
            position: 'relative',
            overflow: 'hidden',
            padding: '28px 64px',
            borderRadius: 28,
            background: GRAD,
            color: '#fff',
            fontSize: 46,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            boxShadow: `0 ${18 + 10 * pulse}px ${40 + 30 * pulse}px rgba(79,70,229,${0.3 + 0.25 * pulse})`,
          }}
        >
          <span style={{ transform: `scale(${1 + 0.025 * pulse})`, display: 'flex', alignItems: 'center', gap: 18 }}>
            Download Noah <IconArrowRight size={42} stroke={2.8} />
          </span>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${shimmer * 100}%`,
              width: 140,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              transform: 'skewX(-20deg)',
            }}
          />
        </div>
        <div style={{ ...rise(46, 20), marginTop: 40, fontSize: 34, color: C.ink2, fontWeight: 600 }}>Try it today at</div>
        <div style={{ ...rise(52, 20), fontSize: 76, fontWeight: 800, color: C.navy, letterSpacing: -1 }}>onnoah.app</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
