import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('png');   // lossless intermediates; the comp is the deliverable
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');

// The full Chromium binary no longer supports old headless mode; Playwright's
// chrome-headless-shell does. Override with REMOTION_BROWSER_EXECUTABLE if needed.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER_EXECUTABLE ??
    '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
);
