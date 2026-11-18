# Soft music bed for the voiceover cut: pad + a few cues at given real times. Usage: python3 music_vo.py OUT.wav
import numpy as np, wave, sys
sr=48000; T=17.6; n=int(sr*T); t=np.arange(n)/sr; out=np.zeros(n)
def env(t0,a,d): x=t-t0; return np.where(x<0,0,np.minimum(x/a,1)*np.exp(-np.maximum(x-a,0)/d))
def tone(f,t0,a,d,amp,h=(1,)): x=t-t0; return amp*env(t0,a,d)*sum(np.sin(2*np.pi*f*k*x)/(i+1)**1.5 for i,k in enumerate(h))
ch=[(0,[174.6,220,261.6,329.6]),(4.6,[146.8,220,261.6,349.2]),(8.6,[116.5,233.1,293.7,349.2]),(12.3,[174.6,220,261.6,329.6,392])]
for i,(st,fs) in enumerate(ch):
    en=ch[i+1][0]+0.5 if i+1<len(ch) else T
    g=np.clip((t-st)/0.9,0,1)*np.clip((en-t)/0.9,0,1)
    for f in fs:
        for d in (-0.6,0.6): out+=0.018*g*np.sin(2*np.pi*(f+d)*t)
out+=tone(523.3,0.55,0.005,0.35,0.10,(1,2,3))+tone(784,0.75,0.005,0.45,0.06,(1,2))
noise=np.random.default_rng(1).standard_normal(n)
x=t-10.75; m=(x>=0)&(x<0.03); out[m]+=0.3*noise[m]*np.exp(-x[m]*200); out+=tone(2000,10.75,0.001,0.01,0.08)
for i,f in enumerate([698.5,880,1046.5]): out+=tone(f,11.5+i*0.09,0.004,0.6,0.08,(1,2,3))
out+=tone(523.3,12.5,0.005,1.1,0.06,(1,2,3))
out*=np.clip(t/0.1,0,1)*np.clip((T-t)/0.8,0,1); out=out/np.max(np.abs(out))*0.85
w=wave.open(sys.argv[1],'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
