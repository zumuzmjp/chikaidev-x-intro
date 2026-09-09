import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame,interpolate,spring,Img,OffthreadVideo,Sequence,staticFile} from 'remotion';
const FPS=30,W=720,H=1280;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>1-Math.pow(1-clamp(x),3);
const lerp=(a,b,x)=>a+(b-a)*clamp(x);
const sec=s=>Math.round(s*FPS);
const P={name:'ハンドボール人「布施千佳純」',handle:'@chikaidev',bio:'building Sports apps $1K MRR｜IndieHacker🇺🇸｜AI video 130k Followers on IG｜📍🇯🇵Toyama↔︎Kanagawa'};
const messages=[
{side:'in',at:2.35,text:'ちょっと聞いていい？'},
{side:'in',at:3.2,text:'最近、誰のこと見てるの？'},
{side:'out',start:4.1,end:5.4,at:5.65,text:'え、急にどうした笑',kana:'え、きゅうにどうしたわら'},
{side:'in',at:7.05,text:'ずっとスマホ見てるじゃん'},
{side:'in',at:8.9,text:'そんなに気になる人いる？'},
{side:'out',start:10.2,end:11.25,at:11.55,text:'いる笑',kana:'いるわら'},
{side:'out',start:12.0,end:13.45,at:13.75,text:'ちょっと待って',kana:'ちょっとまって'},
{side:'out',at:23.5,text:'https://x.com/chikaidev',kind:'link'},
{side:'in',at:25.05,text:'え、この人？'},
{side:'out',start:25.8,end:27.35,at:27.7,text:'AIで動画もアプリも作ってる',kana:'AIでどうがもあぷりもつくってる'},
{side:'out',start:28.45,end:30.0,at:30.3,text:'作り方まで見せてくれる笑',kana:'つくりかたまでみせてくれるわら'},
{side:'out',at:37.65,kind:'photo',text:''},
{side:'in',at:39.3,text:'フォローした'},
{side:'in',at:40.1,text:'こういうの知りたかった笑'},
{side:'out',start:41.0,end:42.8,at:43.15,text:'私よりハマってるじゃん笑',kana:'わたしよりはまってるじゃんわら'},
];
const typingAt=f=>messages.find(m=>m.start!==undefined && f>=sec(m.start)&&f<sec(m.at));
function typed(m,f){
 if(!m)return {value:'',candidate:'',key:-1};
 const p=clamp((f-sec(m.start))/(sec(m.end)-sec(m.start)));
 const chars=Array.from(m.kana);const n=Math.min(chars.length,Math.floor(p*chars.length+Math.sin(p*12)*.5));
 const converted=f>=sec(m.end)-5;
 return {value:converted?m.text:chars.slice(0,n).join(''),candidate:m.text,key:p<.94?Math.max(0,n)%12:-1,preedit:!converted};
}
function Icon({name,size=32,color='currentColor',fill='none',style={}}){
 const paths={back:'M15 4 7 12l8 8',search:'M20 20l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',phone:'M5 3 2 6c1 8 8 15 16 16l3-3-5-5-3 3-6-6 3-3z',menu:'M4 6h16M4 12h16M4 18h16',plus:'M12 3v18M3 12h18',send:'m4 3 17 9-17 9 4-9-4-9 M8 12h13',camera:'M3 7h4l2-3h6l2 3h4v14H3z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0',mic:'M9 3h6v11H9zM5 10v3a7 7 0 0 0 14 0v-3M12 20v3',share:'M12 16V2m-5 5 5-5 5 5M5 11H2v11h20V11h-3',home:'m2 11 10-9 10 9M5 9v13h5v-7h4v7h5V9',bell:'M5 16V9a7 7 0 0 1 14 0v7l3 3H2l3-3M9 22h6',mail:'M2 4h20v16H2zM2 5l10 8L22 5',bookmark:'M5 2h14v20l-7-5-7 5z',photo:'M2 3h20v18H2zM2 17l6-6 4 4 4-6 6 7',close:'m5 5 14 14M19 5 5 19',chev:'m7 4 8 8-8 8',tab:'M4 7h13v15H4zM8 2h13v15'};
 return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}><path d={paths[name]||paths.menu}/></svg>
}
function Status({light=false,bg='transparent'}){return <div style={{position:'absolute',left:0,right:0,top:0,height:76,display:'flex',alignItems:'center',padding:'0 43px',fontSize:28,fontWeight:650,background:bg,color:light?'#fff':'#17202c',zIndex:60}}><span>21:41</span><div style={{margin:'0 auto',width:146,height:39,borderRadius:30,background:'#101113'}}/><span style={{fontSize:22,letterSpacing:1}}>▂▃▅</span><span style={{fontSize:26,marginLeft:13}}>⌁</span><div style={{marginLeft:14,width:45,height:23,border:'2px solid currentColor',borderRadius:6,padding:3}}><div style={{width:29,height:13,background:'currentColor',borderRadius:2}}/></div></div>}
function HomeBar({light=false}){return <div style={{position:'absolute',bottom:14,width:246,height:8,borderRadius:8,background:light?'white':'#17202c',left:237,zIndex:80}}/>}
function Avatar({person=false,size=46}){return person?<Img src={staticFile('avatar.jpg')} style={{width:size,height:size,borderRadius:'50%',objectFit:'cover'}}/>:<div style={{width:size,height:size,borderRadius:'50%',background:'#e1d1bd',display:'flex',justifyContent:'center',alignItems:'center',fontSize:size*.48}}>☕</div>}
const keyboardRows=[['☆','あ','か','さ','⌫'],['ABC','た','な','は','空白'],['あいう','ま','や','ら','改行'],['☺','゛小','わ','、。?!','確定']];
function Keyboard({f,mode='kana',m=null,forceValue=''}){const t=typed(m,f);const start=sec(2.3),dy=lerp(365,0,ease((f-start)/11));
 const candidate=t.value?t.candidate:'';
 return <div style={{position:'absolute',left:0,right:0,bottom:0,height:367,background:'#cdd1d7',transform:`translateY(${dy}px)`,borderTop:'1px solid #b7bdc5',zIndex:12}}>
 <div style={{height:49,background:'#f5f6f8',display:'flex',alignItems:'center',gap:27,padding:'0 19px',fontSize:24,whiteSpace:'nowrap',overflow:'hidden',color:'#303741'}}>{candidate?<><b>{candidate}</b><span>{m?.kana}</span><span>⌄</span></>:<><span>予測変換</span><span style={{marginLeft:'auto'}}>⌄</span></>}</div>
 {mode==='latin'?<div style={{paddingTop:8}}>{['qwertyuiop','asdfghjkl','zxcvbnm'].map((row,i)=><div key={row} style={{display:'flex',justifyContent:'center',gap:7,marginBottom:9}}>{row.split('').map((c,j)=><div key={c} style={{width:62,height:61,borderRadius:8,background:Math.floor(f/3)%row.length===j&&f<sec(17.1)?'#aab4c3':'white',boxShadow:'0 2px 0 #9ca3ac',textAlign:'center',fontSize:32,lineHeight:'61px'}}>{c}</div>)}</div>)}<div style={{display:'flex',gap:10,padding:'0 20px'}}><div style={{background:'#b2bac7',width:120,textAlign:'center',borderRadius:8,padding:13}}>123</div><div style={{background:'white',flex:1,textAlign:'center',borderRadius:8,padding:13}}>空白</div><div style={{background:'#087afa',color:'white',width:130,textAlign:'center',borderRadius:8,padding:13}}>検索</div></div></div>:
 <div style={{padding:'7px 9px 0',display:'grid',gridTemplateColumns:'1fr 1.17fr 1.17fr 1.17fr 1fr',gap:'9px 10px'}}>{keyboardRows.flat().map((c,i)=>{const col=i%5;const active=col>0&&col<4&&t.key===Math.floor(i/5)*3+col-1;return <div key={i} style={{height:59,borderRadius:8,background:active?'#8eaee2':col===0||col===4?'#adb7c7':'white',boxShadow:'0 2px 0 #99a1ac',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontSize:c.length>2?19:28,color:'#111b2b',position:'relative'}}>{c}{i>0&&i<14&&col>0&&col<4?<span style={{fontSize:12,color:'#7a838f'}}>{['','', 'ABC','DEF',''][col]||' '}</span>:null}{active&&f%5<3&&<div style={{position:'absolute',top:-42,width:70,height:60,background:'white',boxShadow:'0 2px 12px #53668155',borderRadius:12,zIndex:30,fontSize:33,textAlign:'center',paddingTop:5}}>{Array.from(t.value).at(-1)}</div>}</div>})}</div>}
 <div style={{position:'absolute',bottom:39,left:37}}><span style={{fontSize:32}}>◎</span></div><Icon name="mic" size={31} style={{position:'absolute',bottom:38,right:40}}/><HomeBar/></div>
}
function ProfileCard({compact=false}){
 return <div style={{background:'white',border:'1px solid #d8dde2',borderRadius:18,overflow:'hidden',width:compact?405:505}}>
 <Img src={staticFile('banner.jpg')} style={{width:'100%',height:compact?100:132,objectFit:'cover',display:'block'}}/>
 <div style={{padding:'16px 20px'}}><div style={{display:'flex',gap:13,alignItems:'center'}}><Avatar person size={compact?42:53}/><div><div style={{fontSize:compact?21:24,fontWeight:750}}>布施千佳純</div><div style={{color:'#667281',fontSize:20}}>@chikaidev</div></div></div><div style={{fontSize:compact?19:24,marginTop:13,lineHeight:1.5}}>AI動画とアプリ制作の発信</div><div style={{fontSize:18,color:'#71808e',marginTop:8}}>x.com</div></div></div>
}
function bubbleHeight(m){if(m.kind==='link')return 450;if(m.kind==='photo')return 485;return m.text.length>19?120:80;}
function Bubble({m,f}){
 let a=clamp((f-sec(m.at))/8);let sc=spring({frame:Math.max(0,f-sec(m.at)),fps:30,config:{damping:19,stiffness:260,mass:.65}});
 return <div style={{display:'flex',gap:12,justifyContent:m.side==='out'?'flex-end':'flex-start',alignItems:'flex-start',height:bubbleHeight(m),overflow:'hidden',marginBottom:16,opacity:a,transform:`translateY(${(1-sc)*18}px) scale(${.96+.04*sc})`,transformOrigin:m.side==='out'?'right bottom':'left bottom'}}>
 {m.side==='in'&&<Avatar/>}
 {m.side==='out'&&<div style={{alignSelf:'flex-end',fontSize:18,color:'#536b80',textAlign:'right',marginBottom:5,lineHeight:1.35}}>{f>sec(m.at)+17?'既読':''}<br/>21:41</div>}
 <div style={{position:'relative',padding:m.kind?'0':'18px 23px',maxWidth:510,borderRadius:m.side==='out'?'24px 5px 24px 24px':'5px 24px 24px 24px',background:m.side==='out'?'#87e56e':'#fff',color:'#17232d',fontSize:29,lineHeight:1.45,boxShadow:'0 1px 1px #0000000a'}}>
 {m.kind==='link'?<><div style={{padding:'15px 19px',fontSize:25,color:'#164b93',textDecoration:'underline'}}>{m.text}</div>{f>sec(m.at)+10?<ProfileCard/>:<div style={{height:220,width:505,background:'#eff2f4',borderRadius:20}}/>}</>:m.kind==='photo'?<div style={{width:380,height:469,overflow:'hidden',borderRadius:20,background:'white'}}><div style={{transform:'scale(.528)',transformOrigin:'top left',width:720,height:887}}><Profile f={sec(34)} photo/></div></div>:m.text}
 </div>{m.side==='in'&&<span style={{fontSize:18,color:'#536b80',alignSelf:'flex-end',marginBottom:5}}>21:41</span>}</div>
}
function Chat({f,final=false}){
 const active=typingAt(f),t=typed(active,f);
 const visible=messages.filter(m=>sec(m.at)<=f);
 let total=0;for(const m of visible){total+=(bubbleHeight(m)+16)*ease((f-sec(m.at))/9)}
 const areaH=H-161-367-82;
 const offset=Math.max(0,total-areaH+24);
 let val=t.value;const paste=f>=sec(22.92)&&f<sec(23.5);if(paste)val='https://x.com/chikaidev';
 const popup=f>=sec(22.5)&&f<sec(22.92);
 const tray=f>=sec(36.9)&&f<sec(37.65);
 return <AbsoluteFill style={{background:'#91acd2',overflow:'hidden'}}>
 <div style={{position:'absolute',width:820,height:820,left:-280,top:160,border:'1px solid #ffffff17',borderRadius:'50%'}}/><div style={{position:'absolute',width:520,height:520,right:-140,top:420,border:'1px solid #ffffff17',borderRadius:'50%'}}/>
 <Status/><div style={{position:'absolute',top:77,left:0,right:0,height:79,display:'flex',alignItems:'center',padding:'0 22px',gap:22,background:'#91acd2',zIndex:14}}><Icon name="back" size={36}/><span style={{fontSize:30,fontWeight:700}}>りょう</span><span style={{marginLeft:'auto'}}/><Icon name="search" size={32}/><Icon name="phone" size={30}/><Icon name="menu" size={34}/></div>
 <div style={{position:'absolute',top:162,bottom:449,left:0,right:0,overflow:'hidden',padding:'0 22px'}}><div style={{transform:`translateY(-${offset}px)`,paddingTop:8}}>{visible.map((m,i)=><Bubble key={i} m={m} f={f}/>)}</div></div>
 <div style={{position:'absolute',bottom:367,height:82,left:0,right:0,display:'flex',alignItems:'center',padding:'0 16px',gap:16,background:'#f8f9fc',zIndex:15}}>
 <Icon name="plus" size={31}/><Icon name="camera" size={32}/><Icon name="photo" size={30}/><div style={{flex:1,minWidth:0,borderRadius:27,background:'#fff',border:'1px solid #e0e4e9',height:56,padding:'8px 15px',fontSize:25,whiteSpace:'nowrap',overflow:'hidden',display:'flex',alignItems:'center'}}>
 <span style={{textDecoration:t.preedit?'underline':'none',textDecorationColor:'#738195',textUnderlineOffset:6}}>{val}</span><span style={{height:29,width:3,background:'#1683fc',opacity:val||f%30<17?1:0,flexShrink:0}}/></div>
 <Icon name={val?'send':'mic'} color={val?'#248bf5':'#68727e'} size={32}/>
 {popup&&<div style={{position:'absolute',left:176,bottom:78,background:'white',padding:'19px 27px',borderRadius:18,fontSize:24,boxShadow:'0 5px 22px #0003'}}>ペースト　 自動入力</div>}
 </div><Keyboard f={f} m={active}/>
 {tray&&<div style={{position:'absolute',bottom:367,left:0,right:0,height:250,background:'#f8f9fc',padding:16,zIndex:22,display:'flex',gap:14,transform:`translateY(${(1-ease((f-sec(36.9))/8))*250}px)`}}><div style={{width:139,height:213,border:'3px solid #2589ff',borderRadius:10,overflow:'hidden'}}><div style={{width:720,height:1000,transform:'scale(.19)',transformOrigin:'top left'}}><Profile f={sec(34)} photo/></div></div><div style={{position:'absolute',right:22,bottom:15,borderRadius:25,background:'#1688f8',color:'white',padding:'12px 25px',fontSize:25}}>送信 ①</div></div>}
 {final&&<div style={{position:'absolute',top:160,left:32,right:32,padding:25,background:'#ffffffed',borderRadius:24,boxShadow:'0 12px 55px #36507825',zIndex:35,opacity:ease((f-sec(44.7))/15),transform:`translateY(${(1-ease((f-sec(44.7))/15))*20}px)`}}><div style={{fontSize:24,color:'#546272'}}>気になる人、見つけた。</div><div style={{display:'flex',alignItems:'center',gap:16,marginTop:14}}><Avatar person size={72}/><div><div style={{fontSize:39,fontWeight:850,letterSpacing:-1}}>@chikaidev</div><div style={{fontSize:22}}>AI動画・アプリ制作の裏側を発信</div></div></div></div>}
 </AbsoluteFill>
}
function Profile({f,photo=false}){
 const scroll=photo?0:(f>sec(32.3)&&f<sec(36.5)?lerp(0,220,ease((f-sec(32.3))/22)):0);
 const selection=f>=sec(20)&&f<sec(21.5);
 return <AbsoluteFill style={{background:'white',overflow:'hidden'}}><Status bg="white"/>
 <div style={{position:'absolute',top:78,left:0,right:0,height:75,padding:'0 25px',display:'flex',alignItems:'center',gap:25,borderBottom:'1px solid #eef0f2',background:'white',zIndex:5}}><Icon name="back" size={34}/><div style={{fontSize:26,fontWeight:750}}>布施千佳純<div style={{fontSize:18,fontWeight:400,color:'#6c7884'}}>プロフィール</div></div><span style={{marginLeft:'auto',fontSize:39}}>𝕏</span></div>
 <div style={{position:'absolute',top:153,left:0,right:0,transform:`translateY(-${scroll}px)`}}>
 <Img src={staticFile('banner.jpg')} style={{width:720,height:240,objectFit:'cover'}}/>
 <div style={{padding:'0 29px'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',height:128}}><div style={{marginTop:-71,borderRadius:'50%',border:'7px solid white',background:'white'}}><Avatar person size={147}/></div><div style={{display:'flex',gap:12,alignItems:'center',marginTop:20}}><div style={{border:'1px solid #ccd3d9',borderRadius:40,padding:13,display:'flex'}}><Icon name="bell" size={28}/></div><div style={{borderRadius:35,background:'#101418',color:'white',fontSize:25,fontWeight:750,padding:'14px 30px'}}>フォロー</div></div></div>
 <div style={{fontSize:32,fontWeight:850,lineHeight:1.4}}>{P.name}<span style={{fontSize:25,color:'#1c9bf0',marginLeft:8}}>●</span></div><div style={{fontSize:26,color:'#687783',marginTop:5}}>{P.handle}</div>
 <div style={{fontSize:28,lineHeight:1.65,marginTop:23}}>{P.bio}</div>
 <div style={{fontSize:23,color:'#72808c',lineHeight:1.7,marginTop:18}}>2019年2月からXを利用しています</div>
 <div style={{display:'flex',gap:30,fontSize:24,marginTop:21}}><span><b>930</b> <span style={{color:'#75808b'}}>フォロー中</span></span><span><b>3,410</b> <span style={{color:'#75808b'}}>フォロワー</span></span></div>
 </div>
 <div style={{display:'flex',justifyContent:'space-around',borderBottom:'1px solid #e4e8eb',marginTop:34,fontSize:25,fontWeight:650,color:'#66737e',padding:'21px 0'}}><span style={{color:'#111',borderBottom:'5px solid #1d9bf0',paddingBottom:14,marginBottom:-21}}>ポスト</span><span>返信</span><span>ハイライト</span><span>メディア</span></div>
 <div style={{padding:'36px 30px',color:'#7d8790',fontSize:22,textAlign:'center'}}>AI動画も、アプリも。作る過程を見に行こう。</div>
 </div>
 {!photo&&<><div style={{position:'absolute',bottom:87,left:0,right:0,height:82,background:'#f6f7f9',display:'flex',alignItems:'center',padding:'0 26px',gap:24,borderTop:'1px solid #e3e6ea',zIndex:30}}>
 <span style={{fontSize:24}}>ぁあ</span><div style={{flex:1,textAlign:'center',fontSize:26,color:'#23313d',background:selection?'#badbff':'#e7e9ed',padding:12,borderRadius:18}}>{selection?'https://x.com/chikaidev':'🔒 x.com/chikaidev'}</div><Icon name="share" size={30}/></div>
 <div style={{position:'absolute',bottom:27,left:0,right:0,height:59,background:'#f6f7f9',display:'flex',alignItems:'center',justifyContent:'space-around',color:'#147df5',zIndex:30}}><Icon name="back"/><Icon name="chev"/><Icon name="bookmark"/><Icon name="tab"/></div><HomeBar/>
 {selection&&<div style={{position:'absolute',bottom:182,left:172,background:'#f9fafc',borderRadius:17,boxShadow:'0 4px 23px #0003',padding:'19px 28px',fontSize:25,zIndex:35}}>カット　 <b style={{color:f>sec(20.45)?'#1680f8':'#142131'}}>コピー</b>　 ペースト</div>}</>}
 </AbsoluteFill>
}
function Search({f}){
 const p=clamp((f-sec(15.4))/(sec(17)-sec(15.4)));const val='chikaidev'.slice(0,Math.floor(p*9));
 return <AbsoluteFill style={{background:'linear-gradient(135deg,#57746c,#303846 55%,#a38978)'}}><Status light/>
 <div style={{position:'absolute',top:154,left:28,right:28,borderRadius:28,background:'#ffffff22',padding:27,display:'flex',justifyContent:'space-around'}}>{['𝕏','◎','LINE','✿'].map((x,i)=><div style={{textAlign:'center',color:'white',fontSize:19}} key={x}><div style={{borderRadius:22,background:['#101114','#bc4267','#20bc61','#fafafa'][i],width:101,height:101,fontSize:i===2?24:65,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,color:i===3?'#fb7373':'white'}}>{x}</div>{['X','Instagram','LINE','写真'][i]}</div>)}</div>
 <div style={{position:'absolute',top:340,left:28,right:28,background:'#ffffffd8',borderRadius:22,overflow:'hidden',opacity:clamp((f-sec(16.2))/8)}}><div style={{padding:23,color:'#75808b',fontSize:22}}>Webを検索</div><div style={{padding:'15px 25px 30px',fontSize:29,display:'flex',alignItems:'center',gap:18}}><Icon name="search"/><span>{val}</span><Icon name="chev" style={{marginLeft:'auto'}}/></div></div>
 <div style={{position:'absolute',bottom:387,left:25,right:25,borderRadius:24,background:'#ffffffda',height:71,display:'flex',gap:17,alignItems:'center',padding:'0 23px',fontSize:29}}><Icon name="search"/>{val}<span style={{width:3,height:34,background:'#198aff'}}/><Icon name="close" size={25} style={{marginLeft:'auto'}}/></div><Keyboard f={f} mode="latin"/>
 </AbsoluteFill>
}
function Camera({f,hasVideo=true}){
 return <AbsoluteFill style={{background:'#171414'}}>
 {hasVideo?<OffthreadVideo src={staticFile('human.mp4')} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{position:'absolute',inset:0,background:'linear-gradient(120deg,#e0bfa5,#3f3030)'}}/>}
 <div style={{position:'absolute',inset:0,background:'linear-gradient(#0003,transparent 22%,transparent 77%,#0006)'}}/>
 <Status light/><div style={{position:'absolute',bottom:158,left:0,right:0,textAlign:'center',fontSize:25,color:'white',letterSpacing:18}}>ビデオ　 <span style={{color:'#ffd554'}}>写真</span>　 ポートレート</div>
 <div style={{position:'absolute',left:305,bottom:48,width:111,height:111,borderRadius:'50%',border:'5px solid white',padding:7}}><div style={{background:'white',width:'100%',height:'100%',borderRadius:'50%'}}/></div>
 <div style={{position:'absolute',top:82,left:21,right:21,borderRadius:29,padding:'18px 22px',display:'flex',gap:16,background:'#f1f2f2f2',color:'#151a20',boxShadow:'0 12px 35px #0002',transform:`translateY(${lerp(-230,0,spring({frame:Math.max(0,f-sec(.55)),fps:30,config:{damping:19,stiffness:190}}))}px)`,opacity:f>=sec(.55)?1:0}}><div style={{background:'#1dc85f',borderRadius:14,color:'white',width:66,height:66,fontSize:17,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center'}}>LINE</div><div><div style={{fontSize:25,fontWeight:750}}>りょう</div><div style={{fontSize:29,marginTop:5}}>ちょっと聞いていい？</div></div><span style={{marginLeft:'auto',fontSize:20,color:'#717a84'}}>今</span></div>
 </AbsoluteFill>
}
function Switcher({f,start,from,to,fromF,toF,duration=.9}){
 const p=clamp((f-sec(start))/sec(duration));const a=ease(p/.3),shift=ease((p-.28)/.38),grow=ease((p-.66)/.34);const s=lerp(1,.76,a)+.24*grow;
 const ax=lerp(0,-600,shift),bx=lerp(610,0,shift);const y=lerp(0,-10,a);
 const card=(content,x,isNew)=><div style={{position:'absolute',left:0,top:0,width:720,height:1280,transform:`translate(${x}px,${y}px) scale(${s})`,borderRadius:lerp(0,54,a)*(1-grow),overflow:'hidden',boxShadow:'0 10px 50px #0004',opacity:isNew?clamp(p*8):1-clamp((p-.86)/.14)}}>{content}<div style={{position:'absolute',top:0,left:0,right:0,height:70,background:'#0000'}}/></div>;
 return <AbsoluteFill style={{background:'linear-gradient(125deg,#8fa69b,#5f606b 50%,#b68e7d)',overflow:'hidden'}}>
 {card(from,ax,false)}{card(to,bx,true)}
 {p>.2&&p<.7&&<div style={{position:'absolute',top:54,left:55,right:55,display:'flex',justifyContent:'space-between',fontSize:25,color:'white'}}><span>{fromF}</span><span>{toF}</span></div>}
 </AbsoluteFill>
}
function Tap({f,at,x,y}){const t=f-sec(at);if(t<0||t>10)return null;return <div style={{position:'absolute',left:x-31,top:y-31,width:62,height:62,borderRadius:'50%',border:'3px solid #7f879665',background:'#9caec222',transform:`scale(${.65+t/18})`,opacity:1-t/11,zIndex:100}}/>}
function Intro({hasVideo=true}){
 const f=useCurrentFrame();let content;
 if(f<sec(2.1))content=<Camera f={f} hasVideo={hasVideo}/>;
 else if(f<sec(2.4)){let p=ease((f-sec(2.1))/9);content=<><Camera f={sec(2)} hasVideo={hasVideo}/><div style={{position:'absolute',inset:0,transform:`translateY(${(1-p)*80}px) scale(${.95+.05*p})`,opacity:p}}><Chat f={f}/></div></>}
 else if(f<sec(14.1))content=<Chat f={f}/>;
 else if(f<sec(15.0))content=<Switcher f={f} start={14.1} from={<Chat f={sec(14)}/>} to={<Search f={sec(15)}/>} fromF="LINE" toF="検索"/>;
 else if(f<sec(17.65))content=<Search f={f}/>;
 else if(f<sec(18.1)){let p=ease((f-sec(17.65))/14);content=<><Search f={sec(17.6)}/><div style={{position:'absolute',inset:0,transform:`scale(${.72+.28*p})`,opacity:p,borderRadius:(1-p)*50,overflow:'hidden'}}><Profile f={f}/></div></>}
 else if(f<sec(21.5))content=<Profile f={f}/>;
 else if(f<sec(22.4))content=<Switcher f={f} start={21.5} from={<Profile f={sec(21.3)}/>} to={<Chat f={sec(22.4)}/>} fromF="Safari" toF="LINE"/>;
 else if(f<sec(31.1))content=<Chat f={f}/>;
 else if(f<sec(31.65)){let p=ease((f-sec(31.1))/17);content=<><Chat f={sec(31.1)}/><div style={{position:'absolute',inset:0,transform:`translateX(${(1-p)*720}px)`,boxShadow:'-15px 0 60px #0003'}}><Profile f={f}/></div></>}
 else if(f<sec(35.7))content=<Profile f={f}/>;
 else if(f<sec(36.6))content=<Switcher f={f} start={35.7} from={<Profile f={sec(35.6)}/>} to={<Chat f={sec(36.6)}/>} fromF="Safari" toF="LINE"/>;
 else content=<Chat f={f} final={f>=sec(44.7)}/>;
 return <AbsoluteFill style={{fontFamily:'NotoJP, sans-serif',color:'#17232d',overflow:'hidden'}}>
 <style>{`@font-face{font-family:NotoJP;src:url("${staticFile('font.ttf')}")}*{box-sizing:border-box}`}</style>{content}
 <Tap f={f} at={2.07} x={290} y={146}/><Tap f={f} at={17.6} x={350} y={420}/><Tap f={f} at={20.5} x={374} y={1052}/><Tap f={f} at={22.84} x={263} y={813}/><Tap f={f} at={31.06} x={399} y={345}/>
 {f>=sec(35.05)&&f<sec(35.3)&&<AbsoluteFill style={{background:'white',opacity:1-clamp((f-sec(35.05))/8),zIndex:90}}/>}
 {f>=sec(35.3)&&f<sec(35.7)&&<div style={{position:'absolute',left:20,bottom:60,width:108,height:193,border:'3px solid white',borderRadius:14,overflow:'hidden',boxShadow:'0 4px 16px #0005',zIndex:95}}><div style={{width:720,height:1280,transform:'scale(.15)',transformOrigin:'top left'}}><Profile f={sec(34)} photo/></div></div>}
 <div style={{position:'absolute',bottom:3,right:12,fontSize:14,color:f<sec(2.1)?'#ffffffb0':'#53617495',zIndex:110}}>会話は演出</div>
 </AbsoluteFill>
}
registerRoot(()=> <Composition id="ChikaidevIntro" component={Intro} durationInFrames={1440} fps={30} width={720} height={1280} defaultProps={{hasVideo:true}}/>);
