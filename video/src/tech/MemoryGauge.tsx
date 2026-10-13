import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {T, prog, pop} from './theme';
import {MemoryIcon} from './icons';

/**
 * Memory-usage-over-time explainer. Shows an example workload where usage
 * climbs (62% → 78% → 91%) and then *stays* high, teaching "look for
 * consistent pressure" rather than any universal threshold.
 */
export const MemoryGauge: React.FC<{
	/** Example readings, 0–100, sampled evenly across the chart. */
	samples?: number[];
	tasks?: string[];
	drawAt?: number;
	drawDur?: number;
	pressureAt?: number;
	contextAt?: number;
}> = ({
	samples = [38, 50, 62, 66, 78, 84, 91, 89, 92, 90, 91, 89],
	tasks = ['BROWSER', 'EMAIL', 'DOCS', 'VIDEO CALL'],
	drawAt = 0,
	drawDur = 70,
	pressureAt = 60,
	contextAt = 110,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const card = pop(frame, fps, drawAt - 6);
	const W = 840;
	const H = 250;
	const pts = samples.map((v, i) => [(i / (samples.length - 1)) * W, H - (v / 100) * H] as const);
	const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
	const area = `${d} L${W},${H} L0,${H} Z`;
	const draw = prog(frame, drawAt, drawDur);
	// current reading follows the drawing head
	const idx = draw * (samples.length - 1);
	const i0 = Math.floor(idx);
	const i1 = Math.min(samples.length - 1, i0 + 1);
	const value = Math.round(interpolate(idx - i0, [0, 1], [samples[i0], samples[i1]]));
	const headX = draw * W;
	const headY = H - (value / 100) * H;
	const band = prog(frame, pressureAt, 16);
	const bandX = (5.5 / (samples.length - 1)) * W;
	const ctx = (k: number) => prog(frame, contextAt + k * 5, 12);
	const hot = value >= 85;

	return (
		<div style={{fontFamily: T.font, opacity: card, transform: `translateY(${(1 - card) * 40}px)`}}>
			<div
				style={{
					background: T.white,
					borderRadius: 36,
					padding: '34px 36px 30px',
					boxShadow: '0 20px 60px rgba(26,29,97,0.12), 0 2px 6px rgba(26,29,97,0.06)',
					border: `1px solid ${T.line}`,
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 16, color: T.navy}}>
						<MemoryIcon size={46} color={T.indigo} />
						<div style={{fontSize: 30, fontWeight: 800, letterSpacing: 4}}>MEMORY IN USE</div>
					</div>
					<div
						style={{
							fontSize: 84,
							fontWeight: 900,
							letterSpacing: -3,
							fontVariantNumeric: 'tabular-nums',
							color: hot ? T.violet : T.navy,
						}}
					>
						{value}%
					</div>
				</div>
				<svg width={W} height={H + 10} style={{marginTop: 18, overflow: 'visible'}}>
					<defs>
						<linearGradient id="mg-line" x1="0" x2="1">
							<stop offset="0" stopColor={T.blue} />
							<stop offset="1" stopColor={T.violet} />
						</linearGradient>
						<linearGradient id="mg-area" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0" stopColor={T.indigo} stopOpacity="0.28" />
							<stop offset="1" stopColor={T.indigo} stopOpacity="0" />
						</linearGradient>
						<clipPath id="mg-clip">
							<rect x={0} y={-20} width={headX} height={H + 40} />
						</clipPath>
					</defs>
					{[0.25, 0.5, 0.75].map((g) => (
						<line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke={T.line} strokeWidth={2} />
					))}
					<line x1={0} x2={W} y1={H} y2={H} stroke="#CDD2DE" strokeWidth={2} />
					{/* sustained-pressure band (no numeric threshold on purpose) */}
					<rect x={bandX} y={0} width={(W - bandX) * band} height={H} fill="rgba(124,58,237,0.08)" rx={14} />
					<g clipPath="url(#mg-clip)">
						<path d={area} fill="url(#mg-area)" />
						<path d={d} fill="none" stroke="url(#mg-line)" strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
					</g>
					{draw > 0 && draw < 1.0001 && (
						<g>
							<circle cx={headX} cy={headY} r={20} fill={T.violet} opacity={0.18} />
							<circle cx={headX} cy={headY} r={10} fill={T.white} stroke={T.violet} strokeWidth={5} />
						</g>
					)}
				</svg>
				<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14}}>
					{tasks.map((t) => (
						<div key={t} style={{fontSize: 20, fontWeight: 700, letterSpacing: 2, color: T.muted}}>
							{t}
						</div>
					))}
				</div>
			</div>

			{/* LOOK FOR CONSISTENT PRESSURE tag */}
			<div
				style={{
					marginTop: 26,
					display: 'flex',
					alignItems: 'center',
					gap: 18,
					opacity: band,
					transform: `translateY(${(1 - band) * 20}px)`,
				}}
			>
				<div style={{width: 14, height: 70, borderRadius: 7, background: T.gradient}} />
				<div style={{fontSize: 40, fontWeight: 900, lineHeight: 1.05, color: T.navy, letterSpacing: -0.5}}>
					LOOK FOR
					<br />
					<span style={T.gradientText}>CONSISTENT PRESSURE</span>
				</div>
			</div>

			{/* diagnostic context: memory + paging/swap + workload */}
			<div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 26}}>
				{['MEMORY', '+', 'PAGING / SWAP', '+', 'WORKLOAD'].map((c, k) =>
					c === '+' ? (
						<div key={k} style={{fontSize: 34, fontWeight: 800, color: T.muted, opacity: ctx(k)}}>
							+
						</div>
					) : (
						<div
							key={k}
							style={{
								padding: '14px 22px',
								borderRadius: 999,
								background: T.navy,
								color: T.white,
								fontSize: 24,
								fontWeight: 800,
								letterSpacing: 2,
								opacity: ctx(k),
								transform: `scale(${0.9 + 0.1 * ctx(k)})`,
							}}
						>
							{c}
						</div>
					),
				)}
			</div>
		</div>
	);
};
