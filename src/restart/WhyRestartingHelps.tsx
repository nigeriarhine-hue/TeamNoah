import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AURORA_LIGHT, C, FONT, sec} from '../brand/theme';
import {loadBrandFonts} from '../brand/fonts';
import {CaptionTrack} from '../components/CaptionTrack';
import {EducationalCTA} from '../components/EducationalCTA';
import {EducationalSection, PageBackground} from '../components/EducationalSection';
import {EnhancedLightNoahScreen} from '../components/EnhancedLightNoahScreen';
import {
  AppAlertIcon,
  BackgroundIcon,
  ProcessIcon,
  RestartIcon,
  ServicesIcon,
  StartupIcon,
  StorageIcon,
  TempIcon,
} from '../components/Icons';
import {KineticHeadline} from '../components/KineticHeadline';
import {NoahApprovalFocus} from '../components/NoahApprovalFocus';
import {NoahDiagnosticFocus} from '../components/NoahDiagnosticFocus';
import {RESTART_PROMPT} from '../components/noahScreenData';
import {RecurringProblemDiagram} from '../components/RecurringProblemDiagram';
import {RestartLoop} from '../components/RestartLoop';
import {SAFE} from '../components/ShortsSafeArea';
import {TechExplainerCard} from '../components/TechExplainerCard';
import {TechHostScene} from '../components/TechHostScene';
import vo from './voTimings.json';

loadBrandFonts();

export const RESTART_DURATION = 1200; // 40.0 s @ 30 fps

// Scene boundaries (frames), driven by the narration timings in voTimings.json
const T = {
  hook: 0,
  loop: 78,
  sec01: 212,
  sec02: 388,
  hostB: 636,
  bridge: 788,
  noah: 832,
  end: 1017,
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- sound helpers ----------
const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 0.5}) => (
  <Sequence from={at} durationInFrames={60} layout="none">
    <Audio src={staticFile(`audio/${src}.wav`)} volume={volume} />
  </Sequence>
);

