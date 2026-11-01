import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {AURORA, C, FONT} from '../brand/theme';
import {loadBrandFonts} from '../brand/fonts';
import {ArrowRightIcon, CheckIcon, RestartIcon, ReturnIcon, SlowIcon} from '../components/Icons';

loadBrandFonts();

const grad: React.CSSProperties = {
  backgroundImage: AURORA,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

// "PC SLOW → RESTART → SLOW AGAIN" chip row: the recurring-loop idea at thumbnail scale.
const LoopChips: React.FC<{scale?: number}> = ({scale = 1}) => {
  const chip = (label: string, color: string, bg: string, Icon: React.FC<{size?: number; color?: string; stroke?: number}>) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10 * scale,
        background: '#fff',
        border: `${3 * scale}px solid ${color}`,
        borderRadius: 999,
        padding: `${10 * scale}px ${20 * scale}px ${10 * scale}px ${12 * scale}px`,
        fontSize: 30 * scale,
        fontWeight: 800,
        color: C.ink,
        boxShadow: '0 10px 24px -12px rgba(0,0,0,0.35)',
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{width: 44 * scale, height: 44 * scale, borderRadius: 22 * scale, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon size={30 * scale} color={color} stroke={2.6} />
      </div>
      {label}
    </div>
  );
  const arrow = <ArrowRightIcon size={36 * scale} color={C.mute} stroke={3} />;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12 * scale}}>
      {chip('SLOW', C.amber, C.amberSoft, SlowIcon)}
      {arrow}
      {chip('RESTART', C.indigo, 'rgba(79,70,229,0.12)', RestartIcon)}
      {arrow}
      {chip('SLOW AGAIN', C.amber, C.amberSoft, ReturnIcon)}
    </div>
  );
};

const BigRestart: React.FC<{size: number}> = ({size}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 30px 60px -20px rgba(79,70,229,0.75)',
      transform: 'rotate(-8deg)',
    }}
  >
    <RestartIcon size={size * 0.64} color="#fff" stroke={2.6} />
  </div>
);

const SmallMark: React.FC<{size: number}> = ({size}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.3, opacity: 0.85}}>
    <Img src={staticFile('brand/noah-mark-light.svg')} style={{width: size, height: size}} />
    <span style={{fontFamily: FONT, fontWeight: 700, fontSize: size * 0.5, color: C.ink2}}>Noah</span>
  </div>
);

// 1080x1920 Shorts thumbnail
export const RestartThumbnail: React.FC = () => (
  <AbsoluteFill style={{background: C.page, fontFamily: FONT, overflow: 'hidden'}}>
    {/* host photo (character reference) in the lower half */}
    <Img
      src={staticFile('characters/tech-host-ethan-reference.png')}
      style={{position: 'absolute', left: -40, top: 700, width: 1160, height: 2072, objectFit: 'cover', objectPosition: '50% 0%'}}
    />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${C.page} 0%, ${C.page} 36%, rgba(244,245,249,0.0) 52%, rgba(244,245,249,0) 80%, rgba(11,16,36,0.55) 100%)`,
      }}
    />
    <div style={{position: 'absolute', left: 80, right: 80, top: 150}}>
      <div style={{fontSize: 156, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.92, color: C.ink}}>RESTARTING</div>
      <div style={{fontSize: 156, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.98, ...grad}}>YOUR PC?</div>
      <div style={{marginTop: 34, fontSize: 64, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, color: C.ink}}>
        HERE’S WHAT
        <br />
        IT ACTUALLY FIXES
      </div>
      <div style={{marginTop: 18, fontSize: 44, fontWeight: 700, color: C.mute, letterSpacing: '-0.01em'}}>AND WHAT IT DOESN’T</div>
    </div>
    <div style={{position: 'absolute', right: 70, top: 640}}>
      <BigRestart size={230} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 300, display: 'flex', justifyContent: 'center'}}>
      <LoopChips scale={1.15} />
    </div>
    {/* fixes / doesn't chips */}
    <div style={{position: 'absolute', left: 70, bottom: 470, display: 'flex', flexDirection: 'column', gap: 16}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 999, padding: '12px 26px 12px 14px', fontSize: 36, fontWeight: 800, color: C.success, boxShadow: '0 10px 24px -12px rgba(0,0,0,0.35)'}}>
        <CheckIcon size={40} color={C.success} stroke={3.2} /> FIXES SOME THINGS
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 999, padding: '12px 26px 12px 14px', fontSize: 36, fontWeight: 800, color: C.amber, boxShadow: '0 10px 24px -12px rgba(0,0,0,0.35)'}}>
        <ReturnIcon size={40} color={C.amber} stroke={2.8} /> NOT EVERYTHING
      </div>
    </div>
    <div style={{position: 'absolute', left: 80, bottom: 120}}>
      <div style={{background: 'rgba(255,255,255,0.9)', borderRadius: 999, padding: '10px 22px 10px 12px'}}>
        <SmallMark size={48} />
      </div>
    </div>
  </AbsoluteFill>
);

// 1280x720 standard YouTube thumbnail
export const RestartThumbnail16x9: React.FC = () => (
  <AbsoluteFill style={{background: C.page, fontFamily: FONT, overflow: 'hidden'}}>
    <AbsoluteFill
      style={{
        backgroundImage:
          'radial-gradient(circle at 15% 15%, rgba(99,102,241,0.12), transparent 45%), radial-gradient(circle at 80% 90%, rgba(139,92,246,0.12), transparent 50%)',
      }}
    />
    <Img
      src={staticFile('characters/tech-host-ethan-reference.png')}
      style={{position: 'absolute', left: 600, top: -60, width: 720, height: 1000, objectFit: 'cover', objectPosition: '50% 0%'}}
    />
    <AbsoluteFill style={{background: `linear-gradient(90deg, ${C.page} 0%, ${C.page} 50%, rgba(244,245,249,0) 68%)`}} />
    <div style={{position: 'absolute', left: 64, top: 70, width: 760}}>
      <div style={{fontSize: 104, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.95, color: C.ink}}>RESTARTING</div>
      <div style={{fontSize: 104, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.0, ...grad}}>YOUR PC?</div>
      <div style={{marginTop: 26, fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink, lineHeight: 1.15}}>
        WHAT IT FIXES — <span style={{color: C.amber}}>AND WHAT IT DOESN’T</span>
      </div>
      <div style={{marginTop: 40}}>
        <LoopChips scale={0.84} />
      </div>
    </div>
    <div style={{position: 'absolute', left: 1090, top: 500}}>
      <BigRestart size={140} />
    </div>
    <div style={{position: 'absolute', left: 64, bottom: 36}}>
      <SmallMark size={40} />
    </div>
  </AbsoluteFill>
);
