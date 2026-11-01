// Text transcribed from genuine Noah (Windows) screenshots in the repo root:
// IMG_0583–0587 (chat + diagnostic steps), IMG_0588/0591/0592 (situation, "What Noah checked",
// "What Noah would do"), IMG_0593 (approval dialog), IMG_0594 (approved state), IMG_0595 (result).
// These are the source of truth for every enhanced Noah screen. Do not add checks, findings,
// buttons or numbers that are not in the real screens. Where the real UI truncates text with "…",
// we keep the truncation instead of guessing the rest. (The "old FL Studio installers" tile label is
// spelled out using the wording from the same screen's Situation text.)

export const NOAH_UI = {
  windowTitle: 'Noah',
  inputPlaceholder: "What's broken? Tell Noah and hit go.",
  followUpPlaceholder: '…or tell Noah to do it differently',
  // Real diagnostic step labels (IMG_0584–0586)
  steps: ['Searching knowledge', 'Running diagnostics', 'Listing processes', 'Checking startup programs', 'Checking disk space'],
  whatNoahDid: 'What Noah did',
  situationLabel: 'SITUATION',
  situation:
    "Your PC is loading seven programs at every startup plus a busy background load — that's what's making it feel slow. I also found ~12 GB of old FL Studio installers you can reclaim.",
  checkedLabel: 'WHAT NOAH CHECKED',
  checked: [
    {key: 'startup', label: 'STARTUP ITEMS', value: '7 launch', sub: 'Battle.net, Teams, Av…'},
    {key: 'storage', label: 'C: DRIVE FREE', value: '58 GB / 476 GB', sub: '87% full — tight but…'},
    {key: 'installers', label: 'OLD FL STUDIO INSTALLERS', value: '~12 GB', sub: 'in Downloads, old v…'},
    {key: 'background', label: 'BACKGROUND', value: '~30 apps', sub: 'Xbox, Avid, Teams, E…'},
  ],
  wouldDoLabel: 'WHAT NOAH WOULD DO',
  wouldDo: [
    {title: 'Stop 3 heavy apps from auto-launching at boot', sub: 'Battle.net, Avid Link, Edge autolaunch — reversible anytime'},
    {title: 'Stop Teams from auto-starting at boot', sub: 'Reversible; Teams still opens on demand'},
    {title: 'Clear temp files to free space', sub: 'Safe, ~0.5 GB temp cache'},
    {title: 'Reclaim old FL Studio installers', sub: 'Move ~14 old installers to Trash — keep the newest one'},
  ],
  planButton: 'Trim startup & clear space',
  approval: {
    title: 'Can Noah do this?',
    body: 'Noah needs your OK to continue.',
    no: 'No thanks',
    go: 'Go ahead',
    all: 'Approve all',
  },
  approved: 'Approved: Action approved',
} as const;

// The viewer-facing prompt for this video (meaning kept; matches the plain-English style Noah expects).
export const RESTART_PROMPT = 'My PC keeps slowing down even after I restart it. Check what could be causing it.';
