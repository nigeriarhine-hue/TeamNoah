/**
 * The storytelling copy (§41), in one place so the script can be tuned without
 * touching scene code.
 *
 * `activeStory` selects which narrative the composition renders. Only stories
 * backed by real Noah captures should be made active — see ASSET_MANIFEST.md.
 */
export const copy = {
  hook: {
    a: 'Your PC got slow.',
    b: ['Same laptop.', 'Same apps.'],
    c: 'So what changed?',
  },
  oldWay: ['Search Reddit.', 'Try random fixes.', 'Hope something works.'],
  turn: 'I stopped guessing.',
  reveal: 'I just told Noah what was wrong.',
  investigate: 'Noah actually checked.',
  diagnose: 'Then found the real cause.',
  diagnoseSub: 'Seven programs launching at every boot.',
  stop: 'Then Noah stopped.',
  showFix: 'It showed me the fix…',
  waited: '…and waited for my approval.',
  beats: ['Diagnose.', 'Explain.', 'Approve.', 'Fix.'],
  verify: 'Verify.',
  payoff: 'It showed the proof.',
  brand: 'Noah',
  promise: ['Describe it.', 'Approve it.', 'Done.'],
  cta: { action: 'Try Noah', url: 'onnoah.app', line: 'Find the cause. See the fix.' },
} as const;

/**
 * Ready-to-activate variant for the macOS / VS Code / Git story from the brief.
 * NOT rendered: no Noah captures of that session exist yet. Drop the real
 * screenshots into public/noah/, point config/assets.ts at them, and switch the
 * composition's `copy` import here — the scene code needs no changes.
 */
export const vsCodeGitStory = {
  hook: {
    a: "VS Code said Git wasn't installed.",
    b: ['But Git', 'worked.'],
    c: 'So what was actually broken?',
  },
  oldWay: ['Search Reddit.', 'Try random fixes.', 'Hope something works.'],
  turn: 'I stopped guessing.',
  reveal: 'I just told Noah what was wrong.',
  investigate: 'Noah actually checked.',
  diagnose: 'Then found the real cause.',
  diagnoseSub: 'A broken Git link was confusing VS Code.',
  stop: 'Then Noah stopped.',
  showFix: 'It showed me the fix…',
  waited: '…and waited for my approval.',
  beats: ['Diagnose.', 'Explain.', 'Approve.', 'Fix.'],
  verify: 'Verify.',
  payoff: 'VS Code works again.',
  brand: 'Noah',
  promise: ['Describe it.', 'Approve it.', 'Done.'],
  cta: { action: 'Try Noah', url: 'onnoah.app', line: 'Find the cause. See the fix.' },
} as const;
