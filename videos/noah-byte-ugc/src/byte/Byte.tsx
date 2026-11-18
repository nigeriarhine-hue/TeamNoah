import React, { useMemo } from "react";
import * as THREE from "three";
import { drawFace, Expr, FACE_H, FACE_W } from "./face";

// ------------------------------------------------------------------ pose types
export type ArmPose = {
  raise: number; // forward raise (rad)
  spread: number; // sideways raise (rad)
  twist: number; // upper-arm twist (rad)
  elbow: number; // elbow bend (rad, + bends forward)
  wristX: number;
  wristZ: number;
  curl: number; // 0 open hand .. 1 fist
  thumb: number; // 0 tucked .. 1 thumbs-up
  point: number; // 0 .. 1 index finger extended
};

export type Pose = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  lean: number; // + leans forward
  roll: number;
  headYaw: number;
  headPitch: number; // + looks down
  headRoll: number;
  armL: ArmPose; // Byte's left (frame right when facing camera)
  armR: ArmPose;
};

export const ARM_REST: ArmPose = { raise: 0.12, spread: 0.18, twist: 0, elbow: 0.35, wristX: 0, wristZ: 0, curl: 0.35, thumb: 0, point: 0 };

export const POSE_REST: Pose = {
  x: 0, y: 0, z: 0, yaw: 0, lean: 0, roll: 0, headYaw: 0, headPitch: 0, headRoll: 0,
  armL: ARM_REST, armR: ARM_REST,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpArm = (a: ArmPose, b: ArmPose, t: number): ArmPose => {
  const o = {} as ArmPose;
  (Object.keys(a) as (keyof ArmPose)[]).forEach((k) => (o[k] = lerp(a[k], b[k], t)));
  return o;
};
export const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const o = { ...a } as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => {
    if (k === "armL" || k === "armR") o[k] = lerpArm(a[k], b[k], t);
    else (o as any)[k] = lerp(a[k] as number, b[k] as number, t);
  });
  return o;
};

// ------------------------------------------------------------------ palette (Noah blue -> violet tide)
export const BYTE_COLORS = {
  headTop: "#9a7bff",
  headBottom: "#3f7cff",
  bodyTop: "#4d78ff",
  bodyBottom: "#7a52f0",
  trim: "#eef0ff",
  joint: "#262b57",
  glow: "#8fe3ff",
  antennaTip: "#ff9f43",
};

