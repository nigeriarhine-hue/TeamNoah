import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import timing from '../../public/vo/mascot-login/timing.json';
import {Mascot, MascotExpression, MascotPose} from '../components/Mascot';
import {AppGlyph} from '../components/PcGraphics';
import {Caption, clamp, NoahMark, useSpring} from '../components/ui';
import type {AppIconName} from '../series/types';
import {AURORA, C, SANS} from '../theme';

// 15s Short starring the Noah robot mascot: "Slow every time it starts".
// The mascot is silent (Noah is always third person); the narrator speaks.
// Layout stays inside the mobile safe area (x 60–920, y 150–1500).

export const MASCOT_LOGIN_FRAMES = 450;

const L = timing.lines;
const T = {
  slow: L[0].startFrame,
  hop: L[1].startFrame - 8,
  apps: L[2].startFrame,
  plan: L[3].startFrame - 2,
  approve: L[4].startFrame,
  click: L[4].startFrame + 20,
  end: L[5].startFrame - 6,
};

const CAPTIONS = [
  {text: 'Your Mac is slow every time it starts.', from: L[0].startFrame, to: L[0].endFrame + 8, emphasis: ['slow']},
  {text: 'Noah checks what’s actually wrong.', from: L[1].startFrame, to: L[1].endFrame + 8, emphasis: ['actually', 'wrong.']},
  {text: 'Nine apps open at login.', from: L[2].startFrame, to: L[2].endFrame + 10, emphasis: ['Nine']},
  {text: 'Noah shows the plan first.', from: L[3].startFrame, to: L[3].endFrame + 10, emphasis: ['plan']},
  {text: 'Nothing runs until you approve.', from: L[4].startFrame, to: L[4].endFrame + 10, emphasis: ['approve.']},
];

const APPS: {icon: AppIconName; x: number; y: number}[] = [
  {icon: 'browser', x: 520, y: 840},
  {icon: 'chat', x: 650, y: 800},
  {icon: 'music', x: 780, y: 850},
  {icon: 'games', x: 560, y: 960},
  {icon: 'cloud', x: 700, y: 930},
  {icon: 'office', x: 830, y: 980},
  {icon: 'meeting', x: 520, y: 1080},
  {icon: 'updater', x: 660, y: 1060},
  {icon: 'utility', x: 800, y: 1100},
];
const HEAVY = [0, 3, 6, 7]; // the four Noah proposes turning off

/* ---------- the Mac (generic all-in-one, no logos) ---------- */
const MacDisplay: React.FC = () => {
  const frame = useCurrentFrame();
  const slowEnd = T.approve + 30;
  const loading = frame < slowEnd;
  const bar = loading ? Math.min(0.35, (frame / 30) * 0.06) : interpolate(frame, [slowEnd, slowEnd + 12], [0.35, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 140, top: 200}}>
      <div style={{width: 800, height: 520, borderRadius: 30, background: 'linear-gradient(180deg,#F1F2F5,#D9DBE1)', padding: 18, boxShadow: '0 30px 60px -24px rgba(15,23,41,.5)'}}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 14,
            overflow: 'hidden',
            position: 'relative',
            background:
              'radial-gradient(70% 60% at 25% 30%, rgba(255,140,90,.8), rgba(255,140,90,0) 60%), radial-gradient(70% 60% at 80% 60%, rgba(124,58,237,.9), rgba(124,58,237,0) 65%), linear-gradient(160deg,#312E81,#1E1B4B)',
          }}
        >
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 26, background: 'rgba(255,255,255,.25)'}} />
          <div style={{position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)', width: 320, height: 40, borderRadius: 14, background: 'rgba(255,255,255,.3)'}} />
          {/* start-up progress */}
          <div style={{position: 'absolute', left: 150, right: 150, top: 300, height: 12, borderRadius: 6, background: 'rgba(255,255,255,.25)'}}>
            <div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 6, background: 'white'}} />
          </div>
          {loading && (
            <div
              style={{
                position: 'absolute',
                left: 342,
                top: 170,
                width: 80,
                height: 80,
                borderRadius: 40,
                background: 'conic-gradient(#F43F5E,#F59E0B,#FACC15,#22C55E,#06B6D4,#3B82F6,#8B5CF6,#EC4899,#F43F5E)',
                transform: `rotate(${frame * 14}deg)`,
                boxShadow: '0 4px 10px rgba(0,0,0,.35)',
              }}
            />
          )}
          {!loading && (
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 64, color: 'white', opacity: interpolate(frame, [slowEnd + 8, slowEnd + 16], [0, 1], clamp)}}>
              Ready.
            </div>
          )}
        </div>
      </div>
      <div style={{margin: '0 auto', width: 130, height: 90, background: 'linear-gradient(#D4D6DC,#B9BCC4)', clipPath: 'polygon(25% 0,75% 0,90% 100%,10% 100%)'}} />
      <div style={{margin: '0 auto', width: 260, height: 14, borderRadius: 7, background: '#B9BCC4'}} />
    </div>
  );
};

