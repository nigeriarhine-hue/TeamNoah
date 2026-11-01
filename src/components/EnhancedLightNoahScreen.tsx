import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AURORA, C, FONT} from '../brand/theme';
import {ArrowRightIcon} from './Icons';
import {NOAH_UI} from './noahScreenData';

/**
 * Light, video-readable recreation of the genuine Noah desktop window (see noahScreenData.ts for
 * the source screenshots). Recomposed vertically for Shorts: the chat-history sidebar is dropped,
 * type is enlarged, and the chat column fills the frame. Structure, labels and controls match the
 * real app: title bar "Noah", chat column, and the "What's broken? Tell Noah and hit go." input.
 */
export const EnhancedLightNoahScreen: React.FC<{
  width?: number;
  height?: number;
  enterAt?: number;
  inputText?: string; // text currently typed in the input
  inputPlaceholder?: string;
  sendPressedAt?: number; // frame of the send click (for the press animation)
  running?: boolean; // Noah is working: input shows the stop button like the real app
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({width = 888, height = 1080, enterAt = 0, inputText = '', inputPlaceholder = NOAH_UI.inputPlaceholder, sendPressedAt, running, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - enterAt, fps, config: {damping: 200}, durationInFrames: 18});
  const press = sendPressedAt === undefined ? 0 : interpolate(frame - sendPressedAt, [0, 3, 8], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const hasText = inputText.length > 0;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 34,
        background: '#FFFFFF',
        border: `2px solid ${C.line}`,
        boxShadow: '0 4px 10px rgba(15,23,41,0.05), 0 40px 90px -30px rgba(30,27,75,0.35)',
        overflow: 'hidden',
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 120}px) scale(${0.94 + 0.06 * enter})`,
        ...style,
      }}
    >
      {/* title bar */}
      <div
        style={{
          height: 70,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px 0 34px',
          borderBottom: `2px solid ${C.line}`,
          background: '#FAFAFD',
        }}
      >
        <div style={{fontSize: 28, fontWeight: 700, color: C.ink}}>{NOAH_UI.windowTitle}</div>
        <div style={{display: 'flex', gap: 34, alignItems: 'center', color: C.mute}}>
          <div style={{width: 22, height: 2.5, background: C.mute}} />
          <div style={{width: 20, height: 20, border: `2.5px solid ${C.mute}`, borderRadius: 3}} />
          <svg width={22} height={22} viewBox="0 0 22 22">
            <path d="M3 3l16 16M19 3 3 19" stroke={C.mute} strokeWidth={2.5} strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {/* chat column */}
      <div style={{flex: 1, position: 'relative', overflow: 'hidden', background: '#F7F8FC'}}>{children}</div>
      {/* input bar */}
      <div style={{padding: '18px 26px 24px', background: '#F7F8FC', flexShrink: 0}}>
        <div
          style={{
            height: 100,
            borderRadius: 26,
            border: `2px solid ${hasText ? 'rgba(79,70,229,0.45)' : C.line2}`,
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px 0 30px',
            gap: 16,
            boxShadow: hasText ? '0 0 0 6px rgba(79,70,229,0.08)' : 'none',
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: 29,
              lineHeight: 1.25,
              color: hasText ? C.ink : C.mute,
              fontWeight: hasText ? 600 : 500,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {hasText ? inputText : inputPlaceholder}
            {hasText && Math.floor(frame / 8) % 2 === 0 ? <span style={{color: C.indigo}}>|</span> : null}
          </div>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: running ? 'rgba(220,38,38,0.10)' : hasText ? AURORA : C.page3,
              transform: `scale(${1 - press * 0.12})`,
            }}
          >
            {running ? (
              <div style={{width: 20, height: 20, borderRadius: 4, background: '#E5484D'}} />
            ) : (
              <ArrowRightIcon size={36} color={hasText ? '#fff' : C.mute} stroke={2.6} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Small "— LABEL" section header used inside Noah result cards (matches the real UI).
export const NoahLabel: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) => (
  <div
    style={{
      fontSize: 23,
      fontWeight: 800,
      letterSpacing: '0.14em',
      color: C.mute,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      ...style,
    }}
  >
    <span style={{width: 22, height: 3, background: C.line2}} />
    {text}
  </div>
);

// Thin aurora progress line across the top of a Noah work card (real UI detail).
export const NoahTopLine: React.FC<{progress?: number; done?: boolean}> = ({progress = 1, done}) => (
  <div style={{height: 5, background: C.page3}}>
    <div style={{height: '100%', width: `${progress * 100}%`, background: done ? C.success : AURORA}} />
  </div>
);
