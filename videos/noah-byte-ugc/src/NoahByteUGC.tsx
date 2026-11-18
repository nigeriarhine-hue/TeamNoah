import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Pose } from "./byte/Byte";
import { EXPR } from "./byte/face";
import { ARMS, POSES } from "./byte/poses";
import { clamp01, cueFrame, ease, easeOut, handheld, kf, kfExpr, kfPose, liveBody, liveExpr, TL, wordFrame } from "./anim";
import { ByteLayer, Cam, Stage } from "./scene/Stage";
import { IconState, MONITOR } from "./scene/Office";
import { DialogueCaptions, Headline, Headlines } from "./components/Captions";
import { Highlight, Shot, UIViewport } from "./components/UIViewport";
import { EndCard } from "./components/EndCard";
import { Fonts } from "./components/Fonts";

const S = Object.fromEntries(TL.scenes.map((s) => [s.id, s])) as Record<number, { from: number; to: number }>;
const W = (l: number, w: string) => wordFrame(l, w);

// ------------------------------------------------------------------ shared camera helpers
const selfieCam = (f: number, base: { x: number; y: number; z: number; lx: number; ly: number; fov: number }, shake = 1): Cam => {
  const h = handheld(f, shake);
  return { pos: [base.x + h.x, base.y + h.y, base.z], look: [base.lx + h.x * 0.6, base.ly + h.y * 0.6, 0], fov: base.fov, roll: h.roll };
};

// ------------------------------------------------------------------ SCENE 1: hook (selfie)
const Scene1: React.FC<{ f: number }> = ({ f }) => {
  const mind = W(1, "mind");
  const zoom = kf(f, [[0, 0], [mind - 3, 0], [mind + 3, 1], [S[2].from - 8, 1], [S[2].from, 0.6]], easeOut);
  const push = kf(f, [[0, 0], [mind - 4, 1]]);
  const base = { x: -0.05, y: 2.05, z: 5.5 - push * 0.35 - zoom * 0.55, lx: -0.3, ly: 1.62 + zoom * 0.12, fov: 60 - zoom * 10 };
  const cam = selfieCam(f, base, 1 + zoom * 0.8);
  // whip-pan out at the end of the scene
  const whip = clamp01((f - (S[2].from - 5)) / 5);
  cam.look = [cam.look[0] + ease(whip) * 6, cam.look[1], cam.look[2]];

  const pose: Pose = kfPose(f, [
    [0, { ...POSES.selfie, x: -0.3 }],
    [W(1, "why") - 2, { ...POSES.selfie, x: -0.3, headPitch: -0.14, headRoll: 0.1 }],
    [W(1, "computer"), { ...POSES.selfieShrug, x: -0.3 }],
    [mind - 2, { ...POSES.selfieShrug, x: -0.3, lean: 0.16 }],
    [mind + 6, { ...POSES.selfieFacepalm, x: -0.3, lean: 0.2 }],
    [S[2].from, { ...POSES.selfieFacepalm, x: -0.3, lean: 0.2, headYaw: 0.25 }],
  ]);
  const base_e = kfExpr(f, [
    [0, EXPR.frustrated],
    [W(1, "okay") + 2, EXPR.exasperated],
    [W(1, "does"), EXPR.exasperated],
    [W(1, "computer"), EXPR.frustrated],
    [mind - 2, EXPR.frustrated],
    [mind + 2, { ...EXPR.shocked, mouthOpen: 0 }],
    [mind + 10, EXPR.frustrated],
  ]);
  const look: [number, number] = f < W(1, "does") && f > W(1, "okay") ? [0, 0.6] : [0, 0];
  return (
    <Stage cam={cam} pose={liveBody(f, pose)} expr={liveExpr(f, base_e, [30, 58, 95], { look })} bgBlur={6 + whip * 14} fgBlur={whip * 18}
      screenMode="busy" screenP={0.15} icons={[]} />
  );
};

