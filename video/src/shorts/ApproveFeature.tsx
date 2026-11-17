import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import rhubarb from '../../public/vo/approve/rhubarb.json';
import timing from '../../public/vo/approve/timing.json';
import {MacWindow} from '../components/MacWindow';
import {UserRoom, UserToon} from '../components/UserToon';
import {Caption, clamp, NoahMark, useSpring} from '../components/ui';
import {AURORA, C, MONO, SANS, SERIF} from '../theme';

// 15s short: the approval moment. An auto-fixer changes things on its own; Noah tells you what's
// wrong in plain English, shows the fix first, and nothing runs until you approve. Then: undo.
// Character: original 2D user (UserToon), Piper Joe voice (CC0), Rhubarb lip-sync.

const L = timing.lines;
export const APPROVE_FRAMES = timing.totalFrames + 1;

const LINES = [
  {text: 'Would you let an app change your Mac... without asking?', emphasis: ['asking?']},
  {text: 'Yeah, me neither.', emphasis: []},
  {text: "Noah tells you what's wrong, in plain English,", emphasis: ['plain', 'English,']},
  {text: 'shows you the fix first,', emphasis: ['first,']},
  {text: 'and nothing runs until you approve.', emphasis: ['approve.']},
  {text: 'Changed your mind? Undo it.', emphasis: ['Undo']},
  {text: 'Noah. On noah dot app.', emphasis: ['noah', 'app.']},
];

// key moments (frames)
const X_SLAM = 96; // red ✕ on the auto-fixer ("me neither")
const NOAH_IN = 124;
const ASK_AT = 136;
const ANSWER_AT = 166;
const PLAN_AT = L[3].startFrame;
const TAP_AT = Math.round(L[4].pauses[L[4].pauses.length - 1] * 30) - 2; // "...approve"
const UNDO_AT = Math.round(L[5].pauses[0] * 30) + 6; // "Undo it"
const END_AT = L[6].startFrame - 4;

