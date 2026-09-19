import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';

import assets from './assets.json';
import {FontFaces} from './fonts';
import {PATCHES_01, PATCHES_02, PATCHES_03} from './macPatches';
import {AnimatedCaption} from './components/AnimatedCaption';
import {CTAEndCard} from './components/CTAEndCard';
import {FocusZoom} from './components/FocusZoom';
import {FingerCountOverlay} from './components/FingerCountOverlay';
import {ListItem} from './components/ListItem';
import {NoahOverlay, TideRule} from './components/NoahScreen';
import {Flash, Punch} from './components/Punch';
import {SafeArea} from './components/SafeArea';
import {TextHook} from './components/TextHook';
import {CaptionScrim, UGCClip} from './components/UGCClip';

/**
 * Timeline, 30fps. Cut points come from the word-level transcript of the
 * delivered clips, not from guessed beats:
 *
 *   INTRO "Three things I will not do to fix my Mac in 2026." 0.00-3.94
 *   A     "Number one," 0.00-1.52 | "delete random files." 2.26-3.28
 *         "Number two," 4.12-4.86 | "install five cleaner apps." 5.40-7.06
 *   B     "number three" 0.00-1.38 | "...reddit command I don't understand" 1.38-4.80
 *         "I just tell Noah what's wrong" 4.80-6.92
 *
 * The spoken hook was added after the original brief, which pushes the total
 * past the 22-27s target; the product beats are trimmed a little to hold it
 * near 29s rather than cutting the hook short.
 */
export const T = {
  intro: {from: 0, dur: 123},
  clipA: {from: 123, dur: 225},
  clipB: {from: 348, dur: 218},
  problem: {from: 566, dur: 56},
  diagnosis: {from: 622, dur: 68},
  approval: {from: 690, dur: 72},
  result: {from: 762, dur: 55},
  cta: {from: 817, dur: 65},
} as const;

export const TOTAL = T.cta.from + T.cta.dur; // 882 frames = 29.4s

// source pixel dimensions of the genuine screenshots
const UI_01 = {srcW: 1170, srcH: 985};
const UI_02 = {srcW: 1170, srcH: 979};
const UI_03 = {srcW: 1170, srcH: 985};

