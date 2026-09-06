Narration and music go here. Nothing in this folder is tracked except this file.

Pick one narration route:

    voiceover.mp3              one continuous 57.00s file, silent until 0:00.5
                               → set AUDIO.voiceover = true

    vo-1.mp3 … vo-8.mp3        one clip per script line, no leading silence
                               → set AUDIO.voiceoverLines = true

    music.mp3                  optional bed → set AUDIO.music = true

Flags live in `src/Video.tsx`. The script, the read direction and the timing
table are in `../../VOICEOVER.md`.

Per-line clips are placed by Remotion at the marks in `VO_MARKS`, so each file
should start speaking immediately — do not pad the heads with silence, or every
line lands late.
