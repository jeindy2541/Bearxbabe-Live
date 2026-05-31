/* ================================================
   BEARXBABE LIVE V12 — PIXEL ART ENGINE
   ================================================ */
const SUPABASE_URL      = "https://xwfnqxqdlvvykppzlrxj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Zm5xeHFkbHZ2eWtwcHpscnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMTg0NjksImV4cCI6MjA5NTc5NDQ2OX0.Xr46g9TuWFzS3zhVvLAFqyVCqv9Al35W9rGDpXPaIwQ";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ══════════════════════════════════════════════
   PIXEL ART ENGINE
   ══════════════════════════════════════════════ */

// Each avatar is a 12x16 pixel grid (r,g,b,a values 0-15 mapped to full)
// 0=transparent, letters = color indices
const PAL = {
  _: [0,0,0,0],       // transparent
  K: [10,10,15,255],  // near-black / dark outline
  W: [255,255,240,255], // white/skin light
  S: [255,200,150,255], // skin
  D: [180,120,80,255],  // skin dark
  R: [255,60,80,255],   // red
  B: [60,100,255,255],  // blue
  G: [60,200,100,255],  // green
  Y: [255,220,0,255],   // yellow
  P: [150,80,220,255],  // purple
  C: [0,220,255,255],   // cyan
  O: [255,130,0,255],   // orange
  N: [100,60,30,255],   // brown
  T: [80,50,200,255],   // dark blue
  M: [255,80,180,255],  // magenta/pink
  L: [180,180,200,255], // light grey
  E: [60,60,80,255],    // dark grey
  A: [255,255,255,255], // pure white
};

