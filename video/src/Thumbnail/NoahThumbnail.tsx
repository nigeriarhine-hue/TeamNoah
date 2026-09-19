import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { NoahPanel } from '../NoahAd/components/NoahPanel';
import { heightFor } from '../NoahAd/config/asset-sizes';
import { assets } from '../NoahAd/config/assets';
import { font, safe, theme } from '../NoahAd/theme';

export type ThumbVariant = 'A' | 'B' | 'C';

/**
 * Thumbnail copy (§47). Headlines are live HTML, so they can be re-typed here
 * without re-cutting artwork.
 *
 * The three variants test the same idea three ways: deny the assumption, deny
 * the diagnosis, or lead with the number.
 */
const COPY: Record<ThumbVariant, { head: string[]; sub: string }> = {
  A: { head: ['YOUR PC', "ISN'T OLD."], sub: 'So why does it feel like it?' },
  B: { head: ['THIS WASN’T', 'A HARDWARE', 'PROBLEM'], sub: 'It was seven programs you never approved.' },
  C: { head: ['7 PROGRAMS.', 'EVERY BOOT.'], sub: 'Nobody told you. Noah found them.' },
};

/**
 * Alternative headline set for the macOS / VS Code / Git cut of this campaign.
 * Swap COPY for this once that story's captures exist.
 */
export const VS_CODE_COPY: Record<ThumbVariant, { head: string[]; sub: string }> = {
  A: { head: ['GIT WAS', 'INSTALLED…'], sub: "VS Code said it wasn't." },
  B: { head: ['THIS WASN’T', 'A GIT PROBLEM'], sub: 'The real cause was somewhere else entirely.' },
  C: { head: ['VS CODE', 'WAS WRONG'], sub: 'Noah found what actually broke.' },
};

const TILE_W = 466;
const TILE_GAP = 22;

/**
 * 1080x1920 thumbnail. Same environment, framing and type as the film, so the
 * feed card and the video read as one piece. No human figure, no clutter (§46).
 */
export const NoahThumbnail: React.FC<{ variant?: ThumbVariant }> = ({ variant = 'A' }) => {
  const { head, sub } = COPY[variant];
  const headSize = head.length > 2 ? 104 : 122;
  const headBlock = head.length * headSize * 1.0;
  const tileH = heightFor('tile-startup', TILE_W);

  const HEAD_TOP = 424;
  const SUB_TOP = HEAD_TOP + headBlock + 40;
  const TILES_CENTRE = 1196;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: 'hidden' }}>
      <link rel="stylesheet" href={staticFile('fonts/fonts.css')} />

      {/* environment — matches GlowBackground's resting state */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(112% 62% at 50% 56%, rgba(99,102,241,0.24) 0%, rgba(8,10,17,0) 64%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(86% 46% at 50% 104%, rgba(139,92,246,0.20) 0%, rgba(8,10,17,0) 70%)',
        }}
      />

      {/* headline */}
      <div style={{ position: 'absolute', left: safe.x, right: safe.x, top: HEAD_TOP }}>
        {head.map((line, i) => (
          <div
            key={line}
            style={{
              fontFamily: font.sans,
              fontSize: headSize,
              fontWeight: 800,
              letterSpacing: '-0.048em',
              lineHeight: 1.0,
              color: i === head.length - 1 ? theme.ink : theme.inkDim,
              textShadow: '0 6px 44px rgba(0,0,0,0.7)',
            }}
          >
            {line}
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: safe.x,
          right: safe.x,
          top: SUB_TOP,
          fontFamily: font.sans,
          fontSize: 44,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: theme.mute,
          maxWidth: 850,
          lineHeight: 1.22,
        }}
      >
        {sub}
      </div>

      {/* the evidence, straight from the real screen */}
      <NoahPanel
        name="tile-startup"
        width={TILE_W}
        x={-(TILE_W / 2 + TILE_GAP / 2)}
        y={TILES_CENTRE - 960}
        tiltY={4}
        tiltX={-1.5}
        radius={20}
        glow={1}
      />
      <NoahPanel
        name="tile-background"
        width={TILE_W}
        x={TILE_W / 2 + TILE_GAP / 2}
        y={TILES_CENTRE - 960}
        tiltY={-4}
        tiltX={-1.5}
        radius={20}
        glow={1}
      />

      {/* Noah, positioned as the answer */}
      <div
        style={{
          position: 'absolute',
          left: safe.x,
          top: TILES_CENTRE + tileH / 2 + 128,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <div style={{ position: 'relative', width: 124, height: 124 }}>
          <div
            style={{
              position: 'absolute',
              left: -76,
              top: -76,
              width: 276,
              height: 276,
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(99,102,241,0.40) 0%, rgba(99,102,241,0) 68%)',
              filter: 'blur(24px)',
            }}
          />
          <Img
            src={assets.brand.logo}
            style={{ position: 'relative', width: 124, height: 124, display: 'block' }}
          />
        </div>
        <div>
          <div
            style={{
              fontFamily: font.sans,
              fontSize: 62,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: theme.ink,
              lineHeight: 1,
            }}
          >
            Noah
          </div>
          <div
            style={{
              fontFamily: font.sans,
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: '0.005em',
              color: theme.mute,
              marginTop: 10,
            }}
          >
            Describe it. Approve it. Done.
          </div>
        </div>
      </div>

      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(124% 82% at 50% 46%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.58) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
