import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {T, SAFE, prog, pop} from '../tech/theme';
import {TechHostScene} from '../tech/TechHostScene';
import {KineticHeadline} from '../tech/KineticHeadline';
import {TechExplainerCard} from '../tech/TechExplainerCard';
import {MemoryGauge} from '../tech/MemoryGauge';
import {ResourceCard} from '../tech/ResourceCard';
import {AppVsSystem} from '../tech/AppVsSystem';
import {NoahUIFocus} from '../tech/NoahUIFocus';
import {ApprovalModalFocus} from '../tech/ApprovalModalFocus';
import {EducationalCTA} from '../tech/EducationalCTA';
import {CaptionTrack, Caption} from '../tech/CaptionTrack';
import {RamStick} from '../tech/RamStick';
import {CpuIcon, DriveIcon, ProcessesIcon, RocketIcon} from '../tech/icons';

/* ------------------------------------------------------------------ */
/* Timeline (frames @ 30fps), locked to the narration in audio/vo.wav  */
/* ------------------------------------------------------------------ */
export const S = {
	hook: [0, 105],
	mem: [105, 290],
	neq: [290, 375],
	res: [375, 591],
	app: [591, 800],
	bridge: [800, 852],
	diag: [840, 926], // overlaps bridge: Noah window rises over the creator
	plan: [926, 1004],
	cta: [1004, 1125],
} as const;
export const RAM_DURATION = 1125;

const len = (k: keyof typeof S) => S[k][1] - S[k][0];

const TOP_CAPTIONS: Caption[] = [
	{start: 0.0, end: 1.1, text: 'Your PC feels slow,'},
	{start: 1.1, end: 2.6, text: "so you're thinking about buying [MORE RAM?]"},
];

const CAPTIONS: Caption[] = [
	{start: 3.62, end: 5.55, text: 'Number one: is memory [actually the problem?]'},
	{start: 5.6, end: 7.2, text: 'If your memory usage is [consistently high]'},
	{start: 7.2, end: 8.55, text: "while you're doing normal tasks,"},
	{start: 8.55, end: 9.65, text: "that's useful evidence."},
	{start: 12.6, end: 14.6, text: 'Number two: check what else is [using resources.]'},
	{start: 14.6, end: 16.38, text: '[Startup apps,] [background processes,]'},
	{start: 16.38, end: 17.25, text: '[CPU activity,]'},
	{start: 17.25, end: 19.65, text: 'and [low free storage] can all contribute to a slow computer.'},
	{start: 19.75, end: 21.5, text: 'And number three: is [one app] slow,'},
	{start: 21.5, end: 22.85, text: 'or is [the entire PC] slow?'},
	{start: 22.85, end: 24.1, text: "If it's just one program,"},
	{start: 24.1, end: 26.6, text: '[troubleshoot that app] before assuming you need a hardware upgrade.'},
	{start: 26.7, end: 28.4, text: 'Instead of guessing what your PC needs,'},
	{start: 28.4, end: 29.6, text: "Noah can check [what's actually happening,]"},
	{start: 29.6, end: 30.9, text: 'explain what it finds,'},
	{start: 30.9, end: 33.35, text: 'and show you what it recommends [before you approve anything.]'},
];

/* ------------------------------- SFX ------------------------------- */
const SFX: [number, string, number][] = [
	[6, 'sfx-slide', 0.55],
	[79, 'sfx-tick', 0.5],
	[105, 'sfx-whoosh', 0.4],
	[108, 'sfx-tick', 0.45],
	[145, 'sfx-data', 0.4],
	[205, 'sfx-card', 0.35],
	[255, 'sfx-card', 0.3],
	[290, 'sfx-whoosh', 0.35],
	[314, 'sfx-hit', 0.5],
	[375, 'sfx-whoosh', 0.4],
	[378, 'sfx-tick', 0.45],
	[440, 'sfx-card', 0.4],
	[461, 'sfx-card', 0.4],
	[493, 'sfx-card', 0.4],
	[520, 'sfx-card', 0.4],
	[549, 'sfx-data', 0.35],
	[591, 'sfx-whoosh', 0.4],
	[594, 'sfx-tick', 0.45],
	[687, 'sfx-tick', 0.4],
	[695, 'sfx-tick', 0.4],
	[800, 'sfx-whoosh', 0.3],
	[840, 'sfx-whoosh', 0.45],
	[884, 'sfx-click', 0.4],
	[890, 'sfx-data', 0.3],
	[926, 'sfx-click', 0.45],
	[958, 'sfx-approve', 0.5],
	[992, 'sfx-tick', 0.35],
	[998, 'sfx-whoosh', 0.25],
	[1046, 'sfx-hit', 0.25],
];

