/* ============================================
   PIXEL HUMAN ENGINE v2 — 24×30, 3-tone shading
   ============================================ */
const V2DATA = {"BASE": ["........................", "........................", "......oooooooooooo......", ".....oSSSSsssssssdo.....", ".....oSSsssssssssdo.....", ".....oSsssssssssddo.....", ".....osssssssssssdo.....", ".....osBBssssssBBso.....", ".....oswwesssswweso.....", ".....osiwessssiweso.....", ".....osssssssssssdo.....", ".....osrssssssssrdo.....", ".....osssssddssssso.....", ".....ossssmmmmsssso.....", ".....ossssssssssddo.....", "......ossssssssddo......", ".......ossssssddo.......", "......oCCcccccccvo......", "......oCccccccccvo......", "...oHooCcccccccvooHo....", "...oHooCcccccccvooHo....", "...oHooccccccccvooHo....", "......occccccccvvo......", "......ovvvvvvvvvvo......", ".......opppooppppo......", ".......oPppo.oPppo......", ".......oPppo.oPppo......", ".......opppo.opppo......", ".......oxxxo.oxxxo......", "........................"], "HAIR": {"short": [[2, ".....ohhhhhhhhhhhho....."], [3, ".....oHhhhhhhhhhhgo....."], [4, ".....ohhsssssssshgo....."], [5, ".....ohssssssssssgo....."]], "long": [[2, ".....ohhhhhhhhhhhho....."], [3, ".....oHhhhhhhhhhhgo....."], [4, ".....ohhsssssssshgo....."], [5, ".....ohssssssssssgo....."], [6, ".....ohssssssssssgo....."], [7, ".....ohssssssssssgo....."], [10, ".....ohssssssssssgo....."], [11, ".....ohgssssssssggo....."], [12, ".....ohgssssssssggo....."], [13, ".....ogghsssssghggo....."]], "pony": [[2, ".....ohhhhhhhhhhhho....."], [3, ".....oHhhhhhhhhhhgo....."], [4, ".....ohhsssssssshgo....."], [5, ".....ohssssssssssgo....."], [4, ".................ohho..."], [5, ".................ohgo..."], [6, ".................ohgo..."], [7, "..................ogo..."]], "bun": [[0, ".........oggo..........."], [1, "........oghhgo.........."], [2, ".....ohhhhhhhhhhhho....."], [3, ".....oHhhhhhhhhhhgo....."], [4, ".....ohhsssssssshgo....."], [5, ".....ohssssssssssgo....."]], "spiky": [[1, "......HghghghghgHg......"], [2, ".....ohHhHhHhHhHhho....."], [3, ".....ohhhhhhhhhhhho....."], [4, ".....ohhsssssssshgo....."]], "afro": [[0, ".......oghhhhhhgo......."], [1, ".....oghhhhhhhhhgo......"], [2, ".....oghhhhhhhhhhgo....."], [3, ".....oHhhhhhhhhhhgo....."], [4, ".....ohhsssssssshgo....."], [5, ".....oghssssssssggo....."]], "bald": []}, "HATS": {"none": [], "cap": [[1, ".....oAAAAAAAAAAAAo....."], [2, ".....oAAAAAAAAAAAABB...."]], "beanie": [[0, ".....oAAAAAAAAAAAAo....."], [1, ".....oAAAAAAAAAAAAo....."], [2, ".....oAAAAAAAAAAAAo....."]], "crown": [[0, "......AoAAoAAoAAoA......"], [1, ".....oAAAAAAAAAAAAo....."], [2, ".....oAyAAyAAyAAyAo....."]], "phones": [[1, ".......DDDDDDDDDD......."], [2, ".....DD................."], [2, ".................DD....."], [8, "....EE.................."], [8, "..................EE...."], [9, "....EE.................."], [9, "..................EE...."]], "party": [[0, "...........AA..........."], [1, "..........AAAA.........."], [2, ".........AAAAAA........."]]}, "HAIRSTYLES": ["short", "long", "pony", "bun", "spiky", "afro", "bald"], "HATS2": ["none", "cap", "beanie", "crown", "phones", "party"]};
const BASE_G = V2DATA.BASE;
const HAIR_G = V2DATA.HAIR;
const HATS_G = V2DATA.HATS;
const HAIRSTYLES = V2DATA.HAIRSTYLES;
const HATS2 = V2DATA.HATS2;

const SKINS      = ['#ffd9b3','#f0c08a','#d39e6e','#a9744a','#754c2e'];
const HAIRCOLORS = ['#1c1622','#4a2f1c','#86592e','#e3bd5a','#cfd0da','#ff7ec9','#7d6cff','#e85a6a','#37d6c0','#ff9a3c'];
const OUTFITS    = ['#6c63ff','#ff4f6d','#22cfe6','#22d57e','#ffd62e','#ff9a2e','#ff7ec0','#eef0f7','#a14fd6','#2bb3a3','#2a2a40','#ec407a'];
const PANTSC     = ['#34345c','#1d1d2a','#5f4023','#3f3f50','#234a6b','#52214a'];

function shade(hex,a){
  const n=parseInt(hex.slice(1),16);
  const r=Math.max(0,Math.min(255,((n>>16)&255)+a));
  const g=Math.max(0,Math.min(255,((n>>8)&255)+a));
  const b=Math.max(0,Math.min(255,(n&255)+a));
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}

function drawCharacter(canvas, look, scale, frame){
  const Wd=24,Hh=30,S=scale||4;
  canvas.width=Wd*S; canvas.height=Hh*S;
  const x=canvas.getContext('2d'); x.imageSmoothingEnabled=false;
  x.clearRect(0,0,canvas.width,canvas.height);
  look=look||{};
  const skin=SKINS[(look.skin||0)%SKINS.length];
  const hair=HAIRCOLORS[(look.hairColor||0)%HAIRCOLORS.length];
  const cloth=OUTFITS[(look.outfit||0)%OUTFITS.length];
  const pant=PANTSC[(look.pants||0)%PANTSC.length];
  const OUT='#241c2e';
  const P={ '.':null,'o':OUT,
    'S':shade(skin,30),'s':skin,'d':shade(skin,-32),
    'H':shade(hair,34),'h':hair,'g':shade(hair,-36),
    'C':shade(cloth,28),'c':cloth,'v':shade(cloth,-34),
    'P':shade(pant,26),'p':shade(pant,-26),'x':'#231f30',
    'w':'#ffffff','e':'#2a2438','i':'#ffffff','B':shade(hair,-46),
    'm':'#b85a70','r':'#ff9bb0',
    'A':'#ff4f6d','y':'#ffd62e','D':'#26263a','E':'#7d6cff'
  };
  const hairName=HAIRSTYLES[(look.hair||0)%HAIRSTYLES.length]||'short';
  const grid=BASE_G.map(r=>r.split(''));
  (HAIR_G[hairName]||[]).forEach(([r,s])=>{ for(let c=0;c<Wd;c++){ if(s[c]&&s[c]!=='.') grid[r][c]=s[c]; } });
  for(let yy=0;yy<Hh;yy++)for(let xx=0;xx<Wd;xx++){ const col=P[grid[yy][xx]]; if(col){x.fillStyle=col;x.fillRect(xx*S,yy*S,S,S);} }
  const hatName=HATS2[(look.hat||0)%HATS2.length]||'none';
  (HATS_G[hatName]||[]).forEach(([r,s])=>{ for(let c=0;c<Wd;c++){ const ch=s[c];
    if(ch==='A'){x.fillStyle=P['A'];x.fillRect(c*S,r*S,S,S);}
    else if(ch==='B'){x.fillStyle=shade('#ff4f6d',-50);x.fillRect(c*S,r*S,S,S);}
    else if(ch==='y'){x.fillStyle=P['y'];x.fillRect(c*S,r*S,S,S);}
    else if(ch==='D'){x.fillStyle=P['D'];x.fillRect(c*S,r*S,S,S);}
    else if(ch==='E'){x.fillStyle=P['E'];x.fillRect(c*S,r*S,S,S);}
    else if(ch==='o'){x.fillStyle=OUT;x.fillRect(c*S,r*S,S,S);}
  } });
  return canvas;
}
function characterDataURL(look,scale){ const c=document.createElement('canvas'); drawCharacter(c,look,scale||4,0); return c.toDataURL(); }

