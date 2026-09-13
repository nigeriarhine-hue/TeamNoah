import React from "react";
import { Sequence } from "remotion";
import { ACTION_PATCHES } from "../lib/macSubstitutions";
import { NoahScreen } from "./NoahScreen";
import { ScreenLabel } from "./ScreenLabel";

/** Beat 4 — approval granted, Noah executes. No invented actions. */
export const NoahAction: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const first = Math.round(durationInFrames * 0.42);
  return (
    <NoahScreen
      screen="04-action"
      from={{ x: 365, y: 440, w: 765, h: 530 }}
      to={{ x: 365, y: 455, w: 765, h: 530 }}
      durationInFrames={durationInFrames}
      patches={ACTION_PATCHES}
      cardHeight={700}
      cardTop={660}
    >
      <Sequence durationInFrames={first}>
        <ScreenLabel text="Approved." variant="kicker" top={406} durationInFrames={first} />
      </Sequence>
      <Sequence from={first} durationInFrames={durationInFrames - first}>
        <ScreenLabel
          text="Noah gets to work."
          top={400}
          durationInFrames={durationInFrames - first}
        />
      </Sequence>
    </NoahScreen>
  );
};
