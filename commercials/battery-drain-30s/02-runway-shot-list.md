# Runway shot list — all 21 clips

Every clip carries the 16 required fields. Prompts are written to be pasted directly.

**Before you generate a single clip, read "Step 0" below.** Image-to-video from locked reference
frames is the difference between a commercial and twenty-one strangers in twenty-one rooms.

---

## Step 0 — Lock the reference frames first

Generate these five stills in an image model (Runway's image generation with References, or any
strong stills model), pick one of each, and **never regenerate them.** Every video clip is then
image-to-video from a still derived from these. This is the entire consistency strategy.

**REF-A — the actor**
> Editorial portrait of a 33-year-old woman seated at a desk at night, mid-brown shoulder-length hair loosely tied back with loose strands at the temple, minimal makeup, small silver stud earrings, no rings, no watch, charcoal heather cotton crewneck sweatshirt with sleeves pushed to mid-forearm, calm tired expression, lit from below and in front by a laptop screen at 6000K with a warm 2700K desk lamp filling from camera left, deep blue night window behind camera right, shot on ARRI Alexa with a 50mm lens at T2.0, shallow depth of field, natural skin texture, warm lifted shadows, muted colour, premium commercial photography

**REF-B — the room, wide**
> Small home office at night, warm walnut desk against a cream wall, matte black articulated desk lamp at camera left with the shade tipped down, window at camera right showing deep blue night behind a half-drawn linen curtain, a stoneware mug, a paperback face down, a small trailing pothos, a coiled USB-C cable and a compact charger on the desk, a 14-inch space-grey aluminium laptop open at 105 degrees with a glowing screen, no logos anywhere, uncluttered and calm, shot on ARRI Alexa with a 35mm lens at T2.8, shallow depth of field, warm lifted shadows, premium commercial cinematography

**REF-C — the laptop hero**
> Product photograph of a 14-inch space-grey aluminium laptop open at 105 degrees on a warm walnut desk at night, no brand logo on the lid or bezel, screen glowing a soft dark blue, warm desk lamp raking across the aluminium from camera left, reflection of the screen in the polished desk surface, shot on ARRI Alexa with a 50mm macro lens at T2.8, extremely shallow depth of field, premium technology commercial photography

**REF-D — the hands**
> Macro photograph of a woman's hands resting on a laptop keyboard at night, short unpainted nails, no rings, no watch, natural skin texture, screen light from above and warm lamp light from camera left, shot on ARRI Alexa with a 100mm macro lens at T2.8, extremely shallow depth of field, premium commercial photography

**REF-E — the screen plate**
> Extreme close-up of a laptop screen at night showing a soft dark blue interface, all text deliberately out of focus and illegible, visible pixel structure and faint screen texture, the bezel and a sliver of aluminium in the frame, reflection of a warm lamp across the glass, shot on ARRI Alexa with a 100mm macro lens at T2.0, extremely shallow depth of field

## BASE-NEG — paste into every clip

Each shot below says `BASE-NEG plus: …`. Use this block plus the shot's own additions.

> warped hands, extra fingers, missing fingers, fused fingers, distorted anatomy, duplicated limbs, warped laptop, bent screen, melting furniture, morphing objects, unreadable interface, gibberish text, garbled letters, fake user interface, invented UI, floating holograms, floating panels, HUD overlay, sci-fi interface, matrix rain, circuit boards, motherboard, server room, data centre, neon, cyberpunk, glowing grids, virtual ID card, superhero pose, cape, mascot, boat, ark, flood, storm, lightning, dramatic lighting, hard rim light, god rays, volumetric haze, smoke, lens flare, teal and orange grade, oversaturated, HDR halo, heavy vignette, beauty filter, plastic skin, over-smoothed skin, cartoon, anime, 3D render, CGI look, stock photo smile, exaggerated expression, looking at camera, watermark, logo, subtitles, captions, on-screen text, timestamp, whip pan, crash zoom, camera shake, rolling shutter wobble, jump cut, flicker, strobing, low resolution, compression artifacts

---

# ACT I

## SHOT 01

- **SHOT NUMBER** 01 · `LIVE` · frames 0–78 · **00:00:00 → 00:03:06**
- **DURATION** 3.25s (generate 5s, use the first 3.5s)
- **PURPOSE** Establish the person, the room and the hour. Buy the audience's trust before asking for their attention. This shot sells "premium."
- **CAMERA ANGLE** Wide, eye level, from behind and slightly camera-left of her shoulder so the screen's glow reads on her cheek. 35mm.
- **CAMERA MOVEMENT** Slow dolly push straight in, roughly 25cm over the shot. Constant velocity, no ease. Micro-handheld float ±2px.
- **SUBJECT** REF-A in REF-B. Woman, 33, charcoal crewneck, at the walnut desk.
- **ACTION** She is typing, unhurried. Near the end of the shot her typing slows and stops, hands resting on the keys. That stop is the cut point.
- **LIGHTING** Screen key from front-low, 6000K. Desk lamp fill camera-left, 2700K, one stop under. Cool window ambience behind camera-right, two stops under. 4:1 on her face.
- **ENVIRONMENT** Night home office. Cream wall, walnut desk, linen curtain half drawn, mug, paperback, pothos, coiled USB-C cable, compact charger.
- **RUNWAY VIDEO PROMPT**
  > A woman in a charcoal crewneck sweatshirt sits typing at a warm walnut desk in a small home office at night, her face lit from below by the glow of a 14-inch space-grey laptop screen, a warm desk lamp burning at camera left, deep blue night in the window behind her, the camera dollies slowly and steadily forward toward her, her typing gradually slows and her hands come to rest on the keys, shallow depth of field, realistic motion blur, 35mm anamorphic-style framing, ARRI Alexa look, premium technology commercial, subtle handheld micro-movement