if (typeof module!=='undefined'){ module.exports={drawCharacter,characterDataURL,SKINS,HAIRCOLORS,OUTFITS,PANTSC,HAIRSTYLES,HATS2,shade}; }

/* ================================================
   PIXEL HQ — APP LOGIC (v2 + wow features)
   ================================================ */
const SUPABASE_URL      = "https://xwfnqxqdlvvykppzlrxj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Zm5xeHFkbHZ2eWtwcHpscnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMTg0NjksImV4cCI6MjA5NTc5NDQ2OX0.Xr46g9TuWFzS3zhVvLAFqyVCqv9Al35W9rGDpXPaIwQ";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const HOST_TIMEOUT_MS=16000, HEARTBEAT_MS=6000, POLL_MS=2500, CHAT_POLL_MS=4000;
const MAX_SONGS_PER_USER=3, ONLINE_CUTOFF_MS=45000;
const XP_SONG_PLAYED=50, XP_REACT=2, XP_GIFT=3, MEH_SKIP_RATIO=0.8, POS_SAVE_MS=600, GIFT_CD=1500;
const REACTION_EMOJI={like:"👍",love:"❤️",fire:"🔥",wow:"😮",woot:"❤️",meh:"💔"};
const EMOTES=["👋","😂","🕺","💃","❤️","🔥","🎉","😎","😭","🙌"];
const GIFTS=["🌹","❤️","🍺","💎","🍕","⭐"];
const DEFAULT_LOOK={ skin:0, hair:0, hairColor:0, outfit:0, pants:0, hat:0 };
const ACHIEVEMENTS=[
  {id:"first_song",label:"🎵 เปิดเพลงแรก!",test:s=>s.songs>=1},
  {id:"dj10",label:"🎧 DJ 10 เพลง!",test:s=>s.songs>=10},
  {id:"woot50",label:"❤️ ได้ 50 woots!",test:s=>s.wootsGot>=50},
  {id:"react100",label:"🙌 รีแอค 100 ครั้ง!",test:s=>s.reacts>=100},
  {id:"lv5",label:"⭐ ถึง Level 5!",test:s=>levelFromXP(myPoints)>=5},
  {id:"gift10",label:"🎁 ส่งของขวัญ 10 ชิ้น!",test:s=>s.gifts>=10},
];

let me        = JSON.parse(localStorage.getItem("bbl_me")||"null");
let myPoints  = parseInt(localStorage.getItem("bbl_pts")||"0");
let myLook    = (me&&me.look)?me.look:{...DEFAULT_LOOK};
let myPos     = (me&&me.pos)?me.pos:{ x:30+Math.random()*40, y:40+Math.random()*30 };
let myStats   = JSON.parse(localStorage.getItem("bbl_stats")||'{"songs":0,"wootsGot":0,"reacts":0,"gifts":0}');
let myAch     = JSON.parse(localStorage.getItem("bbl_ach")||"[]");

let player=null, playerReady=false;
let currentVideoId=null, nowPlayingCache=null;
let hostState=null, isHost=false, booted=false;
let changingSong=false, userUnlockedAudio=false;
let endWatchCount=0, nextRpcCooldown=false, lastProgressVid=null;
let onlineMembers=[];
let myVoteThisSong=null, currentSongAddedBy=null;
let isDancing=false, posSaveTimer=null, rtChannel=null;
let bubbledIds=new Set(), chatBaselineTime=Date.now(), lastGiftAt=0;
let pk={...myLook};

const $ = id => document.getElementById(id);
const EL={
  toast:$("toast"), fxLayer:$("fxLayer"), loginScreen:$("loginScreen"), app:$("app"),
  nameInput:$("nameInput"), skinRow:$("skinRow"), hairStyleRow:$("hairStyleRow"), hairColorRow:$("hairColorRow"),
  outfitRow:$("outfitRow"), pantsRow:$("pantsRow"), hatRow:$("hatRow"), previewCanvas:$("previewCanvas"), previewName:$("previewName"),
  randomBtn:$("randomBtn"), joinBtn:$("joinBtn"),
  lookModal:$("lookModal"), lookCloseBtn:$("lookCloseBtn"), saveLookBtn:$("saveLookBtn"), editLookBtn:$("editLookBtn"),
  skinRow2:$("skinRow2"), hairStyleRow2:$("hairStyleRow2"), hairColorRow2:$("hairColorRow2"), outfitRow2:$("outfitRow2"), pantsRow2:$("pantsRow2"), hatRow2:$("hatRow2"), previewCanvas2:$("previewCanvas2"),
  hostBadge:$("hostBadge"), meLabel:$("meLabel"), myXP:$("myXP"), myLevel:$("myLevel"),
  statusDot:$("statusDot"), statusText:$("statusText"),
  nowTitle:$("nowTitle"), nowBy:$("nowBy"), coverImage:$("coverImage"), songWoots:$("songWoots"),
  likeCount:$("likeCount"), loveCount:$("loveCount"), fireCount:$("fireCount"), wowCount:$("wowCount"),
  wootCount:$("wootCount"), mehCount:$("mehCount"), wootBtn:$("wootBtn"), mehBtn:$("mehBtn"), mehBar:$("mehBar"),
  currentTimeText:$("currentTimeText"), durationText:$("durationText"), progressBar:$("progressBar"), progressDot:$("progressDot"), clickToStart:$("clickToStart"),
  djBoothFigure:$("djBoothFigure"), djBoothName:$("djBoothName"), agentFloor:$("agentFloor"),
  speakerL:$("speakerL"), speakerR:$("speakerR"), equalizerL:$("equalizerL"), equalizerR:$("equalizerR"), skyLayer:$("skyLayer"),
  onlineCount:$("onlineCount"), onlineCount2:$("onlineCount2"),
  queueList:$("queueList"), queueCount:$("queueCount"), youtubeInput:$("youtubeInput"), addSongBtn:$("addSongBtn"),
  boardList:$("boardList"), recentList:$("recentList"), tabQueue:$("tabQueue"), tabBoard:$("tabBoard"), tabRecent:$("tabRecent"),
  emoteBar:$("emoteBar"), giftBar:$("giftBar"),
  chatBox:$("chatBox"), chatInput:$("chatInput"), sendChatBtn:$("sendChatBtn"), imgBtn:$("imgBtn"), imgInput:$("imgInput"),
};

