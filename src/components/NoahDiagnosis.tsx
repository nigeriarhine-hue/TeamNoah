import React from "react";
import { Sequence } from "remotion";
import { DIAGNOSIS_PATCHES } from "../lib/macSubstitutions";
import { NoahScreen } from "./NoahScreen";
import { ScreenLabel } from "./ScreenLabel";

/** Beat 2 — Noah is introduced and shown checking the machine. */
export const NoahDiagnosis: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const kicker = Math.round(durationInFrames * 0.4);
  return (
    <NoahScreen
      screen="02-diagnosis"
      from={{ x: 365, y: 250, w: 765, h: 682 }}
      to={{ x: 365, y: 262, w: 765, h: 682 }}
      durationInFrames={durationInFrames}
      patches={DIAGNOSIS_PATCHES}
      cardHeight={900}
      cardTop={540}
    >
      <Sequence durationInFrames={kicker}>
        <ScreenLabel text="This is Noah." variant="kicker" top={350} durationInFrames={kicker} />
      </Sequence>
      <Sequence from={kicker} durationInFrames={durationInFrames - kicker}>
        <ScreenLabel
          text="It checks what's happening."
          top={342}
          durationInFrames={durationInFrames - kicker}
        />
      </Sequence>
    </NoahScreen>
  );
};