- **NEGATIVE PROMPT** `BASE-NEG` plus: fast typing, frantic movement, head turning to camera, second person in the room, ceiling light, overhead light, bright room, daytime, clutter
- **START FRAME** Wide. She is centred slightly camera-right, screen glow on her face, lamp flare at frame left. The desk runs out of focus toward camera.
- **END FRAME** The same composition, 25cm closer. Her hands are still on the keys. The screen's top-right corner is now readable enough to matter — that is where clip 02 goes.
- **VOICEOVER** *(in at 00:01:04)* "Your battery shouldn't disappear this fast."
- **SOUND EFFECT** Room tone. Keyboard typing, soft, unamplified, thinning to nothing as her hands stop. A laptop fan at the edge of audibility — set it just loud enough that removing it in clip 20 is felt.
- **TRANSITION TO NEXT** Hard cut on her hands stopping. No dissolve.

## SHOT 02

- **SHOT NUMBER** 02 · `PLATE+UI` (UI-01) · frames 78–121 · **00:03:06 → 00:05:01**
- **DURATION** 1.79s (generate 5s of plate, use any stable 2s)
- **PURPOSE** The inciting image. It is plugged in and it is still going down.
- **CAMERA ANGLE** Extreme close-up on the top-right corner of the screen, square to the glass, 100mm macro.
- **CAMERA MOVEMENT** Slider drift 3cm to camera-right. Rack focus resolves from soft to sharp across the first 12 frames.
- **SUBJECT** The menu-bar battery cluster. Charging bolt lit, percentage falling.
- **ACTION** **41%**, held. At frame 22 the focus slips soft for 4 frames and returns on **38%.** The rack *is* the ellipsis — see `04-onscreen-text.md`, rule 1. Never tick a percentage inside continuous sharp time.
- **LIGHTING** Screen self-lit. A soft warm lamp reflection travels across the glass as the slider moves. Everything outside the panel falls to black.
- **ENVIRONMENT** Only glass, pixels, a sliver of the bezel and the aluminium lid edge.
- **RUNWAY VIDEO PROMPT** *(plate only — leave the screen illegible, the UI is composited)*
  > Extreme close-up macro of the top corner of a laptop screen at night, soft dark blue interface glow with deliberately out-of-focus illegible text, faint pixel structure visible in the glass, the dark bezel and a sliver of grey aluminium at the edge of frame, a warm lamp reflection sliding slowly across the glass as the camera drifts gently to the right, extremely shallow depth of field, 100mm macro, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: readable text, numbers, icons, sharp interface, menu bar, cursor, glare hotspot, moiré, rainbow fringing
- **START FRAME** Soft. A blue-grey field with the bezel dark at frame right. Lamp reflection entering from the left edge.
- **END FRAME** Sharp on the panel. Lamp reflection has crossed to centre. UI-01 sits comped in the upper-right eighth of frame reading **38%** with the bolt.
- **VOICEOVER** *(none — let the number land in silence)*
- **SOUND EFFECT** A single low sub-bass swell under the first number change. Faint electrical hum in the glass. Fan holds.
- **TRANSITION TO NEXT** Hard cut.

## SHOT 03

- **SHOT NUMBER** 03 · `LIVE` · frames 121–159 · **00:05:01 → 00:06:15**
- **DURATION** 1.58s (generate 5s, use the 1.6s around the expression change)
- **PURPOSE** Give the number a human cost. Authentic, not performed.
- **CAMERA ANGLE** Close-up, 50mm, slightly below her eyeline so the screen light is the obvious source.
- **CAMERA MOVEMENT** Almost still. A 2cm push. Micro-handheld float.
- **SUBJECT** REF-A. Her face.
- **ACTION** Her eyes flick to the corner of the screen. A small breath out through the nose. Her brow tightens perhaps two millimetres. **Direct the actor down, not up** — the note is "you've seen this before and you're tired of it," never "oh no."
- **LIGHTING** Screen key from front-low. Lamp fill camera-left catching the edge of her cheek and one earring. Window cool on the far shoulder.
- **ENVIRONMENT** The wall and lamp are a soft warm blur behind her.
- **RUNWAY VIDEO PROMPT**
  > Close-up of a 33-year-old woman's face at night, lit from below by the cool glow of a laptop screen with a warm lamp filling from camera left, her eyes flick upward to the corner of the screen, she exhales softly through her nose and her brow tightens very slightly in quiet tired frustration, she does not look at the camera, the camera pushes in almost imperceptibly, 50mm lens, shallow depth of field, natural skin texture, realistic motion blur, ARRI Alexa look, premium commercial, subtle handheld micro-movement
- **NEGATIVE PROMPT** `BASE-NEG` plus: wide eyes, shock, anger, mouth open, head shake, hand to face, smiling, blinking rapidly, theatrical expression, looking at camera
- **START FRAME** Her eyes are on the centre of the screen, neutral.
- **END FRAME** Eyes settled up-right, brow just tightened, mid-exhale. Hold two frames past the peak before cutting.
- **VOICEOVER** *(none)*
- **SOUND EFFECT** Her breath, close and dry. Room tone. Fan continues.
- **TRANSITION TO NEXT** Hard cut.

## SHOT 04

