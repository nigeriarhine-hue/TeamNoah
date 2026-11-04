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
  hookLineAt: [4, 26, 47],
  diagnosePromptAt: 84,

  hostClipA: 'host/ep1-host-a.mp4', // symptom + question + waiting through the countdown
  hostClipB: 'host/ep1-host-b.mp4', // "Got your answer?" + Noah's findings + "Did you get it right?"
  // Seedance re-paces speech slightly; segments re-time each clip so the lips match the VO.
  // Fit from pause positions (clip vs VO); each boundary sits in a pause so cuts are invisible.
  hostSegmentsA: [
    {from: 0, dur: 89, startFrom: 0, rate: 1.093}, // symptom line
    {from: 89, dur: 117, startFrom: 97, rate: 1.082}, // "You've got five seconds… startup apps?"
    {from: 206, dur: 47, startFrom: 224, rate: 1.0}, // arms folded, waiting
  ],
  hostSegmentsB: [
    {from: 0, dur: 124, startFrom: 3, rate: 1.0}, // "Got your answer? Noah checked it. Memory…"
    {from: 124, dur: 74, startFrom: 127, rate: 1.085}, // "…storage had room, but nine apps…"
    {from: 198, dur: 29, startFrom: 208, rate: 1.0}, // "Did you get it right?"
  ],
  vo: 'vo/vo_full.wav',
  hostStill: 'host/host-still.png',

  quizFrom: 100,
  caseFrom: 104,
  countdownFrom: 145, // 5 digits x 22 frames
  countdownTo: 255,
  answerPromptAt: 255,
  voBStart: 253,
  revealFrom: 289,
  answerAt: 418,
  endFrom: 446,
  total: 480,

  options: [
    {key: 'A', label: 'RAM', icon: 'ram', at: 145},
    {key: 'B', label: 'Low storage', icon: 'storage', at: 161},
    {key: 'C', label: 'Startup apps', icon: 'startup', at: 180},
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
      at: 336,
    },
    {
      key: 'B',
      title: 'Storage',
      primary: '512 GB SSD',
      secondary: 'Free space: Adequate',
      verdict: 'Has room',
      settled: 'Storage · Room available',
      tone: 'ok',
      at: 368,
    },
    {
      key: 'C',
      title: 'Startup apps',
      primary: '9 apps',
      secondary: 'Launching at startup',
      verdict: 'Stands out',
      settled: '9 launching',
      tone: 'warn',
      at: 388,
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
  startupAnimFrom: 384,
  finding: '9 apps launching at startup',
  footnote: 'Finding for this PC’s scan only — not a rule that 9 startup apps always slows a PC.',

  captions: [
    {text: 'You’ve got five seconds —', from: 104, to: 118, emphasis: ['five', 'seconds']},
    {text: 'what’s causing it?', from: 120, to: 141, emphasis: ['causing']},
    {text: 'RAM, low storage,', from: 145, to: 178},
    {text: 'or startup apps?', from: 180, to: 212},
    {text: 'Got your answer?', from: 255, to: 286, emphasis: ['answer?']},
    {text: 'Noah checked it.', from: 289, to: 314},
    {text: 'Memory looked normal,', from: 317, to: 348, emphasis: ['normal,']},
    {text: 'storage had room,', from: 350, to: 381, emphasis: ['room,']},
    {text: 'but nine apps were launching at startup.', from: 384, to: 444, emphasis: ['nine', 'apps']},
  ],
};
