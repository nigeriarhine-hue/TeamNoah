import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Byte, Pose } from "../byte/Byte";
import { Expr } from "../byte/face";
import { Lighting } from "./Lighting";
import { IconState, Office } from "./Office";
import { ScreenMode } from "./screen";

export type Cam = { pos: [number, number, number]; look: [number, number, number]; fov: number; roll?: number };

const CameraRig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const { camera, size } = useThree();
  const c = camera as THREE.PerspectiveCamera;
  c.position.set(...cam.pos);
  c.up.set(Math.sin(cam.roll ?? 0), Math.cos(cam.roll ?? 0), 0);
  c.lookAt(...cam.look);
  c.fov = cam.fov;
  c.aspect = size.width / size.height;
  c.near = 0.05;
  c.far = 80;
  c.updateProjectionMatrix();
  return null;
};

// Two synchronised 3D layers: the office (background) and Byte (foreground).
// Blurring one layer gives a cheap, convincing rack-focus / depth-of-field.
export const Stage: React.FC<{
  cam: Cam;
  pose: Pose | null;
  expr: Expr;
  bgBlur?: number;
  fgBlur?: number;
  screenMode: ScreenMode;
  screenP: number;
  screenImg?: string | null;
  icons?: IconState[];
  width?: number;
  height?: number;
}> = ({ cam, pose, expr, bgBlur = 0, fgBlur = 0, screenMode, screenP, screenImg, icons, width, height }) => {
  const frame = useCurrentFrame();
  const vc = useVideoConfig();
  const w = width ?? vc.width;
  const h = height ?? vc.height;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: bgBlur > 0.2 ? `blur(${bgBlur}px)` : undefined, transform: bgBlur > 0.2 ? "scale(1.03)" : undefined }}>
        <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <CameraRig cam={cam} />
          <Lighting shadows />
          <Office frame={frame} screenMode={screenMode} screenP={screenP} screenImg={screenImg} icons={icons} />
        </ThreeCanvas>
      </AbsoluteFill>
      {pose && (
        <AbsoluteFill style={{ filter: fgBlur > 0.2 ? `blur(${fgBlur}px)` : undefined }}>
          <ThreeCanvas width={w} height={h} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}>
            <CameraRig cam={cam} />
            <Lighting shadows={false} />
            <Byte pose={pose} expr={expr} frame={frame} />
          </ThreeCanvas>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// Byte alone on a transparent layer (creator "facecam" over the product UI, thumbnails)
export const ByteLayer: React.FC<{ cam: Cam; pose: Pose; expr: Expr; width: number; height: number; keyIntensity?: number }> = ({ cam, pose, expr, width, height, keyIntensity }) => {
  const frame = useCurrentFrame();
  return (
    <ThreeCanvas width={width} height={height} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}>
      <CameraRig cam={cam} />
      <Lighting shadows={false} keyIntensity={keyIntensity} />
      <Byte pose={pose} expr={expr} frame={frame} />
    </ThreeCanvas>
  );
};