- **SHOT NUMBER** 04 · `LIVE` · frames 159–197 · **00:06:15 → 00:08:05**
- **DURATION** 1.58s (generate 5s, use the 1.6s of the pull)
- **PURPOSE** She investigates. This is a person taking a measurement, not a victim. It also sets up the honest chime that replaces the fake low-battery alert.
- **CAMERA ANGLE** Macro, 100mm, low and level with the desk, framed on the laptop's left-side port.
- **CAMERA MOVEMENT** Locked, with a 1cm float. The movement in frame is hers.
- **SUBJECT** REF-D. Her right hand, the USB-C connector, the port.
- **ACTION** Her thumb and forefinger close on the connector and draw it straight out. The cable falls slack. The compact charger sits behind, small and clearly low-wattage.
- **LIGHTING** Lamp raking hard across the aluminium from camera-left, catching the machined port edge. Screen spill from above. The background falls off to near black.
- **ENVIRONMENT** Walnut grain, out-of-focus mug, coiled cable, compact charger.
- **RUNWAY VIDEO PROMPT**
  > Macro shot at desk level of a woman's hand with short unpainted nails and no rings taking hold of a USB-C connector plugged into the side of a space-grey aluminium laptop and pulling it smoothly straight out, the cable falling slack onto the warm walnut desk, a small compact charger out of focus behind, warm lamp light raking across the machined aluminium edge, night, extremely shallow depth of field, 100mm macro lens, realistic motion blur, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: rings, watch, bracelet, painted nails, long nails, two hands, yanking, fast movement, cable whipping, large power brick, visible logo on charger
- **START FRAME** Fingers approaching the connector, cable still taut and seated.
- **END FRAME** Connector clear of the port by ~4cm, cable slack, the port dark and empty in sharp focus.
- **VOICEOVER** *(line 2 in at 00:06:06, running under 04 and 05)* "Cleaning random files won't tell you why."
- **SOUND EFFECT** The small plastic-and-metal release of the connector. **Power-source-changed chime** on the frame the connector clears the port — see `00-brand-notes` §5. Cable settling on wood.
- **TRANSITION TO NEXT** Hard cut on the connector clearing the port.

## SHOT 05

- **SHOT NUMBER** 05 · `PLATE+UI` (UI-02) · frames 197–231 · **00:08:05 → 00:09:15**
- **DURATION** 1.42s
- **PURPOSE** Confirm the test result. Off mains, it falls faster.
- **CAMERA ANGLE** The same extreme close-up as clip 02, moved ~10° so the audience reads "same place, later" rather than "same shot reused." 100mm macro.
- **CAMERA MOVEMENT** Slider drift 3cm to camera-**left** — the reverse of clip 02, which subliminally marks it as a second reading.
- **SUBJECT** The battery cluster, bolt now absent.
- **ACTION** **34%**, a soft frame at 12, back sharp on **29%.** The soft frame is shorter than clip 02's, which makes the second reading feel closer to the first.
- **LIGHTING** As clip 02, reflection travelling the opposite way.
- **ENVIRONMENT** Glass, bezel, aluminium sliver.
- **RUNWAY VIDEO PROMPT**
  > Extreme close-up macro of the top corner of a laptop screen at night, soft dark blue interface glow with deliberately out-of-focus illegible text, faint pixel structure in the glass, dark bezel and a sliver of grey aluminium at frame edge, a warm lamp reflection sliding slowly across the glass as the camera drifts gently to the left, extremely shallow depth of field, 100mm macro, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: readable text, numbers, icons, sharp interface, cursor, glare hotspot, moiré, rainbow fringing
- **START FRAME** Sharp on the panel, reflection at frame right. UI-02 comped reading **34%**, no bolt.
- **END FRAME** Reflection at frame left. UI-02 reading **29%**.
- **VOICEOVER** *(continuing from 04)* "…won't tell you why."
- **SOUND EFFECT** Two soft ticks under the number changes, a semitone apart, descending. Low sub swell continues.
- **TRANSITION TO NEXT** Hard cut.

## SHOT 06

- **SHOT NUMBER** 06 · `PLATE+UI` (UI-03) · frames 231–260 · **00:09:15 → 00:10:20**
- **DURATION** 1.21s
- **PURPOSE** The scale of the problem in one number, with no dialogue. Twelve points, fifteen minutes.
- **CAMERA ANGLE** Macro from a steep top-down three-quarter, 100mm, phone flat on the walnut.
- **CAMERA MOVEMENT** Slow drift down and across, 2cm. The stopwatch stays in the sharp plane.
- **SUBJECT** Her phone, face up beside the laptop.
- **ACTION** The stopwatch runs. Hundredths blur. It reads **00:15:12** and keeps climbing.
- **LIGHTING** Lamp warm from camera-left. Screen spill cool from the laptop at frame edge. The phone's own light is the brightest thing.
- **ENVIRONMENT** Walnut grain in extreme close focus, laptop edge out of focus behind.
- **RUNWAY VIDEO PROMPT** *(plate only)*
  > Macro shot looking down at a smartphone lying face up on a warm walnut desk at night beside the edge of a laptop, the phone screen glowing with a soft dark interface whose text is deliberately out of focus and illegible, warm lamp light from camera left and cool screen spill from the right, the camera drifts slowly down and across the desk, extremely shallow depth of field, 100mm macro, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: readable text, numbers, app icons, notification banners, hand in frame, phone case with logo, cracked screen, reflection of a face
- **START FRAME** Phone screen a soft bright rectangle, walnut grain sharp in the foreground.
- **END FRAME** Phone screen centred and sharp, UI-03 comped: stopwatch **00:15:12**. Twelve points in fifteen minutes — the arithmetic the audience does without being asked.
- **VOICEOVER** *(none — this beat is silent by design)*
- **SOUND EFFECT** Everything drops away except a single soft clock tick and room tone. **Cut the fan here** — a one-second hole in the sound bed makes the number land.
- **TRANSITION TO NEXT** Hard cut. Music re-enters on the cut.

---

# ACT II

## SHOT 07

