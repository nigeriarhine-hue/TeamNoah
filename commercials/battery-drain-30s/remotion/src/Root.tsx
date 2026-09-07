import React from 'react';
import {Composition} from 'remotion';
import {FPS} from './theme';
import {Animatic} from './Animatic';
import {UI01, UI02, UI03} from './screens/macro';
import {UI04, UI05, UI06, UI07, UI08, UI09, UI11} from './screens/app';
import {UI10} from './screens/endcard';

/**
 * Durations are the clip's exact frame count from 10-master-timeline.md, so a
 * rendered screen drops onto the timeline with no retiming. Do not round them.
 */
const D = {width: 2560, height: 1600, fps: FPS};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Animatic" component={Animatic}
      durationInFrames={816} fps={FPS} width={1920} height={1080} />

    {/* macro inserts */}
    <Composition id="UI-01" component={UI01} durationInFrames={43} fps={FPS} width={1200} height={300} />
    <Composition id="UI-02" component={UI02} durationInFrames={34} fps={FPS} width={1200} height={300} />
    <Composition id="UI-03" component={UI03} durationInFrames={29} fps={FPS} width={1179} height={2556} />

    {/* the app */}
    <Composition id="UI-04" component={UI04} durationInFrames={38} {...D} />
    <Composition id="UI-05" component={UI05} durationInFrames={29} {...D} />
    <Composition id="UI-06" component={UI06} durationInFrames={53} {...D} />
    <Composition id="UI-07" component={UI07} durationInFrames={53} {...D} />
    <Composition id="UI-08" component={UI08} durationInFrames={34} {...D} />
    <Composition id="UI-09" component={UI09} durationInFrames={53} {...D} />
    <Composition id="UI-11" component={UI11} durationInFrames={67} {...D} />

    {/* end card */}
    <Composition id="UI-10" component={UI10}
      durationInFrames={66} fps={FPS} width={3840} height={2160} />
  </>
);
