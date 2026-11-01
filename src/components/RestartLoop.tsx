import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT, SHADOW} from '../brand/theme';
import {ArrowDownIcon, RestartIcon, SlowIcon, SmileIcon} from './Icons';

type Node = {label: string; tone: 'warn' | 'action' | 'good'; icon: React.FC<{size?: number; color?: string; style?: React.CSSProperties}>};

const NODES: Node[] = [
  {label: 'PC SLOW', tone: 'warn', icon: SlowIcon},
  {label: 'RESTART', tone: 'action', icon: RestartIcon},
  {label: 'FEELS BETTER', tone: 'good', icon: SmileIcon},
  {label: 'PC SLOW AGAIN', tone: 'warn', icon: SlowIcon},
];

const toneColor = {warn: C.amber, action: C.indigo, good: C.success};
const toneSoft = {warn: C.amberSoft, action: 'rgba(79,70,229,0.12)', good: C.successSoft};

/**
 * The recurring restart loop: PC SLOW → RESTART → FEELS BETTER → PC SLOW AGAIN → (back to top).
 * Cycle 1 reveals each node, then a return arrow draws back to the top and the loop repeats
 * with a restart counter, so the viewer *sees* the symptom coming back.
 */
export const RestartLoop: React.FC<{
  cycleFrames?: number;
  cycles?: number;
  nodeGap?: number;
  width?: number;
}> = ({cycleFrames = 48, cycles = 3, nodeGap = 196, width = 580}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const step = cycleFrames / 4;
  const nodeH = 128;
  const totalH = nodeGap * 3 + nodeH;
  const cycleIdx = Math.min(cycles - 1, Math.floor(frame / cycleFrames));
  const inCycle = frame - cycleIdx * cycleFrames;
  const activeIdx = Math.min(3, Math.floor(inCycle / step));
  const arcX = width + 60;
  const boxW = width + 300;

  // return arc draw progress (end of every cycle)
  const arcStart = cycleFrames - step * 0.9;
  const arcP = interpolate(frame, [arcStart, arcStart + step * 0.9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const arcPath = `M ${width} ${nodeGap * 3 + nodeH / 2} C ${arcX + 90} ${nodeGap * 3 + nodeH / 2}, ${arcX + 90} ${nodeH / 2}, ${width} ${nodeH / 2}`;
  const arcLen = 1500;
  // travelling dot along the return arc during each cycle's tail
  const tail = (inCycle - arcStart) / (step * 0.9);
  const showDot = cycleIdx > 0 || frame >= arcStart;

  return (
    <div style={{position: 'relative', width: boxW, height: totalH, fontFamily: FONT}}>
      <svg width={boxW} height={totalH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id="loopgrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={C.amber} />
            <stop offset="1" stopColor={C.violet} />
          </linearGradient>
          <marker id="loophead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill={C.violet} />
          </marker>
        </defs>
        <path
          d={arcPath}
          fill="none"
          stroke="url(#loopgrad)"
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={arcLen}
          strokeDashoffset={arcLen * (1 - arcP)}
          markerEnd={arcP > 0.97 ? 'url(#loophead)' : undefined}
        />
        {showDot && tail > 0 && tail < 1 ? (() => {
          const u = Easing.inOut(Easing.cubic)(tail);
          const y0 = nodeGap * 3 + nodeH / 2, y3 = nodeH / 2, cx = arcX + 90;
          const bx = (1 - u) ** 3 * width + 3 * (1 - u) ** 2 * u * cx + 3 * (1 - u) * u ** 2 * cx + u ** 3 * width;
          const by = (1 - u) ** 3 * y0 + 3 * (1 - u) ** 2 * u * y0 + 3 * (1 - u) * u ** 2 * y3 + u ** 3 * y3;
          return <circle cx={bx} cy={by} r={14} fill={C.violet} />;
        })() : null}
      </svg>

      {NODES.map((n, i) => {
        const appearAt = i * step;
        const p = spring({frame: frame - appearAt, fps, config: {damping: 16, mass: 0.6}, durationInFrames: 16});
        const active = activeIdx === i && frame >= appearAt;
        const col = toneColor[n.tone];
        const Icon = n.icon;
        const spin = n.tone === 'action' && active ? interpolate(inCycle - i * step, [0, step], [0, 360], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
        return (
          <React.Fragment key={n.label}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: i * nodeGap,
                width,
                height: nodeH,
                borderRadius: 30,
                background: active ? '#FFFFFF' : 'rgba(255,255,255,0.86)',
                border: `3px solid ${active ? col : C.line}`,
                boxShadow: active ? `0 0 0 10px ${toneSoft[n.tone]}, ${SHADOW}` : SHADOW,
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                padding: '0 34px',
                transform: `scale(${interpolate(p, [0, 1], [0.85, active ? 1.03 : 1])})`,
                opacity: p,
              }}
            >
              <div
                style={{
                  width: 82,
                  height: 82,
                  borderRadius: 22,
                  background: toneSoft[n.tone],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={52} color={col} style={{transform: `rotate(${spin}deg)`}} />
              </div>
              <div style={{fontSize: 48, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink, whiteSpace: 'nowrap'}}>{n.label}</div>
            </div>
            {i < 3 ? (
              <div
                style={{
                  position: 'absolute',
                  left: width / 2 - 26,
                  top: i * nodeGap + nodeH + 8,
                  opacity: interpolate(frame - appearAt - step * 0.6, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
                }}
              >
                <ArrowDownIcon size={52} color={C.mute} stroke={2.6} />
              </div>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* restart counter */}
      <div
        style={{
          position: 'absolute',
          left: arcX + 110,
          top: totalH / 2 - 60,
          width: 130,
          textAlign: 'center',
          opacity: interpolate(frame, [arcStart, arcStart + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        <div style={{fontSize: 26, fontWeight: 800, letterSpacing: '0.12em', color: C.violet}}>LOOP</div>
        <div style={{fontSize: 76, fontWeight: 800, color: C.violet, lineHeight: 1}}>
          ×{Math.max(1, cycleIdx + (frame >= arcStart + step * 0.9 ? 1 : 0))}
        </div>
      </div>
    </div>
  );
};