/* char cache */
const charCache={};
function lookHash(l){ return [l.skin,l.hair,l.hairColor,l.outfit,l.pants,l.hat].join('-'); }
function charURL(look,scale){ const k=lookHash(look)+'@'+scale; if(charCache[k])return charCache[k]; const c=document.createElement('canvas'); drawCharacter(c,look,scale,0); const u=c.toDataURL(); charCache[k]=u; return u; }
function levelFromXP(xp){ return Math.floor(Math.sqrt(xp/40))+1; }

/* ===== DRESS-UP ===== */
function swatchRow(rowEl,colors,key,onPick){ rowEl.innerHTML=""; colors.forEach((c,i)=>{ const b=document.createElement("button"); b.className="opt-btn"+(i===pk[key]?" active":""); b.style.background=c; b.onclick=()=>{ pk[key]=i; rowEl.querySelectorAll(".opt-btn").forEach(x=>x.classList.remove("active")); b.classList.add("active"); onPick(); }; rowEl.appendChild(b); }); }
function chipRow(rowEl,names,key,onPick){ rowEl.innerHTML=""; names.forEach((n,i)=>{ const b=document.createElement("button"); b.className="chip"+(i===pk[key]?" active":""); b.textContent=n; b.onclick=()=>{ pk[key]=i; rowEl.querySelectorAll(".chip").forEach(x=>x.classList.remove("active")); b.classList.add("active"); onPick(); }; rowEl.appendChild(b); }); }
function drawPreview(canvas,nameEl){ drawCharacter(canvas,pk,7,0); if(nameEl) nameEl.textContent=((EL.nameInput&&EL.nameInput.value||"").trim()||"PLAYER").toUpperCase(); }
function initPickers(sk,hs,hc,o,p,ht,cv,nm){ const u=()=>drawPreview(cv,nm); swatchRow(sk,SKINS,"skin",u); chipRow(hs,HAIRSTYLES,"hair",u); swatchRow(hc,HAIRCOLORS,"hairColor",u); swatchRow(o,OUTFITS,"outfit",u); swatchRow(p,PANTSC,"pants",u); chipRow(ht,HATS2,"hat",u); u(); }
function randomLook(){ pk={ skin:rnd(SKINS.length),hair:rnd(HAIRSTYLES.length),hairColor:rnd(HAIRCOLORS.length),outfit:rnd(OUTFITS.length),pants:rnd(PANTSC.length),hat:rnd(HATS2.length) }; initPickers(EL.skinRow,EL.hairStyleRow,EL.hairColorRow,EL.outfitRow,EL.pantsRow,EL.hatRow,EL.previewCanvas,EL.previewName); }
function rnd(n){ return Math.floor(Math.random()*n); }

/* ===== INIT ===== */
pk={...myLook};
initPickers(EL.skinRow,EL.hairStyleRow,EL.hairColorRow,EL.outfitRow,EL.pantsRow,EL.hatRow,EL.previewCanvas,EL.previewName);
EL.randomBtn.onclick=randomLook; EL.joinBtn.onclick=joinRoom;
EL.nameInput.addEventListener("input",()=>{ EL.previewName.textContent=(EL.nameInput.value.trim()||"PLAYER").toUpperCase(); });
EL.sendChatBtn.onclick=sendChat; EL.addSongBtn.onclick=addSong; EL.clickToStart.onclick=unlockAndPlay;
EL.wootBtn.onclick=()=>castVote("woot"); EL.mehBtn.onclick=()=>castVote("meh");
document.querySelectorAll(".react-btn[data-reaction]").forEach(b=>b.onclick=()=>react(b.dataset.reaction));
EL.chatInput.addEventListener("keydown",e=>{if(e.key==="Enter")sendChat();});
EL.youtubeInput.addEventListener("keydown",e=>{if(e.key==="Enter")addSong();});
EL.imgBtn.onclick=()=>EL.imgInput.click(); EL.imgInput.onchange=handleImageUpload;
EL.editLookBtn.onclick=openLookModal; EL.lookCloseBtn.onclick=()=>EL.lookModal.classList.add("hidden"); EL.saveLookBtn.onclick=saveLook;
EL.lookModal.onclick=e=>{ if(e.target===EL.lookModal) EL.lookModal.classList.add("hidden"); };
EL.agentFloor.onclick=onFloorClick;
document.querySelectorAll(".ptab").forEach(tab=>{ tab.onclick=()=>{ document.querySelectorAll(".ptab").forEach(t=>t.classList.remove("active")); tab.classList.add("active"); EL.tabQueue.classList.toggle("active",tab.dataset.tab==="queue"); EL.tabRecent.classList.toggle("active",tab.dataset.tab==="recent"); EL.tabBoard.classList.toggle("active",tab.dataset.tab==="board"); if(tab.dataset.tab==="board")loadBoard(); if(tab.dataset.tab==="recent")loadRecent(); }; });

// emote + gift bars
EMOTES.forEach(e=>{ const b=document.createElement("button"); b.className="emote-btn"; b.textContent=e; b.onclick=()=>sendEmote(e); EL.emoteBar.appendChild(b); });
GIFTS.forEach(g=>{ const b=document.createElement("button"); b.className="gift-btn"; b.textContent=g; b.title="ส่งให้ DJ"; b.onclick=()=>giftDJ(g); EL.giftBar.appendChild(b); });

if (me) EL.nameInput.value=me.name;
updatePointsUI(); buildEqualizer(); startShootingStars(); applySkyTheme(); setInterval(applySkyTheme,60000);

window.onYouTubeIframeAPIReady=()=>{ player=new YT.Player("player",{videoId:"",playerVars:{autoplay:1,controls:0,disablekb:1,fs:0,rel:0,modestbranding:1,iv_load_policy:3,playsinline:1},events:{onReady:async()=>{playerReady=true; if(me){showAppAndBoot(); await loadNowPlaying(); setTimeout(tryAutoPlay,600);}}, onStateChange:onPlayerStateChange, onError:onPlayerError}}); };
if (me) showAppAndBoot();

