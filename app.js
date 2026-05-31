/* ================================================
   BEARXBABE LIVE V12 — PIXEL ART ENGINE
   ================================================ */
const SUPABASE_URL      = "https://xwfnqxqdlvvykppzlrxj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Zm5xeHFkbHZ2eWtwcHpscnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMTg0NjksImV4cCI6MjA5NTc5NDQ2OX0.Xr46g9TuWFzS3zhVvLAFqyVCqv9Al35W9rGDpXPaIwQ";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ══════════════════════════════════════════════
   PIXEL ART ENGINE — 12×16 grid avatars
   ══════════════════════════════════════════════ */

// Colour palette — single char keys
const PAL = {
  _:[0,0,0,0],         // transparent
  K:[20,20,30,255],    // dark outline
  W:[240,235,220,255], // white/light
  S:[220,170,120,255], // skin
  R:[220,50,70,255],   // red
  B:[60,110,230,255],  // blue
  G:[50,190,90,255],   // green
  Y:[255,215,0,255],   // yellow
  P:[150,80,220,255],  // purple
  C:[0,210,245,255],   // cyan
  O:[240,120,0,255],   // orange
  N:[130,75,35,255],   // brown
  T:[50,60,180,255],   // dark blue
  M:[240,70,170,255],  // magenta
  L:[160,165,185,255], // light grey
  E:[55,55,75,255],    // dark grey
  A:[255,255,255,255], // white pure
};

// Each avatar: exactly 16 rows, each row exactly 12 chars
const AVATARS = {
  animals:[
    { id:"fox", name:"Fox",
      rows:[
        "____OOOO____",
        "___OOOOOOO__",
        "__OOOOOOOOO_",
        "_OOOOOOOOOOO",
        "_OOWWWWWWOOO",
        "OOOWWWWWWOOO",
        "OKKWWWWWWKKO",
        "_OOOOOOOOOOO",
        "__WWWWWWWWW_",
        "_WWWWWWWWWWW",
        "_WWWWWWWWWWW",
        "_KWWKWWWKWWK",
        "____KKKKKK__",
        "____KK__KK__",
        "____KK__KK__",
        "____________",
      ]},
    { id:"cat", name:"Cat",
      rows:[
        "___EE____EE_",
        "___EE____EE_",
        "__EEEEEEEEEE",
        "_EEEEEEEEEEE",
        "_EKKEEKEEKKE",
        "_EEWWEEWWEEE",
        "__EEMMMMEEE_",
        "__EEEEEEEEE_",
        "__EEEEEEEEE_",
        "_MEEEEEEEEMM",
        "_MEEEEEEEEM_",
        "_KEKEKKKEKEK",
        "____KKKKKK__",
        "____KK__KK__",
        "____KK__KK__",
        "____________",
      ]},
    { id:"bear", name:"Bear",
      rows:[
        "___NNNNNN___",
        "__NNNNNNNN__",
        "_NNNNNNNNNN_",
        "_NNNNNNNNNN_",
        "_NNWWNNWWNN_",
        "_NNWWNNWWNN_",
        "__NNWWWWNN__",
        "_NNNNNNNNNN_",
        "__WWWWWWWW__",
        "_WWWWWWWWWW_",
        "_WWWWWWWWWW_",
        "_KWWKWWWKWWK",
        "____KKKKKK__",
        "____KK__KK__",
        "___NKK__KKN_",
        "____________",
      ]},
    { id:"frog", name:"Frog",
      rows:[
        "___GGGGGG___",
        "__GGGGGGGG__",
        "_GGGGGGGGGG_",
        "_GWGGGGGWGG_",
        "_GWGGGGGWGG_",
        "__GGKKKGGG__",
        "__GGWWWWGG__",
        "_GGGGGGGGGG_",
        "__GGGGGGGG__",
        "_GGGGGGGGGG_",
        "_GGGGGGGGGG_",
        "_KGGKGGGKGGK",
        "____KKKKKK__",
        "___GK__KG___",
        "___GK__KG___",
        "____________",
      ]},
    { id:"bunny", name:"Bunny",
      rows:[
        "__WW____WW__",
        "__WW____WW__",
        "__WWWWWWWW__",
        "_WWWWWWWWWW_",
        "_WWWWWWWWWW_",
        "_WWMWWWWMWW_",
        "__WWWMMWWW__",
        "_WWWWWWWWWW_",
        "__WWWWWWWW__",
        "_WWWWWWWWWW_",
        "_WWWWWWWWWW_",
        "_KWWKWWWKWWK",
        "____KKKKKK__",
        "____KK__KK__",
        "____KK__KK__",
        "____________",
      ]},
    { id:"dog", name:"Dog",
      rows:[
        "____NNNN____",
        "__NNNNNNNN__",
        "_NNNNNNNNNN_",
        "_NWNNWWNNWN_",
        "NNWWWWWWWWNN",
        "NNWWWWWWWWNN",
        "_NNWWWWWWNN_",
        "__NNWWWWNN__",
        "__WWWWWWWW__",
        "_WWWWWWWWWW_",
        "_WWWWWWWWWW_",
        "_KWWNWWWNWWK",
        "____KKKKKK__",
        "____KK__KK__",
        "___NKK__KKN_",
        "____________",
      ]},
  ],
  robots:[
    { id:"robo", name:"Robo",
      rows:[
        "____LLLLLL__",
        "__KLLLLLLK__",
        "_KLLLLLLLLK_",
        "_LCCLLLLCCL_",
        "_LCCLLLLCCL_",
        "_LLLLLLLLLLL",
        "_LLLKKLLKLLL",
        "_LLLLLLLLLLL",
        "__LLLLLLLLL_",
        "_LLLLLLLLLLL",
        "_LLLLLLLLLLL",
        "_KLKLLLLKLKK",
        "____KKKKKK__",
        "___LK__KL___",
        "___LK__KL___",
        "____________",
      ]},
    { id:"droid", name:"Droid",
      rows:[
        "___TTTTTTTT_",
        "__TTTTTTTTTT",
        "_TTTTTTTTTT_",
        "_TCTTTTTCTTT",
        "_TCTTTTTCTTT",
        "_TTCCTTTCCTT",
        "_TTTTTTTTTTT",
        "__TTTTTTTTTT",
        "__TTTTTTTTTT",
        "_TTTTTTTTTTT",
        "_TTTTTTTTTTT",
        "_KTTKTTTKTTK",
        "____KKKKKK__",
        "___TK__KT___",
        "___TK__KT___",
        "____________",
      ]},
    { id:"mech", name:"Mech",
      rows:[
        "___YEEEEEY__",
        "__YEEEEEEEY_",
        "_YEEEEEEEY__",
        "_YEYEEEYEYYY",
        "_YEYEEEYEYYY",
        "_YEEEEEEY___",
        "_YYYYYYYY___",
        "_YEEEEEEEY__",
        "__EEEEEEEE__",
        "_EEEEEEEEEE_",
        "_EEEEEEEEEE_",
        "_KEEKEEEKEKK",
        "____KKKKKK__",
        "___EK__KE___",
        "___EK__KE___",
        "____________",
      ]},
  ],
  humans:[
    { id:"hero", name:"Hero",
      rows:[
        "____SSSS____",
        "___SSSSSS___",
        "__SSSSSSSS__",
        "__SKSSSSKS__",
        "__SKSSSSKS__",
        "___SSSSSS___",
        "___KSSSSK___",
        "___SSSSSS___",
        "__BBBBBBBB__",
        "_BBBBBBBBBB_",
        "_BBBBBBBBBB_",
        "_KBSKBBBSKBK",
        "____KKKKKK__",
        "___SK__KS___",
        "___SK__KS___",
        "____________",
      ]},
    { id:"wizard", name:"Wizard",
      rows:[
        "____YYYY____",
        "___YYYYYY___",
        "__PPPPPPPP__",
        "_PPSPPPPSPP_",
        "_PPSPPPPSPP_",
        "__PPSSSSPP__",
        "__PPPPPPPP__",
        "__PPPPPPPP__",
        "__PPPPPPPP__",
        "_PPPPPPPPPP_",
        "_PPPPPPPPPP_",
        "_KPPKPPPKPPK",
        "____KKKKKK__",
        "___PK__KP___",
        "___PK__KP___",
        "____________",
      ]},
    { id:"punk", name:"Punk",
      rows:[
        "___MMMMMM___",
        "__MMSSSSMM__",
        "__MSSSSSSSM_",
        "_MSKSSSSKEM_",
        "_MSKSSSSKEM_",
        "__MSSSSSSM__",
        "__MSSSSKSM__",
        "__SSSSSSSS__",
        "__MMMMMMMM__",
        "_MMMMMMMMMM_",
        "_MMMMMMMMMM_",
        "_KMSKMMSKMMK",
        "____KKKKKK__",
        "___SK__KS___",
        "___SK__KS___",
        "____________",
      ]},
  ],
  special:[
    { id:"fire", name:"Fire",
      rows:[
        "__YY__YY__YY",
        "_YYRYYYRYYY_",
        "_RRRRRRRRRY_",
        "RRRRRRRRRRYY",
        "RRRRRRRRRRRR",
        "_YRRRRRRRRY_",
        "__YRRRRRRRY_",
        "__RRRRRRRR__",
        "__RRRRRRRR__",
        "_RRRRRRRRRR_",
        "_RRRRRRRRRR_",
        "_KRRRKKRRKRK",
        "____KKKKKK__",
        "___RK__KR___",
        "___RK__KR___",
        "____________",
      ]},
    { id:"ghost", name:"Ghost",
      rows:[
        "____AAAA____",
        "__AAAAAAAA__",
        "_AAAAAAAAAA_",
        "_AAKAAAAKAA_",
        "_AAKAAAAKAA_",
        "_AAAAAAAAAA_",
        "_AAAKKKKAAA_",
        "_AAAAAAAAAA_",
        "_AAAAAAAAAA_",
        "_AAAAAAAAAA_",
        "_APAPAAAPAP_",
        "_APAPAAAPAP_",
        "__AA__AA__AA",
        "____________",
        "____________",
        "____________",
      ]},
    { id:"star", name:"Star",
      rows:[
        "____YYYY____",
        "___YYYYYY___",
        "__YOYYYYYOY_",
        "_YYYYYYYYYY_",
        "_YYYYYYYYYY_",
        "__YOYYYYYOY_",
        "___YYYYYY___",
        "____YYYY____",
        "___OOOOOO___",
        "__OOOOOOOO__",
        "__OOOOOOOO__",
        "__KOKOOKKOK_",
        "____KKKKKK__",
        "___YK__KY___",
        "___YK__KY___",
        "____________",
      ]},
    { id:"crown", name:"Crown",
      rows:[
        "YK__YYYY__KY",
        "YKK_YYYY_KKY",
        "YKKKYYYYKKYY",
        "YYYYYYYYYY__",
        "YYYYYYYYYY__",
        "_YYYYYYYY___",
        "_YYYYYYYY___",
        "_YOYOYOYOY__",
        "__YYYYYYYY__",
        "_YYYYYYYYYY_",
        "_YYYYYYYYYY_",
        "_KYYKYYKYYKY",
        "____KKKKKK__",
        "___YK__KY___",
        "___YK__KY___",
        "____________",
      ]},
  ],
};
const ALL_AVATARS = [...AVATARS.animals,...AVATARS.robots,...AVATARS.humans,...AVATARS.special];

