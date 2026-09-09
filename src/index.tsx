import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame,interpolate,spring,Img,OffthreadVideo,Sequence,staticFile} from 'remotion';
const FPS=30,W=720,H=1480;
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
{side:'in',at:36.8,text:'このプロフィール見つけた'},
{side:'in',at:37.65,kind:'photo',text:''},
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
 return {value:converted?m.text:chars.slice(0,n).join(''),candidate:converted?m.text:m.text.slice(0,Math.max(1,Math.round(n/chars.length*m.text.length))),key:p<.94?Math.max(0,n)%12:-1,preedit:!converted};
}
function Icon({name,size=32,color='currentColor',fill='none',style={}}){
 const paths={globe:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M2 12h20M12 2c6 5 6 15 0 20-6-5-6-15 0-20M4 7h16M4 17h16',smile:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M8 9h.1M16 9h.1M7 14q5 7 10 0',forward:'M3 12h17m-5-5 5 5-5 5',undo:'M8 4 3 8l5 4M3 8h9a7 7 0 1 1-5 12',backspace:'M9 4h13v16H9L2 12zM12 8l6 8M18 8l-6 8',calendar:'M3 5h18v17H3zM3 9h18M7 2v5M17 2v5M10 13h4v5',back:'M15 4 7 12l8 8',search:'M20 20l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',phone:'M5 3 2 6c1 8 8 15 16 16l3-3-5-5-3 3-6-6 3-3z',menu:'M4 6h16M4 12h16M4 18h16',plus:'M12 3v18M3 12h18',send:'m4 3 17 9-17 9 4-9-4-9 M8 12h13',camera:'M3 7h4l2-3h6l2 3h4v14H3z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0',mic:'M9 3h6v11H9zM5 10v3a7 7 0 0 0 14 0v-3M12 20v3',share:'M12 16V2m-5 5 5-5 5 5M5 11H2v11h20V11h-3',home:'m2 11 10-9 10 9M5 9v13h5v-7h4v7h5V9',bell:'M5 16V9a7 7 0 0 1 14 0v7l3 3H2l3-3M9 22h6',mail:'M2 4h20v16H2zM2 5l10 8L22 5',bookmark:'M5 2h14v20l-7-5-7 5z',photo:'M2 3h20v18H2zM2 17l6-6 4 4 4-6 6 7',close:'m5 5 14 14M19 5 5 19',chev:'m7 4 8 8-8 8',tab:'M4 7h13v15H4zM8 2h13v15'};
 return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}><path d={paths[name]||paths.menu}/></svg>
}
function Status({light=false,bg='transparent'}){return <div style={{position:'absolute',left:0,right:0,top:0,height:76,display:'flex',alignItems:'center',padding:'0 34px',fontSize:26,fontWeight:650,background:bg,color:light?'#fff':'#17202c',zIndex:60}}><span>21:41</span><span style={{marginLeft:'auto'}}/><svg width="32" height="25" viewBox="0 0 28 22" fill="currentColor"><rect x="1" y="14" width="4" height="7" rx="1"/><rect x="8" y="10" width="4" height="11" rx="1"/><rect x="15" y="5" width="4" height="16" rx="1"/><rect x="22" y="1" width="4" height="20" rx="1"/></svg><svg width="32" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{marginLeft:10}}><path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg><svg width="47" height="25" viewBox="0 0 37 20" fill="none" stroke="currentColor" style={{marginLeft:12}}><rect x="1" y="1" width="31" height="18" rx="4" strokeWidth="1.5"/><rect x="4" y="4" width="25" height="12" rx="2" fill="currentColor"/><path d="M35 6v8" strokeWidth="2.5"/></svg></div>}

