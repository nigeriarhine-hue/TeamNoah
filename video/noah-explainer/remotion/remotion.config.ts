import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Software rasteriser: this container has no GPU.
Config.setChromiumOpenGlRenderer('swangle');
