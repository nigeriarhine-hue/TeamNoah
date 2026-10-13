import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { Cursor } from "../components/Cursor";
import { AuroraCard, EnhancedLightNoahScreen, Eyebrow, UserBubble } from "../components/EnhancedLightNoahScreen";
import { ArchiveIcon, BroomIcon, CheckIcon, DriveIcon, LayersIcon, PackageIcon, StartupIcon } from "../components/Icons";
import { NoahApprovalModal, SpotlightDim } from "../components/NoahApprovalFocus";
import { NoahDiagnosticCard } from "../components/NoahDiagnosticCard";
import { NoahPlanCard } from "../components/NoahPlanCard";
import { NoahProgressCard } from "../components/NoahProgressCard";
import { NoahResultState } from "../components/NoahResultState";
import { NoahWorkflowStep } from "../components/NoahWorkflowStep";
import { lerp, prog } from "../components/motion";

/*
 * Steps 1–6 in one continuous app window. All copy below is taken from the genuine Noah
 * screens (IMG_0583–IMG_0595): prompt, progress steps, Situation, What Noah checked,
 * What Noah would do, approval modal, approved progress, and the Done result.
 * Local frame 0 == global frame 150.
 */

// ---- local timing ----
const T = {
  typeStart: 22,
  send: 75,
  looking: 85,
  checksStart: 120,
  collapse: 190,
  explains: 300,
  plan: 450,
  approval: 600,
  click: 766,
  result: 780,
  end: 950,
};

const PROMPT = "My PC feels slow";
const SITUATION_HL = "Your PC is loading seven programs at every startup plus a busy background load";
const SITUATION_REST = " — that's what's making it feel slow. I also found ~12 GB of old FL Studio installers you can reclaim.";

const WIN_W = 960;
const WIN_H = 1040;
const WIN_TOP = 384;

