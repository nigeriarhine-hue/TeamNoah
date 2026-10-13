import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../theme";
import { AuroraCard, Eyebrow } from "./EnhancedLightNoahScreen";
import { CheckIcon } from "./Icons";
import { NoahDiagnosticCard } from "./NoahDiagnosticCard";
import { prog } from "./motion";

export type ResultMetric = { label: string; value: string; sub: string; icon: React.ReactNode; tone: "commit" | "ink" };

/** The real "What Noah did → RESULT: Done." card with its after-state metrics. */
export const NoahResultState: React.FC<{
  at: number;
  summary: string;
  durationLabel: string;
  metrics: ResultMetric[];
  focus?: number;
}> = ({ at, summary, durationLabel, metrics, focus = 0 }) => {
  const frame = useCurrentFrame();
  const a = prog(frame, at, 12);
  const doneP = prog(frame, at + 6, 10);
  return (
    <div style={{ opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "18px 26px",
          borderRadius: 20,
          background: "#fff",
          border: `1px solid ${C.line}`,
          fontSize: 27,
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        <span style={{ color: C.commit, display: "flex" }}>
          <CheckIcon size={28} stroke={3} />
        </span>
        What Noah did
        <span style={{ color: C.mute, fontWeight: 500 }}>· {durationLabel}</span>
      </div>
      <AuroraCard tone="commit" line={doneP} style={{ padding: "32px 34px 34px" }}>
        <Eyebrow>Result</Eyebrow>
        <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 16, opacity: doneP, transform: `scale(${0.9 + 0.1 * doneP})`, transformOrigin: "left center" }}>
          Done.
        </div>
        <div style={{ fontSize: 31, lineHeight: 1.45, color: C.ink2, marginTop: 12, opacity: prog(frame, at + 12, 12) }}>{summary}</div>
        <Eyebrow style={{ marginTop: 28, opacity: prog(frame, at + 16, 10) }}>What Noah checked</Eyebrow>
        <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
          {metrics.map((m, i) => (
            <NoahDiagnosticCard
              key={m.label}
              label={m.label}
              value={m.value}
              sub={m.sub}
              icon={m.icon}
              tone={m.tone}
              appearAt={at + 18 + i * 5}
              revealAt={at + 26 + i * 6}
              width={264}
              highlight={focus * (i < 2 ? 1 : 0)}
            />
          ))}
        </div>
      </AuroraCard>
    </div>
  );
};
