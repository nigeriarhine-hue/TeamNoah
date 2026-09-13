import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLORS } from "../config";

/**
 * The creator footage, framed to 9:16.
 *
 * Captions and the hook plate are deliberately NOT part of this component —
 * the Higgsfield clip is generated clean and every word on screen is drawn by
 * Remotion, so this stays reusable for any future creator shot.
 */
export const UGCClip: React.FC<{
  /** Path under public/ to the generated clip, or null to use the still. */
  videoSrc: string | null;
  /** Shown when the clip is not yet in place. */
  fallbackImage: string;
  durationInFrames: number;
  /** Gentle scrim at the base so captions always hold contrast. */
  scrim?: boolean;
}> = ({ videoSrc, fallbackImage, durationInFrames, scrim = true }) => {
  const frame = useCurrentFrame();

  // Very slow push keeps the still from reading as a frozen frame.
  const stillScale = interpolate(frame, [0, durationInFrames], [1.04, 1.1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink, overflow: "hidden" }}>
      {videoSrc ? (
        <OffthreadVideo
          src={staticFile(videoSrc)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Img
          src={staticFile(fallbackImage)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${stillScale})`,
          }}
        />
      )}
      {scrim ? (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(6,9,16,.42) 0%, rgba(6,9,16,0) 22%, rgba(6,9,16,0) 46%, rgba(6,9,16,.58) 78%, rgba(6,9,16,.82) 100%)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
