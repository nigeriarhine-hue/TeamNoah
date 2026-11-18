import React from "react";
import { staticFile } from "remotion";

export const SANS = "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";
export const SERIF = "'Instrument Serif', Georgia, serif";

export const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:'Plus Jakarta Sans';font-weight:100 900;src:url(${staticFile("fonts/PlusJakartaSans-normal.woff2")}) format('woff2');}
@font-face{font-family:'Instrument Serif';font-weight:400;src:url(${staticFile("fonts/InstrumentSerif-normal.woff2")}) format('woff2');}
`}</style>
);
