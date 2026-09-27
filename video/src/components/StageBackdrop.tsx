import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Particles } from './primitives';

/**
 * Character-free gaming stage: deep navy gradient, drifting brand-colour light
 * fields, a soft horizon glow and floating particles.
 */
export const StageBackdrop: React.FC<{ tint?: string; grid?: boolean; gridOpacity?: number; seed?: string }> = ({
  tint = 'rgba(99,102,241,0.45)',
  grid = true,
  gridOpacity = 0.55,
  seed = 'stage',
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #05060F 0%, #0A0B1F 55%, #0C0A26 100%)', overflow: 'hidden' }}>
      {[
        { c: tint, x: 1350, y: 380, r: 1100, sp: 90 },
        { c: 'rgba(37,99,235,0.35)', x: 350, y: 300, r: 900, sp: 70 },
        { c: 'rgba(124,58,237,0.35)', x: 960, y: 900, r: 1200, sp: 110 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x - b.r / 2 + Math.sin(frame / b.sp + i * 2) * 90,
            top: b.y - b.r / 2 + Math.cos(frame / b.sp + i) * 50,
            width: b.r,
            height: b.r,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${b.c}, transparent 65%)`,
            filter: 'blur(20px)',
          }}
        />
      ))}
      {grid && (
        // soft horizon line across the stage
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 580,
            height: 60,
            opacity: gridOpacity,
            background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(160,140,255,0.55), transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
      )}
      <Particles seed={seed} count={30} opacity={0.4} />
    </AbsoluteFill>
  );
};