/* ===== JOIN/BOOT ===== */
function showAppAndBoot(){ EL.loginScreen.classList.add("hidden"); EL.app.classList.remove("hidden"); EL.meLabel.textContent=me.name; bootApp(); }
async function joinRoom(){
  const name=EL.nameInput.value.trim(); if(!name){ showToast("ใส่ชื่อก่อน"); return; }
  myLook={...pk}; me={ id:crypto.randomUUID(), name:name.toUpperCase(), look:myLook, pos:myPos };
  localStorage.setItem("bbl_me",JSON.stringify(me));
  await db.from("members").upsert({ id:me.id, name:me.name, avatar:myLook, pos_x:myPos.x, pos_y:myPos.y, last_seen:new Date().toISOString() });
  userUnlockedAudio=true; showAppAndBoot(); setTimeout(unlockAndPlay,400);
}
async function bootApp(){
  if(!me||booted) return; booted=true; pk={...myLook};
  initPickers(EL.skinRow2,EL.hairStyleRow2,EL.hairColorRow2,EL.outfitRow2,EL.pantsRow2,EL.hatRow2,EL.previewCanvas2,null);
  await ensureRequiredRows(); await touchOnline(); await loadAll(); subscribeRealtime();
  setInterval(touchOnline,HEARTBEAT_MS); setInterval(hostLoop,HEARTBEAT_MS);
  setInterval(async()=>{ await Promise.all([loadHostState(),loadQueue(),loadNowPlaying(),loadReactions(),loadOnline()]); await hostOnlyAutoStart(); },POLL_MS);
  setInterval(loadChat,CHAT_POLL_MS); setInterval(updateProgress,500); setInterval(forceNextIfStuck,2000);
}
async function ensureRequiredRows(){ await db.from("now_playing").upsert({id:1},{onConflict:"id"}); const {data:ch}=await db.from("host_state").select("*").eq("id",1).maybeSingle(); if(!ch) await db.from("host_state").insert({id:1,host_id:me.id,host_name:me.name,updated_at:new Date().toISOString()}); }
function subscribeRealtime(){
  rtChannel=db.channel("pixelhq3")
    .on("postgres_changes",{event:"*",schema:"public",table:"chat_messages"},loadChat)
    .on("postgres_changes",{event:"*",schema:"public",table:"queue"},async()=>{await loadQueue();await hostOnlyAutoStart();})
    .on("postgres_changes",{event:"*",schema:"public",table:"now_playing"},async()=>{await loadNowPlaying();await loadReactions();})
    .on("postgres_changes",{event:"*",schema:"public",table:"reactions"},loadReactions)
    .on("postgres_changes",{event:"*",schema:"public",table:"members"},loadOnline)
    .on("postgres_changes",{event:"*",schema:"public",table:"host_state"},loadHostState)
    .on("broadcast",{event:"emote"},({payload})=>{ if(payload&&payload.id!==me?.id) popOnAgentById(payload.id,payload.emote); })
    .on("broadcast",{event:"gift"},({payload})=>{ if(payload&&payload.from!==me?.id) flyGift(payload.emoji); })
    .subscribe(s=>{ const live=s==="SUBSCRIBED"; EL.statusDot.classList.toggle("live",live); EL.statusText.textContent=live?"LIVE":"เชื่อมต่อ..."; });
}
async function loadAll(){ await Promise.all([loadHostState(),loadChat(),loadQueue(),loadOnline(),loadNowPlaying(),loadReactions(),loadRecent()]); await hostOnlyAutoStart(); }

/* ===== DRESS-UP MODAL ===== */
function openLookModal(){ pk={...myLook}; initPickers(EL.skinRow2,EL.hairStyleRow2,EL.hairColorRow2,EL.outfitRow2,EL.pantsRow2,EL.hatRow2,EL.previewCanvas2,null); EL.lookModal.classList.remove("hidden"); }
async function saveLook(){ myLook={...pk}; me.look=myLook; localStorage.setItem("bbl_me",JSON.stringify(me)); await db.from("members").upsert({ id:me.id, name:me.name, avatar:myLook, last_seen:new Date().toISOString() }); EL.lookModal.classList.add("hidden"); showToast("บันทึกชุดแล้ว ✓","success"); await loadOnline(); }

/* ===== HEARTBEAT/HOST ===== */
async function touchOnline(){ if(!me)return; await db.from("members").upsert({ id:me.id, name:me.name, avatar:myLook, pos_x:myPos.x, pos_y:myPos.y, last_seen:new Date().toISOString() }); }
async function loadHostState(){ const {data}=await db.from("host_state").select("*").eq("id",1).maybeSingle(); hostState=data; isHost=hostState?.host_id===me?.id; }
async function hostLoop(){
  if(!me)return; await loadHostState();
  const expired=!hostState?.updated_at||Date.now()-new Date(hostState.updated_at).getTime()>HOST_TIMEOUT_MS;
  if(isHost){ await db.from("host_state").update({host_id:me.id,host_name:me.name,updated_at:new Date().toISOString()}).eq("id",1); await hostOnlyAutoStart(); await checkChatMidnightReset(); return; }
  if(expired){ const {data:first}=await db.from("members").select("*").gte("last_seen",new Date(Date.now()-ONLINE_CUTOFF_MS).toISOString()).order("joined_at",{ascending:true}).limit(1).maybeSingle(); if(first?.id===me.id){ await db.from("host_state").update({host_id:me.id,host_name:me.name,updated_at:new Date().toISOString()}).eq("id",1); await loadHostState(); } }
}

/* ===== ONLINE + STAGE ===== */
async function loadOnline(){ const cutoff=new Date(Date.now()-ONLINE_CUTOFF_MS).toISOString(); const {data}=await db.from("members").select("*").gte("last_seen",cutoff).order("last_seen",{ascending:false}); onlineMembers=data||[]; EL.onlineCount.textContent=String(onlineMembers.length); if(EL.onlineCount2)EL.onlineCount2.textContent=String(onlineMembers.length); renderStage(); }
function memberLook(m){ if(m.avatar&&typeof m.avatar==="object")return m.avatar; if(m.avatar&&typeof m.avatar==="string"){try{return JSON.parse(m.avatar);}catch(e){}} return {...DEFAULT_LOOK}; }
function renderStage(){
  const djName=nowPlayingCache?.updated_by||null;
  const djMember=djName?onlineMembers.find(m=>m.name===djName):null;
  EL.djBoothFigure.querySelectorAll(".pa-img").forEach(e=>e.remove());
  if(djMember){ const img=document.createElement("img"); img.className="pa-img"; img.src=charURL(memberLook(djMember),6); EL.djBoothFigure.insertBefore(img,EL.djBoothFigure.firstChild); EL.djBoothName.textContent=djMember.name; EL.djBoothName.classList.remove("hidden"); }
  else EL.djBoothName.classList.add("hidden");
  const floor=onlineMembers.filter(m=>!djMember||m.id!==djMember.id);
  const wanted=new Set(floor.map(m=>m.id));
  EL.agentFloor.querySelectorAll(".agent-slot").forEach(el=>{ if(!wanted.has(el.dataset.uid)) el.remove(); });
  floor.forEach(m=>{
    const isMe=m.id===me?.id; const px=isMe?myPos.x:(m.pos_x??50); const py=isMe?myPos.y:(m.pos_y??50);
    let slot=EL.agentFloor.querySelector(`[data-uid="${m.id}"]`);
    if(!slot){ slot=document.createElement("div"); slot.className="agent-slot"+(isMe?" me":""); slot.dataset.uid=m.id; slot.dataset.look=lookHash(memberLook(m)); slot.style.left=px+"%"; slot.style.bottom=mapY(py)+"px"; const img=document.createElement("img"); img.className="pa-img"+(isDancing?" dancing":""); img.src=charURL(memberLook(m),5); const nm=document.createElement("div"); nm.className="pa-name"; nm.textContent=m.name; slot.appendChild(img); slot.appendChild(nm); EL.agentFloor.appendChild(slot); }
    else { slot.style.left=px+"%"; slot.style.bottom=mapY(py)+"px"; const h=lookHash(memberLook(m)); if(slot.dataset.look!==h){ slot.dataset.look=h; slot.querySelector(".pa-img").src=charURL(memberLook(m),5); } const img=slot.querySelector(".pa-img"); if(img)img.classList.toggle("dancing",isDancing); }
  });
}
function mapY(yPct){ const h=EL.agentFloor.clientHeight||100; return (1-Math.min(100,Math.max(0,yPct))/100)*(h*0.65); }
function setDancing(on){ isDancing=on; EL.agentFloor.querySelectorAll(".pa-img").forEach(i=>i.classList.toggle("dancing",on)); }

