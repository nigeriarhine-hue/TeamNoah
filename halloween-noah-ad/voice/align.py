"""Fit the single-take narration to the supplied 51 s beat.

Keeps each phrase exactly as performed, only re-spaces the pauses between phrases so that
key words land on beat markers from the beat analysis (see ../audio/beat_map.json).
If the natural read cannot fit, it applies the smallest uniform, pitch-preserving tempo lift
(rubberband) from TEMPOS that does.

Usage: python3 align.py raw_vo.mp3 words.json beat_map.json out_prefix
Writes out_prefix.wav and out_prefix_words.json (word timings on the final timeline).
"""
import json, re, subprocess, sys
import numpy as np

SR = 48000
raw_path, words_path, beat_path, out = sys.argv[1:5]
BEATS = json.load(open(beat_path))["beats"]
LAST_WORD_END_MAX = 50.3
TEMPOS = [float(sys.argv[5])] if len(sys.argv) > 5 else [1.0, 1.02, 1.04, 1.06, 1.08, 1.10]

# (phrase text as spoken, placement)
#   ("at", word, t)    key word onset lands at t
#   ("beat", word, g)  key word onset snaps to the first beat leaving >= g s of pause
#   ("gap", g)         follows the previous phrase after g s
SPEC = [
    ("This Halloween, let's make sure your computer gets more treats than tricks.", ("at", "treats", 3.07)),
    ("Because honestly,", ("gap", 0.15)),
    ("what's scarier than a PC that isn't performing at its full potential?", ("gap", 0.40)),
    ("Crashing apps,", ("at", "crashing", 9.68)),
    ("spotty Wi-Fi,", ("at", "spotty", 10.89)),
    ("slow loading,", ("at", "slow", 12.10)),
    ("storage warnings creeping up on you.", ("at", "storage", 13.31)),
    ("And that lag?", ("beat", "and", 0.25)),
    ("Yeah,", ("beat", "yeah", 0.35)),
    ("that's nightmare fuel.", ("at", "nightmare", 17.53)),
    ("Maybe something in your software is haunting performance.", ("gap", 0.30)),
    ("Maybe an outdated driver is casting a spell on your graphics.", ("gap", 0.26)),
    ("Or maybe your system just needs the real cause uncovered.", ("gap", 0.26)),
    ("That's where Noah comes in.", ("beat", "that's", 0.42)),
    ("Just describe the problem like you're talking to a friend,", ("gap", 0.30)),
    ("and Noah gets to work.", ("gap", 0.10)),
    ("It checks your computer,", ("gap", 0.26)),
    ("finds the cause,", ("gap", 0.14)),
    ("shows you the fix,", ("gap", 0.14)),
    ("and waits for your approval before making changes.", ("gap", 0.14)),
    ("No jump scares,", ("gap", 0.22)),
    ("no mystery fixes,", ("gap", 0.16)),
    ("no scary surprises.", ("gap", 0.16)),
    ("So this Halloween, don't let bad software haunt your PC.", ("gap", 0.28)),
    ("Go to OnNoah.app, download Noah, and see what it can do.", ("gap", 0.22)),
    ("Noah,", ("gap", 0.32)),
    ("describe it,", ("gap", 0.18)),
    ("approve it,", ("gap", 0.18)),
    ("done.", ("gap", 0.20)),
]

norm = lambda s: re.sub(r"[^a-z]", "", s.lower())


def load(path, tempo):
    af = ["-af", f"rubberband=tempo={tempo}:pitchq=quality"] if tempo != 1.0 else []
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, *af, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)


words = [w for w in json.load(open(words_path)) if w[1] > w[0]]  # drop zero-length hallucinations
while norm(words[0][2]) != "this":
    words.pop(0)

# group whisper words into the spec phrases
phrases, i = [], 0
for text, place in SPEC:
    target, acc, ws = norm(text), "", []
    while acc != target:
        acc += norm(words[i][2]); ws.append(words[i]); i += 1
        assert target.startswith(acc), f"phrase mismatch at {text!r}: {acc!r}"
    phrases.append((text, place, ws))


def build(tempo):
    x = load(raw_path, tempo)
    env = np.sqrt(np.convolve(x * x, np.ones(int(0.02 * SR)) / int(0.02 * SR), mode="same"))
    thr = env.max() * 10 ** (-40 / 20)
    plan, t_prev = [], 0.0
    for k, (text, place, ws) in enumerate(phrases):
        a = ws[0][0] / tempo - 0.05
        b = ws[-1][1] / tempo
        nxt = phrases[k + 1][2][0][0] / tempo - 0.03 if k + 1 < len(phrases) else len(x) / SR
        j = int(b * SR)
        while j < min(len(x), int((b + 0.35) * SR)) and env[j] > thr:
            j += int(0.005 * SR)
        b = min(j / SR + 0.04, nxt)
        b = max(b, ws[-1][1] / tempo + 0.03)
        if k:
            a = max(a, min(phrases[k - 1][2][-1][1] / tempo, ws[0][0] / tempo - 0.01))
        kind = place[0]
        if kind == "gap" or k == 0 and kind != "at":
            start = t_prev + place[1]
        else:
            kw = next(w for w in ws if norm(w[2]) == norm(place[1]))
            off = kw[0] / tempo - a
            if kind == "at":
                start = place[2] - off
            else:
                start = next(bt for bt in BEATS + [1e9] if bt - off >= t_prev + place[2]) - off
            if k and start < t_prev + 0.08:
                start = t_prev + 0.08
        start = max(start, 0.0)
        plan.append((start, a, b, text, ws))
        t_prev = start + (ws[-1][1] / tempo - a)  # pauses are measured from the last word, not its decay
    last_word_end = plan[-1][0] + (plan[-1][4][-1][1] / tempo - plan[-1][1])
    return x, plan, last_word_end


for tempo in TEMPOS:
    x, plan, end = build(tempo)
    print(f"tempo {tempo}: last word ends {end:.2f}s")
    if end <= LAST_WORD_END_MAX:
        break

y = np.zeros(int(56.0 * SR))
timeline = []
for start, a, b, text, ws in plan:
    seg = x[int(a * SR):int(b * SR)].copy()
    f = int(0.008 * SR)
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    i0 = int(start * SR); n = min(len(seg), len(y) - i0)
    y[i0:i0 + n] += seg[:n]
    for w in ws:
        timeline.append([round(start + w[0] / tempo - a, 3), round(start + w[1] / tempo - a, 3), w[2]])
    print(f"{start:6.2f}  {text}")
y *= 0.891 / np.max(np.abs(y))
json.dump({"tempo": tempo, "words": timeline}, open(out + "_words.json", "w"), indent=0)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f64le", "-ar", str(SR), "-ac", "1", "-i", "-", out + ".wav"],
               input=y.astype("<f8").tobytes(), check=True)
print("TEMPO", tempo)
print("WORDS", json.dumps(timeline))
