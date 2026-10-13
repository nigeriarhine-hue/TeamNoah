import {Easing, continueRender, delayRender, interpolate, spring, staticFile} from 'remotion';

// Inter (SIL OFL) is bundled in public/fonts so renders never depend on network font hosts.
const fontFamily = 'NoahInter';
const WEIGHTS: [string, string][] = [
	['400', 'Regular'],
	['500', 'Medium'],
	['600', 'SemiBold'],
	['700', 'Bold'],
	['800', 'ExtraBold'],
	['900', 'Black'],
];
if (typeof document !== 'undefined') {
	const handle = delayRender('Loading Inter');
	Promise.all(
		WEIGHTS.map(([weight, name]) => {
			const face = new FontFace(fontFamily, `url(${staticFile(`fonts/Inter-${name}.otf`)}) format('opentype')`, {weight});
			document.fonts.add(face);
			return face.load();
		}),
	)
		.then(() => continueRender(handle))
		.catch((e) => {
			console.error(e);
			continueRender(handle);
		});
}

/** Noah tech-content design tokens (from brand-kit.html / brand-pack). */
export const T = {
	font: fontFamily,
	navy: '#1A1D61',
	ink: '#0B1024',
	ink2: '#21252C',
	blue: '#2563EB',
	indigo: '#4F46E5',
	violet: '#7C3AED',
	lavender: '#C7CBFF',
	paper: '#F4F5F9',
	white: '#FFFFFF',
	line: '#E3E6EE',
	muted: '#7A8290',
	slate: '#4A5263',
	amber: '#D97706',
	teal: '#0D9488',
	red: '#DC4A4A',
	gradient: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
	gradientText: {
		background: 'linear-gradient(90deg, #3B6CF0 0%, #7C3AED 100%)',
		WebkitBackgroundClip: 'text',
		backgroundClip: 'text',
		color: 'transparent',
	} as React.CSSProperties,
};

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

/** Shorts / TikTok safe content box for a 1080x1920 frame. */
export const SAFE = {left: 72, right: 960, top: 190, bottom: 1520};

export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** 0→1 eased progress between two frames. */
export const prog = (frame: number, from: number, dur: number) =>
	interpolate(frame, [from, from + dur], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: ease,
	});

export const pop = (frame: number, fps: number, delay = 0) =>
	spring({frame: frame - delay, fps, config: {damping: 18, stiffness: 160, mass: 0.7}});

/** Fade/slide-in style for a block that enters at `at` frames. */
export const enter = (frame: number, at: number, dist = 40, dur = 14): React.CSSProperties => {
	const p = prog(frame, at, dur);
	return {opacity: p, transform: `translateY(${(1 - p) * dist}px)`};
};
