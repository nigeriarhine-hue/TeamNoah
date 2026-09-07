# Music

34 seconds, one continuous cue with a hard structural break on the approval click at frame 534.

The brief for the composer in one line: **the music is anxious because the machine is anxious, and
it resolves because a person made a decision — not because the software did something clever.**

---

## Generation prompt

Paste into Suno, Udio, ElevenLabs Music, or hand to a composer as a brief.

> Restrained cinematic electronic score for a premium technology commercial, 34 seconds, 82 BPM,
> A minor resolving to A major. Opens with a low 38 Hz sub drone and a sparse, dry, muted
> electronic pulse — tense but controlled, no drums, lots of space. Around eight seconds a
> precise ticking sixteenth-note figure enters on a soft filtered synth, mechanical and
> unhurried, building quiet momentum without ever becoming a beat. At seventeen seconds
> everything thins and a single warm low-mid piano-and-strings chord arrives — a small reveal,
> intimate rather than triumphant — then reduces to one sustained held note. At twenty-two
> seconds there is one full second of complete silence. The music restarts warmer and cleaner
> with soft analogue keys and a gentle rising arpeggio, optimistic and calm, opening up over the
> final ten seconds and thinning to almost nothing. Ends with two clean bell-like synth notes, a
> perfect fifth apart, the second one lower and settling. Sparse, spacious, expensive, human.

**Negative prompt**

> drums, drum kit, trap hi-hats, EDM drop, build-up riser, white-noise sweep, orchestral hit,
> epic trailer brass, choir, vocals, singing, dubstep, distorted bass, aggressive synth, arena
> reverb, sidechain pumping, corporate ukulele, whistling, hand claps, tension strings tremolo,
> horror stinger, cyberpunk arpeggio, retrowave, chiptune, triumphant fanfare, key change lift

## Structure map

| Frames | TC | Section | What it does |
|---|---|---|---|
| 0–78 | 00:00 – 00:03:06 | **Drone only** | 38 Hz sub, nothing else. Barely music. |
| 78–231 | 00:03:06 – 00:09:15 | **Low tension** | Sub swells; a sparse muted pulse joins, dry, no reverb tail. |
| 231–260 | 00:09:15 – 00:10:20 | **Silence** | Out completely for the stopwatch. First use of absence — it teaches the audience that this film uses silence deliberately, which is what makes clips 14–15 land later. |
| 260–404 | 00:10:20 – 00:16:20 | **Precision** | The ticking sixteenth figure. Mechanical, unhurried. Builds by *addition*, never by getting louder. |
| 404–457 | 00:16:20 – 00:19:01 | **The reveal** | One warm low-mid chord. The whole arrangement drops away beneath it. Small, not grand — a discovery, not a victory. |
| 457–510 | 00:19:01 – 00:21:06 | **The held note** | Everything reduces to one sustained tone under the proposal. Unresolved on purpose: Noah is waiting. |
| 510–534 | 00:21:06 – 00:22:06 | **Silence** | **Out entirely.** One full second. The gap in which she decides. |
| 534–606 | 00:22:06 – 00:25:06 | **The turn** | Restarts *on the click.* Warmer, cleaner — analogue keys, soft rising arpeggio. Same tempo, new key. |
| 606–683 | 00:25:06 – 00:28:11 | **Open** | Widest and warmest the cue gets. Still restrained. |
| 683–750 | 00:28:11 – 00:31:06 | **Thin out** | Reduces to keys and air as the camera pulls back. |
| 750–816 | 00:31:06 – 00:34:00 | **Sonic logo** | Two notes. Second lands on "Done." Then digital silence. |

## The three rules

1. **The click at frame 534 is the downbeat.** The second half of the cue starts there, not a
   frame before or after. Deliver the cue in two stems split at 534 so the edit can nudge without
   a re-render.
2. **Build by addition, never by volume.** The score gets denser through the diagnosis and then
   *empties*. A cue that swells into the reveal makes Noah look like it is performing, and
   performing is precisely what `brand-kit.html` says the brand exists to be the opposite of.
3. **No riser into the approval.** Every ad in this category puts a white-noise sweep before the
   product does its trick. Ours puts a second of silence there. That contrast is worth more than
   any sound you could add.

## The sonic logo

Two notes, roughly a perfect fifth apart, the second lower and settling — the melodic shape of a
level line, and the same "coming to rest" the mark is about.

- Soft bell-like synth, long-ish decay, no reverb wash.
- **Note 1 at frame 750** — the frame the mark appears, and the frame VO line 11 ("Noah.")
  resolves.
- **Note 2 at frame 806** — under the word "Done."
- Keep it under −18 dB. A loud sting undoes 33 seconds of restraint.
- Have it built as a standalone 2-second asset at 48kHz; it will outlive this campaign and wants
  to exist independently of the cue.

## Deliverables from the composer

```
noah_battery_music_full_34s.wav          48k/24-bit stereo
noah_battery_music_stemA_0-534.wav       act I–III
noah_battery_music_stemB_534-816.wav     act IV–V, starts on the click
noah_battery_music_stems/                sub · pulse · ticking · keys · pad · logo
noah_sonic_logo_2s.wav                   standalone
noah_battery_music_30s_alt.wav           for the tight-30 cut in 03-voiceover.md
```

Separate stems matter more than usual here, because the fan sits in the same low-mid range as the
pad and the two will need to be carved against each other in the mix.
