import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {MacWindow} from '../components/MacWindow';
import {ToonRoom} from '../components/Toon';
import {Caption, clamp, NoahMark, useSpring} from '../components/ui';
import {AURORA, C, MONO, SANS, SERIF} from '../theme';

// Short: "I Asked AI Why My Mac Is Slow. It Gave Me Homework."
// Script: drafts/noah-mac-shorts-scripts.md, video 3. 30s at 30 fps.
//
// No on-screen host. Voice: Clipchamp TTS recording (public/vo/mac-ai/clipchamp-full.m4a), split into lines and placed with tools/build_short_vo.py.

import timing from '../../public/vo/mac-ai/timing.json';

// All beats are placed on the voice-over (public/vo/mac-ai/timing.json, from tools/build_short_vo.py).
const L = timing.lines; // L[0] = line 1 ...
const f = (sec: number) => Math.round(sec * 30);
// k-th pause inside line i (0-based), or `frac` of the way through the line if the voice didn't pause there
const pause = (i: number, k: number, frac: number) => {
  const p = L[i].pauses[k];
  return p !== undefined ? f(p) : Math.round(L[i].startFrame + frac * (L[i].endFrame - L[i].startFrame));
};
const lastPause = (i: number, frac: number) => (L[i].pauses.length ? f(L[i].pauses[L[i].pauses.length - 1]) : Math.round(L[i].startFrame + frac * (L[i].endFrame - L[i].startFrame)));

export const MAC_AI_HOMEWORK_FRAMES = timing.totalFrames;

const S = {
  vo: 'vo/mac-ai/vo.wav',
  hookLine1At: L[0].startFrame,
  hookLine2At: L[1].startFrame,
  chatFrom: L[1].endFrame,
  commandsAt: [0, 10, 20, 30, 40, 50].map((d) => L[2].startFrame - 2 + d),
  stamps: [
    {text: 'RUN THIS.', at: L[2].startFrame},
    {text: 'PASTE THAT.', at: pause(2, 0, 0.3)},
    {text: 'TELL ME WHAT IT SAYS.', at: pause(2, 1, 0.6)},
  ],
  splitFrom: L[3].startFrame - 3,
  noahFrom: L[4].startFrame - 4,
  // "Memory and swap. Disk. Login items. Crash logs."
  checksAt: [L[5].startFrame + 12, pause(5, 0, 0.3) - 2, pause(5, 1, 0.45) - 2, pause(5, 2, 0.7) - 6, L[5].endFrame - 6],
  findingAt: pause(6, 0, 0.45) - 6,
  approveAt: L[7].startFrame,
  clickAt: lastPause(7, 0.7) + 6,
  doneAt: lastPause(7, 0.7) + 18,
  noHomeworkFrom: L[8].startFrame - 4,
  endFrom: L[9].startFrame - 4,
  total: timing.totalFrames,
};

const CAPTIONS: {text: string; from: number; to: number; emphasis?: string[]}[] = [
  {text: 'Because a chatbot can’t see your Mac.', from: L[3].startFrame, to: pause(3, 0, 0.5), emphasis: ['can’t', 'see']},
  {text: 'It answers the average Mac.', from: pause(3, 0, 0.5), to: L[3].endFrame + 6, emphasis: ['average']},
  {text: 'Noah’s different. It actually looks.', from: L[4].startFrame, to: L[4].endFrame + 3, emphasis: ['looks.']},
  {text: 'Memory and swap. Disk. Login items. Crash logs.', from: L[5].startFrame, to: L[5].endFrame + 6},
  {text: 'Then it names the cause, on my Mac, not a guess.', from: L[6].startFrame, to: L[6].endFrame + 4, emphasis: ['my', 'Mac,']},
  {text: 'One fix. Shown first. I approve it.', from: L[7].startFrame, to: L[7].endFrame + 6, emphasis: ['approve']},
  {text: 'Noah for Mac. Free to start.', from: L[9].startFrame, to: S.total, emphasis: ['Noah']},
];

// Harmless, read-only diagnostic commands: the joke is the homework, not the commands.
const COMMANDS = ['top -o cpu', 'vm_stat', 'du -sh ~/Library/Caches', 'launchctl list', 'log show --last 1h', 'sysctl vm.swapusage'];


/* ---------- Illustrated Mac office (no host): slow push-in on a beachballing Mac ---------- */
// The Mac's screen centre in ToonRoom coordinates.
const MAC_CX = 855;
const MAC_CY = 736;

