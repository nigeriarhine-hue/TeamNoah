import numpy as np, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter
import imageio_ffmpeg; FF=imageio_ffmpeg.get_ffmpeg_exe()
AUDIO='pop_noah_27_1.mp3'
sheet=Image.open('noah_sheet.webp').convert('RGB')
CX0,CY0,CS=30,50,300          # square crop around the FRONT pose
OUT=1080; SC=OUT/CS
base=np.asarray(sheet.crop((CX0,CY0,CX0+CS,CY0+CS))).astype(np.float32)

# --- erase the painted smile: normalized-convolution inpaint of the dark screen
mx0,my0,mx1,my1=168-CX0,182-CY0,221-CX0,204-CY0
reg=base[my0-6:my1+6, mx0-6:mx1+6]
lum=reg.mean(2)
known=(lum<90).astype(np.float32)
known[6:-6,6:-6]=0
from scipy.ndimage import gaussian_filter
num=np.stack([gaussian_filter(reg[...,c]*known,4) for c in range(3)],2)
den=gaussian_filter(known,4)[...,None]
fill=num/(den+1e-6)
blank=base.copy()
sub=blank[my0-6:my1+6, mx0-6:mx1+6]
m=np.zeros_like(lum); m[5:-5,5:-5]=1
# only replace bright (white stroke) pixels + their fringe; keep dark screen texture
bright=gaussian_filter((lum>70).astype(np.float32),1.2)>0.05
w=(m*bright)[...,None]
sub[:]=sub*(1-w)+fill*w
blank_img=Image.fromarray(blank.clip(0,255).astype(np.uint8))
closed_img=Image.fromarray(base.clip(0,255).astype(np.uint8))

WHITE=(236,236,236); DARK=(22,22,24)
MCX=194-CX0; MTOP=186-CY0
def mouth(level, rnd):
    """level 1..4 open amount, rnd=True -> rounded 'O' vowel"""
    im=blank_img.copy(); d=ImageDraw.Draw(im)
    h=[0,5,8,11,14][level]
    if rnd:
        wdt=[0,12,15,17,19][level]
        d.ellipse([MCX-wdt//2,MTOP-1,MCX+wdt//2,MTOP-1+h+2],fill=WHITE)
        if level>=2:
            iw,ih=max(3,wdt//3),max(2,h//3)
            cy=MTOP+h//2
            d.ellipse([MCX-iw//2,cy-ih//2,MCX+iw//2,cy+ih//2],fill=DARK)
    else:
        wdt=[0,34,38,41,44][level]
        # D shape: flat top, round bottom (like the LAUGHING expression)
        d.pieslice([MCX-wdt//2,MTOP-h,MCX+wdt//2,MTOP+h],0,180,fill=WHITE)
        d.rectangle([MCX-wdt//2,MTOP,MCX+wdt//2,MTOP+1],fill=WHITE)
        if level>=2:
            iw=int(wdt*0.42); ih=max(2,h//3)
            y1=MTOP+h-3; y0=y1-ih
            d.rectangle([MCX-iw//2,y0,MCX+iw//2,y1],fill=DARK)
    return im
bg=tuple(int(v) for v in base[5,5])
frames={}
def up(im): return im.resize((OUT,OUT),Image.LANCZOS)
frames[(0,False)]=up(closed_img)
for lv in range(1,5):
    for r in (False,True): frames[(lv,r)]=up(mouth(lv,r))
if len(sys.argv)>1:
    row=Image.new('RGB',(OUT//3*5,OUT//3*2),bg)
    keys=[(0,False)]+[(l,False) for l in range(1,5)]+[(l,True) for l in range(1,5)]
    for i,k in enumerate(keys):
        t=frames[k].crop((int((150-CX0)*SC),int((150-CY0)*SC),int((240-CX0)*SC),int((215-CY0)*SC))).resize((OUT//3,OUT//3*65//90))
        row.paste(t,((i%5)*OUT//3,(i//5)*OUT//3))
    row.save('mouths.png'); sys.exit()

# --- audio -> per-frame mouth state
z=np.load('env.npz'); env,cent,afps=z['env'],z['cent'],float(z['fps'])
FPS=24; nfr=int(len(env)/afps*FPS)
lvl=[];prev=0.0
cth=np.percentile(cent[env>0.4],30)
for i in range(nfr):
    a=int(i/FPS*afps); b=max(a+1,int((i+1)/FPS*afps))
    v=env[a:b].max()
    v=max(v,prev*0.55)            # quick release, avoids flicker
    prev=v
    if v<0.30: L=0
    elif v<0.45: L=1
    elif v<0.60: L=2
    elif v<0.78: L=3
    else: L=4
    rnd=bool(L>=2 and np.median(cent[a:b])<cth)
    lvl.append((L,rnd))
# remove single-frame blips
for i in range(1,nfr-1):
    if lvl[i-1][0]==lvl[i+1][0] and abs(lvl[i][0]-lvl[i-1][0])>=2: lvl[i]=lvl[i-1]

cmd=[FF,'-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{OUT}x{OUT}','-r',str(FPS),'-i','-',
     '-i',AUDIO,'-map','0:v','-map','1:a','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium',
     '-c:a','aac','-b:a','256k','-shortest','-movflags','+faststart','noah_lipsync.mp4']
p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
canvas=Image.new('RGB',(OUT,OUT),bg)
bob=0.0
for i,(L,r) in enumerate(lvl):
    bob=bob*0.7+L*0.3
    dy=int(round(-bob*2.5+2*np.sin(i/FPS*2*np.pi*0.5)))
    c=canvas.copy(); c.paste(frames[(L,r)],(0,dy))
    if dy<0: c.paste(Image.new('RGB',(OUT,-dy),bg),(0,OUT+dy))
    elif dy>0: c.paste(Image.new('RGB',(OUT,dy),bg),(0,0))
    p.stdin.write(c.tobytes())
p.stdin.close(); p.wait()
from collections import Counter; print(Counter(l for l,_ in lvl), sum(r for _,r in lvl), nfr)