const AudioTrack: React.FC = () => (
	<>
		<Audio src={staticFile('audio/vo.wav')} volume={1} />
		<Audio
			src={staticFile('audio/music-bed.wav')}
			volume={(f) => interpolate(f, [0, 15, 1000, 1010, 1095, 1125], [0, 0.085, 0.085, 0.12, 0.12, 0], {extrapolateRight: 'clamp'})}
		/>
		{SFX.map(([at, name, vol], i) => (
			<Sequence key={i} from={at} durationInFrames={60} layout="none">
				<Audio src={staticFile(`audio/${name}.wav`)} volume={vol} />
			</Sequence>
		))}
	</>
);

/* ------------------------------ Scene 1 ----------------------------- */
const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ram = pop(frame, fps, 6);
	const check = pop(frame, fps, 79);
	return (
		<TechHostScene src="host/host-hook.mp4" trimStart={0} pushFrom={1.02} pushTo={1.12} origin="50% 30%">
			<div
				style={{
					position: 'absolute',
					left: 20,
					top: 975,
					transform: `translateX(${(1 - ram) * -700}px) rotate(${-7 + (1 - ram) * -8}deg)`,
					filter: 'drop-shadow(0 24px 40px rgba(10,14,50,0.55))',
				}}
			>
				<RamStick width={470} />
			</div>
			<div style={{position: 'absolute', left: SAFE.left, top: 1105, width: SAFE.right - SAFE.left}}>
				<KineticHeadline
					shadow
					color={T.white}
					lines={[
						{text: 'BEFORE YOU BUY', size: 92, at: 4},
						{text: 'MORE RAM...', size: 128, accent: false, color: '#B9C2FF', at: 10},
					]}
				/>
			</div>
			<div style={{position: 'absolute', left: SAFE.left, top: 1365}}>
				<div
					style={{
						padding: '18px 32px',
						borderRadius: 18,
						background: T.gradient,
						color: T.white,
						fontFamily: T.font,
						fontSize: 58,
						fontWeight: 900,
						letterSpacing: -0.5,
						opacity: check,
						transform: `translateY(${(1 - check) * 30}px) scale(${0.92 + 0.08 * check})`,
						transformOrigin: 'left center',
						boxShadow: '0 16px 40px rgba(79,70,229,0.45)',
					}}
				>
					CHECK THIS FIRST.
				</div>
			</div>
			<CaptionTrack captions={TOP_CAPTIONS} y={250} />
		</TechHostScene>
	);
};

/* ------------------------------ Scene 2 ----------------------------- */
const Memory: React.FC = () => (
	<TechExplainerCard
		n="01"
		label="MEMORY"
		heading={[
			{text: 'IS MEMORY', size: 94},
			{text: 'ACTUALLY THE PROBLEM?', size: 72, accent: true},
		]}
	>
		<MemoryGauge drawAt={40} drawDur={72} pressureAt={98} contextAt={150} />
	</TechExplainerCard>
);

