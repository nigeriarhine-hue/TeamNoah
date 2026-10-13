import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import type { Cue } from "../timeline";
import { prog } from "./motion";

/** Phrase-based captions. Light pill on product scenes, dark pill over host footage. */
export const CaptionTrack: React.FC<{ cues: Cue[]; bottom?: number }> = ({ cues, bottom = 336 }) => {
  const frame = useCurrentFrame();
  const cue = cues.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;
  const inP = prog(frame, cue.from, 6);
  const outP = prog(frame, cue.to - 5, 5);
  const o = inP * (1 - outP);
  const dark = !!cue.dark;

  const parts: Array<{ t: string; em: boolean }> = [];
  if (cue.em && cue.text.includes(cue.em)) {
    const i = cue.text.indexOf(cue.em);
    parts.push({ t: cue.text.slice(0, i), em: false }, { t: cue.em, em: true }, { t: cue.text.slice(i + cue.em.length), em: false });
  } else parts.push({ t: cue.text, em: false });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: bottom, pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: 900,
          padding: "20px 34px",
          borderRadius: 26,
          background: dark ? "rgba(14,16,30,.72)" : "rgba(255,255,255,.94)",
          border: dark ? "1px solid rgba(255,255,255,.12)" : `1px solid ${C.line}`,
          boxShadow: dark ? "0 12px 40px rgba(0,0,0,.35)" : C.cardShadow,
          color: dark ? "#fff" : C.ink,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.22,
          letterSpacing: "-0.015em",
          textAlign: "center",
          opacity: o,
          transform: `translateY(${(1 - inP) * 18}px)`,
        }}
      >
        {parts.map((p, i) =>
          p.em ? (
            <span
              key={i}
              style={{
                background: dark ? "linear-gradient(135deg,#8FB8FF,#B9A4FF)" : C.aurora,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: C.indigo,
              }}
            >
              {p.t}
            </span>
          ) : (
            <span key={i}>{p.t}</span>
          ),
        )}
      </div>
    </AbsoluteFill>
  );
};