/* Draw a pixel avatar on a canvas */
function drawAvatar(canvas, avatarId, scale, frame) {
  if (!canvas) return;
  const def = ALL_AVATARS.find(a => a.id === avatarId) || ALL_AVATARS[0];
  const W = 12, H = 16;
  scale = scale || 4;
  canvas.width  = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const rows = [...def.rows];
  // simple 2-frame walk: swap last two leg rows on frame 1
  if (frame === 1 && rows.length >= 2) {
    [rows[rows.length-2], rows[rows.length-3]] = [rows[rows.length-3], rows[rows.length-2]];
  }

  for (let y = 0; y < H; y++) {
    const row = rows[y] || "";
    for (let x = 0; x < W; x++) {
      const ch = row[x] || '_';
      const col = PAL[ch] || PAL['_'];
      if (!col || col[3] === 0) continue;
      ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${(col[3]/255).toFixed(2)})`;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

/* Draw pixel logo (fire icon) */
function drawLogo(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  canvas.width = 80; canvas.height = 80;
  ctx.fillStyle = "#12121e";
  ctx.fillRect(0, 0, 80, 80);
  const fire = [
    "____YYYY____",
    "___YYRYYY___",
    "__YYRRRRYY__",
    "_YYRRRRRRYY_",
    "_RRRRRRRRRR_",
    "RRRRRRRRRRRR",
    "_RRRRRRRRRR_",
    "__RRRRRRRR__",
    "___RRRRRR___",
    "____RRRR____",
  ];
  const s = 5;
  fire.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === 'R') ctx.fillStyle = '#ff3355';
      else if (ch === 'Y') ctx.fillStyle = '#ffe600';
      else return;
      ctx.fillRect(10 + x * s, 15 + y * s, s, s);
    });
  });
}

/* Draw pixel DJ booth */
function drawBooth(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, 120, 40);
  const S = 4;
  for (let x = 0; x < 120; x += S) {
    for (let y = 8; y < 40; y += S) {
      ctx.fillStyle = (x < S || x >= 116 || y === 8) ? '#5a3010' : '#2a1208';
      ctx.fillRect(x, y, S-1, S-1);
    }
  }
  // glow line
  const g = ctx.createLinearGradient(0,8,120,8);
  g.addColorStop(0,'transparent'); g.addColorStop(.3,'#6c63ff');
  g.addColorStop(.5,'#ff6eb4'); g.addColorStop(.7,'#6c63ff'); g.addColorStop(1,'transparent');
  ctx.fillStyle = g; ctx.fillRect(0, 8, 120, 3);
  // vinyl discs
  [[20,24],[60,24],[100,24]].forEach(([cx,cy]) => {
    ctx.fillStyle = '#1a1a2e';
    for (let dy=-8;dy<=8;dy++) for (let dx=-8;dx<=8;dx++) if (dx*dx+dy*dy<=64) ctx.fillRect(cx+dx,cy+dy,1,1);
    ctx.fillStyle = '#6c63ff';
    for (let dy=-3;dy<=3;dy++) for (let dx=-3;dx<=3;dx++) if (dx*dx+dy*dy<=9) ctx.fillRect(cx+dx,cy+dy,1,1);
  });
}

/* Draw stage background */
let _starsCache = null;
function drawStage(canvas, isDancing) {
  if (!canvas || canvas.width === 0 || canvas.height === 0) return;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const W = canvas.width, H = canvas.height;

  // Sky — pixelated gradient bands
  const skyBands = ["#060412","#0a0620","#10082e","#160c38","#1c1040","#120c30"];
  const bH = Math.ceil(H * .62 / skyBands.length);
  skyBands.forEach((c,i) => { ctx.fillStyle=c; ctx.fillRect(0, i*bH, W, bH+1); });

  // Stars — cache positions
  if (!_starsCache || _starsCache.W !== W) {
    _starsCache = { W, list:[] };
    for (let i=0;i<70;i++) _starsCache.list.push([Math.random()*W|0, Math.random()*(H*.5)|0, Math.random()>.5?2:1]);
  }
  const twinkle = Math.floor(Date.now()/600) % 4;
  _starsCache.list.forEach(([sx,sy,ss],i) => {
    ctx.fillStyle = i%4===twinkle ? '#ffffff' : 'rgba(255,255,255,.35)';
    ctx.fillRect(sx, sy, ss, ss);
  });

  // Moon
  const mx=W*.78|0, my=H*.1|0, mr=12;
  for (let dy=-mr;dy<=mr;dy++) for (let dx=-mr;dx<=mr;dx++)
    if (dx*dx+dy*dy<=mr*mr) { ctx.fillStyle='#ffe066'; ctx.fillRect(mx+dx,my+dy,1,1); }
  [[mx+3,my-2,3],[mx-2,my+3,2]].forEach(([cx,cy,r]) => {
    for (let dy=-r;dy<=r;dy++) for (let dx=-r;dx<=r;dx++)
      if (dx*dx+dy*dy<=r*r) { ctx.fillStyle='#ccaa00'; ctx.fillRect(cx+dx,cy+dy,1,1); }
  });

  // City skyline — pixel buildings
  const buildings=[
    [0,22,H*.38],[28,32,H*.42],[68,22,H*.36],[108,38,H*.40],
    [158,20,H*.34],[198,28,H*.38],[238,16,H*.30],[278,26,H*.37],
    [318,22,H*.35],[348,36,H*.41],[W-78,18,H*.33],[W-38,28,H*.38],
  ];
  buildings.forEach(([bx,bw,by]) => {
    ctx.fillStyle='#0d0d1a'; ctx.fillRect(bx,by|0,bw,H);
    ctx.fillStyle='#15152a'; ctx.fillRect(bx+1,(by|0)+1,bw-2,H);
    for (let wy=(by|0)+4; wy<H*.56; wy+=8)
      for (let wx=bx+4; wx<bx+bw-4; wx+=8) {
        ctx.fillStyle = Math.random()>.55 ? 'rgba(255,220,80,.55)' : '#1a1a2e';
        ctx.fillRect(wx,wy,4,4);
      }
  });

  // Stage floor
  const flY = H*.63|0;
  const fl = ctx.createLinearGradient(0,flY,0,H);
  fl.addColorStop(0,'#2a1a06'); fl.addColorStop(1,'#0e0802');
  ctx.fillStyle=fl; ctx.fillRect(0,flY,W,H-flY);

  // Stage edge glow
  const eg = ctx.createLinearGradient(0,0,W,0);
  eg.addColorStop(0,'transparent'); eg.addColorStop(.2,'rgba(108,99,255,.6)');
  eg.addColorStop(.5,'rgba(255,110,180,.8)'); eg.addColorStop(.8,'rgba(108,99,255,.6)'); eg.addColorStop(1,'transparent');
  ctx.fillStyle=eg; ctx.fillRect(0,flY,W,3);

  // Floor tiles
  ctx.fillStyle='rgba(70,40,5,.3)';
  for (let lx=0;lx<W;lx+=16) ctx.fillRect(lx,flY,1,H-flY);
  for (let ly=flY;ly<H;ly+=10) ctx.fillRect(0,ly,W,1);

  // Dance lights
  if (isDancing) {
    const t = Date.now();
    const cols=['#ff3355','#6c63ff','#00e5ff','#ffe600','#ff6eb4','#00ff88'];
    for (let i=0;i<8;i++) {
      const lx=(W*.18+i*(W*.08))|0;
      const on=Math.floor(t/280+i)%2===0;
      ctx.fillStyle=on?cols[i%cols.length]:'rgba(255,255,255,.04)';
      ctx.fillRect(lx,flY+2,10,5);
      if(on){ctx.fillStyle='rgba(255,255,255,.1)';ctx.fillRect(lx+2,flY+7,6,H-flY-9);}
    }
  }

  // Pixel speakers
  [[8,flY-36],[W-46,flY-36]].forEach(([spx,spy]) => {
    ctx.fillStyle='#1a1a2e'; ctx.fillRect(spx,spy,36,38);
    ctx.fillStyle='#22224a'; ctx.fillRect(spx+2,spy+2,32,34);
    [[spx+8,spy+8,7],[spx+18,spy+22,5]].forEach(([cx,cy,r]) => {
      for (let dy=-r;dy<=r;dy++) for (let dx=-r;dx<=r;dx++)
        if (dx*dx+dy*dy<=r*r) {ctx.fillStyle='#333366';ctx.fillRect(cx+dx,cy+dy,1,1);}
      ctx.fillStyle='#5555cc';
      for (let dy=-2;dy<=2;dy++) for (let dx=-2;dx<=2;dx++)
        if (dx*dx+dy*dy<=4) ctx.fillRect(cx+dx,cy+dy,1,1);
    });
  });

  // CRT vignette
  const vig=ctx.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,H*.75);
  vig.addColorStop(0,'transparent'); vig.addColorStop(1,'rgba(0,0,0,.55)');
  ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);
}

/* ══════════════════════════════════════════════
   APP STATE
   ══════════════════════════════════════════════ */
const HOST_TIMEOUT_MS    = 16000;
const HEARTBEAT_MS       = 6000;
const POLL_MS            = 2400;
const CHAT_POLL_MS       = 4500;
const MAX_SONGS_PER_USER = 3;
const ONLINE_CUTOFF_MS   = 45000;
const XP_SONG_PLAYED     = 50;
const XP_REACT           = 2;
const REACTION_EMOJI = {like:"👍",love:"❤️",fire:"🔥",wow:"😮",woot:"❤️",meh:"💔"};

let me               = JSON.parse(localStorage.getItem("bbl_me") || "null");
let myPoints         = parseInt(localStorage.getItem("bbl_pts") || "0");
let selectedAvatarId = me?.avatarId || "fox";
let player=null, playerReady=false;
let currentVideoId=null, nowPlayingCache=null;
let hostState=null, isHost=false, booted=false;
let changingSong=false, userUnlockedAudio=false;
let endWatchCount=0, nextRpcCooldown=false, lastProgressVid=null;
let onlineMembers=[], waitlist=[];
let myVoteThisSong=null, currentSongAddedBy=null;
let animFrame=0, isDancing=false;

const $ = id => document.getElementById(id);
const EL = {
  toast:$("toast"), floatLayer:$("floatLayer"),
  loginScreen:$("loginScreen"), app:$("app"),
  nameInput:$("nameInput"), avatarGrid:$("avatarGrid"),
  previewCanvas:$("previewCanvas"), previewName:$("previewName"),
  joinBtn:$("joinBtn"), logoCanvas:$("logoCanvas"),
  hostBadge:$("hostBadge"), meLabel:$("meLabel"),
  myXP:$("myXP"), statusDot:$("statusDot"), statusText:$("statusText"),
  nowTitle:$("nowTitle"), nowBy:$("nowBy"), coverImage:$("coverImage"),
  likeCount:$("likeCount"), loveCount:$("loveCount"),
  fireCount:$("fireCount"), wowCount:$("wowCount"),
  wootCount:$("wootCount"), mehCount:$("mehCount"),
  wootTotal:$("wootTotal"), mehTotal:$("mehTotal"),
  wootBtn:$("wootBtn"), mehBtn:$("mehBtn"),
  svWoot:$("svWoot"), svMeh:$("svMeh"),
  currentTimeText:$("currentTimeText"), durationText:$("durationText"),
  progressBar:$("progressBar"), progressDot:$("progressDot"),
  clickToStart:$("clickToStart"),
  stageCanvas:$("stageCanvas"), boothCanvas:$("boothCanvas"),
  djBoothWrap:$("djBoothWrap"), djBoothName:$("djBoothName"),
  djCanvas:$("djCanvas"), djBoxName:$("djBoxName"),
  audienceWrap:$("audienceWrap"),
  onlineCount:$("onlineCount"), onlineCount2:$("onlineCount2"),
  queueList:$("queueList"), queueCount:$("queueCount"),
  youtubeInput:$("youtubeInput"), addSongBtn:$("addSongBtn"),
  waitlistList:$("waitlistList"), waitlistCount:$("waitlistCount"),
  waitlistInfo:$("waitlistInfo"), joinWaitlistBtn:$("joinWaitlistBtn"),
  chatBox:$("chatBox"), chatInput:$("chatInput"), sendChatBtn:$("sendChatBtn"),
  tabQueue:$("tabQueue"), tabWaitlist:$("tabWaitlist"),
};

/* ══ INIT ══ */
drawLogo(EL.logoCanvas);
drawAvatar(EL.previewCanvas, selectedAvatarId, 4, 0);
if (EL.boothCanvas) drawBooth(EL.boothCanvas);
buildAvatarGrid("animals");
startSparkles();
startStageLoop();

document.querySelectorAll(".pxtab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".pxtab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    buildAvatarGrid(tab.dataset.group);
  };
});
document.querySelectorAll(".pxtab2").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".pxtab2").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    EL.tabQueue.classList.toggle("active", tab.dataset.tab==="queue");
    EL.tabWaitlist.classList.toggle("active", tab.dataset.tab==="waitlist");
  };
});

EL.joinBtn.onclick          = joinRoom;
EL.sendChatBtn.onclick      = sendChat;
EL.addSongBtn.onclick       = addSong;
EL.clickToStart.onclick     = unlockAndPlay;
EL.joinWaitlistBtn.onclick  = toggleWaitlist;
EL.wootBtn.onclick = EL.svWoot.onclick = () => castVote("woot");
EL.mehBtn.onclick  = EL.svMeh.onclick  = () => castVote("meh");
document.querySelectorAll(".px-react-btn[data-reaction]").forEach(btn => {
  btn.onclick = () => react(btn.dataset.reaction);
});
EL.chatInput.addEventListener("keydown", e => { if (e.key==="Enter") sendChat(); });
EL.youtubeInput.addEventListener("keydown", e => { if (e.key==="Enter") addSong(); });
EL.nameInput.addEventListener("input", () => {
  EL.previewName.textContent = (EL.nameInput.value.trim() || "PLAYER").toUpperCase();
});
if (me) {
  EL.nameInput.value = me.name;
  selectedAvatarId = me.avatarId || "fox";
  EL.previewName.textContent = me.name;
  drawAvatar(EL.previewCanvas, selectedAvatarId, 4, 0);
}
updatePointsUI();

window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("player", {
    videoId: "",
    playerVars:{autoplay:1,controls:0,disablekb:1,fs:0,rel:0,modestbranding:1,iv_load_policy:3,playsinline:1},
    events:{
      onReady: async () => {
        playerReady = true;
        if (me) { showAppAndBoot(); await loadNowPlaying(); setTimeout(tryAutoPlay,600); }
      },
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    }
  });
};
if (me) showAppAndBoot();

/* ══ AVATAR GRID ══ */
function buildAvatarGrid(group) {
  const defs = AVATARS[group] || AVATARS.animals;
  EL.avatarGrid.innerHTML = "";
  defs.forEach(def => {
    const btn = document.createElement("button");
    btn.className = "av-btn" + (def.id===selectedAvatarId?" active":"");
    const cnv = document.createElement("canvas");
    drawAvatar(cnv, def.id, 4, 0);
    btn.appendChild(cnv);
    btn.title = def.name;
    btn.onclick = () => {
      selectedAvatarId = def.id;
      drawAvatar(EL.previewCanvas, def.id, 4, 0);
      document.querySelectorAll(".av-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    EL.avatarGrid.appendChild(btn);
  });
}

/* ══ SPARKLES ══ */
function startSparkles() {
  const cnv = $("sparkleCanvas");
  if (!cnv) return;
  const ctx = cnv.getContext("2d");
  const pts = [];
  function resize() { cnv.width=window.innerWidth; cnv.height=window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);
  for (let i=0;i<60;i++) pts.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,s:Math.floor(Math.random()*2)+1,v:Math.random()*.6+.2,c:Math.random()>.5?'#6c63ff':'#ff6eb4'});
  function loop() {
    ctx.clearRect(0,0,cnv.width,cnv.height);
    pts.forEach(p=>{ctx.fillStyle=p.c;ctx.fillRect(p.x|0,p.y|0,p.s,p.s);p.y-=p.v;if(p.y<0){p.y=cnv.height;p.x=Math.random()*cnv.width;}});
    requestAnimationFrame(loop);
  }
  loop();
}

/* ══ STAGE LOOP ══ */
function startStageLoop() {
  const cnv = EL.stageCanvas;
  let lastTs = 0;
  function resize() {
    const el = document.getElementById("stage");
    if (!el) return;
    cnv.width  = el.clientWidth  || 800;
    cnv.height = el.clientHeight || 240;
  }
  resize();
  window.addEventListener("resize", resize);
  function loop(ts) {
    requestAnimationFrame(loop);
    if (ts - lastTs < 100) return; // ~10 fps
    lastTs = ts;
    animFrame = (animFrame + 1) % 2;
    drawStage(cnv, isDancing);
    // animate audience canvases
    document.querySelectorAll("canvas[data-avid]").forEach(c => {
      drawAvatar(c, c.dataset.avid, parseInt(c.dataset.scale)||4, isDancing ? animFrame : 0);
    });
  }
  requestAnimationFrame(loop);
}

/* ══ JOIN / BOOT ══ */
function showAppAndBoot() {
  EL.loginScreen.classList.add("hidden");
  EL.app.classList.remove("hidden");
  EL.meLabel.textContent = me.name;
  bootApp();
}
async function joinRoom() {
  const name = EL.nameInput.value.trim();
  if (!name) { showToast("ENTER NAME FIRST"); return; }
  me = { id:crypto.randomUUID(), name:name.toUpperCase(), avatarId:selectedAvatarId };
  localStorage.setItem("bbl_me", JSON.stringify(me));
  await db.from("members").upsert({id:me.id, name:me.name, avatar_id:me.avatarId, last_seen:new Date().toISOString()});
  userUnlockedAudio = true;
  showAppAndBoot();
  setTimeout(unlockAndPlay, 400);
}
async function bootApp() {
  if (!me || booted) return;
  booted = true;
  await ensureRequiredRows();
  await touchOnline();
  await loadAll();
  subscribeRealtime();
  setInterval(touchOnline, HEARTBEAT_MS);
  setInterval(hostLoop, HEARTBEAT_MS);
  setInterval(async () => {
    await Promise.all([loadHostState(),loadQueue(),loadNowPlaying(),loadReactions(),loadOnline(),loadWaitlist()]);
    await hostOnlyAutoStart();
  }, POLL_MS);
  setInterval(loadChat, CHAT_POLL_MS);
  setInterval(updateProgress, 500);
  setInterval(forceNextIfStuck, 2000);
}
async function ensureRequiredRows() {
  await db.from("now_playing").upsert({id:1},{onConflict:"id"});
  const {data:ch} = await db.from("host_state").select("*").eq("id",1).maybeSingle();
  if (!ch) await db.from("host_state").insert({id:1,host_id:me.id,host_name:me.name,host_avatar_id:me.avatarId,updated_at:new Date().toISOString()});
}
function subscribeRealtime() {
  db.channel("bbl-v12")
    .on("postgres_changes",{event:"*",schema:"public",table:"chat_messages"},loadChat)
    .on("postgres_changes",{event:"*",schema:"public",table:"queue"},async()=>{await loadQueue();await hostOnlyAutoStart();})
    .on("postgres_changes",{event:"*",schema:"public",table:"now_playing"},async()=>{await loadNowPlaying();await loadReactions();})
    .on("postgres_changes",{event:"*",schema:"public",table:"reactions"},loadReactions)
    .on("postgres_changes",{event:"*",schema:"public",table:"members"},loadOnline)
    .on("postgres_changes",{event:"*",schema:"public",table:"host_state"},loadHostState)
    .on("postgres_changes",{event:"*",schema:"public",table:"settings"},loadWaitlist)
    .subscribe(status => {
      const live = status==="SUBSCRIBED";
      EL.statusDot.classList.toggle("live", live);
      EL.statusText.textContent = live ? "LIVE" : "CONNECTING";
    });
}
async function loadAll() {
  await Promise.all([loadHostState(),loadChat(),loadQueue(),loadOnline(),loadNowPlaying(),loadReactions(),loadWaitlist()]);
  await hostOnlyAutoStart();
}

/* ══ HEARTBEAT / HOST ══ */
async function touchOnline() {
  if (!me) return;
  await db.from("members").upsert({id:me.id,name:me.name,avatar_id:me.avatarId||"fox",last_seen:new Date().toISOString()});
}
async function loadHostState() {
  const {data} = await db.from("host_state").select("*").eq("id",1).maybeSingle();
  hostState = data;
  if (!hostState) { isHost=false; return; }
  isHost = hostState.host_id === me?.id;
  const djName = hostState.host_name || "HOST";
  const djAvId = hostState.host_avatar_id || "fox";
  EL.hostBadge.textContent = `DJ: ${djName}`;
  EL.djBoxName.textContent = djName;
  drawAvatar(EL.djCanvas, djAvId, 4, animFrame);
  renderStage();
}
async function hostLoop() {
  if (!me) return;
  await loadHostState();
  const expired = !hostState?.updated_at || Date.now()-new Date(hostState.updated_at).getTime() > HOST_TIMEOUT_MS;
  if (isHost) {
    await db.from("host_state").update({host_id:me.id,host_name:me.name,host_avatar_id:me.avatarId||"fox",updated_at:new Date().toISOString()}).eq("id",1);
    await hostOnlyAutoStart(); return;
  }
  if (expired) {
    const {data:first} = await db.from("members").select("*")
      .gte("last_seen",new Date(Date.now()-ONLINE_CUTOFF_MS).toISOString())
      .order("joined_at",{ascending:true}).limit(1).maybeSingle();
    if (first?.id===me.id) {
      await db.from("host_state").update({host_id:me.id,host_name:me.name,host_avatar_id:me.avatarId||"fox",updated_at:new Date().toISOString()}).eq("id",1);
      await loadHostState();
    }
  }
}

/* ══ ONLINE + STAGE ══ */
async function loadOnline() {
  const cutoff = new Date(Date.now()-ONLINE_CUTOFF_MS).toISOString();
  const {data} = await db.from("members").select("*").gte("last_seen",cutoff).order("last_seen",{ascending:false});
  onlineMembers = data||[];
  EL.onlineCount.textContent = String(onlineMembers.length);
  if (EL.onlineCount2) EL.onlineCount2.textContent = String(onlineMembers.length);
  renderStage();
}
function renderStage() {
  const djId = hostState?.host_id;
  const djMember = onlineMembers.find(m=>m.id===djId);
  const audience = onlineMembers.filter(m=>m.id!==djId);

  // DJ Booth avatar
  EL.djBoothWrap.innerHTML = "";
  if (djMember) {
    const cnv = document.createElement("canvas");
    cnv.dataset.avid  = djMember.avatar_id||"fox";
    cnv.dataset.scale = "5";
    drawAvatar(cnv, djMember.avatar_id||"fox", 5, animFrame);
    EL.djBoothWrap.appendChild(cnv);
    EL.djBoothName.textContent = djMember.name;
    EL.djBoothName.classList.remove("hidden");
    drawAvatar(EL.djCanvas, djMember.avatar_id||"fox", 4, animFrame);
    EL.djBoxName.textContent = djMember.name;
  } else {
    EL.djBoothName.classList.add("hidden");
  }

  // Audience row
  const existIds = new Set([...EL.audienceWrap.querySelectorAll(".px-av-wrap")].map(el=>el.dataset.uid));
  const newIds   = new Set(audience.map(m=>m.id));
  EL.audienceWrap.querySelectorAll(".px-av-wrap").forEach(el => { if (!newIds.has(el.dataset.uid)) el.remove(); });
  audience.forEach(member => {
    if (!existIds.has(member.id)) {
      const wrap = document.createElement("div");
      wrap.className = "px-av-wrap" + (member.id===me?.id?" me":"") + (hostState?.host_id===member.id?" is-dj":"");
      wrap.dataset.uid = member.id;
      wrap.style.position = "relative";
      const cnv = document.createElement("canvas");
      cnv.className = "px-av-canvas";
      cnv.dataset.avid  = member.avatar_id||"fox";
      cnv.dataset.scale = "4";
      drawAvatar(cnv, member.avatar_id||"fox", 4, 0);
      const tag = document.createElement("div");
      tag.className = "px-av-tag";
      tag.textContent = member.name;
      wrap.appendChild(cnv);
      wrap.appendChild(tag);
      EL.audienceWrap.appendChild(wrap);
    }
  });
}
function setDancing(on) { isDancing = on; }
function triggerAvatarReaction(uid, key) {
  const wrap = EL.audienceWrap.querySelector(`[data-uid="${uid}"]`);
  if (!wrap) return;
  const pop = document.createElement("div");
  pop.className = "av-react-pop";
  pop.textContent = REACTION_EMOJI[key]||"?";
  wrap.appendChild(pop);
  setTimeout(()=>pop.remove(), 1600);
}
function spawnFloat(key, count=3) {
  for (let i=0;i<count;i++) {
    setTimeout(()=>{
      const el = document.createElement("div");
      el.className = "float-emoji";
      el.textContent = REACTION_EMOJI[key]||"?";
      el.style.left = Math.random()*80+10+"%";
      el.style.bottom = "200px";
      EL.floatLayer.appendChild(el);
      setTimeout(()=>el.remove(), 2900);
    }, i*140);
  }
}

/* ══ WAITLIST ══ */
async function loadWaitlist() {
  const {data} = await db.from("settings").select("value").eq("key","waitlist").maybeSingle();
  waitlist = data?.value||[];
  EL.waitlistCount.textContent = String(waitlist.length);
  renderWaitlist();
}
function renderWaitlist() {
  EL.waitlistList.innerHTML = "";
  if (waitlist.length===0) {
    EL.waitlistList.innerHTML = '<div class="px-q-empty">NO DJ QUEUE YET</div>';
  } else {
    waitlist.forEach((w,i) => {
      const isMe = w.id===me?.id;
      const div = document.createElement("div");
      div.className = "px-wl-item"+(isMe?" me":"");
      const cnvWrap = document.createElement("div"); cnvWrap.className="px-wl-av";
      const cnv = document.createElement("canvas"); cnv.width=24; cnv.height=32;
      drawAvatar(cnv, w.avatarId||"fox", 2, 0);
      cnvWrap.appendChild(cnv);
      div.innerHTML = `<div class="px-wl-pos">${i+1}</div>`;
      div.appendChild(cnvWrap);
      const info = document.createElement("div"); info.className="px-wl-info";
      info.innerHTML = `<div class="px-wl-name">${escapeHtml(w.name)}${isMe?' [YOU]':''}</div><div class="px-wl-sub">${i===0?'▶ NEXT DJ':'#'+(i+1)+' WAITING'}</div>`;
      div.appendChild(info);
      EL.waitlistList.appendChild(div);
    });
  }
  const myPos = waitlist.findIndex(w=>w.id===me?.id);
  if (myPos>=0) {
    EL.waitlistInfo.classList.remove("hidden");
    EL.waitlistInfo.innerHTML = myPos===0 ? '<b>YOU ARE NEXT DJ!</b>' : `YOU ARE #${myPos+1} — ${myPos} MORE`;
    EL.joinWaitlistBtn.textContent = "[LEAVE DJ QUEUE]";
    EL.joinWaitlistBtn.classList.add("in");
  } else {
    EL.waitlistInfo.classList.add("hidden");
    EL.joinWaitlistBtn.textContent = "+ JOIN DJ QUEUE";
    EL.joinWaitlistBtn.classList.remove("in");
  }
}
async function toggleWaitlist() {
  if (!me) return;
  const myPos = waitlist.findIndex(w=>w.id===me.id);
  const newList = myPos>=0
    ? waitlist.filter(w=>w.id!==me.id)
    : [...waitlist,{id:me.id,name:me.name,avatarId:me.avatarId||"fox",joined_at:new Date().toISOString()}];
  await db.from("settings").upsert({key:"waitlist",value:newList});
  showToast(myPos>=0?"LEFT DJ QUEUE":`JOINED! #${newList.length}`,myPos>=0?"":"success");
  await loadWaitlist();
}

