# Narration script — "Google takes forever to load"

For `NoahGoogleSlow`, 57.00s, 30 fps, 1710 frames. Doubles as speaker notes for a
live read.

**99 words over 57 seconds — about 103 wpm including pauses.** That is slow on
purpose. The brand voice is "calm, plain, specific, unhurried," and the screen is
already carrying text. A 150-wpm read would trample it.

## The rule this script is built on

**The narration never reads the screen.** Every line below says something the
frame does not. Where the two would collide — the tagline, "Nothing runs until you
approve," the timing figures — the screen wins and the voice stays quiet. A viewer
should be able to mute the video and lose nothing, or close their eyes and lose
nothing. That is the test.

Noah is third person throughout. "Noah stops," never "I stop." First person
belongs to the user, and there is no first person in this script.

## The script

| # | VO in | Read | Words | ~Len | Screen is showing (do **not** say it) |
|---|---|---|---|---|---|
| 1 | **0:00.5** | Someone told Noah their Google was slow. | 7 | 3.5s | The symptom typing in; "That is a complete bug report." |
| 2 | **0:04.5** | Cleaning is the reflex. It rarely finds the cause. | 9 | 4.5s | "It's full of junk" struck through; *It's probably not junk.* |
| 3 | **0:10.2** | So Noah measured instead of guessing. It timed the load in stages. One stage swallowed a second. | 17 | 8.5s | The curl line; DNS 2 ms / Connect 1.05 s / Signal −68 dBm |
| 4 | **0:19.6** | Then Noah stops. It says what it will do, and what it will touch. And waits. | 16 | 8.0s | The proposal sentence, the four rows, Approve, "Nothing runs until you approve." |
| 5 | **0:28.5** | You approve. Every command runs where you can read it. | 10 | 5.0s | The four command rows ticking green |
| 6 | **0:34.6** | Then the same test again. Not a new one. The same one that found the problem. | 16 | 8.0s | 1.320 s vs 0.363 s; the three stat tiles |
| 7 | **0:43.9** | This is the part that usually goes unsaid. The stall is gone. The weak signal is not. | 17 | 8.5s | "The stalls can come back."; −68 dBm; the follow-up card |
| 8 | **0:52.4** | Find the real cause. Show the work. | 7 | 3.5s | The mark; the tagline; Shown first · Logged · Reversible |

Line 8 ends at ~0:55.9, leaving **1.1 seconds of silence on the end card.** Keep
it. The tagline should land in quiet.

## Direction

- **Register:** a competent friend who already looked at the problem. Not a
  salesperson, not a wizard, not an announcer. Read it like you are telling one
  person what happened, not addressing a room.
- **No lift on the last word of a sentence.** Every line here is a short
  declarative and should land flat and finished. The upward "explainer voice" is
  the single fastest way to make this sound like the category it is against.
- **Line 3** — "One stage swallowed a second" is the diagnosis. Slow down into it.
  It is the only place a small pause before the last four words is worth it.
- **Line 4** — "And waits." Full stop, and mean it. This is the most important
  sentence in the film. Let the Approve button sit there afterwards.
- **Line 7** — no apology in the voice. The brand rule is explicit: never
  self-deprecate, never apologise for the product. This line is Noah being
  straight, not Noah being sorry. Read it level.
- **Nothing to avoid on pronunciation.** There is no jargon left in the script by
  design — no interface names, no numbers read aloud, no command syntax.

## Music

Optional, and easy to get wrong here. A swelling resolve at line 6 would turn the
proof into a rescue, which is the exact feeling the brand kit rejects — "relief,
not rescue," and no theater.

If you use a bed: something flat and unhurried, no percussion build, no cymbal
swell at the fix. It should be nearly subliminal — mixed around **−26 to −30 dBFS**
under the voice — and it should not change dynamics between scene 5 and scene 6.
Silence is a legitimate choice and is probably the safer one.

## Delivering the audio

There are two routes, and the right one depends on who is reading.

### Route A — one continuous file (a human take)