/* ---------- beat 1: the auto-fixer that doesn't ask ---------- */
const AUTO_STEPS = ['Changing network settings', 'Deleting caches', 'Removing login items', 'Editing system files'];
const AutoFixer: React.FC = () => {
  const frame = useCurrentFrame();
  const inn = useSpring(0, {damping: 13, stiffness: 150, mass: 0.7});
  const out = interpolate(frame, [NOAH_IN - 6, NOAH_IN + 6], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const xs = useSpring(X_SLAM, {damping: 9, stiffness: 260, mass: 0.6});
  const stamp = useSpring(44, {damping: 9, stiffness: 240, mass: 0.6});
  const bar = interpolate(frame, [4, 120], [8, 92], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 110,
        top: 200,
        transform: `translateY(${(1 - inn) * -80}px) translateX(${out * -1100}px) rotate(${out * -8}deg)`,
        opacity: inn,
      }}
    >
      <div style={{filter: `grayscale(${interpolate(frame, [X_SLAM, X_SLAM + 8], [0, 0.8], clamp)})`}}>
        <MacWindow title="Auto-fixer" width={760}>
          <div style={{padding: '26px 30px 30px', fontFamily: SANS, background: '#F4F2EE'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 800, color: C.ink}}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  border: '5px solid #CBC5BA',
                  borderTopColor: '#6B6359',
                  transform: `rotate(${frame * 18}deg)`,
                }}
              />
              Fixing your Mac automatically…
            </div>
            <div style={{height: 14, borderRadius: 7, background: '#E2DDD4', margin: '20px 0 18px', overflow: 'hidden'}}>
              <div style={{width: `${bar}%`, height: '100%', background: '#8D857A'}} />
            </div>
            {AUTO_STEPS.map((s, i) => {
              const at = 8 + i * 16;
              const o = interpolate(frame, [at, at + 5], [0, 1], clamp);
              const done = frame > at + 12;
              return (
                <div key={s} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, color: C.ink2, padding: '7px 0', opacity: o, transform: `translateX(${(1 - o) * 20}px)`}}>
                  <span style={{fontFamily: MONO, width: 34, color: done ? '#6B6359' : '#A39A8E', fontWeight: 700}}>{done ? '✓' : '…'}</span>
                  {s}
                </div>
              );
            })}
            <div style={{marginTop: 14, fontSize: 24, fontWeight: 700, color: '#B4433A'}}>No preview · no undo</div>
          </div>
        </MacWindow>
      </div>
      {/* "WITHOUT ASKING?" stamp */}
      {frame >= 44 && (
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -34,
            transform: `rotate(${-8 + (1 - stamp) * 12}deg) scale(${0.6 + 0.4 * stamp})`,
            opacity: stamp,
            background: '#B4433A',
            color: 'white',
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 44,
            letterSpacing: 1,
            padding: '12px 26px',
            borderRadius: 16,
            boxShadow: '0 16px 40px -14px rgba(120,30,20,.6)',
          }}
        >
          WITHOUT ASKING?
        </div>
      )}
      {/* big red ✕ */}
      {frame >= X_SLAM && (
        <svg
          width={420}
          height={420}
          viewBox="-60 -60 120 120"
          style={{position: 'absolute', left: 170, top: 30, transform: `scale(${0.4 + 0.6 * xs})`, opacity: Math.min(1, xs * 1.4)}}
        >
          <path d="M-40 -40 L 40 40 M40 -40 L -40 40" stroke="#D2392C" strokeWidth={20} strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};

/* ---------- beats 3–6: Noah ---------- */
const Bubble: React.FC<{at: number; side: 'me' | 'noah'; children: React.ReactNode}> = ({at, side, children}) => {
  const s = useSpring(at, {damping: 14, stiffness: 190, mass: 0.6});
  const me = side === 'me';
  return (
    <div style={{display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', opacity: s, transform: `translateY(${(1 - s) * 24}px) scale(${0.94 + 0.06 * s})`, transformOrigin: me ? '100% 100%' : '0 100%'}}>
      <div
        style={{
          maxWidth: me ? 560 : 700,
          padding: '18px 24px',
          borderRadius: 26,
          borderBottomRightRadius: me ? 8 : 26,
          borderBottomLeftRadius: me ? 26 : 8,
          background: me ? '#EEEAE2' : C.auroraSoft,
          border: me ? undefined : '2px solid rgba(79,70,229,.18)',
          fontFamily: SANS,
          fontSize: 30,
          lineHeight: 1.3,
          fontWeight: me ? 600 : 600,
          color: C.ink,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Typed: React.FC<{text: string; at: number; cps?: number}> = ({text, at, cps = 2.2}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - at) * cps)));
  return (
    <>
      {text.slice(0, n)}
      <span style={{opacity: 0}}>{text.slice(n)}</span>
    </>
  );
};

const Btn: React.FC<{label: React.ReactNode; kind: 'ghost' | 'commit' | 'outline'; glow?: number; press?: number; style?: React.CSSProperties}> = ({
  label,
  kind,
  glow = 0,
  press = 0,
  style,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '16px 30px',
      borderRadius: 18,
      fontFamily: SANS,
      fontSize: 30,
      fontWeight: 800,
      color: kind === 'commit' ? 'white' : C.ink,
      background: kind === 'commit' ? C.commit : 'white',
      border: kind === 'commit' ? undefined : `2px solid ${kind === 'outline' ? C.navy : C.line2}`,
      boxShadow: kind === 'commit' ? `0 0 0 ${glow * 14}px rgba(13,148,136,${0.22 * glow}), 0 14px 30px -12px rgba(13,148,136,.7)` : undefined,
      transform: `scale(${1 - press * 0.08})`,
      ...style,
    }}
  >
    {label}
  </div>
);

const UndoArrow: React.FC<{spin: number; color: string}> = ({spin, color}) => (
  <svg width={34} height={34} viewBox="0 0 24 24" style={{transform: `rotate(${-spin * 360}deg)`}}>
    <path d="M4 12a8 8 0 1 0 2.3-5.6" stroke={color} strokeWidth={2.6} fill="none" strokeLinecap="round" />
    <path d="M4 3.5V8h4.5" stroke={color} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Cursor: React.FC<{x: number; y: number; press: number}> = ({x, y, press}) => (
  <svg width={64} height={64} viewBox="0 0 24 24" style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - press * 0.15})`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.35))'}}>
    <path d="M5 2 L 5 19 L 9.5 15 L 12.5 21.5 L 15.3 20.3 L 12.4 13.9 L 18.5 13.6 Z" fill="white" stroke="#1A1A1A" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

const NoahPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const inn = useSpring(NOAH_IN, {damping: 14, stiffness: 150, mass: 0.7});
  const out = interpolate(frame, [END_AT - 4, END_AT + 8], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const plan = useSpring(PLAN_AT, {damping: 14, stiffness: 180, mass: 0.6});
  const glow = frame >= L[4].startFrame && frame < TAP_AT ? 0.5 + 0.5 * Math.sin((frame - L[4].startFrame) / 3) : 0;
  const pressA = interpolate(frame, [TAP_AT - 2, TAP_AT, TAP_AT + 4], [0, 1, 0], clamp);
  const done = frame >= TAP_AT + 2;
  const doneS = useSpring(TAP_AT + 2, {damping: 12, stiffness: 220, mass: 0.6});
  const undoIn = useSpring(L[5].startFrame, {damping: 13, stiffness: 200, mass: 0.6});
  const pressU = interpolate(frame, [UNDO_AT - 2, UNDO_AT, UNDO_AT + 4], [0, 1, 0], clamp);
  const undone = frame >= UNDO_AT + 2;
  const undoneS = useSpring(UNDO_AT + 2, {damping: 12, stiffness: 220, mass: 0.6});
  const spin = interpolate(frame, [UNDO_AT, UNDO_AT + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

  // cursor path: approve button, then undo button
  const cx = interpolate(frame, [L[4].startFrame, TAP_AT - 3, UNDO_AT - 14, UNDO_AT - 3], [700, 290, 290, 34], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cy = interpolate(frame, [L[4].startFrame, TAP_AT - 3, UNDO_AT - 14, UNDO_AT - 3], [760, 560, 560, 560], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cursorO = interpolate(frame, [L[4].startFrame, L[4].startFrame + 6, UNDO_AT + 16, UNDO_AT + 22], [0, 1, 1, 0], clamp);

  if (frame < NOAH_IN - 2 || out >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 110,
        top: 170,
        transform: `translateX(${(1 - inn) * 1000 - out * 0}px) scale(${1 - out * 0.15})`,
        opacity: 1 - out,
        transformOrigin: '50% 30%',
      }}
    >
      <MacWindow title="Noah" noah width={860} style={{marginLeft: -50}}>
        <div style={{padding: '26px 28px 30px', display: 'flex', flexDirection: 'column', gap: 18}}>
          <Bubble at={ASK_AT} side="me">
            <Typed text="Wi-Fi says connected, but nothing loads." at={ASK_AT} />
          </Bubble>
          {frame >= ANSWER_AT && (
            <Bubble at={ANSWER_AT} side="noah">
              <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 2, color: C.indigo, marginBottom: 6}}>WHAT'S ACTUALLY WRONG</div>
              Your Mac's <b>DNS settings</b> are stale, so websites can't be found. Your Wi-Fi is fine.
            </Bubble>
          )}
          {frame >= PLAN_AT && (
            <div
              style={{
                opacity: plan,
                transform: `translateY(${(1 - plan) * 30}px)`,
                border: `2px solid ${done && !undone ? C.commit : C.line2}`,
                borderRadius: 26,
                padding: '22px 24px',
                background: 'white',
                fontFamily: SANS,
                position: 'relative',
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 2, color: C.mute}}>{undone ? 'THE FIX · UNDONE' : done ? 'THE FIX · RAN' : 'THE FIX · NOT RUN YET'}</div>
                <div style={{fontSize: 22, fontWeight: 800, color: C.commit, background: C.commitSoft, padding: '6px 14px', borderRadius: 999}}>REVERSIBLE</div>
              </div>
              <div style={{fontSize: 38, fontWeight: 800, color: C.ink, margin: '10px 0 18px', letterSpacing: -0.5}}>Reset network settings</div>
              <div style={{display: 'flex', gap: 16, alignItems: 'center', height: 70}}>
                {!done && (
                  <>
                    <Btn label="Not now" kind="ghost" />
                    <Btn label="Approve" kind="commit" glow={glow} press={pressA} />
                  </>
                )}
                {done && !undone && (
                  <>
                    <Btn
                      label={<UndoArrow spin={spin} color={C.navy} />}
                      kind="outline"
                      press={pressU}
                      style={{opacity: undoIn, transform: `scale(${(0.7 + 0.3 * undoIn) * (1 - pressU * 0.08)})`, padding: '14px 22px'}}
                    />
                    <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 800, color: C.commit, transform: `scale(${0.8 + 0.2 * doneS})`, transformOrigin: '0 50%'}}>
                      ✓ Done · logged
                    </div>
                  </>
                )}
                {undone && (
                  <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 800, color: C.navy, transform: `scale(${0.8 + 0.2 * undoneS})`, transformOrigin: '0 50%'}}>
                    <UndoArrow spin={spin} color={C.navy} /> Undone · back how it was
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </MacWindow>
      {cursorO > 0 && <Cursor x={cx} y={cy} press={Math.max(pressA, pressU)} />}
    </div>
  );
};

/* ---------- end card ---------- */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSpring(END_AT + 4, {damping: 12, stiffness: 170, mass: 0.7});
  const pill = useSpring(END_AT + 16, {damping: 12, stiffness: 190, mass: 0.6});
  if (frame < END_AT) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 160, top: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
      <div style={{transform: `scale(${0.6 + 0.4 * s})`, opacity: s, display: 'flex', alignItems: 'center', gap: 22}}>
        <NoahMark size={130} />
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 120, color: C.navy, letterSpacing: -3}}>Noah</span>
      </div>
      <div style={{opacity: s, fontFamily: SERIF, fontStyle: 'italic', fontSize: 52, color: C.ink2, textAlign: 'center', lineHeight: 1.15}}>
        Shows you before it touches anything.
      </div>
      <div
        style={{
          opacity: pill,
          transform: `scale(${0.7 + 0.3 * pill})`,
          background: AURORA,
          color: 'white',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 58,
          padding: '16px 40px',
          borderRadius: 999,
          boxShadow: '0 20px 50px -18px rgba(79,70,229,.8)',
        }}
      >
        onnoah.app
      </div>
    </div>
  );
};

/* ---------- captions ---------- */
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const i = L.findIndex((l, k) => frame >= l.startFrame - 2 && frame < (L[k + 1]?.startFrame ?? 1e9) - 2);
  if (i < 0) return null;
  const l = L[i];
  const out = interpolate(frame, [l.endFrame + 8, l.endFrame + 12], [1, 0], clamp);
  if (i === L.length - 1 && frame > l.endFrame + 12) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 160, top: 1420, opacity: i === L.length - 1 ? out : 1}}>
      <Caption key={i} text={LINES[i].text} from={l.startFrame} emphasis={LINES[i].emphasis} size={56} />
    </div>
  );
};

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 1}) => (
  <Sequence from={Math.round(at)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

export const ApproveFeature: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, APPROVE_FRAMES], [1, 1.05], clamp);
  // side-eye up-left at the auto-fixer, then look at the viewer; glance up at the Noah window
  const look = (f: number) => {
    const up = interpolate(f, [8, 14, 80, 88], [0, 1, 1, 0], clamp);
    const glance = interpolate(f, [130, 136, 200, 208, 262, 268, 300, 306], [0, 1, 1, 0, 0, 1, 1, 0], clamp);
    return {x: -0.9 * up - 0.4 * glance, y: -0.9 * up - 0.9 * glance};
  };
  return (
    <AbsoluteFill style={{background: C.page}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 70%'}}>
        <UserRoom />
        <div style={{position: 'absolute', left: 165, top: 770}}>
          <UserToon
            cues={rhubarb.mouthCues}
            size={1000}
            look={look}
            squintAt={[[10, 82]]}
            browAt={[L[5].startFrame + 2]}
            shake={[L[1].startFrame - 2, L[1].endFrame + 4]}
            smileAfter={L[6].endFrame + 2}
            waveFrom={L[6].startFrame}
          />
        </div>
      </AbsoluteFill>
      <AutoFixer />
      <NoahPanel />
      <EndCard />
      <Captions />
      <Audio src={staticFile('sfx/bed.wav')} loop volume={0.12} />
      <Audio src={staticFile('vo/approve/vo.wav')} />
      <Sfx at={44} src="pop" volume={0.5} />
      <Sfx at={X_SLAM} src="ruleout" volume={0.55} />
      <Sfx at={NOAH_IN - 6} src="whoosh" volume={0.4} />
      <Sfx at={ANSWER_AT} src="blip" volume={0.4} />
      <Sfx at={PLAN_AT} src="pop" volume={0.35} />
      <Sfx at={TAP_AT} src="tick" volume={0.7} />
      <Sfx at={TAP_AT + 2} src="reveal" volume={0.35} />
      <Sfx at={UNDO_AT} src="tock" volume={0.7} />
      <Sfx at={END_AT} src="whoosh" volume={0.35} />
    </AbsoluteFill>
  );
};
