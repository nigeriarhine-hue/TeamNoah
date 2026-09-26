import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
SR=48000; import pathlib; D=str(pathlib.Path(__file__).resolve().parent.parent/"public/audio/sfx")+"/"
import os; os.makedirs(D,exist_ok=True)
rng=np.random.default_rng(7)
def t(d): return np.arange(int(d*SR))/SR
def lp(x,f): return sosfilt(butter(4,f,'low',fs=SR,output='sos'),x)
def hp(x,f): return sosfilt(butter(4,f,'high',fs=SR,output='sos'),x)
def bp(x,a,b): return sosfilt(butter(2,[a,b],'band',fs=SR,output='sos'),x)
def env(n,a,r): 
    e=np.ones(n); A=int(a*SR); e[:A]=np.linspace(0,1,A) if A else 1
    e*=np.exp(-np.arange(n)/(r*SR)); return e
def norm(x,p=0.8): return x/np.max(np.abs(x))*p
def st(x): return np.stack([x,x],1)
def w(name,x): sf.write(D+name,x.astype(np.float32),SR)

# whoosh: bandpassed noise sweep
d=0.7; n=int(d*SR); x=rng.standard_normal(n); tt=t(d)
out=np.zeros(n); seg=1024
for i in range(0,n,seg):
    f=300+3500*np.sin(np.pi*min(1,i/n))**2
    out[i:i+seg]=bp(x[max(0,i-4096):i+seg],f*0.6,f*1.4)[-len(x[i:i+seg]):]
e=np.sin(np.pi*tt/d)**2; wl=norm(out*e,0.5)
w("whoosh.wav",np.stack([wl*np.linspace(1.2,0.6,n),wl*np.linspace(0.6,1.2,n)],1))
# tick
tt=t(0.06); x=np.sin(2*np.pi*2400*tt)*env(len(tt),0.001,0.008)+0.3*hp(rng.standard_normal(len(tt)),4000)*env(len(tt),0,0.004)
w("tick.wav",st(norm(x,0.45)))
# ui click
tt=t(0.09); x=np.sin(2*np.pi*1400*tt)*env(len(tt),0.0005,0.012)+0.5*bp(rng.standard_normal(len(tt)),1500,6000)*env(len(tt),0,0.005)
w("click.wav",st(norm(x,0.6)))
# key tap
tt=t(0.05); x=bp(rng.standard_normal(len(tt)),1800,7000)*env(len(tt),0,0.006)+0.4*np.sin(2*np.pi*600*tt)*env(len(tt),0,0.01)
w("key.wav",st(norm(x,0.35)))
# pop (card reveal)
tt=t(0.18); f=np.linspace(500,900,len(tt)); x=np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(tt),0.002,0.04)
w("pop.wav",st(norm(x,0.35)))
# send swoosh-blip
tt=t(0.35); f=np.linspace(600,1600,len(tt)); x=np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(tt),0.005,0.08)
w("send.wav",st(norm(x,0.4)))
# approve: click + two-note confirm
tt=t(0.6); x=np.zeros(len(tt))
for f0,off in [(880,0.0),(1318.5,0.09)]:
    o=int(off*SR); tn=tt[:len(tt)-o]; x[o:]+= (np.sin(2*np.pi*f0*tn)+0.3*np.sin(4*np.pi*f0*tn))*env(len(tn),0.003,0.18)
w("approve.wav",st(norm(x,0.5)))
# chime: bell partials arpeggio
tt=t(2.2); x=np.zeros(len(tt))
for f0,off in [(1046.5,0),(1318.5,.08),(1568,.16),(2093,.26)]:
    o=int(off*SR); tn=tt[:len(tt)-o]
    x[o:]+=sum(a*np.sin(2*np.pi*f0*m*tn) for m,a in [(1,1),(2.76,.25),(5.4,.08)])*env(len(tn),0.002,0.5)
xl=norm(x,0.5); dl=int(0.012*SR)
w("chime.wav",np.stack([xl,np.concatenate([np.zeros(dl),xl[:-dl]])],1))
# impact / low boom for title slams
tt=t(1.2); f=np.linspace(90,38,len(tt)); x=np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(tt),0.003,0.35)+0.2*lp(rng.standard_normal(len(tt)),400)*env(len(tt),0,0.08)
w("impact.wav",st(norm(x,0.6)))
# riser
d=1.6; tt=t(d); x=bp(rng.standard_normal(len(tt)),800,6000)*(tt/d)**2
w("riser.wav",st(norm(x,0.3)))

# ---- ambient system hum (46s) ----
L=46.5; tt=t(L)
hum=0.5*np.sin(2*np.pi*55*tt)+0.25*np.sin(2*np.pi*110.4*tt)+0.1*np.sin(2*np.pi*165*tt)
fan=lp(rng.standard_normal(len(tt)),700)*0.6
hm=norm(hum*(0.8+0.2*np.sin(2*np.pi*0.1*tt))+fan,0.25)
w("hum.wav",st(hm))

# ---- music bed: soft synth pads + pulse, 96 bpm ----
bpm=96; beat=60/bpm; bar=4*beat
chords=[[57,60,64,69],[53,57,60,65],[48,55,60,64],[55,59,62,67]]  # Am F C G
def mtof(m): return 440*2**((m-69)/12)
mus=np.zeros((len(tt),2))
nb=int(L/bar)+1
for b in range(nb):
    s0=int(b*bar*SR); ch=chords[b%4]; dur=bar+0.4; tn=t(dur); n=len(tn)
    e=np.minimum(1,tn/0.5)*np.minimum(1,(dur-tn)/0.5)
    for i,m in enumerate(ch):
        f=mtof(m); det=[0.997,1.003]
        for c in range(2):
            v=sum(np.sin(2*np.pi*f*det[c]*k*tn+ i)/k for k in (1,2,3))*e*0.12
            end=min(len(tt),s0+n); mus[s0:end,c]+=v[:end-s0]
    # bass pulse eighths
    f=mtof(ch[0]-12)
    for k8 in range(8):
        s1=s0+int(k8*beat/2*SR); tn=t(beat/2); v=np.sin(2*np.pi*f*tn)*env(len(tn),0.005,0.12)*0.35
        end=min(len(tt),s1+len(tn)); 
        if s1<len(tt): mus[s1:end]+=st(v[:end-s1])
    # soft kick on 1 & 3 from bar 3 on; hats offbeats
    if b>=2:
        for k4 in (0,2):
            s1=s0+int(k4*beat*SR); tn=t(0.3); f2=np.linspace(120,45,len(tn))
            v=np.sin(2*np.pi*np.cumsum(f2)/SR)*env(len(tn),0.002,0.08)*0.5
            end=min(len(tt),s1+len(tn))
            if s1<len(tt): mus[s1:end]+=st(v[:end-s1])
        for k8 in range(1,8,2):
            s1=s0+int(k8*beat/2*SR); tn=t(0.05); v=hp(rng.standard_normal(len(tn)),7000)*env(len(tn),0,0.012)*0.12
            end=min(len(tt),s1+len(tn))
            if s1<len(tt): mus[s1:end]+=st(v[:end-s1])
mus[:,0]=lp(mus[:,0],5000); mus[:,1]=lp(mus[:,1],5000)
fade=np.ones(len(tt)); fi=int(1.5*SR); fo=int(2.5*SR); fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
w("music.wav",norm(mus*fade[:,None],0.7))
print("done")
