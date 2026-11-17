import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Mascot, MascotExpression, MascotPose} from '../components/Mascot';
import {NoahMark} from '../components/ui';
import {AURORA, C, SANS, SERIF} from '../theme';

// Character sheet for the Noah mascot (concept v1). Render: npm run sheet:mascot

const EXPRESSIONS: {e: MascotExpression; label: string; note: string; look?: number}[] = [
  {e: 'calm', label: 'Calm', note: 'default'},
  {e: 'curious', label: 'Curious', note: 'checking', look: 0.8},
  {e: 'found', label: 'Found it', note: 'names the cause'},
  {e: 'waiting', label: 'Waiting', note: 'for your approval', look: 0.6},
  {e: 'relieved', label: 'Relieved', note: 'done, unblocked'},
];

const POSES: {p: MascotPose; e: MascotExpression; label: string; card?: string}[] = [
  {p: 'point', e: 'found', label: 'Points to the cause'},
  {p: 'holdCard', e: 'waiting', label: 'Shows the plan first', card: 'The plan'},
  {p: 'thumbsUp', e: 'relieved', label: 'After you approve'},
  {p: 'wave', e: 'calm', label: 'Hello / bye'},
];

export const MascotSheet: React.FC = () => (
  <AbsoluteFill style={{background: C.page, fontFamily: SANS, padding: '56px 70px'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
      <NoahMark size={56} />
      <span style={{fontSize: 44, fontWeight: 800, color: C.ink, letterSpacing: -1}}>Noah mascot</span>
      <span style={{fontSize: 26, fontWeight: 700, color: 'white', backgroundImage: AURORA, borderRadius: 999, padding: '6px 16px'}}>concept v1 · name TBD</span>
      <span style={{flex: 1}} />
      <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 34, color: C.ink2}}>A competent friend who already looked at the problem.</span>
    </div>

    <div style={{display: 'flex', gap: 40, marginTop: 34}}>
      {/* hero */}
      <div style={{width: 470, borderRadius: 36, background: 'white', border: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0 20px'}}>
        <Mascot size={460} expression="calm" />
        <div style={{fontSize: 24, fontWeight: 700, color: C.mute, marginTop: 8, textAlign: 'center', padding: '0 30px'}}>Sky above · tide below · the line stays level</div>
      </div>

      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 26}}>
        {/* expressions */}
        <div style={{borderRadius: 30, background: 'white', border: `1px solid ${C.line}`, padding: '20px 26px'}}>
          <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.mute}}>EXPRESSIONS</div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 6}}>
            {EXPRESSIONS.map((x) => (
              <div key={x.e} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Mascot size={190} expression={x.e} look={x.look ?? 0} />
                <div style={{fontSize: 26, fontWeight: 800, color: C.ink}}>{x.label}</div>
                <div style={{fontSize: 20, fontWeight: 600, color: C.mute}}>{x.note}</div>
              </div>
            ))}
          </div>
        </div>
        {/* poses */}
        <div style={{borderRadius: 30, background: 'white', border: `1px solid ${C.line}`, padding: '20px 26px'}}>
          <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.mute}}>POSES</div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10}}>
            {POSES.map((x) => (
              <div key={x.p} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 280}}>
                <Mascot size={230} pose={x.p} expression={x.e} cardText={x.card} />
                <div style={{fontSize: 24, fontWeight: 800, color: C.ink, marginTop: 6}}>{x.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* rules */}
    <div style={{display: 'flex', gap: 20, marginTop: 26}}>
      {[
        ['Never talks as “I”', 'Noah is always third person. The mascot acts; the narrator speaks.'],
        ['The line stays level', 'Never tilt the waterline, in any pose.'],
        ['Not the logo', 'Pebble, not a circle. The line never overshoots the body.'],
        ['No boats, no arks', 'It’s a load line, not a boat.'],
        ['Calm, never hype', 'No panic, no wizard tricks, no fake urgency.'],
      ].map(([h, t]) => (
        <div key={h} style={{flex: 1, borderRadius: 22, background: 'white', border: `1px solid ${C.line}`, padding: '16px 18px'}}>
          <div style={{fontSize: 24, fontWeight: 800, color: C.commit}}>✓ {h}</div>
          <div style={{fontSize: 19, fontWeight: 600, color: C.ink2, marginTop: 4, lineHeight: 1.3}}>{t}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
