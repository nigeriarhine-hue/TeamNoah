import React, { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';
import { PLUS_JAKARTA_WOFF2_BASE64 } from './font-data';

const css = `@font-face {
  font-family: 'Plus Jakarta Sans';
  font-weight: 200 800;
  font-style: normal;
  src: url(data:font/woff2;base64,${PLUS_JAKARTA_WOFF2_BASE64}) format('woff2');
}`;

// Brand font, inlined (no network), and frames wait until it is ready.
export const BrandFonts: React.FC = () => {
  const [handle] = useState(() => delayRender('Loading Plus Jakarta Sans'));
  useEffect(() => {
    Promise.all([
      document.fonts.load("800 64px 'Plus Jakarta Sans'"),
      document.fonts.load("600 32px 'Plus Jakarta Sans'"),
    ])
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error(err);
        continueRender(handle);
      });
  }, [handle]);
  return <style>{css}</style>;
};
