/**
 * Shared vertical grid for the 1080x1920 frame.
 *
 * Scenes compose a headline block and a hero panel as one group and centre that
 * group, so the empty space lands evenly above and below instead of pooling at
 * the top. Everything stays inside the mobile-safe area (§15).
 */
export const grid = {
  /** Fallback headline top for scenes with no hero panel. */
  headline: 372,
  heroY: 120,
  /** Top of a caption block under the hero. */
  caption: 1596,
  /** Widest a hero panel should be drawn: keeps it inside the 90px side-safe. */
  heroWidth: 900,
  /** A little wider, for panels whose content is centred. */
  heroWide: 980,
  /** Vertical breathing room between the headline and the hero. */
  gap: 100,
} as const;

const CENTRE_Y = 960;

/**
 * Centre a headline block plus a hero of `panelH` as a single group.
 * Returns the headline's top and the hero's offset from the canvas centre.
 */
export const stack = (headlineH: number, panelH: number, gap: number = grid.gap) => {
  const total = headlineH + gap + panelH;
  const top = CENTRE_Y - total / 2;
  return {
    headline: top,
    heroY: top + headlineH + gap + panelH / 2 - CENTRE_Y,
    /** Absolute y of the top of the hero, for placing anything beneath it. */
    heroTop: top + headlineH + gap,
    heroBottom: top + total,
  };
};

/** Common headline block heights, measured from the rendered type. */
export const headlineH = {
  one: 112,
  oneRuled: 138,
  two: 186,
  big: 132,
} as const;
