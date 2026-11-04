// Shared data shape for every "Can You Diagnose This PC?" episode.
// A new episode = a new data file that fills this in (see src/episodes/ep1.data.ts).
// All times are frames at 30 fps.

export type OptionKey = 'A' | 'B' | 'C';
export type IconName = 'ram' | 'storage' | 'startup';
export type AppIconName =
  | 'browser'
  | 'music'
  | 'chat'
  | 'games'
  | 'cloud'
  | 'office'
  | 'meeting'
  | 'updater'
  | 'utility';

export type Option = {key: OptionKey; label: string; icon: IconName; at: number};

export type Evidence = {
  key: OptionKey;
  title: string; // MEMORY
  primary: string; // 16 GB installed
  secondary: string; // Usage: Normal
  verdict: string; // shown when checked
  settled: string; // secondary state after the reveal (e.g. NORMAL / ROOM AVAILABLE)
  tone: 'ok' | 'warn';
  at: number; // when Noah finishes checking this card
};

export type CaptionLine = {text: string; from: number; to: number; emphasis?: string[]};

export type Spec = {label: string; value: string};

export type EpisodeData = {
  episode: number;
  caseNo: string;

  // The case: the PC and its symptom
  pcName: string; // "Windows PC"
  symptomLines: string[]; // big hook text, one entry per line
  symptomShort: string; // used in the case panel
  specs: Spec[];
  hookLineAt: number[]; // frame each symptom line appears
  diagnosePromptAt: number; // "CAN YOU DIAGNOSE IT?"

  // Media
  hostClipA: string;
  hostClipB: string;
  hostSegmentsA: {from: number; dur: number; startFrom: number; rate: number}[];
  hostSegmentsB: {from: number; dur: number; startFrom: number; rate: number}[];
  vo: string;
  hostStill: string;

  // Timeline
  quizFrom: number;
  caseFrom: number;
  countdownFrom: number;
  countdownTo: number;
  answerPromptAt: number; // "Got your answer?"
  voBStart: number;
  revealFrom: number;
  answerAt: number;
  endFrom: number;
  total: number;

  // Quiz
  options: Option[];
  answer: OptionKey;
  evidence: Evidence[];
  startupApps: {icon: AppIconName; label: string}[];
  startupAnimFrom: number;
  finding: string; // "9 apps launching at startup"
  footnote: string;
  captions: CaptionLine[];
};