const Beachball: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: 'conic-gradient(#F43F5E, #F59E0B, #FACC15, #22C55E, #06B6D4, #3B82F6, #8B5CF6, #EC4899, #F43F5E)',
        transform: `rotate(${frame * 14}deg)`,
        boxShadow: '0 4px 10px rgba(0,0,0,.35), inset 0 0 0 2px rgba(255,255,255,.5)',
      }}
    />
  );
};

export const MacScene: React.FC<{zoomFrom: number; zoomTo: number; spinning?: boolean}> = ({zoomFrom, zoomTo, spinning}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [zoomFrom, zoomTo], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const z = 1 + 0.5 * t;
  // slide the Mac toward frame centre while pushing in on it
  return (
    <AbsoluteFill style={{transform: `translateX(${(540 - MAC_CX) * t}px) scale(${z})`, transformOrigin: `${MAC_CX}px ${MAC_CY - 120}px`}}>
      <ToonRoom />
      {spinning && (
        <div style={{position: 'absolute', left: MAC_CX - 34, top: MAC_CY - 46}}>
          <Beachball size={68} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- Hook ---------- */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [S.chatFrom - 2, S.chatFrom + 10], [1, 0], clamp);
  const l1 = useSpring(S.hookLine1At, {damping: 12, stiffness: 180, mass: 0.6});
  const l2 = useSpring(S.hookLine2At, {damping: 10, stiffness: 200, mass: 0.6});
  if (frame > S.chatFrom + 12) return null;
  const text: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 800,
    color: 'white',
    letterSpacing: -2,
    lineHeight: 1.02,
    textAlign: 'center',
    textShadow: '0 6px 30px rgba(10,12,40,.6)',
  };
  return (
    <AbsoluteFill style={{opacity: out}}>
      <MacScene zoomFrom={0} zoomTo={S.chatFrom} spinning />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%', background: 'linear-gradient(180deg,rgba(14,16,48,0),rgba(14,16,48,.75))'}} />
      <div style={{position: 'absolute', left: 50, right: 50, top: 1060, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
        <span style={{...text, fontSize: 92, opacity: l1, transform: `translateY(${(1 - l1) * 30}px)`}}>I ASKED AI WHY MY MAC IS SLOW</span>
        {frame >= S.hookLine2At - 2 && (
          <span
            style={{
              ...text,
              fontSize: 104,
              backgroundImage: AURORA,
              borderRadius: 24,
              padding: '0 24px 8px',
              textShadow: 'none',
              boxShadow: '0 16px 40px -12px rgba(79,70,229,.85)',
              transform: `scale(${0.6 + 0.4 * l2}) rotate(${(1 - l2) * -6}deg)`,
              opacity: Math.min(1, l2 * 1.5),
            }}
          >
            …IT GAVE ME HOMEWORK
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
};

const Stamp: React.FC<{text: string; at: number; i: number}> = ({text, at, i}) => {
  const frame = useCurrentFrame();
  const p = useSpring(at, {damping: 9, stiffness: 220, mass: 0.5});
  if (frame < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: [70, 360, 120][i],
        top: [520, 760, 1000][i],
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 64,
        color: 'white',
        backgroundImage: AURORA,
        borderRadius: 18,
        padding: '6px 22px 12px',
        boxShadow: '0 16px 40px -12px rgba(79,70,229,.85)',
        transform: `scale(${0.5 + 0.5 * p}) rotate(${[-4, 3, -2][i]}deg)`,
        opacity: Math.min(1, p * 1.5),
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

/* ---------- The chatbot "homework" ---------- */
const ChatHomework: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = useSpring(S.chatFrom, {damping: 16, stiffness: 140, mass: 0.8});
  const leave = interpolate(frame, [S.splitFrom - 8, S.splitFrom + 4], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  if (frame < S.chatFrom - 2 || leave >= 1) return null;
  const shown = S.commandsAt.filter((t) => frame >= t).length;
  const scroll = Math.max(0, shown - 3) * 104;
  const scrollEased = interpolate(frame, [S.commandsAt[3], S.commandsAt[5] + 10], [0, scroll], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        top: 250,
        opacity: enter * (1 - leave),
        transform: `translateY(${(1 - enter) * 200 + leave * -120}px)`,
      }}
    >
      <MacWindow title="AI Chat" width={960}>
        <div style={{height: 980, overflow: 'hidden', position: 'relative', background: '#FAF9F6'}}>
          <div style={{padding: '30px 30px 0', transform: `translateY(${-scrollEased}px)`}}>
            {/* user */}
            <div style={{display: 'flex', justifyContent: 'flex-end', opacity: interpolate(frame, [S.chatFrom + 6, S.chatFrom + 12], [0, 1], clamp)}}>
              <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 600, color: 'white', background: '#3B82F6', borderRadius: 26, padding: '16px 24px'}}>
                Why is my Mac slow?
              </div>
            </div>
            {/* bot */}
            <div style={{marginTop: 24, fontFamily: SANS, fontSize: 30, color: C.ink, opacity: interpolate(frame, [S.chatFrom + 20, S.chatFrom + 28], [0, 1], clamp)}}>
              <div style={{fontWeight: 700, marginBottom: 14}}>There are many possible causes! Try these steps:</div>
              {COMMANDS.map((cmd, i) => {
                const t = S.commandsAt[i];
                const o = interpolate(frame, [t, t + 6], [0, 1], clamp);
                return (
                  <div key={cmd} style={{opacity: o, transform: `translateY(${(1 - o) * 14}px)`, marginBottom: 18}}>
                    <div style={{fontSize: 26, fontWeight: 600, color: C.ink2, marginBottom: 6}}>{i + 1}. Open Terminal and run:</div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontFamily: MONO,
                        fontSize: 28,
                        color: '#E5E7EB',
                        background: '#1F2430',
                        borderRadius: 14,
                        padding: '14px 18px',
                      }}
                    >
                      <span>$ {cmd}</span>
                      <span style={{fontFamily: SANS, fontSize: 20, color: '#9CA3AF', border: '1px solid #4B5563', borderRadius: 8, padding: '3px 10px'}}>Copy</span>
                    </div>
                  </div>
                );
              })}
              <div style={{fontWeight: 600, color: C.ink2, opacity: interpolate(frame, [S.commandsAt[5] + 8, S.commandsAt[5] + 14], [0, 1], clamp)}}>
                Then paste the output here and I’ll take a look!
              </div>
            </div>
          </div>
        </div>
      </MacWindow>
      {/* stamps */}
      {S.stamps.map((st, i) => (
        <Stamp key={st.text} text={st.text} at={st.at} i={i} />
      ))}
    </div>
  );
};

/* ---------- "A chatbot can't see your Mac" ---------- */
const MiniMac: React.FC<{dim?: boolean; label: string; sub: string; accent?: boolean}> = ({dim, label, sub, accent}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: dim ? 0.55 : 1}}>
    <div style={{width: 360, height: 230, borderRadius: 18, background: '#E8E6E1', padding: 10, boxShadow: '0 20px 40px -18px rgba(15,23,41,.5)'}}>
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 10,
          background: accent
            ? 'radial-gradient(70% 80% at 50% 70%, #8B5CF6 0%, #4F46E5 45%, #1E1B4B 100%)'
            : 'linear-gradient(180deg,#9CA3AF,#6B7280)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 90,
          color: 'rgba(255,255,255,.85)',
        }}
      >
        {accent ? '' : '?'}
      </div>
    </div>
    <div style={{width: 120, height: 34, background: 'linear-gradient(#D6D3CD,#BDB8AF)', clipPath: 'polygon(20% 0,80% 0,100% 100%,0 100%)'}} />
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 42, color: accent ? C.indigo : C.ink2, letterSpacing: 1}}>{label}</div>
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.mute, textAlign: 'center', maxWidth: 380}}>{sub}</div>
  </div>
);