/* WALK */
function onFloorClick(e){
  if(!me)return; const rect=EL.agentFloor.getBoundingClientRect();
  let xPct=((e.clientX-rect.left)/rect.width)*100, yPct=(1-(e.clientY-rect.top)/rect.height)*100;
  xPct=Math.min(96,Math.max(4,xPct)); yPct=Math.min(95,Math.max(15,yPct));
  myPos={x:xPct,y:yPct}; me.pos=myPos; localStorage.setItem("bbl_me",JSON.stringify(me));
  const slot=EL.agentFloor.querySelector(`[data-uid="${me.id}"]`);
  if(slot){ slot.style.left=xPct+"%"; slot.style.bottom=mapY(yPct)+"px"; const img=slot.querySelector(".pa-img"); if(img){ img.classList.add("walking"); clearTimeout(slot._w); slot._w=setTimeout(()=>img.classList.remove("walking"),1600); } }
  clearTimeout(posSaveTimer); posSaveTimer=setTimeout(savePos,POS_SAVE_MS);
}
async function savePos(){ if(!me)return; await db.from("members").update({pos_x:myPos.x,pos_y:myPos.y,last_seen:new Date().toISOString()}).eq("id",me.id); }

/* FX */
function popOnAgentById(uid,emoji){ let t=EL.agentFloor.querySelector(`[data-uid="${uid}"]`); const djName=nowPlayingCache?.updated_by; if(!t&&djName){ const dj=onlineMembers.find(m=>m.name===djName); if(dj&&dj.id===uid) t=EL.djBoothFigure; } if(!t)return; const pop=document.createElement("div"); pop.className="av-react-pop"; pop.textContent=emoji; t.appendChild(pop); setTimeout(()=>pop.remove(),1500); }
function popOnAgent(uid,key){ popOnAgentById(uid,REACTION_EMOJI[key]||key); }
function spawnHearts(n=6){ for(let i=0;i<n;i++){ setTimeout(()=>{ const el=document.createElement("div"); el.className="fx-heart"; el.textContent=Math.random()>.5?"❤️":"💖"; el.style.left=(20+Math.random()*60)+"%"; el.style.bottom="120px"; EL.fxLayer.appendChild(el); setTimeout(()=>el.remove(),2000); },i*100); } }
function spawnConfetti(n=40){ const cols=['#ff3355','#6c63ff','#00e5ff','#ffe600','#ff6eb4','#00ff88']; for(let i=0;i<n;i++){ const el=document.createElement("div"); el.className="fx-piece"; el.style.left=Math.random()*100+"%"; el.style.top="-10px"; el.style.background=cols[i%cols.length]; el.style.animation=`confetti ${1+Math.random()*0.8}s linear forwards`; el.style.animationDelay=(Math.random()*0.3)+"s"; EL.fxLayer.appendChild(el); setTimeout(()=>el.remove(),2200); } }
function boomSpeakers(){ [EL.speakerL,EL.speakerR].forEach(s=>{ if(!s)return; s.classList.remove("boom"); void s.offsetWidth; s.classList.add("boom"); setTimeout(()=>s.classList.remove("boom"),300); }); }
function buildEqualizer(){ [EL.equalizerL,EL.equalizerR].forEach(eq=>{ if(!eq)return; eq.innerHTML=""; for(let i=0;i<5;i++){ const b=document.createElement("div"); b.className="eq-bar"; b.style.animationDelay=(Math.random()*0.6)+"s"; b.style.animationDuration=(0.4+Math.random()*0.4)+"s"; eq.appendChild(b); } }); }
function startShootingStars(){ setInterval(()=>{ if(!EL.skyLayer||EL.app.classList.contains("hidden"))return; if(!EL.skyLayer.classList.contains("night")&&!EL.skyLayer.classList.contains("dusk"))return; if(Math.random()>0.5)return; const s=document.createElement("div"); s.className="shooting-star"; s.style.left=(40+Math.random()*55)+"%"; s.style.top=(2+Math.random()*25)+"%"; EL.skyLayer.appendChild(s); setTimeout(()=>s.remove(),1300); },3500); }
function applySkyTheme(){ if(!EL.skyLayer)return; const h=new Date().getHours(); let t="night"; if(h>=5&&h<8)t="dawn"; else if(h>=8&&h<17)t="day"; else if(h>=17&&h<20)t="dusk"; EL.skyLayer.classList.remove("dawn","day","dusk","night"); EL.skyLayer.classList.add(t); }

/* EMOTE */
function sendEmote(e){ if(!me)return; popOnAgentById(me.id,e); if(rtChannel){ try{ rtChannel.send({type:"broadcast",event:"emote",payload:{id:me.id,emote:e}}); }catch(err){} } }

/* GIFT */
async function giftDJ(emoji){
  if(!me)return; const now=Date.now(); if(now-lastGiftAt<GIFT_CD){ showToast("รอแป๊บ..."); return; }
  const djName=nowPlayingCache?.updated_by; if(!djName){ showToast("ยังไม่มี DJ"); return; }
  lastGiftAt=now;
  flyGift(emoji);
  if(rtChannel){ try{ rtChannel.send({type:"broadcast",event:"gift",payload:{from:me.id,emoji}}); }catch(err){} }
  addPoints(XP_GIFT); myStats.gifts=(myStats.gifts||0)+1; saveStats(); checkAchievements();
  // credit DJ +1 woot live (if different person)
  const dj=onlineMembers.find(m=>m.name===djName);
  if(dj && dj.id!==me.id){ await db.from("members").update({ total_woots:(dj.total_woots||0)+1 }).eq("id",dj.id); }
  sysMsg(`🎁 ${me.name} ส่ง ${emoji} ให้ DJ ${djName}!`);
}
function flyGift(emoji){
  const stage=EL.agentFloor.getBoundingClientRect(); const fx=EL.fxLayer;
  const el=document.createElement("div"); el.className="fx-gift"; el.textContent=emoji;
  const startX=20+Math.random()*60; el.style.left=startX+"%"; el.style.bottom="100px";
  // target: booth ~ center top of stage
  el.style.setProperty("--gx",(((50-startX)/100)*stage.width)+"px");
  el.style.setProperty("--gy","-220px");
  fx.appendChild(el); setTimeout(()=>el.remove(),1800);
}