// ---------- scenes ----------
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame: frame - 2, fps, config: {damping: 200}, durationInFrames: 12});
  const spin = interpolate(frame, [4, 34], [0, 360], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const but = spring({frame: frame - 62, fps, config: {damping: 12, mass: 0.6}, durationInFrames: 14});
  return (
    <TechHostScene src="video/host-a-sync.mp4" pushFrom={1.0} pushTo={1.05}>
      <div
        style={{
          position: 'absolute',
          left: SAFE.side - 10,
          right: SAFE.side - 10,
          top: 1020,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: 34,
          padding: '34px 40px 34px',
          boxShadow: '0 30px 70px -30px rgba(0,0,0,0.6)',
          fontFamily: FONT,
          opacity: card,
          transform: `translateY(${(1 - card) * 60}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <div style={{flex: 1}}>
          <KineticHeadline
            size={54}
            lines={[
              {text: 'RESTARTING YOUR PC', at: 4},
              {text: 'CAN HELP.', at: 12, accent: true, size: 118},
            ]}
          />
        </div>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 40,
            background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <RestartIcon size={96} color="#fff" stroke={2.4} style={{transform: `rotate(${spin}deg)`}} />
        </div>
      </div>
      {/* BUT... */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 820,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 170,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: '#fff',
          textShadow: '0 8px 40px rgba(0,0,0,0.55)',
          opacity: but,
          transform: `scale(${0.7 + 0.3 * but})`,
        }}
      >
        BUT...
      </div>
    </TechHostScene>
  );
};

const LoopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 12});
  return (
    <AbsoluteFill style={{opacity: enter, transform: `translateY(${(1 - enter) * 60}px)`}}>
      <PageBackground />
      <div style={{position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 30}}>
        <KineticHeadline
          size={100}
          lines={[
            {text: 'IF IT KEEPS', at: 18},
            {text: 'COMING BACK...', at: 24, accent: true},
          ]}
        />
      </div>
      <div style={{position: 'absolute', left: SAFE.side, top: 540}}>
        <RestartLoop cycleFrames={44} cycles={3} nodeGap={228} />
      </div>
    </AbsoluteFill>
  );
};

const Banner: React.FC<{at: number; lines: string[]; tone: 'good' | 'accent'; dark?: boolean; top: number}> = ({at, lines, tone, dark, top}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 16}, durationInFrames: 16});
  const good = tone === 'good';
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        right: SAFE.side,
        top,
        borderRadius: 30,
        padding: '26px 34px 28px',
        fontFamily: FONT,
        background: good ? 'rgba(14,159,110,0.10)' : dark ? 'rgba(255,255,255,0.07)' : C.page2,
        border: `3px solid ${good ? 'rgba(14,159,110,0.45)' : dark ? 'rgba(187,162,255,0.45)' : C.line}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px) scale(${0.95 + 0.05 * p})`,
      }}
    >
      {lines.map((l, i) => (
        <div
          key={l}
          style={{
            fontSize: 54,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.12,
            color: good ? C.success : i === 0 ? '#FFFFFF' : undefined,
            ...(i === 1 && !good
              ? {backgroundImage: AURORA_LIGHT, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}
              : {}),
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

const Section01: React.FC = () => {
  const o = T.sec01;
  return (
    <EducationalSection number="01" heading={['WHAT A RESTART', 'CAN HELP WITH']}>
      <div style={{position: 'absolute', left: SAFE.side, right: SAFE.side, top: 640, display: 'flex', flexDirection: 'column', gap: 26}}>
        <TechExplainerCard icon={ProcessIcon} title="STUCK PROCESSES" outcome="stopped / restarted" at={sec(7.15) - o} variant="helps" />
        <TechExplainerCard icon={TempIcon} title="TEMPORARY ACTIVITY" outcome="cleared / reset" at={sec(9.47) - o} variant="helps" />
        <TechExplainerCard icon={ServicesIcon} title="SYSTEM SERVICES" outcome="reloaded" at={sec(11.0) - o} variant="helps" />
      </div>
      <Banner at={sec(11.95) - o} top={1250} tone="good" lines={['SOMETIMES, A RESTART IS ENOUGH.']} />
    </EducationalSection>
  );
};

const Section02: React.FC = () => {
  const o = T.sec02;
  return (
    <EducationalSection number="02" heading={["WHAT A RESTART", "DOESN'T NECESSARILY FIX"]} headingSize={62} dark>
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          right: SAFE.side,
          top: 590,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 22,
        }}
      >
        <TechExplainerCard dark layout="tile" icon={StartupIcon} title="STARTUP APPS" outcome="launch again" at={sec(13.02) - o} variant="returns" style={{height: 300}} />
        <TechExplainerCard dark layout="tile" icon={BackgroundIcon} title="BACKGROUND PROGRAMS" outcome="may return" at={sec(14.73) - o} variant="returns" style={{height: 300}} />
        <TechExplainerCard dark layout="tile" icon={StorageIcon} title="LOW STORAGE" outcome="still low" at={sec(16.69) - o} variant="returns" style={{height: 300}} />
        <TechExplainerCard dark layout="tile" icon={AppAlertIcon} title="ONE PROBLEM APP" outcome="may still be broken" at={sec(18.59) - o} variant="returns" style={{height: 300}} />
      </div>
      <Banner at={sec(19.75) - o} top={1240} dark tone="accent" lines={['RESTARTING CAN RESET.', "IT DOESN'T ALWAYS SOLVE."]} />
    </EducationalSection>
  );
};

const HostBScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const o = T.hostB;
  const panel = spring({frame: frame - 2, fps, config: {damping: 200}, durationInFrames: 12});
  const findAt = sec(24.9) - o;
  const find = spring({frame: frame - findAt, fps, config: {damping: 14}, durationInFrames: 16});
  return (
    // host-b-sync.mp4 starts at narration time 21.10 s (frame 633); this scene starts at frame 636
    <TechHostScene src="video/host-b-sync.mp4" startFrom={T.hostB - sec(21.1)} pushFrom={1.03} pushTo={1.09}>
      <div
        style={{
          position: 'absolute',
          left: SAFE.side - 10,
          right: SAFE.side - 10,
          top: 1000,
          background: 'rgba(255,255,255,0.94)',
          borderRadius: 34,
          padding: '30px 34px',
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          fontFamily: FONT,
          opacity: panel,
          transform: `translateY(${(1 - panel) * 60}px)`,
          boxShadow: '0 30px 70px -30px rgba(0,0,0,0.6)',
        }}
      >
        <RecurringProblemDiagram size={250} breakAt={findAt} />
        <div style={{flex: 1}}>
          <KineticHeadline
            size={62}
            lines={[
              {text: 'RESTARTING', at: 4},
              {text: 'OVER AND', at: 8},
              {text: 'OVER?', at: 12},
            ]}
          />
          <div
            style={{
              marginTop: 14,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              opacity: find,
              transform: `translateY(${(1 - find) * 20}px)`,
              backgroundImage: 'linear-gradient(135deg,#2563EB,#7C3AED)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              whiteSpace: 'nowrap',
            }}
          >
            FIND THE CAUSE.
          </div>
        </div>
      </div>
    </TechHostScene>
  );
};

const BridgeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 12});
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - enter) * 100}% 0 0 0)`}}>
      <PageBackground />
      <div style={{position: 'absolute', left: SAFE.side, right: SAFE.side, top: 640}}>
        <KineticHeadline
          size={96}
          align="center"
          lines={[
            {text: 'WANT TO KNOW', at: 4},
            {text: 'WHAT KEEPS', at: 9, accent: true},
            {text: 'COMING BACK?', at: 13, accent: true},
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

const NoahScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // phase timings relative to the scene
  const typeStart = 2;
  const typeEnd = 26;
  const sendAt = 28;
  const stepsStart = 34;
  const stepEvery = 4;
  const resultAt = 50;
  const planAt = 94;
  const planClickAt = 128;
  const modalAt = 134;
  const goClickAt = 158;
  const approvedAt = 164;
  const typed = frame < sendAt ? RESTART_PROMPT.slice(0, Math.round(interpolate(frame, [typeStart, typeEnd], [0, RESTART_PROMPT.length], clamp))) : '';
  const toPlan = interpolate(frame, [planAt - 6, planAt + 6], [0, 1], clamp);

  const kicker = (() => {
    if (frame < resultAt) return {k: 'a', lines: [{text: 'CHECK WHAT’S', at: 0}, {text: 'HAPPENING', at: 4, accent: true}]};
    if (frame < planAt) return {k: 'b', lines: [{text: 'WHAT NOAH', at: resultAt}, {text: 'CHECKED', at: resultAt + 4, accent: true}]};
    if (frame < modalAt) return {k: 'c', lines: [{text: 'WHAT NOAH', at: planAt}, {text: 'WOULD DO', at: planAt + 4, accent: true}]};
    return {k: 'd', lines: [{text: 'SEE THE PLAN.', at: modalAt}, {text: 'YOU DECIDE.', at: modalAt + 5, accent: true}]};
  })();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 12});

  return (
    <AbsoluteFill style={{opacity: enter}}>
      <PageBackground />
      <div style={{position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top - 10, height: 170}}>
        <KineticHeadline key={kicker.k} size={74} lines={kicker.lines} />
      </div>
      <div style={{position: 'absolute', left: SAFE.side, top: 360}}>
        <EnhancedLightNoahScreen
          height={1060}
          enterAt={0}
          inputText={typed}
          inputPlaceholder={frame >= planAt ? '…or tell Noah to do it differently' : undefined}
          sendPressedAt={sendAt}
          running={frame >= sendAt && frame < resultAt + 10}
        >
          <div style={{position: 'absolute', inset: 0, opacity: 1 - toPlan, transform: `translateY(${-toPlan * 120}px)`}}>
            <NoahDiagnosticFocus prompt={RESTART_PROMPT} bubbleAt={sendAt + 1} stepsStart={stepsStart} stepEvery={stepEvery} resultAt={resultAt} />
          </div>
          {frame >= planAt - 6 ? (
            <NoahApprovalFocus planAt={planAt} planClickAt={planClickAt} modalAt={modalAt} goClickAt={goClickAt} approvedAt={approvedAt} />
          ) : null}
        </EnhancedLightNoahScreen>
      </div>
    </AbsoluteFill>
  );
};