// ------------------------------------------------------------------ SCENE 2a: the problem (rear camera on the PC)
const ICON_LAYOUT: [number, number, number][] = [
  [-1.25, 1.75, 0.6], [0.35, 2.15, 0.9], [1.35, 1.45, 0.5], [-1.45, 0.45, 1.3],
  [1.45, 0.05, 1.1], [-0.95, -1.45, 1.0], [0.95, -1.35, 1.3], [-0.2, 2.85, 0.4],
];
const iconStates = (f: number): IconState[] => {
  const pops = [0, 1, 2, 3, 4, 5].map((i) => cueFrame(`icon-pop-${i}`)).concat([cueFrame("icon-pop-5") + 5, cueFrame("icon-pop-5") + 10]);
  return ICON_LAYOUT.map(([x, y, z], i) => ({ idx: i, p: Math.max(0, (f - pops[i]) / 9), x, y, z }));
};

const Scene2a: React.FC<{ f: number }> = ({ f }) => {
  const t0 = S[2].from;
  const whipIn = 1 - easeOut(clamp01((f - t0) / 7));
  const h = handheld(f, 1.2);
  const dolly = ease(clamp01((f - t0) / 60));
  const cam: Cam = {
    pos: [1.75 + h.x, 1.15 + h.y, 4.1 - dolly * 0.55],
    look: [MONITOR.x + 0.05 - whipIn * 5 + h.x * 0.5, MONITOR.y + 0.45 + h.y * 0.5, MONITOR.z],
    fov: 56, roll: h.roll,
  };
  const boot = cueFrame("boot-chime");
  const mode = f < boot + 8 ? "boot" : "busy";
  const p = mode === "boot" ? clamp01((f - t0) / 14) : clamp01((f - boot - 8) / 40);
  return <Stage cam={cam} pose={null} expr={EXPR.neutral} bgBlur={whipIn * 22} screenMode={mode} screenP={p} icons={iconStates(f)} />;
};

// ------------------------------------------------------------------ SCENE 2b: jump-cut back to Byte, confused
const Scene2b: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const noIdea = W(2, "no");
  const cam = selfieCam(f, { x: 0.05, y: 2.05, z: 5.6 - kf(f, [[start, 0], [S[3].from, 0.5]]), lx: -0.2, ly: 1.55, fov: 60 }, 1.1);
  const pose = kfPose(f, [
    [start, { ...POSES.selfie, x: -0.3, headYaw: 0.75, headPitch: 0.05, yaw: 0.15, armL: ARMS.pointBack }],
    [noIdea - 4, { ...POSES.selfie, x: -0.3, headYaw: 0.7, headPitch: 0.05, yaw: 0.15, armL: ARMS.pointBack }],
    [noIdea + 2, { ...POSES.selfieShrug, x: -0.3, headRoll: 0.22, headYaw: -0.05 }],
    [S[3].from, { ...POSES.selfieShrug, x: -0.3, headRoll: 0.18, headYaw: 0.05 }],
  ], easeOut);
  const e = kfExpr(f, [
    [start, EXPR.confused],
    [noIdea - 4, { ...EXPR.confused, pupilX: 0.7 }],
    [noIdea + 1, EXPR.confused],
    [W(2, "causing"), EXPR.exasperated],
  ]);
  return (
    <Stage cam={cam} pose={liveBody(f, pose)} expr={liveExpr(f, e, [start + 4, noIdea + 14])} bgBlur={5}
      screenMode="busy" screenP={1} icons={iconStates(f + 400)} />
  );
};