/* ══ CHAT ══ */
async function sendChat() {
  const msg = EL.chatInput.value.trim(); if (!msg) return;
  await db.from("chat_messages").insert({member_name:me.name,member_emoji:"",message:msg});
  EL.chatInput.value = ""; await loadChat();
}
async function loadChat() {
  const {data} = await db.from("chat_messages").select("*").order("created_at",{ascending:true}).limit(120);
  const atBottom = EL.chatBox.scrollHeight-EL.chatBox.scrollTop-EL.chatBox.clientHeight<60;
  EL.chatBox.innerHTML = "";
  (data||[]).forEach(row => {
    const time = new Date(row.created_at).toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"});
    const div = document.createElement("div"); div.className="px-msg";
    div.innerHTML=`<div class="px-msg-hd"><span class="px-msg-name">${escapeHtml(row.member_name)}</span><span class="px-msg-time">${time}</span></div><div class="px-msg-txt">${linkify(escapeHtml(row.message))}</div>`;
    EL.chatBox.appendChild(div);
  });
  if (atBottom) EL.chatBox.scrollTop = EL.chatBox.scrollHeight;
}
function sysMsg(text, type="sys") {
  const div = document.createElement("div"); div.className=`px-msg ${type}`; div.textContent=text;
  EL.chatBox.appendChild(div); EL.chatBox.scrollTop=EL.chatBox.scrollHeight;
}

