/**
 * Audio bed and SFX.
 *
 * Set a value to the file's path under `public/` to switch that layer on; set
 * it to `null` to leave it out. The creator's voice comes from the talking clip
 * itself and is always the loudest thing in the mix — everything here sits
 * under it.
 */
export const AUDIO: {
  /** Continuous bed under the whole ad. */
  music: string | null;
  /** Dropped-frame texture on the opening title. */
  glitch: string | null;
  /** The moment the pointer presses Approve. */
  click: string | null;
  /** Noah finishing, on the result screen. */
  complete: string | null;
} = {
  music: 'audio/bed.mp3',
  glitch: 'audio/glitch.mp3',
  click: 'audio/click.mp3',
  complete: 'audio/complete.mp3',
};
