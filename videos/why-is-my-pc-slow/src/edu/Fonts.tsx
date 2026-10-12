import React from 'react';
import { staticFile } from 'remotion';

/** Figtree, shipped locally — the same face the Noah product UI uses. */
export const Fonts: React.FC = () => (
  <style>
    {[400, 500, 600, 700, 800]
      .map(
        (w) => `@font-face{font-family:'Figtree';font-weight:${w};font-display:block;
        src:url('${staticFile(`fonts/figtree-latin-${w}-normal.woff2`)}') format('woff2');}`,
      )
      .join('\n')}
  </style>
);
