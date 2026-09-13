import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, Still, staticFile } from "remotion";
import {
  CAPTIONS,
  FPS,
  HEIGHT,
  HERO_WORD,
  HOOK_LINES,
  SCENES,
  SCENE_START,
  TOTAL_FRAMES,
  VO_TRACK,
  WIDTH,
} from "./config";
import { AnimatedCaption } from "./components/AnimatedCaption";
import { CTAEndCard } from "./components/CTAEndCard";
import { NoahAction } from "./components/NoahAction";
import { NoahApproval } from "./components/NoahApproval";
import { NoahDiagnosis } from "./components/NoahDiagnosis";
import { NoahResult } from "./components/NoahResult";
import { OVERLAP, SceneTransition } from "./components/SceneTransition";
import { ShortsThumbnail } from "./components/ShortsThumbnail";
import { YT_HEIGHT, YT_WIDTH, YouTubeThumbnail } from "./components/YouTubeThumbnail";
import { TextHook } from "./components/TextHook";
import { UGCClip } from "./components/UGCClip";
import { useBrandFonts } from "./lib/fonts";

export type VideoProps = {
  /**
   * Path under public/ to the generated Higgsfield clip. Null renders the
   * creator still instead, so the cut can be reviewed before the clip lands.
   */
  ugcClip: string | null;
  /**
   * Path under public/ to the assembled voiceover track for the product beats.
   * Null renders them silent.
   */
  voTrack: string | null;
};

const HOOK_FROM = Math.round(0.25 * FPS);
const HOOK_DURATION = Math.round(3.05 * FPS);

export const NoahBeforeAppTouchesMac: React.FC<VideoProps> = ({ ugcClip, voTrack }) => {
  useBrandFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: "#080B11" }}>
      {/* Her voice continues over the product beats. The UGC clip carries its
          own dialogue, so this starts where that clip ends. */}
      {voTrack ? (
        <Sequence from={VO_TRACK.startFrame} name="Voiceover">
          <Audio src={staticFile(voTrack)} volume={VO_TRACK.volume} />
        </Sequence>
      ) : null}

      {/* Beat 1 — the creator. Clip is generated clean; all text is drawn here. */}
      <Sequence durationInFrames={SCENES.ugc + OVERLAP} name="UGC">
        <UGCClip
          videoSrc={ugcClip}
          fallbackImage="creator/korean-creator.png"
          durationInFrames={SCENES.ugc}
        />
        <Sequence from={HOOK_FROM} durationInFrames={HOOK_DURATION} name="Hook">
          <TextHook lines={HOOK_LINES} durationInFrames={HOOK_DURATION} top={240} fontSize={72} />
        </Sequence>
        {CAPTIONS.map((group, i) => {
          const from = Math.round(group.from * FPS);
          const duration = Math.round((group.to - group.from) * FPS);
          return (
            <Sequence key={i} from={from} durationInFrames={duration} name={`Caption ${i + 1}`}>
              <AnimatedCaption
                lines={group.lines}
                emphasis={group.emphasis}
                heroWord={i === 0 ? HERO_WORD : undefined}
                durationInFrames={duration}
              />
            </Sequence>
          );
        })}
      </Sequence>

      <Sequence
        from={SCENE_START.diagnosis}
        durationInFrames={SCENES.diagnosis + OVERLAP}
        name="Diagnosis"
      >
        <SceneTransition>
          <NoahDiagnosis
            durationInFrames={SCENES.diagnosis}
            labelSwitch={voTrack ? VO_TRACK.lines.diagnosis.labelSwitch : undefined}
          />
        </SceneTransition>
      </Sequence>

      <Sequence
        from={SCENE_START.approval}
        durationInFrames={SCENES.approval + OVERLAP}
        name="Approval"
      >
        <SceneTransition>
          <NoahApproval
            durationInFrames={SCENES.approval}
            labelSwitch={voTrack ? VO_TRACK.lines.approval.labelSwitch : undefined}
          />
        </SceneTransition>
      </Sequence>

      <Sequence from={SCENE_START.action} durationInFrames={SCENES.action + OVERLAP} name="Action">
        <SceneTransition>
          <NoahAction
            durationInFrames={SCENES.action}
            labelSwitch={voTrack ? VO_TRACK.lines.action.labelSwitch : undefined}
          />
        </SceneTransition>
      </Sequence>

      <Sequence from={SCENE_START.result} durationInFrames={SCENES.result + OVERLAP} name="Result">
        <SceneTransition>
          <NoahResult durationInFrames={SCENES.result} />
        </SceneTransition>
      </Sequence>

      <Sequence from={SCENE_START.cta} durationInFrames={SCENES.cta} name="CTA">
        <SceneTransition>
          <CTAEndCard durationInFrames={SCENES.cta} voiced={Boolean(voTrack)} />
        </SceneTransition>
      </Sequence>
    </AbsoluteFill>
  );
};

const ThumbnailRoot: React.FC = () => {
  useBrandFonts();
  return <ShortsThumbnail />;
};

const YouTubeThumbnailRoot: React.FC = () => {
  useBrandFonts();
  return <YouTubeThumbnail />;
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="NoahBeforeAppTouchesMac"
      component={NoahBeforeAppTouchesMac}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ ugcClip: null, voTrack: null } satisfies VideoProps}
    />
    <Still
      id="ShortsThumbnail"
      component={ThumbnailRoot}
      width={WIDTH}
      height={HEIGHT}
    />
    <Still
      id="YouTubeThumbnail"
      component={YouTubeThumbnailRoot}
      width={YT_WIDTH}
      height={YT_HEIGHT}
    />
  </>
);
