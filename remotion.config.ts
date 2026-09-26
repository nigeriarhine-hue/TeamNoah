import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');
Config.setCrf(17);
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('swangle');
Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell');
Config.setChromiumDisableWebSecurity(true);
