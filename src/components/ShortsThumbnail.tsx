import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { color, font } from '../theme';
import { UI_ASPECT } from './NoahScreen';
import hotspots from '../ui-hotspots.json';

/**
 * A purpose-built 1080x1920 cover — not a lifted frame. The real approval
 * modal sits under the claim as the proof, and the three words the video
 * turns on are the three words picked out.
 *
 * Aurora stays off this card except where it already lives: on Noah's own
 * primary button inside the screenshot. The gradient means "the one thing to
 * do next"; using it as decoration would empty it out.
 */
export const ShortsThumbnail: React.FC = () => {
  const modal = hotspots['s03.modal'];

  const MODAL_W = 0.88; // fraction of the card's width
  const MODAL_CY = 1178; // where the modal's centre sits
  const imgW = (1080 * MODAL_W) / modal.w;
  const imgH = imgW / UI_ASPECT;
  const left = 540 - imgW * (modal.x + modal.w / 2);
  const top = MODAL_CY - imgH * (modal.y + modal.h / 2);

  const Accent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span style={{ color: color.litHorizon }}>{children}</span>
  );

  return (
    <AbsoluteFill style={{ background: color.night, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(90% 38% at 50% 20%, rgba(99,102,241,.28) 0%, rgba(11,16,36,0) 74%)',
        }}
      />

      {/* the product, doing the arguing */}
      <Img
        src={staticFile('noah-ui/mac-ai-tech-support/noah-ai-tech-support-03-approval.png')}
        style={{ position: 'absolute', width: imgW, height: imgH, left, top }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(11,16,36,.96) 0%, rgba(11,16,36,.88) 34%, rgba(11,16,36,.34) 47%, rgba(11,16,36,.08) 56%, rgba(11,16,36,.30) 70%, rgba(11,16,36,.94) 80%, rgba(11,16,36,.99) 100%)',
        }}
      />

      {/* mark */}
      <Img
        src={staticFile('brand/noah-mark-dark.png')}
        style={{ position: 'absolute', left: 540 - 46, top: 214, width: 92, height: 92, opacity: 0.95 }}
      />

      {/* the claim */}
      <div
        style={{
          position: 'absolute',
          left: 56,
          width: 1080 - 112,
          top: 360,
          textAlign: 'center',
          fontFamily: font.sans,
          fontWeight: 800,
          fontSize: 106,
          lineHeight: 0.99,
          letterSpacing: '-0.045em',
          color: '#FFFFFF',
          textShadow: '0 6px 46px rgba(0,0,0,.62)',
        }}
      >
        AI TECH
        <br />
        SUPPORT
        <br />
        FOR YOUR MAC?
      </div>

      {/* what the proof underneath is showing */}
      <div
        style={{
          position: 'absolute',
          left: 64,
          width: 1080 - 128,
          top: 1440,
          textAlign: 'center',
          fontFamily: font.sans,
          fontWeight: 800,
          fontSize: 70,
          lineHeight: 1.14,
          letterSpacing: '-0.038em',
          color: 'rgba(255,255,255,.58)',
          textShadow: '0 4px 34px rgba(0,0,0,.85)',
        }}
      >
        IT ACTUALLY <Accent>CHECKS</Accent>
        <br />
        AND <Accent>FIXES</Accent> —
        <br />
        WITH <Accent>YOUR APPROVAL.</Accent>
      </div>
    </AbsoluteFill>
  );
};
