import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp01, ease, easeOut } from "../anim";

// A genuine Noah screenshot shown in a "camera" viewport that pans/zooms onto regions.
// Coordinates are in screenshot pixels (all screenshots are 1170px wide).
export const SHOT_W = 1170;
export type Focus = { cx: number; cy: number; w: number };
export type Shot = { img: string; from: number; to: number; f0: Focus; f1: Focus; h: number };
export type Highlight = { img: string; from: number; to: number; x: number; y: number; w: number; h: number; color?: string; style?: "box" | "marker" };
export type CursorKey = { f: number; x: number; y: number; click?: boolean };

export const UIViewport: React.FC<{
  shots: Shot[];
  highlights?: Highlight[];
  cursor?: { img: string; keys: CursorKey[] };
  vw: number;
  vh: number;
  fade?: number;
}> = ({ shots, highlights = [], cursor, vw, vh, fade = 7 }) => {
  const frame = useCurrentFrame();
  const visible = shots.filter((s) => frame >= s.from - fade && frame < s.to + fade);
  return (
    <div style={{ position: "relative", width: vw, height: vh, overflow: "hidden", borderRadius: 34, background: "#16181f", boxShadow: "0 30px 80px rgba(30,20,80,0.35), 0 0 0 3px rgba(255,255,255,0.7)" }}>
      {visible.map((s) => {
        const t = clamp01((frame - s.from) / Math.max(1, s.to - s.from));
        const k = ease(t);
        const f = { cx: s.f0.cx + (s.f1.cx - s.f0.cx) * k, cy: s.f0.cy + (s.f1.cy - s.f0.cy) * k, w: s.f0.w + (s.f1.w - s.f0.w) * k };
        const scale = vw / f.w;
        const tx = vw / 2 - f.cx * scale;
        const ty = vh / 2 - f.cy * scale;
        const op = Math.min(
          interpolate(frame, [s.from - fade, s.from], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          interpolate(frame, [s.to, s.to + fade], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        );
        const hs = highlights.filter((h) => h.img === s.img && frame >= h.from && frame < h.to);
        const cur = cursor && cursor.img === s.img ? cursorPos(frame, cursor.keys) : null;
        return (
          <div key={s.img + s.from} style={{ position: "absolute", left: 0, top: 0, width: SHOT_W, height: s.h, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${scale})`, opacity: op }}>
            <Img src={staticFile(`ui/${s.img}`)} style={{ width: SHOT_W, height: s.h, display: "block" }} />
            {hs.map((h, i) => {
              const p = easeOut(clamp01((frame - h.from) / 10));
              const o = interpolate(frame, [h.to - 5, h.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const col = h.color ?? "#FFB547";
              if (h.style === "marker") {
                return <div key={i} style={{ position: "absolute", left: h.x, top: h.y, width: h.w * p, height: h.h, background: `${col}38`, borderBottom: `5px solid ${col}`, borderRadius: 6, opacity: o, mixBlendMode: "screen" }} />;
              }
              return <div key={i} style={{ position: "absolute", left: h.x - 8, top: h.y - 8, width: h.w + 16, height: h.h + 16, borderRadius: 16, border: `5px solid ${col}`, boxShadow: `0 0 ${24 * p}px ${col}, inset 0 0 ${18 * p}px ${col}55`, opacity: o * p, transform: `scale(${1.08 - 0.08 * p})` }} />;
            })}
            {cur && <Cursor x={cur.x} y={cur.y} click={cur.click} />}
          </div>
        );
      })}
    </div>
  );
};

const cursorPos = (f: number, keys: CursorKey[]) => {
  if (f < keys[0].f) return null;
  let x = keys[0].x, y = keys[0].y, click = 0;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f >= a.f && f <= b.f) {
      const t = ease(clamp01((f - a.f) / (b.f - a.f)));
      // slight arc like a real hand
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t - Math.sin(t * Math.PI) * 30;
    } else if (f > b.f) {
      x = b.x;
      y = b.y;
    }
  }
  for (const k of keys) if (k.click && f >= k.f && f < k.f + 10) click = 1 - (f - k.f) / 10;
  return { x, y, click };
};

const Cursor: React.FC<{ x: number; y: number; click?: number }> = ({ x, y, click = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    {click > 0 && <div style={{ position: "absolute", left: -40, top: -40, width: 80, height: 80, borderRadius: 80, border: "4px solid #ffffff", opacity: click, transform: `scale(${1.6 - click})` }} />}
    <svg width="38" height="50" viewBox="0 0 19 25" style={{ position: "absolute", left: -3, top: -2, transform: `scale(${1 - click * 0.15})`, transformOrigin: "0 0", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.5))" }}>
      <path d="M1 1 L1 19 L5.5 14.8 L8.6 22 L11.6 20.7 L8.6 13.8 L14.8 13.8 Z" fill="#fff" stroke="#111" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  </div>
);
