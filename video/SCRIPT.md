# Script — Mac games stuttering / low FPS

Every line as it appears on screen. Kickers are set in mono small caps; the accent
lines are Instrument Serif italic; the machine voice is JetBrains Mono.

---

## 1. The symptom · 0:00–0:05

> **FIX GUIDE · MACOS**
>
> # Your games run fine. Then they don't.
>
> The frame rate sags. The camera swings a beat behind the mouse. And it gets worse
> the longer you play.

> "it's smooth for ten minutes, then it starts hitching"
>
> A complete, valid bug report. Noah takes it in those words — no Terminal, no
> translation into anyone else's vocabulary.

## 2. The distinction · 0:05–0:18

> **FIRST, THE USEFUL DISTINCTION**
>
> # Low frame rate and stutter are two different problems.

**Low frame rate** — Every frame takes about the same time to draw — just too long.
Steady, and slow. That is a **settings** problem: resolution, shadows, effects.

**Stutter** — Most frames are fine. Then one takes six times as long, and you feel
it. That is a **pacing** problem — something else took the machine for a moment.
*(annotated: `96 ms — one frame`)*

> *A spike every few seconds is not your graphics card.*

## 3. The causes · 0:18–0:38

> **WHAT ACTUALLY CAUSES IT**
>
> # Four things cause it. Only one of them is the game.

**01 · Heat, at about the eight-minute mark**
The chassis reaches its limit and the chips step down to stay there. The first ten
minutes are always the good ten minutes.
`kernel_task climbing · clocks capped`

**02 · Something else is using the GPU**
A backup that started on its own. A photo library still being analysed. A browser
left open behind the game.
`backupd · photoanalysisd · WebKit GPU`

**03 · The game is running through Rosetta**
An Intel build, translated as it runs on Apple silicon, when a native version of the
same game is sitting right there.
`Get Info → Kind: Application (Intel)`

**04 · It is drawing more pixels than the screen shows**
Full Retina resolution with Game Mode off, so the game queues behind everything else
for the GPU.
`Displays: 3456 × 2234 · Game Mode: Off`

> **Caution —** below about 10% free disk, all four get worse. macOS starts swapping
> to disk mid-frame, and a swap-in is a dropped frame.

## 4. What Noah does · 0:38–0:59

> **WHAT NOAH DOES ABOUT IT**
>
> # Noah finds which one it is.

1. **You describe it in your own words.** — "games keep stuttering after a while"
2. **Noah runs audited diagnostics on your Mac.** — It names the cause. It does not
   guess, and it does not sell you a clean-up.
3. **Nothing runs until you approve.** — Every change shown first. Logged. Reversible.

**NOAH PROPOSES**
> Turn on Game Mode for this game, and hold the scheduled backup until you quit.
>
> `Game Mode → Automatic`
> `backupd → deferred while a game is frontmost`
>
> 2 changes · shown before they run · logged · reversible
>
> **[ Approve ]**  Not now

→ **Done — and you can undo it.**

## 5. The result · 0:59–1:11

**After** — Same game. Same settings. Same graphics card. The hitches are gone,
because they were never the graphics card. *(the "before" trace stays behind it, on
the same axis)*

> **THE POINT**
>
> # Noah finds what's actually wrong with your Mac.
>
> *It's probably not junk.*

`onnoah.app/fix/mac-games-stuttering-low-fps`