/* ══ QUEUE ══ */
async function addSong() {
  const input = EL.youtubeInput.value.trim(), vid = extractYouTubeId(input);
  if (!vid) { showToast("INVALID YOUTUBE LINK"); return; }
  const {data:ex} = await db.from("queue").select("id").eq("video_id",vid).eq("played",false).limit(1).maybeSingle();
  if (ex) { showToast("SONG ALREADY IN QUEUE","error"); return; }
  const {count} = await db.from("queue").select("*",{count:"exact",head:true}).eq("member_name",me.name).eq("played",false);
  if ((count||0)>=MAX_SONGS_PER_USER) { showToast(`MAX ${MAX_SONGS_PER_USER} SONGS`,"error"); return; }
  EL.addSongBtn.disabled=true; EL.addSongBtn.textContent="…";
  const meta = await getYouTubeMeta(vid);
  const {error} = await db.from("queue").insert({member_name:me.name,member_emoji:"",youtube_url:`https://www.youtube.com/watch?v=${vid}`,video_id:vid,title:meta.title,played:false});
  EL.addSongBtn.disabled=false; EL.addSongBtn.textContent="+";
  if (error) { showToast("FAILED TO ADD"); return; }
  EL.youtubeInput.value="";
  showToast("SONG ADDED ✓","success");
  await loadQueue(); await hostOnlyAutoStart();
}
async function loadQueue() {
  const {data} = await db.from("queue").select("*").eq("played",false).order("created_at",{ascending:true});
  EL.queueList.innerHTML=""; EL.queueCount.textContent=String((data||[]).length);
  if (!data||data.length===0) { EL.queueList.innerHTML='<div class="px-q-empty">QUEUE EMPTY\nPASTE URL BELOW</div>'; return; }
  data.forEach((row,i)=>{
    const div=document.createElement("div"); div.className="px-q-item";
    div.innerHTML=`<span class="px-q-num">${i===0?"▶":i+1}</span><img class="px-q-thumb" src="${thumbnail(row.video_id)}" alt="" onerror="this.style.opacity=0"><div class="px-q-info"><div class="px-q-title">${escapeHtml(cleanTitle(row.title,row.video_id))}</div><div class="px-q-by">${escapeHtml(row.member_name)}</div></div>`;
    EL.queueList.appendChild(div);
  });
}

