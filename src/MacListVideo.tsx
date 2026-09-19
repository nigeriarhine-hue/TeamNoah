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
 * locked VO, not from guessed beats:
 *
 *   A  "Number one," 0.00-1.06 | "delete random files." 1.68-2.86
 *      "Number two," 3.66-4.92 | "install five cleaner apps." 5.36-7.04
 *   B  "Number three" 0.00-0.98 | "...Reddit command I don't understand." 1.62-4.66
 *      "I just tell Noah what's wrong." 5.28-6.66
 */
export const T = {
  clipA: {from: 0, dur: 225},
  clipB: {from: 225, dur: 218},
  problem: {from: 443, dur: 69},
  diagnosis: {from: 512, dur: 81},
  approval: {from: 593, dur: 81},
  result: {from: 674, dur: 66},
  cta: {from: 740, dur: 70},
} as const;

export const TOTAL = T.cta.from + T.cta.dur; // 810 frames = 27.0s

// source pixel dimensions of the genuine screenshots
const UI_01 = {srcW: 1170, srcH: 985};
const UI_02 = {srcW: 1170, srcH: 979};
const UI_03 = {srcW: 1170, srcH: 985};

export const MacListVideo: React.FC = () => {
  const ref = 'ugc/mac-list/video3-reference.png';

  return (
    <AbsoluteFill style={{backgroundColor: '#05070F'}}>
      <FontFaces />

      {/* ---------- CLIP A : items one and two ---------- */}
      <Sequence from={T.clipA.from} durationInFrames={T.clipA.dur} name="Clip A">
        {/* beats: "Number one" 0.00s | "delete" 1.68s | "Number two" 3.66s | "install" 5.36s */}
        <Punch beats={[0, 50, 110, 161]}>
          <UGCClip
            src="ugc/mac-list/video3-list-a.mp4"
            fallbackStill={ref}
            hasClip={assets.clipA}
            hasStill={assets.reference}
          />
        </Punch>
        <CaptionScrim />

        {/* opening hook, clears before the first list item lands */}
        <Sequence durationInFrames={46} name="Hook">
          <AbsoluteFill
            style={{justifyContent: 'center', alignItems: 'center', padding: '0 30px'}}
          >
            <TextHook
              lines={['THINGS I WILL NOT DO', 'TO FIX MY MAC IN 2026']}
              tease="stay for #3"
            />
          </AbsoluteFill>
        </Sequence>

        {/* item 1 — enters on "delete", struck as "files" lands */}
        <Sequence from={45} durationInFrames={62} name="Item 1">
          <FingerCountOverlay count={1} />
          <SafeArea justify="flex-end">
            <ListItem n={1} lines={['DELETE RANDOM', 'FILES']} strikeAt={42} />
          </SafeArea>
          <Audio src={staticFile('sfx/item1.wav')} startFrom={0} volume={0.5} />
        </Sequence>

        {/* item 2 — enters on "Number two", struck as "apps" lands */}
        <Sequence from={110} durationInFrames={115} name="Item 2">
          <FingerCountOverlay count={2} />
          <SafeArea justify="flex-end">
            <ListItem n={2} lines={['INSTALL FIVE', 'CLEANER APPS']} strikeAt={101} />
          </SafeArea>
          <Sequence from={98}>
            <Audio src={staticFile('sfx/item2.wav')} volume={0.55} />
          </Sequence>
        </Sequence>
      </Sequence>

      {/* ---------- CLIP B : item three, then the turn ---------- */}
      <Sequence from={T.clipB.from} durationInFrames={T.clipB.dur} name="Clip B">
        {/* beats: "Number three" 0.00s | "Follow a seven-year-old" 1.62s | the turn 5.28s */}
        <Punch beats={[0, 49, 158]} amount={0.06}>
          <UGCClip
            src="ugc/mac-list/video3-list-b.mp4"
            fallbackStill={ref}
            hasClip={assets.clipB}
            hasStill={assets.reference}
          />
        </Punch>
        <CaptionScrim />

        <Sequence durationInFrames={150} name="Item 3">
          <FingerCountOverlay count={3} />
          <SafeArea justify="flex-end">
            <ListItem
              n={3}
              lines={['FOLLOW A 7-YEAR-OLD', 'REDDIT COMMAND']}
              strikeAt={140}
              subtle="what could go wrong?"
            />
          </SafeArea>
          <Audio src={staticFile('sfx/item3.wav')} volume={0.5} />
        </Sequence>

        {/* the turn — "I just tell Noah what's wrong." 5.28-6.66s */}
        <Sequence from={156} durationInFrames={62} name="Turn">
          <SafeArea justify="flex-end">
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
        <Sequence from={196}>
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
