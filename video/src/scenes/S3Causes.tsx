import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {c, ink, font} from '../theme';
import {useStage, rise} from '../stage';
import {Headline, Kicker, Mono, Card} from '../components/ui';

type Cause = {n: string; title: string; body: string; evidence: string};

/** Named causes, not categories. "Stale pre-Tahoe preferences" beats "some issues". */
const CAUSES: Cause[] = [
  {
    n: '01',
    title: 'Heat, at about the eight-minute mark',
    body:
      'The chassis reaches its limit and the chips step down to stay there. The first ten minutes are always the good ten minutes.',
    evidence: 'kernel_task climbing · clocks capped',
  },
  {
    n: '02',
    title: 'Something else is using the GPU',
    body:
      'A backup that started on its own. A photo library still being analysed. A browser left open behind the game.',
    evidence: 'backupd · photoanalysisd · WebKit GPU',
  },
  {
    n: '03',
    title: 'The game is running through Rosetta',
    body:
      'An Intel build, translated as it runs on Apple silicon, when a native version of the same game is sitting right there.',
    evidence: 'Get Info → Kind: Application (Intel)',
  },
  {
    n: '04',
    title: 'It is drawing more pixels than the screen shows',
    body:
      'Full Retina resolution with Game Mode off, so the game queues behind everything else for the GPU.',
    evidence: 'Displays: 3456 × 2234 · Game Mode: Off',
  },
];

const CauseCard: React.FC<{cause: Cause; u: number; appear: React.CSSProperties}> = ({
  cause,
  u,
  appear,
}) => (
  <div style={appear}>
    <Card u={u} style={{height: '100%', display: 'flex', flexDirection: 'column', gap: 12 * u}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 14 * u}}>
        <Mono u={u} size={20} color={c.litHorizon}>
          {cause.n}
        </Mono>
        <h3
          style={{
            fontFamily: font.display,
            fontWeight: 700,
            fontSize: 31 * u,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: ink.primary,
            margin: 0,
          }}
        >
          {cause.title}
        </h3>
      </div>
      <p
        style={{
          fontFamily: font.body,
          fontSize: 23 * u,
          lineHeight: 1.45,
          color: ink.secondary,
          margin: 0,
          flex: 1,
        }}
      >
        {cause.body}
      </p>
      <div
        style={{
          borderTop: `1px solid ${ink.hairline}`,
          paddingTop: 12 * u,
        }}
      >
        <Mono u={u} size={19} color={ink.muted}>
          {cause.evidence}
        </Mono>
      </div>
    </Card>
  </div>
);

export const S3Causes: React.FC = () => {
  const f = useCurrentFrame();
  const {u, pad, tall} = useStage();

  return (
    <AbsoluteFill
      style={{
        background: c.night,
        padding: pad,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 38 * u,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: 16 * u}}>
        <div style={rise(f, 0)}>
          <Kicker u={u}>What actually causes it</Kicker>
        </div>
        <div style={rise(f, 8)}>
          <Headline u={u} size={tall ? 72 : 80} maxWidth={tall ? '100%' : '80%'}>
            Four things cause it. Only one of them is the game.
          </Headline>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: tall ? '1fr' : '1fr 1fr',
          gap: tall ? 20 * u : 26 * u,
        }}
      >
        {CAUSES.map((cause, i) => (
          <CauseCard
            key={cause.n}
            cause={cause}
            u={u}
            appear={rise(f, 34 + i * 46, {distance: 16, duration: 26})}
          />
        ))}
      </div>

      {/* amber means caution, and it never travels without the words */}
      <div
        style={{
          ...rise(f, 250),
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16 * u,
          borderLeft: `3px solid ${c.amber}`,
          paddingLeft: 20 * u,
        }}
      >
        <p
          style={{
            fontFamily: font.body,
            fontSize: 25 * u,
            lineHeight: 1.4,
            color: ink.secondary,
            margin: 0,
          }}
        >
          <strong style={{color: c.amber, fontWeight: 700}}>Caution &mdash;</strong>{' '}
          <strong style={{color: ink.primary, fontWeight: 600}}>
            below about 10% free disk, all four get worse.
          </strong>{' '}
          macOS starts swapping to disk mid-frame, and a swap-in is a dropped frame.
        </p>
      </div>
    </AbsoluteFill>
  );
};
