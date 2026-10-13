import React from "react";
import { Composition, Still } from "remotion";
import { FPS, H, W } from "./theme";
import { TOTAL } from "./timeline";
import { WhatHappens } from "./WhatHappens";
import { Thumbnail16x9, ThumbnailShorts } from "./Thumbnails";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="WhatHappens" component={WhatHappens} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
    <Still id="ThumbnailShorts" component={ThumbnailShorts} width={1080} height={1920} />
    <Still id="Thumbnail16x9" component={Thumbnail16x9} width={1280} height={720} />
  </>
);
