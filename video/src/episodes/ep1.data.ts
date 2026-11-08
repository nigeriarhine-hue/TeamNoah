// "Can You Diagnose This PC?" — Episode 1: the slow-startup Windows PC.
// Template for future episodes: copy this file and change the case, specs, options,
// evidence, answer and timings. Times are frames at 30 fps; VO line timings come from
// public/vo/timing.json (written by tools/build_vo.py).
import type {EpisodeData} from '../series/types';

export const ep1: EpisodeData = {
  episode: 1,
  caseNo: '001',

  pcName: 'Windows PC',
  symptomLines: ['THIS WINDOWS PC', 'FEELS SLOW', 'EVERY TIME IT STARTS.'],
  symptomShort: 'Slow every time it starts',
  specs: [
    {label: 'OS', value: 'Windows 11'},
    {label: 'Memory', value: '16 GB RAM'},
    {label: 'Drive', value: '512 GB SSD'},
  ],
  hookLineAt: [5, 26, 52],
  diagnosePromptAt: 93,

  hostClipA: 'host/ep1-host-a.mp4', // symptom + question + waiting through the countdown
  hostClipB: 'host/ep1-host-b.mp4', // "Got your answer?" + Noah's findings + "Did you get it right?"
  // Seedance re-paces speech slightly; segments re-time each clip so the lips match the VO.
  // Fit from pause positions (clip vs VO); each boundary sits in a pause so cuts are invisible.
  hostSegmentsA: [
    {from: 0, dur: 98, startFrom: 0, rate: 0.98}, // "This Windows PC feels slow every time it starts."
    {from: 98, dur: 68, startFrom: 102, rate: 1.089}, // "You've got five seconds. What's causing it?"
    {from: 166, dur: 77, startFrom: 182, rate: 1.051}, // "RAM, low storage, or startup apps?"
    {from: 243, dur: 59, startFrom: 263, rate: 1.0}, // arms folded, waiting through the countdown
  ],
  hostSegmentsB: [
    {from: 0, dur: 141, startFrom: 0, rate: 1.0}, // "Got your answer? Noah checked it. Memory looked normal,"
    {from: 141, dur: 72, startFrom: 141, rate: 1.108}, // "storage had room, but nine apps…"
    {from: 213, dur: 40, startFrom: 235, rate: 1.0}, // "Did you get it right?" (re-synced inside the pause)
  ],
  vo: 'vo/vo_full.wav',
  hostStill: 'host/host-still.png',
  thumbStill: 'host/thumb-still.png', // same host, puzzled raised-eyebrow look, thumb at the PC

  quizFrom: 112,
  caseFrom: 116,
  countdownFrom: 169, // 5 digits x 27 frames, starting on "RAM"
  countdownTo: 304,
  answerPromptAt: 304,
  voBStart: 302,
  revealFrom: 334,
  answerAt: 492,
  endFrom: 513,
  total: 566,

  options: [
    {key: 'A', label: 'RAM', icon: 'ram', at: 169},
    {key: 'B', label: 'Low storage', icon: 'storage', at: 186},
    {key: 'C', label: 'Startup apps', icon: 'startup', at: 213},
  ],
  answer: 'C',

  evidence: [
    {
      key: 'A',
      title: 'Memory',
      primary: '16 GB installed',
      secondary: 'Usage: Normal',
      verdict: 'Normal',
      settled: 'RAM · Normal',
      tone: 'ok',
      at: 400,
    },
    {
      key: 'B',
      title: 'Storage',
      primary: '512 GB SSD',
      secondary: 'Free space: Adequate',
      verdict: 'Has room',
      settled: 'Storage · Room available',
      tone: 'ok',
      at: 436,
    },
    {
      key: 'C',
      title: 'Startup apps',
      primary: '9 apps',
      secondary: 'Launching at startup',
      verdict: 'Stands out',
      settled: '9 launching',
      tone: 'warn',
      at: 456,
    },
  ],

  // Generic semantic icons only — no third-party logos.
  startupApps: [
    {icon: 'browser', label: 'Browser'},
    {icon: 'music', label: 'Music'},
    {icon: 'chat', label: 'Chat'},
    {icon: 'games', label: 'Game launcher'},
    {icon: 'cloud', label: 'Cloud sync'},
    {icon: 'office', label: 'Office'},
    {icon: 'meeting', label: 'Meetings'},
    {icon: 'updater', label: 'Updater'},
    {icon: 'utility', label: 'Utility'},
  ],
  startupAnimFrom: 452,
  finding: '9 apps launching at startup',
  footnote: 'Finding for this PC’s scan only — not a rule that 9 startup apps always slows a PC.',

  captions: [
    {text: 'You’ve got five seconds —', from: 120, to: 137, emphasis: ['five', 'seconds']},
    {text: 'what’s causing it?', from: 142, to: 166, emphasis: ['causing']},
    {text: 'RAM, low storage,', from: 169, to: 210},
    {text: 'or startup apps?', from: 213, to: 246},
    {text: 'Got your answer?', from: 304, to: 332, emphasis: ['answer?']},
    {text: 'Noah checked it.', from: 341, to: 368},
    {text: 'Memory looked normal,', from: 372, to: 407, emphasis: ['normal,']},
    {text: 'storage had room,', from: 410, to: 442, emphasis: ['room,']},
    {text: 'but nine apps were launching at startup.', from: 447, to: 512, emphasis: ['nine', 'apps']},
  ],
};
