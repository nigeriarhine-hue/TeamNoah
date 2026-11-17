import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import timing from '../../public/vo/gamer-test/timing.json';
import {GamerRoom, GamerToon} from '../components/GamerToon';
import {Caption, clamp, NoahMark, useSpring} from '../components/ui';
import {C, SANS} from '../theme';

// Lip-sync test: original illustrated character says "On noah dot app." (Piper Joe, CC0).

export const GAMER_TEST_FRAMES = 120;
const L = timing.lines[0];

export const GamerLipsyncTest: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useSpring(L.endFrame + 2, {damping: 12, stiffness: 190, mass: 0.6});
  const zoom = interpolate(frame, [0, GAMER_TEST_FRAMES], [1, 1.04], clamp);
  return (
    <AbsoluteFill style={{background: '#1A1438'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 40%'}}>
        <GamerRoom />
        <div style={{position: 'absolute', left: 90, top: 330}}>
          {/* syllables found in the voice: on · noah · dot · app  →  O  O  O  A (lips close on the final p) */}
          <GamerToon mouth={timing.mouth} visemes={['O', 'O', 'O', 'A']} size={1150} smileAfter={L.endFrame + 4} browAt={[L.startFrame + 2]} />
        </div>
      </AbsoluteFill>
      {frame >= L.startFrame && frame < L.endFrame + 10 && (
        <div style={{position: 'absolute', left: 60, right: 160, top: 1380}}>
          <Caption text="On noah dot app." from={L.startFrame} emphasis={['noah', 'app.']} size={64} />
        </div>
      )}
      {frame >= L.endFrame + 2 && (
        <div style={{position: 'absolute', left: 60, right: 160, top: 1370, display: 'flex', justifyContent: 'center', opacity: card, transform: `scale(${0.7 + 0.3 * card})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'white', borderRadius: 999, padding: '14px 32px 14px 18px', boxShadow: '0 20px 50px -16px rgba(0,0,0,.6)'}}>
            <NoahMark size={64} />
            <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 60, color: C.ink, letterSpacing: -1}}>onnoah.app</span>
          </div>
        </div>
      )}
      <Audio src={staticFile('vo/gamer-test/vo.wav')} />
    </AbsoluteFill>
  );
};