const CantSee: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSpring(S.splitFrom, {damping: 15, stiffness: 160, mass: 0.7});
  const b = useSpring(S.splitFrom + 50, {damping: 15, stiffness: 160, mass: 0.7});
  const out = interpolate(frame, [S.noahFrom - 8, S.noahFrom + 2], [1, 0], clamp);
  if (frame < S.splitFrom - 2 || frame > S.noahFrom + 2) return null;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 70, color: C.navy, letterSpacing: -1.5, opacity: a}}>
        A CHATBOT CAN’T
        <br />
        SEE YOUR MAC
      </div>
      <div style={{position: 'absolute', top: 620, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 70}}>
        <div style={{opacity: a, transform: `translateX(${(1 - a) * -80}px)`}}>
          <MiniMac dim label="“THE AVERAGE MAC”" sub="what a chatbot answers" />
        </div>
        <div style={{opacity: b, transform: `translateX(${(1 - b) * 80}px)`}}>
          <MiniMac accent label="YOUR MAC" sub="what’s actually happening" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Noah looks at THIS Mac ---------- */
const CHECKS = [
  {label: 'Memory pressure', value: 'Normal', tone: 'ok'},
  {label: 'Swap', value: 'Low', tone: 'ok'},
  {label: 'Disk', value: '214 GB free', tone: 'ok'},
  {label: 'Login items', value: '8 open at login', tone: 'warn'},
  {label: 'Crash logs', value: 'Nothing recent', tone: 'ok'},
] as const;

