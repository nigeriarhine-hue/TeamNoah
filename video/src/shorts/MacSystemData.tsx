import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import timing from '../../public/vo/mac-sysdata/timing.json';
import {MacWindow} from '../components/MacWindow';
import {Caption, clamp, NoahMark, useSpring} from '../components/ui';
import {AURORA, C, SANS, SERIF} from '../theme';
import {MacScene} from './MacAiHomework';

// Short: "What Is 'System Data' on Mac? (80 GB Mystery)" — script 1 in drafts/noah-mac-shorts-scripts.md.
// No on-screen host. Voice: user-supplied recording (public/vo/mac-sysdata/generated-full.wav), split into lines
// and placed with tools/build_short_vo.py.
// All GB numbers are THIS Mac's example, labeled as such on screen.

const L = timing.lines;
const f = (sec: number) => Math.round(sec * 30);
const at = (i: number, frac: number) => Math.round(L[i].startFrame + frac * (L[i].endFrame - L[i].startFrame));
const pause = (i: number, k: number, frac: number) => (L[i].pauses[k] !== undefined ? f(L[i].pauses[k]) : at(i, frac));

export const MAC_SYSDATA_FRAMES = timing.totalFrames;

const T = {
  hook1: L[0].startFrame,
  hook2: L[1].startFrame,
  rows: L[2].startFrame,
  cursorClick: at(2, 0.62),
  noah: L[3].startFrame - 4,
  scanFrom: L[4].startFrame,
  scanRows: [L[4].startFrame + 18, pause(4, 0, 0.45) + 4, pause(4, 0, 0.45) + 26],
  untouched: L[4].endFrame - 10,
  found: L[5].startFrame + 18,
  approve: L[6].startFrame,
  click: L[6].endFrame - 6,
  trash: L[7].startFrame,
  log: L[8].startFrame,
  result: L[9].startFrame - 4,
  plus41: L[9].startFrame + 6,
  filesSame: pause(9, 0, 0.5),
  end: L[10].startFrame - 4,
  loop: L[11].startFrame - 4,
  total: timing.totalFrames,
};

const CAPTIONS: {text: string; from: number; to: number; emphasis?: string[]}[] = [
  {text: 'And Storage settings won’t tell me what it is.', from: L[2].startFrame, to: L[2].endFrame + 6, emphasis: ['won’t']},
  {text: 'So I asked Noah.', from: L[3].startFrame, to: L[3].endFrame + 4, emphasis: ['Noah.']},
  {text: 'Noah doesn’t guess. It checks the folders on this Mac,', from: L[4].startFrame, to: L[4].endFrame + 3, emphasis: ['checks']},
  {text: 'and found it: old caches and leftovers nobody uses.', from: L[5].startFrame, to: L[5].endFrame + 6, emphasis: ['found', 'it:']},
  {text: 'Here’s the part I like: it shows the plan first.', from: L[6].startFrame, to: L[6].endFrame + 4, emphasis: ['plan', 'first.']},
  {text: 'Nothing’s deleted. It all goes to the Trash.', from: L[7].startFrame, to: L[7].endFrame + 4, emphasis: ['Trash.']},
  {text: 'And every change is in the log.', from: L[8].startFrame, to: L[8].endFrame + 8, emphasis: ['log.']},
  {text: 'Forty-one gigs back. My files didn’t change.', from: L[9].startFrame, to: L[9].endFrame + 8, emphasis: ['didn’t', 'change.']},
  {text: 'Noah for Mac. Free to start.', from: L[10].startFrame, to: L[10].endFrame + 8, emphasis: ['Noah']},
];

/* ---------- Storage model (this Mac's example numbers) ---------- */
const DISK = 512;
const SEGMENTS = [
  {label: 'Applications', gb: 92, color: '#3B82F6'},
  {label: 'Documents', gb: 190, color: '#F59E0B'},
  {label: 'Photos', gb: 96, color: '#EC4899'},
  {label: 'macOS', gb: 24, color: '#8B8F99'},
  {label: 'System Data', gb: 80, color: '#B9BCC4'},
];
const RECOVERED = 41.1;

