import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {T} from '../tech/theme';
import {RamStick} from '../tech/RamStick';
import {MemoryIcon} from '../tech/icons';

/** Small static memory card used on both thumbnails. */
const MemoryCard: React.FC<{scale?: number}> = ({scale = 1}) => {
	const vals = [40, 52, 63, 70, 79, 86, 91, 89, 92];
	const W = 300;
	const H = 110;
	const d = vals.map((v, i) => `${i ? 'L' : 'M'}${(i / (vals.length - 1)) * W},${H - (v / 100) * H}`).join(' ');
	return (
		<div
			style={{
				background: T.white,
				borderRadius: 30,
				padding: '24px 28px',
				boxShadow: '0 24px 60px rgba(26,29,97,0.22)',
				border: `1px solid ${T.line}`,
				transform: `scale(${scale})`,
				transformOrigin: 'top left',
				fontFamily: T.font,
				width: W + 56,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
					<MemoryIcon size={36} color={T.indigo} />
					<div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, color: T.navy}}>MEMORY</div>
				</div>
				<div style={{fontSize: 56, fontWeight: 900, letterSpacing: -2, color: T.violet}}>91%</div>
			</div>
			<svg width={W} height={H + 6} style={{marginTop: 10, overflow: 'visible'}}>
				<defs>
					<linearGradient id="th-l" x1="0" x2="1">
						<stop offset="0" stopColor={T.blue} />
						<stop offset="1" stopColor={T.violet} />
					</linearGradient>
				</defs>
				<path d={`${d} L${W},${H} L0,${H} Z`} fill="rgba(79,70,229,0.14)" />
				<path d={d} stroke="url(#th-l)" strokeWidth={7} fill="none" strokeLinejoin="round" strokeLinecap="round" />
			</svg>
		</div>
	);
};

const SmallBrand: React.FC<{size?: number}> = ({size = 44}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: T.font}}>
		<Img src={staticFile('brand/noah-mark-light.svg')} style={{width: size, height: size}} />
		<div style={{fontSize: size * 0.62, fontWeight: 800, color: T.navy, letterSpacing: -0.3}}>Noah</div>
	</div>
);

const Backdrop: React.FC = () => (
	<>
		<AbsoluteFill style={{background: '#EEF0F7'}} />
		<AbsoluteFill
			style={{
				background:
					'radial-gradient(900px 900px at 85% 70%, rgba(124,58,237,0.28), transparent 60%), radial-gradient(800px 800px at 10% 20%, rgba(37,99,235,0.16), transparent 60%)',
			}}
		/>
		<AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(26,29,97,0.08) 2px, transparent 2px)', backgroundSize: '40px 40px'}} />
	</>
);

/** 1080x1920 Shorts thumbnail. */
export const RamThumbnail: React.FC = () => (
	<AbsoluteFill style={{fontFamily: T.font, overflow: 'hidden'}}>
		<Backdrop />
		<Img
			src={staticFile('characters/tech-host-asian-male-cutout.png')}
			style={{position: 'absolute', left: 200, top: 640, width: 1000, height: 1787, objectFit: 'cover'}}
		/>
		<div style={{position: 'absolute', left: 70, top: 210}}>
			<div style={{fontSize: 112, fontWeight: 900, letterSpacing: -4, lineHeight: 0.95, color: T.ink}}>BEFORE YOU BUY</div>
			<div style={{fontSize: 146, fontWeight: 900, letterSpacing: -6, lineHeight: 1.05, whiteSpace: 'nowrap', ...T.gradientText}}>MORE RAM...</div>
			<div
				style={{
					marginTop: 22,
					display: 'inline-block',
					padding: '18px 34px',
					borderRadius: 20,
					background: T.navy,
					color: T.white,
					fontSize: 70,
					fontWeight: 900,
					letterSpacing: -1,
				}}
			>
				CHECK THIS FIRST
			</div>
		</div>
		<div style={{position: 'absolute', left: 20, top: 740, transform: 'rotate(-10deg)', filter: 'drop-shadow(0 30px 40px rgba(26,29,97,0.35))'}}>
			<RamStick width={620} />
		</div>
		<div style={{position: 'absolute', left: 60, top: 1080}}>
			<MemoryCard scale={1.15} />
		</div>
		<div style={{position: 'absolute', left: 70, bottom: 70, background: 'rgba(255,255,255,0.85)', padding: '10px 18px', borderRadius: 999}}>
			<SmallBrand size={40} />
		</div>
	</AbsoluteFill>
);

/** 1280x720 standard YouTube thumbnail. */
export const RamThumbnail16x9: React.FC = () => (
	<AbsoluteFill style={{fontFamily: T.font, overflow: 'hidden'}}>
		<Backdrop />
		<Img
			src={staticFile('characters/tech-host-asian-male-cutout.png')}
			style={{position: 'absolute', left: 760, top: 30, width: 560, height: 1000, objectFit: 'cover'}}
		/>
		<div style={{position: 'absolute', left: 56, top: 56}}>
			<div style={{fontSize: 74, fontWeight: 900, letterSpacing: -2.5, lineHeight: 0.98, color: T.ink}}>BEFORE YOU BUY</div>
			<div style={{fontSize: 118, fontWeight: 900, letterSpacing: -4.5, lineHeight: 1.0, ...T.gradientText}}>MORE RAM...</div>
			<div
				style={{
					marginTop: 14,
					display: 'inline-block',
					padding: '12px 24px',
					borderRadius: 14,
					background: T.navy,
					color: T.white,
					fontSize: 46,
					fontWeight: 900,
					letterSpacing: -0.5,
				}}
			>
				CHECK THIS FIRST
			</div>
		</div>
		<div style={{position: 'absolute', left: 40, top: 440, transform: 'rotate(-8deg)', filter: 'drop-shadow(0 20px 30px rgba(26,29,97,0.35))'}}>
			<RamStick width={400} />
		</div>
		<div style={{position: 'absolute', left: 470, top: 410}}>
			<MemoryCard scale={0.78} />
		</div>
		<div style={{position: 'absolute', right: 24, bottom: 20, background: 'rgba(255,255,255,0.85)', padding: '6px 14px', borderRadius: 999}}>
			<SmallBrand size={30} />
		</div>
	</AbsoluteFill>
);
