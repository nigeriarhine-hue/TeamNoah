#!/usr/bin/env python3
"""Inline the video and fonts into present.html to make one double-clickable file.

present.html itself keeps relative paths — correct when it sits in the repo next
to renders/ and public/. This produces the shareable copy, where nothing can be
missing because nothing is external.
"""
import base64, pathlib, re, sys

here = pathlib.Path(__file__).resolve().parent.parent
src = here / 'present.html'
mp4 = here / 'renders' / 'noah-google-takes-forever-to-load.mp4'
out = here / 'renders' / 'noah-presentation.html'

for p in (src, mp4):
    if not p.exists():
        sys.exit(f'missing: {p}')

html = src.read_text(encoding='utf-8')

def datauri(path: pathlib.Path, mime: str) -> str:
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode('ascii')

# Fonts first — small, and the page looks wrong without them.
for name, mime in [('plus-jakarta-sans-var.woff2', 'font/woff2'),
                   ('instrument-serif-italic.woff2', 'font/woff2')]:
    f = here / 'public' / 'fonts' / name
    html = html.replace(f"public/fonts/{name}", datauri(f, mime))

# Then the video.
html = html.replace('src="renders/noah-google-takes-forever-to-load.mp4"',
                    f'src="{datauri(mp4, "video/mp4")}"')

# Nothing relative may survive, or the file is not standalone.
leftover = re.findall(r'(?:src|url\()=?["\']?(?!data:|https?:|#)([\w./-]+\.(?:mp4|woff2|png|jpg|css|js))', html)
if leftover:
    sys.exit(f'still referencing external files: {sorted(set(leftover))}')

out.write_text(html, encoding='utf-8')
print(f'{out}  {out.stat().st_size/1_048_576:.1f} MB')
