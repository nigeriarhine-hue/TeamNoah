import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { BrandFonts } from '../fonts';
import { accentGradient, colors, fonts } from '../theme';
import { AccentText, AuroraBackground, SeriesTag } from './parts';
import { QUESTION } from './scenes';

// Designed as its own layout (not a video frame): headline → the one question →
// Noah's real diagnosis → the creator.
const CARD = { left: 50, top: 560, width: 980 };
// diagnosis.png region: Situation + What Noah checked (2x px)
const REGION = { y0: 160, y1: 826 };
const CARD_SCALE = CARD.width / 1546;

export const NoahOneQuestionThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: colors.bgDeep }}>
    <BrandFonts />
    <AuroraBackground />
    {/* creator: same recurring character, faded up into the background */}
    <AbsoluteFill style={{ WebkitMaskImage: 'linear-gradient(180deg, transparent 51%, #000 60%)' }}>
      <Img
        src={staticFile('footage/creator-still.jpg')}
        style={{ position: 'absolute', left: -338, top: 440, width: 1420, height: 2511, objectFit: 'cover' }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, transparent 70%, rgba(7,10,24,0.75) 100%)' }} />
    </AbsoluteFill>

    <SeriesTag />
    <div
      style={{
        position: 'absolute',
        top: 176,
        left: 0,
        right: 0,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        fontFamily: fonts.sans,
        fontWeight: 800,
        letterSpacing: -3,
        lineHeight: 1.0,
        color: colors.text,
        textShadow: '0 8px 40px rgba(7,10,24,0.6)',
      }}
    >
      <div style={{ fontSize: 104 }}>I ASKED MY PC</div>
      <div style={{ fontSize: 104 }}>
        <AccentText>ONE QUESTION...</AccentText>
      </div>
    </div>

    {/* the question, in the app's own bubble style */}
    <div
      style={{
        position: 'absolute',
        top: 420,
        right: 58,
        padding: '24px 38px',
        borderRadius: 30,
        background: colors.appBubble,
        color: colors.appText,
        fontFamily: fonts.ui,
        fontWeight: 500,
        fontSize: 50,
        boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 0 2px rgba(199,203,255,0.18)',
      }}
    >
      {QUESTION}
    </div>

    {/* Noah's real diagnosis */}
    <div
      style={{
        position: 'absolute',
        left: CARD.left,
        top: CARD.top,
        width: CARD.width,
        height: (REGION.y1 - REGION.y0) * CARD_SCALE,
        borderRadius: 30,
        overflow: 'hidden',
        background: colors.appBg,
        border: '2px solid rgba(139,143,248,0.55)',
        boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 90px rgba(99,102,241,0.35)',
      }}
    >
      <Img
        src={staticFile('ui/diagnosis.png')}
        style={{ position: 'absolute', left: 0, top: -REGION.y0 * CARD_SCALE, width: 1546 * CARD_SCALE }}
      />
    </div>

    <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          padding: '22px 44px 26px',
          borderRadius: 999,
          background: accentGradient,
          fontFamily: fonts.sans,
          fontWeight: 800,
          fontSize: 66,
          letterSpacing: -1,
          color: '#fff',
          boxShadow: '0 20px 60px rgba(99,102,241,0.5)',
        }}
      >
        Noah checked the rest.
      </div>
    </div>
  </AbsoluteFill>
);