const StorageBar: React.FC<{fill: number; sysData: number}> = ({fill, sysData}) => {
  const segs = SEGMENTS.map((s) => (s.label === 'System Data' ? {...s, gb: sysData} : s));
  let x = 0;
  return (
    <div style={{position: 'relative', height: 64, borderRadius: 16, background: '#EDEBE6', overflow: 'hidden'}}>
      {segs.map((s) => {
        const w = (s.gb / DISK) * 100 * fill;
        const el = (
          <div
            key={s.label}
            style={{
              position: 'absolute',
              left: `${x}%`,
              width: `${w}%`,
              top: 0,
              bottom: 0,
              background: s.label === 'System Data' ? 'repeating-linear-gradient(45deg,#B9BCC4 0 14px,#C9CCD3 14px 28px)' : s.color,
              borderRight: '3px solid #F7F6F2',
            }}
          />
        );
        x += w;
        return el;
      })}
    </div>
  );
};

const StorageWindow: React.FC<{sysData: number; fill: number; children?: React.ReactNode}> = ({sysData, fill, children}) => {
  const used = SEGMENTS.reduce((a, s) => a + (s.label === 'System Data' ? sysData : s.gb), 0);
  return (
    <MacWindow title="Storage" width={860}>
      <div style={{padding: '30px 34px 34px', fontFamily: SANS}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18}}>
          <span style={{fontSize: 36, fontWeight: 800, color: C.ink}}>Mac storage</span>
          <span style={{fontSize: 28, fontWeight: 700, color: C.ink2}}>
            {Math.round(used * fill)} GB of {DISK} GB used
          </span>
        </div>
        <StorageBar fill={fill} sysData={sysData} />
        {children}
      </div>
    </MacWindow>
  );
};

