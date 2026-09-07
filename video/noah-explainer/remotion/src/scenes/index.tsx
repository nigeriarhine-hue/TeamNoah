import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, MONO, SANS, headline } from '../theme';
import { ApproveButton, Headline, Label, Mono, Panel, STAGE_X, Tick, useFade } from './parts';

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ paddingLeft: STAGE_X, paddingTop: 168 }}>{children}</AbsoluteFill>
);

/* 1 — HOOK. The machine is busy doing nothing you asked for. */
export const S01: React.FC = () => {
  const f = useCurrentFrame();
  const o = useFade(0, 18);
  return (
    <Stage>
      <div style={{ opacity: o, position: 'relative', width: 620 }}>
        <div style={{ background: '#DCD6C8', borderRadius: '14px 14px 4px 4px', padding: 16, border: `3px solid ${C.navy}` }}>
          <div style={{ background: C.card, height: 330, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="96" height="96" viewBox="0 0 40 40" style={{ transform: `rotate(${f * 4.2}deg)` }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <rect key={i} x="18.6" y="2" width="2.8" height="8" rx="1.4"
                  fill={C.mute} opacity={0.18 + (i / 12) * 0.82}
                  transform={`rotate(${i * 30} 20 20)`} />
              ))}
            </svg>
          </div>
        </div>
        <div style={{ height: 12, background: C.navy, borderRadius: '0 0 10px 10px', width: 700, marginLeft: -40 }} />
      </div>
    </Stage>
  );
};

/* 2 — The theatre: a counter performing work that is not happening. */
export const S02: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [10, 150], [0, 1847], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <Stage>
      <div style={{ opacity: useFade(0, 16) }}>
        <Label>Cleaner</Label>
        <div style={{ ...headline(210), color: C.mute, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {n.toLocaleString('en-US')}
        </div>
        <div style={{ ...headline(38), color: C.mute, marginTop: 10 }}>problems found</div>
        <Mono size={22} color={C.mute} style={{ marginTop: 44, opacity: useFade(150, 175) }}>
          none of them named
        </Mono>
      </div>
    </Stage>
  );
};

/* 3 — A desktop app, not a chat window that hands you a command. */
export const S03: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={{ display: 'flex', gap: 46 }}>
        <Panel style={{ width: 560, height: 300, opacity: useFade(0, 20) }}>
          <Label>Noah</Label>
          <Headline size={35} style={{ lineHeight: 1.3 }}>
            Two login items are starting Adobe services you never open.
          </Headline>
        </Panel>
        <Panel dark style={{ width: 560, height: 300, opacity: useFade(60, 84) }}>
          <Label color="rgba(255,255,255,.45)">A chat window</Label>
          <Mono size={21} color="#8FA3C8" style={{ lineHeight: 1.75, wordBreak: 'break-all' }}>
            sudo launchctl unload -w \
            /Library/LaunchAgents/*.plist
            <span style={{ opacity: f % 30 < 15 ? 1 : 0 }}>▌</span>
          </Mono>
          <Mono size={19} color={C.amber} style={{ marginTop: 26 }}>
            good luck
          </Mono>
        </Panel>
      </div>
    </Stage>
  );
};

/* 4 — Outside the browser sandbox, so it can read the real system state. */
export const S04: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    ['WindowServer', '4.1%'],
    ['Adobe_CCXProcess', '61.7%'],
    ['Spotlight (mds)', '2.8%'],
    ['backupd', '1.2%'],
  ];
  return (
    <Stage>
      <div style={{ display: 'flex', gap: 46, alignItems: 'flex-start' }}>
        <div style={{ opacity: useFade(0, 18) }}>
          <Label>A browser tab</Label>
          <div style={{
            width: 430, height: 260, border: `3px dashed ${C.line}`, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ ...headline(26), color: C.mute }}>sees nothing</span>
          </div>
        </div>
        <Panel style={{ width: 680, opacity: useFade(56, 80) }}>
          <Label>Noah</Label>
          {rows.map(([name, cpu], i) => {
            const hot = i === 1;
            const o = interpolate(f, [70 + i * 13, 86 + i * 13], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <div key={name} style={{
                display: 'flex', justifyContent: 'space-between', opacity: o,
                padding: '11px 14px', borderRadius: 6, marginBottom: 5,
                backgroundColor: hot ? 'rgba(217,119,6,.10)' : 'transparent',
              }}>
                <Mono size={23} color={hot ? C.amber : C.ink}>{name}</Mono>
                <Mono size={23} color={hot ? C.amber : C.mute}>{cpu}</Mono>
              </div>
            );
          })}
        </Panel>
      </div>
    </Stage>
  );
};