// ------------------------------------------------------------------ SCENE 3a: Byte introduces Noah, camera pushes into the monitor
const Scene3a: React.FC<{ f: number }> = ({ f }) => {
  const t0 = S[3].from;
  const pushStart = W(3, "noah") + 8;
  const push = ease(clamp01((f - pushStart) / 22));
  const h = handheld(f, 1 - push);
  const a = { pos: [0.45, 1.65, 6.9], look: [1.25, 1.1, -2] };
  const b = { pos: [MONITOR.x - 0.35, MONITOR.y + 0.02, MONITOR.z + 1.45], look: [MONITOR.x, MONITOR.y, MONITOR.z] };
  const mid = { x: 2.3, z: 1.6 };
  const k = push;
  const pos: [number, number, number] = [
    (1 - k) * (1 - k) * a.pos[0] + 2 * (1 - k) * k * mid.x + k * k * b.pos[0] + h.x,
    a.pos[1] + (b.pos[1] - a.pos[1]) * k + h.y,
    (1 - k) * (1 - k) * a.pos[2] + 2 * (1 - k) * k * mid.z + k * k * b.pos[2],
  ];
  const look: [number, number, number] = [a.look[0] + (b.look[0] - a.look[0]) * k, a.look[1] + (b.look[1] - a.look[1]) * k, a.look[2] + (b.look[2] - a.look[2]) * k];
  const cam: Cam = { pos, look, fov: 54 - push * 8, roll: h.roll };
  const pose = kfPose(f, [
    [t0, { ...POSES.rest, x: -0.75, yaw: 0.55, headYaw: 0.35, lean: 0.12, armL: ARMS.pointSide }],
    [W(3, "noah") - 2, { ...POSES.rest, x: -0.75, yaw: 0.45, headYaw: -0.25, headRoll: -0.1, lean: 0.08, armL: ARMS.pointSide, armR: ARMS.gestureOpen }],
    [pushStart + 10, { ...POSES.rest, x: -0.75, yaw: 0.55, headYaw: 0.3, lean: 0.15, armL: ARMS.pointSide }],
  ]);
  const e = kfExpr(f, [[t0, EXPR.curious], [W(3, "noah") - 2, EXPR.excited], [pushStart + 4, EXPR.curious]]);
  return (
    <Stage cam={cam} pose={liveBody(f, pose)} expr={liveExpr(f, e, [t0 + 6])} bgBlur={5 * (1 - push)} fgBlur={push * 10}
      screenMode="noah" screenP={1} screenImg="ui/IMG_0583.jpeg" />
  );
};

// ------------------------------------------------------------------ SCENES 3b + 4: genuine Noah UI with Byte "facecam"
const H = { "IMG_0583.jpeg": 998, "IMG_0585.jpeg": 989, "IMG_0586.jpeg": 985, "IMG_0588.jpeg": 977, "IMG_0593.jpeg": 985, "IMG_0594.jpeg": 985 } as const;
const shot = (img: keyof typeof H, from: number, to: number, f0: Shot["f0"], f1: Shot["f1"]): Shot => ({ img, from, to, f0, f1, h: H[img] });

const UI_FROM = W(3, "noah") + 22; // crossfade into the UI as the camera reaches the monitor
const checks = W(3, "checks");
const explains = W(3, "explains");
const findingsTo = W(4, "shows") - 2;
const dialogFrom = cueFrame("approval-ding") - 2;
const clickF = cueFrame("click-go-ahead");
const approvedF = clickF + 5;

const SHOTS: Shot[] = [
  shot("IMG_0583.jpeg", UI_FROM, checks + 2, { cx: 640, cy: 330, w: 1000 }, { cx: 760, cy: 200, w: 700 }),
  shot("IMG_0585.jpeg", checks + 2, checks + 18, { cx: 700, cy: 250, w: 680 }, { cx: 690, cy: 260, w: 640 }),
  shot("IMG_0586.jpeg", checks + 18, explains + 2, { cx: 690, cy: 265, w: 640 }, { cx: 690, cy: 275, w: 620 }),
  shot("IMG_0588.jpeg", explains + 2, S[4].from, { cx: 745, cy: 260, w: 820 }, { cx: 748, cy: 205, w: 730 }),
  shot("IMG_0588.jpeg", S[4].from, findingsTo, { cx: 748, cy: 205, w: 730 }, { cx: 752, cy: 380, w: 730 }),
  shot("IMG_0588.jpeg", findingsTo, dialogFrom, { cx: 752, cy: 380, w: 730 }, { cx: 690, cy: 640, w: 600 }),
  shot("IMG_0593.jpeg", dialogFrom, approvedF, { cx: 600, cy: 520, w: 820 }, { cx: 588, cy: 510, w: 580 }),
  shot("IMG_0594.jpeg", approvedF, S[5].from + 6, { cx: 560, cy: 740, w: 680 }, { cx: 560, cy: 770, w: 620 }),
];

