import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {T, SAFE} from './theme';
import {EducationalNumber} from './EducationalNumber';
import {KineticHeadline, HeadlineLine} from './KineticHeadline';

/**
 * Standard numbered explainer layout: clean light canvas, chapter number,
 * a two-line question heading, and a body slot for the teaching graphic.
 */
export const TechExplainerCard: React.FC<{
	n: string;
	label: string;
	heading: HeadlineLine[];
	children?: React.ReactNode;
	dark?: boolean;
}> = ({n, label, heading, children, dark = false}) => {
	const frame = useCurrentFrame();
	const drift = interpolate(frame, [0, 300], [0, -40]);
	return (
		<AbsoluteFill style={{background: dark ? T.ink : T.paper, fontFamily: T.font}}>
			{/* soft brand glow + dot grid, kept very quiet */}
			<AbsoluteFill
				style={{
					background: dark
						? 'radial-gradient(900px 700px at 85% 10%, rgba(79,70,229,0.35), transparent 60%)'
						: 'radial-gradient(900px 700px at 90% 5%, rgba(124,58,237,0.10), transparent 60%), radial-gradient(800px 600px at 0% 100%, rgba(37,99,235,0.08), transparent 60%)',
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundImage: `radial-gradient(${dark ? 'rgba(255,255,255,0.06)' : 'rgba(26,29,97,0.07)'} 2px, transparent 2px)`,
					backgroundSize: '44px 44px',
					backgroundPosition: `0 ${drift}px`,
				}}
			/>
			<div style={{position: 'absolute', left: SAFE.left, top: SAFE.top + 10, width: SAFE.right - SAFE.left}}>
				<EducationalNumber n={n} label={label} at={2} dark={dark} />
				<div style={{height: 26}} />
				<KineticHeadline lines={heading} color={dark ? T.white : T.ink} stagger={5} />
			</div>
			<div style={{position: 'absolute', left: SAFE.left, top: 650, width: SAFE.right - SAFE.left, height: 700}}>{children}</div>
		</AbsoluteFill>
	);
};
