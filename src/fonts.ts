import React from 'react';
import {PJS_FACES} from './fontFaces';

/** Noah's brand sans, per brand-kit.html (--sans: 'Plus Jakarta Sans'). */
export const PJS = 'PlusJakartaSans';

/**
 * Faces are embedded as data URIs rather than fetched. loadFont() wraps each
 * face in a delayRender(), and across the render's parallel workers those calls
 * raced and timed out; an inline @font-face has nothing to wait for.
 */
export const FontFaces: React.FC = () =>
  React.createElement('style', {dangerouslySetInnerHTML: {__html: PJS_FACES}});
