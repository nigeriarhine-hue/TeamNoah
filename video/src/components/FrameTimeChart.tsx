import React from 'react';
import {c, ink, font} from '../theme';
import {seeded} from '../stage';

export type Trace = 'lowfps' | 'stutter' | 'fixed';

const SAMPLES = 120;
/** One shared y-scale in milliseconds. Every panel uses it, so the shapes are
 *  actually comparable — no second axis, ever. */
const Y_MAX = 100;

/** Frame times in ms. Deterministic, so frame N always renders identically. */
export const buildTrace = (kind: Trace): number[] => {
  const rand = seeded(kind === 'stutter' ? 7 : kind === 'lowfps' ? 23 : 91);
  const base = kind === 'lowfps' ? 41 : 16.7;
  const jitter = kind === 'lowfps' ? 1.6 : kind === 'stutter' ? 1.1 : 0.7;
  const out: number[] = [];
  for (let i = 0; i < SAMPLES; i++) out.push(base + (rand() - 0.5) * 2 * jitter);

  if (kind === 'stutter') {
    // a hitch every ~0.7s: one long frame, then two recovering ones
    for (const {at, peak} of [
      {at: 19, peak: 84},
      {at: 45, peak: 96},
      {at: 72, peak: 88},
      {at: 99, peak: 92},
    ]) {
      out[at] = peak;
      out[at + 1] = base + (peak - base) * 0.34;
      out[at + 2] = base + (peak - base) * 0.12;
    }
  }
  return out;
};

export const SPIKES = [19, 45, 72, 99];

type Props = {
  kind: Trace;
  width: number;
  height: number;
  u: number;
  /** 0→1 wipe-in of the trace */
  progress?: number;
  title: string;
  /** the sentence that carries the meaning — the colour never carries it alone */
  caption: React.ReactNode;
  /** annotate the worst hitch with a direct label (relief for the amber contrast) */
  annotate?: boolean;
  /** draw the previous state behind, on the same axis, so the change is readable */
  ghost?: Trace;
};

export const FrameTimeChart: React.FC<Props> = ({
  kind,
  width,
  height,
  u,
  progress = 1,
  title,
  caption,
  annotate = false,
  ghost,
}) => {
  const data = React.useMemo(() => buildTrace(kind), [kind]);
  const ghostData = React.useMemo(() => (ghost ? buildTrace(ghost) : null), [ghost]);
  const padL = 14 * u;
  const padR = 66 * u;
  const padT = 52 * u;
  const padB = 14 * u;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const x = (i: number) => padL + (i / (SAMPLES - 1)) * plotW;
  const y = (ms: number) => padT + plotH - Math.min(ms, Y_MAX) / Y_MAX * plotH;

  const shown = Math.max(2, Math.round(SAMPLES * progress));
  const line = data
    .slice(0, shown)
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(v).toFixed(2)}`)
    .join(' ');
  const area = `${line} L${x(shown - 1).toFixed(2)},${(padT + plotH).toFixed(2)} L${x(0).toFixed(
    2,
  )},${(padT + plotH).toFixed(2)} Z`;

  const ghostLine = ghostData
    ? ghostData
        .slice(0, shown)
        .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(v).toFixed(2)}`)
        .join(' ')
    : null;

  const stroke = kind === 'fixed' ? c.teal : c.litHorizon;
  const fill = kind === 'fixed' ? 'rgba(20,184,166,0.13)' : 'rgba(199,203,255,0.06)';

  // reference lines readers actually know: the 60 fps and 30 fps budgets
  const refs = [
    {ms: 16.7, label: '60 fps'},
    {ms: 33.3, label: '30 fps'},
  ];

  const worst = annotate ? SPIKES.find((i) => i < shown && i === 45) : undefined;

  return (
    <div style={{width}}>
      <svg width={width} height={height} style={{display: 'block', overflow: 'visible'}}>
        <text
          x={padL}
          y={20 * u}
          fill={ink.primary}
          fontFamily={font.body}
          fontWeight={700}
          fontSize={24 * u}
          letterSpacing="-0.02em"
        >
          {title}
        </text>
        <text
          x={padL}
          y={41 * u}
          fill={ink.muted}
          fontFamily={font.mono}
          fontSize={16 * u}
          letterSpacing="0.06em"
        >
          FRAME TIME · MS
        </text>

        {/* recessive reference grid */}
        {refs.map((r) => (
          <g key={r.label}>
            <line
              x1={padL}
              x2={padL + plotW}
              y1={y(r.ms)}
              y2={y(r.ms)}
              stroke={ink.grid}
              strokeWidth={1}
              strokeDasharray="4 5"
            />
            <text
              x={padL + plotW + 10 * u}
              y={y(r.ms) + 6 * u}
              fill={ink.muted}
              fontFamily={font.mono}
              fontSize={16 * u}
            >
              {r.label}
            </text>
          </g>
        ))}
        <line
          x1={padL}
          x2={padL + plotW}
          y1={padT + plotH}
          y2={padT + plotH}
          stroke={ink.hairline}
          strokeWidth={1}
        />

        {/* the same measurement, before — same axis, so the shapes compare honestly */}
        {ghostLine ? (
          <g>
            <path
              d={ghostLine}
              fill="none"
              stroke="rgba(236,232,223,0.26)"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            <text
              x={x(19) + 10 * u}
              y={y(84) - 8 * u}
              fill={ink.muted}
              fontFamily={font.mono}
              fontSize={17 * u}
            >
              before
            </text>
          </g>
        ) : null}

        <path d={area} fill={fill} />
        <path
          d={line}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* two series on one axis are both named, so identity is never colour alone */}
        {ghostLine ? (
          <text
            x={x(shown - 1)}
            y={y(data[shown - 1]) - 14 * u}
            textAnchor="end"
            fill={c.teal}
            fontFamily={font.mono}
            fontWeight={500}
            fontSize={17 * u}
          >
            after
          </text>
        ) : null}

        {/* the hitch, named in words and numbers — never by colour alone */}
        {worst !== undefined ? (
          <g>
            <circle cx={x(worst)} cy={y(data[worst])} r={5 * u} fill={c.amber} />
            <line
              x1={x(worst)}
              x2={x(worst)}
              y1={y(data[worst]) - 9 * u}
              y2={y(data[worst]) - 24 * u}
              stroke={c.amber}
              strokeWidth={1.5}
            />
            <text
              x={x(worst) + 9 * u}
              y={y(data[worst]) - 26 * u}
              fill={ink.primary}
              fontFamily={font.mono}
              fontWeight={500}
              fontSize={18 * u}
            >
              96 ms — one frame
            </text>
          </g>
        ) : null}
      </svg>
      <div
        style={{
          marginTop: 14 * u,
          fontFamily: font.body,
          fontSize: 23 * u,
          lineHeight: 1.4,
          color: ink.secondary,
          maxWidth: width,
        }}
      >
        {caption}
      </div>
    </div>
  );
};