/* ------------------------------ Scene 3 ----------------------------- */
const NotEqual: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const p = prog(frame, 12, 18);
	// creator shrinks from full-frame into an inset above the statement
	const box = {
		left: interpolate(p, [0, 1], [0, 300]),
		top: interpolate(p, [0, 1], [0, 215]),
		w: interpolate(p, [0, 1], [width, 480]),
		h: interpolate(p, [0, 1], [height, 560]),
		r: interpolate(p, [0, 1], [0, 40]),
	};
	const neq = pop(frame, 30, 24);
	return (
		<AbsoluteFill style={{background: T.ink, fontFamily: T.font}}>
			<AbsoluteFill style={{background: 'radial-gradient(900px 900px at 50% 70%, rgba(79,70,229,0.35), transparent 65%)', opacity: p}} />
			<div
				style={{
					position: 'absolute',
					left: box.left,
					top: box.top,
					width: box.w,
					height: box.h,
					borderRadius: box.r,
					overflow: 'hidden',
					boxShadow: p > 0 ? `0 30px 80px rgba(0,0,0,${0.5 * p}), 0 0 0 ${3 * p}px rgba(169,180,255,0.5)` : undefined,
				}}
			>
				<OffthreadVideo
					src={staticFile('host/host-clarify.mp4')}
					muted
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 22%', transform: `scale(${interpolate(p, [0, 1], [1.04, 1.25])})`, transformOrigin: '50% 30%'}}
				/>
			</div>
			<div style={{position: 'absolute', top: 830, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<KineticHeadline align="center" color={T.white} lines={[{text: 'SLOW PC', size: 150, at: 16}]} />
				<div
					style={{
						fontSize: 230,
						fontWeight: 900,
						lineHeight: 0.95,
						...T.gradientText,
						opacity: neq,
						transform: `scale(${0.6 + 0.4 * neq})`,
						margin: '-6px 0 -2px',
					}}
				>
					≠
				</div>
				<KineticHeadline align="center" color={T.white} lines={[{text: 'NEEDS MORE RAM', size: 112, at: 32}]} />
			</div>
		</AbsoluteFill>
	);
};

/* ------------------------------ Scene 4 ----------------------------- */
const Resources: React.FC = () => {
	const frame = useCurrentFrame();
	const marks = [65, 86, 118, 145];
	const active = (i: number) => frame >= marks[i] && frame < (marks[i + 1] ?? 172);
	const whole = prog(frame, 172, 14);
	return (
		<TechExplainerCard
			n="02"
			label="SYSTEM RESOURCES"
			heading={[
				{text: 'WHAT ELSE', size: 94},
				{text: 'IS USING RESOURCES?', size: 78, accent: true},
			]}
		>
			<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22}}>
				<ResourceCard icon={<RocketIcon size={46} />} title="STARTUP APPS" sub="Launch at every boot" level={0.7} at={marks[0]} active={active(0)} />
				<ResourceCard icon={<ProcessesIcon size={46} />} title="BACKGROUND PROCESSES" sub="Running while you work" level={0.55} at={marks[1]} active={active(1)} />
				<ResourceCard icon={<CpuIcon size={46} />} title="CPU ACTIVITY" sub="How busy the processor is" level={0.82} at={marks[2]} active={active(2)} />
				<ResourceCard
					icon={<DriveIcon size={46} />}
					title="FREE STORAGE"
					sub="Space left on your drive"
					level={0.16}
					bar={`linear-gradient(90deg, ${T.amber}, #F59E0B)`}
					at={marks[3]}
					active={active(3)}
				/>
			</div>
			<div
				style={{
					marginTop: 30,
					display: 'flex',
					justifyContent: 'center',
					opacity: whole,
					transform: `translateY(${(1 - whole) * 20}px)`,
				}}
			>
				<div style={{fontFamily: T.font, fontSize: 50, fontWeight: 900, letterSpacing: -0.5, color: T.navy}}>
					CHECK THE <span style={T.gradientText}>WHOLE SYSTEM.</span>
				</div>
			</div>
		</TechExplainerCard>
	);
};

/* ------------------------------ Scene 5 ----------------------------- */
const AppOrPc: React.FC = () => (
	<TechExplainerCard
		n="03"
		label="APP OR PC?"
		heading={[
			{text: 'ONE APP', size: 94},
			{text: 'OR THE WHOLE PC?', size: 94, accent: true},
		]}
	>
		<AppVsSystem at={10} verdictAt={96} />
	</TechExplainerCard>
);

/* ------------------------------ Scene 6 ----------------------------- */
const Bridge: React.FC = () => (
	<TechHostScene src="host/host-transition.mp4" trimStart={0} pushFrom={1.06} pushTo={1.14} origin="50% 30%">
		<div style={{position: 'absolute', left: SAFE.left, top: 1060, width: SAFE.right - SAFE.left}}>
			<KineticHeadline
				shadow
				color={T.white}
				lines={[
					{text: "DON'T WANT TO", size: 100, at: 2},
					{text: 'GUESS?', size: 150, color: '#B9C2FF', at: 8},
				]}
			/>
		</div>
		<CaptionTrack captions={CAPTIONS} from={S.bridge[0]} />
	</TechHostScene>
);

