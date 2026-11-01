import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT, SHADOW} from '../brand/theme';
import {RestartIcon, ReturnIcon, CheckIcon} from './Icons';

type IconC = React.FC<{size?: number; color?: string; style?: React.CSSProperties; stroke?: number}>;

/**
 * A single educational card.
 * - variant "helps": icon + title, then the outcome chip resolves to green ("stopped / restarted").
 * - variant "returns": icon + title, a restart sweep removes the icon, then it pops BACK with an
 *   amber "comes back" chip — the visual for "a restart doesn't necessarily fix this".
 */
export const TechExplainerCard: React.FC<{
  icon: IconC;
  title: string;
  outcome: string;
  at: number; // reveal frame (relative)
  variant: 'helps' | 'returns';
  dark?: boolean;
  layout?: 'row' | 'tile';
  style?: React.CSSProperties;
}> = ({icon: Icon, title, outcome, at, variant, dark = false, layout = 'row', style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - at;
  const enter = spring({frame: f, fps, config: {damping: 18, mass: 0.7}, durationInFrames: 18});
  const outcomeP = interpolate(f, [12, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  // "returns" choreography: icon present → restart sweep (icon gone) → icon reappears
  const sweep = interpolate(f, [8, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const iconGone = variant === 'returns' ? interpolate(f, [8, 13, 22, 28], [1, 0, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const backPop = variant === 'returns' ? spring({frame: f - 22, fps, config: {damping: 9, mass: 0.5}, durationInFrames: 16}) : 0;
  const showSpinner = variant === 'returns' && f >= 9 && f < 25;

  const accent = variant === 'helps' ? C.success : C.amber;
  const accentSoft = variant === 'helps' ? C.successSoft : 'rgba(217,119,6,0.16)';
  const cardBg = dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF';
  const border = dark ? 'rgba(255,255,255,0.12)' : C.line;
  const titleColor = dark ? '#FFFFFF' : C.ink;
  const iconBg = dark ? 'rgba(141,178,255,0.12)' : C.blueSoft;
  const iconColor = dark ? C.blueLight : C.blue;
  const tile = layout === 'tile';
  const outcomeDelay = variant === 'returns' ? 24 : 12;
  const oP = interpolate(f, [outcomeDelay, outcomeDelay + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  return (
    <div
      style={{
        fontFamily: FONT,
        background: cardBg,
        border: `2px solid ${border}`,
        borderRadius: 30,
        boxShadow: dark ? '0 20px 50px -24px rgba(0,0,0,0.6)' : SHADOW,
        padding: tile ? '30px 28px 30px' : '28px 32px',
        display: 'flex',
        flexDirection: tile ? 'column' : 'row',
        alignItems: tile ? 'flex-start' : 'center',
        gap: tile ? 18 : 30,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 40}px) scale(${0.96 + 0.04 * enter})`,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* restart sweep line */}
      {variant === 'returns' && sweep > 0 && sweep < 1 ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sweep * 120 - 20}%`,
            width: '22%',
            background: dark
              ? 'linear-gradient(90deg, transparent, rgba(141,178,255,0.18), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(79,70,229,0.12), transparent)',
          }}
        />
      ) : null}
      <div
        style={{
          width: tile ? 96 : 110,
          height: tile ? 96 : 110,
          borderRadius: 26,
          background: variant === 'returns' && backPop > 0.05 ? accentSoft : iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          boxShadow: variant === 'returns' && backPop > 0.05 ? `0 0 0 ${6 * backPop}px ${accentSoft}` : 'none',
        }}
      >
        <div style={{opacity: iconGone, transform: `scale(${variant === 'returns' ? 0.6 + 0.4 * Math.max(iconGone, backPop) : 1})`}}>
          <Icon size={tile ? 58 : 64} color={variant === 'returns' && backPop > 0.05 ? accent : iconColor} stroke={2} />
        </div>
        {showSpinner ? (
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <RestartIcon size={54} color={dark ? C.violetLight : C.violet} style={{transform: `rotate(${(f - 9) * 24}deg)`}} />
          </div>
        ) : null}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0}}>
        <div style={{fontSize: tile ? 38 : 46, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, color: titleColor}}>{title}</div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            alignSelf: 'flex-start',
            fontSize: tile ? 30 : 34,
            fontWeight: 700,
            color: accent,
            background: accentSoft,
            borderRadius: 999,
            padding: '6px 18px 7px 12px',
            opacity: variant === 'helps' ? outcomeP : oP,
            transform: `translateX(${(1 - (variant === 'helps' ? outcomeP : oP)) * -16}px)`,
          }}
        >
          {variant === 'helps' ? <CheckIcon size={30} color={accent} stroke={3} /> : <ReturnIcon size={30} color={accent} stroke={2.6} />}
          {outcome}
        </div>
      </div>
    </div>
  );
};
