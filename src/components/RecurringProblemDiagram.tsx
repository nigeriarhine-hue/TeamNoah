import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../brand/theme';
import {RestartIcon, SearchIcon, SlowIcon, SmileIcon} from './Icons';

/**
 * Compact circular "recurring problem" loop: slow → restart → better → slow ... spinning.
 * When `breakAt` is reached the loop stops spinning and a magnifier lands in the middle —
 * the visual for "stop looping, find the cause".
 */
export const RecurringProblemDiagram: React.FC<{
  size?: number;
  breakAt?: number;
  dark?: boolean;
}> = ({size = 240, breakAt = Infinity, dark = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 14});
  const stopP = spring({frame: frame - breakAt, fps, config: {damping: 14}, durationInFrames: 20});
  const spinFrames = Math.min(frame, breakAt + 12);
  const rot = spinFrames * 4.2 * (1 - 0.0 * stopP);
  const r = size / 2 - 22;
  const items = [
    {I: SlowIcon, c: C.amber},
    {I: RestartIcon, c: C.indigo},
    {I: SmileIcon, c: C.success},
    {I: SlowIcon, c: C.amber},
  ];
  const ring = dark ? 'rgba(255,255,255,0.25)' : 'rgba(79,70,229,0.28)';
  return (
    <div style={{width: size, height: size, position: 'relative', transform: `scale(${enter})`}}>
      <svg width={size} height={size} style={{position: 'absolute', inset: 0, transform: `rotate(${rot}deg)`, opacity: 1 - 0.55 * stopP}}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={ring} strokeWidth={8} strokeDasharray="40 22" strokeLinecap="round" />
        {[0, 90, 180, 270].map((a) => (
          <path
            key={a}
            d={`M ${size / 2 + r} ${size / 2 - 10} l 10 16 l 10 -16`}
            fill="none"
            stroke={C.violet}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`rotate(${a + 45} ${size / 2} ${size / 2})`}
          />
        ))}
      </svg>
      {items.map(({I, c}, i) => {
        const a = ((i * 90 + rot - 90) * Math.PI) / 180;
        const x = size / 2 + Math.cos(a) * r - 30;
        const y = size / 2 + Math.sin(a) * r - 30;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 60,
              height: 60,
              borderRadius: 18,
              background: '#fff',
              boxShadow: '0 6px 16px -6px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 1 - 0.6 * stopP,
            }}
          >
            <I size={38} color={c} />
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: size / 2 - 50,
          top: size / 2 - 50,
          width: 100,
          height: 100,
          borderRadius: 50,
          background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${stopP})`,
          boxShadow: '0 12px 30px -10px rgba(79,70,229,0.7)',
        }}
      >
        <SearchIcon size={58} color="#fff" stroke={2.6} />
      </div>
      {/* restart counter badge before the break */}
      <div
        style={{
          position: 'absolute',
          left: size / 2 - 40,
          top: size / 2 - 26,
          width: 80,
          textAlign: 'center',
          fontFamily: 'inherit',
          fontSize: 40,
          fontWeight: 800,
          color: C.violet,
          opacity: interpolate(stopP, [0, 0.3], [1, 0], {extrapolateRight: 'clamp'}),
        }}
      >
        ×{Math.min(9, 1 + Math.floor(spinFrames / 22))}
      </div>
    </div>
  );
};
