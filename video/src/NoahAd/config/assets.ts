import { staticFile } from 'remotion';

/**
 * Central asset map (§33). Every path the film uses lives here — swap a file and
 * the whole composition picks it up.
 *
 * `noah/*` are processed from the real Noah captures by scripts/process-assets.mjs.
 * Nothing in this map is a mock-up of the product: each entry traces back to a
 * source screenshot, listed in ASSET_MANIFEST.md.
 */
export const assets = {
  brand: {
    /** Authentic Noah mark, vector. Never re-drawn or recoloured. */
    logo: staticFile('brand/noah-mark-dark.svg'),
    logoMono: staticFile('brand/noah-mark-1color-white.svg'),
    appIcon: staticFile('brand/noah-appicon-dark.svg'),
    appIconPng: staticFile('brand/noah-appicon-dark-1024.png'),
  },

  /** Full application window, authentic Windows chrome included. */
  window: {
    plan: staticFile('noah/app-full-plan.png'),
    dialog: staticFile('noah/app-full-dialog.png'),
    result: staticFile('noah/app-full-result.png'),
  },

  /** Conversation pane only — sidebar + OS title bar cropped away. */
  pane: {
    listening: staticFile('noah/pane-listening.png'),
    checks2: staticFile('noah/pane-checks-2.png'),
    checks4: staticFile('noah/pane-checks-4.png'),
    thinking: staticFile('noah/pane-thinking.png'),
    thinking5s: staticFile('noah/pane-thinking-5s.png'),
    plan: staticFile('noah/pane-plan.png'),
    planHover: staticFile('noah/pane-plan-hover.png'),
    sent: staticFile('noah/pane-sent.png'),
    result: staticFile('noah/pane-result.png'),
  },

  /** Non-destructive region crops for the close-up beats. */
  crop: {
    situation: staticFile('noah/crop-situation.png'),
    checked: staticFile('noah/crop-checked.png'),
    planList: staticFile('noah/crop-plan-list.png'),
    cta: staticFile('noah/crop-cta.png'),
    dialog: staticFile('noah/crop-dialog.png'),
    approved: staticFile('noah/crop-approved.png'),
    executing: staticFile('noah/crop-executing.png'),
    done: staticFile('noah/crop-done.png'),
    verify: staticFile('noah/crop-verify.png'),
  },

  audio: {
    /** Original score, synthesised by scripts/build-audio.mjs. Royalty-free; replaceable. */
    score: staticFile('audio/noah-score.wav'),
  },
} as const;

/** Intrinsic pixel dimensions, so components can size without a network round-trip. */
export const assetSize = {
  pane: { w: 1678, h: 1872 },
  window: { w: 2340, h: 1932 },
} as const;
