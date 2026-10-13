import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {T, pop, prog} from './theme';
import {ArrowRight, CheckIcon} from './icons';

/**
 * Split comparison: one slow app vs. the whole PC being slow, followed by
 * the matching next step for each case.
 */
const Spinner: React.FC<{frame: number; color: string; size?: number}> = ({frame, color, size = 34}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" style={{transform: `rotate(${frame * 14}deg)`}}>
		<circle cx="12" cy="12" r="9" stroke="rgba(0,0,0,0.08)" strokeWidth="3.2" fill="none" />
		<path d="M12 3a9 9 0 0 1 9 9" stroke={color} strokeWidth="3.2" fill="none" strokeLinecap="round" />
	</svg>
);

const AppTile: React.FC<{slow: boolean; frame: number; label: string; delay: number}> = ({slow, frame, label, delay}) => {
	const p = prog(frame, delay, 10);
	// slow apps "hang": their content bars stall and fade
	const hang = slow ? 0.35 + 0.15 * Math.sin(frame / 9) : 1;
	return (
		<div
			style={{
				background: T.white,
				borderRadius: 18,
				border: `2px solid ${slow ? 'rgba(217,119,6,0.55)' : T.line}`,
				padding: 14,
				opacity: p,
				transform: `scale(${0.9 + 0.1 * p})`,
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				height: 150,
				position: 'relative',
			}}
		>
			<div style={{display: 'flex', gap: 6}}>
				{[0, 1, 2].map((k) => (
					<div key={k} style={{width: 10, height: 10, borderRadius: 5, background: '#D9DCE5'}} />
				))}
			</div>
			<div style={{fontSize: 18, fontWeight: 800, color: T.slate, letterSpacing: 1}}>{label}</div>
			<div style={{height: 10, width: '80%', borderRadius: 5, background: '#E7E9F0', opacity: hang}} />
			<div style={{height: 10, width: '55%', borderRadius: 5, background: '#E7E9F0', opacity: hang}} />
			<div style={{position: 'absolute', right: 12, bottom: 12}}>
				{slow ? (
					<Spinner frame={frame} color={T.amber} />
				) : (
					<div style={{width: 34, height: 34, borderRadius: 17, background: 'rgba(13,148,136,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<CheckIcon size={22} color={T.teal} stroke={3} />
					</div>
				)}
			</div>
		</div>
	);
};

const Panel: React.FC<{title: string; slow: boolean[]; at: number; frame: number; fps: number; tone: string}> = ({title, slow, at, frame, fps, tone}) => {
	const s = pop(frame, fps, at);
	const labels = ['BROWSER', 'EDITOR', 'MUSIC', 'FILES'];
	return (
		<div
			style={{
				flex: 1,
				background: 'rgba(255,255,255,0.65)',
				border: `1px solid ${T.line}`,
				borderRadius: 30,
				padding: 22,
				opacity: s,
				transform: `translateY(${(1 - s) * 40}px)`,
			}}
		>
			<div style={{fontSize: 36, fontWeight: 900, color: tone, letterSpacing: -0.5, marginBottom: 16}}>{title}</div>
			<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
				{slow.map((sl, k) => (
					<AppTile key={k} slow={sl} frame={frame} label={labels[k]} delay={at + 4 + k * 3} />
				))}
			</div>
		</div>
	);
};

export const AppVsSystem: React.FC<{at?: number; verdictAt: number}> = ({at = 0, verdictAt}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const v1 = prog(frame, verdictAt, 14);
	const v2 = prog(frame, verdictAt + 8, 14);
	const Verdict: React.FC<{p: number; a: string; b: string; strong?: boolean}> = ({p, a, b, strong}) => (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				background: strong ? T.navy : T.white,
				color: strong ? T.white : T.ink,
				border: strong ? 'none' : `1px solid ${T.line}`,
				borderRadius: 24,
				padding: '20px 26px',
				opacity: p,
				transform: `translateX(${(1 - p) * -40}px)`,
				boxShadow: '0 12px 34px rgba(26,29,97,0.10)',
			}}
		>
			<div style={{fontSize: 30, fontWeight: 900, width: 220, letterSpacing: -0.3}}>{a}</div>
			<ArrowRight size={40} color={strong ? T.lavender : T.indigo} stroke={2.6} />
			<div style={{fontSize: 30, fontWeight: 800, letterSpacing: -0.3, ...(strong ? {} : {color: T.indigo})}}>{b}</div>
		</div>
	);
	return (
		<div style={{fontFamily: T.font, display: 'flex', flexDirection: 'column', gap: 26}}>
			<div style={{display: 'flex', gap: 20}}>
				<Panel title="ONE APP" slow={[false, true, false, false]} at={at} frame={frame} fps={fps} tone={T.ink} />
				<Panel title="WHOLE PC" slow={[true, true, true, true]} at={at + 10} frame={frame} fps={fps} tone={T.ink} />
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
				<Verdict p={v1} a="ONE APP" b="TROUBLESHOOT THE APP" />
				<Verdict p={v2} a="WHOLE PC" b="INVESTIGATE THE SYSTEM" strong />
			</div>
		</div>
	);
};