const HIGHLIGHTS: Highlight[] = [
  // "explains what it finds": the Situation paragraph
  { img: "IMG_0588.jpeg", from: explains + 8, to: S[4].from, x: 398, y: 150, w: 640, h: 40, style: "marker" },
  { img: "IMG_0588.jpeg", from: explains + 14, to: S[4].from, x: 398, y: 190, w: 700, h: 40, style: "marker" },
  { img: "IMG_0588.jpeg", from: explains + 20, to: S[4].from, x: 398, y: 228, w: 420, h: 40, style: "marker" },
  // actual findings
  { img: "IMG_0588.jpeg", from: S[4].from + 8, to: findingsTo, x: 400, y: 325, w: 700, h: 112 },
  // actual recommendations, one by one, then the plan button
  ...[0, 1, 2, 3].map((i) => ({ img: "IMG_0588.jpeg", from: findingsTo + 4 + i * 6, to: dialogFrom, x: 396, y: 497 + i * 64.5, w: 520, h: 52, color: "#A78BFA" })),
  { img: "IMG_0588.jpeg", from: findingsTo + 30, to: dialogFrom, x: 400, y: 760, w: 696, h: 52, color: "#FFB547" },
  // the real approval step
  { img: "IMG_0593.jpeg", from: dialogFrom + 10, to: approvedF, x: 345, y: 390, w: 485, h: 245, color: "#FFB547" },
  { img: "IMG_0594.jpeg", from: approvedF + 2, to: S[5].from + 6, x: 386, y: 712, w: 280, h: 46, color: "#34D399" },
];