const NoahChecks: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = useSpring(S.noahFrom, {damping: 16, stiffness: 140, mass: 0.8});
  const titleP = useSpring(S.noahFrom + 6);
  const findP = useSpring(S.findingAt, {damping: 12, stiffness: 190, mass: 0.6});
  const approveP = useSpring(S.approveAt, {damping: 14, stiffness: 170, mass: 0.7});
  const clickP = interpolate(frame, [S.clickAt, S.clickAt + 4, S.clickAt + 10], [0, 1, 0], clamp);
  const leave = interpolate(frame, [S.noHomeworkFrom - 6, S.noHomeworkFrom + 4], [0, 1], clamp);
  if (frame < S.noahFrom - 2 || leave >= 1) return null;
  const cursorX = interpolate(frame, [S.approveAt + 10, S.clickAt], [980, 760], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cursorY = interpolate(frame, [S.approveAt + 10, S.clickAt], [1700, 1468], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={{opacity: 1 - leave}}>
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 66,
          letterSpacing: -1.5,
          color: C.navy,
          opacity: titleP,
          transform: `translateY(${(1 - titleP) * -20}px)`,
        }}
      >
        NOAH LOOKS AT <span style={{color: 'white', backgroundImage: AURORA, borderRadius: 16, padding: '0 16px 6px'}}>THIS MAC</span>
      </div>
      <div style={{position: 'absolute', left: 60, top: 280, opacity: enter, transform: `translateY(${(1 - enter) * 220}px)`}}>
        <MacWindow title="Noah" noah width={960}>
          <div style={{padding: '22px 28px 28px', fontFamily: SANS}}>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 18}}>
              <div style={{fontSize: 28, fontWeight: 600, color: C.ink2, background: C.page2, border: `1px solid ${C.line2}`, borderRadius: 20, padding: '12px 20px'}}>
                Why is my Mac slow?
              </div>
            </div>
            <div style={{fontSize: 21, fontWeight: 800, letterSpacing: 3, color: C.mute, marginBottom: 12}}>— WHAT NOAH CHECKED ON THIS MAC</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              {CHECKS.map((c, i) => {
                const t = S.checksAt[i];
                const scanning = frame >= t - 12 && frame < t;
                const done = frame >= t;
                const warn = c.tone === 'warn';
                const p = interpolate(frame, [t - 12, t - 6], [0, 1], clamp);
                return (
                  <div
                    key={c.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: 18,
                      background: warn && done ? 'rgba(217,119,6,.08)' : C.page2,
                      border: `2px solid ${warn && done ? 'rgba(217,119,6,.6)' : C.line}`,
                      opacity: p,
                    }}
                  >
                    <span style={{fontSize: 30, fontWeight: 700, color: C.ink}}>{c.label}</span>
                    <span
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        borderRadius: 999,
                        padding: '8px 16px',
                        color: scanning ? C.indigo : warn ? C.amber : C.commit,
                        background: scanning ? C.auroraSoft : warn ? C.amberSoft : C.commitSoft,
                      }}
                    >
                      {scanning ? 'Checking…' : `${warn ? '▲' : '✓'} ${c.value}`}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* finding */}
            {frame >= S.findingAt - 2 && (
              <div
                style={{
                  marginTop: 20,
                  borderRadius: 22,
                  padding: '18px 22px',
                  backgroundImage: AURORA,
                  color: 'white',
                  opacity: Math.min(1, findP * 1.4),
                  transform: `scale(${0.85 + 0.15 * findP})`,
                  transformOrigin: '20% 50%',
                }}
              >
                <div style={{fontSize: 21, fontWeight: 800, letterSpacing: 3, opacity: 0.85}}>LIKELY CAUSE ON THIS MAC</div>
                <div style={{fontSize: 40, fontWeight: 800, letterSpacing: -0.5}}>8 apps opening at login</div>
              </div>
            )}
          </div>
        </MacWindow>
      </div>
      {/* approval card */}
      {frame >= S.approveAt - 2 && (
        <div
          style={{
            position: 'absolute',
            left: 90,
            right: 90,
            top: 1290,
            borderRadius: 32,
            background: 'white',
            border: `1px solid ${C.line2}`,
            boxShadow: '0 30px 70px -24px rgba(15,23,41,.5)',
            padding: '26px 28px',
            fontFamily: SANS,
            opacity: approveP,
            transform: `translateY(${(1 - approveP) * 80}px)`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <NoahMark size={44} />
            <span style={{fontSize: 34, fontWeight: 800, color: C.ink}}>Can Noah do this?</span>
          </div>
          <div style={{fontSize: 27, fontWeight: 600, color: C.ink2, margin: '12px 0 20px'}}>
            Turn off 4 heavy login items. Reversible: turn them back on anytime.
          </div>
          {frame < S.doneAt ? (
            <div style={{display: 'flex', gap: 16}}>
              <div style={{flex: 1, textAlign: 'center', fontSize: 28, fontWeight: 700, color: C.ink2, border: `2px solid ${C.line2}`, borderRadius: 18, padding: '16px 0'}}>No thanks</div>
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'white',
                  backgroundImage: AURORA,
                  borderRadius: 18,
                  padding: '16px 0',
                  transform: `scale(${1 - 0.06 * clickP})`,
                  boxShadow: `0 0 0 ${10 * clickP}px rgba(79,70,229,.25)`,
                }}
              >
                Go ahead
              </div>
            </div>
          ) : (
            <div style={{fontSize: 30, fontWeight: 800, color: C.commit, padding: '12px 0'}}>✓ Done · added to the Action Log</div>
          )}
        </div>
      )}
      {/* cursor */}
      {frame >= S.approveAt + 10 && frame < S.doneAt + 10 && (
        <svg style={{position: 'absolute', left: cursorX, top: cursorY}} width={46} height={56} viewBox="0 0 23 28">
          <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18 15.8 Z" fill="white" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      )}
    </AbsoluteFill>
  );
};

