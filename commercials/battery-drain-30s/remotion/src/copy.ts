/**
 * Every word and number that appears on screen, in one place.
 * Mirrors 04-onscreen-text.md — if you change a string here, change it there.
 *
 * The numbers are internally consistent and must stay that way. A 2h 06m full-charge
 * projection implies 0.79%/min, so 41% -> 29% takes ~15 minutes, which is why the
 * stopwatch reads 00:15:12. Re-derive the others if you change any one of them.
 */
export const CULPRIT = {
  process: 'NorthwindSyncHelper',
  pid: 'PID 40218',
  parent: 'Northwind Drive',
  agent: '~/Library/LaunchAgents/com.northwind.drive.sync.plist',
  backupSuffix: '.noah_bak',
} as const;

export const METRICS = {
  energyBefore: '94.2',
  energyAfter: '0.4',
  cpuBefore: '61% of a core',
  cpuAfter: '2%',
  lifeBefore: '2h 06m',
  lifeAfter: '5h 41m',
  atThisLevel: '4h 12m',
  elapsed: '1.8s',
  sampled: '41 processes sampled · 60s window',
} as const;

export const BATTERY = {
  plugged: {from: 41, to: 38, clockFrom: '23:41', clockTo: '23:47'},
  onBattery: {from: 34, to: 29, clockFrom: '23:52', clockTo: '23:56'},
} as const;

/** Stopwatch starts a beat before the mark so it ticks over to 15:12 on screen. */
export const STOPWATCH_START_SECONDS = 15 * 60 + 11.6;

export const COPY = {
  composerGreeting: 'Good evening.',
  composerHint: "Describe what's wrong, in your own words.",
  userSentence: 'My battery keeps dying way too fast.',

  measuringEyebrow: 'Noah is measuring',
  checks: [
    'Battery health and cycle count',
    'Charge and discharge history',
    'Energy impact per process — 60s sample',
    'Login items and background agents',
    'Sleep, wake and idle power state',
  ],

  findingEyebrow: 'Noah found the actual cause',
  findingHeadline: "Northwind Drive's sync helper never stopped running.",
  findingBody:
    "It's stuck retrying an upload that failed four hours ago. While it runs, your Mac " +
    "can't drop into its low-power idle state — so the battery drains as if you were working.",

  proposalEyebrow: 'What Noah will do',
  step1: 'Quit the helper.',
  step2: 'Stop it starting again at login.',
  reassure: "Northwind Drive still works. You'll open it yourself when you want to sync.",
  reversible: 'Reversible. Noah keeps the backup and can put it back.',
  approve: 'APPROVE',
  notNow: 'Not now',

  acted1: 'Quit NorthwindSyncHelper',
  acted2: 'Login item disabled — backup saved',
  done: 'Done.',
  undo: 'Undo this change',

  recheckEyebrow: 'Same check, run again',
  rowEnergy: 'Background energy impact',
  rowCpu: 'Idle CPU',
  rowLife: 'Projected battery life, full charge',
  before: 'Before',
  after: 'After',
  measuredFoot: 'Measured on this Mac, tonight. Yours will differ.',

  wordmark: 'NOAH',
  tagline: ['Describe it.', 'Approve it.', 'Done.'] as const,
  descriptor: "Find what's actually wrong with your Mac.",
  url: 'onnoah.app',
  legal:
    'Results depend on device condition, configuration, battery health, and the cause of the issue.',
} as const;

/** VO, for the animatic's burned-in subtitles. Frames are absolute in the 816-frame film. */
export const VO = [
  {n: 1, start: 28, dur: 58, text: "Your battery shouldn't disappear this fast."},
  {n: 2, start: 150, dur: 62, text: "Cleaning random files won't tell you why."},
  {n: 3, start: 258, dur: 65, text: "Noah measures what's actually using your power."},
  {n: 4, start: 350, dur: 58, text: 'It finds the process draining your battery…'},
  {n: 5, start: 416, dur: 36, text: '…explains what it found…'},
  {n: 6, start: 462, dur: 70, text: '…and shows you exactly what it wants to change.'},
  {n: 7, start: 538, dur: 29, text: 'You approve it.'},
  {n: 8, start: 590, dur: 38, text: 'Then Noah checks again.'},
  {n: 9, start: 638, dur: 24, text: 'No guessing.'},
  {n: 10, start: 686, dur: 36, text: 'Find the real cause.'},
  {n: 11, start: 730, dur: 19, text: 'Noah.'},
  {n: 12, start: 758, dur: 52, text: 'Describe it. Approve it. Done.'},
] as const;
