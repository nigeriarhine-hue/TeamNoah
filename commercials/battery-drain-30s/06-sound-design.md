# Sound design

24fps, 816 frames. The mix has one job: **make an invisible problem audible, then take it away.**

The laptop fan is the spot's antagonist. It comes up under the diagnosis, ducks at the moment of
understanding, and falls away for good in clip 17. If the audience notices the fan only when it
stops, the sound design has worked.

---

## Frame-accurate SFX timeline

| Frame | TC | Clip | Event | Level | Note |
|---|---|---|---|---|---|
| 0 | 00:00:00 | 01 | Room tone in | −48 dB | Night-room bed: fridge hum two rooms away, faint street. Continuous to 816. |
| 0 | 00:00:00 | 01 | Laptop fan in | −34 dB | **Real recorded fan.** Never a synth pad — a synth reads as score, and this has to read as the machine. |
| 0–78 | | 01 | Typing | −26 dB | Unhurried, thinning to nothing as her hands stop at ~70. |
| 78 | 00:03:06 | 02 | Sub-bass swell in | −30 dB | 38 Hz, slow rise. The only "score" element in Act I. |
| 100 | 00:04:04 | 02 | Number tick | −24 dB | Soft, under the rack. One tick, not three. |
| 150 | 00:06:06 | 04 | *(VO line 2 in)* | | |
| 185 | 00:07:17 | 04 | Connector release | −20 dB | Small plastic-and-metal click, very close, dry. |
| 187 | 00:07:19 | 04 | **Power-source-changed chime** | −18 dB | Replaces the brief's low-battery alert. At 29% no alert fires; inventing one is the fake scare `brand-kit.html` refuses. See `00-brand-notes` §5. |
| 192 | 00:08:00 | 04 | Cable settles on wood | −28 dB | |
| 205 | 00:08:13 | 05 | Number tick | −24 dB | A semitone below the frame-100 tick. Descending. |
| 231 | 00:09:15 | 06 | **Everything out but room tone** | | Fan, sub and music all cut. A 29-frame hole. |
| 236 | 00:09:20 | 06 | Single clock tick | −26 dB | The only event in the hole. |
| 260 | 00:10:20 | 07 | Fan back in, music in | −32 dB | |
| 260–332 | | 07–08 | Typing | −22 dB | Forward in the mix — her voice in the film is her hands. |
| 325 | 00:13:13 | 08 | Return key, then send tone | −20 / −24 dB | Send tone is one soft sine blip, 880 Hz, 40ms. |
| 332 | 00:13:20 | 09 | **Fan up** | −22 dB | Loudest the machine gets. |
| 360 | 00:15:00 | 10 | Diagnostic tick 1 | −26 dB | |
| 370 | 00:15:10 | 10 | Diagnostic tick 2 | −26 dB | +2 semitones |
| 380 | 00:15:20 | 10 | Diagnostic tick 3 | −26 dB | +2 semitones |
| 392 | 00:16:08 | 11 | Skin releasing from metal | −24 dB | Very close, slightly tacky. Sells the heat better than any visual could. |
| 396 | 00:16:12 | 11 | Fan begins to duck | → −30 dB | Over 8 frames. |
| 404 | 00:16:20 | 12 | **Reveal chord** | −20 dB | Warm low-mid. The mix gets *quieter* at the moment of understanding, not louder. |
| 430 | 00:17:22 | 12 | Confirmation tone | −26 dB | Under the mono readout line. |
| 490–510 | | 13 | **Near-silence** | | Room tone and ducked fan only. The sound of a machine waiting for a human. |
| 510 | 00:21:06 | 14 | **Music out entirely** | | |
| 522 | 00:21:18 | 14 | Skin on glass | −28 dB | One soft contact. |
| **534** | **00:22:06** | **15** | **THE APPROVAL CLICK** | **−8 dB** | A trackpad haptic *thunk* — low, dry, weighted. **Not a mouse click.** Two frames of silence either side. Top of the SFX bus and the loudest single event in the film. |
| 534 | 00:22:06 | 15 | Music restarts, warm | −26 dB | The click is the downbeat of the second half. |
| 560 | 00:23:08 | 16 | Confirmation tone 1 | −24 dB | |
| 574 | 00:23:22 | 16 | Confirmation tone 2 | −24 dB | A fourth above. Ascending, resolved. |
| 587–606 | 00:24:11 | 17 | **The fan falls away** | −30 → −∞ | Automate as a slow fall across all 19 frames. Never a cut. This is the most satisfying sound event in the spot and the entire film has been setting it up. |
| 640 | 00:26:16 | 18 | Confirmation tone | −24 dB | As the estimate settles. |
| 665 | 00:27:17 | 19 | Her breath out | −24 dB | Close, unforced. Do not add a sigh. |
| 683–750 | | 20 | Typing | −28 dB | Easier and lighter than clip 01. Same performer, different posture. |
| 742–750 | | 20 | Room tone thins | −52 dB | Under the dip to black. |
| 750 | 00:31:06 | 21 | Sonic logo, note 1 | −18 dB | |
| 806 | 00:33:14 | 21 | Sonic logo, note 2 | −18 dB | **Lands on the word "Done."** |
| 810–816 | | 21 | Fall to digital silence | | Six frames. End on true zero, not on a fade tail. |