export const MacListVideo: React.FC = () => {
  const ref = 'ugc/mac-list/video3-reference.png';

  return (
    <AbsoluteFill style={{backgroundColor: '#05070F'}}>
      <FontFaces />

      {/* ---------- INTRO : she speaks the title ---------- */}
      <Sequence from={T.intro.from} durationInFrames={T.intro.dur} name="Intro">
        <Punch beats={[0]} amount={0.04}>
          <UGCClip
            src="ugc/mac-list/video3-intro.mp4"
            fallbackStill={ref}
            hasClip={assets.intro}
            hasStill={assets.reference}
          />
        </Punch>
        <CaptionScrim />
        {/* sits low: her hands are down here, so the lower third is clear */}
        <SafeArea justify="flex-end" bottom={430}>
          <TextHook
            lines={['THINGS I WILL NOT DO', 'TO FIX MY MAC IN 2026']}
            tease="stay for #3"
          />
        </SafeArea>
      </Sequence>

      {/* ---------- CLIP A : items one and two ---------- */}
      <Sequence from={T.clipA.from} durationInFrames={T.clipA.dur} name="Clip A">
        {/* beats: "Number one" 0.00s | "delete" 2.26s | "Number two" 4.12s | "install" 5.40s */}
        <Punch beats={[0, 68, 124, 162]}>
          <UGCClip
            src="ugc/mac-list/video3-list-a.mp4"
            fallbackStill={ref}
            hasClip={assets.clipA}
            hasStill={assets.reference}
          />
        </Punch>
        <CaptionScrim />

        {/* item 1 — enters on "delete" (2.26s), struck as "files" lands (3.28s) */}
        <Sequence from={68} durationInFrames={52} name="Item 1">
          <FingerCountOverlay count={1} />
          <SafeArea justify="flex-end" bottom={700}>
            <ListItem n={1} lines={['DELETE RANDOM', 'FILES']} strikeAt={30} />
          </SafeArea>
          <Audio src={staticFile('sfx/item1.wav')} startFrom={0} volume={0.5} />
        </Sequence>

        {/* item 2 — enters on "Number two" (4.12s), struck as "apps" lands (7.06s) */}
        <Sequence from={124} durationInFrames={101} name="Item 2">
          <FingerCountOverlay count={2} />
          <SafeArea justify="flex-end" bottom={700}>
            <ListItem n={2} lines={['INSTALL FIVE', 'CLEANER APPS']} strikeAt={88} />
          </SafeArea>
          <Sequence from={85}>
            <Audio src={staticFile('sfx/item2.wav')} volume={0.55} />
          </Sequence>
        </Sequence>
      </Sequence>

      {/* ---------- CLIP B : item three, then the turn ---------- */}
      <Sequence from={T.clipB.from} durationInFrames={T.clipB.dur} name="Clip B">
        {/* beats: "number three" 0.00s | "follow" 1.38s | the turn 4.80s */}
        <Punch beats={[0, 41, 144]} amount={0.06}>
          <UGCClip
            src="ugc/mac-list/video3-list-b.mp4"
            fallbackStill={ref}
            hasClip={assets.clipB}
            hasStill={assets.reference}
          />
        </Punch>
        <CaptionScrim />

        <Sequence durationInFrames={146} name="Item 3">
          <FingerCountOverlay count={3} />
          <SafeArea justify="flex-end" bottom={700}>
            <ListItem
              n={3}
              lines={['FOLLOW A 7-YEAR-OLD', 'REDDIT COMMAND']}
              strikeAt={136}
              subtle="what could go wrong?"
            />
          </SafeArea>
          <Audio src={staticFile('sfx/item3.wav')} volume={0.5} />
        </Sequence>

        {/* the turn — "I just tell Noah what's wrong" 4.80-6.92s */}
        <Sequence from={144} durationInFrames={74} name="Turn">
          <SafeArea justify="flex-end" bottom={620}>
            <AnimatedCaption
              parts={[
                {text: 'I just tell'},
                {text: 'NOAH', emphasis: true},
                {text: "what's wrong."},
              ]}
              size={74}
            />
          </SafeArea>
        </Sequence>

        {/* whoosh carries us into the product */}
        <Sequence from={200}>
          <Audio src={staticFile('sfx/whoosh.wav')} volume={0.42} />
        </Sequence>
      </Sequence>

      {/* ---------- GENUINE NOAH UI ---------- */}
      <Sequence from={T.problem.from} durationInFrames={T.problem.dur} name="Noah problem">
        <FocusZoom
          src="noah-ui/01-problem.jpg"
          {...UI_01}
          patches={PATCHES_01}
          colX={390} colW={780} anchorY={500}
          zoom={{from: 1.0, to: 1.05}}
          durationInFrames={T.problem.dur}
        />
        <Flash at={0} />
        <NoahOverlay lines={['JUST TELL NOAH', "WHAT'S WRONG."]} position="bottom" />
        <TideRule durationInFrames={T.problem.dur} />
      </Sequence>

      <Sequence from={T.diagnosis.from} durationInFrames={T.diagnosis.dur} name="Noah diagnosis">
        <FocusZoom
          src="noah-ui/02-diagnosis.jpg"
          {...UI_02}
          patches={PATCHES_02}
          colX={392} colW={706} anchorY={520}
          zoom={{from: 1.0, to: 1.05}}
          durationInFrames={T.diagnosis.dur}
        />
        <NoahOverlay lines={['NO GUESSING.']} position="bottom" />
        <TideRule durationInFrames={T.diagnosis.dur} />
      </Sequence>

      <Sequence from={T.approval.from} durationInFrames={T.approval.dur} name="Noah approval">
        <FocusZoom
          src="noah-ui/02-diagnosis.jpg"
          {...UI_02}
          patches={PATCHES_02}
          colX={396} colW={706} anchorY={640}
          zoom={{from: 0.97, to: 1.0}}
          durationInFrames={T.approval.dur}
          // ring the real approve button rather than drawing a fake modal;
          // source-space, so it tracks the button through any crop change
          ring={{x: 398, y: 761, w: 702, h: 54, appearAt: 8}}
          cursor={{fromX: 930, fromY: 700, toX: 762, toY: 786, clickAt: 44}}
        />
        <NoahOverlay lines={['YOU APPROVE', 'THE FIX.']} position="bottom" accentLast />
        <Sequence from={44}>
          <Audio src={staticFile('sfx/uiclick.wav')} volume={0.5} />
        </Sequence>
        <TideRule durationInFrames={T.approval.dur} />
      </Sequence>

      <Sequence from={T.result.from} durationInFrames={T.result.dur} name="Noah result">
        <FocusZoom
          src="noah-ui/03-approval-action.jpg"
          {...UI_03}
          patches={PATCHES_03}
          colX={392} colW={740} anchorY={700}
          zoom={{from: 1.0, to: 1.05}}
          durationInFrames={T.result.dur}
        />
        <NoahOverlay lines={['THEN NOAH SHOWS', 'WHAT IT DID.']} position="bottom" />
        <Audio src={staticFile('sfx/chime.wav')} volume={0.34} />
        <TideRule durationInFrames={T.result.dur} />
      </Sequence>

      {/* ---------- CTA ---------- */}
      <Sequence from={T.cta.from} durationInFrames={T.cta.dur} name="CTA">
        <CTAEndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
