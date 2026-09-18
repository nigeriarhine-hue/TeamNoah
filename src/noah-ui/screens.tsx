import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {aurora, colors, fonts} from '../brand';
import {Eyebrow, Headline, ink, Marker, Mono, Row, Screen, Stagger} from './primitives';

/**
 * 1 — DIAGNOSIS
 *
 * The user says what's wrong in their own words; Noah names the actual cause
 * in one sentence and lists what it looked at. Specific beats vague: the brand
 * treats "Spotlight is re-indexing your game library" as the trust signal and
 * "issues were found" as the thing we refuse to sound like.
 */
export const DiagnosisScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = interpolate(frame, [0, 11], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const said = 'my game keeps stuttering when i play';

  return (
    <Screen>
      {/* What the user typed, in their own words. */}
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <div
          style={{
            maxWidth: 620,
            padding: '18px 24px',
            borderRadius: 14,
            borderBottomRightRadius: 5,
            backgroundColor: 'rgba(26,29,97,0.07)',
            fontFamily: fonts.sans,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: '-0.015em',
            color: ink.full,
          }}
        >
          {said.slice(0, Math.round(typed * said.length))}
        </div>
      </div>

      <Stagger index={0} delay={5}>
        <Eyebrow>What Noah found</Eyebrow>
      </Stagger>

      <Stagger index={1} delay={5}>
        <Headline>
          It&rsquo;s probably not the game. Four background apps are competing with it.
        </Headline>
      </Stagger>

      <div style={{display: 'flex', flexDirection: 'column', gap: 13, marginTop: 4}}>
        <Stagger index={0} delay={13} step={5}>
          <Row
            marker="caution"
            title="Creative Cloud is running 4 helpers in the background"
            detail="AdobeIPCBroker · CCLibrary · CCXProcess · CRDaemon"
          />
        </Stagger>
        <Stagger index={1} delay={13} step={5}>
          <Row marker="caution" title="14 login items start with your Mac" detail="9 of them you have never opened" />
        </Stagger>
        <Stagger index={2} delay={13} step={5}>
          <Row
            marker="caution"
            title="Spotlight is re-indexing your game library"
            detail="~/Library/Application Support/Steam"
          />
        </Stagger>
        <Stagger index={3} delay={13} step={5}>
          <Row marker="caution" title="Startup disk is 94% full" detail="29 GB free of 512 GB" />
        </Stagger>
      </div>
    </Screen>
  );
};

/**
 * 2 — APPROVAL
 *
 * The trust moment, and the one idea the brand says to lead with if a piece of
 * creative has room for only one. Aurora appears here and nowhere else in the
 * app: it is the single thing to do next.
 */