export const ProductFlow: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- composer ----------
  const typed = Math.max(0, Math.min(PROMPT.length, Math.floor((f - T.typeStart) / 3) + 1));
  const sent = f >= T.send;
  const composerText = f < T.typeStart ? "" : sent ? "" : PROMPT.slice(0, typed);
  const working = sent && f < T.collapse + 4;

  // ---------- document scroll (S3–S5) ----------
  const situationOpen = prog(f, T.explains + 10, 18);
  const planOpen = f >= T.plan;
  const scroll1 = interpolate(f, [T.explains + 10, T.explains + 34, T.plan, T.plan + 22], [0, 120, 120, 1120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });

  // ---------- camera (focus zooms on the whole window) ----------
  const zoomIn = (a: number, b: number) => prog(f, a, b - a);
  let scale = 1;
  let ty = 0;
  // S2: gentle push toward the composer while typing, release on send
  scale += 0.05 * zoomIn(10, 40) * (1 - zoomIn(T.send, T.send + 16));
  ty += -60 * zoomIn(10, 40) * (1 - zoomIn(T.send, T.send + 16));
  // S3: focus on the checked grid
  scale += 0.06 * zoomIn(T.collapse + 10, T.collapse + 40) * (1 - zoomIn(T.explains, T.explains + 16));
  // S4: focus on the situation sentence
  scale += 0.08 * zoomIn(T.explains + 24, T.explains + 50) * (1 - zoomIn(T.plan - 6, T.plan + 12));
  ty += 110 * zoomIn(T.explains + 24, T.explains + 50) * (1 - zoomIn(T.plan - 6, T.plan + 12));
  // S7: focus on the result metrics
  scale += 0.05 * zoomIn(T.result + 118, T.result + 145);
  ty += -40 * zoomIn(T.result + 118, T.result + 145);

  // ---------- approval ----------
  const dim = prog(f, T.approval, 14) * (1 - prog(f, T.click + 6, 12));
  const modalIn = prog(f, T.approval + 4, 14) * (1 - prog(f, T.click + 4, 10));
  const pulse = f > T.approval + 90 && f < T.click ? 0.5 + 0.5 * Math.sin((f - T.approval) / 5) : 0;
  const pressed = f >= T.click && f < T.click + 8 ? Math.sin(((f - T.click) / 8) * Math.PI) : 0;
  const showResultDoc = f >= T.click + 10;

  // cursor (screen coords): enters bottom-right, glides to "Go ahead"
  const goAhead = { x: 556, y: 1115 };
  const curP = prog(f, T.approval + 40, 70);
  const curX = lerp(900, goAhead.x, curP) + Math.sin(f / 9) * 3 * (1 - curP);
  const curY = lerp(1480, goAhead.y, curP);
  const curO = prog(f, T.approval + 36, 8) * (1 - prog(f, T.click + 14, 8));
  const click = f >= T.click ? prog(f, T.click, 14) : 0;

  // ---------- step labels ----------
  const steps: Array<{ n: number; label: string; from: number; to: number }> = [
    { n: 1, label: "DESCRIBE THE PROBLEM", from: 0, to: T.checksStart },
    { n: 2, label: "NOAH CHECKS", from: T.checksStart, to: T.explains },
    { n: 3, label: "EXPLAINS WHAT IT FOUND", from: T.explains, to: T.plan },
    { n: 4, label: "SHOWS THE PLAN", from: T.plan, to: T.approval },
    { n: 5, label: "YOU APPROVE", from: T.approval, to: T.result },
    { n: 6, label: "NOAH REPORTS THE RESULT", from: T.result, to: T.end + 20 },
  ];

  // ---------- result doc scroll (S7) ----------
  const scroll2 = interpolate(f, [T.result + 76, T.result + 100], [0, 470], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  const makingP = prog(f, T.result + 4, 8) * (1 - prog(f, T.result + 84, 8));
  const doneP = prog(f, T.result + 90, 10) * (1 - prog(f, T.result + 112, 8));

  const doc = showResultDoc ? (
    <ResultDoc />
  ) : (
    <div>
      {sent ? <UserBubble text={PROMPT} style={{ opacity: prog(f, T.send, 8), transform: `translateY(${(1 - prog(f, T.send, 10)) * 20}px)` }} /> : null}
      <div style={{ height: 26 }} />
      {f >= T.checksStart && f < T.collapse ? (
          <NoahProgressCard
            thinkingAt={T.checksStart + 54}
            steps={[
              { label: "Searching knowledge", at: T.checksStart, doneAt: T.checksStart + 6 },
              { label: "Running diagnostics", at: T.checksStart + 6, doneAt: T.checksStart + 18 },
              { label: "Listing processes", at: T.checksStart + 18, doneAt: T.checksStart + 30 },
              { label: "Checking disk space", at: T.checksStart + 30, doneAt: T.checksStart + 42 },
              { label: "Checking startup programs", at: T.checksStart + 42, doneAt: T.checksStart + 54 },
            ]}
          />
      ) : null}
      {sent && f >= T.looking && f < T.checksStart ? <LookingIntoIt f={f} /> : null}
      {f >= T.collapse ? (
        <div style={{ opacity: prog(f, T.collapse, 10) }}>
          <WhatNoahDidHeader duration="1m 47s" />
          <AuroraCard style={{ padding: "30px 30px 34px" }}>
            {/* SITUATION */}
            <div style={{ maxHeight: 330 * situationOpen, overflow: "hidden", opacity: situationOpen }}>
              <Eyebrow>Situation</Eyebrow>
              <div style={{ fontSize: 35, lineHeight: 1.45, marginTop: 14, marginBottom: 30, color: C.ink }}>
                <Highlight text={SITUATION_HL} p={prog(f, T.explains + 30, 26)} dimOthers={prog(f, T.explains + 40, 14) * (1 - prog(f, T.plan - 6, 12))} />
                <span style={{ color: C.ink2, opacity: 1 - 0.55 * prog(f, T.explains + 40, 14) * (1 - prog(f, T.plan - 6, 12)) }}>{SITUATION_REST}</span>
              </div>
            </div>
            {/* WHAT NOAH CHECKED */}
            <Eyebrow>What Noah checked</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 18 }}>
              <NoahDiagnosticCard label="Startup items" value="7 launch" sub="Battle.net, Teams, Avid…" icon={<StartupIcon size={30} />} appearAt={T.collapse + 6} revealAt={T.collapse + 32} width={405} />
              <NoahDiagnosticCard label="C: drive free" value="58 GB / 476 GB" sub="87% full — tight but…" icon={<DriveIcon size={30} />} appearAt={T.collapse + 12} revealAt={T.collapse + 44} width={405} />
              <NoahDiagnosticCard label="Old FL Studio installers" value="~12 GB" sub="in Downloads, old versions" icon={<PackageIcon size={30} />} appearAt={T.collapse + 18} revealAt={T.collapse + 56} width={405} />
              <NoahDiagnosticCard label="Background apps" value="~30 apps" sub="Xbox, Avid, Teams, E…" icon={<LayersIcon size={30} />} appearAt={T.collapse + 24} revealAt={T.collapse + 68} width={405} />
            </div>
            {/* WHAT NOAH WOULD DO */}
            {planOpen ? (
              <div style={{ marginTop: 34 }}>
                <Eyebrow style={{ opacity: prog(f, T.plan + 6, 10) }}>What Noah would do</Eyebrow>
                <div style={{ marginTop: 10 }}>
                  <NoahPlanCard n={1} title="Stop 3 heavy apps from auto-launching at boot" sub="Battle.net, Avid Link, Edge autolaunch — reversible anytime" icon={<StartupIcon size={28} />} at={T.plan + 18} />
                  <NoahPlanCard n={2} title="Stop Teams from auto-starting at boot" sub="Reversible; Teams still opens on demand" icon={<StartupIcon size={28} />} at={T.plan + 36} />
                  <NoahPlanCard n={3} title="Clear temp files to free space" sub="Safe, ~0.5 GB temp cache" icon={<BroomIcon size={28} />} at={T.plan + 54} />
                  <NoahPlanCard n={4} title="Reclaim old FL Studio installers" sub="Move ~14 old installers to Trash — keep the newest one" icon={<ArchiveIcon size={28} />} at={T.plan + 72} />
                </div>
                <PrimaryAction f={f} at={T.plan + 100} />
              </div>
            ) : null}
          </AuroraCard>
        </div>
      ) : null}
    </div>
  );

  const windowEl = (
    <EnhancedLightNoahScreen
      width={WIN_W}
      height={WIN_H}
      scrollY={showResultDoc ? scroll2 : scroll1}
      composerText={composerText}
      composerFocused={f >= T.typeStart - 6 && !sent}
      showCaret={f >= T.typeStart - 6 && !sent && Math.floor(f / 8) % 2 === 0}
      working={working || (showResultDoc && f < T.result + 92)}
      composerPlaceholder={planOpen && !showResultDoc ? "…or tell Noah to do it differently" : "What's broken? Tell Noah and hit go."}
      footerHint={planOpen && !showResultDoc}
    >
      {doc}
    </EnhancedLightNoahScreen>
  );

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* window + approval spotlight */}
      <AbsoluteFill>
        <SpotlightDim amount={dim}>
          <AbsoluteFill style={{ alignItems: "center" }}>
            <div style={{ position: "absolute", top: WIN_TOP, transform: `translateY(${ty}px) scale(${scale})`, transformOrigin: "50% 50%" }}>{windowEl}</div>
          </AbsoluteFill>
        </SpotlightDim>
      </AbsoluteFill>

      {/* modal */}
      {modalIn > 0.001 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ marginTop: 80 }}>
            <NoahApprovalModal appear={modalIn} pulse={pulse} pressed={pressed} scale={1.12} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* YOU DECIDE. */}
      {f >= T.approval + 120 && f < T.result + 6 ? (
        <AbsoluteFill style={{ alignItems: "center" }}>
          <div
            style={{
              position: "absolute",
              top: 1296,
              textAlign: "center",
              opacity: prog(f, T.approval + 126, 10) * (1 - prog(f, T.result - 4, 8)),
              transform: `translateY(${(1 - prog(f, T.approval + 126, 12)) * 24}px)`,
            }}
          >
            <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1, background: "linear-gradient(135deg,#8FB8FF,#B9A4FF)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              YOU DECIDE.
            </div>
            <div style={{ marginTop: 16, fontSize: 40, fontWeight: 600, color: "rgba(255,255,255,.88)" }}>what happens next</div>
          </div>
        </AbsoluteFill>
      ) : null}

      <Cursor x={curX} y={curY} click={click} opacity={curO} />

      {/* status pill for the action phase */}
      {makingP > 0.01 || doneP > 0.01 ? (
        <AbsoluteFill style={{ alignItems: "center" }}>
          <div
            style={{
              position: "absolute",
              top: WIN_TOP - 84,
              padding: "12px 28px",
              borderRadius: 40,
              background: doneP > 0.5 ? C.commit : "#fff",
              color: doneP > 0.5 ? "#fff" : C.ink,
              border: `1px solid ${C.line2}`,
              boxShadow: C.cardShadow,
              fontSize: 30,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: Math.max(makingP, doneP),
            }}
          >
            {doneP > 0.5 ? <CheckIcon size={30} stroke={3} /> : <Dots f={f} />}
            {doneP > 0.5 ? "Done." : "Making changes…"}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* step label */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 150 }}>
          {steps.map((s) =>
            f >= s.from && f < s.to ? (
              <div key={s.n} style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
                <StepAt from={s.from} to={s.to} n={s.n} label={s.label} />
              </div>
            ) : null,
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Step label rendered with frames relative to its own start.
const StepAt: React.FC<{ from: number; to: number; n: number; label: string }> = ({ from, to, n, label }) => {
  return (
    <ShiftFrame by={from}>
      <NoahWorkflowStep n={n} label={label} start={0} end={to - from} />
    </ShiftFrame>
  );
};

// Local-time shift for each step label.
const ShiftFrame: React.FC<{ by: number; children: React.ReactNode }> = ({ by, children }) => (
  <Sequence from={by} layout="none">
    {children}
  </Sequence>
);

const Dots: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ display: "flex", gap: 5 }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: C.indigo, opacity: 0.3 + 0.7 * Math.abs(Math.sin((f - i * 4) / 6)) }} />
    ))}
  </div>
);

