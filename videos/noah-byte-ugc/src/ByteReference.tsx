import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Byte, Pose } from "./byte/Byte";
import { EXPR, Expr } from "./byte/face";
import { POSES } from "./byte/poses";
import { Lighting } from "./scene/Lighting";
import { Fonts, SANS, SERIF } from "./components/Fonts";
import { BYTE_COLORS } from "./byte/Byte";

const Shot: React.FC<{ w: number; h: number; pose: Pose; expr: Expr; cam: [number, number, number]; look: [number, number, number]; fov?: number; ground?: boolean }> = ({ w, h, pose, expr, cam, look, fov = 30, ground }) => {
  const frame = useCurrentFrame();
  return (
    <ThreeCanvas width={w} height={h} shadows camera={{ position: cam, fov }} gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
      onCreated={({ camera }) => camera.lookAt(...look)}>
      <Lighting />
      <Byte pose={pose} expr={expr} frame={frame} />
      {ground && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.86, 0]} receiveShadow>
          <circleGeometry args={[2.6, 64]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
      )}
    </ThreeCanvas>
  );
};

const card: React.CSSProperties = { position: "absolute", borderRadius: 36, background: "rgba(255,255,255,0.55)", boxShadow: "0 10px 40px rgba(60,40,140,0.12)", overflow: "hidden" };
const label: React.CSSProperties = { position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 16, padding: "8px 22px", borderRadius: 999, background: "rgba(255,255,255,0.9)", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#2b2560", letterSpacing: 1 };

const EXPRS: [string, Expr, Pose][] = [
  ["FRUSTRATED", EXPR.frustrated, POSES.rest],
  ["CONFUSED", EXPR.confused, { ...POSES.rest, headRoll: 0.18 }],
  ["CURIOUS", EXPR.curious, { ...POSES.rest, headRoll: -0.1 }],
  ["SMUG", EXPR.smug, { ...POSES.rest, headYaw: 0.15 }],
  ["HAPPY", EXPR.happy, POSES.rest],
  ["SHOCKED", EXPR.shocked, POSES.rest],
];

// Official Byte character reference sheet. Every shot in the video uses this exact model.
export const ByteReference: React.FC = () => {
  const W = 2400, H = 1600;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 30% 30%, #fbf9ff 0%, #ece7fb 55%, #d9d1f3 100%)" }}>
      <Fonts />
      <div style={{ position: "absolute", left: 90, top: 70, fontFamily: SERIF, fontSize: 150, color: "#1A1D61", lineHeight: 1 }}>Byte</div>
      <div style={{ position: "absolute", left: 96, top: 230, fontFamily: SANS, fontSize: 30, fontWeight: 600, color: "#5a5590", letterSpacing: 3 }}>OFFICIAL CHARACTER REFERENCE · NOAH</div>
      <div style={{ ...card, left: 60, top: 300, width: 1000, height: 1240 }}>
        <Shot w={1000} h={1240} pose={POSES.hero} expr={EXPR.happy} cam={[0, 1.2, 9.4]} look={[0, 1.0, 0]} ground />
        <div style={label}>HERO POSE</div>
      </div>
      {EXPRS.map(([name, e, p], i) => {
        const col = i % 3, row = Math.floor(i / 3);
        return (
          <div key={name} style={{ ...card, left: 1110 + col * 420, top: 70 + row * 470, width: 400, height: 450 }}>
            <Shot w={400} h={450} pose={p} expr={e} cam={[0, 1.85, 6.2]} look={[0, 1.72, 0]} fov={28} />
            <div style={label}>{name}</div>
          </div>
        );
      })}
      <div style={{ ...card, left: 1110, top: 1020, width: 610, height: 520 }}>
        <Shot w={610} h={520} pose={POSES.selfieThumbs} expr={EXPR.happy} cam={[0.2, 1.4, 7.6]} look={[0, 1.1, 0]} fov={30} />
        <div style={label}>THUMBS-UP</div>
      </div>
      <div style={{ ...card, left: 1740, top: 1020, width: 600, height: 520, padding: 40, boxSizing: "border-box", fontFamily: SANS, color: "#2b2560" }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 2, marginBottom: 18 }}>PALETTE</div>
        <div style={{ display: "flex", gap: 14, marginBottom: 26 }}>
          {[BYTE_COLORS.headTop, BYTE_COLORS.headBottom, BYTE_COLORS.bodyBottom, BYTE_COLORS.trim, BYTE_COLORS.joint, BYTE_COLORS.glow, BYTE_COLORS.antennaTip].map((c) => (
            <div key={c} style={{ width: 62, height: 62, borderRadius: 18, background: c, boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.08)" }} />
          ))}
        </div>
        <div style={{ fontSize: 23, lineHeight: 1.55, fontWeight: 500 }}>
          Oversized ellipsoid head · glossy black visor face<br />
          Big glossy eyes with violet irises · light-bar brows<br />
          White headphone ears · antenna with amber tip<br />
          Blue→violet gradient shell · white belly + hands<br />
          Chest light ring · 3 fingers + thumb
        </div>
      </div>
    </AbsoluteFill>
  );
};
