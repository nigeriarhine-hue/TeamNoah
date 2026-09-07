import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { BLOCKS } from '../script';
import { C, MONO, SCENE_FRAMES, WATERLINE_Y } from '../theme';

const PITCH = 13;
const CARD_H = 10;
const CARD_W = 210;
const RIGHT = 130;
const LIMIT = 22; // the load limit: past this the machine is carrying too much
const BASE_GAP = 14; // keep the bottom card clear of the load line itself

/** Deterministic jitter so the stack looks handled, not machine-stacked. */
const jitter = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 7;

/**
 * The through-line. One pile of identical grey cards, each stamped with a
 * vague phrase, growing across the build and collapsing to a single named
 * card in the payoff. Counts come from the validated script.
 */
export const CardStack: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(BLOCKS.length - 1, Math.floor(frame / SCENE_FRAMES));
  const local = frame - idx * SCENE_FRAMES;

  const from = idx === 0 ? 0 : BLOCKS[idx - 1].cards;
  const to = BLOCKS[idx].cards;
  // Settle inside the first third of the block, then hold.
  const count = interpolate(local, [0, SCENE_FRAMES * 0.34], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const whole = Math.floor(count);
  const over = whole > LIMIT;
  const resolved = BLOCKS[idx].role === 'payoff';
  const limitColor = resolved ? C.commit : over ? C.amber : C.line;

  return (
    <>
      {/* the load limit — amber while the pile is over it, teal once it isn't */}
      <div
        style={{
          position: 'absolute',
          right: RIGHT - 26,
          width: CARD_W + 52,
          top: WATERLINE_Y - BASE_GAP - LIMIT * PITCH,
          height: 2,
          backgroundColor: limitColor,
          opacity: resolved || over ? 1 : whole > LIMIT - 7 ? 0.5 : 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          // sits to the LEFT of the pile: printed over the cards it is unreadable
          right: RIGHT + CARD_W + 30,
          top: WATERLINE_Y - BASE_GAP - LIMIT * PITCH - 25,
          fontFamily: MONO,
          fontSize: 15,
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
          textAlign: 'right',
          color: limitColor,
          opacity: over || resolved ? 1 : 0,
        }}
      >
        {resolved ? 'WITHIN LIMIT' : 'OVER LIMIT'}
      </div>

      {Array.from({ length: whole }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            right: RIGHT + jitter(i),
            top: WATERLINE_Y - BASE_GAP - (i + 1) * PITCH,
            height: CARD_H,
            width: CARD_W,
            backgroundColor: i >= LIMIT ? '#CDBFA6' : '#D3CCBD',
            borderRadius: 2,
          }}
        />
      ))}
    </>
  );
};
