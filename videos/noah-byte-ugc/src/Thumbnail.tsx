import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Stage, Cam } from "./scene/Stage";
import { EXPR, Expr } from "./byte/face";
import { ARMS, POSES } from "./byte/poses";
import { Pose } from "./byte/Byte";
import { IconState } from "./scene/Office";
import { Fonts, SANS } from "./components/Fonts";

// Dedicated thumbnail art (not a video frame): confused Byte, misbehaving PC, big hook.
const whyExpr: Expr = { ...EXPR.confused, browL: 0.75, browR: -0.45, browY: 0.35, eyeScale: 1.16, pupilScale: 0.72, lidTopL: 0, lidTopR: 0.3, mouthOpen: 0.42, mouthSmile: -0.35, mouthW: 0.8, mouthSkew: -0.6, pupilX: -0.05, pupilY: 0.05 };
const whyPose: Pose = { ...POSES.rest, headRoll: 0.2, headPitch: -0.04, lean: 0.06, armL: ARMS.whyUp, armR: ARMS.whyUp };
const icons = (spread = 1): IconState[] =>
  ([[-1.25, 1.75, 0.6], [0.35, 2.15, 0.9], [1.35, 1.45, 0.5], [-1.45, 0.45, 1.3], [1.45, 0.05, 1.1], [-0.95, -1.45, 1.0], [0.95, -1.35, 1.3], [-0.2, 2.85, 0.4]] as const)
    .map(([x, y, z], i) => ({ idx: i, p: 1, x: x * spread, y, z }));

const Headline: React.FC<{ size: number; lines: string[]; hiLine?: number }> = ({ size, lines, hiLine = 2 }) => (
  <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: -2, color: "#fff", textTransform: "uppercase" }}>
    {lines.map((l, i) => (
      <div key={i} style={{ display: "block" }}>
        <span style={{
          color: i === hiLine ? "#FFB547" : "#ffffff", WebkitTextStroke: `${size * 0.09}px #14163d`, paintOrder: "stroke fill",
          textShadow: `0 ${size * 0.09}px 0 #14163d, 0 ${size * 0.2}px ${size * 0.4}px rgba(0,0,0,0.5)`,
        }}>{l}</span>
      </div>
    ))}
  </div>
);

const NoahBadge: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14 * scale, background: "#1A1D61", padding: `${12 * scale}px ${26 * scale}px ${12 * scale}px ${16 * scale}px`, borderRadius: 999, boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 2px rgba(199,203,255,0.3)" }}>
    <Img src={staticFile("brand/noah-mark-dark.svg")} style={{ width: 54 * scale, height: 54 * scale }} />
    <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38 * scale, color: "#fff", letterSpacing: 2 }}>NOAH</span>
  </div>
);

export const ThumbnailShorts: React.FC = () => {
  const cam: Cam = { pos: [0.55, 1.55, 5.7], look: [0.35, 1.75, 0], fov: 62, roll: -0.04 };
  return (
    <AbsoluteFill style={{ background: "#0d0f1c" }}>
      <Fonts />
      <Stage cam={cam} pose={{ ...whyPose, x: 0.3, y: -0.3 }} expr={whyExpr} bgBlur={3} screenMode="busy" screenP={1} icons={icons(1)} />
      {/* contrast: darken the top for the headline, vignette edges */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(14,10,46,0.82) 0%, rgba(14,10,46,0.35) 30%, rgba(0,0,0,0) 45%, rgba(0,0,0,0) 78%, rgba(14,10,46,0.55) 100%)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(10,6,40,0.65)" }} />
      <div style={{ position: "absolute", top: 210, left: 70, right: 70, textAlign: "center", transform: "rotate(-3deg)" }}>
        <Headline size={142} lines={["WHY IS MY", "PC DOING", "THIS?!"]} />
      </div>
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <NoahBadge scale={0.9} />
      </div>
    </AbsoluteFill>
  );
};

export const ThumbnailLandscape: React.FC = () => {
  const cam: Cam = { pos: [0.1, 1.5, 6.4], look: [0.95, 1.45, 0], fov: 46, roll: -0.03 };
  return (
    <AbsoluteFill style={{ background: "#0d0f1c" }}>
      <Fonts />
      <Stage cam={cam} pose={{ ...whyPose, x: -1.05, y: -0.25, yaw: 0.18 }} expr={whyExpr} bgBlur={2} screenMode="busy" screenP={1} icons={icons(1)} />
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(14,10,46,0.85) 0%, rgba(14,10,46,0.5) 40%, rgba(0,0,0,0) 62%)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 160px rgba(10,6,40,0.6)" }} />
      <div style={{ position: "absolute", top: 70, right: 56, width: 640, textAlign: "right", transform: "rotate(-2deg)" }}>
        <Headline size={104} lines={["WHY IS MY", "PC DOING", "THIS?!"]} />
      </div>
      <div style={{ position: "absolute", bottom: 52, right: 60 }}>
        <NoahBadge scale={0.85} />
      </div>
    </AbsoluteFill>
  );
};
