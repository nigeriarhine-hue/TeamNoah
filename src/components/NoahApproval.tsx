import React from "react";
import { Sequence } from "remotion";
import { APPROVAL_PATCHES } from "../lib/macSubstitutions";
import { CursorClick } from "./CursorClick";
import { NoahScreen } from "./NoahScreen";
import { ScreenLabel } from "./ScreenLabel";

/**
 * Beat 3 — the product moment. Noah has stopped and is waiting. Nothing in
 * this screenshot is altered; the modal is entirely genuine.
 */
export const NoahApproval: React.FC<{
  durationInFrames: number;
  /** Frame the second label takes over. Defaults to a proportional split;
   *  pass the measured value when a voiceover drives the beat. */
  labelSwitch?: number;
}> = ({ durationInFrames, labelSwitch }) => {
  const half = labelSwitch ?? Math.round(durationInFrames * 0.47);
  return (
    <NoahScreen
      screen="03-approval"
      from={{ x: 204, y: 245, w: 765, h: 530 }}
      to={{ x: 291, y: 306, w: 590, h: 409 }}
      durationInFrames={durationInFrames}
      patches={APPROVAL_PATCHES}
      cardHeight={700}
      cardTop={660}
      cardScaleTo={1.02}
      inScreen={
        // Pointer arrives on "Go ahead" late, handing off to the action beat.
        <CursorClick x={598} y={589} startFrame={Math.round(durationInFrames * 0.34)} travelFrames={20} size={22} />
      }
    >
      <Sequence durationInFrames={half}>
        <ScreenLabel text="Then Noah stops." top={400} durationInFrames={half} />
      </Sequence>
      <Sequence from={half} durationInFrames={durationInFrames - half}>
        <ScreenLabel
          text="You decide."
          variant="kicker"
          fontSize={52}
          top={406}
          durationInFrames={durationInFrames - half}
        />
      </Sequence>
    </NoahScreen>
  );
};