export const ApprovalScreen: React.FC = () => {
  const frame = useCurrentFrame();

  // The pointer arrives, presses, and the button answers. No click is shown
  // landing — the viewer is meant to feel that the decision is still theirs.
  const press = interpolate(frame, [88, 94, 102], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursor = interpolate(frame, [62, 88], [52, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const cursorIn = interpolate(frame, [60, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Screen>
      <Stagger index={0}>
        <Eyebrow>Before Noah changes anything</Eyebrow>
      </Stagger>
      <Stagger index={1}>
        <Headline>Here is exactly what Noah will do.</Headline>
      </Stagger>

      <div style={{display: 'flex', flexDirection: 'column', gap: 13, marginTop: 2}}>
        <Stagger index={0} delay={2} step={4}>
          <Row
            marker="pending"
            strong
            title="Quit 4 Creative Cloud background helpers"
            detail="They restart next time you open Creative Cloud"
          />
        </Stagger>
        <Stagger index={1} delay={2} step={4}>
          <Row marker="pending" strong title="Turn off 9 login items you never open" detail="System Settings › General › Login Items" />
        </Stagger>
        <Stagger index={2} delay={2} step={4}>
          <Row marker="pending" strong title="Pause Spotlight indexing on your game folder" detail="~/Library/Application Support/Steam" />
        </Stagger>
      </div>

      <div style={{flex: 1, minHeight: 10}} />

      <Stagger index={0} delay={12}>
        <div
          style={{
            padding: '22px 26px',
            borderRadius: 12,
            border: `1px dashed ${ink.line}`,
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: 28,
            lineHeight: 1.34,
            letterSpacing: '-0.02em',
            color: ink.dim,
          }}
        >
          Noah will not delete a single file, and will not touch the game itself.
        </div>
      </Stagger>

      <Stagger index={0} delay={16}>
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 31,
            letterSpacing: '-0.025em',
            color: ink.full,
            textAlign: 'center',
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          Nothing runs until you approve. Every change is reversible.
        </div>
      </Stagger>

      <Stagger index={0} delay={20}>
        <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
          <div
            style={{
              flex: '0 0 260px',
              height: 96,
              borderRadius: 14,
              border: `2px solid ${ink.line}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: 33,
              letterSpacing: '-0.025em',
              color: ink.dim,
            }}
          >
            Not now
          </div>
          <div style={{flex: 1, position: 'relative'}}>
            <div
              style={{
                height: 96,
                borderRadius: 14,
                background: aurora,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fonts.sans,
                fontWeight: 800,
                fontSize: 37,
                letterSpacing: '-0.03em',
                color: colors.white,
                transform: `scale(${1 - press * 0.022})`,
                boxShadow: `0 10px 30px rgba(37,99,235,${0.30 + press * 0.16})`,
              }}
            >
              Approve
            </div>
            {/* macOS pointer */}
            <svg
              width="46"
              height="58"
              viewBox="0 0 46 58"
              style={{
                position: 'absolute',
                left: '52%',
                top: 44 + cursor,
                opacity: cursorIn,
                filter: 'drop-shadow(0 3px 5px rgba(4,6,16,0.42))',
              }}
            >
              <path
                d="M6 3 L6 44 L16.5 34.5 L23.5 50 L30.5 46.5 L23.5 31.5 L37 31.5 Z"
                fill="#FFFFFF"
                stroke="#2A251F"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </Stagger>
    </Screen>
  );
};

/**
 * 3 — ACTION
 *
 * Noah does the work it just described, in the order it described it, naming
 * the real process each time. A progress bar with nothing behind it is the
 * exact behaviour the brand exists to be the opposite of.
 */
const LOG = [
  '$ launchctl bootout gui/501/com.adobe.AdobeIPCBroker',
  '$ launchctl bootout gui/501/com.adobe.CCXProcess',
  '$ osascript -e \'tell application "System Events"\'',
  '$ mdutil -i off ~/Library/Application Support/Steam',
];

export const ActionScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    {
      title: 'Quit 4 Creative Cloud background helpers',
      detail: 'AdobeIPCBroker · CCLibrary · CCXProcess · CRDaemon',
      at: 4,
    },
    {title: 'Turn off 9 login items', detail: 'com.dropbox.DropboxMacUpdate · 8 more', at: 17},
    {
      title: 'Pause Spotlight indexing on your game folder',
      detail: 'mdutil -i off ~/Library/Application Support/Steam',
      at: 30,
    },
  ];

  const overall = interpolate(frame, [4, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Screen>
      <Stagger index={0}>
        <Eyebrow>Working</Eyebrow>
      </Stagger>
      <Stagger index={1}>
        <Headline>Noah is making those three changes.</Headline>
      </Stagger>

      <div style={{height: 9, borderRadius: 5, backgroundColor: ink.line, marginTop: 6}}>
        <div
          style={{
            width: `${overall * 100}%`,
            height: '100%',
            borderRadius: 5,
            background: aurora,
          }}
        />
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 13, marginTop: 6}}>
        {steps.map((s, i) => {
          const done = frame >= s.at + 12;
          const running = frame >= s.at && !done;
          return (
            <Row
              key={s.title}
              marker={done ? 'confirm' : running ? 'running' : 'pending'}
              progress={(frame - s.at) / 12}
              title={s.title}
              detail={s.detail}
              strong={i === 0}
            />
          );
        })}
      </div>

      <div style={{flex: 1, minHeight: 8}} />

      <div
        style={{
          borderRadius: 12,
          border: `1px solid ${ink.line}`,
          backgroundColor: 'rgba(42,37,31,0.045)',
          padding: '18px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {LOG.map((line, i) => (
          <div
            key={line}
            style={{
              fontFamily: fonts.mono,
              fontSize: 21,
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
              color: ink.faint,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              opacity: frame >= 8 + i * 9 ? 1 : 0,
            }}
          >
            {line}
          </div>
        ))}
      </div>
      <Mono color={ink.faint}>Every step is written to the log.</Mono>
    </Screen>
  );
};

/**
 * 4 — RESULT
 *
 * What changed, and that it can be undone. Deliberately no speed claim: the
 * honest report is the product, and an invented number would undo it.
 */
export const ResultScreen: React.FC = () => (
  <Screen>
    <Stagger index={0}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <Marker kind="confirm" />
        <Eyebrow>Done</Eyebrow>
      </div>
    </Stagger>
    <Stagger index={1}>
      <Headline>Here is what changed on your Mac.</Headline>
    </Stagger>

    <div style={{display: 'flex', flexDirection: 'column', gap: 13, marginTop: 4}}>
      <Stagger index={0} delay={8} step={5}>
        <Row marker="confirm" title="4 background helpers stopped" detail="Creative Cloud" />
      </Stagger>
      <Stagger index={1} delay={8} step={5}>
        <Row marker="confirm" title="9 login items turned off" detail="5 left on — the ones you actually use" />
      </Stagger>
      <Stagger index={2} delay={8} step={5}>
        <Row marker="confirm" title="Spotlight paused on your game folder" detail="Resumes when you tell it to" />
      </Stagger>
    </div>

    <div style={{flex: 1}} />

    <Stagger index={0} delay={20}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '22px 26px',
          borderRadius: 12,
          backgroundColor: 'rgba(13,148,136,0.10)',
          border: `1px solid rgba(13,148,136,0.28)`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: '-0.025em',
            color: colors.teal,
            flex: 1,
          }}
        >
          All three steps logged. Undo any of them any time.
        </div>
        <div
          style={{
            padding: '12px 24px',
            borderRadius: 10,
            border: `2px solid rgba(13,148,136,0.42)`,
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: '-0.02em',
            color: colors.teal,
          }}
        >
          Undo
        </div>
      </div>
    </Stagger>
  </Screen>
);