- **SHOT NUMBER** 07 · `LIVE` · frames 260–294 · **00:10:20 → 00:12:06**
- **DURATION** 1.42s (generate 5s, use 1.5s of steady typing)
- **PURPOSE** She asks, in her own words. The brand's first belief made physical.
- **CAMERA ANGLE** Macro across the keyboard at key height, 100mm, looking along the rows so the keys recede out of focus.
- **CAMERA MOVEMENT** Slider travels right-to-left along the keyboard, 8cm, steady.
- **SUBJECT** REF-D. Her hands typing.
- **ACTION** Fingers type at a normal, considered pace — someone writing a sentence, not hammering. Two or three keystrokes are clearly visible in the sharp plane.
- **LIGHTING** Key backlight glowing from under the caps, lamp raking from camera-left, screen spill from above and behind.
- **ENVIRONMENT** Keyboard filling frame. Trackpad a soft shape at the bottom edge.
- **RUNWAY VIDEO PROMPT**
  > Macro shot along the surface of a backlit laptop keyboard at night, a woman's fingers with short unpainted nails and no rings typing at a calm considered pace, keys depressing visibly one after another, warm lamp light raking from camera left and cool screen light spilling from above, the camera slides steadily along the keyboard from right to left, extremely shallow depth of field, 100mm macro lens, realistic motion blur, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: rings, watch, painted nails, frantic typing, hammering keys, readable key legends, visible logo, sparks, glowing keys, RGB keyboard, gaming keyboard
- **START FRAME** Keys sharp at frame right, fingers entering.
- **END FRAME** Fingers mid-keystroke centre-left, the row behind them dissolving into bokeh.
- **VOICEOVER** *(line 3 in at 00:10:18)* "Noah measures what's actually using your power."
- **SOUND EFFECT** Keystrokes, close and dry, slightly forward in the mix. First precise rhythmic music element enters here.
- **TRANSITION TO NEXT** Hard cut on a keystroke, on the frame the key bottoms out.

## SHOT 08

- **SHOT NUMBER** 08 · `PLATE+UI` (UI-04) · frames 294–332 · **00:12:06 → 00:13:20**
- **DURATION** 1.58s
- **PURPOSE** Show the plain-English input. The one moment the user's own voice is on screen.
- **CAMERA ANGLE** Close on the lower third of the screen where the composer sits, 50mm, square to the glass with a 5° offset so the panel has a face.
- **CAMERA MOVEMENT** Very slow push, 4cm.
- **SUBJECT** The Noah composer field.
- **ACTION** The last few words type in and the caret blinks once. **"My battery keeps dying way too fast."** Send.
- **LIGHTING** Screen self-lit, everything else black. A soft lamp bloom across the top-left of the glass.
- **ENVIRONMENT** Screen and a hint of bezel.
- **RUNWAY VIDEO PROMPT** *(plate only)*
  > Close-up of the lower portion of a laptop screen at night showing a soft dark blue application panel with deliberately out-of-focus illegible text, a faint warm lamp bloom across the upper left of the glass, the camera pushes in very slowly and steadily, extremely shallow depth of field, 50mm lens, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: readable text, cursor, typing animation, buttons, icons, window chrome, sharp interface, moiré
- **START FRAME** Soft dark panel, bloom upper-left. UI-04 comped with the sentence three words from complete.
- **END FRAME** Sentence complete, caret blinking, send control lit.
- **VOICEOVER** *(tail of the previous line)* "…using your power."
- **SOUND EFFECT** Final keystrokes matched to the typed characters. A soft return key. One quiet diagnostic UI tone on send.
- **TRANSITION TO NEXT** Hard cut.

## SHOT 09

- **SHOT NUMBER** 09 · `LIVE` · frames 332–356 · **00:13:20 → 00:14:20**
- **DURATION** 1.00s (generate 5s, use 1s of the hardest air movement)
- **PURPOSE** The symptom, felt physically. Sets up the payoff in clip 17 — **generate both from one reference frame.**
- **CAMERA ANGLE** Macro, 100mm, level with the desk, tight on the exhaust vent on the laptop's side.
- **CAMERA MOVEMENT** Locked with a 1cm float. Rack focus from the vent slats to the dust in the air beyond.
- **SUBJECT** The vent. Air. Dust in the lamp beam.
- **ACTION** Dust motes accelerate through the beam. A faint heat shimmer above the slats.
- **LIGHTING** Lamp beam from camera-left cutting hard across the vent — this is the one place a directional beam is allowed, and it exists to make the air visible, not to look dramatic.
- **ENVIRONMENT** Aluminium, machined slats, black beyond.
- **RUNWAY VIDEO PROMPT**
  > Extreme macro of the machined exhaust vent on the side of a space-grey aluminium laptop at night, dust motes moving quickly through a warm lamp beam crossing in front of the slats, a faint heat shimmer rising above the vent, the camera holds nearly still and the focus racks gently from the metal slats to the moving air beyond, extremely shallow depth of field, 100mm macro lens, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: visible fan blades spinning, smoke, steam, fire, sparks, glowing vent, orange heat glow, thermal imaging, infrared, condensation
- **START FRAME** Vent slats sharp, air beyond soft.
- **END FRAME** Slats soft, dust streaks sharp and moving fast in the beam.
- **VOICEOVER** *(none)*
- **SOUND EFFECT** **Fan up.** Push it forward here — this is the loudest the machine gets, and it must be a real recorded laptop fan, not a synth pad.
- **TRANSITION TO NEXT** Hard cut.

## SHOT 10

- **SHOT NUMBER** 10 · `PLATE+UI` (UI-05) · frames 356–385 · **00:14:20 → 00:16:01**
- **DURATION** 1.21s
- **PURPOSE** Show that Noah is *measuring*, by name. Not a progress bar, not a scan.
- **CAMERA ANGLE** Close on the mid-screen where the check list sits, 50mm, same 5° offset as clip 08.
- **CAMERA MOVEMENT** Slow slider down, 3cm, following the list as it ticks.
- **SUBJECT** Noah's diagnostic checklist.
- **ACTION** Named checks complete one by one, teal marks appearing. The third is mid-run with a sampling readout.
- **LIGHTING** Screen self-lit, black surround.
- **ENVIRONMENT** Screen only.
- **RUNWAY VIDEO PROMPT** *(plate only)*
  > Close-up of the middle of a laptop screen at night showing a soft dark blue application panel with deliberately out-of-focus illegible content, the camera slides slowly downward, faint pixel texture in the glass, extremely shallow depth of field, 50mm lens, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: readable text, progress bar, loading spinner, percentage, checkmarks, sharp interface, graphs, charts