/* --------------------------- Scenes 7 + 8 --------------------------- */
const VIEW = {w: 936, h: 900, left: 72, top: 470};
const IMG = {w: 1170, h: 977};

const SectionLabel: React.FC<{text: string; at: number; out?: number}> = ({text, at, out}) => {
	const frame = useCurrentFrame();
	const p = prog(frame, at, 12) * (out ? 1 - prog(frame, out, 8) : 1);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
			<div style={{width: 40, height: 5, borderRadius: 3, background: T.gradient}} />
			<div style={{fontFamily: T.font, fontSize: 34, fontWeight: 800, letterSpacing: 5, color: T.lavender}}>{text}</div>
		</div>
	);
};

const DarkStage: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{background: T.ink, fontFamily: T.font}}>
		<AbsoluteFill style={{background: 'radial-gradient(1000px 800px at 80% 0%, rgba(79,70,229,0.32), transparent 60%), radial-gradient(900px 700px at 0% 100%, rgba(37,99,235,0.22), transparent 60%)'}} />
		{children}
	</AbsoluteFill>
);

const Diagnosis: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	// first 12 frames: stage + window rise over the creator
	const rise = prog(frame, 0, 14);
	const bubble = pop(frame, fps, 8);
	const f1 = interpolate(frame, [30, 36], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const f2 = interpolate(frame, [30, 36, 46, 52], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const f3 = interpolate(frame, [46, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: rise}}>
			<DarkStage>
				<div style={{position: 'absolute', left: SAFE.left, top: 215, width: SAFE.right - SAFE.left}}>
					<SectionLabel text="YOU ASK NOAH" at={6} out={50} />
					<div style={{position: 'absolute', top: 0}}>
						<SectionLabel text="WHAT NOAH CHECKED" at={54} />
					</div>
					<div
						style={{
							marginTop: 26,
							display: 'inline-block',
							padding: '22px 30px',
							borderRadius: 26,
							background: '#2B2E38',
							border: '1px solid rgba(255,255,255,0.08)',
							color: '#F2F3F7',
							fontSize: 40,
							fontWeight: 600,
							lineHeight: 1.25,
							opacity: bubble,
							transform: `translateY(${(1 - bubble) * 20}px)`,
						}}
					>
						“My PC feels slow. Check what could be causing it.”
					</div>
				</div>
				<div style={{position: 'absolute', left: VIEW.left, top: VIEW.top, transform: `translateY(${(1 - rise) * 500}px)`}}>
					<div style={{position: 'relative', width: VIEW.w, height: VIEW.h}}>
						<div style={{position: 'absolute', inset: 0, opacity: f1}}>
							<NoahUIFocus src="noah-ui/noah-0585.jpeg" imgW={1170} imgH={989} viewW={VIEW.w} viewH={VIEW.h} keys={[{at: 0, x: 700, y: 260, zoom: 1.45}, {at: 36, x: 740, y: 280, zoom: 1.6}]} />
						</div>
						<div style={{position: 'absolute', inset: 0, opacity: f2}}>
							<NoahUIFocus src="noah-ui/noah-0586.jpeg" imgW={1170} imgH={985} viewW={VIEW.w} viewH={VIEW.h} keys={[{at: 30, x: 740, y: 280, zoom: 1.6}, {at: 52, x: 760, y: 300, zoom: 1.7}]} />
						</div>
						<div style={{position: 'absolute', inset: 0, opacity: f3}}>
							<NoahUIFocus
								src="noah-ui/noah-0588.jpeg"
								imgW={IMG.w}
								imgH={IMG.h}
								viewW={VIEW.w}
								viewH={VIEW.h}
								keys={[{at: 46, x: 740, y: 260, zoom: 1.5}, {at: 70, x: 748, y: 360, zoom: 1.75}]}
								spot={{x: 396, y: 322, w: 704, h: 108, at: 58}}
							/>
						</div>
					</div>
				</div>
				<CaptionTrack captions={CAPTIONS} from={S.diag[0]} />
			</DarkStage>
		</AbsoluteFill>
	);
};