/* CHAT */
async function sendChat(){ const msg=EL.chatInput.value.trim(); if(!msg)return; await db.from("chat_messages").insert({ member_name:me.name, member_emoji:"", member_avatar:myLook, message:msg }); EL.chatInput.value=""; await loadChat(); }
function handleImageUpload(e){ const file=e.target.files?.[0]; if(!file)return; if(!file.type.startsWith("image/")){ showToast("ไฟล์ไม่ใช่รูป","error"); return; } compressImage(file).then(async url=>{ if(url.length>200000){ showToast("รูปใหญ่เกินไป","error"); return; } await db.from("chat_messages").insert({ member_name:me.name, member_emoji:"", member_avatar:myLook, message:"", image:url }); await loadChat(); showToast("ส่งรูปแล้ว ✓","success"); }).catch(()=>showToast("ส่งรูปไม่สำเร็จ","error")); EL.imgInput.value=""; }
function compressImage(file,maxDim=420,q=0.62){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onerror=rej; r.onload=ev=>{ const img=new Image(); img.onerror=rej; img.onload=()=>{ let w=img.width,h=img.height; if(w>h&&w>maxDim){h=h*maxDim/w;w=maxDim;}else if(h>maxDim){w=w*maxDim/h;h=maxDim;} const c=document.createElement("canvas"); c.width=w;c.height=h; c.getContext("2d").drawImage(img,0,0,w,h); res(c.toDataURL("image/jpeg",q)); }; img.src=ev.target.result; }; r.readAsDataURL(file); }); }
function chatLook(row){ if(row.member_avatar&&typeof row.member_avatar==="object")return row.member_avatar; if(row.member_avatar&&typeof row.member_avatar==="string"){try{return JSON.parse(row.member_avatar);}catch(e){}} return {...DEFAULT_LOOK}; }
async function loadChat(){
  const {data}=await db.from("chat_messages").select("*").order("created_at",{ascending:true}).limit(150);
  const atBottom=EL.chatBox.scrollHeight-EL.chatBox.scrollTop-EL.chatBox.clientHeight<80;
  EL.chatBox.innerHTML="";
  (data||[]).forEach(row=>{
    const time=new Date(row.created_at).toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"});
    const div=document.createElement("div"); div.className="chat-msg";
    const avurl=charURL(chatLook(row),2);
    let html=`<div class="msg-head"><img class="msg-av" src="${avurl}" width="18" height="23"/><span class="msg-name">${escapeHtml(row.member_name)}</span><span class="msg-time">${time}</span></div>`;
    if(row.message) html+=`<div class="msg-text">${linkify(escapeHtml(row.message))}</div>`;
    if(row.image) html+=`<img class="msg-img" src="${row.image}" loading="lazy"/>`;
    div.innerHTML=html; const im=div.querySelector(".msg-img"); if(im)im.onclick=()=>openImageViewer(row.image);
    EL.chatBox.appendChild(div);
    // chat bubble above avatar for fresh text messages
    if(row.message && row.id && !bubbledIds.has(row.id)){
      const ts=new Date(row.created_at).getTime();
      if(ts>=chatBaselineTime-1000 && Date.now()-ts<8000){ bubbledIds.add(row.id); showChatBubble(row.member_name,row.message); }
      else bubbledIds.add(row.id);
    }
  });
  if(atBottom) EL.chatBox.scrollTop=EL.chatBox.scrollHeight;
}
function showChatBubble(name,text){
  const dj=nowPlayingCache?.updated_by;
  let target=null;
  const member=onlineMembers.find(m=>m.name===name);
  if(member){ if(dj && member.name===dj) target=EL.djBoothFigure; else target=EL.agentFloor.querySelector(`[data-uid="${member.id}"]`); }
  if(!target) return;
  const old=target.querySelector(".chat-bubble"); if(old)old.remove();
  const b=document.createElement("div"); b.className="chat-bubble"; b.textContent=text.length>40?text.slice(0,40)+"…":text;
  target.appendChild(b); setTimeout(()=>{ if(b.parentNode)b.remove(); },4500);
}
function sysMsg(text,type="sys"){ const d=document.createElement("div"); d.className=`chat-msg ${type}`; d.textContent=text; EL.chatBox.appendChild(d); EL.chatBox.scrollTop=EL.chatBox.scrollHeight; }
function openImageViewer(src){ const v=document.createElement("div"); v.className="img-viewer"; v.innerHTML=`<img src="${src}"/>`; v.onclick=()=>v.remove(); document.body.appendChild(v); }
async function checkChatMidnightReset(){ const today=new Date().toLocaleDateString("en-CA"); const {data}=await db.from("settings").select("value").eq("key","chat_day").maybeSingle(); if(data?.value!==today){ await db.from("chat_messages").delete().neq("id","00000000-0000-0000-0000-000000000000"); await db.from("settings").upsert({key:"chat_day",value:today}); await loadChat(); sysMsg("🌙 แชทถูกรีเซ็ตประจำวันแล้ว"); } }

/* QUEUE */
async function addSong(){
  const input=EL.youtubeInput.value.trim(), vid=extractYouTubeId(input); if(!vid){ showToast("ลิงก์ YouTube ไม่ถูกต้อง"); return; }
  const {data:ex}=await db.from("queue").select("id").eq("video_id",vid).eq("played",false).limit(1).maybeSingle(); if(ex){ showToast("เพลงนี้อยู่ในคิวแล้ว","error"); return; }
  const {count}=await db.from("queue").select("*",{count:"exact",head:true}).eq("member_name",me.name).eq("played",false); if((count||0)>=MAX_SONGS_PER_USER){ showToast(`จำกัดคนละ ${MAX_SONGS_PER_USER} เพลง`,"error"); return; }
  EL.addSongBtn.disabled=true; EL.addSongBtn.textContent="…"; const meta=await getYouTubeMeta(vid);
  const {error}=await db.from("queue").insert({ member_name:me.name, member_emoji:"", youtube_url:`https://www.youtube.com/watch?v=${vid}`, video_id:vid, title:meta.title, played:false });
  EL.addSongBtn.disabled=false; EL.addSongBtn.textContent="+"; if(error){ showToast("เพิ่มเพลงไม่สำเร็จ"); return; }
  EL.youtubeInput.value=""; showToast("เพิ่มเพลงแล้ว ✓","success"); await loadQueue(); await hostOnlyAutoStart();
}
async function loadQueue(){
  const {data}=await db.from("queue").select("*").eq("played",false).order("created_at",{ascending:true});
  EL.queueList.innerHTML=""; EL.queueCount.textContent=String((data||[]).length);
  if(!data||data.length===0){ EL.queueList.innerHTML='<div class="q-empty">ยังไม่มีเพลง\nวาง YouTube URL ด้านล่าง</div>'; return; }
  data.forEach((row,i)=>{ const div=document.createElement("div"); div.className="q-item"; div.innerHTML=`<span class="q-num">${i+1}</span><img class="q-thumb" src="${thumbnail(row.video_id)}" onerror="this.style.opacity=0"><div class="q-info"><div class="q-title">${escapeHtml(cleanTitle(row.title,row.video_id))}</div><div class="q-by">${escapeHtml(row.member_name)}</div></div>`; EL.queueList.appendChild(div); });
}