- **START FRAME** Soft panel. UI-05 comped: two checks complete, third running.
- **END FRAME** Third check complete, fourth running, sampling counter advancing.
- **VOICEOVER** *(line 4 in at 00:14:14)* "It finds the process draining your battery…"
- **SOUND EFFECT** Three soft diagnostic ticks, one per completed check, rising in pitch. Fan still forward.
- **TRANSITION TO NEXT** Hard cut.

## SHOT 11

- **SHOT NUMBER** 11 · `LIVE` · frames 385–404 · **00:16:01 → 00:16:20**
- **DURATION** 0.79s (generate 5s, use the 0.8s of the lift)
- **PURPOSE** The last piece of physical evidence before the reveal. The machine is hot under her hand.
- **CAMERA ANGLE** Macro, 100mm, low three-quarter across the palm rest.
- **CAMERA MOVEMENT** Locked. 1cm float.
- **SUBJECT** REF-D. The heel of her right hand on the aluminium beside the trackpad.
- **ACTION** Her hand lifts perhaps 8mm off the surface and hovers — the involuntary flinch from something warmer than it should be. No look, no reaction shot. Just the hand.
- **LIGHTING** Lamp raking from camera-left across the brushed aluminium, screen spill cool from above.
- **ENVIRONMENT** Palm rest, trackpad edge, keyboard receding out of focus.
- **RUNWAY VIDEO PROMPT**
  > Macro shot of the heel of a woman's hand with short unpainted nails and no rings resting on the brushed aluminium palm rest of a laptop at night, the hand lifting very slightly off the warm surface and hovering, warm lamp light raking across the metal from camera left and cool screen light from above, camera locked off, extremely shallow depth of field, 100mm macro lens, realistic motion blur, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: rings, watch, painted nails, hand pulling away fast, shaking hand, both hands, sweat, steam, red skin, glowing metal
- **START FRAME** Hand flat on the aluminium, fully in contact.
- **END FRAME** Hand hovering ~8mm, fingers slightly spread, a thin dark gap between skin and metal.
- **VOICEOVER** *(tail)* "…draining your battery…"
- **SOUND EFFECT** Skin releasing from metal, very close. Fan begins to duck. Music holds a single sustained note — the breath before the reveal.
- **TRANSITION TO NEXT** Hard cut. **This is the act break; give it one extra frame of air in the sound mix, not in the picture.**

---

# ACT III — the centre of the film

## SHOT 12

- **SHOT NUMBER** 12 · `PLATE+UI` (UI-06) · frames 404–457 · **00:16:20 → 00:19:01**
- **DURATION** 2.21s
- **PURPOSE** Noah names the actual cause, specifically, in a sentence she could repeat to someone else. Specificity is the trust signal.
- **CAMERA ANGLE** Medium close on the screen, 50mm, the panel filling most of frame with a sliver of dark room at the edges to keep it physical.
- **CAMERA MOVEMENT** Slow push in, 5cm, easing gently to a stop on the last 12 frames so the sentence can be read at rest.
- **SUBJECT** The Noah finding card.
- **ACTION** The card is already present and settling; the mono readout line reveals last. No animation fireworks — the information is the event.
- **LIGHTING** Screen self-lit. A single soft lamp reflection held in the top-left corner of the glass to prove we are looking at a real screen.
- **ENVIRONMENT** Screen, bezel, a suggestion of the dark room around it.
- **RUNWAY VIDEO PROMPT** *(plate only)*
  > Medium close-up of a laptop screen at night filling most of the frame with a thin border of dark room visible at the edges, the screen showing a soft dark blue application panel with deliberately out-of-focus illegible content, a soft warm lamp reflection held in the upper left corner of the glass, the camera pushes in slowly and eases to a stop, shallow depth of field, 50mm lens, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: readable text, sharp interface, buttons, charts, graphs, alert icon, warning triangle, red colour, siren, flashing
- **START FRAME** Panel soft-focused, settling. UI-06 comped with the headline present and the mono line not yet in.
- **END FRAME** Camera at rest, panel sharp, full card readable: the eyebrow, the one-sentence cause, the mono readout, the plain-English explanation.
- **VOICEOVER** *(line 5 in at 00:17:08)* "…explains what it found…"
- **SOUND EFFECT** **The reveal.** A single warm low-mid chord under the card, one soft confirmation tone on the mono line. Fan now clearly ducked — the mix gets quieter at the moment of understanding, not louder.
- **TRANSITION TO NEXT** Hard cut. Do not dissolve; dissolving here reads as "time passing" and this is the same instant.

## SHOT 13

