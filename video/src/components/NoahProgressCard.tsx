import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../theme";
import { AuroraCard } from "./EnhancedLightNoahScreen";
import { CheckIcon } from "./Icons";
import { prog } from "./motion";

export type ProgressStep = { label: string; at: number; doneAt?: number };

const Spinner: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={30} height={30} viewBox="0 0 30 30" style={{ transform: `rotate(${frame * 14}deg)` }}>
    <circle cx="15" cy="15" r="11" stroke={C.line2} strokeWidth="3.5" fill="none" />
    <path d="M15 4a11 11 0 0 1 11 11" stroke={C.indigo} strokeWidth="3.5" fill="none" strokeLinecap="round" />
  </svg>
);

/** The live "Looking into it… / Running diagnostics …" step list from the real Noah UI. */
export const NoahProgressCard: React.FC<{ steps: ProgressStep[]; thinkingAt?: number; style?: React.CSSProperties }> = ({
  steps,
  thinkingAt,
  style,
}) => {
  const frame = useCurrentFrame();
  const visible = steps.filter((s) => frame >= s.at);
  const allDone = steps.length > 0 ? steps[steps.length - 1].doneAt ?? Infinity : 0;
  const line = 0.35 + 0.65 * prog(frame, steps[0]?.at ?? 0, Math.max(10, (allDone === Infinity ? 90 : allDone - (steps[0]?.at ?? 0))));
  return (
    <AuroraCard line={line} style={{ padding: "26px 32px", ...style }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {visible.map((s) => {
          const done = s.doneAt !== undefined && frame >= s.doneAt;
          const a = prog(frame, s.at, 8);
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 20, opacity: a, transform: `translateY(${(1 - a) * 10}px)` }}>
              <div style={{ width: 34, display: "flex", justifyContent: "center", color: C.commit }}>
                {done ? <CheckIcon size={30} stroke={3} /> : <Spinner frame={frame} />}
              </div>
              <div style={{ fontSize: 32, fontWeight: done ? 600 : 700, color: done ? C.ink2 : C.ink }}>{s.label}</div>
            </div>
          );
        })}
        {thinkingAt !== undefined && frame >= thinkingAt ? (
          <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: prog(frame, thinkingAt, 8) }}>
            <div style={{ width: 34, display: "flex", gap: 4, justifyContent: "center" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: 4, background: C.indigo, opacity: 0.3 + 0.7 * Math.abs(Math.sin((frame - i * 4) / 6)) }} />
              ))}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>Thinking…</div>
          </div>
        ) : null}
      </div>
    </AuroraCard>
  );
};
