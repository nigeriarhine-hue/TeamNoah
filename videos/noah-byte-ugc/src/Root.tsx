import React from "react";
import { Composition } from "remotion";
import { ByteReference } from "./ByteReference";
import { NoahByteUGC } from "./NoahByteUGC";
import { TL } from "./anim";
import { ThumbnailLandscape, ThumbnailShorts } from "./Thumbnail";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="NoahByteUGC" component={NoahByteUGC} durationInFrames={TL.durationInFrames} fps={30} width={1080} height={1920} />
    <Composition id="ByteReference" component={ByteReference} durationInFrames={1} fps={30} width={2400} height={1600} />
    <Composition id="ThumbnailShorts" component={ThumbnailShorts} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="ThumbnailLandscape" component={ThumbnailLandscape} durationInFrames={1} fps={30} width={1280} height={720} />
  </>
);
