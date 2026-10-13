import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { accentGradient, colors, fonts } from '../theme';
import { BackgroundAppsIcon, CpuIcon, MemoryIcon, StartupIcon, StorageIcon } from './icons';
import { AccentText, Cursor, Headline, SectionLabel, fadeIn, window01 } from './parts';
import { FPS, T, f } from './timeline';

const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const QUESTION = 'Why is my PC so slow?';

// ------------------------------------------------------------------ frame
// The card every piece of genuine Noah UI sits in.
const PANEL = { left: 40, width: 1000 };

const AppPanel: React.FC<{
  top: number;
  height: number;
  opacity?: number;
  y?: number;
  scale?: number;
  children: React.ReactNode;
}> = ({ top, height, opacity = 1, y = 0, scale = 1, children }) => (
  <div
    style={{
      position: 'absolute',
      left: PANEL.left,
      top,
      width: PANEL.width,
      height,
      opacity,
      transform: `translateY(${y}px) scale(${scale})`,
      borderRadius: 34,
      overflow: 'hidden',
      background: colors.appBg,
      border: '1.5px solid rgba(199,203,255,0.14)',
      boxShadow: '0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.4), 0 0 80px rgba(99,102,241,0.18)',
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------- scene 1 + 2
const SETTINGS = [
  { label: 'Startup', Icon: StartupIcon, x: 56, y: 560 },
  { label: 'Background apps', Icon: BackgroundAppsIcon, x: 56, y: 720 },
  { label: 'Storage', Icon: StorageIcon, x: 56, y: 880 },
  { label: 'CPU', Icon: CpuIcon, x: 846, y: 610 },
  { label: 'Memory', Icon: MemoryIcon, x: 846, y: 770 },
];

const SettingChip: React.FC<{ i: number; label: string; Icon: React.FC; x: number; y: number }> = ({
  i,
  label,
  Icon,
  x,
  y,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inAt = T.icons + i * 0.09;
  const pop = spring({ frame: frame - f(inAt), fps, config: { damping: 18, stiffness: 160 } });
  // At "one question" the five chips collapse toward the centre and fade.
  const gather = interpolate(frame, [f(2.55), f(3.0)], [0, 1], { ...clamp, easing: easeInOut });
  const cx = 540;
  const cy = 420;
  const bob = Math.sin((frame + i * 17) / 22) * 4;
  return (
    <div
      style={{
        position: 'absolute',
        left: interpolate(gather, [0, 1], [x, cx - 60]),
        top: interpolate(gather, [0, 1], [y, cy]) + bob * (1 - gather),
        opacity: pop * (1 - gather),
        transform: `scale(${interpolate(pop, [0, 1], [0.8, 1]) * (1 - gather * 0.4)})`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 22px 14px 16px',
        borderRadius: 22,
        background: 'rgba(11,16,36,0.62)',
        border: '1px solid rgba(199,203,255,0.2)',
        backdropFilter: 'blur(12px)',
        color: colors.lilac,
        fontFamily: fonts.sans,
        fontWeight: 650,
        fontSize: 28,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ width: 40, height: 40, color: '#A9B8FF' }}>
        <Icon />
      </div>
      <span style={{ color: colors.text }}>{label}</span>
    </div>
  );
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Gentle push-in, then the creator recedes as the app takes over.
  const push = interpolate(frame, [0, f(T.hookEnd)], [1.0, 1.07], clamp);
  const out = interpolate(frame, [f(T.toUi), f(T.hookEnd + 0.15)], [0, 1], { ...clamp, easing: easeInOut });
  const shade = 'linear-gradient(180deg, rgba(7,10,24,0.55) 0%, rgba(7,10,24,0) 32%, rgba(7,10,24,0) 58%, rgba(7,10,24,0.7) 100%)';
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <AbsoluteFill style={{ transform: `scale(${push * (1 + out * 0.06)})`, filter: `blur(${out * 14}px)` }}>
        <OffthreadVideo src={staticFile('footage/creator-hook.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: shade }} />
      <Headline at={T.settingsText} until={2.35} top={196} size={100} align="left">
        <AccentText>5 DIFFERENT</AccentText>
        <br />
        SETTINGS?
      </Headline>
      {SETTINGS.map((s, i) => (
        <SettingChip key={s.label} i={i} {...s} />
      ))}
      <Headline at={T.oneQuestionText} until={T.hookEnd + 0.3} top={196} size={124}>
        ONE <AccentText>QUESTION.</AccentText>
      </Headline>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------- scene 3 + 4a
// Chat stage in 2x screenshot pixels (crops are 1560 wide); scaled into the panel.
const STAGE_W = 1560;
const STAGE_H = 1150;
const STAGE_SCALE = PANEL.width / STAGE_W;
const CHAT_TOP = 520;

const typedAt = (t: number) => {
  // Keystrokes follow the spoken words (vo-02 word timings).
  const p = interpolate(t, [T.typeStart, T.typeEnd], [0, 1], clamp);
  return QUESTION.slice(0, Math.round(p * QUESTION.length));
};

export const keystrokeTimes = () => {
  const times: number[] = [];
  let prev = 0;
  for (let fr = f(T.typeStart); fr <= f(T.typeEnd); fr++) {
    const n = typedAt(fr / FPS).length;
    if (n > prev && QUESTION[n - 1] !== ' ') {
      times.push(fr / FPS);
    }
    prev = n;
  }
  return times;
};

export const ChatScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  const enter = fadeIn(frame, T.hookEnd - 0.2, 0.55);
  const leave = fadeIn(frame, T.tiles - 0.3, 0.3);
  const sent = t >= T.send;
  const typed = sent ? '' : typedAt(t);
  const caretOn = Math.floor(frame / 8) % 2 === 0 || (t > T.typeStart && t < T.typeEnd);
  const bubble = spring({ frame: frame - f(T.send), fps, config: { damping: 16, stiffness: 170 } });
  const looking = window01(frame, T.looking, T.checks[0] + 0.15, 0.2);
  const checkOpacity = (i: number) =>
    i === T.checks.length - 1
      ? fadeIn(frame, T.checks[i], 0.2)
      : window01(frame, T.checks[i], T.checks[i + 1] + 0.15, 0.2);

  return (
    <AbsoluteFill style={{ opacity: enter * (1 - leave) }}>
      <SectionLabel at={T.typeStart - 0.1} until={T.send + 0.1} top={420}>
        ONE QUESTION
      </SectionLabel>
      <AppPanel top={CHAT_TOP} height={STAGE_H * STAGE_SCALE} y={(1 - enter) * 90}>
        <div style={{ position: 'absolute', width: STAGE_W, height: STAGE_H, transform: `scale(${STAGE_SCALE})`, transformOrigin: '0 0' }}>
          {/* user bubble, styled to the app's own bubble */}
          {sent ? (
            <div
              style={{
                position: 'absolute',
                right: 22,
                top: 40,
                padding: '30px 44px',
                borderRadius: 34,
                background: colors.appBubble,
                color: colors.appText,
                fontFamily: fonts.ui,
                fontSize: 40,
                fontWeight: 450,
                opacity: bubble,
                transform: `translateY(${(1 - bubble) * 30}px) scale(${0.94 + bubble * 0.06})`,
                transformOrigin: '100% 0',
              }}
            >
              {QUESTION}
            </div>
          ) : null}
          <Img src={staticFile('ui/looking.png')} style={{ position: 'absolute', left: 0, top: 236, opacity: looking }} />
          {T.checks.map((_, i) => (
            <Img key={i} src={staticFile(`ui/check-${i + 1}.png`)} style={{ position: 'absolute', left: 0, top: 232, opacity: checkOpacity(i) }} />
          ))}
          {/* genuine composer; the typed text replaces the placeholder */}
          <div style={{ position: 'absolute', left: 0, top: STAGE_H - 166, width: 1546, height: 152, overflow: 'hidden' }}>
            <Img src={staticFile('ui/composer.png')} />
            {t >= T.typeStart - 0.15 && !sent ? (
              <div
                style={{
                  position: 'absolute',
                  left: 56,
                  top: 50,
                  width: 1300,
                  height: 72,
                  background: colors.appInput,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 12,
                  fontFamily: fonts.ui,
                  fontSize: 40,
                  color: colors.appText,
                }}
              >
                {typed}
                <span style={{ width: 3, height: 46, marginLeft: 3, background: colors.appText, opacity: caretOn ? 1 : 0 }} />
              </div>
            ) : null}
          </div>
        </div>
      </AppPanel>
    </AbsoluteFill>
  );
};

// Spans the checklist and the result tiles, so it lives outside both scenes.
export const CheckedLabel: React.FC = () => (
  <SectionLabel at={T.checkedHeadline} until={T.situation} top={420}>
    WHAT NOAH CHECKED
  </SectionLabel>
);

// "NO GUESSING." sticker over the live checklist
export const NoGuessSticker: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - f(T.noGuessSticker), fps, config: { damping: 14, stiffness: 180 } });
  const o = Math.min(s, 1 - fadeIn(frame, T.tiles - 0.3, 0.25));
  return (
    <div
      style={{
        position: 'absolute',
        right: 76,
        top: CHAT_TOP + 560,
        opacity: o,
        transform: `scale(${0.85 + s * 0.15}) rotate(-2deg)`,
        padding: '18px 30px',
        borderRadius: 20,
        background: accentGradient,
        fontFamily: fonts.sans,
        fontWeight: 800,
        fontSize: 54,
        letterSpacing: -0.5,
        color: '#fff',
        boxShadow: '0 18px 50px rgba(99,102,241,0.45)',
      }}
    >
      NO GUESSING.
    </div>
  );
};

// ------------------------------------------------- scene 4b, 5, 6
// diagnosis.png is 1546 x 1604 (2x pixels of the real result card).
type Cam = { cx: number; cy: number; s: number };
const DIAG_TOP = 500;
const DIAG_H = 840;

const cams: { at: number; cam: Cam }[] = [
  // (cy stays inside the range where the card fills the panel top to bottom)
  { at: T.tiles, cam: { cx: 773, cy: 700, s: 0.71 } }, // What Noah checked tiles
  { at: T.tiles + 1.0, cam: { cx: 773, cy: 690, s: 0.72 } },
  { at: T.situation, cam: { cx: 740, cy: 600, s: 0.72 } }, // Situation
  { at: T.situation + 1.9, cam: { cx: 730, cy: 590, s: 0.74 } },
  { at: T.plan, cam: { cx: 610, cy: 1137, s: 0.9 } }, // What Noah would do
  { at: T.plan + 1.9, cam: { cx: 600, cy: 1137, s: 0.92 } },
];

// Big moves ease in over the 0.55s before the next keyframe; small ones drift linearly.
const camAt = (t: number): Cam => {
  if (t <= cams[0].at) return cams[0].cam;
  for (let i = 0; i < cams.length - 1; i++) {
    const a = cams[i];
    const b = cams[i + 1];
    if (t <= b.at) {
      const big = Math.abs(b.cam.cy - a.cam.cy) > 100;
      const q = big
        ? interpolate(t, [b.at - 0.55, b.at], [0, 1], { ...clamp, easing: easeInOut })
        : interpolate(t, [a.at, b.at], [0, 1], clamp);
      return {
        cx: a.cam.cx + (b.cam.cx - a.cam.cx) * q,
        cy: a.cam.cy + (b.cam.cy - a.cam.cy) * q,
        s: a.cam.s + (b.cam.s - a.cam.s) * q,
      };
    }
  }
  return cams[cams.length - 1].cam;
};

const TILES = [
  [78, 594, 426, 800],
  [426, 594, 772, 800],
  [772, 594, 1118, 800],
  [1118, 594, 1468, 800],
];
const PLAN_ROWS = [
  [60, 930, 1500, 1050],
  [60, 1058, 1500, 1180],
  [60, 1190, 1500, 1310],
  [60, 1318, 1500, 1440],
];
const PLAN_BUTTON = [60, 1452, 1500, 1580];

export const DiagnosisScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const o = window01(frame, T.tiles - 0.25, T.approval + 0.35, 0.3);
  const cam = camAt(t);
  const tx = PANEL.width / 2 - cam.cx * cam.s;
  const ty = DIAG_H / 2 - cam.cy * cam.s;

  // focus rect for the spotlight (image coords)
  let focus = [60, 500, 1490, 830];
  if (t >= T.situation - 0.28) focus = [40, 170, 1506, 470];
  if (t >= T.plan - 0.28) focus = [40, 860, 1506, 1590];
  const spot = window01(frame, T.tiles + 0.2, T.approval, 0.3);

  const tileGlow = (i: number) => window01(frame, T.tiles + 0.15 + i * 0.2, T.tiles + 0.15 + i * 0.2 + 0.6, 0.15);
  const rowShown = (i: number) => fadeIn(frame, T.planRows[i], 0.35);
  const buttonShown = fadeIn(frame, T.planRows[3] + 0.35, 0.35);

  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Headline at={T.situation} until={T.plan - 0.05} top={300} size={80}>
        HERE&rsquo;S WHAT&rsquo;S
        <br />
        <AccentText>ACTUALLY HAPPENING.</AccentText>
      </Headline>
      <Headline at={T.plan} until={T.approval} top={352} size={96}>
        SEE THE <AccentText>PLAN.</AccentText>
      </Headline>
      <SectionLabel at={T.plan} until={T.approval} top={290}>
        WHAT NOAH WOULD DO
      </SectionLabel>
      <AppPanel top={DIAG_TOP} height={DIAG_H}>
        <div style={{ position: 'absolute', left: tx, top: ty, width: 1546, height: 1604, transform: `scale(${cam.s})`, transformOrigin: '0 0' }}>
          <Img src={staticFile('ui/diagnosis.png')} />
          {/* plan rows revealed one at a time (cover = card background) */}
          {PLAN_ROWS.map(([x0, y0, x1, y1], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x0,
                top: y0,
                width: x1 - x0,
                height: y1 - y0,
                background: 'rgb(30,33,38)',
                opacity: t < T.plan - 0.6 ? 0 : 1 - rowShown(i),
                transform: `translateX(${rowShown(i) * 40}px)`,
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              left: PLAN_BUTTON[0],
              top: PLAN_BUTTON[1],
              width: PLAN_BUTTON[2] - PLAN_BUTTON[0],
              height: PLAN_BUTTON[3] - PLAN_BUTTON[1],
              background: 'rgb(30,33,38)',
              opacity: t < T.plan - 0.6 ? 0 : 1 - buttonShown,
            }}
          />
          {/* spotlight: dim everything outside the focus block */}
          <div
            style={{
              position: 'absolute',
              left: focus[0],
              top: focus[1],
              width: focus[2] - focus[0],
              height: focus[3] - focus[1],
              borderRadius: 26,
              boxShadow: `0 0 0 4000px rgba(7,10,24,${0.5 * spot})`,
              outline: `3px solid rgba(139,143,248,${0.55 * spot})`,
            }}
          />
          {TILES.map(([x0, y0, x1, y1], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x0 + 6,
                top: y0 + 6,
                width: x1 - x0 - 12,
                height: y1 - y0 - 12,
                borderRadius: 16,
                border: `4px solid rgba(127,166,255,${tileGlow(i)})`,
                boxShadow: `0 0 40px rgba(99,102,241,${0.5 * tileGlow(i)}), inset 0 0 30px rgba(99,102,241,${0.25 * tileGlow(i)})`,
              }}
            />
          ))}
        </div>
      </AppPanel>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ scene 7
// approval.png: 2340 x 1910 (full app window, modal over the blurred plan).
const APPROVAL_TOP = 560;
const APPROVAL_H = 780;
const GO_AHEAD = { x: 1196, y: 1117, w: 236, h: 90 };

export const ApprovalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  const o = window01(frame, T.approval, T.done + 0.1, 0.25);
  const z = interpolate(t, [T.approvalZoom, T.approvalZoom + 0.8], [0, 1], { ...clamp, easing: easeInOut });
  const drift = interpolate(t, [T.approvalZoom + 0.8, T.click], [0, 1], clamp);
  const s = interpolate(z, [0, 1], [PANEL.width / 2340, 0.9]) + drift * 0.025;
  const cx = interpolate(z, [0, 1], [1170, 1174]);
  const cy = interpolate(z, [0, 1], [955, 958]);
  const tx = PANEL.width / 2 - cx * s;
  const ty = APPROVAL_H / 2 - cy * s;

  // cursor: slow approach, a hover beat, then the click
  const toBtn = interpolate(t, [T.cursorIn, T.cursorArrive], [0, 1], { ...clamp, easing: easeInOut });
  const btnX = PANEL.left + tx + (GO_AHEAD.x + 20) * s;
  const btnY = APPROVAL_TOP + ty + (GO_AHEAD.y + 6) * s;
  const curX = interpolate(toBtn, [0, 1], [PANEL.left + PANEL.width - 90, btnX]);
  const curY = interpolate(toBtn, [0, 1], [APPROVAL_TOP + APPROVAL_H - 60, btnY]) + Math.sin(toBtn * Math.PI) * -40;
  const curO = fadeIn(frame, T.cursorIn, 0.3);
  const hover = fadeIn(frame, T.cursorArrive - 0.1, 0.3);
  const press = spring({ frame: frame - f(T.click), fps, config: { damping: 12, stiffness: 260 } });
  const pressScale = t >= T.click ? 1 - 0.05 * Math.sin(Math.min(1, (t - T.click) / 0.18) * Math.PI) : 1;
  const ring = t >= T.click ? interpolate(t, [T.click, T.click + 0.5], [0, 1], clamp) : 0;

  return (
    <AbsoluteFill style={{ opacity: o }}>
      {/* dim the world, focus the approval */}
      <AbsoluteFill style={{ background: `rgba(4,6,16,${0.45 * z})` }} />
      <Headline at={T.youDecide} until={T.done} top={330} size={140}>
        YOU <AccentText>DECIDE.</AccentText>
      </Headline>
      <AppPanel top={APPROVAL_TOP} height={APPROVAL_H}>
        <div style={{ position: 'absolute', left: tx, top: ty, width: 2340, height: 1910, transform: `scale(${s})`, transformOrigin: '0 0' }}>
          <Img src={staticFile('ui/approval.png')} />
          {/* hover / press feedback on the real "Go ahead" button */}
          <div
            style={{
              position: 'absolute',
              left: GO_AHEAD.x - GO_AHEAD.w / 2,
              top: GO_AHEAD.y - GO_AHEAD.h / 2,
              width: GO_AHEAD.w,
              height: GO_AHEAD.h,
              borderRadius: 16,
              boxShadow: `0 0 ${30 + 30 * hover}px rgba(139,143,248,${0.55 * hover})`,
              background: `rgba(255,255,255,${0.06 * hover})`,
              transform: `scale(${pressScale})`,
            }}
          />
          {ring > 0 && ring < 1 ? (
            <div
              style={{
                position: 'absolute',
                left: GO_AHEAD.x - 60,
                top: GO_AHEAD.y - 60,
                width: 120,
                height: 120,
                borderRadius: 120,
                border: '5px solid rgba(199,203,255,0.9)',
                opacity: 1 - ring,
                transform: `scale(${0.4 + ring * 2.2})`,
              }}
            />
          ) : null}
        </div>
      </AppPanel>
      <Cursor x={curX} y={curY} opacity={curO * (1 - fadeIn(frame, T.done - 0.1, 0.2))} scale={1 - 0.08 * press * (t < T.click + 0.25 ? 1 : 0)} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ scene 8a
export const DoneScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = window01(frame, T.done, T.closer + 0.2, 0.25);
  const s = spring({ frame: frame - f(T.done), fps, config: { damping: 18, stiffness: 140 } });
  // 0.7 keeps the full result text in frame while reading larger
  const scale = 0.7;
  const h = 630 * scale;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Headline at={T.done + 0.1} until={T.closer + 0.1} top={420} size={96}>
        APPROVED.&nbsp;<AccentText>DONE.</AccentText>
      </Headline>
      <AppPanel top={700} height={h} scale={0.94 + s * 0.06} y={(1 - s) * 40}>
        <Img
          src={staticFile('ui/done.png')}
          style={{ position: 'absolute', left: (PANEL.width - 1546 * scale) / 2, top: 0, width: 1546 * scale, height: h }}
        />
      </AppPanel>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ scene 8b
export const CloserScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = fadeIn(frame, T.closer, 0.35);
  const ctaIn = fadeIn(frame, T.cta, 0.5);
  const logo = spring({ frame: frame - f(T.cta + 0.05), fps, config: { damping: 16, stiffness: 120 } });
  const line = (at: number) => fadeIn(frame, at, 0.4);
  // The creator's closing beat: glance back to camera, half-smile (clip 6.35s→8s, slowed).
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Sequence from={f(T.closer)}>
        <AbsoluteFill style={{ transform: `scale(${1.04 + ctaIn * 0.04})`, filter: `blur(${ctaIn * 18}px) brightness(${1 - ctaIn * 0.55})` }}>
          <OffthreadVideo
            src={staticFile('footage/creator-hook.mp4')}
            muted
            startFrom={f(6.35)}
            playbackRate={0.62}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(7,10,24,${0.35 + ctaIn * 0.4}) 0%, rgba(7,10,24,${0.0 + ctaIn * 0.55}) 35%, rgba(7,10,24,${0.75 + ctaIn * 0.1}) 100%)`,
        }}
      />
      {/* "One question. No guessing." — the spoken words, as type, clear of his face */}
      <div
        style={{
          position: 'absolute',
          top: 1150,
          left: 0,
          right: 0,
          opacity: 1 - ctaIn,
          textAlign: 'center',
          fontFamily: fonts.sans,
          fontWeight: 800,
          fontSize: 112,
          lineHeight: 1.04,
          letterSpacing: -2,
          color: colors.text,
          textShadow: '0 6px 30px rgba(7,10,24,0.6)',
        }}
      >
        <div style={{ opacity: line(T.closer + 0.1), transform: `translateY(${(1 - line(T.closer + 0.1)) * 24}px)` }}>ONE QUESTION.</div>
        <div style={{ opacity: line(T.noGuessing), transform: `translateY(${(1 - line(T.noGuessing)) * 24}px)` }}>
          <AccentText>NO GUESSING.</AccentText>
        </div>
      </div>
      {/* CTA */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: ctaIn,
          transform: `translateY(${(1 - ctaIn) * 40}px)`,
          fontFamily: fonts.sans,
          color: colors.text,
        }}
      >
        <Img
          src={staticFile('brand/noah-mark-dark.svg')}
          style={{ width: 168, height: 168, opacity: logo, transform: `scale(${0.9 + logo * 0.1})` }}
        />
        <div style={{ marginTop: 40, fontWeight: 800, fontSize: 112, letterSpacing: -2.5, lineHeight: 1 }}>
          FREE <AccentText>PC CHECK</AccentText>
        </div>
        <div
          style={{
            marginTop: 40,
            padding: '20px 52px 24px',
            borderRadius: 999,
            background: 'rgba(11,16,36,0.7)',
            border: '2px solid transparent',
            backgroundImage: `linear-gradient(rgba(11,16,36,0.85), rgba(11,16,36,0.85)), ${accentGradient}`,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            fontWeight: 750,
            fontSize: 68,
            letterSpacing: -0.5,
            opacity: line(T.cta + 0.45),
          }}
        >
          onnoah.app
        </div>
        <div style={{ marginTop: 48, display: 'flex', gap: 26, fontWeight: 600, fontSize: 38, color: colors.textDim }}>
          {['Describe it.', 'Approve it.', 'Done.'].map((w, i) => (
            <span key={w} style={{ opacity: line(T.cta + 1.1 + i * 0.35) }}>
              {w}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