/* ---------- the nine login apps ---------- */
const LoginApps: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.apps) return null;
  const count = Math.min(9, Math.floor((frame - T.apps) / 4) + 1);
  return (
    <>
      {APPS.map((a, i) => {
        const t0 = T.apps + i * 4;
        const p = interpolate(frame, [t0, t0 + 10], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
        const heavy = HEAVY.includes(i);
        const leave = heavy ? interpolate(frame, [T.click + 4 + i, T.click + 16 + i], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)}) : 0;
        const jitter = frame < T.plan ? Math.sin((frame + i * 7) / 2.2) * 3 : 0;
        // fly out of the screen centre
        const x = 540 + (a.x - 540) * p + leave * 300;
        const y = 460 + (a.y - 460) * p - leave * 120;
        const flagged = frame >= T.plan && heavy;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - 46,
              top: y - 46 + jitter,
              opacity: p * (1 - leave) * interpolate(frame, [T.end - 4, T.end + 6], [1, 0], clamp),
              transform: `scale(${0.4 + 0.6 * p})`,
            }}
          >
            <div style={{borderRadius: 26, boxShadow: flagged ? '0 0 0 6px rgba(217,119,6,.55)' : undefined}}>
              <AppGlyph name={a.icon} size={92} />
            </div>
          </div>
        );
      })}
      {/* counter */}
      <div
        style={{
          position: 'absolute',
          left: 500,
          top: 1180,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 46,
          color: 'white',
          background: '#D97706',
          borderRadius: 16,
          padding: '8px 18px',
          opacity: frame < T.approve + 30 ? 1 : interpolate(frame, [T.approve + 30, T.approve + 40], [1, 0], clamp),
        }}
      >
        {count} apps at login
      </div>
    </>
  );
};

