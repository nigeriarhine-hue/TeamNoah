import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {T, pop, prog} from './theme';
import {KineticHeadline, HeadlineLine} from './KineticHeadline';

/**
 * Editorial end card: the lesson as a headline, then the offer and URL,
 * with the official Noah mark shown once.
 */
export const EducationalCTA: React.FC<{
	headline: HeadlineLine[];
	offer: string;
	url: string;
	tagline: string;
	offerAt: number;
	logoSrc?: string;
}> = ({headline, offer, url, tagline, offerAt, logoSrc = 'brand/noah-mark-light.svg'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const o = pop(frame, fps, offerAt);
	const u = prog(frame, offerAt + 8, 14);
	const tg = prog(frame, offerAt + 18, 14);
	return (
		<AbsoluteFill style={{background: T.white, fontFamily: T.font}}>
			<AbsoluteFill
				style={{background: 'radial-gradient(1000px 800px at 50% 0%, rgba(124,58,237,0.10), transparent 60%), radial-gradient(900px 700px at 50% 100%, rgba(37,99,235,0.08), transparent 60%)'}}
			/>
			<div style={{position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<KineticHeadline lines={headline} align="center" stagger={8} />
			</div>
			<div style={{position: 'absolute', top: 820, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 22,
						padding: '22px 40px 22px 26px',
						borderRadius: 999,
						background: T.navy,
						opacity: o,
						transform: `scale(${0.9 + 0.1 * o})`,
						boxShadow: '0 20px 50px rgba(26,29,97,0.25)',
					}}
				>
					<div style={{width: 74, height: 74, borderRadius: 37, background: T.white, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Img src={staticFile(logoSrc)} style={{width: 62, height: 62}} />
					</div>
					<div style={{color: T.white, fontSize: 52, fontWeight: 900, letterSpacing: 1}}>{offer}</div>
				</div>
				<div style={{fontSize: 72, fontWeight: 900, letterSpacing: -2, ...T.gradientText, opacity: u, transform: `translateY(${(1 - u) * 20}px)`}}>{url}</div>
				<div style={{fontSize: 34, fontWeight: 600, color: T.muted, letterSpacing: 0.5, opacity: tg}}>{tagline}</div>
			</div>
		</AbsoluteFill>
	);
};
