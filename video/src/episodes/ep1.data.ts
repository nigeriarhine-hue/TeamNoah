// "Can You Diagnose This PC?" — Episode 1 data.
// Future episodes: copy this file, change the case, options, evidence and timings.
// All times are in frames at 30 fps.

export type Option = {key: 'A' | 'B' | 'C'; label: string; icon: 'ram' | 'storage' | 'startup'; at: number};

export type Evidence = {
  key: 'A' | 'B' | 'C';
  title: string;
  value: string;
  detail: string;
  verdict: string;
  tone: 'ok' | 'warn';
  at: number;
};

export type CaptionLine = {text: string; from: number; to: number; emphasis?: string[]};

export const ep1 = {
  episode: 1,
  caseNo: '001',
  symptom: 'Everything feels slow',

  hostClipA: 'host/ep1-host-a.mp4', // hook + waiting through the countdown
  hostClipB: 'host/ep1-host-b.mp4', // "Got your answer?" + reveal
  // Seedance re-paces speech slightly. Each clip is time-mapped in segments so the lips line up
  // with the VO track (fit from pause positions). `startFrom` is in source frames at 30 fps.
  hostSegmentsA: [
    {from: 0, dur: 162, startFrom: 2, rate: 1.146}, // speech
    {from: 162, dur: 117, startFrom: 188, rate: 0.96}, // silent waiting through the countdown
  ],
  hostSegmentsB: [{from: 0, dur: 171, startFrom: 0, rate: 1.093}],
  voA: 'vo/vo_a.wav',
  voB: 'vo/vo_b.wav',

  voBStart: 279,
  quizFrom: 86, // host shrinks into the card, options appear
  countdownFrom: 126, // 5 x 30 frames
  countdownTo: 276,
  revealFrom: 300, // Noah starts checking
  answerAt: 334, // "it's startup apps"
  listFrom: 366, // "Nine of them launch..."
  endFrom: 432,
  total: 450,

  options: [
    {key: 'A', label: 'RAM', icon: 'ram', at: 89},
    {key: 'B', label: 'Low storage', icon: 'storage', at: 107},
    {key: 'C', label: 'Startup apps', icon: 'startup', at: 132},
  ] as Option[],

  answer: 'C' as const,

  evidence: [
    {
      key: 'A',
      title: 'Memory',
      value: '46% in use',
      detail: '7.4 of 16 GB',
      verdict: 'Normal',
      tone: 'ok',
      at: 308,
    },
    {
      key: 'B',
      title: 'C: drive',
      value: '214 GB free',
      detail: 'of 476 GB',
      verdict: 'Plenty',
      tone: 'ok',
      at: 320,
    },
    {
      key: 'C',
      title: 'Startup items',
      value: '9 launch at boot',
      detail: 'all at once, every start',
      verdict: 'Heavy here',
      tone: 'warn',
      at: 334,
    },
  ] as Evidence[],

  startupApps: [
    'Teams',
    'OneDrive',
    'Spotify',
    'Steam',
    'Discord',
    'Zoom',
    'Adobe Updater',
    'Epic Games',
    'Dropbox',
  ],

  footnote: 'Diagnosis for this PC’s scan. The count alone isn’t the rule — the load at boot is.',

  captions: [
    {text: 'You’ve got five seconds.', from: 0, to: 38, emphasis: ['five', 'seconds.']},
    {text: 'What’s slowing this PC down?', from: 40, to: 86, emphasis: ['slowing']},
    {text: 'RAM, low storage,', from: 89, to: 130},
    {text: 'or startup apps?', from: 132, to: 166},
    {text: 'Got your answer?', from: 279, to: 306, emphasis: ['answer?']},
    {text: 'Noah checked:', from: 309, to: 332},
    {text: 'it’s startup apps.', from: 334, to: 364, emphasis: ['startup', 'apps.']},
    {text: 'Nine of them launch every time this PC starts.', from: 366, to: 436, emphasis: ['Nine']},
  ] as CaptionLine[],
};

export type EpisodeData = typeof ep1;
