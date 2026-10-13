import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, ensureFonts } from "./theme";
import { CAPTIONS, SCENES, SFX, SPEECH, TOTAL, UI_FROM, UI_TO, VO } from "./timeline";
import { CaptionTrack } from "./components/CaptionTrack";
import { prog } from "./components/motion";
import { Hook } from "./scenes/Hook";
import { ProductFlow } from "./scenes/ProductFlow";
import { Recap } from "./scenes/Recap";
import { Cta } from "./scenes/Cta";

ensureFonts();

const LightStage: React.FC = () => (
  <AbsoluteFill
    style={{
      background: C.page,
      backgroundImage:
        "radial-gradient(circle at 15% 10%, rgba(99,102,241,.13), transparent 45%), radial-gradient(circle at 88% 92%, rgba(139,92,246,.12), transparent 45%)",
    }}
  />
);

/** Crossfade wrapper: fades a scene in over `fade` frames at its start. */
const FadeIn: React.FC<{ children: React.ReactNode; fade?: number }> = ({ children, fade = 8 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: prog(f, 0, fade) }}>{children}</AbsoluteFill>;
};

const musicVolume = (f: number) => {
  const speaking = SPEECH.some(([a, b]) => f >= a - 4 && f <= b + 4);
  const base = speaking ? 0.075 : 0.15;
  const fadeOut = interpolate(f, [TOTAL - 40, TOTAL], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return base * fadeOut;
};

export const WhatHappens: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.page }}>
      {/* product-scene backdrop */}
      <Sequence from={UI_FROM - 8} durationInFrames={SCENES.cta.from - UI_FROM + 16}>
        <LightStage />
      </Sequence>

      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.dur + 8}>
        <Hook />
      </Sequence>

      <Sequence from={UI_FROM} durationInFrames={UI_TO - UI_FROM + 8}>
        <FadeIn>
          <ProductFlow />
        </FadeIn>
      </Sequence>

      <Sequence from={SCENES.recap.from} durationInFrames={SCENES.recap.dur + 8}>
        <FadeIn>
          <LightStage />
          <Recap />
        </FadeIn>
      </Sequence>

      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.dur}>
        <FadeIn fade={10}>
          <Cta />
        </FadeIn>
      </Sequence>

      <CaptionTrack cues={CAPTIONS} />

      {/* ---- audio ---- */}
      <Audio src={staticFile("audio/music-bed.wav")} volume={(f) => musicVolume(f)} />
      {VO.map((v) => (
        <Sequence key={v.file + v.from} from={v.from} durationInFrames={v.dur + 6}>
          <Audio src={staticFile(v.file)} volume={1} />
        </Sequence>
      ))}
      {SFX.map(([from, name, vol], i) => (
        <Sequence key={i} from={from} durationInFrames={60}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