/* ---------- Noah approval card ---------- */
const Approval: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(T.plan + 6, {damping: 14, stiffness: 170, mass: 0.7});
  const press = interpolate(frame, [T.click - 2, T.click + 2, T.click + 8], [0, 1, 0], clamp);
  const done = frame >= T.click + 4;
  const out = interpolate(frame, [T.end - 6, T.end + 2], [1, 0], clamp);
  if (frame < T.plan) return null;
  const cx = interpolate(frame, [T.approve - 4, T.click], [900, 760], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cy = interpolate(frame, [T.approve - 4, T.click], [1480, 1352], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 470,
          width: 450,
          top: 1170,
          borderRadius: 28,
          background: 'white',
          border: `1px solid ${C.line2}`,
          boxShadow: '0 26px 60px -22px rgba(15,23,41,.5)',
          padding: '20px 22px',
          fontFamily: SANS,
          opacity: p * out,
          transform: `translateY(${(1 - p) * 60}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <NoahMark size={36} />
          <span style={{fontSize: 28, fontWeight: 800, color: C.ink}}>Can Noah do this?</span>
        </div>
        <div style={{fontSize: 23, fontWeight: 600, color: C.ink2, margin: '8px 0 14px'}}>Turn off 4 heavy login items. Reversible.</div>
        {!done ? (
          <div style={{display: 'flex', gap: 10}}>
            <div style={{flex: 1, textAlign: 'center', fontSize: 23, fontWeight: 700, color: C.ink2, border: `2px solid ${C.line2}`, borderRadius: 14, padding: '10px 0'}}>No thanks</div>
            <div style={{flex: 1, textAlign: 'center', fontSize: 23, fontWeight: 800, color: 'white', backgroundImage: AURORA, borderRadius: 14, padding: '10px 0', transform: `scale(${1 - 0.06 * press})`, boxShadow: `0 0 0 ${8 * press}px rgba(79,70,229,.25)`}}>
              Go ahead
            </div>
          </div>
        ) : (
          <div style={{fontSize: 26, fontWeight: 800, color: C.commit, padding: '8px 0'}}>✓ Done · logged · reversible</div>
        )}
      </div>
      {frame >= T.approve - 4 && frame < T.click + 12 && (
        <svg style={{position: 'absolute', left: cx, top: cy}} width={44} height={54} viewBox="0 0 23 28">
          <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18 15.8 Z" fill="white" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      )}
    </>
  );
};

/* ---------- the robot ---------- */
const Robot: React.FC = () => {
  const frame = useCurrentFrame();
  const hop = useSpring(T.hop, {damping: 11, stiffness: 150, mass: 0.8});
  if (frame < T.hop - 2) return null;
  const bob = Math.sin(frame / 12) * 6;
  const bt = (frame + 11) % 95;
  const blink = bt < 5 ? interpolate(bt, [0, 2, 5], [1, 0.1, 1], clamp) : 1;
  let expression: MascotExpression = 'curious';
  let pose: MascotPose = 'idle';
  let look = 0.8;
  if (frame >= T.apps + 12) {
    expression = 'found';
    pose = 'point';
    look = 1;
  }
  if (frame >= T.plan) {
    expression = 'waiting';
    pose = 'holdCard';
    look = 0.7;
  }
  if (frame >= T.click + 6) {
    expression = 'relieved';
    pose = 'thumbsUp';
    look = 0;
  }
  if (frame >= T.end + 4) {
    expression = 'calm';
    pose = 'wave';
  }
  // a little hop each time the state changes
  const changes = [T.apps + 12, T.plan, T.click + 6, T.end + 4];
  const bounce = changes.reduce((acc, t) => acc + interpolate(frame, [t, t + 5, t + 12], [0, -26, 0], clamp), 0);
  const x = frame >= T.end ? interpolate(frame, [T.end, T.end + 14], [60, 330], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 60;
  return (
    <div style={{position: 'absolute', left: x - (1 - hop) * 420, top: 900 + bounce, opacity: Math.min(1, hop * 2)}}>
      <Mascot size={460} expression={expression} pose={pose} look={look} blink={blink} bob={bob} glow={0.5 + 0.4 * Math.sin(frame / 8)} cardText="The plan" />
    </div>
  );
};

/* ---------- hook text + end card ---------- */
const HookText: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(T.slow + 2, {damping: 12, stiffness: 190, mass: 0.6});
  const out = interpolate(frame, [T.hop + 4, T.hop + 14], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 60, right: 160, top: 840, textAlign: 'center', fontFamily: SANS, fontWeight: 800, lineHeight: 1, letterSpacing: -2, opacity: p * out, transform: `scale(${0.85 + 0.15 * p})`}}>
      <div style={{fontSize: 74, color: C.navy}}>SLOW EVERY</div>
      <div style={{fontSize: 92, color: 'white', backgroundImage: AURORA, borderRadius: 22, padding: '2px 22px 10px', display: 'inline-block', marginTop: 10}}>TIME IT STARTS</div>
    </div>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(T.end + 6, {damping: 14, stiffness: 170, mass: 0.7});
  if (frame < T.end) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 160, top: 1390, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, background: 'white', borderRadius: 999, padding: '10px 26px 10px 14px', boxShadow: '0 16px 40px -18px rgba(15,23,41,.5)'}}>
        <NoahMark size={52} />
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.ink, letterSpacing: -1}}>Noah for Mac</span>
      </div>
      <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.indigo}}>onnoah.app</span>
    </div>
  );
};

/* ---------- captions, sound, background ---------- */
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const line = CAPTIONS.find((c) => frame >= c.from && frame < c.to);
  if (!line || frame >= T.end) return null;
  const out = interpolate(frame, [line.to - 4, line.to], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 60, right: 160, top: 1420, opacity: out}}>
      <Caption key={line.from} text={line.text} from={line.from} emphasis={line.emphasis} size={48} dark />
    </div>
  );
};

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 1}) => (
  <Sequence from={Math.round(at)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const Sound: React.FC = () => (
  <>
    <Audio src={staticFile('sfx/bed.wav')} loop volume={0.15} />
    <Audio src={staticFile('vo/mascot-login/vo.wav')} />
    <Sfx at={T.hop + 4} src="whoosh" volume={0.4} />
    <Sfx at={T.hop + 14} src="blip" volume={0.35} />
    {APPS.map((_, i) => (i % 2 === 0 ? <Sfx key={i} at={T.apps + i * 4} src="pop" volume={0.3} /> : null))}
    <Sfx at={T.plan + 6} src="whoosh" volume={0.3} />
    <Sfx at={T.click} src="pop" volume={0.5} />
    <Sfx at={T.click + 8} src="reveal" volume={0.45} />
    <Sfx at={T.end} src="whoosh" volume={0.3} />
  </>
);

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 40;
  return (
    <AbsoluteFill style={{background: C.page}}>
      <div style={{position: 'absolute', width: 1100, height: 1100, borderRadius: 550, left: -300 + drift, top: 800, background: 'radial-gradient(circle, rgba(99,102,241,.22) 0%, rgba(99,102,241,0) 65%)'}} />
      <div style={{position: 'absolute', width: 1000, height: 1000, borderRadius: 500, right: -360 - drift, top: 1150, background: 'radial-gradient(circle, rgba(139,92,246,.18) 0%, rgba(139,92,246,0) 65%)'}} />
    </AbsoluteFill>
  );
};

export const MascotLoginItems: React.FC = () => (
  <AbsoluteFill style={{background: C.page}}>
    <Backdrop />
    <MacDisplay />
    <HookText />
    <LoginApps />
    <Robot />
    <Approval />
    <EndCard />
    <Captions />
    <Sound />
  </AbsoluteFill>
);