/* ══ NOW PLAYING ══ */
async function loadNowPlaying() {
  const {data} = await db.from("now_playing").select("*").eq("id",1).single();
  nowPlayingCache = data;
  if (!data||!data.video_id) {
    EL.nowTitle.textContent="-- NO SONG --"; EL.nowBy.textContent="";
    EL.coverImage.style.display="none";
    currentVideoId=null; currentSongAddedBy=null; myVoteThisSong=null;
    updateVoteUI(); setDancing(false); return;
  }
  const title = cleanTitle(data.title,data.video_id);
  EL.nowTitle.textContent = title.toUpperCase().slice(0,40);
  EL.nowBy.textContent = data.updated_by?`BY ${data.updated_by}`:"";
  EL.coverImage.src = thumbnail(data.video_id,"max");
  EL.coverImage.style.display = "block";
  currentSongAddedBy = data.updated_by||null;
  if (data.video_id!==currentVideoId) {
    currentVideoId=data.video_id; endWatchCount=0; lastProgressVid=data.video_id;
    myVoteThisSong=null; updateVoteUI(); setDancing(true);
    if (playerReady&&player) {
      const startSec = data.started_at?Math.max(0,Math.floor((Date.now()-new Date(data.started_at).getTime())/1000)):0;
      player.loadVideoById({videoId:data.video_id,startSeconds:startSec});
      setTimeout(tryAutoPlay,700);
    }
  }
}

