import React from 'react';
import { edu } from './theme';
import { ramp } from './motion';

/**
 * Light teaching stage: neutral paper background, faint blueprint grid, soft
 * accent glow, and a slow camera push so the frame is never static.
 * `t` = seconds since the scene started, `dur` = scene length.
 */
export const Stage: React.FC<{ t: number; dur: number; children: React.ReactNode; dark?: boolean; glow?: string }> = ({
  t,
  dur,
  children,
  dark = false,
  glow = 'rgba(111,106,230,0.16)',
}) => {
  const push = 1 + 0.025 * Math.min(1, t / Math.max(dur, 0.01));
  const enter = ramp(t, 0, 0.3);
  return (
    <div style={{ position: 'absolute', inset: 0, background: dark ? edu.dark : edu.bg, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: -40,
          backgroundImage: dark
            ? 'linear-gradient(rgba(255,255,255,0.035) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.035) 1.5px, transparent 1.5px)'
            : 'linear-gradient(rgba(40,50,110,0.05) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(40,50,110,0.05) 1.5px, transparent 1.5px)',
          backgroundSize: '72px 72px',
          transform: `translateY(${-t * 6}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1300,
          height: 1300,
          left: -260,
          top: 820,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glow} 0%, rgba(0,0,0,0) 62%)`,
          transform: `translateX(${Math.sin(t * 0.5) * 40}px)`,
        }}
      />
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push}) translateY(${(1 - enter) * 40}px)`, opacity: enter }}>
        {children}
      </div>
    </div>
  );
};

/** White diagram card. */
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: edu.card,
      border: `2px solid ${edu.lineSoft}`,
      borderRadius: 30,
      boxShadow: '0 20px 50px rgba(30,36,80,0.08)',
      ...style,
    }}
  >
    {children}
  </div>
);
