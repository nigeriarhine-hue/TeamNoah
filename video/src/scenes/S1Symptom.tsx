import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {c, ink, font} from '../theme';
import {useStage, rise} from '../stage';
import {NoahLockup} from '../components/NoahMark';
import {Kicker, Headline, Lede} from '../components/ui';

export const S1Symptom: React.FC = () => {
  const f = useCurrentFrame();
  const {u, pad, tall} = useStage();

  return (
    <AbsoluteFill style={{background: c.night, padding: pad, display: 'flex', flexDirection: 'column'}}>
      <div style={rise(f, 0, {distance: 10, duration: 26})}>
        <NoahLockup size={46 * u} u={u} dark />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: tall ? 'column' : 'row',
          alignItems: tall ? 'flex-start' : 'center',
          justifyContent: 'center',
          gap: tall ? 46 * u : 84 * u,
        }}
      >
        <div style={{flex: tall ? undefined : 1.25, display: 'flex', flexDirection: 'column', gap: 26 * u}}>
          <div style={rise(f, 12)}>
            <Kicker u={u}>Fix guide · macOS</Kicker>
          </div>
          <div style={rise(f, 22)}>
            <Headline u={u} size={tall ? 90 : 96}>
              Your games run fine. Then they don&rsquo;t.
            </Headline>
          </div>
          <div style={rise(f, 38)}>
            <Lede u={u} size={33}>
              The frame rate sags. The camera swings a beat behind the mouse. And it gets worse the
              longer you play.
            </Lede>
          </div>
        </div>

        {/* the user's own words, untranslated — that is the whole intake */}
        <div
          style={{
            ...rise(f, 58),
            flex: tall ? undefined : 0.85,
            borderLeft: `2px solid ${c.litHorizon}`,
            paddingLeft: 26 * u,
          }}
        >
          <p
            style={{
              fontFamily: font.body,
              fontSize: 31 * u,
              lineHeight: 1.4,
              color: ink.primary,
              margin: 0,
            }}
          >
            &ldquo;it&rsquo;s smooth for ten minutes, then it starts hitching&rdquo;
          </p>
          <p
            style={{
              fontFamily: font.body,
              fontSize: 22 * u,
              lineHeight: 1.45,
              color: ink.muted,
              margin: `${14 * u}px 0 0`,
            }}
          >
            A complete, valid bug report. Noah takes it in those words &mdash; no Terminal, no
            translation into anyone else&rsquo;s vocabulary.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