/* ══ REACTIONS + VOTE ══ */
async function react(type) {
  const vid=nowPlayingCache?.video_id||"none"; if(vid==="none")return;
  await db.from("reactions").insert({video_id:vid,member_name:me.name,reaction:type});
  triggerAvatarReaction(me.id,type); spawnFloat(type,3); addPoints(XP_REACT);
  await loadReactions();
}
async function castVote(type) {
  if (myVoteThisSong) { showToast("ALREADY VOTED"); return; }
  const vid=nowPlayingCache?.video_id||"none"; if(vid==="none")return;
  myVoteThisSong=type; updateVoteUI();
  await db.from("reactions").insert({video_id:vid,member_name:me.name,reaction:type});
  spawnFloat(type,6); triggerAvatarReaction(me.id,type);
  sysMsg(type==="woot"?`${me.name} — WOOT! ❤️`:`${me.name} — MEH 💔`);
  await loadReactions();
}
function updateVoteUI() {
  EL.wootBtn.classList.toggle("voted",myVoteThisSong==="woot");
  EL.mehBtn.classList.toggle("voted",myVoteThisSong==="meh");
  EL.svWoot.classList.toggle("voted",myVoteThisSong==="woot");
  EL.svMeh.classList.toggle("voted",myVoteThisSong==="meh");
}
async function loadReactions() {
  const vid=nowPlayingCache?.video_id||"none";
  const {data} = await db.from("reactions").select("*").eq("video_id",vid);
  const rows=data||[];
  const wc=rows.filter(x=>x.reaction==="woot").length, mc=rows.filter(x=>x.reaction==="meh").length;
  EL.likeCount.textContent=rows.filter(x=>x.reaction==="like").length;
  EL.loveCount.textContent=rows.filter(x=>x.reaction==="love").length;
  EL.fireCount.textContent=rows.filter(x=>x.reaction==="fire").length;
  EL.wowCount.textContent=rows.filter(x=>x.reaction==="wow").length;
  EL.wootCount.textContent=wc; EL.mehCount.textContent=mc;
  EL.wootTotal.textContent=wc; EL.mehTotal.textContent=mc;
}

