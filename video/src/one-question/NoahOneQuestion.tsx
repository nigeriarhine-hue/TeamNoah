import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { BrandFonts } from '../fonts';
import { AuroraBackground, Captions, SeriesTag, fadeIn } from './parts';
import { ApprovalScene, ChatScene, CheckedLabel, CloserScene, DiagnosisScene, DoneScene, HookScene, NoGuessSticker, keystrokeTimes } from './scenes';
import { DURATION_S, FPS, SFX, T, VO, f } from './timeline';

const MUSIC_BASE = 0.16;

export const NoahOneQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const keys = keystrokeTimes();
  // Music sits under the voice; it lifts slightly on the CTA tail.
  const music = (fr: number) =>
    interpolate(fr, [0, f(T.cta + 1), f(DURATION_S - 0.8), f(DURATION_S)], [MUSIC_BASE, MUSIC_BASE, MUSIC_BASE * 1.2, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  const tagOpacity = 1 - fadeIn(frame, T.cta - 0.2, 0.3);

  return (
    <AbsoluteFill style={{ background: '#070A18' }}>
      <BrandFonts />
      <AuroraBackground />
      <ChatScene />
      <NoGuessSticker />
      <CheckedLabel />
      <DiagnosisScene />
      <ApprovalScene />
      <DoneScene />
      {/* creator footage is only mounted while it is on screen */}
      {frame < f(T.hookEnd + 0.3) ? <HookScene /> : null}
      {frame >= f(T.closer) ? <CloserScene /> : null}
      <SeriesTag opacity={tagOpacity} />
      <Captions />

      <Audio src={staticFile('audio/music-bed.wav')} volume={music} />
      {VO.map((v) => (
        <Sequence key={v.src} from={f(v.at)}>
          <Audio src={staticFile(v.src)} volume={1} />
        </Sequence>
      ))}
      {SFX.map((s, i) => (
        <Sequence key={`${s.src}-${i}`} from={f(s.at)}>
          <Audio src={staticFile(s.src)} volume={s.volume ?? 0.6} />
        </Sequence>
      ))}
      {keys.map((at, i) => (
        <Sequence key={`key-${i}`} from={Math.round(at * FPS)}>
          <Audio src={staticFile(`audio/sfx-key-${(i % 3) + 1}.wav`)} volume={0.45} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
