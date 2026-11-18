import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { continueRender, delayRender, staticFile } from "remotion";
import { drawIcon, drawScreen, ICON_KINDS, ScreenMode, SCREEN_H, SCREEN_W } from "./screen";

// ------------------------------------------------------------------ image preloading (deterministic)
const cache = new Map<string, HTMLImageElement>();
export const useImageEl = (src: string | null) => {
  const [img, setImg] = useState<HTMLImageElement | null>(src ? cache.get(src) ?? null : null);
  const [handle] = useState(() => (src && !cache.get(src)?.complete ? delayRender("img " + src) : null));
  useEffect(() => {
    if (!src) return;
    const existing = cache.get(src);
    if (existing && existing.complete) {
      setImg(existing);
      if (handle !== null) continueRender(handle);
      return;
    }
    const im = existing ?? new Image();
    cache.set(src, im);
    im.onload = () => {
      setImg(im);
      if (handle !== null) continueRender(handle);
    };
    if (!existing) im.src = staticFile(src);
  }, [src, handle]);
  return img;
};

// ------------------------------------------------------------------ materials
const std = (color: string, rough = 0.6, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: rough, ...extra });

export type IconState = { idx: number; p: number; x: number; y: number; z: number };

export type MonitorPos = { x: number; y: number; z: number; w: number; h: number };
export const MONITOR: MonitorPos = { x: 2.15, y: 0.95, z: -3.6, w: 3.6, h: 2.1 };