## The fan is the whole design

| Frames | Level | What the audience feels |
|---|---|---|
| 0–231 | −34 dB | Something is on. Nobody notices. |
| 231–260 | silent | The stopwatch beat. Absence used once, early, so the ending has a precedent. |
| 260–332 | −32 dB | It's back, and now you've been made aware of it. |
| 332–396 | −22 dB | It's *loud.* The machine is working and nobody asked it to. |
| 396–587 | −30 dB | Ducked under the diagnosis. Still there. Still wrong. |
| 587–606 | fall to −∞ | Gone. |
| 606–816 | silent | The room the film has been promising. |

Record the fan yourself, on the machine you're shooting, at the two states — under load and at
idle. Library fan loops are all recorded on desktop towers and sound like a different object.

## Sourcing

- **Trackpad click.** Record a real Force Touch trackpad with a contact mic taped to the underside
  of the palm rest. The haptic engine's thunk is a physical event with a low-frequency component
  that no library "UI click" has, and this is the most important sound in the film.
- **Keystrokes.** Same laptop, same session as the fan. Record twice — tense (clip 01) and easy
  (clip 20). The difference is a performance note, not an EQ move.
- **Diagnostic and confirmation tones.** Synthesise. Pure sines, 30–50ms, gentle 5ms attack and a
  short exponential decay. Keep them under −24 dB; if a tone draws attention to itself it has
  become interface theatre.
- **Power chime.** Record from a real Mac. Do not reuse a system sound file wholesale in a paid
  ad — re-record the event, or design a near-neighbour.
- **Room tone.** Ten unbroken minutes from the actual location, at the actual hour. There is no
  substitute and it is the cheapest thing on this list.

## Mix

| Bus | Target | Note |
|---|---|---|
| VO | −18 dBFS avg | Always intelligible. It never fights an SFX; SFX duck to it, never the reverse. |
| SFX | −24 dBFS avg | Except the click at −8. |
| Music | −28 dBFS avg | Never above the VO. |
| **Integrated** | **−23 LUFS** broadcast (EBU R128) / **−14 LUFS** web and social | Deliver both. |
| True peak | **−1 dBTP** | Hard ceiling. |

- **Dynamic range is the point.** Resist the urge to compress this into a wall. The film's argument
  is that things get quieter, and a heavily limited master destroys it.
- **Mix a mono fold-down and check it.** Most of this will be watched on a phone speaker, where
  the fan and the click are the only two things that survive. Make sure both do.
- **Deliver a no-VO version** (M&E) for territories and for social cuts that run with captions.