// 12 wide x 16 tall pixel avatars
// Row by row, left to right
const AVATAR_DEFS = {
  animals: [
    { name:"Fox",    id:"fox",    colors:["O","Y","W"],
      // orange fox with white belly, pointy ears
      rows:[
        "____OOOO____",
        "___OOOOOOO__",
        "__OOOOOOOOO_",
        "_OOOOOOOOOOO",
        "_OOWWWWWWOOO",
        "OOOWWWWWWOOO",
        "OOOWWWWWWOOOO",
        "_OOOOOOOOOOO",
        "__WWWWWWWWW_",
        "_WWWWWWWWWWW",
        "_WWWWWWWWWWW",
        "_KWWWKWWKWWK",
        "___KKKKKK___",
        "___KK__KK___",
        "___KK__KK___",
        "____________",
      ]
    },
    { name:"Cat",    id:"cat",    colors:["E","W","M"],
      rows:[
        "____EEEE____",
        "___EEEEEE___",
        "__EEEEEEEE__",
        "_EEKEE_KEEK_",
        "_EEWWEEWWEE_",
        "_EEWWEEWWEE_",
        "__EEMMMMEE__",
        "__EEEEEEE___",
        "__EEEEEEE___",
        "_MEEEEEEEM__",
        "_MEEEEEEEM__",
        "_MEKEKEKEMM_",
        "___KK__KK___",
        "___KK__KK___",
        "___KK__KK___",
        "____________",
      ]
    },
    { name:"Bear",   id:"bear",   colors:["N","W","K"],
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
        "_KWNKWWKNWK_",
        "___KK__KK___",
        "___KK__KK___",
        "___KK__KK___",
        "____________",
      ]
    },
    { name:"Bunny",  id:"bun",    colors:["W","M","K"],
      rows:[
        "__WW____WW__",
        "__WW____WW__",
        "__WWWWWWWW__",
        "_WWWWWWWWWW_",
        "_WWWWWWWWWW_",
        "_WWMW__WMWW_",
        "__WWWMMWWW__",
        "_WWWWWWWWWW_",
        "__WWWWWWWW__",
        "_WWWWWWWWWW_",
        "_WWWWWWWWWW_",
        "_KWWKWWKWWK_",
        "____KKKK____",
        "___KK__KK___",
        "___KK__KK___",
        "____________",
      ]
    },
    { name:"Dog",    id:"dog",    colors:["N","W","K"],
      rows:[
        "____NNNN____",
        "__NNNNNNNN__",
        "_NNNNNNNNNN_",
        "_NWNWWWWNWN_",
        "NNNWWWWWWNNN",
        "NNNWWWWWWNNN",
        "_NNNWWWWNNN_",
        "__NNWWWWNN__",
        "__WWWWWWWW__",
        "_WWWWWWWWWW_",
        "_WWWWWWWWWW_",
        "_KWNKWWKNWK_",
        "___KK__KK___",
        "___KK__KK___",
        "__NKK__KKN__",
        "____________",
      ]
    },
    { name:"Frog",   id:"frog",   colors:["G","W","K"],
      rows:[
        "____GGGG____",
        "___GGGGGG___",
        "__GGGGGGGG__",
        "_GGWGGGGWGG_",
        "_GGWGGGGWGG_",
        "__GGGKKGGG__",
        "__GGWWWWGG__",
        "_GGGGGGGGGG_",
        "__GGGGGGGG__",
        "_GGGGGGGGGG_",
        "_GGGGGGGGGG_",
        "_KGGKGGGKGGK",
        "____KKKK____",
        "___GK__KG___",
        "___GK__KG___",
        "____________",
      ]
    },
  ],
  robots: [
    { name:"Robo",   id:"robo",   colors:["L","C","K"],
      rows:[
        "____LLLL____",
        "__KLLLLLK___",
        "_KLLLLLLLLK_",
        "_LCCLLLLCCL_",
        "_LCCLLLLCCL_",
        "_LLLLLLLLL__",
        "_KLLKKLLKLK_",
        "_LLLLLLLLL__",
        "__LLLLLLL___",
        "_LLLLLLLLL__",
        "_LLLLLLLLL__",
        "_LKLKLLKLKL_",
        "____KKKK____",
        "___LK__KL___",
        "___LK__KL___",
        "____________",
      ]
    },
    { name:"Droid",  id:"droid",  colors:["T","C","K"],
      rows:[
        "___TTTTTT___",
        "__TTTTTTTT__",
        "_TTTTTTTTTT_",
        "_TCTTTTTTCT_",
        "_TCTTTTTTCT_",
        "_TTCCTTCCTT_",
        "_TTTTTTTTTT_",
        "__TTTTTTTT__",
        "__TTTTTTTT__",
        "_TTTTTTTTTT_",
        "_TTTTTTTTTT_",
        "_KTTKTTTKTTK",
        "____KKKK____",
        "___TK__KT___",
        "___TK__KT___",
        "____________",
      ]
    },
    { name:"Mech",   id:"mech",   colors:["E","Y","K"],
      rows:[
        "___YEEEEEY__",
        "__YEEEEEEY__",
        "_YEEEEEEEY__",
        "_YEYEEEYEY__",
        "_YEYEEEYEY__",
        "_YEEEEEEY___",
        "_YYYYYYYY___",
        "_YEEEEEEEY__",
        "__EEEEEEEE__",
        "_EEEEEEEEEE_",
        "_EEEEEEEEEE_",
        "_KEEKEEEKEK_",
        "____KKKK____",
        "___EK__KE___",
        "___EK__KE___",
        "____________",
      ]
    },
  ],
  humans: [
    { name:"Hero",   id:"hero",   colors:["S","B","K"],
      rows:[
        "____SSSS____",
        "___SSSSSS___",
        "__SSSSSSSS__",
        "__SKSSSSKS__",
        "__SKSSSSKS__",
        "___SSSSSS___",
        "___KSSSSKK__",
        "___SSSSS____",
        "__BBBBBBB___",
        "_BBBBBBBBB__",
        "_BBBBBBBBB__",
        "_KBSKBBSKBK_",
        "____KKKK____",
        "___SK__KS___",
        "___SK__KS___",
        "____________",
      ]
    },
    { name:"Punk",   id:"punk",   colors:["S","M","K"],
      rows:[
        "___MMMMM____",
        "__MMMMMMM___",
        "__MSSSSSSM__",
        "_MSKSSSSK SM_",
        "_MSKSSSSK SM_",
        "__MSSSSSM___",
        "__MSSSSKM___",
        "__SSSSSSS___",
        "__MMMMMMMM__",
        "_MMMMMMMMMM_",
        "_MMMMMMMMMM_",
        "_KMSKMMSKMS_",
        "____KKKK____",
        "___SK__KS___",
        "___SK__KS___",
        "____________",
      ]
    },
    { name:"Wizard", id:"wiz",    colors:["P","Y","K"],
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
        "_KPPKPPKPPK_",
        "____KKKK____",
        "___PK__KP___",
        "___PK__KP___",
        "____________",
      ]
    },
  ],
  special: [
    { name:"Fire",   id:"fire",   colors:["R","Y","K"],
      rows:[
        "__YY__YY__Y_",
        "_YYRYYYRYYY_",
        "_RRRRRRRRRY_",
        "RRRRRRRRRRRY",
        "RRRRRRRRRRRR",
        "_YRRRRRRRRY_",
        "__YRRRRRRY__",
        "__RRRRRRRR__",
        "__RRRRRRRR__",
        "_RRRRRRRRRR_",
        "_RRRRRRRRRR_",
        "_KRRRKRRKRRK",
        "____KKKK____",
        "___RK__KR___",
        "___RK__KR___",
        "____________",
      ]
    },
    { name:"Ghost",  id:"ghost",  colors:["A","P","K"],
      rows:[
        "____AAAA____",
        "__AAAAAAAA__",
        "_AAAAAAAAAA_",
        "_AAKAAAAKAA_",
        "_AAKAAAAKAA_",
        "_AAAAAAAAA__",
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
      ]
    },
    { name:"Star",   id:"star",   colors:["Y","O","K"],
      rows:[
        "____YYYY____",
        "___YYYYYY___",
        "__OOOOOOOO__",
        "_OOYYYYYYO__",
        "_OOYYYYYYO__",
        "__OOOOOOOO__",
        "___YYYYYY___",
        "____YYYY____",
        "___OOOOOO___",
        "__OOOOOOOO__",
        "__OOOOOOOO__",
        "__KOKOKOKOK_",
        "____KKKK____",
        "___YK__KY___",
        "___YK__KY___",
        "____________",
      ]
    },
    { name:"Crown",  id:"crown",  colors:["Y","O","K"],
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
        "____KKKK____",
        "___YK__KY___",
        "___YK__KY___",
        "____________",
      ]
    },
  ]
};

const ALL_AVATARS = [
  ...AVATAR_DEFS.animals, ...AVATAR_DEFS.robots,
  ...AVATAR_DEFS.humans,  ...AVATAR_DEFS.special
];

