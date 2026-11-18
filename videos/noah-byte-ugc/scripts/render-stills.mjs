// Usage: node scripts/render-stills.mjs <CompositionId> <outDir> <frame> [frame...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [id, outDir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, chromiumOptions: { gl: "swangle" } });
for (const fr of frames.length ? frames : ["0"]) {
  const output = path.join(outDir, `${id}-${fr}.png`);
  await renderStill({ serveUrl, composition, frame: Number(fr), output, chromiumOptions: { gl: "swangle" }, timeoutInMilliseconds: 120000 });
  console.log("wrote", output);
}
