import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { f, OVERLAP, SCENES } from './timeline';
import { Scene } from './components/primitives';
import { S01Hook, S02Question, S12Reaction, S13BackToGaming, S15End } from './scenes/CharacterScenes';
import { S03Issues } from './scenes/S03Issues';
import { CTAEndCard } from './scenes/CTAEndCard';
import { NoahFlow } from './noah/NoahFlow';
import { SoundDesign, VoiceoverTrack } from './components/Audio';

// Title: "Is Your Gaming PC Ready for the Next Big Game?"

const TRACK: { at: number; to: number; el: React.ReactNode; fadeIn?: number }[] = [
  { at: SCENES.s01Hook, to: SCENES.s02Question, el: <S01Hook />, fadeIn: 12 },
  { at: SCENES.s02Question, to: SCENES.s03Issues, el: <S02Question /> },
  { at: SCENES.s03Issues, to: SCENES.s04Tell, el: <S03Issues /> },
  // scenes 4–11: one continuous Noah window
  { at: SCENES.s04Tell, to: SCENES.s12Reaction, el: <NoahFlow /> },
  { at: SCENES.s12Reaction, to: SCENES.s13BackToGaming, el: <S12Reaction /> },
  { at: SCENES.s13BackToGaming, to: SCENES.s14CTA, el: <S13BackToGaming /> },
  { at: SCENES.s14CTA, to: SCENES.s15End, el: <CTAEndCard /> },
  { at: SCENES.s15End, to: SCENES.end, el: <S15End /> },
];

export const NoahGamingAd: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    {TRACK.map((s, i) => {
      const from = i === 0 ? 0 : f(s.at) - OVERLAP;
      const dur = f(s.to) - from + (i === TRACK.length - 1 ? 0 : OVERLAP);
      return (
        <Sequence key={i} from={from} durationInFrames={dur}>
          <Scene fadeIn={s.fadeIn ?? OVERLAP}>{s.el}</Scene>
        </Sequence>
      );
    })}
    <VoiceoverTrack />
    <SoundDesign />
  </AbsoluteFill>
);
