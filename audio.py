import numpy as np, wave
sr=48000
audio=np.zeros(sr*48,dtype=np.float64)
rng=np.random.default_rng(909)
def sound(at,kind='key'):
 dur={'key':.027,'send':.16,'notify':.24,'tap':.04,'shutter':.09}.get(kind,.04)
 n=int(dur*sr); t=np.arange(n)/sr; env=np.exp(-t/({'key':.006,'send':.037,'notify':.07,'tap':.01,'shutter':.025}[kind]))
 if kind=='key': v=(.5*np.sin(2*np.pi*1750*t)+rng.normal(0,.15,n))*env*.055
 elif kind=='send':v=np.sin(2*np.pi*(680*t+1900*t*t))*env*.10
 elif kind=='notify':v=(np.sin(2*np.pi*880*t)+.45*np.sin(2*np.pi*1320*t))*env*.14
 elif kind=='shutter':v=rng.normal(0,1,n)*env*.055
 else:v=np.sin(2*np.pi*1200*t)*env*.075
 start=int(at*sr);end=min(len(audio),start+n)
 audio[start:end]+=v[:end-start]
for s,e,k in [(4.1,5.4,12),(10.2,11.25,5),(12,13.45,8),(15.4,17,9),(25.8,27.35,18),(28.45,30,19),(41,42.8,19)]:
 for i in range(k):sound(s+(e-s)*i/k+.018*np.sin(i*2.1))
for t in [2.35,3.2,7.05,8.9,25.05,36.8,37.65,39.3,40.1]:sound(t,'notify')
sound(.55,'notify')
for t in [5.65,11.55,13.75,23.5,27.7,30.3,43.15]:sound(t,'send')
for t in [2.07,14.1,17.6,20.5,21.5,22.84,31.06,35.7]:sound(t,'tap')

audio=np.clip(audio,-.85,.85)
with wave.open('public/ui-audio.wav','wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((audio*32767).astype('<i2').tobytes())
print('UI audio: 48s, peak',float(np.max(np.abs(audio))))