/* ---------- Scene A: the mystery ---------- */
const Mystery: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = useSpring(T.hook1, {damping: 16, stiffness: 140, mass: 0.8});
  const fill = interpolate(frame, [T.hook1 + 4, T.hook1 + 30], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const h1 = useSpring(T.hook1 + 10, {damping: 11, stiffness: 190, mass: 0.6});
  const h2 = useSpring(T.hook2, {damping: 9, stiffness: 220, mass: 0.5});
  const shake = frame >= T.cursorClick && frame < T.cursorClick + 14 ? Math.sin((frame - T.cursorClick) * 2.2) * 10 : 0;
  const tip = interpolate(frame, [T.cursorClick + 2, T.cursorClick + 8], [0, 1], clamp);
  const cx = interpolate(frame, [T.rows + 14, T.cursorClick], [880, 700], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cy = interpolate(frame, [T.rows + 14, T.cursorClick], [1500, 1062], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const out = interpolate(frame, [T.noah - 6, T.noah + 4], [1, 0], clamp);
  if (frame > T.noah + 4) return null;
  const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, color: C.navy, letterSpacing: -2.5, lineHeight: 1};
  return (
    <AbsoluteFill style={{opacity: out}}>
      {/* hook text */}
      <div style={{position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: h1, transform: `translateY(${(1 - h1) * -30}px)`}}>
        <span style={{...big, fontSize: 104}}>80 GB OF</span>
        <span style={{...big, fontSize: 112, color: 'white', backgroundImage: AURORA, borderRadius: 24, padding: '4px 26px 12px', boxShadow: '0 16px 40px -12px rgba(79,70,229,.85)'}}>
          “SYSTEM DATA”?
        </span>
      </div>
      <div style={{position: 'absolute', left: 60, top: 480, opacity: enter, transform: `translateY(${(1 - enter) * 200}px)`}}>
        <StorageWindow sysData={80} fill={fill}>
          {/* rows */}
          <div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8, opacity: interpolate(frame, [T.rows - 6, T.rows + 6], [0, 1], clamp)}}>
            {SEGMENTS.map((s) => {
              const sys = s.label === 'System Data';
              return (
                <div
                  key={s.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 18px',
                    borderRadius: 16,
                    background: sys ? 'rgba(185,188,196,.18)' : 'transparent',
                    border: sys ? '2px solid rgba(139,143,153,.5)' : '2px solid transparent',
                    transform: sys ? `translateX(${shake}px)` : undefined,
                    position: 'relative',
                  }}
                >
                  <span style={{width: 22, height: 22, borderRadius: 6, background: s.color}} />
                  <span style={{flex: 1, fontSize: 32, fontWeight: sys ? 800 : 600, color: C.ink}}>{s.label}</span>
                  <span style={{fontSize: 32, fontWeight: 800, color: sys ? C.ink : C.ink2}}>{s.gb} GB</span>
                  {sys && <span style={{fontSize: 30, color: 'rgba(60,50,40,.3)', marginLeft: 6}}>ⓘ</span>}
                  {sys && frame >= T.cursorClick && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 20,
                        top: -62,
                        fontSize: 26,
                        fontWeight: 700,
                        color: 'white',
                        background: '#3F3F46',
                        borderRadius: 12,
                        padding: '8px 14px',
                        opacity: tip,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      No details available
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </StorageWindow>
      </div>
      {/* "I did not put it there." */}
      {frame >= T.hook2 - 2 && frame < T.rows + 4 && (
        <div
          style={{
            position: 'absolute',
            left: 60,
            right: 160,
            top: 1210,
            display: 'flex',
            justifyContent: 'center',
            transform: `scale(${0.5 + 0.5 * h2}) rotate(${(1 - h2) * -8 - 3}deg)`,
            opacity: Math.min(1, h2 * 1.5),
          }}
        >
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 62, color: 'white', background: '#EF4444', borderRadius: 20, padding: '10px 28px 16px', boxShadow: '0 16px 40px -12px rgba(239,68,68,.7)'}}>
            I DID NOT PUT IT THERE.
          </span>
        </div>
      )}
      {/* cursor */}
      {frame >= T.rows + 14 && (
        <svg style={{position: 'absolute', left: cx, top: cy}} width={46} height={56} viewBox="0 0 23 28">
          <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18 15.8 Z" fill="white" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      )}
    </AbsoluteFill>
  );
};

/* ---------- Scene B: Noah checks the folders ---------- */
const FOLDERS = [
  {label: 'App caches', path: '~/Library/Caches', gb: 23.4},
  {label: 'Leftovers from deleted apps', path: 'Application Support', gb: 11.8},
  {label: 'Old logs & diagnostics', path: '~/Library/Logs', gb: 5.9},
];

const FolderRow: React.FC<{label: string; path: string; gb: number; from: number; found: number}> = ({label, path, gb, from, found}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [from, from + 6], [0, 1], clamp);
  const count = interpolate(frame, [from, from + 22], [0, gb], {...clamp, easing: Easing.out(Easing.cubic)});
  const hi = interpolate(frame, [found, found + 8], [0, 1], clamp);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '16px 20px',
        borderRadius: 18,
        background: hi > 0 ? `rgba(217,119,6,${0.08 * hi})` : C.page2,
        border: `2px solid ${hi > 0 ? `rgba(217,119,6,${0.6 * hi})` : C.line}`,
        opacity: o,
        transform: `translateY(${(1 - o) * 14}px)`,
      }}
    >
      <span style={{fontSize: 38}}>📁</span>
      <div style={{flex: 1}}>
        <div style={{fontSize: 30, fontWeight: 800, color: C.ink}}>{label}</div>
        <div style={{fontSize: 22, fontWeight: 600, color: C.mute}}>{path}</div>
      </div>
      <span style={{fontSize: 36, fontWeight: 800, color: hi > 0.5 ? C.amber : C.ink, fontVariantNumeric: 'tabular-nums'}}>{count.toFixed(1)} GB</span>
    </div>
  );
};