const EndScene: React.FC = () => {
  const o = T.end;
  return (
    <EducationalCTA
      lines={[
        {text: "DON'T JUST", at: 2},
        {text: 'RESTART IT AGAIN.', at: 6},
        {text: 'CHECK WHAT', at: sec(35.43) - o, accent: true},
        {text: 'KEEPS COMING BACK.', at: sec(35.43) - o + 4, accent: true},
      ]}
      offerAt={sec(37.1) - o}
      offer="FREE PC CHECK"
      url="onnoah.app"
      tagline="Describe it. Approve it. Done."
      taglineAt={sec(37.9) - o}
    />
  );
};

// ---------- composition ----------
export const WhyRestartingHelps: React.FC = () => {
  const n = T.noah;
  return (
    <AbsoluteFill style={{backgroundColor: C.page}}>
      <Sequence from={T.hook} durationInFrames={T.loop - T.hook}>
        <HookScene />
      </Sequence>
      <Sequence from={T.loop} durationInFrames={T.sec01 - T.loop}>
        <LoopScene />
      </Sequence>
      <Sequence from={T.sec01} durationInFrames={T.sec02 - T.sec01}>
        <Section01 />
      </Sequence>
      <Sequence from={T.sec02} durationInFrames={T.hostB - T.sec02}>
        <Section02 />
      </Sequence>
      <Sequence from={T.hostB} durationInFrames={T.bridge - T.hostB}>
        <HostBScene />
      </Sequence>
      <Sequence from={T.bridge} durationInFrames={T.noah - T.bridge}>
        <BridgeScene />
      </Sequence>
      <Sequence from={T.noah} durationInFrames={T.end - T.noah}>
        <NoahScene />
      </Sequence>
      <Sequence from={T.end} durationInFrames={RESTART_DURATION - T.end}>
        <EndScene />
      </Sequence>

      <CaptionTrack
        segments={vo.segments}
        hideRanges={[[T.end / 30, 99]]}
        highlights={[
          'can actually help',
          'keeps coming back',
          'stuck processes',
          'startup apps',
          'background programs',
          'low storage',
          'one app',
          'actually causing',
          'check what’s happening',
          "check what's happening",
          'approve',
        ]}
      />

      {/* narration + music */}
      <Audio src={staticFile('audio/vo-restart.wav')} volume={1} />
      <Audio
        src={staticFile('audio/music-bed.wav')}
        volume={(f) => interpolate(f, [0, 20, 1170, 1188, 1199], [0, 0.11, 0.11, 0.16, 0], clamp)}
      />

      {/* sound design */}
      <Sfx at={3} src="sfx-restart" volume={0.32} />
      <Sfx at={62} src="sfx-impact" volume={0.45} />
      <Sfx at={T.loop} src="sfx-swoosh" volume={0.28} />
      {[0, 11, 22, 33].map((d) => (
        <Sfx key={d} at={T.loop + d} src="sfx-tick" volume={0.3} />
      ))}
      {[11, 55, 99].map((d) => (
        <Sfx key={`r${d}`} at={T.loop + d} src="sfx-restart" volume={0.16} />
      ))}
      {[40, 84, 128].map((d) => (
        <Sfx key={`b${d}`} at={T.loop + d} src="sfx-return" volume={0.3} />
      ))}
      <Sfx at={T.sec01} src="sfx-swoosh" volume={0.28} />
      <Sfx at={sec(7.15)} src="sfx-pop" volume={0.3} />
      <Sfx at={sec(7.15) + 12} src="sfx-stop" volume={0.3} />
      <Sfx at={sec(9.47)} src="sfx-pop" volume={0.3} />
      <Sfx at={sec(9.47) + 12} src="sfx-tick" volume={0.35} />
      <Sfx at={sec(11.0)} src="sfx-pop" volume={0.3} />
      <Sfx at={sec(11.0) + 12} src="sfx-reload" volume={0.3} />
      <Sfx at={sec(11.95)} src="sfx-tick" volume={0.3} />
      <Sfx at={T.sec02} src="sfx-swoosh" volume={0.3} />
      {[13.02, 14.73, 16.69, 18.59].map((s) => (
        <React.Fragment key={s}>
          <Sfx at={sec(s)} src="sfx-pop" volume={0.26} />
          <Sfx at={sec(s) + 9} src="sfx-restart" volume={0.13} />
          <Sfx at={sec(s) + 22} src="sfx-return" volume={0.3} />
        </React.Fragment>
      ))}
      <Sfx at={sec(19.75)} src="sfx-impact" volume={0.3} />
      <Sfx at={T.hostB} src="sfx-swoosh" volume={0.26} />
      <Sfx at={sec(24.9)} src="sfx-pop" volume={0.3} />
      <Sfx at={T.bridge} src="sfx-swoosh" volume={0.28} />
      <Sfx at={n} src="sfx-swoosh" volume={0.22} />
      <Sfx at={n + 2} src="sfx-typing" volume={0.3} />
      <Sfx at={n + 28} src="sfx-click" volume={0.4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={`d${i}`} at={n + 34 + (i + 1) * 4} src="sfx-tick" volume={0.22} />
      ))}
      <Sfx at={n + 50} src="sfx-pop" volume={0.28} />
      <Sfx at={n + 94} src="sfx-swoosh" volume={0.18} />
      <Sfx at={n + 128} src="sfx-click" volume={0.4} />
      <Sfx at={n + 134} src="sfx-pop" volume={0.3} />
      <Sfx at={n + 158} src="sfx-approve" volume={0.4} />
      <Sfx at={n + 164} src="sfx-chime" volume={0.3} />
      <Sfx at={T.end} src="sfx-swoosh" volume={0.26} />
      <Sfx at={sec(37.1)} src="sfx-pop" volume={0.25} />
    </AbsoluteFill>
  );
};
