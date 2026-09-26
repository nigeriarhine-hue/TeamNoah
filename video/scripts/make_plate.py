"""Character cut-out + clean background plate for the parallax shots.

The plate has the person painted out (OpenCV inpaint + blur) so the room layer can
move at a different parallax rate without showing a second copy of the character.
pip install "rembg[cpu]" pillow opencv-python-headless numpy
"""
import pathlib
import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

D = pathlib.Path(__file__).resolve().parent.parent / "public/img"
src = Image.open(D / "gamer.png").convert("RGB")
cut = np.array(remove(src, session=new_session("isnet-general-use")))
cut[:520, :600, 3] = 0  # stray PC-fan ring
cut[:, :300, 3] = 0  # desk/keyboard fringe
Image.fromarray(cut).save(D / "gamer-cutout.png")

im = cv2.imread(str(D / "gamer.png"))
mask = cv2.dilate(((cut[:, :, 3] > 8) * 255).astype(np.uint8), np.ones((35, 35), np.uint8))
small = cv2.inpaint(cv2.resize(im, (384, 256)), cv2.resize(mask, (384, 256)), 9, cv2.INPAINT_TELEA)
fill = cv2.resize(cv2.GaussianBlur(small, (0, 0), 4), (1536, 1024), interpolation=cv2.INTER_CUBIC)
w = cv2.GaussianBlur(mask.astype(np.float32) / 255, (0, 0), 12)[:, :, None]
cv2.imwrite(str(D / "gamer-plate.jpg"), (im * (1 - w) + fill * w).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