const NoahScan: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = useSpring(T.noah, {damping: 16, stiffness: 140, mass: 0.8});
  const foundP = useSpring(T.found, {damping: 11, stiffness: 200, mass: 0.6});
  const untouched = interpolate(frame, [T.untouched, T.untouched + 8], [0, 1], clamp);
  const leave = interpolate(frame, [T.result - 6, T.result + 4], [0, 1], clamp);
  if (frame < T.noah - 2 || leave >= 1) return null;
  return (
    <AbsoluteFill style={{opacity: 1 - leave}}>
      <div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 62, letterSpacing: -1.5, color: C.navy, opacity: enter}}>
        NOAH CHECKS <span style={{color: 'white', backgroundImage: AURORA, borderRadius: 16, padding: '0 16px 6px'}}>THIS MAC</span>
      </div>
      <div style={{position: 'absolute', left: 60, top: 250, opacity: enter, transform: `translateY(${(1 - enter) * 220}px)`}}>
        <MacWindow title="Noah" noah width={860}>
          <div style={{padding: '22px 28px 28px', fontFamily: SANS}}>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 18}}>
              <div style={{fontSize: 27, fontWeight: 600, color: C.ink2, background: C.page2, border: `1px solid ${C.line2}`, borderRadius: 20, padding: '12px 20px', maxWidth: 700}}>
                My storage is full but my files don’t add up
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 28, fontWeight: 700, color: frame < T.found ? C.indigo : C.commit, marginBottom: 14}}>
              <span style={{width: 14, height: 14, borderRadius: 7, background: frame < T.found ? C.indigo : C.commit, opacity: frame < T.found ? 0.5 + 0.5 * Math.sin(frame / 2.5) : 1}} />
              {frame < T.found ? 'Checking folder sizes on this Mac…' : 'Found what’s inside “System Data”'}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              {FOLDERS.map((r, i) => (
                <FolderRow key={r.label} {...r} from={T.scanRows[i]} found={T.found} />
              ))}
              {/* untouched */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: '14px 20px',
                  borderRadius: 18,
                  border: `2px dashed ${C.line2}`,
                  opacity: untouched,
                }}
              >
                <span style={{fontSize: 34}}>🔒</span>
                <span style={{flex: 1, fontSize: 28, fontWeight: 700, color: C.ink2}}>Your Documents & Photos</span>
                <span style={{fontSize: 26, fontWeight: 800, color: C.commit}}>Not touched</span>
              </div>
            </div>
            {frame >= T.found - 2 && (
              <div
                style={{
                  marginTop: 18,
                  borderRadius: 22,
                  padding: '18px 22px',
                  backgroundImage: AURORA,
                  color: 'white',
                  opacity: Math.min(1, foundP * 1.4),
                  transform: `scale(${0.85 + 0.15 * foundP})`,
                  transformOrigin: '20% 50%',
                }}
              >
                <div style={{fontSize: 21, fontWeight: 800, letterSpacing: 3, opacity: 0.85}}>FOUND IT · RECOVERABLE ON THIS MAC</div>
                <div style={{fontSize: 46, fontWeight: 800, letterSpacing: -0.5}}>{RECOVERED} GB of caches & leftovers</div>
              </div>
            )}
          </div>
        </MacWindow>
      </div>
      <ApproveTrashLog />
    </AbsoluteFill>
  );
};

