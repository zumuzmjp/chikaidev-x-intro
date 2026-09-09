import numpy as np,subprocess,pathlib,wave
sr=48000;dur=48;bg=np.zeros((sr*dur,2));samples={}
for p in pathlib.Path('public/piano').glob('*.mp3'):
 b=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ac','1','-ar',str(sr),'-'])
 a=np.frombuffer(b,dtype='<f4').copy();nz=np.where(abs(a)>.001)[0]
 if len(nz):a=a[max(0,nz[0]-100):]
 a=a/max(.01,float(np.max(abs(a))))
 samples[p.stem]=a
def note(name,at,length,vel=.12,pan=0):
 a=samples[name][:int((length+.3)*sr)].copy();n=len(a);release=min(int(.35*sr),n);a[-release:]*=np.linspace(1,0,release)
 a*=vel;start=int(at*sr);end=min(len(bg),start+n)
 if end<=start:return
 bg[start:end,0]+=a[:end-start]*(.75-pan*.2);bg[start:end,1]+=a[:end-start]*(.75+pan*.2)
beat=.6
chords=[(['C3','G3'],['C4','E4','G4','B4']),(['A3','E3'],['A3','C4','E4','G4']),(['F3','C4'],['F4','A4','C5','E5']),(['G3','D4'],['G4','B4','D5','F4'])]
melodies=[['E5','G5','E5','D5','C5','E5'],['E5','D5','C5','E5','C5','A4'],['A4','C5','E5','G5','E5','C5'],['D5','B4','A4','G4','B4','D5']]
for bar in range(20):
 start=bar*2.4;root,arp=chords[bar%4]
 note(root[0],start,1.8,.135,-.65)
 note(root[1],start+1.2,1.1,.085,-.45)
 for j in range(8):
  at=start+j*.3+(j%2)*.02
  note(arp[[0,1,2,1,3,2,1,2][j]],at,.63,.064+(j%3)*.007,.45)
 if bar>=1:
  for j,at in enumerate([.15,.6,.9,1.35,1.8,2.1]):
   if bar%4==3 and j==5:continue
   name=melodies[bar%4][(j+(2 if bar>=12 else 0))%6]
   note(name,start+at,.53 if j<4 else .7,.12 if j%2==0 else .095,.05)
for n in ['C4','E4','G4','C5']:note(n,46.2,1.8,.10)
dry=bg.copy()
for delay,gain in [(.079,.14),(.137,.10),(.223,.065)]:
 sh=int(delay*sr);bg[sh:]+=dry[:-sh,::-1]*gain
rms=np.sqrt(np.mean(bg*bg));bg*=.062/max(.001,rms)
fade=np.minimum(np.arange(len(bg))/(sr*.3),1)*np.minimum((len(bg)-np.arange(len(bg)))/(sr*1.4),1)
bg*=fade[:,None]
with wave.open('public/ui-audio.wav','rb') as w:ui=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float)/32768
mix=bg+ui[:,None]*.85
peak=np.max(abs(mix))
if peak>.82:mix*=.82/peak
for filename,data in [('bgm.wav',bg),('mix.wav',mix)]:
 with wave.open('public/'+filename,'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(data,-1,1)*32767).astype('<i2').tobytes())
print('BGM and stereo mix ready', 'mix peak',float(np.max(abs(mix))))
