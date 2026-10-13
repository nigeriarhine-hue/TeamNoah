import React from "react";
import { Img, staticFile } from "remotion";

/** Official Noah mark from brand-pack. Use only in branding positions (end card). */
export const NoahLogo: React.FC<{ size: number; variant?: "light" | "dark" }> = ({ size, variant = "light" }) => (
  <Img src={staticFile(`brand/noah-mark-${variant}.svg`)} style={{ width: size, height: size }} />
);