const LookingIntoIt: React.FC<{ f: number }> = ({ f }) => (
  <div>
    <AuroraCard line={0.25 + 0.5 * prog(f, T.looking, 30)} style={{ padding: "28px 32px", opacity: prog(f, T.looking, 8) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 34 }}>
          <Dots f={f} />
        </div>
        <div style={{ fontSize: 32, fontWeight: 700 }}>Looking into it…</div>
      </div>
    </AuroraCard>
  </div>
);

const WhatNoahDidHeader: React.FC<{ duration: string }> = ({ duration }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 26px", borderRadius: 20, background: "#fff", border: `1px solid ${C.line}`, fontSize: 27, fontWeight: 700, marginBottom: 16 }}>
    <span style={{ color: C.commit, display: "flex" }}>
      <CheckIcon size={28} stroke={3} />
    </span>
    What Noah did
    <span style={{ color: C.mute, fontWeight: 500 }}>· {duration}</span>
    <span style={{ marginLeft: "auto", color: C.mute, fontWeight: 500, fontSize: 24 }}>Show work ⌄</span>
  </div>
);

const Highlight: React.FC<{ text: string; p: number; dimOthers: number }> = ({ text, p }) => (
  <span
    style={{
      fontWeight: 700,
      color: C.ink,
      backgroundImage: "linear-gradient(120deg, rgba(37,99,235,.18), rgba(124,58,237,.22))",
      backgroundRepeat: "no-repeat",
      backgroundSize: `${p * 100}% 100%`,
      backgroundPosition: "0 0",
      borderRadius: 6,
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
      padding: "0 4px",
    }}
  >
    {text}
  </span>
);

