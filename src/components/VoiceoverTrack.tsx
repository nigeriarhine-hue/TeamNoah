import React from 'react';
import { Audio, staticFile } from 'remotion';
import assets from '../assets.json';

export const VO_FILE = 'audio/ai-tech-support-young-american-male.wav';
export const SFX_FILE = 'audio/sfx/sound-design.wav';

/**
 * The master voiceover plus the sound design under it. The voice is the
 * primary audio; the design bed is pre-mixed and sits far beneath it.
 */
export const VoiceoverTrack: React.FC = () => (
  <>
    {assets.voiceover ? <Audio src={staticFile(VO_FILE)} volume={1} /> : null}
    {assets.sfx ? <Audio src={staticFile(SFX_FILE)} volume={1} /> : null}
  </>
);
