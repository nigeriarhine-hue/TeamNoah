import numpy as np, scipy.io.wavfile as wf, scipy.signal as ss, scipy.ndimage as nd
from PIL import Image, ImageDraw
sr,x=wf.read('song.wav'); x=x.astype(np.float32)/32768
L,R=x[:,0],x[:,1]
N,H=2048,512
f,t,SL=ss.stft(L,sr,nperseg=N,noverlap=N-H); _,_,SR=ss.stft(R,sr,nperseg=N,noverlap=N-H)
M=np.abs(SL+SR)/2; S=np.abs(SL-SR)/2
# centre-panned mask (vocals usually centred)
cmask=np.clip(1-S/(M+1e-9),0,1)**2
# HPSS: keep harmonic (horizontal) content, drop drums
harm=nd.median_filter(M,size=(1,17)); perc=nd.median_filter(M,size=(17,1))
hmask=harm**2/(harm**2+perc**2+1e-12)
V=M*cmask*hmask
band=(f>=250)&(f<=3500)
e=np.sqrt((V[band]**2).sum(0))
# compare with background (non-centre) to get vocal presence
fps_a=sr/H
e=nd.uniform_filter1d(e,3)
db=20*np.log10(e+1e-9)
lo,hi=np.percentile(db,20),np.percentile(db,98)
env=np.clip((db-lo)/(hi-lo),0,1)
cent=(V[band]*f[band,None]).sum(0)/(V[band].sum(0)+1e-9)
np.savez('env.npz',env=env,cent=cent,fps=fps_a,t=t)
print(len(env),fps_a,lo,hi)
W=1700;img=Image.new('RGB',(W,300),'white');d=ImageDraw.Draw(img)
for i in range(W):
    j=int(i*len(env)/W); v=env[j]; d.line([(i,299),(i,299-v*290)],fill='black')
for s in range(0,86,5): xx=int(s*fps_a*W/len(env)); d.line([(xx,0),(xx,10)],fill='red'); d.text((xx+2,10),str(s),fill='red')
img.save('env.png')