const UIScene: React.FC<{ f: number }> = ({ f }) => {
  const appear = easeOut(clamp01((f - UI_FROM + 8) / 12));
  const out = 1 - clamp01((f - S[5].from) / 6);
  const pipPose = kfPose(f, [
    [UI_FROM, { ...POSES.rest, armL: ARMS.pointUpish }],
    [checks + 10, { ...POSES.rest, headRoll: 0.08, armL: ARMS.pointUpish }],
    [explains, { ...POSES.rest, headRoll: -0.08, armL: ARMS.gestureOpen, armR: ARMS.gestureOpen }],
    [S[4].from + 6, { ...POSES.thinking }],
    [findingsTo, { ...POSES.rest, headRoll: 0.1, armL: ARMS.pointUpish }],
    [dialogFrom + 4, { ...POSES.rest, headRoll: -0.1, armL: ARMS.pointUpish, lean: 0.06 }],
    [approvedF - 6, { ...POSES.rest, headRoll: -0.1, armL: ARMS.pointUpish, lean: 0.06 }],
    [approvedF + 2, { ...POSES.rest, armL: ARMS.thumbsHigh }],
  ]);
  const pipExpr = kfExpr(f, [
    [UI_FROM, EXPR.curious], [explains, EXPR.excited], [S[4].from + 4, EXPR.curious],
    [findingsTo, EXPR.sincere], [dialogFrom, EXPR.curious], [approvedF, EXPR.happy],
  ]);
  return (
    <AbsoluteFill style={{ opacity: appear * out, transform: `scale(${1.15 - 0.15 * appear})` }}>
      <AbsoluteFill style={{ background: "radial-gradient(90% 60% at 50% 40%, #fbf8f2 0%, #efe9df 50%, #e3dbf3 100%)" }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(99,102,241,0.14) 2px, transparent 2px)", backgroundSize: "36px 36px", opacity: 0.6 }} />
      <div style={{ position: "absolute", left: 40, top: 350 }}>
        <UIViewport vw={1000} vh={750} shots={SHOTS} highlights={HIGHLIGHTS}
          cursor={{ img: "IMG_0593.jpeg", keys: [{ f: dialogFrom + 6, x: 487, y: 500 }, { f: clickF - 6, x: 603, y: 585 }, { f: clickF, x: 603, y: 585, click: true }] }} />
      </div>
      {/* creator facecam: Byte reacting under the product */}
      <div style={{ position: "absolute", left: 140, right: 140, top: 1330, height: 560, borderRadius: 400, background: "radial-gradient(50% 50% at 50% 55%, rgba(139,92,246,0.35), rgba(139,92,246,0) 70%)" }} />
      <div style={{ position: "absolute", left: 0, top: 1190 }}>
        <ByteLayer width={1080} height={730} cam={{ pos: [0, 1.75, 6.2], look: [0, 1.5, 0], fov: 33 }} pose={liveBody(f, pipPose)} expr={liveExpr(f, pipExpr, [UI_FROM + 20, explains + 12, S[4].from + 30, dialogFrom + 3], { look: [0, 0.35] })} />
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ SCENE 5: CTA selfie + end card
const END_FROM = W(5, "it's") - 6;
const Scene5: React.FC<{ f: number }> = ({ f }) => {
  const t0 = S[5].from;
  const check = W(5, "check");
  const pushIn = kf(f, [[check - 4, 0], [check + 8, 1]], easeOut);
  const end = ease(clamp01((f - END_FROM) / 18));
  const whipIn = 1 - easeOut(clamp01((f - t0) / 6));
  const cam = selfieCam(f, { x: -0.05, y: 2.05 - end * 0.1, z: 5.6 - pushIn * 0.6 + end * 0.9, lx: -0.25 + whipIn * -4, ly: 1.6 - end * 1.25, fov: 60 - pushIn * 6 }, 1 - end * 0.6);
  const pose = kfPose(f, [
    [t0, { ...POSES.selfie, x: -0.2, headRoll: -0.08 }],
    [W(5, "i'd"), { ...POSES.selfie, x: -0.2, headRoll: 0.06, armL: ARMS.gestureOpen }],
    [W(5, "guess") - 4, { ...POSES.selfieShrug, x: -0.2, headRoll: -0.12 }],
    [check - 3, { ...POSES.selfie, x: -0.2, armL: ARMS.thumbsHigh, headRoll: 0.1 }],
    [END_FROM, { ...POSES.selfie, x: -0.1, armL: ARMS.thumbsHigh, headRoll: 0.12, lean: 0.04 }],
    [TL.durationInFrames, { ...POSES.selfie, x: -0.1, armL: ARMS.thumbsHigh, headRoll: 0.06 }],
  ], easeOut);
  const e = kfExpr(f, [
    [t0, EXPR.sincere], [W(5, "rather"), EXPR.sincere], [W(5, "than"), EXPR.smug], [check - 4, EXPR.happy],
  ]);
  return (
    <>
      <Stage cam={cam} pose={liveBody(f, pose, 1 - end * 0.5)} expr={liveExpr(f, e, [t0 + 10, check + 18, END_FROM + 30])} bgBlur={6 + end * 6 + whipIn * 16} fgBlur={whipIn * 14}
        screenMode="noah" screenP={1} screenImg="ui/IMG_0595.jpeg" />
      <EndCard from={END_FROM} />
    </>
  );
};

// ------------------------------------------------------------------ headlines
const HEADLINES: Headline[] = [
  { from: 6, to: S[2].from - 4, text: "WHY IS MY PC ACTING LIKE THIS?", hi: ["PC"], y: 190 },
  { from: W(2, "slow") - 2, to: W(2, "no") - 6, text: "SLOW STARTUP?", hi: ["SLOW"], y: 190, rot: -3 },
  { from: W(2, "background") - 2, to: W(2, "no") - 6, text: "BACKGROUND APPS?", hi: ["APPS"], y: 330, rot: 2 },
  { from: W(2, "no") - 2, to: S[3].from - 2, text: "WHAT'S GOING ON?", y: 190, rot: -2 },
  { from: W(3, "noah"), to: S[4].from - 2, text: "NOAH CHECKS WHAT'S HAPPENING.", hi: ["NOAH"], y: 150, size: 54, rot: -1 },
  { from: S[4].from + 2, to: S[5].from - 2, text: "YOU APPROVE BEFORE CHANGES ARE MADE.", hi: ["APPROVE"], y: 150, size: 54, rot: 1 },
];

export const NoahByteUGC: React.FC = () => {
  const f = useCurrentFrame();
  const s2bStart = W(2, "and") - 6;
  const inUI = f >= UI_FROM - 8 && f < S[5].from + 6;
  const capY = inUI ? 1118 : f >= S[2].from && f < s2bStart ? 1420 : 1330;
  // flash frame on the two big whip transitions
  const flash = Math.max(
    interpolate(f, [S[2].from - 1, S[2].from + 1, S[2].from + 4], [0, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [S[5].from - 1, S[5].from + 1, S[5].from + 4], [0, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ background: "#0d0f1c" }}>
      <Fonts />
      {f < S[2].from && <Scene1 f={f} />}
      {f >= S[2].from && f < s2bStart && <Scene2a f={f} />}
      {f >= s2bStart && f < S[3].from && <Scene2b f={f} start={s2bStart} />}
      {f >= S[3].from && f < UI_FROM + 6 && <Scene3a f={f} />}
      {inUI && <UIScene f={f} />}
      {f >= S[5].from && <Scene5 f={f} />}
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      <Headlines items={HEADLINES} />
      <DialogueCaptions y={capY} hidden={(fr) => fr >= END_FROM + 4} />
      <Audio src={staticFile("audio/mix.wav")} />
    </AbsoluteFill>
  );
};