export const Office: React.FC<{
  frame: number;
  screenMode: ScreenMode;
  screenP: number;
  screenImg?: string | null;
  icons?: IconState[];
}> = ({ frame, screenMode, screenP, screenImg = null, icons = [] }) => {
  const img = useImageEl(screenImg);
  const m = useMemo(() => {
    const wall = std("#efe2d0", 0.9);
    const wallAccent = std("#d7c4e8", 0.9);
    const wood = std("#b9825a", 0.45, { clearcoat: 0.4, clearcoatRoughness: 0.4 });
    const woodDark = std("#7a5134", 0.5);
    const bezel = std("#1b1d26", 0.35, { metalness: 0.3, clearcoat: 0.6 });
    const white = std("#f6f3ee", 0.5);
    const potMat = std("#e9845f", 0.55, { clearcoat: 0.3 });
    const leaf = std("#4caf6a", 0.55, { sheen: 0.5, sheenColor: new THREE.Color("#b7f5c6") });
    const leaf2 = std("#2f8f55", 0.6);
    const metal = std("#c9ccd6", 0.3, { metalness: 0.8 });
    const books = ["#5b6cff", "#ff8a65", "#ffd166", "#06d6a0", "#8b5cf6", "#ef476f"].map((c) => std(c, 0.65));
    const skyCanvas = document.createElement("canvas");
    skyCanvas.width = 256;
    skyCanvas.height = 256;
    const sc = skyCanvas.getContext("2d")!;
    const g = sc.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#9fd0ff");
    g.addColorStop(0.7, "#fff1d6");
    g.addColorStop(1, "#ffd7a8");
    sc.fillStyle = g;
    sc.fillRect(0, 0, 256, 256);
    sc.fillStyle = "rgba(255,255,255,0.8)";
    for (const [x, y, r] of [[70, 80, 30], [100, 70, 38], [135, 85, 28], [190, 120, 20], [210, 115, 26]]) {
      sc.beginPath();
      sc.arc(x, y, r, 0, Math.PI * 2);
      sc.fill();
    }
    const skyTex = new THREE.CanvasTexture(skyCanvas);
    skyTex.colorSpace = THREE.SRGBColorSpace;
    const sky = new THREE.MeshBasicMaterial({ map: skyTex, toneMapped: false });

    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = SCREEN_W;
    screenCanvas.height = SCREEN_H;
    const screenTex = new THREE.CanvasTexture(screenCanvas);
    screenTex.colorSpace = THREE.SRGBColorSpace;
    screenTex.anisotropy = 8;
    const screen = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false });

    const iconMats = ICON_KINDS.map((k) => {
      const cv = document.createElement("canvas");
      cv.width = 256;
      cv.height = 256;
      drawIcon(cv, k);
      const t = new THREE.CanvasTexture(cv);
      t.colorSpace = THREE.SRGBColorSpace;
      return new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false, depthWrite: false });
    });
    const art = ["#8b5cf6", "#f59e0b", "#14b8a6"].map((c) => std(c, 0.8));
    const lampGlow = new THREE.MeshBasicMaterial({ color: "#fff3d6", toneMapped: false });
    return { wall, wallAccent, wood, woodDark, bezel, white, potMat, leaf, leaf2, metal, books, sky, screen, screenCanvas, screenTex, iconMats, art, lampGlow };
  }, []);

  drawScreen(m.screenCanvas, screenMode, screenP, frame / 30, img);
  m.screenTex.needsUpdate = true;

  const M = MONITOR;
  const deskY = -0.55;
  return (
    <group>
      {/* back wall + accent panel */}
      <mesh material={m.wall} position={[0, 2, -5.2]} receiveShadow>
        <planeGeometry args={[30, 16]} />
      </mesh>
      <mesh material={m.wallAccent} position={[3.6, 2.4, -5.15]}>
        <planeGeometry args={[5.2, 9]} />
      </mesh>
      {/* side wall (left) for depth */}
      <mesh material={m.wall} position={[-6.5, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 16]} />
      </mesh>
      {/* window with daylight */}
      <group position={[-2.6, 2.8, -5.1]}>
        <mesh material={m.sky}>
          <planeGeometry args={[2.6, 3.0]} />
        </mesh>
        {[[-1.35, 0, 0.12, 3.24], [1.35, 0, 0.12, 3.24], [0, 1.56, 2.82, 0.12], [0, -1.56, 2.82, 0.16], [0, 0, 0.08, 3.0], [0, 0.2, 2.6, 0.08]].map(([x, y, w, h], i) => (
          <mesh key={i} material={m.white} position={[x, y, 0.05]}>
            <boxGeometry args={[w, h, 0.12]} />
          </mesh>
        ))}
      </group>
      {/* wall art */}
      {[[-0.1, 3.5, 0.9, 1.2, 0], [0.95, 3.25, 0.7, 0.7, 1], [0.95, 4.2, 0.7, 0.5, 2]].map(([x, y, w, h, i]) => (
        <group key={i} position={[x, y, -5.1]}>
          <mesh material={m.white}>
            <boxGeometry args={[w + 0.12, h + 0.12, 0.05]} />
          </mesh>
          <mesh material={m.art[i]} position={[0, 0, 0.03]}>
            <planeGeometry args={[w, h]} />
          </mesh>
        </group>
      ))}
      {/* shelf with books */}
      <group position={[4.4, 3.4, -4.85]}>
        <mesh material={m.wood} castShadow>
          <boxGeometry args={[2.6, 0.1, 0.6]} />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} material={m.books[i]} position={[-1.0 + i * 0.22, 0.32 + (i % 2) * 0.05, 0]} rotation={[0, 0, i === 5 ? -0.25 : 0]} castShadow>
            <boxGeometry args={[0.18, 0.55 + (i % 3) * 0.1, 0.42]} />
          </mesh>
        ))}
        <mesh material={m.potMat} position={[0.75, 0.2, 0]}>
          <cylinderGeometry args={[0.18, 0.14, 0.3, 24]} />
        </mesh>
        {[[0.75, 0.48, 0, 0.2], [0.62, 0.42, 0.05, 0.14], [0.88, 0.44, -0.03, 0.15]].map(([x, y, z, r], i) => (
          <mesh key={i} material={i ? m.leaf2 : m.leaf} position={[x, y, z]}>
            <sphereGeometry args={[r, 20, 16]} />
          </mesh>
        ))}
      </group>
      {/* desk */}
      <mesh material={m.wood} position={[0.5, deskY, -3.7]} castShadow receiveShadow>
        <boxGeometry args={[10, 0.16, 2.6]} />
      </mesh>
      <mesh material={m.woodDark} position={[0.5, deskY - 1.2, -4.9]}>
        <boxGeometry args={[9.6, 2.3, 0.1]} />
      </mesh>
      {/* monitor */}
      <group position={[M.x, M.y, M.z]} rotation={[0, -0.28, 0]}>
        <mesh material={m.bezel} castShadow>
          <boxGeometry args={[M.w + 0.16, M.h + 0.16, 0.12]} />
        </mesh>
        <mesh material={m.screen} position={[0, 0, 0.065]}>
          <planeGeometry args={[M.w, M.h]} />
        </mesh>
        <mesh material={m.bezel} position={[0, -M.h / 2 - 0.45, -0.1]}>
          <boxGeometry args={[0.25, 0.9, 0.12]} />
        </mesh>
        <mesh material={m.bezel} position={[0, -M.h / 2 - 0.9 + 0.02, 0.05]}>
          <boxGeometry args={[1.2, 0.05, 0.7]} />
        </mesh>
        {/* screen glow spill onto the desk */}
        <pointLight position={[0, 0, 1.2]} intensity={screenMode === "off" ? 0 : 3} distance={4} color={screenMode === "noah" ? "#8b8ff8" : "#9fb4ff"} />
        {/* app icons bursting out of the screen */}
        {icons.map((ic, i) => {
          const s = ic.p <= 0 ? 0.0001 : 0.62 * (1 + Math.sin(Math.min(ic.p, 1) * Math.PI) * 0.25) * Math.min(1, ic.p * 1.6);
          const bob = Math.sin(frame / 30 * 3 + i) * 0.05;
          const k = Math.min(1, ic.p);
          return (
            <mesh key={i} material={m.iconMats[ic.idx % m.iconMats.length]} position={[ic.x * k, ic.y * k + bob, 0.15 + ic.z * k]} rotation={[0, 0.28, Math.sin(i * 2.1) * 0.2 * k]} scale={s}>
              <planeGeometry args={[1, 1]} />
            </mesh>
          );
        })}
      </group>
      {/* keyboard + mug + lamp */}
      <mesh material={m.white} position={[1.6, deskY + 0.12, -2.95]} rotation={[0, -0.28, 0]} castShadow>
        <boxGeometry args={[1.9, 0.08, 0.6]} />
      </mesh>
      <group position={[-0.5, deskY + 0.3, -3.1]}>
        <mesh material={m.potMat} castShadow>
          <cylinderGeometry args={[0.17, 0.15, 0.42, 28]} />
        </mesh>
        <mesh material={m.potMat} position={[0.2, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.1, 0.03, 12, 24]} />
        </mesh>
      </group>
      <group position={[4.3, deskY, -3.9]}>
        <mesh material={m.metal} position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.35, 0.4, 0.1, 32]} />
        </mesh>
        <mesh material={m.metal} position={[0, 0.9, 0]} rotation={[0, 0, 0.25]}>
          <cylinderGeometry args={[0.04, 0.04, 1.7, 12]} />
        </mesh>
        <mesh material={m.art[0]} position={[-0.35, 1.75, 0.1]} rotation={[0, 0, 1.0]}>
          <coneGeometry args={[0.35, 0.5, 32, 1, true]} />
        </mesh>
        <mesh material={m.lampGlow} position={[-0.47, 1.6, 0.1]}>
          <sphereGeometry args={[0.12, 16, 12]} />
        </mesh>
        <pointLight position={[-0.6, 1.4, 0.3]} intensity={5} distance={5} color="#ffd7a0" />
      </group>
      {/* big plant left */}
      <group position={[-3.4, deskY, -3.6]}>
        <mesh material={m.potMat} position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.35, 0.8, 32]} />
        </mesh>
        {Array.from({ length: 9 }).map((_, i) => {
          const a = i * 2.4;
          return (
            <mesh key={i} material={i % 2 ? m.leaf : m.leaf2} position={[Math.cos(a) * 0.35, 1.2 + (i % 4) * 0.35, Math.sin(a) * 0.3]} rotation={[0.3 * Math.sin(a), a, 0.6 * Math.cos(a)]} scale={[0.32, 0.6, 0.12]}>
              <sphereGeometry args={[1, 20, 14]} />
            </mesh>
          );
        })}
      </group>
      {/* chair back behind Byte */}
      <mesh material={m.bezel} position={[0, -0.6, -1.05]} castShadow>
        <boxGeometry args={[1.9, 2.1, 0.22]} />
      </mesh>
    </group>
  );
};