Record against the timing sheet above, 48 kHz, mono is fine. Leave the head
silent until 0:00.5 and hold the pauses between lines. Deliver a single 57.00s
file, so nothing can drift.

```
video/public/audio/voiceover.mp3
```

```ts
// video/src/Video.tsx
const AUDIO = { voiceover: true, voiceoverLines: false, music: false };
```

### Route B — eight clips, one per line (synthesised speech, or stems)

Synthesised speech cannot hold a six-second pause between lines, so a single
generated file will not land on the marks. Generate each line separately instead
and let Remotion place them.

```
video/public/audio/vo-1.wav   … through …   vo-8.wav
```

Piper can generate all eight for you:

```bash
pip install piper-tts
# grab a voice + its sidecar from huggingface.co/rhasspy/piper-voices
cd video && ./scripts/make-vo.sh ~/voices/en_US-ryan-high.onnx
```

It prints each clip's length against its budget and flags any line that would
collide with the next one.

```ts
const AUDIO = { voiceover: false, voiceoverLines: true, music: false };
```

**Each clip must start speaking immediately.** Remotion positions them at
`VO_MARKS` in `src/Video.tsx` — 15, 135, 306, 588, 855, 1038, 1317, 1572 frames.
Padding a head with silence pushes that line late by exactly that much.

This route is also the better one for a human take you expect to revise: a line
that reads wrong can be re-recorded on its own.

### Route C — no audio file at all: let the browser speak it

`present.html` plays the MP4 and speaks each line at its mark using the viewer's
own browser voices. No file to record, nothing to download, no API key. Open it
next to the render:

```bash
open video/present.html     # or just double-click it
```

`present.html` uses relative paths, so it only works **in the repo**, next to
`renders/` and `public/`. To send it to someone, build the standalone copy — it
inlines the video and the fonts, so there is nothing left to go missing:

```bash
python3 scripts/build-standalone.py     # → renders/noah-presentation.html, ~6.3 MB
```

Pick a voice and a pace at the top; click any transcript line to jump there.

Use **Microsoft Edge** — it exposes 250+ Microsoft Natural voices, which are far
better than anything else free, and better than Piper. Chrome has about 19.
Headless browsers and most Linux installs report none at all, and the page says
so plainly rather than playing silence.

The catch: this is live playback, not a file. The Web Speech API does not expose
the synthesised audio stream, so it cannot be captured — there is no way to turn
this route into an MP4 with a baked-in track. It is a presentation surface, not
an export. If you need a distributable file with audio, use Route A or B.

Its marks live in `LINES` in `present.html`, in seconds — the same instants as
`VO_MARKS` in `src/Video.tsx`. Change one and change the other.

### Then, for routes A and B

```bash
npx remotion render src/index.ts NoahGoogleSlow out/noah-google-takes-forever-to-load.mp4
```

All three flags are `false` by default, and a missing file with its flag off
costs nothing. Turning a flag on without the files present will fail the render —
that is deliberate, so a silent video never ships by accident.

## If the timings need to move

The scene lengths live in `SCENES` in `src/Video.tsx`, in frames at 30 fps. A read
that runs long is better fixed by lengthening the scene than by speeding up the
voice — the pacing is part of the brand, the frame count is not.

| Scene | Frames | In | Out | Length |
|---|---|---|---|---|
| symptom | 0–120 | 0:00.00 | 0:04.00 | 4.00s |
| not-junk | 120–285 | 0:04.00 | 0:09.50 | 5.50s |
| diagnose | 285–570 | 0:09.50 | 0:19.00 | 9.50s |
| approve | 570–840 | 0:19.00 | 0:28.00 | 9.00s |
| run | 840–1020 | 0:28.00 | 0:34.00 | 6.00s |
| proof | 1020–1305 | 0:34.00 | 0:43.50 | 9.50s |
| caveat | 1305–1560 | 0:43.50 | 0:52.00 | 8.50s |
| end | 1560–1710 | 0:52.00 | 0:57.00 | 5.00s |