/* RECENT */
async function loadRecent(){
  const {data}=await db.from("settings").select("value").eq("key","recent").maybeSingle();
  const list=(data&&Array.isArray(data.value))?data.value:[];
  EL.recentList.innerHTML="";
  if(list.length===0){ EL.recentList.innerHTML='<div class="q-empty">ยังไม่มีประวัติ</div>'; return; }
  list.forEach(r=>{ const div=document.createElement("div"); div.className="q-item"; div.innerHTML=`<img class="q-thumb" src="${thumbnail(r.video_id)}" onerror="this.style.opacity=0"><div class="q-info"><div class="q-title">${escapeHtml(r.title||"")}</div><div class="q-by">🎧 ${escapeHtml(r.by||"")}</div></div>`; EL.recentList.appendChild(div); });
}
async function pushRecent(np){
  const {data}=await db.from("settings").select("value").eq("key","recent").maybeSingle();
  let list=(data&&Array.isArray(data.value))?data.value:[];
  list.unshift({ title:cleanTitle(np.title,np.video_id), video_id:np.video_id, by:np.updated_by||"" });
  list=list.slice(0,12);
  await db.from("settings").upsert({ key:"recent", value:list });
}

/* LEADERBOARD */
async function loadBoard(){
  const {data}=await db.from("members").select("*").order("total_woots",{ascending:false}).limit(12);
  EL.boardList.innerHTML="";
  const rows=(data||[]).filter(m=>(m.total_woots||0)>0||(m.songs_played||0)>0);
  if(rows.length===0){ EL.boardList.innerHTML='<div class="q-empty">ยังไม่มีข้อมูล\nเปิดเพลงเพื่อรับ woots!</div>'; return; }
  rows.forEach((m,i)=>{ const div=document.createElement("div"); div.className="board-item"+(i===0?" gold":""); const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":(i+1); div.innerHTML=`<div class="board-rank">${medal}</div><img class="board-av" src="${charURL(memberLook(m),3)}" width="18" height="23"><div class="board-info"><div class="board-name">${escapeHtml(m.name)}</div><div class="board-stat">❤️${m.total_woots||0} · 🎵${m.songs_played||0} เพลง</div></div>`; EL.boardList.appendChild(div); });
}

/* NOW PLAYING */
async function loadNowPlaying(){
  const {data}=await db.from("now_playing").select("*").eq("id",1).single(); const prevVid=currentVideoId;
  nowPlayingCache=data;
  if(!data||!data.video_id){ EL.nowTitle.textContent="-- ยังไม่มีเพลง --"; EL.nowBy.textContent=""; EL.hostBadge.textContent=""; EL.songWoots.textContent=""; EL.coverImage.style.display="none"; currentVideoId=null; currentSongAddedBy=null; myVoteThisSong=null; updateVoteUI(); setDancing(false); renderStage(); return; }
  const title=cleanTitle(data.title,data.video_id);
  EL.nowTitle.textContent=title.slice(0,46); EL.nowBy.textContent=data.updated_by?`· ${data.updated_by}`:""; EL.hostBadge.textContent=data.updated_by?`🎧 DJ: ${data.updated_by}`:"";
  EL.coverImage.src=thumbnail(data.video_id,"max"); EL.coverImage.style.display="block"; currentSongAddedBy=data.updated_by||null;
  if(data.video_id!==currentVideoId){
    currentVideoId=data.video_id; endWatchCount=0; lastProgressVid=data.video_id; myVoteThisSong=null; updateVoteUI(); setDancing(true); boomSpeakers(); renderStage();
    if(isHost && prevVid!==data.video_id) pushRecent(data);
    if(playerReady&&player){ const startSec=data.started_at?Math.max(0,Math.floor((Date.now()-new Date(data.started_at).getTime())/1000)):0; player.loadVideoById({videoId:data.video_id,startSeconds:startSec}); setTimeout(tryAutoPlay,700); }
  }
}

/* REACTIONS + VOTE */
async function react(type){ const vid=nowPlayingCache?.video_id||"none"; if(vid==="none")return; await db.from("reactions").insert({video_id:vid,member_name:me.name,reaction:type}); popOnAgent(me.id,type); addPoints(XP_REACT); myStats.reacts=(myStats.reacts||0)+1; saveStats(); checkAchievements(); await loadReactions(); }
async function castVote(type){
  if(myVoteThisSong){ showToast("คุณโหวตเพลงนี้แล้ว"); return; }
  const vid=nowPlayingCache?.video_id||"none"; if(vid==="none"){ showToast("ยังไม่มีเพลง"); return; }
  myVoteThisSong=type; updateVoteUI(); await db.from("reactions").insert({video_id:vid,member_name:me.name,reaction:type}); popOnAgent(me.id,type);
  if(type==="woot"){ spawnHearts(6); spawnConfetti(30); sysMsg(`${me.name} — WOOT! ❤️`); } else sysMsg(`${me.name} — MEH 💔`);
  await loadReactions();
}
function updateVoteUI(){ EL.wootBtn.classList.toggle("voted",myVoteThisSong==="woot"); EL.mehBtn.classList.toggle("voted",myVoteThisSong==="meh"); }
async function loadReactions(){
  const vid=nowPlayingCache?.video_id||"none"; const {data}=await db.from("reactions").select("*").eq("video_id",vid); const rows=data||[];
  EL.likeCount.textContent=rows.filter(x=>x.reaction==="like").length; EL.loveCount.textContent=rows.filter(x=>x.reaction==="love").length; EL.fireCount.textContent=rows.filter(x=>x.reaction==="fire").length; EL.wowCount.textContent=rows.filter(x=>x.reaction==="wow").length;
  const woots=new Set(rows.filter(x=>x.reaction==="woot").map(x=>x.member_name)); const mehs=new Set(rows.filter(x=>x.reaction==="meh").map(x=>x.member_name));
  EL.wootCount.textContent=woots.size; EL.mehCount.textContent=mehs.size; EL.songWoots.textContent=woots.size>0?`❤️ ${woots.size} woots`:"";
  const online=Math.max(1,onlineMembers.length); const mehPct=Math.min(100,Math.round(mehs.size/online*100));
  if(EL.mehBar){ EL.mehBar.style.width=mehPct+"%"; EL.mehBar.classList.toggle("danger",mehPct>=Math.round(MEH_SKIP_RATIO*100)); }
  if(isHost&&vid!=="none"&&!changingSong&&!nextRpcCooldown){ if(online>=2&&mehs.size/online>=MEH_SKIP_RATIO){ sysMsg(`⏭️ ข้ามเพลง — MEH เกิน ${Math.round(MEH_SKIP_RATIO*100)}%`); await nextSongRPC("meh-skip"); } }
}

/* POINTS + STATS + ACH */
function addPoints(xp){ myPoints+=xp; localStorage.setItem("bbl_pts",String(myPoints)); updatePointsUI(); }
function updatePointsUI(){ EL.myXP.textContent=`${myPoints} XP`; if(EL.myLevel)EL.myLevel.textContent="Lv."+levelFromXP(myPoints); }
function saveStats(){ localStorage.setItem("bbl_stats",JSON.stringify(myStats)); }
function checkAchievements(){ ACHIEVEMENTS.forEach(a=>{ if(!myAch.includes(a.id) && a.test(myStats)){ myAch.push(a.id); localStorage.setItem("bbl_ach",JSON.stringify(myAch)); sysMsg("🏅 ปลดล็อก: "+a.label,"ach"); spawnConfetti(20); } }); }

/* HOST / NEXT */
async function nextSongRPC(reason="auto"){
  if(!isHost||changingSong||nextRpcCooldown)return; changingSong=nextRpcCooldown=true;
  try{
    if(currentSongAddedBy&&currentVideoId){
      const {data:rx}=await db.from("reactions").select("member_name,reaction").eq("video_id",currentVideoId);
      const woots=new Set((rx||[]).filter(x=>x.reaction==="woot").map(x=>x.member_name)).size;
      const {data:dj}=await db.from("members").select("*").eq("name",currentSongAddedBy).maybeSingle();
      if(dj){ await db.from("members").update({ total_woots:(dj.total_woots||0)+woots, songs_played:(dj.songs_played||0)+1 }).eq("id",dj.id); }
      if(currentSongAddedBy===me?.name){ addPoints(XP_SONG_PLAYED); myStats.songs=(myStats.songs||0)+1; myStats.wootsGot=(myStats.wootsGot||0)+woots; saveStats(); checkAchievements(); sysMsg(`🏆 +${XP_SONG_PLAYED} XP — เพลงคุณจบ! (ได้ ${woots} woots ❤️)`,"xp"); }
    }
    const {error}=await db.rpc("admin_next_song"); if(error){ showToast("เปลี่ยนเพลงไม่สำเร็จ","error"); return; }
    currentVideoId=null; nowPlayingCache=null; endWatchCount=0; lastProgressVid=null; myVoteThisSong=null;
    await Promise.all([loadNowPlaying(),loadQueue(),loadReactions()]); setTimeout(tryAutoPlay,700);
  }catch(e){ showToast("เปลี่ยนเพลงไม่สำเร็จ","error"); }
  finally{ changingSong=false; setTimeout(()=>{nextRpcCooldown=false;},2200); }
}
async function hostOnlyAutoStart(){ if(!isHost||changingSong||nextRpcCooldown)return; const {data}=await db.from("now_playing").select("*").eq("id",1).single(); if(data&&data.video_id)return; await nextSongRPC("empty"); }

/* PLAYER */
async function onPlayerStateChange(event){
  if(event.data===YT.PlayerState.ENDED&&isHost){ endWatchCount=0; await nextSongRPC("ended"); }
  if(event.data===YT.PlayerState.PLAYING){ EL.clickToStart.classList.add("hidden"); setDancing(true); }
  if(isHost&&(event.data===YT.PlayerState.PAUSED||event.data===YT.PlayerState.CUED)){ setTimeout(async()=>{try{const c=player.getCurrentTime(),d=player.getDuration();if(d>8&&c>0&&d-c<=3)await nextSongRPC("paused-near-end");}catch(e){}},900); }
}
function onPlayerError(){ showToast("เพลงนี้เล่นไม่ได้ ข้าม..."); if(isHost)setTimeout(()=>nextSongRPC("player-error"),900); }
function tryAutoPlay(){ if(!playerReady||!player)return; if(!currentVideoId){loadNowPlaying();return;} try{ player.mute(); player.playVideo(); setTimeout(()=>{ try{ if(userUnlockedAudio){player.unMute();player.setVolume(100);player.playVideo();EL.clickToStart.classList.add("hidden");}else EL.clickToStart.classList.remove("hidden"); }catch(e){EL.clickToStart.classList.remove("hidden");} },800); }catch(e){EL.clickToStart.classList.remove("hidden");} }
function unlockAndPlay(){ userUnlockedAudio=true; try{player.unMute();player.setVolume(100);player.playVideo();EL.clickToStart.classList.add("hidden");}catch(e){showToast("กดอีกครั้งเพื่อเปิดเพลง");} }
document.addEventListener("click",()=>{userUnlockedAudio=true;if(currentVideoId)unlockAndPlay();},{once:true});

/* PROGRESS */
function updateProgress(){ if(!playerReady||!player||!currentVideoId){setProgressUI(0,0);return;} try{ const c=player.getCurrentTime?player.getCurrentTime():0,d=player.getDuration?player.getDuration():0; setProgressUI(c,d); if(lastProgressVid!==currentVideoId){endWatchCount=0;lastProgressVid=currentVideoId;} const nearEnd=d>8&&c>0&&(d-c<=3||c>=d-3); if(isHost&&nearEnd&&!changingSong&&!nextRpcCooldown){ if(++endWatchCount>=3){endWatchCount=0;nextSongRPC("near-end");} } else if(!nearEnd)endWatchCount=0; }catch(e){} }
async function forceNextIfStuck(){ if(!isHost||!me||!playerReady||!player||!currentVideoId||changingSong||nextRpcCooldown)return; try{const c=player.getCurrentTime(),d=player.getDuration();if(d>8&&c>0&&d-c<=3)await nextSongRPC("stuck");}catch(e){} }
function setProgressUI(c,d){ const sc=Number(c)||0,sd=Number(d)||0,pct=sd>0?Math.max(0,Math.min(100,(sc/sd)*100)):0; EL.currentTimeText.textContent=formatTime(sc); EL.durationText.textContent=sd>0?formatTime(sd):"0:00"; EL.progressBar.style.width=`${pct}%`; EL.progressDot.style.left=`${pct}%`; }

/* UTILS */
function formatTime(s){s=Math.max(0,Math.floor(Number(s)||0));return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`}
function cleanTitle(t,vid){const s=String(t||"").trim();if(!s||s===vid||s.startsWith("YouTube:"))return "กำลังโหลด...";return s;}
async function getYouTubeMeta(vid){ try{const r=await fetch(`https://noembed.com/embed?url=${encodeURIComponent("https://www.youtube.com/watch?v="+vid)}`);const d=await r.json();if(d&&d.title)return{title:d.title.replace(/\s*-\s*YouTube\s*$/i,"").trim()};}catch(e){} return{title:"ไม่พบชื่อเพลง"}; }
function extractYouTubeId(input){ if(!input)return null; if(/^[a-zA-Z0-9_-]{11}$/.test(input))return input; try{const url=new URL(input); if(url.hostname.includes("youtu.be"))return url.pathname.replace("/","").slice(0,11); if(url.hostname.includes("youtube.com")){ const v=url.searchParams.get("v");if(v)return v.slice(0,11); const s=url.pathname.match(/\/shorts\/([^/?]+)/);if(s)return s[1].slice(0,11); const e=url.pathname.match(/\/embed\/([^/?]+)/);if(e)return e[1].slice(0,11); }}catch(e){} return null; }
function thumbnail(vid,size="mq"){if(!vid)return"";return size==="max"?`https://img.youtube.com/vi/${vid}/maxresdefault.jpg`:`https://img.youtube.com/vi/${vid}/mqdefault.jpg`}
function linkify(t){return t.replace(/(@[\wก-๙]+)/g,"<b>$1</b>")}
function escapeHtml(t){return String(t||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function showToast(msg,type=""){ EL.toast.textContent=msg; EL.toast.className="toast"+(type?" "+type:""); EL.toast.classList.remove("hidden"); clearTimeout(showToast._t); showToast._t=setTimeout(()=>EL.toast.classList.add("hidden"),2800); }