const Plan: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const toModal = interpolate(frame, [30, 38], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const see = pop(frame, fps, 34);
	const you = pop(frame, fps, 44);
	return (
		<DarkStage>
			<div style={{position: 'absolute', left: SAFE.left, top: 215, width: SAFE.right - SAFE.left, height: 230}}>
				<SectionLabel text="WHAT NOAH WOULD DO" at={0} out={30} />
				<div style={{position: 'absolute', top: 0, display: 'flex', flexDirection: 'column', gap: 4}}>
					<div style={{fontSize: 92, fontWeight: 900, color: T.white, letterSpacing: -2.5, opacity: see, transform: `translateY(${(1 - see) * 24}px)`}}>SEE THE PLAN.</div>
					<div style={{fontSize: 92, fontWeight: 900, letterSpacing: -2.5, ...T.gradientText, opacity: you, transform: `translateY(${(1 - you) * 24}px)`}}>YOU DECIDE.</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: VIEW.left, top: VIEW.top}}>
				<div style={{position: 'relative', width: VIEW.w, height: VIEW.h}}>
					<div style={{position: 'absolute', inset: 0, opacity: 1 - toModal}}>
						<NoahUIFocus
							src="noah-ui/noah-0588.jpeg"
							imgW={IMG.w}
							imgH={IMG.h}
							viewW={VIEW.w}
							viewH={VIEW.h}
							keys={[{at: 0, x: 748, y: 330, zoom: 1.6}, {at: 18, x: 748, y: 610, zoom: 1.5}]}
							spot={{x: 396, y: 478, w: 708, h: 272, at: 12}}
						/>
					</div>
					<div style={{position: 'absolute', inset: 0, opacity: toModal, transform: `scale(${0.96 + 0.04 * toModal})`}}>
						<ApprovalModalFocus
							src="noah-ui/noah-0593.jpeg"
							imgW={1170}
							imgH={985}
							viewW={VIEW.w}
							viewH={VIEW.h}
							keys={[{at: 30, x: 586, y: 508, zoom: 1.55}, {at: 70, x: 586, y: 508, zoom: 1.7}]}
							modal={{x: 337, y: 382, w: 498, h: 254}}
							target={{x: 632, y: 604}}
							spotAt={32}
							cursorAt={38}
							cursorDur={28}
						/>
					</div>
				</div>
			</div>
			<CaptionTrack captions={CAPTIONS} from={S.plan[0]} />
		</DarkStage>
	);
};

/* ------------------------------ Scene 9 ----------------------------- */
const Cta: React.FC = () => (
	<EducationalCTA
		headline={[
			{text: "DON'T GUESS.", size: 124, at: 2},
			{text: 'CHECK FIRST.', size: 124, accent: true, at: 18},
		]}
		offer="FREE PC CHECK"
		url="onnoah.app"
		tagline="Describe it. Approve it. Done."
		offerAt={38}
	/>
);

/* ------------------------------ Master ------------------------------ */
const Seq: React.FC<{k: keyof typeof S; children: React.ReactNode}> = ({k, children}) => (
	<Sequence from={S[k][0]} durationInFrames={len(k)} name={k}>
		{children}
	</Sequence>
);

export const BeforeYouBuyMoreRam: React.FC = () => (
	<AbsoluteFill style={{background: T.ink}}>
		<Seq k="hook">
			<Hook />
		</Seq>
		<Seq k="mem">
			<Memory />
			<CaptionTrack captions={CAPTIONS} from={S.mem[0]} />
		</Seq>
		<Seq k="neq">
			<NotEqual />
		</Seq>
		<Seq k="res">
			<Resources />
			<CaptionTrack captions={CAPTIONS} from={S.res[0]} />
		</Seq>
		<Seq k="app">
			<AppOrPc />
			<CaptionTrack captions={CAPTIONS} from={S.app[0]} />
		</Seq>
		<Seq k="bridge">
			<Bridge />
		</Seq>
		<Seq k="diag">
			<Diagnosis />
		</Seq>
		<Seq k="plan">
			<Plan />
		</Seq>
		<Seq k="cta">
			<Cta />
		</Seq>
		<AudioTrack />
	</AbsoluteFill>
);