/* ---------- approval → Trash → Action Log ---------- */
const ApproveTrashLog: React.FC = () => {
  const frame = useCurrentFrame();
  const approveP = useSpring(T.approve, {damping: 14, stiffness: 170, mass: 0.7});
  const clickP = interpolate(frame, [T.click, T.click + 4, T.click + 10], [0, 1, 0], clamp);
  const logP = useSpring(T.log, {damping: 14, stiffness: 170, mass: 0.7});
  const trashBulge = interpolate(frame, [T.trash + 10, T.trash + 16, T.trash + 24], [1, 1.18, 1], clamp);
  if (frame < T.approve - 2) return null;
  const cx = interpolate(frame, [T.approve + 10, T.click], [900, 680], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cy = interpolate(frame, [T.approve + 10, T.click], [1500, 1360], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <>
      {/* approval card */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 180,
          top: 1160,
          borderRadius: 32,
          background: 'white',
          border: `1px solid ${C.line2}`,
          boxShadow: '0 30px 70px -24px rgba(15,23,41,.5)',
          padding: '24px 28px',
          fontFamily: SANS,
          opacity: approveP * interpolate(frame, [T.trash + 2, T.trash + 8], [1, 0], clamp),
          transform: `translateY(${(1 - approveP) * 80}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <NoahMark size={44} />
          <span style={{fontSize: 34, fontWeight: 800, color: C.ink}}>Can Noah do this?</span>
        </div>
        <div style={{fontSize: 27, fontWeight: 600, color: C.ink2, margin: '10px 0 18px'}}>
          Move {RECOVERED} GB of caches & leftovers to the Trash. Your files aren’t touched.
        </div>
        {frame < T.click + 8 ? (
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
          <div style={{fontSize: 30, fontWeight: 800, color: C.commit, padding: '12px 0'}}>✓ Moving to the Trash…</div>
        )}
      </div>
      {/* cursor */}
      {frame >= T.approve + 10 && frame < T.click + 14 && (
        <svg style={{position: 'absolute', left: cx, top: cy}} width={46} height={56} viewBox="0 0 23 28">
          <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18 15.8 Z" fill="white" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      )}
      {/* files flying to the Trash */}
      {frame >= T.trash && frame < T.log + 2 && (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const t0 = T.trash + i * 3;
            const p = interpolate(frame, [t0, t0 + 16], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
            const x = 200 + i * 70 + (780 - (200 + i * 70)) * p;
            const y = 1180 - 120 * Math.sin(p * Math.PI) + (1300 - 1180) * p;
            return (
              <span key={i} style={{position: 'absolute', left: x, top: y, fontSize: 48, opacity: p < 1 ? 1 : 0, transform: `scale(${1 - 0.5 * p})`}}>
                📄
              </span>
            );
          })}
          <div style={{position: 'absolute', left: 740, top: 1250, fontSize: 110, transform: `scale(${trashBulge})`}}>🗑️</div>
          <div
            style={{
              position: 'absolute',
              left: 80,
              top: 1420,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 34,
              color: C.navy,
              background: 'white',
              border: `2px solid ${C.line2}`,
              borderRadius: 16,
              padding: '10px 18px',
              opacity: interpolate(frame, [T.trash + 8, T.trash + 14], [0, 1], clamp),
            }}
          >
            In the Trash · restore anytime
          </div>
        </>
      )}
      {/* Action Log */}
      {frame >= T.log - 2 && (
        <div
          style={{
            position: 'absolute',
            left: 80,
            right: 180,
            top: 1180,
            borderRadius: 28,
            background: 'white',
            border: `1px solid ${C.line2}`,
            boxShadow: '0 30px 70px -24px rgba(15,23,41,.5)',
            padding: '22px 26px',
            fontFamily: SANS,
            opacity: logP,
            transform: `translateY(${(1 - logP) * 60}px)`,
          }}
        >
          <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.mute, marginBottom: 10}}>ACTION LOG</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <span style={{fontSize: 30, color: C.commit, fontWeight: 800}}>✓</span>
            <span style={{flex: 1, fontSize: 28, fontWeight: 700, color: C.ink}}>Moved {RECOVERED} GB of caches & leftovers to Trash</span>
            <span style={{fontSize: 22, fontWeight: 600, color: C.mute}}>just now</span>
          </div>
          <div style={{fontSize: 22, fontWeight: 600, color: C.mute, marginTop: 8, paddingLeft: 44}}>Undo: Put Back from the Trash</div>
        </div>
      )}
    </>
  );
};

/* ---------- Scene C: result ---------- */
const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = useSpring(T.result, {damping: 16, stiffness: 150, mass: 0.7});
  const shrink = interpolate(frame, [T.result + 8, T.result + 30], [80, 80 - RECOVERED], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const plus = useSpring(T.plus41, {damping: 9, stiffness: 220, mass: 0.5});
  const same = interpolate(frame, [T.filesSame, T.filesSame + 8], [0, 1], clamp);
  const out = interpolate(frame, [T.end - 6, T.end + 2], [1, 0], clamp);
  if (frame < T.result - 2 || frame > T.end + 2) return null;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', left: 60, top: 420, opacity: enter, transform: `translateY(${(1 - enter) * 150}px)`}}>
        <StorageWindow sysData={shrink} fill={1}>
          <div style={{marginTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 700, color: C.ink2}}>
            <span>System Data</span>
            <span style={{fontWeight: 800, color: C.ink}}>{shrink.toFixed(1)} GB</span>
          </div>
          <div style={{marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 700, color: C.ink2, opacity: same}}>
            <span>Documents & Photos</span>
            <span style={{fontWeight: 800, color: C.commit}}>✓ unchanged</span>
          </div>
        </StorageWindow>
      </div>
      {frame >= T.plus41 - 2 && (
        <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transform: `scale(${0.5 + 0.5 * plus})`, opacity: Math.min(1, plus * 1.5)}}>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 150, color: 'white', backgroundImage: 'linear-gradient(135deg,#16A34A,#0D9488)', borderRadius: 34, padding: '0 34px 12px', letterSpacing: -4, boxShadow: '0 18px 44px -12px rgba(13,148,136,.8)'}}>
            +41 GB
          </span>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.navy, letterSpacing: 2}}>FREE ON THIS MAC</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- Scene D: end + E: loop question ---------- */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(T.end + 6, {damping: 14, stiffness: 170, mass: 0.7});
  if (frame < T.end || frame >= T.loop + 4) return null;
  const out = interpolate(frame, [T.loop - 4, T.loop + 4], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <MacScene zoomFrom={T.end} zoomTo={T.loop} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', background: 'linear-gradient(180deg,rgba(14,16,48,0),rgba(14,16,48,.85))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1180, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'white', borderRadius: 999, padding: '14px 30px 14px 18px'}}>
          <NoahMark size={64} />
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.ink, letterSpacing: -1}}>Noah for Mac</span>
        </div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: 'white'}}>Finds it. Shows you. Asks first.</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, color: '#FCD34D', letterSpacing: 1}}>FREE TO START · onnoah.app</div>
      </div>
    </AbsoluteFill>
  );
};

const LoopQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(T.loop, {damping: 12, stiffness: 190, mass: 0.6});
  if (frame < T.loop - 4) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50}}>
      <div style={{opacity: p, transform: `scale(${0.85 + 0.15 * p})`, marginRight: 100}}>
        <StorageWindow sysData={80} fill={1} />
      </div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 74, color: C.navy, letterSpacing: -2, textAlign: 'center', lineHeight: 1.05, opacity: p, marginRight: 100}}>
        WHAT’S <span style={{color: 'white', backgroundImage: AURORA, borderRadius: 18, padding: '0 18px 8px'}}>YOUR</span>
        <br />
        SYSTEM DATA AT? 👇
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Captions, sound, background ---------- */
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const line = CAPTIONS.find((c) => frame >= c.from && frame < c.to);
  if (!line) return null;
  const onDark = frame >= T.end && frame < T.loop;
  const out = interpolate(frame, [line.to - 4, line.to], [1, 0], clamp);
  const top = onDark ? 1430 : frame >= T.approve && frame < T.result ? 1040 : 1340;
  return (
    <div style={{position: 'absolute', left: 60, right: 160, top, opacity: out}}>
      <Caption key={line.from} text={line.text} from={line.from} emphasis={line.emphasis} size={50} dark={!onDark} />
    </div>
  );
};

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at: a, src, volume = 1}) => (
  <Sequence from={Math.round(a)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const Sound: React.FC = () => (
  <>
    <Audio src={staticFile('sfx/bed.wav')} loop volume={0.15} />
    <Audio src={staticFile('vo/mac-sysdata/vo.wav')} />
    <Sfx at={T.hook1 + 10} src="pop" volume={0.4} />
    <Sfx at={T.hook2} src="timesup" volume={0.35} />
    <Sfx at={T.cursorClick} src="ruleout" volume={0.45} />
    <Sfx at={T.noah - 4} src="whoosh" volume={0.4} />
    {T.scanRows.map((t) => (
      <Sfx key={t} at={t} src="blip" volume={0.3} />
    ))}
    <Sfx at={T.found} src="reveal" volume={0.45} />
    <Sfx at={T.click} src="pop" volume={0.5} />
    {[0, 2, 4].map((i) => (
      <Sfx key={i} at={T.trash + i * 3 + 14} src="pop" volume={0.18} />
    ))}
    <Sfx at={T.log} src="blip" volume={0.35} />
    <Sfx at={T.plus41} src="reveal" volume={0.45} />
    <Sfx at={T.end - 4} src="whoosh" volume={0.35} />
    <Sfx at={T.loop - 4} src="whoosh" volume={0.3} />
  </>
);

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

export const MacSystemData: React.FC = () => (
  <AbsoluteFill style={{background: C.page}}>
    <Backdrop />
    <Mystery />
    <NoahScan />
    <Result />
    <EndCard />
    <LoopQuestion />
    <Captions />
    <Sound />
  </AbsoluteFill>
);

/* ---------- 9:16 thumbnail ---------- */
// Render with: npm run thumb:mac-sysdata
export const MacSystemDataThumb: React.FC = () => {
  const head: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, color: 'white', letterSpacing: -3, lineHeight: 0.95};
  const BAR = [
    {gb: 92, color: '#3B82F6'},
    {gb: 190, color: '#F59E0B'},
    {gb: 96, color: '#EC4899'},
    {gb: 24, color: '#8B8F99'},
  ];
  return (
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(160deg,#2563EB 0%,#4F46E5 45%,#7C3AED 100%)'}}>
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: 450, left: -300, top: -200, background: 'radial-gradient(circle, rgba(255,255,255,.22), rgba(255,255,255,0) 65%)'}} />
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: 450, right: -350, bottom: -250, background: 'radial-gradient(circle, rgba(236,72,153,.35), rgba(236,72,153,0) 65%)'}} />

      {/* headline */}
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
        <span style={{...head, fontSize: 104, whiteSpace: 'nowrap'}}>WHAT IS</span>
        <span style={{...head, fontSize: 112, color: '#FDE047', textShadow: '0 10px 30px rgba(0,0,0,.25)', whiteSpace: 'nowrap', letterSpacing: -4}}>“SYSTEM DATA”?</span>
      </div>

      {/* the storage bar */}
      <div style={{position: 'absolute', left: 60, top: 400, width: 960, transform: 'rotate(-2deg)'}}>
        <div style={{borderRadius: 36, background: 'rgba(255,255,255,.97)', boxShadow: '0 30px 70px -24px rgba(0,0,0,.55)', padding: '34px 36px 40px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: SANS, marginBottom: 22}}>
            <span style={{fontSize: 40, fontWeight: 800, color: C.ink}}>Mac storage</span>
            <span style={{fontSize: 34, fontWeight: 800, color: '#EF4444'}}>Almost full</span>
          </div>
          <div style={{display: 'flex', height: 130, borderRadius: 24, overflow: 'hidden', background: '#EDEBE6'}}>
            {BAR.map((b, i) => (
              <div key={i} style={{width: `${(b.gb / 512) * 100}%`, background: b.color, borderRight: '4px solid #F7F6F2'}} />
            ))}
            <div
              style={{
                width: `${(80 / 512) * 100}%`,
                background: 'repeating-linear-gradient(45deg,#B9BCC4 0 16px,#CDD0D6 16px 32px)',
              }}
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-start', marginTop: 18, fontFamily: SANS}}>
            <span style={{fontSize: 46, fontWeight: 800, color: C.ink, background: '#E5E7EB', borderRadius: 14, padding: '6px 18px'}}>System Data: 80 GB</span>
          </div>
        </div>
        {/* red marker circle around System Data */}
        <svg style={{position: 'absolute', left: 690, top: 95}} width={300} height={220} viewBox="0 0 300 220">
          <path d="M70 22 C 190 -6, 292 30, 288 108 C 284 188, 180 214, 100 204 C 30 196, 6 140, 14 92 C 22 50, 60 26, 120 18" stroke="#EF4444" strokeWidth={12} fill="none" strokeLinecap="round" />
        </svg>
        <svg style={{position: 'absolute', left: 520, top: 290}} width={220} height={120} viewBox="0 0 220 120">
          <path d="M210 10 C 170 60, 110 90, 20 100 M20 100 L60 78 M20 100 L56 118" stroke="#EF4444" strokeWidth={10} fill="none" strokeLinecap="round" />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 390,
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 96,
            color: '#EF4444',
            transform: 'rotate(-6deg)',
            textShadow: '0 4px 0 rgba(255,255,255,.95), 0 -4px 0 rgba(255,255,255,.95), 4px 0 0 rgba(255,255,255,.95), -4px 0 0 rgba(255,255,255,.95)',
          }}
        >
          I didn’t put it there!
        </div>
      </div>

      {/* Noah's answer */}
      <div style={{position: 'absolute', left: 60, top: 1170, transform: 'rotate(1.5deg)'}}>
        <MacWindow title="Noah" noah width={960}>
          <div style={{padding: '28px 34px 34px', fontFamily: SANS}}>
            <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 3, color: C.mute}}>FOUND IT ON THIS MAC</div>
            <div style={{fontSize: 68, fontWeight: 800, letterSpacing: -1.5, color: C.ink, lineHeight: 1.05, margin: '12px 0 24px', maxWidth: 620}}>
              Old caches &
              <br />
              app leftovers
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 34, fontWeight: 800, color: C.commit}}>
              ✓ Moved to Trash · your files untouched
            </div>
          </div>
        </MacWindow>
      </div>

      {/* +41 GB sticker */}
      <div
        style={{
          position: 'absolute',
          left: 730,
          top: 1090,
          width: 290,
          height: 290,
          borderRadius: 145,
          background: '#16A34A',
          border: '9px solid white',
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
        <span style={{fontSize: 62, fontWeight: 800, letterSpacing: -2, lineHeight: 1, whiteSpace: 'nowrap'}}>+41 GB</span>
        <span style={{fontSize: 30, fontWeight: 800, letterSpacing: 2, whiteSpace: 'nowrap'}}>FREED</span>
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
