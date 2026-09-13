import React from "react";
import { RESULT_PATCHES } from "../lib/macSubstitutions";
import { NoahScreen } from "./NoahScreen";
import { ScreenLabel } from "./ScreenLabel";

/** Beat 5 — what actually changed, straight from the genuine result screen. */
export const NoahResult: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => (
  <NoahScreen
    screen="05-result"
    from={{ x: 360, y: 290, w: 770, h: 610 }}
    to={{ x: 360, y: 305, w: 770, h: 610 }}
    durationInFrames={durationInFrames}
    patches={RESULT_PATCHES}
    cardHeight={800}
    cardTop={600}
  >
    <ScreenLabel
      text="And shows exactly"
      top={360}
      fontSize={56}
      durationInFrames={durationInFrames}
    />
    <ScreenLabel
      text="what changed."
      top={430}
      fontSize={56}
      durationInFrames={durationInFrames}
    />
  </NoahScreen>
);