const PrimaryAction: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const a = prog(f, at, 12);
  return (
    <div
      style={{
        marginTop: 22,
        height: 96,
        borderRadius: 24,
        background: C.aurora,
        color: "#fff",
        fontSize: 34,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: a,
        transform: `translateY(${(1 - a) * 20}px)`,
        boxShadow: "0 18px 36px -18px rgba(79,70,229,.8)",
      }}
    >
      Trim startup &amp; clear space →
    </div>
  );
};

/** S7 document: what the real chat shows after approval. */
const ResultDoc: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div>
      <div style={{ height: 84, borderRadius: 22, background: C.commitSoft, border: `1px solid rgba(13,148,136,.25)`, color: C.commit, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 32, fontWeight: 700 }}>
        <CheckIcon size={30} stroke={3} /> Sent
      </div>
      <UserBubble text="stop teams from auto starting and clear temp files" style={{ marginTop: 26 }} />
      <div style={{ marginTop: 30, borderLeft: `3px solid ${C.line2}`, paddingLeft: 24, fontSize: 32, color: C.ink, opacity: prog(f, T.result + 2, 10) }}>
        Approved: Action approved
      </div>
      <div style={{ height: 26 }} />
      <NoahProgressCard
        steps={[
          { label: "Turning off a startup program — Teams", at: T.result + 8, doneAt: T.result + 38 },
          { label: "Clearing caches", at: T.result + 38, doneAt: T.result + 74 },
        ]}
      />
      <div style={{ height: 30 }} />
      <NoahResultState
        at={T.result + 84}
        durationLabel="36s"
        summary="Teams no longer launches at startup (it still opens fine on demand), and I cleared ~450 MB of temp files. Next boot should feel a bit lighter."
        focus={prog(f, T.result + 125, 14)}
        metrics={[
          { label: "Teams at startup", value: "Now off", sub: "Disabled, reversible anytime", icon: <StartupIcon size={28} />, tone: "commit" },
          { label: "Temp files cleared", value: "~450 MB", sub: "MB freed", icon: <BroomIcon size={28} />, tone: "commit" },
          { label: "Still on at boot", value: "3 items", sub: "Battle.net, Avid Link, Edge", icon: <LayersIcon size={28} />, tone: "ink" },
        ]}
      />
    </div>
  );
};
