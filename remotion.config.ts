import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(17);
Config.setChromiumOpenGlRenderer('angle');
// Full-quality audio for the creator's voice.
Config.setAudioCodec('aac');
Config.setAudioBitrate('256k');

// This environment ships Chromium already (Playwright's build) and cannot
// reach remotion.media to fetch Remotion's own headless shell, so point the
// renderer at the local binary.
Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell');