/* ══ POINTS ══ */
function addPoints(xp){myPoints+=xp;localStorage.setItem("bbl_pts",String(myPoints));updatePointsUI();}
function updatePointsUI(){EL.myXP.textContent=`${myPoints} XP`;}

/* ══ HOST ══ */
async function nextSongRPC(reason="auto"){
  if(!isHost||changingSong||nextRpcCooldown)return;
  changingSong=nextRpcCooldown=true;
  try{
    if(currentSongAddedBy===me?.name){addPoints(XP_SONG_PLAYED);sysMsg(`+${XP_SONG_PLAYED} XP — YOUR SONG FINISHED!`,"xp");}
    const{error}=await db.rpc("admin_next_song");
    if(error){showToast("SKIP FAILED","error");return;}
    currentVideoId=null;nowPlayingCache=null;endWatchCount=0;lastProgressVid=null;myVoteThisSong=null;
    await Promise.all([loadNowPlaying(),loadQueue(),loadReactions()]);setTimeout(tryAutoPlay,700);
  }catch(e){showToast("SKIP FAILED","error");}
  finally{changingSong=false;setTimeout(()=>{nextRpcCooldown=false;},2200);}
}
async function hostOnlyAutoStart(){
  if(!isHost||changingSong||nextRpcCooldown)return;
  const{data}=await db.from("now_playing").select("*").eq("id",1).single();
  if(data&&data.video_id)return;
  await nextSongRPC("empty");
}

