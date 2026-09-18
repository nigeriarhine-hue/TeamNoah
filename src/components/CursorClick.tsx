import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Cursor drifting to a point and clicking. x/y are percentages of the frame. */
export const CursorClick: React.FC<{
  from: {x: number; y: number};
  to: {x: number; y: number};
  clickAt: number;
}> = ({from, to, clickAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const travel = spring({frame, fps, config: {damping: 200, mass: 1.1}});
  const x = interpolate(travel, [0, 1], [from.x, to.x]);
  const y = interpolate(travel, [0, 1], [from.y, to.y]);

  const ring = interpolate(frame, [clickAt, clickAt + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const press = frame >= clickAt && frame < clickAt + 4 ? 0.88 : 1;

  return (
    <div style={{position: 'absolute', left: `${x}%`, top: `${y}%`, transform: `scale(${press})`}}>
      {ring > 0 && ring < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: -34,
            top: -34,
            width: 68,
            height: 68,
            borderRadius: 34,
            border: '3px solid rgba(255,255,255,0.85)',
            transform: `scale(${0.4 + ring * 1.4})`,
            opacity: 1 - ring,
          }}
        />
      ) : null}
      <svg width="46" height="52" viewBox="0 0 24 28" style={{filter: 'drop-shadow(0 3px 7px rgba(0,0,0,0.65))'}}>
        <path d="M3 2 L3 22 L8.5 17 L12 25 L15.5 23.4 L12 15.6 L19 15.6 Z" fill="#fff" stroke="#111" strokeWidth="1.1" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