/* Draw a pixel avatar onto a canvas */
function drawAvatar(canvas, avatarId, scale=1, animFrame=0) {
  const def = ALL_AVATARS.find(a=>a.id===avatarId) || ALL_AVATARS[0];
  const W = 12, H = 16;
  canvas.width  = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dance animation: shift legs on frame 1
  const rows = [...def.rows];
  if (animFrame === 1) {
    // Swap last 3 rows for simple walk cycle
    if (rows.length >= 3) {
      const tmp = rows[rows.length-3];
      rows[rows.length-3] = rows[rows.length-2];
      rows[rows.length-2] = tmp;
    }
  }

  rows.forEach((row, y) => {
    for (let x = 0; x < W; x++) {
      const ch = row[x] || '_';
      const col = PAL[ch] || PAL['_'];
      if (col[3] === 0) return;
      ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${col[3]/255})`;
      ctx.fillRect(x*scale, y*scale, scale, scale);
    }
  });
}

/* Draw pixel LOGO */
function drawLogo(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0,0,80,80);
  // Fire emoji pixelated
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
  fire.forEach((row,y)=>{
    [...row].forEach((ch,x)=>{
      ctx.fillStyle = ch==='R'?'#ff3355':ch==='Y'?'#ffe600':'transparent';
      if (ch!=='_') ctx.fillRect(x*s+10, y*s+15, s, s);
    });
  });
}

/* Draw pixel BOOTH */
function drawBooth(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0,0,120,40);
  // Booth table (pixel box)
  const S = 4;
  for(let x=0;x<120;x+=S){
    for(let y=8;y<40;y+=S){
      const isEdge = x<S||x>=116||y<S+8;
      ctx.fillStyle = isEdge ? '#5a3010' : '#3a2010';
      ctx.fillRect(x,y,S-1,S-1);
    }
  }
  // Glowing line
  const grad = ctx.createLinearGradient(0,8,120,8);
  grad.addColorStop(0,'transparent');
  grad.addColorStop(.3,'#6c63ff');
  grad.addColorStop(.5,'#ff6eb4');
  grad.addColorStop(.7,'#6c63ff');
  grad.addColorStop(1,'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0,8,120,4);
  // Vinyl discs
  [[20,20],[60,20],[100,20]].forEach(([cx,cy])=>{
    ctx.fillStyle='#1a1a2e'; ctx.beginPath(); ctx.arc(cx,cy,10,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#6c63ff'; ctx.beginPath(); ctx.arc(cx,cy,10,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#ff6eb4'; ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fill();
  });
}

/* Draw pixel STAGE BACKGROUND on canvas */
function drawStage(canvas, isDancing) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  if (W===0||H===0) return;
  ctx.imageSmoothingEnabled = false;

  // Sky gradient (pixelated steps)
  const SKY_COLS = ["#050510","#0a0820","#100a2e","#180c3a","#200e3e","#1a1030"];
  const rowH = Math.ceil(H * .65 / SKY_COLS.length);
  SKY_COLS.forEach((c,i)=>{ ctx.fillStyle=c; ctx.fillRect(0,i*rowH,W,rowH); });

  // Stars
  if (!drawStage._stars || drawStage._starsW!==W) {
    drawStage._stars=[]; drawStage._starsW=W;
    for(let i=0;i<60;i++) drawStage._stars.push([Math.random()*W|0, Math.random()*(H*.5)|0, Math.random()>.5?2:1]);
  }
  const twinkle = Math.floor(Date.now()/500)%3;
  drawStage._stars.forEach(([x,y,s],i)=>{
    ctx.fillStyle = i%3===twinkle ? '#ffffff' : 'rgba(255,255,255,.4)';
    ctx.fillRect(x,y,s,s);
  });

  // Moon (pixel circle)
  const mx=W*.75|0, my=H*.12|0, mr=14;
  for(let py=-mr;py<=mr;py++){for(let px=-mr;px<=mr;px++){
    if(px*px+py*py<=mr*mr){ctx.fillStyle='#ffe600';ctx.fillRect(mx+px,my+py,1,1);}
  }}
  // Moon craters
  [[mx+4,my-2,3],[mx-2,my+4,2]].forEach(([cx,cy,r])=>{
    for(let py=-r;py<=r;py++)for(let px=-r;px<=r;px++)
      if(px*px+py*py<=r*r){ctx.fillStyle='#ccaa00';ctx.fillRect(cx+px,cy+py,1,1);}
  });

  // Pixel city skyline
  const buildings=[
    [0,20,H*.38],[30,35,H*.42],[70,25,H*.36],[110,40,H*.40],
    [160,20,H*.33],[200,30,H*.38],[240,15,H*.30],[280,28,H*.37],
    [320,22,H*.35],[350,38,H*.41],[W-80,20,H*.34],[W-40,30,H*.39]
  ];
  buildings.forEach(([bx,bw,by])=>{
    ctx.fillStyle='#0d0d1a';
    ctx.fillRect(bx,by,bw,H-by);
    // Windows
    for(let wy=by+4;wy<H*.55;wy+=8)
      for(let wx=bx+4;wx<bx+bw-4;wx+=8){
        const lit=Math.random()>.6;
        ctx.fillStyle=lit?'#ffe60088':'#1a1a2e';
        ctx.fillRect(wx,wy,4,4);
      }
  });

  // Floor (stage)
  const floorY = H*.64|0;
  // Stage gradient
  const flGrad = ctx.createLinearGradient(0,floorY,0,H);
  flGrad.addColorStop(0,'#2a1a05');
  flGrad.addColorStop(1,'#0f0802');
  ctx.fillStyle=flGrad;
  ctx.fillRect(0,floorY,W,H-floorY);

  // Stage edge glow
  const glow = ctx.createLinearGradient(0,floorY,W,floorY);
  glow.addColorStop(0,'transparent');
  glow.addColorStop(.2,'rgba(108,99,255,.5)');
  glow.addColorStop(.5,'rgba(255,110,180,.7)');
  glow.addColorStop(.8,'rgba(108,99,255,.5)');
  glow.addColorStop(1,'transparent');
  ctx.fillStyle=glow;
  ctx.fillRect(0,floorY,W,3);

  // Floor tile lines (pixel art style)
  ctx.fillStyle='rgba(80,50,10,.4)';
  for(let lx=0;lx<W;lx+=16) ctx.fillRect(lx,floorY,1,H-floorY);
  for(let ly=floorY;ly<H;ly+=12) ctx.fillRect(0,ly,W,1);

  // Pixel speakers left+right
  [[10,floorY-40],[W-46,floorY-40]].forEach(([spx,spy])=>{
    ctx.fillStyle='#1a1a2e'; ctx.fillRect(spx,spy,36,40);
    ctx.fillStyle='#2a2a4e'; ctx.fillRect(spx+2,spy+2,32,36);
    // Speaker cones
    [[spx+8,spy+8,8],[spx+18,spy+22,6]].forEach(([cx,cy,r])=>{
      for(let py=-r;py<=r;py++)for(let px=-r;px<=r;px++)
        if(px*px+py*py<=r*r){ctx.fillStyle='#3a3a6a';ctx.fillRect(cx+px,cy+py,1,1);}
      ctx.fillStyle='#6c63ff';
      for(let py=-2;py<=2;py++)for(let px=-2;px<=2;px++)
        if(px*px+py*py<=4){ctx.fillRect(cx+px,cy+py,1,1);}
    });
  });

  // Dance floor lights (colorful pixel squares)
  if(isDancing){
    const t = Date.now();
    const lightCols=['#ff3355','#6c63ff','#00e5ff','#ffe600','#ff6eb4','#00ff88'];
    for(let i=0;i<8;i++){
      const lx = (W*.2 + i*(W*.075))|0;
      const active = Math.floor(t/300+i)%2===0;
      ctx.fillStyle = active ? lightCols[i%lightCols.length] : 'rgba(255,255,255,.05)';
      ctx.fillRect(lx, floorY+2, 12, 6);
      if(active){
        ctx.fillStyle='rgba(255,255,255,.15)';
        ctx.fillRect(lx+2, floorY+8, 8, H-floorY-10);
      }
    }
  }

  // CRT vignette
  const vig=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.8);
  vig.addColorStop(0,'transparent');
  vig.addColorStop(1,'rgba(0,0,0,.5)');
  ctx.fillStyle=vig;
  ctx.fillRect(0,0,W,H);
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
const REACTION_EMOJI     = {like:"👍",love:"❤️",fire:"🔥",wow:"😮",woot:"❤️",meh:"💔"};

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
let animFrame=0, stageRafId=null;
let isDancing=false;
let avatarAnimMap={};   // uid -> animInterval

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
  stageCanvas:$("stageCanvas"),
  boothCanvas:$("boothCanvas"),
  djBoothWrap:$("djBoothWrap"), djBoothName:$("djBoothName"),
  djCanvas:$("djCanvas"), djBoxName:$("djBoxName"),
  audienceWrap:$("audienceWrap"),
  onlineCount:$("onlineCount"), onlineCount2:$("onlineCount2"),
  queueList:$("queueList"), queueCount:$("queueCount"),
  waitlistList:$("waitlistList"), waitlistCount:$("waitlistCount"),
  waitlistInfo:$("waitlistInfo"), joinWaitlistBtn:$("joinWaitlistBtn"),
  chatBox:$("chatBox"), chatInput:$("chatInput"), sendChatBtn:$("sendChatBtn"),
  tabQueue:$("tabQueue"), tabWaitlist:$("tabWaitlist"),
};

/* ══ INIT ══ */
drawLogo(EL.logoCanvas);
drawBooth(EL.boothCanvas);
buildAvatarGrid("animals");
startSparkles();
startStageLoop();

document.querySelectorAll(".pxtab").forEach(tab=>{
  tab.onclick=()=>{
    document.querySelectorAll(".pxtab").forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    buildAvatarGrid(tab.dataset.group);
  };
});
document.querySelectorAll(".pxtab2").forEach(tab=>{
  tab.onclick=()=>{
    document.querySelectorAll(".pxtab2").forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    EL.tabQueue.classList.toggle("active",tab.dataset.tab==="queue");
    EL.tabWaitlist.classList.toggle("active",tab.dataset.tab==="waitlist");
  };
});

EL.joinBtn.onclick         = joinRoom;
EL.sendChatBtn.onclick     = sendChat;
EL.addSongBtn.onclick      = addSong;
EL.clickToStart.onclick    = unlockAndPlay;
EL.joinWaitlistBtn.onclick = toggleWaitlist;
EL.wootBtn.onclick = EL.svWoot.onclick = ()=>castVote("woot");
EL.mehBtn.onclick  = EL.svMeh.onclick  = ()=>castVote("meh");
document.querySelectorAll(".px-react-btn[data-reaction]").forEach(btn=>{
  btn.onclick=()=>react(btn.dataset.reaction);
});
EL.chatInput.addEventListener("keydown",e=>{if(e.key==="Enter")sendChat();});
EL.youtubeInput.addEventListener("keydown",e=>{if(e.key==="Enter")addSong();});
EL.nameInput.addEventListener("input",()=>{EL.previewName.textContent=(EL.nameInput.value.trim()||"PLAYER").toUpperCase();});
if(me){ drawAvatar(EL.previewCanvas,me.avatarId||"fox",4); EL.previewName.textContent=me.name.toUpperCase(); selectedAvatarId=me.avatarId||"fox"; }
else { drawAvatar(EL.previewCanvas,"fox",4); }
updatePointsUI();

window.onYouTubeIframeAPIReady=()=>{
  player=new YT.Player("player",{
    videoId:"",
    playerVars:{autoplay:1,controls:0,disablekb:1,fs:0,rel:0,modestbranding:1,iv_load_policy:3,playsinline:1},
    events:{
      onReady:async()=>{
        playerReady=true;
        if(me){showAppAndBoot();await loadNowPlaying();setTimeout(tryAutoPlay,600);}
      },
      onStateChange:onPlayerStateChange,
      onError:onPlayerError
    }
  });
};
if(me) showAppAndBoot();

/* ══ AVATAR GRID ══ */
function buildAvatarGrid(group) {
  const defs = AVATAR_DEFS[group] || AVATAR_DEFS.animals;
  EL.avatarGrid.innerHTML="";
  defs.forEach(def=>{
    const btn=document.createElement("button");
    btn.className="av-btn"+(def.id===selectedAvatarId?" active":"");
    const cnv=document.createElement("canvas");
    drawAvatar(cnv,def.id,4);
    btn.appendChild(cnv);
    btn.title=def.name;
    btn.onclick=()=>{
      selectedAvatarId=def.id;
      drawAvatar(EL.previewCanvas,def.id,4);
      document.querySelectorAll(".av-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
    };
    EL.avatarGrid.appendChild(btn);
  });
}

/* ══ SPARKLES ══ */
function startSparkles(){
  const cnv=$("sparkleCanvas");
  if(!cnv)return;
  const ctx=cnv.getContext("2d");
  const particles=[];
  function resize(){cnv.width=window.innerWidth;cnv.height=window.innerHeight;}
  resize();
  window.addEventListener("resize",resize);
  for(let i=0;i<50;i++) particles.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,s:Math.random()*2+1,v:Math.random()+.3,c:Math.random()>.5?'#6c63ff':'#ff6eb4'});
  function loop(){
    ctx.clearRect(0,0,cnv.width,cnv.height);
    particles.forEach(p=>{
      ctx.fillStyle=p.c;
      ctx.fillRect(p.x|0,p.y|0,p.s|0,p.s|0);
      p.y-=p.v;
      if(p.y<0){p.y=cnv.height;p.x=Math.random()*cnv.width;}
    });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ══ STAGE LOOP ══ */
function startStageLoop(){
  const cnv=EL.stageCanvas;
  let last=0;
  function resize(){
    const stage=document.getElementById("stage");
    if(!stage)return;
    cnv.width=stage.clientWidth||800;
    cnv.height=stage.clientHeight||240;
  }
  resize();
  window.addEventListener("resize",resize);

  function loop(ts){
    stageRafId=requestAnimationFrame(loop);
    if(ts-last<100)return; // ~10fps for pixel feel
    last=ts;
    animFrame=(animFrame+1)%2;
    if(cnv.width>0&&cnv.height>0) drawStage(cnv,isDancing);
    // Animate audience avatars
    document.querySelectorAll(".px-av-canvas[data-uid]").forEach(c=>{
      if(isDancing) drawAvatar(c,c.dataset.avid,4,animFrame);
    });
    // Animate DJ avatar canvases
    document.querySelectorAll(".px-dj-booth-av canvas[data-avid]").forEach(c=>{
      drawAvatar(c,c.dataset.avid,5,animFrame);
    });
  }
  requestAnimationFrame(loop);
}

/* ══ JOIN / BOOT ══ */
function showAppAndBoot(){
  EL.loginScreen.classList.add("hidden");
  EL.app.classList.remove("hidden");
  EL.meLabel.textContent=me.name.toUpperCase();
  bootApp();
}
async function joinRoom(){
  const name=EL.nameInput.value.trim();
  if(!name){showToast("ENTER NAME FIRST");return;}
  me={id:crypto.randomUUID(),name:name.toUpperCase(),avatarId:selectedAvatarId};
  localStorage.setItem("bbl_me",JSON.stringify(me));
  await db.from("members").upsert({id:me.id,name:me.name,avatar_id:me.avatarId,last_seen:new Date().toISOString()});
  userUnlockedAudio=true;
  showAppAndBoot();
  setTimeout(unlockAndPlay,400);
}
async function bootApp(){
  if(!me||booted)return;
  booted=true;
  await ensureRequiredRows();
  await touchOnline();
  await loadAll();
  subscribeRealtime();
  setInterval(touchOnline,HEARTBEAT_MS);
  setInterval(hostLoop,HEARTBEAT_MS);
  setInterval(async()=>{
    await Promise.all([loadHostState(),loadQueue(),loadNowPlaying(),loadReactions(),loadOnline(),loadWaitlist()]);
    await hostOnlyAutoStart();
  },POLL_MS);
  setInterval(loadChat,CHAT_POLL_MS);
  setInterval(updateProgress,500);
  setInterval(forceNextIfStuck,2000);
}
async function ensureRequiredRows(){
  await db.from("now_playing").upsert({id:1},{onConflict:"id"});
  const{data:ch}=await db.from("host_state").select("*").eq("id",1).maybeSingle();
  if(!ch)await db.from("host_state").insert({id:1,host_id:me.id,host_name:me.name,host_avatar_id:me.avatarId,updated_at:new Date().toISOString()});
}
function subscribeRealtime(){
  db.channel("bbl-v12")
    .on("postgres_changes",{event:"*",schema:"public",table:"chat_messages"},loadChat)
    .on("postgres_changes",{event:"*",schema:"public",table:"queue"},async()=>{await loadQueue();await hostOnlyAutoStart();})
    .on("postgres_changes",{event:"*",schema:"public",table:"now_playing"},async()=>{await loadNowPlaying();await loadReactions();})
    .on("postgres_changes",{event:"*",schema:"public",table:"reactions"},loadReactions)
    .on("postgres_changes",{event:"*",schema:"public",table:"members"},loadOnline)
    .on("postgres_changes",{event:"*",schema:"public",table:"host_state"},loadHostState)
    .on("postgres_changes",{event:"*",schema:"public",table:"settings"},loadWaitlist)
    .subscribe(status=>{
      const live=status==="SUBSCRIBED";
      EL.statusDot.classList.toggle("live",live);
      EL.statusText.textContent=live?"LIVE":"CONNECTING";
    });
}
async function loadAll(){
  await Promise.all([loadHostState(),loadChat(),loadQueue(),loadOnline(),loadNowPlaying(),loadReactions(),loadWaitlist()]);
  await hostOnlyAutoStart();
}

/* ══ HEARTBEAT ══ */
async function touchOnline(){
  if(!me)return;
  await db.from("members").upsert({id:me.id,name:me.name,avatar_id:me.avatarId||"fox",last_seen:new Date().toISOString()});
}
async function loadHostState(){
  const{data}=await db.from("host_state").select("*").eq("id",1).maybeSingle();
  hostState=data;
  if(!hostState){isHost=false;return;}
  isHost=hostState.host_id===me?.id;
  const djName=hostState.host_name||"HOST";
  const djAvId=hostState.host_avatar_id||"fox";
  EL.hostBadge.textContent=`DJ: ${djName}`;
  EL.djBoxName.textContent=djName;
  drawAvatar(EL.djCanvas,djAvId,4,animFrame);
  renderStage();
}
async function hostLoop(){
  if(!me)return;
  await loadHostState();
  const expired=!hostState?.updated_at||Date.now()-new Date(hostState.updated_at).getTime()>HOST_TIMEOUT_MS;
  if(isHost){
    await db.from("host_state").update({host_id:me.id,host_name:me.name,host_avatar_id:me.avatarId||"fox",updated_at:new Date().toISOString()}).eq("id",1);
    await hostOnlyAutoStart();return;
  }
  if(expired){
    const{data:first}=await db.from("members").select("*").gte("last_seen",new Date(Date.now()-ONLINE_CUTOFF_MS).toISOString()).order("joined_at",{ascending:true}).limit(1).maybeSingle();
    if(first?.id===me.id){
      await db.from("host_state").update({host_id:me.id,host_name:me.name,host_avatar_id:me.avatarId||"fox",updated_at:new Date().toISOString()}).eq("id",1);
      await loadHostState();
    }
  }
}

/* ══ ONLINE + STAGE ══ */
async function loadOnline(){
  const cutoff=new Date(Date.now()-ONLINE_CUTOFF_MS).toISOString();
  const{data}=await db.from("members").select("*").gte("last_seen",cutoff).order("last_seen",{ascending:false});
  onlineMembers=data||[];
  EL.onlineCount.textContent=String(onlineMembers.length);
  EL.onlineCount2.textContent=String(onlineMembers.length);
  renderStage();
}
function renderStage(){
  const djId=hostState?.host_id;
  const djMember=onlineMembers.find(m=>m.id===djId);
  const audience=onlineMembers.filter(m=>m.id!==djId);

  // DJ Booth
  EL.djBoothWrap.innerHTML="";
  if(djMember){
    const cnv=document.createElement("canvas");
    cnv.dataset.avid=djMember.avatar_id||"fox";
    drawAvatar(cnv,djMember.avatar_id||"fox",5,animFrame);
    EL.djBoothWrap.appendChild(cnv);
    EL.djBoothName.textContent=djMember.name;
    EL.djBoothName.classList.remove("hidden");
    drawAvatar(EL.djCanvas,djMember.avatar_id||"fox",4,animFrame);
    EL.djBoxName.textContent=djMember.name;
  }else{
    EL.djBoothName.classList.add("hidden");
  }

  // Audience
  const existIds=new Set([...EL.audienceWrap.querySelectorAll(".px-av-wrap")].map(el=>el.dataset.uid));
  const newIds=new Set(audience.map(m=>m.id));
  EL.audienceWrap.querySelectorAll(".px-av-wrap").forEach(el=>{if(!newIds.has(el.dataset.uid))el.remove();});
  audience.forEach(member=>{
    if(!existIds.has(member.id)){
      const wrap=document.createElement("div");
      wrap.className="px-av-wrap"+(member.id===me?.id?" me":"");
      wrap.dataset.uid=member.id;
      const cnv=document.createElement("canvas");
      cnv.className="px-av-canvas";
      cnv.dataset.uid=member.id;
      cnv.dataset.avid=member.avatar_id||"fox";
      drawAvatar(cnv,member.avatar_id||"fox",4,animFrame);
      const tag=document.createElement("div");
      tag.className="px-av-tag";
      tag.textContent=member.name;
      wrap.appendChild(cnv);
      wrap.appendChild(tag);
      EL.audienceWrap.appendChild(wrap);
    }
  });
}

function setDancing(on){isDancing=on;}

function triggerAvatarReaction(uid,key){
  const wrap=EL.audienceWrap.querySelector(`[data-uid="${uid}"]`);
  if(!wrap)return;
  const pop=document.createElement("div");
  pop.className="av-react-pop";
  pop.textContent=REACTION_EMOJI[key]||"?";
  wrap.style.position="relative";
  wrap.appendChild(pop);
  setTimeout(()=>pop.remove(),1600);
}

function spawnFloat(key,count=3){
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const el=document.createElement("div");
      el.className="float-emoji";
      el.textContent=REACTION_EMOJI[key]||"?";
      el.style.left=Math.random()*80+10+"%";
      el.style.bottom="200px";
      EL.floatLayer.appendChild(el);
      setTimeout(()=>el.remove(),2900);
    },i*140);
  }
}

/* ══ WAITLIST ══ */
async function loadWaitlist(){
  const{data}=await db.from("settings").select("value").eq("key","waitlist").maybeSingle();
  waitlist=data?.value||[];
  EL.waitlistCount.textContent=String(waitlist.length);
  renderWaitlist();
}
function renderWaitlist(){
  EL.waitlistList.innerHTML="";
  if(waitlist.length===0){
    EL.waitlistList.innerHTML='<div class="px-q-empty">NO DJ QUEUE YET\nPRESS BUTTON BELOW</div>';
  }else{
    waitlist.forEach((w,i)=>{
      const isMe=w.id===me?.id;
      const div=document.createElement("div");
      div.className="px-wl-item"+(isMe?" me":"");
      const cnvWrap=document.createElement("div");
      cnvWrap.className="px-wl-av";
      const cnv=document.createElement("canvas");
      cnv.width=28;cnv.height=32;
      drawAvatar(cnv,w.avatarId||"fox",2,animFrame);
      cnvWrap.appendChild(cnv);
      div.innerHTML=`<div class="px-wl-pos">${i+1}</div>`;
      div.appendChild(cnvWrap);
      div.innerHTML+=`<div class="px-wl-info"><div class="px-wl-name">${escapeHtml(w.name)}${isMe?' <span style="color:var(--px-cyan)">[YOU]</span>':''}</div><div class="px-wl-sub">${i===0?'▶ NEXT DJ':'WAITING #'+(i+1)}</div></div>`;
      EL.waitlistList.appendChild(div);
    });
  }
  const myPos=waitlist.findIndex(w=>w.id===me?.id);
  if(myPos>=0){
    EL.waitlistInfo.classList.remove("hidden");
    EL.waitlistInfo.innerHTML=myPos===0?'<b>YOU ARE NEXT DJ!</b> 🎧':`YOU ARE #${myPos+1} — WAIT ${myPos} MORE`;
    EL.joinWaitlistBtn.textContent="[LEAVE DJ QUEUE]";
    EL.joinWaitlistBtn.classList.add("in");
  }else{
    EL.waitlistInfo.classList.add("hidden");
    EL.joinWaitlistBtn.textContent="+ JOIN DJ QUEUE";
    EL.joinWaitlistBtn.classList.remove("in");
  }
}
async function toggleWaitlist(){
  if(!me)return;
  const myPos=waitlist.findIndex(w=>w.id===me.id);
  const newList=myPos>=0
    ?waitlist.filter(w=>w.id!==me.id)
    :[...waitlist,{id:me.id,name:me.name,avatarId:me.avatarId||"fox",joined_at:new Date().toISOString()}];
  await db.from("settings").upsert({key:"waitlist",value:newList});
  showToast(myPos>=0?"LEFT DJ QUEUE":`JOINED! #${newList.length} IN LINE`,myPos>=0?"":"success");
  await loadWaitlist();
}

/* ══ CHAT ══ */
async function sendChat(){
  const msg=EL.chatInput.value.trim();if(!msg)return;
  await db.from("chat_messages").insert({member_name:me.name,member_emoji:"",message:msg});
  EL.chatInput.value="";await loadChat();
}
async function loadChat(){
  const{data}=await db.from("chat_messages").select("*").order("created_at",{ascending:true}).limit(120);
  const atBottom=EL.chatBox.scrollHeight-EL.chatBox.scrollTop-EL.chatBox.clientHeight<60;
  EL.chatBox.innerHTML="";
  (data||[]).forEach(row=>{
    const time=new Date(row.created_at).toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"});
    const div=document.createElement("div");div.className="px-msg";
    div.innerHTML=`<div class="px-msg-hd"><span class="px-msg-name">${escapeHtml(row.member_name)}</span><span class="px-msg-time">${time}</span></div><div class="px-msg-txt">${linkify(escapeHtml(row.message))}</div>`;
    EL.chatBox.appendChild(div);
  });
  if(atBottom)EL.chatBox.scrollTop=EL.chatBox.scrollHeight;
}
function sysMsg(text,type="sys"){
  const div=document.createElement("div");div.className=`px-msg ${type}`;div.textContent=text;
  EL.chatBox.appendChild(div);EL.chatBox.scrollTop=EL.chatBox.scrollHeight;
}

/* ══ QUEUE ══ */
async function addSong(){
  const input=EL.youtubeInput.value.trim(),vid=extractYouTubeId(input);
  if(!vid){showToast("INVALID YOUTUBE LINK");return;}
  const{data:ex}=await db.from("queue").select("id").eq("video_id",vid).eq("played",false).limit(1).maybeSingle();
  if(ex){showToast("SONG ALREADY IN QUEUE","error");return;}
  const{count}=await db.from("queue").select("*",{count:"exact",head:true}).eq("member_name",me.name).eq("played",false);
  if((count||0)>=MAX_SONGS_PER_USER){showToast(`MAX ${MAX_SONGS_PER_USER} SONGS PER PLAYER`,"error");return;}
  EL.addSongBtn.disabled=true;EL.addSongBtn.textContent="…";
  const meta=await getYouTubeMeta(vid);
  const{error}=await db.from("queue").insert({member_name:me.name,member_emoji:"",youtube_url:`https://www.youtube.com/watch?v=${vid}`,video_id:vid,title:meta.title,played:false});
  EL.addSongBtn.disabled=false;EL.addSongBtn.textContent="+";
  if(error){showToast("FAILED TO ADD SONG");return;}
  EL.youtubeInput.value="";
  showToast("SONG ADDED ✓","success");
  await loadQueue();await hostOnlyAutoStart();
}
async function loadQueue(){
  const{data}=await db.from("queue").select("*").eq("played",false).order("created_at",{ascending:true});
  EL.queueList.innerHTML="";EL.queueCount.textContent=String((data||[]).length);
  if(!data||data.length===0){EL.queueList.innerHTML='<div class="px-q-empty">QUEUE EMPTY\nPASTE YOUTUBE URL BELOW</div>';return;}
  data.forEach((row,i)=>{
    const div=document.createElement("div");div.className="px-q-item";
    div.innerHTML=`<span class="px-q-num">${i===0?"▶":i+1}</span><img class="px-q-thumb" src="${thumbnail(row.video_id)}" alt="" onerror="this.style.opacity=0"><div class="px-q-info"><div class="px-q-title">${escapeHtml(cleanTitle(row.title,row.video_id))}</div><div class="px-q-by">${escapeHtml(row.member_name)}</div></div>`;
    EL.queueList.appendChild(div);
  });
}

/* ══ NOW PLAYING ══ */
async function loadNowPlaying(){
  const{data}=await db.from("now_playing").select("*").eq("id",1).single();
  nowPlayingCache=data;
  if(!data||!data.video_id){
    EL.nowTitle.textContent="-- NO SONG --";EL.nowBy.textContent="";
    EL.coverImage.style.display="none";
    currentVideoId=null;currentSongAddedBy=null;myVoteThisSong=null;
    updateVoteUI();setDancing(false);return;
  }
  const title=cleanTitle(data.title,data.video_id);
  EL.nowTitle.textContent=title.toUpperCase().slice(0,40);
  EL.nowBy.textContent=data.updated_by?`BY ${data.updated_by}`:"";
  EL.coverImage.src=thumbnail(data.video_id,"max");
  EL.coverImage.style.display="block";
  currentSongAddedBy=data.updated_by||null;
  if(data.video_id!==currentVideoId){
    currentVideoId=data.video_id;endWatchCount=0;lastProgressVid=data.video_id;
    myVoteThisSong=null;updateVoteUI();setDancing(true);
    if(playerReady&&player){
      const startSec=data.started_at?Math.max(0,Math.floor((Date.now()-new Date(data.started_at).getTime())/1000)):0;
      player.loadVideoById({videoId:data.video_id,startSeconds:startSec});
      setTimeout(tryAutoPlay,700);
    }
  }
}

/* ══ REACTIONS + VOTE ══ */
async function react(type){
  const vid=nowPlayingCache?.video_id||"none";if(vid==="none")return;
  await db.from("reactions").insert({video_id:vid,member_name:me.name,reaction:type});
  triggerAvatarReaction(me.id,type);spawnFloat(type,3);addPoints(XP_REACT);
  await loadReactions();
}
async function castVote(type){
  if(myVoteThisSong){showToast("ALREADY VOTED");return;}
  const vid=nowPlayingCache?.video_id||"none";if(vid==="none")return;
  myVoteThisSong=type;updateVoteUI();
  await db.from("reactions").insert({video_id:vid,member_name:me.name,reaction:type});
  spawnFloat(type,6);triggerAvatarReaction(me.id,type);
  sysMsg(type==="woot"?`${me.name} — WOOT! ❤️`:`${me.name} — MEH 💔`);
  await loadReactions();
}
function updateVoteUI(){
  EL.wootBtn.classList.toggle("voted",myVoteThisSong==="woot");
  EL.mehBtn.classList.toggle("voted",myVoteThisSong==="meh");
  EL.svWoot.classList.toggle("voted",myVoteThisSong==="woot");
  EL.svMeh.classList.toggle("voted",myVoteThisSong==="meh");
}
async function loadReactions(){
  const vid=nowPlayingCache?.video_id||"none";
  const{data}=await db.from("reactions").select("*").eq("video_id",vid);
  const rows=data||[];
  const wc=rows.filter(x=>x.reaction==="woot").length;
  const mc=rows.filter(x=>x.reaction==="meh").length;
  EL.likeCount.textContent=rows.filter(x=>x.reaction==="like").length;
  EL.loveCount.textContent=rows.filter(x=>x.reaction==="love").length;
  EL.fireCount.textContent=rows.filter(x=>x.reaction==="fire").length;
  EL.wowCount.textContent=rows.filter(x=>x.reaction==="wow").length;
  EL.wootCount.textContent=wc;EL.mehCount.textContent=mc;
  EL.wootTotal.textContent=wc;EL.mehTotal.textContent=mc;
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
    if(error){showToast("FAILED TO SKIP","error");return;}
    currentVideoId=null;nowPlayingCache=null;endWatchCount=0;lastProgressVid=null;myVoteThisSong=null;
    await Promise.all([loadNowPlaying(),loadQueue(),loadReactions()]);setTimeout(tryAutoPlay,700);
  }catch(e){showToast("FAILED TO SKIP","error");}
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
function onPlayerError(){showToast("SONG UNPLAYABLE - SKIPPING");if(isHost)setTimeout(()=>nextSongRPC("player-error"),900);}
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
    const c=player.getCurrentTime?player.getCurrentTime():0,d=player.getDuration?player.getDuration():0;
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
  try{const r=await fetch(`https://noembed.com/embed?url=${encodeURIComponent("https://www.youtube.com/watch?v="+vid)}`);const d=await r.json();if(d?.title)return{title:d.title.replace(/\s*-\s*YouTube\s*$/i,"").trim();};}catch(e){}
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