/* ══ PLAYER ══ */
async function onPlayerStateChange(event){
  if(event.data===YT.PlayerState.ENDED&&isHost){endWatchCount=0;await nextSongRPC("ended");}
  if(event.data===YT.PlayerState.PLAYING){EL.clickToStart.classList.add("hidden");setDancing(true);}
  if(isHost&&(event.data===YT.PlayerState.PAUSED||event.data===YT.PlayerState.CUED)){
    setTimeout(async()=>{try{const c=player.getCurrentTime(),d=player.getDuration();if(d>8&&c>0&&d-c<=3)await nextSongRPC("paused-near-end");}catch(e){}},900);
  }
}
function onPlayerError(){showToast("UNPLAYABLE — SKIPPING");if(isHost)setTimeout(()=>nextSongRPC("player-error"),900);}
function tryAutoPlay(){
  if(!playerReady||!player)return;
  if(!currentVideoId){loadNowPlaying();return;}
  try{
    player.mute();player.playVideo();
    setTimeout(()=>{
      try{if(userUnlockedAudio){player.unMute();player.setVolume(100);player.playVideo();EL.clickToStart.classList.add("hidden");}else EL.clickToStart.classList.remove("hidden");}
      catch(e){EL.clickToStart.classList.remove("hidden");}
    },800);
  }catch(e){EL.clickToStart.classList.remove("hidden");}
}
function unlockAndPlay(){
  userUnlockedAudio=true;
  try{player.unMute();player.setVolume(100);player.playVideo();EL.clickToStart.classList.add("hidden");}
  catch(e){showToast("CLICK AGAIN TO PLAY");}
}
document.addEventListener("click",()=>{userUnlockedAudio=true;if(currentVideoId)unlockAndPlay();},{once:true});

/* ══ PROGRESS ══ */
function updateProgress(){
  if(!playerReady||!player||!currentVideoId){setProgressUI(0,0);return;}
  try{
    const c=player.getCurrentTime?player.getCurrentTime():0, d=player.getDuration?player.getDuration():0;
    setProgressUI(c,d);
    if(lastProgressVid!==currentVideoId){endWatchCount=0;lastProgressVid=currentVideoId;}
    const nearEnd=d>8&&c>0&&(d-c<=3||c>=d-3);
    if(isHost&&nearEnd&&!changingSong&&!nextRpcCooldown){if(++endWatchCount>=3){endWatchCount=0;nextSongRPC("progress-near-end");}}
    else if(!nearEnd)endWatchCount=0;
  }catch(e){}
}
async function forceNextIfStuck(){
  if(!isHost||!me||!playerReady||!player||!currentVideoId||changingSong||nextRpcCooldown)return;
  try{const c=player.getCurrentTime(),d=player.getDuration();if(d>8&&c>0&&d-c<=3)await nextSongRPC("force-stuck");}catch(e){}
}
function setProgressUI(c,d){
  const sc=Number(c)||0,sd=Number(d)||0,pct=sd>0?Math.max(0,Math.min(100,(sc/sd)*100)):0;
  EL.currentTimeText.textContent=formatTime(sc);EL.durationText.textContent=sd>0?formatTime(sd):"0:00";
  EL.progressBar.style.width=`${pct}%`;EL.progressDot.style.left=`${pct}%`;
}

/* ══ UTILS ══ */
function formatTime(s){s=Math.max(0,Math.floor(Number(s)||0));return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`}
function cleanTitle(t,vid){const s=String(t||"").trim();if(!s||s===vid||s.startsWith("YouTube:"))return "LOADING...";return s;}
async function getYouTubeMeta(vid){
  try{const r=await fetch(`https://noembed.com/embed?url=${encodeURIComponent("https://www.youtube.com/watch?v="+vid)}`);const d=await r.json();if(d?.title)return{title:d.title.replace(/\s*-\s*YouTube\s*$/i,"").trim()};}catch(e){}
  return{title:"UNKNOWN SONG"};
}
function extractYouTubeId(input){
  if(!input)return null;
  if(/^[a-zA-Z0-9_-]{11}$/.test(input))return input;
  try{
    const url=new URL(input);
    if(url.hostname.includes("youtu.be"))return url.pathname.replace("/","").slice(0,11);
    if(url.hostname.includes("youtube.com")){
      const v=url.searchParams.get("v");if(v)return v.slice(0,11);
      const s=url.pathname.match(/\/shorts\/([^/?]+)/);if(s)return s[1].slice(0,11);
      const e=url.pathname.match(/\/embed\/([^/?]+)/);if(e)return e[1].slice(0,11);
    }
  }catch(e){}
  return null;
}
function thumbnail(vid,size="mq"){if(!vid)return"";return size==="max"?`https://img.youtube.com/vi/${vid}/maxresdefault.jpg`:`https://img.youtube.com/vi/${vid}/mqdefault.jpg`}
function linkify(t){return t.replace(/(@[\wก-๙]+)/g,"<b>$1</b>")}
function escapeHtml(t){return String(t||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function showToast(msg,type=""){
  EL.toast.textContent=msg;EL.toast.className="toast"+(type?" "+type:"");EL.toast.classList.remove("hidden");
  clearTimeout(showToast._t);showToast._t=setTimeout(()=>EL.toast.classList.add("hidden"),2800);
}
