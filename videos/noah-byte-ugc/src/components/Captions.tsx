import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TL } from "../anim";
import { SANS } from "./Fonts";

const VIOLET = "#8B5CF6";
const AMBER = "#FFB547";

// ---------------------------------------------------------------- headline "sticker" captions
export type Headline = { from: number; to: number; text: string; hi?: string[]; y: number; rot?: number; size?: number };

const renderHi = (text: string, hi: string[] = [], color = VIOLET) =>
  text.split(" ").map((w, i) => {
    const on = hi.some((h) => w.replace(/[^A-Z0-9']/gi, "").toUpperCase() === h.toUpperCase());
    return (
      <span key={i} style={{ color: on ? color : undefined }}>
        {w}
        {" "}
      </span>
    );
  });

export const Headlines: React.FC<{ items: Headline[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {items.map((h, i) => {
        if (frame < h.from || frame >= h.to) return null;
        const s = spring({ frame: frame - h.from, fps, config: { damping: 11, stiffness: 190, mass: 0.6 } });
        const out = interpolate(frame, [h.to - 5, h.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: 70, right: 70, top: h.y, display: "flex", justifyContent: "center", opacity: out }}>
            <div style={{
              transform: `scale(${0.4 + 0.6 * s}) rotate(${(h.rot ?? -2) * s}deg)`,
              background: "#ffffff", color: "#14163d", fontFamily: SANS, fontWeight: 850, fontSize: h.size ?? 66, lineHeight: 1.08,
              padding: "20px 34px 22px", borderRadius: 28, textAlign: "center", letterSpacing: -1,
              boxShadow: "0 14px 0 rgba(20,22,61,0.92), 0 26px 60px rgba(0,0,0,0.35)", maxWidth: 900,
            }}>
              {renderHi(h.text, h.hi)}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- dialogue captions (word-synced)
type W = { w: string; s: number; e: number; line: number };

const KEYWORDS = ["mind", "slow", "startup", "background", "apps", "noah", "explains", "changes", "recommends", "approval", "wrong", "guess", "onnoah.app"];

const allWords = (): W[] => {
  const out: W[] = [];
  for (const L of TL.lines) {
    const ws = L.words.map((w) => ({ ...w, line: L.line }));
    // spoken "on Noah dot app" is displayed as the real URL
    const i = ws.findIndex((w, k) => w.w.toLowerCase() === "on" && ws[k + 1]?.w.toLowerCase().startsWith("noah") && k > ws.length - 5);
    if (i >= 0) {
      const merged = { w: "onnoah.app", s: ws[i].s, e: ws[ws.length - 1].e, line: L.line };
      ws.splice(i, ws.length - i, merged);
    }
    out.push(...ws);
  }
  return out;
};

const chunks = (() => {
  const ws = allWords();
  const res: W[][] = [];
  let cur: W[] = [];
  ws.forEach((w, i) => {
    if (cur.length && ["and", "so"].includes(w.w.toLowerCase())) {
      res.push(cur);
      cur = [];
    }
    cur.push(w);
    const next = ws[i + 1];
    const punct = (/[.,?!]$/.test(w.w) && w.w !== "onnoah.app") || w.w.toLowerCase() === "startup";
    const len = cur.reduce((a, x) => a + x.w.length, 0);
    if (!next || next.line !== w.line || punct || cur.length >= 3 || len > 15) {
      res.push(cur);
      cur = [];
    }
  });
  return res;
})();

export const DialogueCaptions: React.FC<{ y: number; hidden?: (f: number) => boolean; size?: number }> = ({ y, hidden, size = 74 }) => {
  const frame = useCurrentFrame();
  const t = frame / TL.fps;
  if (hidden?.(frame)) return null;
  const idx = chunks.findIndex((c, i) => {
    const start = c[0].s - 0.05;
    const nextStart = chunks[i + 1] ? chunks[i + 1][0].s - 0.05 : Infinity;
    const end = Math.min(nextStart, c[c.length - 1].e + 0.45);
    return t >= start && t < end;
  });
  if (idx < 0) return null;
  const c = chunks[idx];
  const age = t - (c[0].s - 0.05);
  const pop = Math.min(1, age / 0.09);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 850, fontSize: size, lineHeight: 1.1, textAlign: "center", letterSpacing: -0.5, transform: `scale(${0.88 + 0.12 * pop})`, maxWidth: 940 }}>
        {c.map((w, i) => {
          const active = t >= w.s - 0.03;
          const clean = w.w.replace(/[^a-z0-9.']/gi, "").toLowerCase().replace(/\.$/, "");
          const key = KEYWORDS.includes(clean);
          const display = w.w === "onnoah.app" ? "onnoah.app" : w.w.replace(/[,]$/, "").toUpperCase();
          return (
            <span key={i} style={{
              color: active ? (key ? AMBER : "#ffffff") : "rgba(255,255,255,0.55)",
              WebkitTextStroke: "3px rgba(10,12,40,0.9)", paintOrder: "stroke fill",
              textShadow: "0 6px 0 rgba(10,12,40,0.85), 0 10px 30px rgba(0,0,0,0.45)",
              marginRight: 18, display: "inline-block",
              transform: active && t < w.e ? "translateY(-4px) scale(1.06)" : "none",
            }}>
              {display}
            </span>
          );
        })}
      </div>
    </div>
  );
};