function HomeBar({light=false}){return <div style={{position:'absolute',bottom:14,width:246,height:8,borderRadius:8,background:light?'white':'#17202c',left:237,zIndex:80}}/>}
function Avatar({person=false,size=46}){return person?<Img src={staticFile('avatar.jpg')} style={{width:size,height:size,borderRadius:'50%',objectFit:'cover'}}/>:<div style={{width:size,height:size,borderRadius:'50%',background:'#e1d1bd',display:'flex',justifyContent:'center',alignItems:'center',fontSize:size*.48}}>涼</div>}
const syllables=['あいうえお','かきくけこ','さしすせそ','たちつてと','なにぬねの','はひふへほ','まみむめも','やゆよ','らりるれろ','わをんー'];
function inputKey(c){const norm=(c||'').normalize('NFD')[0]||'';const small={'ゃ':'や','ゅ':'ゆ','ょ':'よ','っ':'つ','ぁ':'あ','ぃ':'い','ぅ':'う','ぇ':'え','ぉ':'お'};return syllables.findIndex(g=>g.includes(small[norm]||norm));}
function AppIcon({app,size=60,style={}}){const id={line:443904275,instagram:389801252,x:333903271,safari:1146562112}[app];return <Img src={staticFile('icons/'+id+'.png')} style={{width:size,height:size,borderRadius:size*.22,objectFit:'cover',...style}}/>}
function Keyboard({f,mode='kana',m=null}){
 const t=typed(m,f);const dy=lerp(525,0,ease((f-sec(2.3))/11));const character=Array.from(t.value).at(-1);const active=t.preedit?inputKey(character):-1;
 const keys=[['forward','あ','か','さ','backspace'],['undo','た','な','は','空白'],['ABC','ま','や','ら','改行'],['smile','^^','わ','、。?!',null]];
 const keyIndex={1:0,2:1,3:2,6:3,7:4,8:5,11:6,12:7,13:8,17:9};
 const changed=f%5<3 && t.preedit && character;
 return <div style={{position:'absolute',left:0,right:0,bottom:0,height:525,background:'#bdc8d9',transform:`translateY(${dy}px)`,zIndex:12}}>
 <div style={{height:75,display:'flex',alignItems:'center',gap:29,padding:'0 25px',fontSize:28,whiteSpace:'nowrap',overflow:'hidden',color:'#303741'}}>
 {t.value?<><span style={{fontWeight:500}}>{t.candidate}</span><span>{m.kana}</span></>:<><span>の</span><span>は</span><span>で</span><span>が</span><span>に</span><span>と</span></>}<span style={{marginLeft:'auto'}}>⌄</span></div>
 {mode==='latin'?<div style={{paddingTop:8}}>{['qwertyuiop','asdfghjkl','zxcvbnm'].map((row,i)=><div key={row} style={{display:'flex',justifyContent:'center',gap:7,marginBottom:10}}>{row.split('').map((c,j)=><div key={c} style={{width:62,height:77,borderRadius:8,background:'chikaidev'[Math.floor(clamp((f-sec(15.4))/48)*9)]===c?'#aab4c3':'white',boxShadow:'0 2px 0 #99a2af',textAlign:'center',fontSize:35,lineHeight:'77px'}}>{c}</div>)}</div>)}<div style={{display:'flex',gap:10,padding:'0 20px'}}><div style={{background:'#a4b1c4',width:120,textAlign:'center',borderRadius:8,padding:20,fontSize:28}}>123</div><div style={{background:'white',flex:1,textAlign:'center',borderRadius:8,padding:20,fontSize:28}}>空白</div><div style={{background:'#087afa',color:'white',width:130,textAlign:'center',borderRadius:8,padding:20,fontSize:28}}>検索</div></div></div>:
 <div style={{padding:'4px 8px 0',display:'grid',gridTemplateColumns:'1fr 1.1fr 1.1fr 1.1fr 1fr',gridTemplateRows:'repeat(4,83px)',gap:'9px 9px'}}>
 {keys.flat().map((c,i)=>{if(c===null)return null;const col=i%5;const on=keyIndex[i]===active&&active>=0&&changed;return <div key={i} style={{gridColumn:col+1,gridRow:c==='改行'?'3 / span 2':Math.floor(i/5)+1,borderRadius:7,background:on?'#8598b6':col===0||i===4||c==='改行'?'#9eaec5':'#fff',boxShadow:'0 2px 0 #8b9bb4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:c.length>3?25:34,color:'#182638',position:'relative'}}>
 {['forward','undo','backspace','smile'].includes(c)?<Icon name={c} size={35}/>:c}
 {on&&<div style={{position:'absolute',bottom:4,left:'50%',transform:'translateX(-50%)',width:112,height:174,background:'#fff',boxShadow:'0 2px 6px #62748b22',borderRadius:'24px 24px 45px 45px',zIndex:25,display:'flex',flexDirection:'column',justifyContent:'space-evenly',alignItems:'center',fontSize:39}}><span style={{fontSize:29}}>{c}</span><span>{character}</span></div>}
 </div>})}</div>}
 <Icon name="globe" size={43} style={{position:'absolute',bottom:45,left:49}}/><Icon name="mic" size={39} style={{position:'absolute',bottom:45,right:49}}/><HomeBar/></div>;
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
 const active=typingAt(f),t=typed(active,f);const visible=messages.filter(m=>sec(m.at)<=f);const areaH=H-94-689;
 let total=0;for(const m of visible)total+=(bubbleHeight(m)+16)*ease((f-sec(m.at))/9);
 const offset=Math.max(0,total-areaH+28);
 let val=t.value;if(f>=sec(22.92)&&f<sec(23.5))val='https://x.com/chikaidev';
 const popup=f>=sec(22.5)&&f<sec(22.92);
 return <AbsoluteFill style={{background:'#88a1c9',overflow:'hidden'}}>
 <div style={{position:'absolute',top:0,left:0,right:0,height:94,display:'flex',alignItems:'center',padding:'0 21px',gap:14,background:'#88a1c9',zIndex:14}}>
 <Icon name="back" size={29}/><span style={{fontSize:25,marginLeft:-15,marginRight:9}}>19</span><span style={{fontSize:29,fontWeight:750}}>りょう</span><span style={{marginLeft:'auto'}}/><Icon name="search" size={31}/><span style={{width:10}}/><Icon name="phone" size={31}/><span style={{width:10}}/><Icon name="calendar" size={30}/><span style={{width:8}}/><Icon name="menu" size={31}/></div>
 <div style={{position:'absolute',top:94,bottom:689,left:0,right:0,overflow:'hidden',padding:'0 19px'}}><div style={{transform:`translateY(-${offset}px)`,paddingTop:12}}>{visible.map((m,i)=><Bubble key={i} m={m} f={f}/>)}</div></div>
 <div style={{position:'absolute',bottom:595,height:94,left:0,right:0,display:'flex',alignItems:'center',padding:'0 22px',gap:22,background:'#fff',zIndex:15}}>
 <Icon name="chev" size={28}/><div style={{flex:1,minWidth:0,position:'relative',borderRadius:25,background:'#f5f5f5',height:59,padding:'8px 43px 8px 17px',fontSize:29,whiteSpace:'nowrap',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:val.length>17?'flex-end':'flex-start'}}>
 {!val&&!active?<span style={{color:'#c4c4c4',fontSize:27}}>メッセージを入力</span>:<><span style={{flexShrink:0,textDecoration:t.preedit?'underline':'none',textDecorationColor:'#738195',textUnderlineOffset:5}}>{val}</span><span style={{height:32,width:3,background:'#1683fc',opacity:val||f%30<17?1:0,flexShrink:0}}/></>}
 <Icon name="smile" size={31} color="#69717a" style={{position:'absolute',right:8,top:14,background:'#f5f5f5'}}/></div>
 <Icon name={val?'send':'mic'} color={val?'#526bd9':'#505864'} fill={val?'#526bd9':'none'} size={34}/>
 {popup&&<div style={{position:'absolute',left:110,bottom:91,background:'#fff',padding:'17px 26px',borderRadius:14,fontSize:25,boxShadow:'0 5px 22px #0003'}}>ペースト　 自動入力</div>}</div>
 <div style={{position:'absolute',bottom:525,left:0,right:0,height:70,display:'flex',alignItems:'center',padding:'0 24px',gap:30,background:'white',fontSize:21,color:'#3c4147',zIndex:15}}>
 <Icon name="camera" size={27} color="#60769d"/><span>返信を提案</span><span>話題を提案</span><span>ムードを分析</span></div>
 <Keyboard f={f} m={active}/>
 {final&&<div style={{position:'absolute',top:105,left:32,right:32,padding:22,background:'#ffffffef',borderRadius:22,boxShadow:'0 8px 30px #36507820',zIndex:35,opacity:ease((f-sec(44.7))/15)}}>
 <div style={{display:'flex',alignItems:'center',gap:18}}><Avatar person size={76}/><div><div style={{fontSize:38,fontWeight:800}}>@chikaidev</div><div style={{fontSize:22,marginTop:5}}>AI動画・アプリ制作の裏側を発信</div></div></div></div>}
 </AbsoluteFill>;
}

function Profile({f,photo=false}){
 const scroll=photo?0:(f>sec(32.3)&&f<sec(36.5)?lerp(0,220,ease((f-sec(32.3))/22)):0);
 const selection=f>=sec(20)&&f<sec(21.5);
 return <AbsoluteFill style={{background:'white',overflow:'hidden'}}><Status bg="white"/>
 <div style={{position:'absolute',top:78,left:0,right:0,height:75,padding:'0 25px',display:'flex',alignItems:'center',gap:25,borderBottom:'1px solid #eef0f2',background:'white',zIndex:5}}><Icon name="back" size={34}/><div style={{fontSize:26,fontWeight:750}}>布施千佳純<div style={{fontSize:18,fontWeight:400,color:'#6c7884'}}>プロフィール</div></div><AppIcon app='x' size={43} style={{marginLeft:'auto'}}/></div>
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
 return <AbsoluteFill style={{background:'linear-gradient(135deg,#6d7970,#373942 55%,#927b63)'}}><Status light/>
 <div style={{position:'absolute',top:137,left:32,right:32,borderRadius:28,background:'#ffffff18',padding:27,display:'flex',justifyContent:'space-around'}}>
 {['x','instagram','line','safari'].map((a,i)=><div key={a} style={{textAlign:'center',color:'white',fontSize:23}}><AppIcon app={a} size={109} style={{display:'block',marginBottom:13}}/>{['X','Instagram','LINE','Safari'][i]}</div>)}</div>
 <div style={{position:'absolute',top:345,left:32,right:32,background:'#ffffffdf',borderRadius:24,overflow:'hidden',opacity:clamp((f-sec(16.2))/8)}}>
 <div style={{padding:23,color:'#75808b',fontSize:23}}>Webを検索</div><div style={{padding:'14px 25px 30px',fontSize:29,display:'flex',alignItems:'center',gap:20}}><AppIcon app="safari" size={54}/><span>{val}</span><Icon name="chev" style={{marginLeft:'auto'}}/></div></div>
 <div style={{position:'absolute',bottom:548,left:26,right:26,borderRadius:24,background:'#ffffffdf',height:75,display:'flex',gap:17,alignItems:'center',padding:'0 23px',fontSize:30}}><Icon name="search"/>{val}<span style={{width:3,height:35,background:'#198aff'}}/><Icon name="close" size={26} style={{marginLeft:'auto'}}/></div><Keyboard f={f} mode="latin"/>
 </AbsoluteFill>;
}

function Camera({f,hasVideo=true}){
 return <AbsoluteFill style={{background:'#171414'}}>
 {hasVideo?<OffthreadVideo src={staticFile('human.mp4')} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{position:'absolute',inset:0,background:'linear-gradient(120deg,#e0bfa5,#3f3030)'}}/>}
 <div style={{position:'absolute',inset:0,background:'linear-gradient(#0003,transparent 22%,transparent 77%,#0006)'}}/>
 <Status light/><div style={{position:'absolute',bottom:158,left:0,right:0,textAlign:'center',fontSize:25,color:'white',letterSpacing:18}}>ビデオ　 <span style={{color:'#ffd554'}}>写真</span>　 ポートレート</div>
 <div style={{position:'absolute',left:305,bottom:48,width:111,height:111,borderRadius:'50%',border:'5px solid white',padding:7}}><div style={{background:'white',width:'100%',height:'100%',borderRadius:'50%'}}/></div>
 <div style={{position:'absolute',top:82,left:21,right:21,borderRadius:29,padding:'18px 22px',display:'flex',gap:16,background:'#f1f2f2f2',color:'#151a20',boxShadow:'0 12px 35px #0002',transform:`translateY(${lerp(-230,0,spring({frame:Math.max(0,f-sec(.55)),fps:30,config:{damping:19,stiffness:190}}))}px)`,opacity:f>=sec(.55)?1:0}}><AppIcon app='line' size={66}/><div><div style={{fontSize:25,fontWeight:750}}>りょう</div><div style={{fontSize:29,marginTop:5}}>ちょっと聞いていい？</div></div><span style={{marginLeft:'auto',fontSize:20,color:'#717a84'}}>今</span></div>
 </AbsoluteFill>
}
function Switcher({f,start,from,to,fromF,toF,duration=.9}){
 const p=clamp((f-sec(start))/sec(duration));const a=ease(p/.3),shift=ease((p-.28)/.38),grow=ease((p-.66)/.34);const s=lerp(1,.76,a)+.24*grow;
 const ax=lerp(0,-600,shift),bx=lerp(610,0,shift);const y=lerp(0,-10,a);
 const card=(content,x,isNew)=><div style={{position:'absolute',left:0,top:0,width:720,height:H,transform:`translate(${x}px,${y}px) scale(${s})`,borderRadius:lerp(0,54,a)*(1-grow),overflow:'hidden',boxShadow:'0 10px 50px #0004',opacity:isNew?clamp(p*8):1-clamp((p-.86)/.14)}}>{content}<div style={{position:'absolute',top:0,left:0,right:0,height:70,background:'#0000'}}/></div>;
 return <AbsoluteFill style={{background:'linear-gradient(125deg,#8fa69b,#5f606b 50%,#b68e7d)',overflow:'hidden'}}>
 {card(from,ax,false)}{card(to,bx,true)}
 {p>.2&&p<.7&&<div style={{position:'absolute',top:29,left:55,right:55,display:'flex',justifyContent:'space-between',fontSize:25,color:'white'}}><span style={{display:'flex',alignItems:'center',gap:12}}><AppIcon app={fromF==='LINE'?'line':'safari'} size={39}/>{fromF}</span><span style={{display:'flex',alignItems:'center',gap:12}}><AppIcon app={toF==='LINE'?'line':'safari'} size={39}/>{toF}</span></div>}
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
 <div style={{position:'absolute',bottom:3,right:12,fontSize:14,color:f<sec(2.1)?'#ffffffb0':'#53617495',zIndex:110}}>会話は演出</div>
 </AbsoluteFill>
}
function Film(props){return <AbsoluteFill style={{background:'#000'}}><div style={{position:'absolute',left:97.2,top:112,width:720,height:1480,transform:'scale(.73)',transformOrigin:'top left',overflow:'hidden'}}><Intro {...props}/></div></AbsoluteFill>}
registerRoot(()=> <Composition id="ChikaidevIntro" component={Film} durationInFrames={1440} fps={30} width={720} height={1280} defaultProps={{hasVideo:true}}/>);
