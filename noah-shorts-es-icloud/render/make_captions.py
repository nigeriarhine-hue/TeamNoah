#!/usr/bin/env python3
"""Write captions.es.srt / .vtt straight from script.es.json + timeline.json.

The caption text is never retyped: it is the same 'caption' string that the
burned-in PNG and the 'spoken'/'tts_text' fields come from, so the sidecar
files cannot drift from the voice-over.
"""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCRIPT = json.loads((ROOT / "script" / "script.es.json").read_text())
TL     = json.loads((ROOT / "render" / "timeline.json").read_text())
CAPS   = {s["id"]: s["caption"] for s in SCRIPT["shots"]}


def stamp(t: float, sep: str) -> str:
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d}{sep}{int(round((s % 1) * 1000)):03d}"


def main() -> None:
    srt, vtt = [], ["WEBVTT", ""]
    for i, seg in enumerate(TL["segments"], 1):
        text = CAPS[seg["id"]]
        # Caption rides the segment, not just the spoken span, so it is readable
        # slightly before and after the line - standard for short-form.
        a, b = seg["start"], seg["end"]
        srt += [str(i), f"{stamp(a, ',')} --> {stamp(b, ',')}", text, ""]
        vtt += [f"{stamp(a, '.')} --> {stamp(b, '.')}", text, ""]
    out = ROOT / "script"
    (out / "captions.es.srt").write_text("\n".join(srt), encoding="utf-8")
    (out / "captions.es.vtt").write_text("\n".join(vtt), encoding="utf-8")

    # Prove the sidecars match the spoken script exactly.
    for s in SCRIPT["shots"]:
        assert s["caption"] == s["spoken"], f"caption != spoken for {s['id']}"
    print(f"wrote captions.es.srt / .vtt  ({len(TL['segments'])} cues)")
    print("caption text == spoken text for all 5 lines: OK")


if __name__ == "__main__":
    main()