/* 5 — Your own words are a complete bug report. */
export const S05: React.FC = () => {
  const f = useCurrentFrame();
  const text = 'my fan will not stop';
  const shown = text.slice(0, Math.max(0, Math.floor(interpolate(f, [24, 130], [0, text.length], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }))));
  return (
    <Stage>
      <Panel style={{ width: 1180, opacity: useFade(0, 18), padding: 46 }}>
        <Label>What is wrong?</Label>
        <div style={{ ...headline(52), minHeight: 70 }}>
          {shown}
          <span style={{ opacity: f % 30 < 15 ? 1 : 0, color: C.mute, fontWeight: 400 }}>|</span>
        </div>
        <div style={{ height: 2, background: C.line, marginTop: 26 }} />
        <div style={{ ...headline(24), color: C.mute, marginTop: 22, fontWeight: 500, letterSpacing: 0, opacity: useFade(140, 168) }}>
          No jargon required. That is the whole report.
        </div>
      </Panel>
    </Stage>
  );
};

/* 6 — Audited diagnostics against playbooks that ship inside the app. */
export const S06: React.FC = () => {
  const f = useCurrentFrame();
  const checks = ['Login items', 'Launch agents', 'Preference staleness', 'Disk pressure', 'Runaway processes'];
  return (
    <Stage>
      <Panel style={{ width: 900, opacity: useFade(0, 18), padding: 42 }}>
        <Label>Playbook · running locally</Label>
        {checks.map((c, i) => {
          const at = 30 + i * 34;
          return (
            <div key={c} style={{
              display: 'flex', alignItems: 'center', gap: 20, padding: '13px 0',
              opacity: interpolate(f, [at - 12, at], [0.25, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              <Tick o={interpolate(f, [at, at + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
              <span style={{ ...headline(31), fontWeight: 500, letterSpacing: '-0.01em' }}>{c}</span>
            </div>
          );
        })}
      </Panel>
    </Stage>
  );
};

/* 7 — The real cause is dull and specific. Amber marks the caution. */
export const S07: React.FC = () => (
  <Stage>
    <div style={{ opacity: useFade(0, 18) }}>
      <Label color={C.amber}>Cause</Label>
      <Panel style={{ width: 1230, padding: 40, borderLeft: `6px solid ${C.amber}` }}>
        <Mono size={31} style={{ lineHeight: 1.7, wordBreak: 'break-all' }}>
          ~/Library/LaunchAgents/
          <span style={{ color: C.amber }}>com.adobe.GC.Invoker-1.0.plist</span>
        </Mono>
        <div style={{ ...headline(28), color: C.mute, fontWeight: 500, letterSpacing: 0, marginTop: 26, opacity: useFade(90, 118) }}>
          Left behind by an app removed in March. Still starting every login.
        </div>
      </Panel>
    </div>
  </Stage>
);

/* 8 — Plain English back: what is wrong, then what it proposes to change. */
export const S08: React.FC = () => (
  <Stage>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26, width: 1220 }}>
      <Panel style={{ opacity: useFade(0, 20), padding: 38 }}>
        <Label>What is wrong</Label>
        <Headline size={38} style={{ lineHeight: 1.32 }}>
          A leftover Adobe helper restarts itself every time you log in.
        </Headline>
      </Panel>
      <Panel style={{ opacity: useFade(84, 108), padding: 38 }}>
        <Label>What Noah proposes</Label>
        <Headline size={38} style={{ lineHeight: 1.32 }}>
          Move that one file aside, then stop the process it started.
        </Headline>
      </Panel>
    </div>
  </Stage>
);

/* 9 — THE APPROVAL. The single most differentiating moment; the only aurora. */
export const S09: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const press = spring({ frame: f - 236, fps, config: { damping: 200 }, durationInFrames: 14 });
  const cursor = interpolate(f, [186, 234], [560, 232], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Stage>
      <Panel style={{ width: 1230, padding: 44, opacity: useFade(0, 18), position: 'relative' }}>
        <Label>Nothing runs until you approve</Label>
        <Mono size={26} style={{ lineHeight: 1.8, marginBottom: 38 }}>
          com.adobe.GC.Invoker-1.0.plist{' '}
          <span style={{ color: C.mute }}>→</span>{' '}
          <span style={{ color: C.commit }}>com.adobe.GC.Invoker-1.0.plist.noah_bak</span>
        </Mono>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <ApproveButton pressed={press} />
          <span style={{ ...headline(28), color: C.mute, fontWeight: 500, letterSpacing: 0 }}>
            or don't
          </span>
        </div>
        <svg width="26" height="34" viewBox="0 0 26 34" style={{
          position: 'absolute', left: 250, top: cursor, opacity: interpolate(f, [180, 196], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <path d="M2 1 L2 26 L8.5 20 L13 31 L17.5 29 L13 18.5 L21 18.5 Z"
            fill={C.ink} stroke={C.card} strokeWidth="1.6" />
        </svg>
      </Panel>
    </Stage>
  );
};

/* 10 — Logged, and reversible. Teal confirms. */
export const S10: React.FC = () => {
  const f = useCurrentFrame();
  const log = [
    ['09:14:02', 'Moved 1 file to backup'],
    ['09:14:02', 'Unloaded launch agent'],
    ['09:14:03', 'Verified process stopped'],
  ];
  return (
    <Stage>
      <Panel style={{ width: 1180, padding: 42, opacity: useFade(0, 18) }}>
        <Label color={C.commit}>Done · reversible</Label>
        {log.map(([t, msg], i) => {
          const at = 34 + i * 40;
          return (
            <div key={msg} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px 0' }}>
              <Tick o={interpolate(f, [at, at + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
              <Mono size={22} color={C.mute}>{t}</Mono>
              <Mono size={24}>{msg}</Mono>
            </div>
          );
        })}
        <div style={{
          marginTop: 30, paddingTop: 26, borderTop: `2px solid ${C.line}`,
          display: 'flex', alignItems: 'center', gap: 20,
          opacity: useFade(168, 194),
        }}>
          <div style={{ border: `2px solid ${C.ink}`, borderRadius: 10, padding: '13px 30px' }}>
            <span style={{ ...headline(27) }}>Undo</span>
          </div>
          <span style={{ ...headline(25), color: C.mute, fontWeight: 500, letterSpacing: 0 }}>
            puts the file back, exactly where it was
          </span>
        </div>
      </Panel>
    </Stage>
  );
};

/* 11 — TURN. Don't trust it; check it. */
export const S11: React.FC = () => {
  const f = useCurrentFrame();
  const code = [
    'func (p *Playbook) Apply(ctx context.Context) error {',
    '    if !p.approved {',
    '        return ErrNotApproved',
    '    }',
    '    backup, err := fs.MoveAside(p.target)',
    '    if err != nil {',
    '        return err',
    '    }',
    '    p.journal.Record(backup)   // every change, reversible',
    '    return p.unload(ctx)',
    '}',
  ];
  const scroll = interpolate(f, [0, 300], [0, -120]);
  return (
    <Stage>
      <div style={{ display: 'flex', gap: 40 }}>
        <Panel dark style={{ width: 830, height: 360, overflow: 'hidden', opacity: useFade(0, 18), padding: 30 }}>
          <div style={{ transform: `translateY(${scroll}px)` }}>
            {code.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: 20 }}>
                <span style={{ fontFamily: MONO, fontSize: 19, color: 'rgba(255,255,255,.28)', width: 26, textAlign: 'right' }}>{i + 1}</span>
                <span style={{ fontFamily: MONO, fontSize: 19, color: l.includes('//') ? '#8FA3C8' : '#D7DEEC', whiteSpace: 'pre' }}>{l}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel style={{ width: 400, opacity: useFade(70, 96), padding: 34 }}>
          <Label>Allowed to</Label>
          {['Read system state', 'Move files aside', 'Stop processes'].map((p, i) => (
            <div key={p} style={{
              ...headline(25), fontWeight: 500, letterSpacing: 0, padding: '10px 0',
              opacity: interpolate(f, [96 + i * 18, 112 + i * 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>{p}</div>
          ))}
          <div style={{ height: 2, background: C.line, margin: '18px 0' }} />
          <Label color={C.amber}>Never without approval</Label>
          <div style={{ ...headline(25), fontWeight: 500, letterSpacing: 0, color: C.amber, opacity: useFade(160, 186) }}>
            Delete anything
          </div>
        </Panel>
      </div>
    </Stage>
  );
};

/* 12 — PAYOFF. The stack resolves to one named card; the mark closes it. */
export const S12: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: f - 30, fps, config: { damping: 200 }, durationInFrames: 26 });
  return (
    <Stage>
      <div style={{ opacity: useFade(0, 16) }}>
        <Panel style={{
          width: 1130, padding: 44, borderLeft: `6px solid ${C.commit}`,
          transform: `translateY(${(1 - rise) * 26}px)`,
        }}>
          <Label color={C.commit}>The count was one</Label>
          <Mono size={30} style={{ lineHeight: 1.7, wordBreak: 'break-all' }}>
            com.adobe.GC.Invoker-1.0.plist
          </Mono>
          <div style={{ ...headline(31), color: C.mute, fontWeight: 500, letterSpacing: 0, marginTop: 22 }}>
            Moved aside. Fan stopped. Still undoable.
          </div>
        </Panel>
        <div style={{ ...headline(44), marginTop: 52, opacity: useFade(150, 182) }}>
          Noah finds what&rsquo;s actually wrong with your Mac.
        </div>
        <div style={{
          fontFamily: SANS, fontWeight: 500, fontSize: 27, color: C.mute, marginTop: 18,
          opacity: useFade(196, 226),
        }}>
          Open source · onnoah.app
        </div>
      </div>
    </Stage>
  );
};

export const SCENES = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12];