// vertical gradient baked into vertex colours
const gradientGeo = (geo: THREE.BufferGeometry, top: string, bottom: string, sharp = 1) => {
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const pos = geo.attributes.position;
  const cTop = new THREE.Color(top).convertSRGBToLinear();
  const cBot = new THREE.Color(bottom).convertSRGBToLinear();
  const cols = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    let t = (pos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y);
    t = Math.pow(THREE.MathUtils.smoothstep(t, 0, 1), sharp);
    c.copy(cBot).lerp(cTop, t);
    cols[i * 3] = c.r;
    cols[i * 3 + 1] = c.g;
    cols[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
  return geo;
};

const roundedRectMask = (w: number, h: number, r: number, pad: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d")!;
  x.fillStyle = "#000";
  x.fillRect(0, 0, w, h);
  x.fillStyle = "#fff";
  x.beginPath();
  (x as any).roundRect(pad, pad, w - pad * 2, h - pad * 2, r);
  x.fill();
  const t = new THREE.CanvasTexture(c);
  return t;
};

// head ellipsoid dimensions
const HEAD = { sx: 1.22, sy: 0.98, sz: 1.0 };
// visor angular extents on the head sphere
const VISOR = { phiLen: 2.05, thetaLen: 1.32, thetaMid: Math.PI / 2 + 0.06 };

// ------------------------------------------------------------------ shared assets (one Byte = one look)
const useByteAssets = () =>
  useMemo(() => {
    const shellMat = new THREE.MeshPhysicalMaterial({
      vertexColors: true, roughness: 0.3, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.12,
      sheen: 0.4, sheenColor: new THREE.Color("#c9b8ff"), sheenRoughness: 0.5,
    });
    const trimMat = new THREE.MeshPhysicalMaterial({ color: BYTE_COLORS.trim, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.2 });
    const jointMat = new THREE.MeshPhysicalMaterial({ color: BYTE_COLORS.joint, roughness: 0.32, metalness: 0.55, clearcoat: 0.6 });
    const glowMat = new THREE.MeshStandardMaterial({ color: BYTE_COLORS.glow, emissive: BYTE_COLORS.glow, emissiveIntensity: 2.2, toneMapped: false });
    const tipMat = new THREE.MeshStandardMaterial({ color: BYTE_COLORS.antennaTip, emissive: BYTE_COLORS.antennaTip, emissiveIntensity: 1.1, toneMapped: false });

    const headGeo = gradientGeo(new THREE.SphereGeometry(1, 96, 72), BYTE_COLORS.headTop, BYTE_COLORS.headBottom, 1.1);
    const bodyGeo = gradientGeo(new THREE.SphereGeometry(1, 72, 56), BYTE_COLORS.bodyTop, BYTE_COLORS.bodyBottom);

    const phiStart = Math.PI / 2 - VISOR.phiLen / 2;
    const visorGeo = new THREE.SphereGeometry(1.012, 96, 64, phiStart, VISOR.phiLen, VISOR.thetaMid - VISOR.thetaLen / 2, VISOR.thetaLen);
    const rimGeo = new THREE.SphereGeometry(1.006, 96, 64, phiStart - 0.09, VISOR.phiLen + 0.18, VISOR.thetaMid - VISOR.thetaLen / 2 - 0.08, VISOR.thetaLen + 0.16);

    const faceCanvas = document.createElement("canvas");
    faceCanvas.width = FACE_W;
    faceCanvas.height = FACE_H;
    const faceTex = new THREE.CanvasTexture(faceCanvas);
    faceTex.colorSpace = THREE.SRGBColorSpace;
    faceTex.anisotropy = 8;

    const visorMat = new THREE.MeshPhysicalMaterial({
      color: "#05071a", roughness: 0.08, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03,
      emissive: "#ffffff", emissiveMap: faceTex, emissiveIntensity: 1.75, envMapIntensity: 0.55,
      alphaMap: roundedRectMask(512, 280, 110, 6), alphaTest: 0.5,
    });
    const rimMat = new THREE.MeshPhysicalMaterial({
      color: BYTE_COLORS.trim, roughness: 0.3, clearcoat: 1,
      alphaMap: roundedRectMask(512, 280, 120, 4), alphaTest: 0.5,
    });

    const capsule = (r: number, l: number) => new THREE.CapsuleGeometry(r, l, 8, 24);
    return { shellMat, trimMat, jointMat, glowMat, tipMat, headGeo, bodyGeo, visorGeo, rimGeo, faceCanvas, faceTex, visorMat, rimMat, capsule };
  }, []);

type Assets = ReturnType<typeof useByteAssets>;

// ------------------------------------------------------------------ arm
const Hand: React.FC<{ a: Assets; p: ArmPose }> = ({ a, p }) => {
  const fingers = [-0.07, 0.0, 0.07];
  return (
    <group rotation={[p.wristX, 0, p.wristZ]}>
      {/* palm */}
      <mesh material={a.trimMat} position={[0, -0.12, 0]} scale={[0.15, 0.17, 0.155]} castShadow>
        <sphereGeometry args={[1, 32, 24]} />
      </mesh>
      {fingers.map((z, i) => {
        const isIndex = i === 2; // front-most finger = index
        const curl = isIndex ? p.curl * (1 - p.point) : p.curl;
        return (
          <group key={i} position={[-0.02, -0.24, z]} rotation={[0, 0, -curl * 1.9]}>
            <mesh material={a.trimMat} position={[0, -0.06 - (isIndex ? p.point * 0.03 : 0), 0]} geometry={a.capsule(0.048, 0.08 + (isIndex ? p.point * 0.06 : 0))} castShadow />
          </group>
        );
      })}
      {/* thumb on the front side */}
      <group position={[-0.03, -0.12, 0.12]} rotation={[-Math.PI / 2 * p.thumb + 0.3 * (1 - p.thumb), 0, -0.35 * (1 - p.thumb)]}>
        <mesh material={a.trimMat} position={[0, -0.08, 0]} geometry={a.capsule(0.05, 0.1)} castShadow />
      </group>
    </group>
  );
};

const Arm: React.FC<{ a: Assets; p: ArmPose; side: 1 | -1 }> = ({ a, p, side }) => (
  <group position={[0.72 * side, 0.3, 0]} scale={[side, 1, 1]}>
    <group rotation={[-p.raise, p.twist, p.spread]}>
      <mesh material={a.jointMat} castShadow>
        <sphereGeometry args={[0.16, 32, 24]} />
      </mesh>
      <mesh material={a.shellMat} geometry={a.capsule(0.105, 0.3)} position={[0, -0.25, 0]} castShadow>
        {/* shell material without vertex colours would be black, so use trim-tinted body colour */}
      </mesh>
      <group position={[0, -0.5, 0]} rotation={[-p.elbow, 0, 0]}>
        <mesh material={a.jointMat}>
          <sphereGeometry args={[0.115, 24, 18]} />
        </mesh>
        <mesh material={a.shellMat} geometry={a.capsule(0.11, 0.26)} position={[0, -0.22, 0]} castShadow />
        <group position={[0, -0.42, 0]}>
          <Hand a={a} p={p} />
        </group>
      </group>
    </group>
  </group>
);

// ------------------------------------------------------------------ Byte
export const Byte: React.FC<{ pose: Pose; expr: Expr; frame: number; scale?: number }> = ({ pose, expr, frame, scale = 1 }) => {
  const a = useByteAssets();
  // capsule arms use plain colour (vertex colours need a 'color' attribute)
  const armMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#6a6cf8", roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12 }), []);
  const aArm = useMemo(() => ({ ...a, shellMat: armMat }), [a, armMat]);

  // draw the face for this frame (synchronous so every rendered frame is deterministic)
  drawFace(a.faceCanvas, expr);
  a.faceTex.needsUpdate = true;

  const t = frame / 30;
  const breathe = Math.sin(t * 2.4) * 0.012;
  // antenna secondary motion lags behind head motion
  const wob = Math.sin(t * 7.5) * 0.06 + pose.headRoll * -0.8 + pose.headYaw * -0.15;

  return (
    <group position={[pose.x, pose.y, pose.z]} rotation={[pose.lean, pose.yaw, pose.roll]} scale={scale}>
      {/* body */}
      <mesh geometry={a.bodyGeo} material={a.shellMat} scale={[0.78, 0.84 + breathe, 0.68]} castShadow receiveShadow />
      {/* belly plate */}
      <mesh material={a.trimMat} position={[0, -0.12, 0.42]} scale={[0.46, 0.5, 0.3]}>
        <sphereGeometry args={[1, 48, 32]} />
      </mesh>
      {/* chest light */}
      <mesh material={a.glowMat} position={[0, 0.0, 0.71]} rotation={[0.1, 0, 0]}>
        <torusGeometry args={[0.085, 0.022, 16, 48]} />
      </mesh>
      <mesh material={a.glowMat} position={[0, 0.0, 0.705]} scale={[1, 1, 0.3]}>
        <sphereGeometry args={[0.04 + 0.01 * Math.sin(t * 5), 20, 16]} />
      </mesh>
      {/* neck */}
      <mesh material={a.jointMat} position={[0, 0.84, 0]}>
        <cylinderGeometry args={[0.2, 0.26, 0.26, 32]} />
      </mesh>

      <Arm a={aArm} p={pose.armR} side={-1} />
      <Arm a={aArm} p={pose.armL} side={1} />

      {/* head pivots at the neck */}
      <group position={[0, 0.94, 0]} rotation={[pose.headPitch, pose.headYaw, pose.headRoll]}>
        <group position={[0, 0.86, 0]}>
          <mesh geometry={a.headGeo} material={a.shellMat} scale={[HEAD.sx, HEAD.sy, HEAD.sz]} castShadow receiveShadow />
          <mesh geometry={a.rimGeo} material={a.rimMat} scale={[HEAD.sx, HEAD.sy, HEAD.sz]} />
          <mesh geometry={a.visorGeo} material={a.visorMat} scale={[HEAD.sx, HEAD.sy, HEAD.sz]} />
          {/* headphone ears */}
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 1.17, 0.02, -0.04]} rotation={[0, 0, Math.PI / 2]}>
              <mesh material={a.trimMat} castShadow>
                <cylinderGeometry args={[0.33, 0.36, 0.22, 48]} />
              </mesh>
              <mesh material={a.glowMat} position={[0, s * 0.115, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.2, 0.03, 16, 48]} />
              </mesh>
              <mesh material={a.jointMat} position={[0, s * 0.11, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
              </mesh>
            </group>
          ))}
          {/* antenna with a little springy wobble */}
          <group position={[0.18, 0.93, -0.05]} rotation={[-0.12 + wob * 0.3, 0, -0.18 + wob]}>
            <mesh material={a.jointMat}>
              <sphereGeometry args={[0.09, 24, 16]} />
            </mesh>
            <mesh material={a.trimMat} position={[0, 0.24, 0]}>
              <cylinderGeometry args={[0.026, 0.034, 0.44, 16]} />
            </mesh>
            <mesh material={a.tipMat} position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.1, 32, 24]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
