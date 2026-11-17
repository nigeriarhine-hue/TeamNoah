# Synthesized sound bed for the Noah approval video. Usage: python3 music.py SCALE OUT.wav
import numpy as np, wave, sys
S=float(sys.argv[1]); OUT=sys.argv[2]; TOT=float(sys.argv[3]) if len(sys.argv)>3 else 10.0*S
sr=48000; T=TOT; n=int(sr*T); t=np.arange(n)/sr; out=np.zeros(n)
def env(t0,a,d): x=t-t0; return np.where(x<0,0,np.minimum(x/a,1)*np.exp(-np.maximum(x-a,0)/d))
def tone(f,t0,a,d,amp,harm=(1,)):
    t0*=S; x=t-t0; return amp*env(t0,a,d)*sum(np.sin(2*np.pi*f*h*x)/(i+1)**1.5 for i,h in enumerate(harm))
chords=[(0,[174.6,220,261.6,329.6]),(2.7,[146.8,220,261.6,349.2]),(5.4,[116.5,233.1,293.7,349.2]),(8.1,[174.6,220,261.6,329.6,392])]
for i,(st,fs) in enumerate(chords):
    st*=S; en=chords[i+1][0]*S+0.4 if i+1<len(chords) else T
    g=np.clip((t-st)/0.8,0,1)*np.clip((en-t)/0.8,0,1)
    for f in fs:
        for det in (-0.6,0.6): out+=0.018*g*np.sin(2*np.pi*(f+det)*t)
for k in np.arange(0.45*S,9.0*S,0.6*S):
    x=t-k; m=(x>=0)&(x<0.25); out[m]+=0.07*np.sin(2*np.pi*(60+50*np.exp(-x[m]*30))*x[m])*np.exp(-x[m]*14)
out+=tone(523.3,0.40,0.005,0.3,0.12,(1,2,3)); out+=tone(784,0.55,0.005,0.4,0.07,(1,2))
out+=tone(659.3,1.78,0.005,0.7,0.08,(1,2.01,3))
noise=np.random.default_rng(1).standard_normal(n); nz=np.convolve(noise,np.ones(40)/40,'same')
def whoosh(t0,dur,amp):
    x=(t-t0*S)/(dur*S); return amp*np.where((x>0)&(x<1),np.sin(np.pi*np.clip(x,0,1))**2,0)*nz
x=t-6.58*S; m=(x>=0)&(x<0.03); out[m]+=0.35*noise[m]*np.exp(-x[m]*200); out+=tone(2000,6.58,0.001,0.01,0.1)
for i,f in enumerate([698.5,880,1046.5]): out+=tone(f,6.85+i*0.09,0.004,0.6,0.1,(1,2,3))
out+=tone(523.3,8.5,0.005,1.1,0.08,(1,2,3)); out+=tone(784,8.8,0.005,1.2,0.06,(1,2))
out*=np.clip(t/0.1,0,1)*np.clip((T-t)/0.8,0,1); out=out/np.max(np.abs(out))*0.85
w=wave.open(OUT,'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