- **SHOT NUMBER** 13 · `PLATE+UI` (UI-07) · frames 457–510 · **00:19:01 → 00:21:06**
- **DURATION** 2.21s
- **PURPOSE** **The single most differentiating frame in the campaign.** Noah shows exactly what it will change and then stops, waiting. Protect this length before anything else in the edit.
- **CAMERA ANGLE** Same as 12, locked off. Deliberately still.
- **CAMERA MOVEMENT** **None.** The one completely static shot in the act. After eleven moving shots, stillness reads as gravity.
- **SUBJECT** The proposal card and the two buttons.
- **ACTION** Nothing happens. That is the action. The APPROVE button carries the Aurora gradient; `Not now` is a quiet ghost beside it. Noah is waiting.
- **LIGHTING** Screen self-lit, lamp reflection static in the corner.
- **ENVIRONMENT** As clip 12.
- **RUNWAY VIDEO PROMPT** *(plate only — a held plate; you may also freeze the last frame of clip 12's plate and add grain)*
  > Locked-off medium close-up of a laptop screen at night filling most of the frame with a thin border of dark room at the edges, the screen showing a soft dark blue application panel with deliberately out-of-focus illegible content, a static soft warm lamp reflection in the upper left of the glass, the camera does not move, very slight natural image noise, shallow depth of field, 50mm lens, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: camera movement, dolly, zoom, pan, readable text, buttons, cursor, sharp interface, flashing, pulsing glow
- **START FRAME** Full proposal card up: "What Noah will do", two numbered lines, the reassurance, the backup note, both buttons at rest.
- **END FRAME** Identical, plus a cursor that has arrived at the edge of the APPROVE button and stopped. Nothing has been clicked.
- **VOICEOVER** *(line 6 in at 00:19:06, running through clip 14 to 00:22:04)* "…and shows you exactly what it wants to change."
- **SOUND EFFECT** Music thins to a single sustained tone. Room tone and the ducked fan. **Leave 0.4s of near-silence at the tail** — the sound of a machine waiting for a human.
- **TRANSITION TO NEXT** Hard cut.

## SHOT 14

- **SHOT NUMBER** 14 · `LIVE` · frames 510–534 · **00:21:06 → 00:22:06**
- **DURATION** 1.00s (generate 5s, use the 1s of arrival and settle)
- **PURPOSE** The decision is hers. Give her the time to make it.
- **CAMERA ANGLE** Macro, 100mm, three-quarter above the trackpad.
- **CAMERA MOVEMENT** Locked, 1cm float.
- **SUBJECT** REF-D. Her right index finger arriving at the trackpad.
- **ACTION** The finger enters frame, travels, and **stops** on the glass without pressing. A held beat of contact.
- **LIGHTING** Screen key from above, lamp rake from camera-left across the glass trackpad.
- **ENVIRONMENT** Trackpad, palm rest, keyboard bokeh above.
- **RUNWAY VIDEO PROMPT**
  > Macro shot of a woman's right index finger with a short unpainted nail and no rings entering frame and coming to rest on the glass trackpad of a laptop at night without pressing, deliberate and unhurried, cool screen light from above and warm lamp light raking across the glass from camera left, camera locked off, extremely shallow depth of field, 100mm macro lens, realistic motion blur, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: rings, watch, painted nails, long nails, tapping repeatedly, hesitant trembling, multiple fingers, fingerprint smudges, mouse, external mouse
- **START FRAME** Finger just entering at frame right, trackpad empty and clean.
- **END FRAME** Fingertip at rest on the glass, pad slightly flattened by contact, not yet depressed.
- **VOICEOVER** *(line 6 continuing)* "…exactly what it wants to change." — **line 7 does not land here.** She acts first.
- **SOUND EFFECT** Near-silence. One soft skin-on-glass contact. **Music out completely for these 24 frames.**
- **TRANSITION TO NEXT** Hard cut.

## SHOT 15

- **SHOT NUMBER** 15 · `LIVE` · frames 534–553 · **00:22:06 → 00:23:01**
- **DURATION** 0.79s (generate 5s, use the 0.8s around the press)
- **PURPOSE** The gate opens, and a human opened it.
- **CAMERA ANGLE** Tighter macro on the same finger, 100mm, nearly level with the trackpad surface.
- **CAMERA MOVEMENT** Locked.
- **SUBJECT** The fingertip and the trackpad glass.
- **ACTION** The finger presses. The pad flattens, the glass gives its haptic click, the finger begins to release.
- **LIGHTING** As clip 14.
- **ENVIRONMENT** Trackpad filling frame.
- **RUNWAY VIDEO PROMPT**
  > Extreme macro nearly level with the surface of a laptop trackpad at night, a woman's fingertip pressing down firmly and decisively on the glass and beginning to lift, the fingerpad flattening under the pressure, cool screen light from above and warm lamp light raking across the glass, camera locked off, extremely shallow depth of field, 100mm macro lens, realistic motion blur, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: rings, painted nails, double tap, multiple taps, swiping, dragging, glowing trackpad, ripple effect, light burst, particle effect
- **START FRAME** Fingertip at rest, pad round.
- **END FRAME** Pad flattened at maximum compression, one frame before release.
- **VOICEOVER** *(none on the click itself. Line 7 lands 4 frames after it, at 00:22:10)* "You approve it." — the ordering is the argument: she moves, then the narrator names what she did.
- **SOUND EFFECT** **The approval click.** A trackpad haptic thunk, not a mouse click — dry, low, with weight. Sits at the top of the SFX bus. Everything else is silent for two frames on either side.
- **TRANSITION TO NEXT** Hard cut on the click frame. Music restarts warmer on this exact frame.

---

# ACT IV

## SHOT 16

- **SHOT NUMBER** 16 · `PLATE+UI` (UI-08) · frames 553–587 · **00:23:01 → 00:24:11**
- **DURATION** 1.42s
- **PURPOSE** Noah does only what it said, says what it did, and offers the undo. Honest, fast, unglamorous.
- **CAMERA ANGLE** As clips 12–13, 50mm.
- **CAMERA MOVEMENT** Very slow push, 3cm. Movement returns as the film starts breathing again.
- **SUBJECT** The status lines.
- **ACTION** Two lines confirm in teal, one after the other. **Done.** appears with the elapsed time **1.8s**. Beneath it, *Undo this change.*
- **LIGHTING** As clips 12–13.
- **ENVIRONMENT** As clips 12–13.
- **RUNWAY VIDEO PROMPT** *(plate only)*
  > Medium close-up of a laptop screen at night filling most of the frame with a thin border of dark room at the edges, the screen showing a soft dark blue application panel with deliberately out-of-focus illegible content, a soft warm lamp reflection in the upper left of the glass, the camera pushes in very slowly, shallow depth of field, 50mm lens, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: readable text, progress bar, loading bar, spinner, percentage counter, confetti, celebration, green tick burst, flashing
- **START FRAME** Panel with the first status line resolving.
- **END FRAME** Both lines confirmed, "Done." set, "1.8s" beside it, "Undo this change" beneath.
- **VOICEOVER** *(tail of line 7, out at 00:23:15)* "…approve it."
- **SOUND EFFECT** Two soft confirmation tones, a fourth apart, ascending. Warmer music has entered. Fan noticeably lower already.
- **TRANSITION TO NEXT** Hard cut.

## SHOT 17

- **SHOT NUMBER** 17 · `LIVE` · frames 587–606 · **00:24:11 → 00:25:06**
- **DURATION** 0.79s
- **PURPOSE** The payoff of clip 09. Physical proof, no interface involved. **Generate from the same reference frame as clip 09 so it reads as the same vent.**
- **CAMERA ANGLE** Identical to clip 09.
- **CAMERA MOVEMENT** Locked, 1cm float. No rack this time — stillness is the point.
- **SUBJECT** The vent, the beam, the air.
- **ACTION** The dust slows to a drift. The shimmer stops. The air goes still.
- **LIGHTING** Identical to clip 09.
- **ENVIRONMENT** Identical to clip 09.
- **RUNWAY VIDEO PROMPT**
  > Extreme macro of the machined exhaust vent on the side of a space-grey aluminium laptop at night, dust motes slowing almost to a stop and drifting gently in a warm lamp beam crossing in front of the slats, the heat shimmer above the vent fading away, the camera holds still, extremely shallow depth of field, 100mm macro lens, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: fast dust, turbulence, wind, visible fan blades, smoke, steam, glowing vent, orange heat glow, condensation, frost, ice
- **START FRAME** Dust still carrying some speed, shimmer just detectable.
- **END FRAME** Dust nearly suspended, air clear, shimmer gone.
- **VOICEOVER** *(line 8 in at 00:24:14)* "Then Noah checks again."
- **SOUND EFFECT** **The fan falls away** across these 19 frames — the single most satisfying sound event in the spot. Automate it as a slow fall, not a cut.
- **TRANSITION TO NEXT** Hard cut.

## SHOT 18

- **SHOT NUMBER** 18 · `PLATE+UI` (UI-09) · frames 606–659 · **00:25:06 → 00:27:11**
- **DURATION** 2.21s
- **PURPOSE** The same measurement, run again, shown honestly. Proof, not a claim.
- **CAMERA ANGLE** As clips 12–13, 50mm, pulled back a touch so both columns sit comfortably in frame.
- **CAMERA MOVEMENT** Extremely slow push, 3cm, easing to rest for the last 16 frames so the numbers can be read.
- **SUBJECT** The before/after card.
- **ACTION** The BEFORE column is present. The AFTER values count into place and settle, the estimate last. Then stillness.
- **LIGHTING** As clips 12–13.
- **ENVIRONMENT** As clips 12–13.
- **RUNWAY VIDEO PROMPT** *(plate only)*
  > Medium close-up of a laptop screen at night filling most of the frame with a thin border of dark room at the edges, the screen showing a soft dark blue application panel with deliberately out-of-focus illegible content laid out in two columns, a soft warm lamp reflection in the upper left of the glass, the camera pushes in extremely slowly and comes to rest, shallow depth of field, 50mm lens, ARRI Alexa look, premium technology commercial
- **NEGATIVE PROMPT** `BASE-NEG` plus: readable text, numbers, bar chart, line graph, arrows, sharp interface, green glow, celebration, sparkles
- **START FRAME** Two columns, BEFORE filled, AFTER values still resolving.
- **END FRAME** Both columns complete and at rest, footnote line set beneath: *Measured on this Mac, tonight. Yours will differ.*
- **VOICEOVER** *(line 9 in at 00:26:14)* "No guessing."
- **SOUND EFFECT** One clean confirmation tone as the estimate settles. Music opens up — the first genuinely warm chord of the film.
- **TRANSITION TO NEXT** Hard cut.

## SHOT 19

- **SHOT NUMBER** 19 · `LIVE` · frames 659–683 · **00:27:11 → 00:28:11**
- **DURATION** 1.00s (generate 5s, use the 1s of the exhale)
- **PURPOSE** **Relief, not rescue.** The brand kit's central emotional instruction, in one second.
- **CAMERA ANGLE** Medium, 50mm, from the front three-quarter camera-left.
- **CAMERA MOVEMENT** Almost still. 2cm push. Micro float.
- **SUBJECT** REF-A. Head and shoulders.
- **ACTION** Her shoulders drop about an inch. A breath out. Her jaw unclenches. **No smile.** Direct the actor: *"you just stopped bracing."*
- **LIGHTING** As clip 03.
- **ENVIRONMENT** Soft warm blur of wall and lamp behind.
- **RUNWAY VIDEO PROMPT**
  > Medium shot of a 33-year-old woman at a desk at night lit from below by a laptop screen with a warm lamp filling from camera left, her shoulders drop and she exhales quietly, her jaw loosening into calm, a very small easing of the face that is relief rather than happiness, she does not smile and does not look at the camera, the camera pushes in almost imperceptibly, 50mm lens, shallow depth of field, natural skin texture, ARRI Alexa look, premium commercial, subtle handheld micro-movement
- **NEGATIVE PROMPT** `BASE-NEG` plus: smiling, grinning, laughing, nodding, fist pump, thumbs up, hand to chest, looking at camera, triumphant expression, relieved crying, exaggerated sigh
- **START FRAME** Shoulders still slightly raised, jaw set.
- **END FRAME** Shoulders down, chest at the end of an exhale, face soft and neutral.
- **VOICEOVER** *(none)*
- **SOUND EFFECT** Her breath. Room tone. **No fan at all from here to the end.**
- **TRANSITION TO NEXT** Hard cut.

---

# ACT V

## SHOT 20

- **SHOT NUMBER** 20 · `LIVE` · frames 683–750 · **00:28:11 → 00:31:06**
- **DURATION** 2.79s (generate 10s, use the best 3s of the pull-back)
- **PURPOSE** Return the room to normal. The mirror of clip 01, reversed. The product's promise is that nothing dramatic happens.
- **CAMERA ANGLE** Wide, eye level, the same axis as clip 01. 35mm.
- **CAMERA MOVEMENT** Slow dolly **back**, ~60cm, revealing more of the room. Constant velocity, no ease, no crane.
- **SUBJECT** REF-A in REF-B. The whole room. The screen carries **UI-11**, the resting desktop.
- **ACTION** She goes back to work. Typing resumes, easy. Nothing else happens. The battery figure in the screen's corner reads **29%** and does not move — that stillness is the last argument the film makes.
- **LIGHTING** Identical to clip 01. **Verify against clip 01 side by side before you accept a take** — this pair is the spot's continuity spine.
- **ENVIRONMENT** Identical to clip 01, with the charger cable now visibly coiled and unplugged on the desk.
- **RUNWAY VIDEO PROMPT**
  > A woman in a charcoal crewneck sweatshirt types calmly at a warm walnut desk in a small home office at night, her face lit from below by the glow of a 14-inch space-grey laptop screen, a warm desk lamp burning at camera left, deep blue night in the window behind her, an unplugged coiled cable on the desk, the camera dollies slowly and steadily backward revealing more of the quiet room, nothing dramatic happens, shallow depth of field, realistic motion blur, 35mm anamorphic-style framing, ARRI Alexa look, premium technology commercial, subtle handheld micro-movement
- **NEGATIVE PROMPT** `BASE-NEG` plus: standing up, stretching arms, celebrating, looking at camera, second person entering, pet, phone in hand, room changing, lights changing, sunrise, daylight
- **START FRAME** Close to clip 19's framing, widening. She is settling back to the keyboard.
- **END FRAME** Wide — wider than clip 01 started. The room reads as calm and finished. Composition balanced for the end-card cut.
- **VOICEOVER** *(line 10 in at 00:28:14, out 00:30:02. Then line 11 — "Noah." — begins at 00:30:10, over the tail of this shot and across the dip)*
- **SOUND EFFECT** Room tone, quiet typing, the last of the music resolving. **No fan.** The absence is the payoff.
- **TRANSITION TO NEXT** **The one non-cut in the film:** an 8-frame dip to the night ground `#0B1024`, then up on the end card. Not a cross-dissolve, not a white flash.

## SHOT 21

- **SHOT NUMBER** 21 · `GFX` (UI-10) · frames 750–816 · **00:31:06 → 00:34:00**
- **DURATION** 2.75s
- **PURPOSE** Name, promise, address. Built entirely in After Effects — **do not generate any part of this in Runway.**
- **CAMERA ANGLE** Flat on. No perspective, no camera.
- **CAMERA MOVEMENT** None. A 1.5% scale drift on the mark over the full duration is permitted and nothing else.
- **SUBJECT** The Noah mark from `brand-pack/svg/noah-mark-dark.svg`, the wordmark, the tagline, the URL, the legal super.
- **ACTION** The mark is present from frame one. The wordmark and tagline fade up over 10 frames. "Approve it." carries the Aurora gradient; it is the only saturated thing on the frame. The URL and legal super fade up 6 frames later and hold to the end.
- **LIGHTING** None. Flat night ground `#0B1024`.
- **ENVIRONMENT** None.
- **RUNWAY VIDEO PROMPT** **— none. This shot is not generated.** Build it in After Effects from the SVG in `brand-pack/`. Any AI-generated version of the mark will tilt the waterline, add a glow, or invent a boat, all of which the brand kit explicitly forbids.
- **NEGATIVE PROMPT** *(n/a)* — but the rules that stand in for one: no glow on the mark, no drop shadow, no bevel, no tilt, no cropping of the waterline overshoot, no recolouring, clear space on all sides at least the thickness of the ring's stroke.
- **START FRAME** Night ground. The mark centred in the upper third, level and unglowed. Nothing else.
- **END FRAME** Mark, **NOAH**, *Describe it. Approve it. Done.*, `onnoah.app`, and the legal super at the lower edge — all at rest, all legible.
- **VOICEOVER** *(line 11 "Noah." resolves on frame 749 — the exact frame the mark appears. Line 12 in at 00:31:14)* "Describe it. Approve it. Done."
- **SOUND EFFECT** The sonic logo: two notes, the second landing on the word "Done." Then room tone falling to digital silence over the last 6 frames.
- **TRANSITION TO NEXT** End of film. Hold the last frame to 00:34:00 exactly. The legal super must be on screen a minimum of 2.0s — it enters at frame 766 and holds 50 frames, which satisfies that.

---

## Generation budget

| Type | Clips | Generations needed | Note |
|---|---|---|---|
| Live action | 01, 03, 04, 07, 09, 11, 14, 15, 17, 19, 20 | 11 | Budget 4–6 takes each; hands and faces need the most |
| Screen plates | 02, 05, 06, 08, 10, 12, 13, 16, 18 | 5 unique | 12/13/16/18 share one plate family; 02/05 share one; 08/10 share one |
| Built in AE | 21 | 0 | Plus 11 UI screens — see `05-noah-ui-screens.md` |

Roughly **16 unique Runway generations**, 70–100 total attempts at normal hit rates. Clips 09 and
17 must come from one reference frame, as must 02/05 and 12/13/16/18, or the payoffs break.
