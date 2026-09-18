import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';

import assets from './assets.json';
import {AnimatedCaption} from './components/AnimatedCaption';
import {CTAEndCard} from './components/CTAEndCard';
import {CursorClick} from './components/CursorClick';
import {FocusZoom} from './components/FocusZoom';
import {FingerCountOverlay} from './components/FingerCountOverlay';
import {ListItem} from './components/ListItem';
import {NoahApproval} from './components/NoahApproval';
import {NoahOverlay, TideRule} from './components/NoahScreen';
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

const UI_ASPECT = 1170 / 985;
const UI_ASPECT_B = 1170 / 979;

export const MacListVideo: React.FC = () => {
  const ref = 'ugc/mac-list/video3-reference.png';

  return (
    <AbsoluteFill style={{backgroundColor: '#05070F'}}>
      {/* ---------- CLIP A : items one and two ---------- */}
      <Sequence from={T.clipA.from} durationInFrames={T.clipA.dur} name="Clip A">
        <UGCClip
          src="ugc/mac-list/video3-list-a.mp4"
          fallbackStill={ref}
          hasClip={assets.clipA}
          hasStill={assets.reference}
        />
        <CaptionScrim />

        {/* opening hook, clears before the first list item lands */}
        <Sequence durationInFrames={46} name="Hook">
          <SafeArea justify="center">
            <TextHook lines={['THINGS I WILL NOT DO', 'TO FIX MY MAC IN 2026']} />
          </SafeArea>
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
        <UGCClip
          src="ugc/mac-list/video3-list-b.mp4"
          fallbackStill={ref}
          hasClip={assets.clipB}
          hasStill={assets.reference}
        />
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
          aspect={UI_ASPECT}
          focus={{x: 0.72, y: 0.2, from: 2.05, to: 2.22}}
          durationInFrames={T.problem.dur}
        />
        <NoahOverlay lines={['JUST TELL NOAH', "WHAT'S WRONG."]} position="bottom" />
        <TideRule durationInFrames={T.problem.dur} />
      </Sequence>

      <Sequence from={T.diagnosis.from} durationInFrames={T.diagnosis.dur} name="Noah diagnosis">
        <FocusZoom
          src="noah-ui/02-diagnosis.jpg"
          aspect={UI_ASPECT_B}
          focus={{x: 0.64, y: 0.43, from: 1.92, to: 2.08}}
          durationInFrames={T.diagnosis.dur}
        />
        <NoahOverlay lines={['NO GUESSING.']} position="top" />
        <TideRule durationInFrames={T.diagnosis.dur} />
      </Sequence>

      <Sequence from={T.approval.from} durationInFrames={T.approval.dur} name="Noah approval">
        <FocusZoom
          src="noah-ui/02-diagnosis.jpg"
          aspect={UI_ASPECT_B}
          focus={{x: 0.64, y: 0.8, from: 2.15, to: 2.25}}
          durationInFrames={T.approval.dur}
        >
          {/* ring the real approve button rather than drawing a fake modal */}
          <NoahApproval box={{left: 14, top: 44, width: 72, height: 10}} appearAt={8} />
          <CursorClick from={{x: 78, y: 74}} to={{x: 62, y: 50}} clickAt={44} />
        </FocusZoom>
        <NoahOverlay lines={['YOU APPROVE', 'THE FIX.']} position="top" accentLast />
        <Sequence from={44}>
          <Audio src={staticFile('sfx/uiclick.wav')} volume={0.5} />
        </Sequence>
        <TideRule durationInFrames={T.approval.dur} />
      </Sequence>

      <Sequence from={T.result.from} durationInFrames={T.result.dur} name="Noah result">
        <FocusZoom
          src="noah-ui/03-approval-action.jpg"
          aspect={UI_ASPECT}
          focus={{x: 0.64, y: 0.78, from: 2.0, to: 2.14}}
          durationInFrames={T.result.dur}
        />
        <NoahOverlay lines={['THEN NOAH SHOWS', 'WHAT IT DID.']} position="top" />
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