/* ---------- NO TERMINAL. NO HOMEWORK. ---------- */
const NoHomework: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSpring(S.noHomeworkFrom, {damping: 10, stiffness: 210, mass: 0.6});
  const b = useSpring(S.noHomeworkFrom + 16, {damping: 10, stiffness: 210, mass: 0.6});
  const out = interpolate(frame, [S.endFrom - 6, S.endFrom + 2], [1, 0], clamp);
  if (frame < S.noHomeworkFrom - 2 || frame > S.endFrom + 2) return null;
  const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, fontSize: 112, color: 'white', letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'};
  return (
    <AbsoluteFill style={{backgroundImage: AURORA, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30, opacity: out}}>
      <span style={{...big, transform: `scale(${0.6 + 0.4 * a})`, opacity: Math.min(1, a * 1.4)}}>NO TERMINAL.</span>
      <span style={{...big, transform: `scale(${0.6 + 0.4 * b})`, opacity: Math.min(1, b * 1.4)}}>NO HOMEWORK.</span>
    </AbsoluteFill>
  );
};

/* ---------- End: host + Noah for Mac ---------- */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(S.endFrom + 6, {damping: 14, stiffness: 170, mass: 0.7});
  if (frame < S.endFrom) return null;
  return (
    <AbsoluteFill>
      <MacScene zoomFrom={S.endFrom} zoomTo={S.total} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', background: 'linear-gradient(180deg,rgba(14,16,48,0),rgba(14,16,48,.85))'}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          opacity: p,
          transform: `translateY(${(1 - p) * 40}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'white', borderRadius: 999, padding: '14px 30px 14px 18px'}}>
          <NoahMark size={64} />
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.ink, letterSpacing: -1}}>Noah for Mac</span>
        </div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: 'white'}}>Looks at your Mac. Asks before it fixes.</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, color: '#FCD34D', letterSpacing: 1}}>FREE TO START · onnoah.app</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Captions ---------- */
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const line = CAPTIONS.find((c) => frame >= c.from && frame < c.to);
  if (!line) return null;
  const dark = frame >= S.splitFrom && frame < S.noHomeworkFrom;
  const out = interpolate(frame, [line.to - 4, line.to], [1, 0], clamp);
  const top = frame >= S.endFrom ? 1500 : frame >= S.noahFrom ? 1700 : 1560;
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top, opacity: out}}>
      <Caption key={line.from} text={line.text} from={line.from} emphasis={line.emphasis} size={frame >= S.noahFrom && frame < S.endFrom ? 48 : 56} dark={dark} />
    </div>
  );
};

/* ---------- Sound ---------- */
const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 1}) => (
  <Sequence from={Math.round(at)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const Sound: React.FC = () => (
  <>
    <Audio src={staticFile('sfx/bed.wav')} loop volume={0.16} />
    <Audio src={staticFile(S.vo)} />
    <Sfx at={S.hookLine1At} src="pop" volume={0.35} />
    <Sfx at={S.hookLine2At} src="timesup" volume={0.35} />
    <Sfx at={S.chatFrom - 4} src="whoosh" volume={0.4} />
    {S.commandsAt.map((t) => (
      <Sfx key={t} at={t} src="tick" volume={0.3} />
    ))}
    {S.stamps.map((s) => (
      <Sfx key={s.at} at={s.at} src="pop" volume={0.45} />
    ))}
    <Sfx at={S.splitFrom - 4} src="whoosh" volume={0.35} />
    <Sfx at={S.noahFrom - 4} src="whoosh" volume={0.4} />
    {S.checksAt.map((t) => (
      <Sfx key={t} at={t} src="blip" volume={0.35} />
    ))}
    <Sfx at={S.findingAt} src="reveal" volume={0.45} />
    <Sfx at={S.clickAt} src="pop" volume={0.5} />
    <Sfx at={S.noHomeworkFrom} src="whoosh" volume={0.45} />
    <Sfx at={S.endFrom - 4} src="whoosh" volume={0.35} />
  </>
);

/* ---------- Background ---------- */
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 40;
  return (
    <AbsoluteFill style={{background: C.page}}>
      <div style={{position: 'absolute', width: 1100, height: 1100, borderRadius: 550, left: -300 + drift, top: 900, background: 'radial-gradient(circle, rgba(99,102,241,.22) 0%, rgba(99,102,241,0) 65%)'}} />
      <div style={{position: 'absolute', width: 1000, height: 1000, borderRadius: 500, right: -360 - drift, top: 1250, background: 'radial-gradient(circle, rgba(139,92,246,.18) 0%, rgba(139,92,246,0) 65%)'}} />
    </AbsoluteFill>
  );
};

export const MacAiHomework: React.FC = () => (
  <AbsoluteFill style={{background: C.page}}>
    <Backdrop />
    <CantSee />
    <ChatHomework />
    <NoahChecks />
    <NoHomework />
    <Hook />
    <EndCard />
    <Captions />
    <Sound />
  </AbsoluteFill>
);

/* ---------- 9:16 thumbnail: messy AI homework vs. Noah's one answer ---------- */
// Render with: npm run thumb:mac-ai
const THUMB_CMDS = [
  {cmd: 'top -o cpu', x: 0, r: -4},
  {cmd: 'vm_stat | grep free', x: 70, r: 3},
  {cmd: 'du -sh ~/Library/Caches', x: 10, r: -2},
  {cmd: 'launchctl list', x: 90, r: 5},
  {cmd: 'log show --last 1h', x: 30, r: -3},
];

export const MacAiHomeworkThumb: React.FC = () => {
  const head: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, color: 'white', letterSpacing: -3, lineHeight: 0.95};
  return (
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(160deg,#2563EB 0%,#4F46E5 45%,#7C3AED 100%)'}}>
      {/* soft light blobs for depth */}
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: 450, left: -300, top: -200, background: 'radial-gradient(circle, rgba(255,255,255,.22), rgba(255,255,255,0) 65%)'}} />
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: 450, right: -350, bottom: -250, background: 'radial-gradient(circle, rgba(236,72,153,.35), rgba(236,72,153,0) 65%)'}} />

      {/* headline */}
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
        <span style={{...head, fontSize: 112}}>AI GAVE ME</span>
        <span style={{...head, fontSize: 148, color: '#FDE047', textShadow: '0 10px 30px rgba(0,0,0,.25)'}}>HOMEWORK</span>
      </div>

      {/* the mess */}
      <div style={{position: 'absolute', left: 60, top: 420, width: 960, height: 560}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 36, background: 'rgba(255,255,255,.96)', boxShadow: '0 30px 70px -24px rgba(0,0,0,.55)', transform: 'rotate(-2deg)'}} />
        <div style={{position: 'absolute', left: 34, top: 26, transform: 'rotate(-2deg)', ...{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: '#374151', background: '#E5E7EB', borderRadius: 12, padding: '8px 16px'}}}>AI CHATBOT</div>
        {/* red marker circle (behind the commands) */}
        <svg style={{position: 'absolute', left: -20, top: 60}} width={1000} height={520} viewBox="0 0 1000 520">
          <path
            d="M120 60 C 420 -10, 860 20, 930 160 C 990 300, 850 470, 520 480 C 230 490, 40 420, 50 260 C 58 130, 160 70, 300 52"
            stroke="#EF4444"
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        {THUMB_CMDS.map((c, i) => (
          <div
            key={c.cmd}
            style={{
              position: 'absolute',
              left: 40 + c.x,
              top: 100 + i * 86,
              transform: `rotate(${c.r}deg)`,
              fontFamily: MONO,
              fontSize: 40,
              color: '#E5E7EB',
              background: '#1F2430',
              borderRadius: 16,
              padding: '14px 22px',
              boxShadow: '0 10px 20px -10px rgba(0,0,0,.5)',
              whiteSpace: 'nowrap',
            }}
          >
            $ {c.cmd}
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            right: 34,
            top: 6,
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 104,
            color: '#EF4444',
            transform: 'rotate(-8deg)',
            textShadow: '0 4px 0 rgba(255,255,255,.9), 0 -4px 0 rgba(255,255,255,.9), 4px 0 0 rgba(255,255,255,.9), -4px 0 0 rgba(255,255,255,.9)',
          }}
        >
          homework??
        </div>
      </div>

      {/* VS */}
      <div
        style={{
          position: 'absolute',
          left: 440,
          top: 1010,
          width: 200,
          height: 200,
          borderRadius: 100,
          background: '#FDE047',
          border: '10px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 92,
          color: '#1A1D61',
          boxShadow: '0 20px 40px -12px rgba(0,0,0,.5)',
          zIndex: 2,
        }}
      >
        VS
      </div>

      {/* Noah's one answer */}
      <div style={{position: 'absolute', left: 60, top: 1150, transform: 'rotate(1.5deg)'}}>
        <MacWindow title="Noah" noah width={960}>
          <div style={{padding: '30px 34px 34px', fontFamily: SANS}}>
            <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 3, color: C.mute}}>FOUND IT ON THIS MAC</div>
            <div style={{fontSize: 66, fontWeight: 800, letterSpacing: -1.5, color: C.ink, lineHeight: 1.05, margin: '10px 0 30px', maxWidth: 600}}>
              8 apps opening
              <br />
              at login
            </div>
            <div style={{display: 'flex', gap: 18}}>
              <div style={{flex: 1, textAlign: 'center', fontSize: 34, fontWeight: 700, color: C.ink2, border: `2px solid ${C.line2}`, borderRadius: 20, padding: '20px 0'}}>No thanks</div>
              <div style={{flex: 1, textAlign: 'center', fontSize: 34, fontWeight: 800, color: 'white', backgroundImage: AURORA, borderRadius: 20, padding: '20px 0', boxShadow: '0 12px 30px -10px rgba(79,70,229,.8)'}}>
                ✓ Go ahead
              </div>
            </div>
          </div>
        </MacWindow>
      </div>

      {/* ONE FIX sticker */}
      <div
        style={{
          position: 'absolute',
          left: 790,
          top: 1170,
          width: 220,
          height: 220,
          borderRadius: 110,
          background: '#16A34A',
          border: '8px solid white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(10deg)',
          boxShadow: '0 18px 36px -12px rgba(0,0,0,.45)',
          fontFamily: SANS,
          color: 'white',
        }}
      >
        <span style={{fontSize: 60, fontWeight: 800, lineHeight: 1}}>✓</span>
        <span style={{fontSize: 38, fontWeight: 800, letterSpacing: 1}}>ONE FIX</span>
        <span style={{fontSize: 20, fontWeight: 700, opacity: 0.9}}>NO TERMINAL</span>
      </div>

      {/* small branding */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1775, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.95)', borderRadius: 999, padding: '10px 22px 10px 14px'}}>
          <NoahMark size={42} />
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.ink}}>Noah for Mac</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
