/* ================================================
   BEARXBABE LIVE V11 — Real Plug.dj Art
   ================================================ */
const SUPABASE_URL      = "https://xwfnqxqdlvvykppzlrxj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Zm5xeHFkbHZ2eWtwcHpscnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMTg0NjksImV4cCI6MjA5NTc5NDQ2OX0.Xr46g9TuWFzS3zhVvLAFqyVCqv9Al35W9rGDpXPaIwQ";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── Real Plug.dj assets from michaelderrydesigns.com ── */
const BASE = "https://images.squarespace-cdn.com/content/v1/5fd127257a630c218ebea814/";

const BACKGROUNDS = [
  { name:"Classic",          url: BASE+"1607816226351-HSB4RP1GWD3F4HM4SBEC/Background_Classic.jpg" },
  { name:"Rooftop NYC",      url: BASE+"1607816229099-ZU8X0BA9A6N6P2K8IVY0/Background_NYC.jpg" },
  { name:"Beach Party",      url: BASE+"1607816225916-303ITWY6W2YRX8HXDXUZ/Background_BeachParty.jpg" },
  { name:"Fantasy Island",   url: BASE+"1607816227309-9QH7RQYKSEOW67YSIFP2/Background_Island_05.jpg" },
  { name:"Under the Sea",    url: BASE+"1607816230297-4C4VWF9KYSXVX4RLNLQZ/Background_UnderTheSea_01.jpg" },
  { name:"Winter Land",      url: BASE+"1607816231313-050A9MS4H2F6R9PNRQ9S/Background_WinterWonderland.jpg" },
  { name:"Lounge",           url: BASE+"1607816227785-6U5HZ4M9PI7GYQ1V5ZLJ/Background_Lounge.jpg" },
  { name:"Rock",             url: BASE+"1607816229583-NIL09WDB1FI2JLGIXQYB/Background_SlashRoom.jpg" },
  { name:"Halloween",        url: BASE+"1607816227524-1G79EIFEBT3W825Q1SJ8/Background_Halloween2014.jpg" },
  { name:"Diner",            url: BASE+"1607816226407-UV1HB80SF1K01ET0TP04/background_diner.jpg" },
  { name:"Minecraft",        url: BASE+"1607816229346-ZX45WSB8OLG1DX9SGYSO/Background_Minecraft_00.jpg" },
  { name:"Winter 2014",      url: BASE+"1607816230734-CLI7J1RMO7SZ62LGW980/Background_Winter2014.jpg" },
];

const AVATARS = [
  { name:"Island Pirates",   url: BASE+"1607815003626-EST3DETN45SAPNASURHB/FI.gif" },
  { name:"Under the Sea",    url: BASE+"1607815088783-6RS466LQ339KQSA63MID/UndertheSea.gif" },
  { name:"Beach Party",      url: BASE+"1607815109443-055O1OKSHSUUDFVY00K6/Beach.gif" },
  { name:"Diner",            url: BASE+"1607815128177-Y29M4SBG2MO2D1ZICOM9/Diner.gif" },
  { name:"Warriors",         url: BASE+"1607815176151-EPPQR5JZ9368N0CLSA2O/Warriors.gif" },
  { name:"NYC Hipster",      url: BASE+"1607815199461-RTG8Z6UF3KKFHIQSL66K/NYC_1.gif" },
  { name:"Classic",          url: BASE+"1607815243195-88OU3FVPRS7ANJ6Q15C6/Classic.gif" },
  { name:"Dragon",           url: BASE+"1607815260778-UCHO0YEP4JOGFOVI16Z1/Dragon.gif" },
];

/* ── Constants ── */
const HOST_TIMEOUT_MS    = 16000;
const HEARTBEAT_MS       = 6000;
const POLL_MS            = 2400;
const CHAT_POLL_MS       = 4500;
const MAX_SONGS_PER_USER = 3;
const ONLINE_CUTOFF_MS   = 45000;
const XP_SONG_PLAYED     = 50;
const XP_REACT           = 2;

const REACTION_EMOJI = { like:"👍", love:"❤️", fire:"🔥", wow:"😮", woot:"❤️", meh:"💔" };

/* ── State ── */
let me              = JSON.parse(localStorage.getItem("bbl_me") || "null");
let myPoints        = parseInt(localStorage.getItem("bbl_pts") || "0");
let selectedAvatar  = me?.avatarUrl || AVATARS[0].url;
let currentBg       = localStorage.getItem("bbl_bg") || BACKGROUNDS[0].url;
let player          = null, playerReady = false;
let currentVideoId  = null, nowPlayingCache = null;
let hostState       = null, isHost = false, booted = false;
let changingSong    = false, userUnlockedAudio = false;
let endWatchCount   = 0, nextRpcCooldown = false, lastProgressVid = null;
let onlineMembers   = [];
let waitlist        = [];
let myVoteThisSong  = null;
let currentSongAddedBy = null;

const $ = id => document.getElementById(id);
const EL = {
  toast:$("toast"), floatLayer:$("floatLayer"),
  loginScreen:$("loginScreen"), app:$("app"),
  nameInput:$("nameInput"), avatarPicker:$("avatarPicker"),
  previewGif:$("previewGif"), previewName:$("previewName"),
  joinBtn:$("joinBtn"),
  hostBadge:$("hostBadge"), meLabel:$("meLabel"),
  myXP:$("myXP"), wootTotal:$("wootTotal"), mehTotal:$("mehTotal"),
  statusDot:$("statusDot"), statusText:$("statusText"),
  nowTitle:$("nowTitle"), nowBy:$("nowBy"), coverImage:$("coverImage"),
  likeCount:$("likeCount"), loveCount:$("loveCount"),
  fireCount:$("fireCount"), wowCount:$("wowCount"),
  wootCount:$("wootCount"), mehCount:$("mehCount"),
  wootBtn:$("wootBtn"), mehBtn:$("mehBtn"),
  svWoot:$("svWoot"), svMeh:$("svMeh"),
  currentTimeText:$("currentTimeText"), durationText:$("durationText"),
  progressBar:$("progressBar"), progressDot:$("progressDot"),
  clickToStart:$("clickToStart"),
  stageBg:$("stageBg"),
  djBoothAvatar:$("djBoothAvatar"), djBoothLabel:$("djBoothLabel"),
  djAvatarImg:$("djAvatarImg"), djCardName:$("djCardName"),
  audienceWrap:$("audienceWrap"),
  onlineCount:$("onlineCount"),
  queueList:$("queueList"), queueCount:$("queueCount"),
  waitlistList:$("waitlistList"), waitlistCount:$("waitlistCount"),
  waitlistInfo:$("waitlistInfo"), joinWaitlistBtn:$("joinWaitlistBtn"),
  chatBox:$("chatBox"), chatInput:$("chatInput"), sendChatBtn:$("sendChatBtn"),
  tabQueue:$("tabQueue"), tabWaitlist:$("tabWaitlist"),
  bgPickerBtn:$("bgPickerBtn"), bgPickerPanel:$("bgPickerPanel"), bgPickerGrid:$("bgPickerGrid"),
};

/* ══ BUILD AVATAR PICKER (login) ══ */
function buildAvatarPicker() {
  EL.avatarPicker.innerHTML = "";
  AVATARS.forEach((av, i) => {
    const btn = document.createElement("button");
    btn.className = "av-pick-btn" + (av.url === selectedAvatar ? " active" : "");
    btn.innerHTML = `<img src="${av.url}" alt="${av.name}" loading="lazy"/><span>${av.name}</span>`;
    btn.onclick = () => {
      selectedAvatar = av.url;
      EL.previewGif.src = av.url;
      document.querySelectorAll(".av-pick-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    EL.avatarPicker.appendChild(btn);
  });
  EL.previewGif.src = selectedAvatar;
}

/* ══ BUILD BG PICKER ══ */
function buildBgPicker() {
  EL.bgPickerGrid.innerHTML = "";
  BACKGROUNDS.forEach(bg => {
    const btn = document.createElement("button");
    btn.className = "bg-thumb-btn" + (bg.url === currentBg ? " active" : "");
    btn.innerHTML = `<img src="${bg.url}" alt="${bg.name}" loading="lazy"/><span>${bg.name}</span>`;
    btn.onclick = () => {
      currentBg = bg.url;
      localStorage.setItem("bbl_bg", bg.url);
      EL.stageBg.src = bg.url;
      document.querySelectorAll(".bg-thumb-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      EL.bgPickerPanel.classList.add("hidden");
    };
    EL.bgPickerGrid.appendChild(btn);
  });
}

buildAvatarPicker();
buildBgPicker();
EL.stageBg.src = currentBg;

/* BG picker toggle */
EL.bgPickerBtn.onclick = (e) => {
  e.stopPropagation();
  EL.bgPickerPanel.classList.toggle("hidden");
};
document.addEventListener("click", () => EL.bgPickerPanel.classList.add("hidden"));
EL.bgPickerPanel.addEventListener("click", e => e.stopPropagation());

/* ══ TABS / EVENTS ══ */
document.querySelectorAll(".ptab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".ptab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    EL.tabQueue.classList.toggle("active", tab.dataset.tab === "queue");
    EL.tabWaitlist.classList.toggle("active", tab.dataset.tab === "waitlist");
  };
});
EL.joinBtn.onclick         = joinRoom;
EL.sendChatBtn.onclick     = sendChat;
EL.addSongBtn.onclick      = addSong;
EL.clickToStart.onclick    = unlockAndPlay;
EL.joinWaitlistBtn.onclick = toggleWaitlist;
EL.wootBtn.onclick = EL.svWoot.onclick = () => castVote("woot");
EL.mehBtn.onclick  = EL.svMeh.onclick  = () => castVote("meh");
document.querySelectorAll(".react-btn[data-reaction]").forEach(btn => {
  btn.onclick = () => react(btn.dataset.reaction);
});
EL.chatInput.addEventListener("keydown", e => { if (e.key==="Enter") sendChat(); });
EL.youtubeInput.addEventListener("keydown", e => { if (e.key==="Enter") addSong(); });
EL.nameInput.addEventListener("input", () => { EL.previewName.textContent = EL.nameInput.value.trim() || "คุณ"; });
if (me) { EL.previewName.textContent = me.name; EL.previewGif.src = me.avatarUrl || AVATARS[0].url; }
updatePointsUI();

window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("player", {
    videoId: "",
    playerVars: { autoplay:1, controls:0, disablekb:1, fs:0, rel:0, modestbranding:1, iv_load_policy:3, playsinline:1 },
    events: {
      onReady: async () => {
        playerReady = true;
        if (me) { showAppAndBoot(); await loadNowPlaying(); setTimeout(tryAutoPlay, 600); }
      },
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
};
if (me) showAppAndBoot();

/* ══ JOIN / BOOT ══ */
function showAppAndBoot() {
  EL.loginScreen.classList.add("hidden");
  EL.app.classList.remove("hidden");
  EL.meLabel.textContent = me.name;
  bootApp();
}
async function joinRoom() {
  const name = EL.nameInput.value.trim();
  if (!name) { showToast("กรุณาใส่ชื่อก่อน"); return; }
  me = { id: crypto.randomUUID(), name, avatarUrl: selectedAvatar };
  localStorage.setItem("bbl_me", JSON.stringify(me));
  await db.from("members").upsert({ id:me.id, name:me.name, avatar_url:me.avatarUrl, last_seen:new Date().toISOString() });
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
    await Promise.all([loadHostState(), loadQueue(), loadNowPlaying(), loadReactions(), loadOnline(), loadWaitlist()]);
    await hostOnlyAutoStart();
  }, POLL_MS);
  setInterval(loadChat, CHAT_POLL_MS);
  setInterval(updateProgress, 500);
  setInterval(forceNextIfStuck, 2000);
}
async function ensureRequiredRows() {
  await db.from("now_playing").upsert({ id:1 }, { onConflict:"id" });
  const { data:ch } = await db.from("host_state").select("*").eq("id",1).maybeSingle();
  if (!ch) await db.from("host_state").insert({ id:1, host_id:me.id, host_name:me.name, host_avatar:me.avatarUrl, updated_at:new Date().toISOString() });
}
function subscribeRealtime() {
  db.channel("bbl-v11")
    .on("postgres_changes",{event:"*",schema:"public",table:"chat_messages"},loadChat)
    .on("postgres_changes",{event:"*",schema:"public",table:"queue"},async()=>{ await loadQueue(); await hostOnlyAutoStart(); })
    .on("postgres_changes",{event:"*",schema:"public",table:"now_playing"},async()=>{ await loadNowPlaying(); await loadReactions(); })
    .on("postgres_changes",{event:"*",schema:"public",table:"reactions"},loadReactions)
    .on("postgres_changes",{event:"*",schema:"public",table:"members"},loadOnline)
    .on("postgres_changes",{event:"*",schema:"public",table:"host_state"},loadHostState)
    .on("postgres_changes",{event:"*",schema:"public",table:"settings"},loadWaitlist)
    .subscribe(status => {
      const live = status==="SUBSCRIBED";
      EL.statusDot.classList.toggle("live", live);
      EL.statusText.textContent = live ? "🟢 Live" : "เชื่อมต่อ...";
    });
}
async function loadAll() {
  await Promise.all([loadHostState(), loadChat(), loadQueue(), loadOnline(), loadNowPlaying(), loadReactions(), loadWaitlist()]);
  await hostOnlyAutoStart();
}

/* ══ HEARTBEAT / HOST ══ */
async function touchOnline() {
  if (!me) return;
  await db.from("members").upsert({ id:me.id, name:me.name, avatar_url:me.avatarUrl||AVATARS[0].url, last_seen:new Date().toISOString() });
}
async function loadHostState() {
  const { data } = await db.from("host_state").select("*").eq("id",1).maybeSingle();
  hostState = data;
  if (!hostState) { isHost=false; return; }
  isHost = hostState.host_id === me?.id;
  const djName = hostState.host_name || "Host";
  const djAv   = hostState.host_avatar || AVATARS[0].url;
  EL.hostBadge.textContent = isHost ? `${djName} (คุณ)` : djName;
  EL.djAvatarImg.src  = djAv;
  EL.djCardName.textContent = djName;
  renderStage();
}
async function hostLoop() {
  if (!me) return;
  await loadHostState();
  const expired = !hostState?.updated_at || Date.now()-new Date(hostState.updated_at).getTime() > HOST_TIMEOUT_MS;
  if (isHost) {
    await db.from("host_state").update({ host_id:me.id, host_name:me.name, host_avatar:me.avatarUrl||AVATARS[0].url, updated_at:new Date().toISOString() }).eq("id",1);
    await hostOnlyAutoStart();
    return;
  }
  if (expired) {
    const { data:first } = await db.from("members").select("*")
      .gte("last_seen",new Date(Date.now()-ONLINE_CUTOFF_MS).toISOString())
      .order("joined_at",{ascending:true}).limit(1).maybeSingle();
    if (first?.id===me.id) {
      await db.from("host_state").update({ host_id:me.id, host_name:me.name, host_avatar:me.avatarUrl||AVATARS[0].url, updated_at:new Date().toISOString() }).eq("id",1);
      await loadHostState();
    }
  }
}

/* ══ ONLINE + STAGE ══ */
async function loadOnline() {
  const cutoff = new Date(Date.now()-ONLINE_CUTOFF_MS).toISOString();
  const { data } = await db.from("members").select("*").gte("last_seen",cutoff).order("last_seen",{ascending:false});
  onlineMembers = data||[];
  EL.onlineCount.textContent = String(onlineMembers.length);
  renderStage();
}

function renderStage() {
  const djId     = hostState?.host_id;
  const djMember = onlineMembers.find(m => m.id===djId);
  const audience = onlineMembers.filter(m => m.id!==djId);

  /* DJ Booth */
  EL.djBoothAvatar.innerHTML = "";
  if (djMember) {
    const img = document.createElement("img");
    img.src = djMember.avatar_url || AVATARS[0].url;
    img.alt = djMember.name;
    img.className = "";
    img.style.cssText = "width:80px;height:80px;object-fit:contain;filter:drop-shadow(0 0 16px rgba(108,99,255,.7))";
    EL.djBoothAvatar.appendChild(img);
    EL.djBoothLabel.textContent = djMember.name;
    EL.djBoothLabel.classList.remove("hidden");
    // Update side card
    EL.djAvatarImg.src = djMember.avatar_url || AVATARS[0].url;
    EL.djCardName.textContent = djMember.name;
  } else {
    EL.djBoothLabel.classList.add("hidden");
  }

  /* Audience */
  const existIds = new Set([...EL.audienceWrap.querySelectorAll(".av-sprite-wrap")].map(el=>el.dataset.uid));
  const newIds   = new Set(audience.map(m=>m.id));
  EL.audienceWrap.querySelectorAll(".av-sprite-wrap").forEach(el => { if (!newIds.has(el.dataset.uid)) el.remove(); });
  audience.forEach(member => {
    if (!existIds.has(member.id)) {
      const wrap = document.createElement("div");
      wrap.className = "av-sprite-wrap" + (member.id===me?.id?" me":"");
      wrap.dataset.uid = member.id;
      const img = document.createElement("img");
      img.src = member.avatar_url || AVATARS[0].url;
      img.alt = member.name;
      img.className = "av-gif";
      const tag = document.createElement("div");
      tag.className = "av-tag";
      tag.textContent = member.name;
      wrap.appendChild(img);
      wrap.appendChild(tag);
      EL.audienceWrap.appendChild(wrap);
    }
  });
}

function triggerAvatarReaction(uid, reactionKey) {
  let wrap = EL.audienceWrap.querySelector(`[data-uid="${uid}"]`);
  if (!wrap) return;
  const pop = document.createElement("div");
  pop.className = "av-react-pop";
  pop.textContent = REACTION_EMOJI[reactionKey]||"❓";
  wrap.style.position = "relative";
  wrap.appendChild(pop);
  setTimeout(()=>pop.remove(), 1700);
}

function spawnFloat(key, count=3) {
  for (let i=0;i<count;i++) {
    setTimeout(()=>{
      const el = document.createElement("div");
      el.className = "float-emoji";
      el.textContent = REACTION_EMOJI[key]||"❓";
      el.style.left = Math.random()*80+10+"%";
      el.style.bottom = "200px";
      EL.floatLayer.appendChild(el);
      setTimeout(()=>el.remove(), 2800);
    }, i*130);
  }
}

/* ══ WAITLIST ══ */
async function loadWaitlist() {
  const { data } = await db.from("settings").select("value").eq("key","waitlist").maybeSingle();
  waitlist = data?.value || [];
  EL.waitlistCount.textContent = String(waitlist.length);
  renderWaitlist();
}
function renderWaitlist() {
  EL.waitlistList.innerHTML = "";
  if (waitlist.length===0) {
    EL.waitlistList.innerHTML = '<div class="q-empty">ยังไม่มีใครรอเป็น DJ</div>';
  } else {
    waitlist.forEach((w,i)=>{
      const isMe = w.id===me?.id;
      const div = document.createElement("div");
      div.className = "wl-item"+(isMe?" me":"");
      div.innerHTML = `<div class="wl-pos">${i+1}</div><img class="wl-av" src="${escapeHtml(w.avatarUrl||AVATARS[0].url)}" alt=""/><div class="wl-info"><div class="wl-name">${escapeHtml(w.name)}${isMe?' <span style="color:var(--accent)">(คุณ)</span>':''}</div><div class="wl-sub">${i===0?'🎧 DJ คนต่อไป':'รอลำดับที่ '+(i+1)}</div></div>`;
      EL.waitlistList.appendChild(div);
    });
  }
  const myPos = waitlist.findIndex(w=>w.id===me?.id);
  if (myPos>=0) {
    EL.waitlistInfo.classList.remove("hidden");
    EL.waitlistInfo.innerHTML = myPos===0 ? '<b>คุณคือ DJ คนต่อไป!</b> 🎧' : `คุณอยู่ลำดับที่ <b>${myPos+1}</b> รออีก <b>${myPos}</b> คน`;
    EL.joinWaitlistBtn.textContent = "🚪 ออกจากคิว DJ";
    EL.joinWaitlistBtn.classList.add("in");
  } else {
    EL.waitlistInfo.classList.add("hidden");
    EL.joinWaitlistBtn.textContent = "+ เข้าคิว DJ";
    EL.joinWaitlistBtn.classList.remove("in");
  }
}
async function toggleWaitlist() {
  if (!me) return;
  const myPos = waitlist.findIndex(w=>w.id===me.id);
  const newList = myPos>=0
    ? waitlist.filter(w=>w.id!==me.id)
    : [...waitlist, {id:me.id, name:me.name, avatarUrl:me.avatarUrl||AVATARS[0].url, joined_at:new Date().toISOString()}];
  await db.from("settings").upsert({key:"waitlist", value:newList});
  showToast(myPos>=0 ? "ออกจากคิวแล้ว" : `เข้าคิวแล้ว! ลำดับที่ ${newList.length} 🎧`, myPos>=0?"":"success");
  await loadWaitlist();
}

/* ══ CHAT ══ */
async function sendChat() {
  const msg = EL.chatInput.value.trim();
  if (!msg) return;
  await db.from("chat_messages").insert({ member_name:me.name, member_emoji:"", message:msg });
  EL.chatInput.value = "";
  await loadChat();
}
async function loadChat() {
  const { data } = await db.from("chat_messages").select("*").order("created_at",{ascending:true}).limit(120);
  const atBottom = EL.chatBox.scrollHeight-EL.chatBox.scrollTop-EL.chatBox.clientHeight < 60;
  EL.chatBox.innerHTML = "";
  (data||[]).forEach(row=>{
    const time = new Date(row.created_at).toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"});
    const div = document.createElement("div");
    div.className = "msg";
    div.innerHTML = `<div class="msg-hd"><span class="msg-name">${escapeHtml(row.member_name)}</span><span class="msg-time">${time}</span></div><div class="msg-txt">${linkify(escapeHtml(row.message))}</div>`;
    EL.chatBox.appendChild(div);
  });
  if (atBottom) EL.chatBox.scrollTop = EL.chatBox.scrollHeight;
}
function sysMsg(text, type="sys") {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.textContent = text;
  EL.chatBox.appendChild(div);
  EL.chatBox.scrollTop = EL.chatBox.scrollHeight;
}

/* ══ QUEUE ══ */
async function addSong() {
  const input = EL.youtubeInput.value.trim();
  const vid   = extractYouTubeId(input);
  if (!vid) { showToast("ลิงก์ YouTube ไม่ถูกต้อง"); return; }
  const { data:ex } = await db.from("queue").select("id").eq("video_id",vid).eq("played",false).limit(1).maybeSingle();
  if (ex) { showToast("เพลงนี้อยู่ในคิวแล้ว","error"); return; }
  const { count } = await db.from("queue").select("*",{count:"exact",head:true}).eq("member_name",me.name).eq("played",false);
  if ((count||0)>=MAX_SONGS_PER_USER) { showToast(`จำกัดคนละ ${MAX_SONGS_PER_USER} เพลง`,"error"); return; }
  EL.addSongBtn.disabled=true; EL.addSongBtn.textContent="…";
  const meta = await getYouTubeMeta(vid);
  const { error } = await db.from("queue").insert({ member_name:me.name, member_emoji:"", youtube_url:`https://www.youtube.com/watch?v=${vid}`, video_id:vid, title:meta.title, played:false });
  EL.addSongBtn.disabled=false; EL.addSongBtn.textContent="+";
  if (error) { showToast("เพิ่มเพลงไม่สำเร็จ"); return; }
  EL.youtubeInput.value = "";
  showToast(`เพิ่ม "${meta.title.slice(0,28)}..." ✅`,"success");
  await loadQueue();
  await hostOnlyAutoStart();
}
async function loadQueue() {
  const { data } = await db.from("queue").select("*").eq("played",false).order("created_at",{ascending:true});
  EL.queueList.innerHTML = "";
  EL.queueCount.textContent = String((data||[]).length);
  if (!data||data.length===0) { EL.queueList.innerHTML='<div class="q-empty">ยังไม่มีเพลง<br>วาง YouTube URL แล้วกด +</div>'; return; }
  data.forEach((row,i)=>{
    const div = document.createElement("div");
    div.className = "q-item";
    div.innerHTML = `<span class="q-num">${i===0?"▶":i+1}</span><img class="q-thumb" src="${thumbnail(row.video_id)}" alt="" onerror="this.style.opacity=0"><div class="q-info"><div class="q-title">${escapeHtml(cleanTitle(row.title,row.video_id))}</div><div class="q-by">${escapeHtml(row.member_name)}</div></div>`;
    EL.queueList.appendChild(div);
  });
}

/* ══ NOW PLAYING ══ */
async function loadNowPlaying() {
  const { data } = await db.from("now_playing").select("*").eq("id",1).single();
  nowPlayingCache = data;
  if (!data||!data.video_id) {
    EL.nowTitle.textContent="ยังไม่มีเพลง"; EL.nowBy.textContent="";
    EL.coverImage.style.display="none";
    currentVideoId=null; currentSongAddedBy=null; myVoteThisSong=null;
    updateVoteUI(); return;
  }
  const title = cleanTitle(data.title, data.video_id);
  EL.nowTitle.textContent = title;
  EL.nowBy.textContent = data.updated_by ? `เพิ่มโดย ${data.updated_by}` : "";
  EL.coverImage.src = thumbnail(data.video_id,"max");
  EL.coverImage.style.display = "block";
  currentSongAddedBy = data.updated_by||null;
  if (data.video_id!==currentVideoId) {
    currentVideoId=data.video_id; endWatchCount=0; lastProgressVid=data.video_id;
    myVoteThisSong=null; updateVoteUI();
    if (playerReady&&player) {
      const startSec = data.started_at ? Math.max(0,Math.floor((Date.now()-new Date(data.started_at).getTime())/1000)) : 0;
      player.loadVideoById({ videoId:data.video_id, startSeconds:startSec });
      setTimeout(tryAutoPlay, 700);
    }
  }
}

/* ══ REACTIONS + VOTE ══ */
async function react(type) {
  const vid = nowPlayingCache?.video_id||"none";
  if (vid==="none") return;
  await db.from("reactions").insert({ video_id:vid, member_name:me.name, reaction:type });
  triggerAvatarReaction(me.id, type);
  spawnFloat(type, 3);
  addPoints(XP_REACT);
  await loadReactions();
}
async function castVote(type) {
  if (myVoteThisSong) { showToast("คุณโหวตไปแล้ว"); return; }
  const vid = nowPlayingCache?.video_id||"none";
  if (vid==="none") return;
  myVoteThisSong = type;
  updateVoteUI();
  await db.from("reactions").insert({ video_id:vid, member_name:me.name, reaction:type });
  spawnFloat(type, 6);
  triggerAvatarReaction(me.id, type);
  sysMsg(type==="woot" ? `${me.name} Woot! ❤️` : `${me.name} Meh 💔`);
  await loadReactions();
}
function updateVoteUI() {
  EL.wootBtn.classList.toggle("voted", myVoteThisSong==="woot");
  EL.mehBtn.classList.toggle("voted",  myVoteThisSong==="meh");
  EL.svWoot.classList.toggle("voted",  myVoteThisSong==="woot");
  EL.svMeh.classList.toggle("voted",   myVoteThisSong==="meh");
}
async function loadReactions() {
  const vid = nowPlayingCache?.video_id||"none";
  const { data } = await db.from("reactions").select("*").eq("video_id",vid);
  const rows = data||[];
  const wc = rows.filter(x=>x.reaction==="woot").length;
  const mc = rows.filter(x=>x.reaction==="meh").length;
  EL.likeCount.textContent = rows.filter(x=>x.reaction==="like").length;
  EL.loveCount.textContent = rows.filter(x=>x.reaction==="love").length;
  EL.fireCount.textContent = rows.filter(x=>x.reaction==="fire").length;
  EL.wowCount.textContent  = rows.filter(x=>x.reaction==="wow").length;
  EL.wootCount.textContent = wc;
  EL.mehCount.textContent  = mc;
  EL.wootTotal.textContent = wc;
  EL.mehTotal.textContent  = mc;
}

/* ══ POINTS ══ */
function addPoints(xp) { myPoints+=xp; localStorage.setItem("bbl_pts",String(myPoints)); updatePointsUI(); }
function updatePointsUI() { EL.myXP.textContent = myPoints; }

/* ══ HOST ══ */
async function nextSongRPC(reason="auto") {
  if (!isHost||changingSong||nextRpcCooldown) return;
  changingSong=nextRpcCooldown=true;
  try {
    if (currentSongAddedBy===me?.name) { addPoints(XP_SONG_PLAYED); sysMsg(`🏆 +${XP_SONG_PLAYED} XP — เพลงคุณเพิ่งจบ!`,"xp"); }
    const { error } = await db.rpc("admin_next_song");
    if (error) { showToast("เปลี่ยนเพลงไม่สำเร็จ","error"); return; }
    currentVideoId=null; nowPlayingCache=null; endWatchCount=0; lastProgressVid=null; myVoteThisSong=null;
    await Promise.all([loadNowPlaying(), loadQueue(), loadReactions()]);
    setTimeout(tryAutoPlay, 700);
  } catch(e){ showToast("เปลี่ยนเพลงไม่สำเร็จ","error"); }
  finally { changingSong=false; setTimeout(()=>{nextRpcCooldown=false;},2200); }
}
async function hostOnlyAutoStart() {
  if (!isHost||changingSong||nextRpcCooldown) return;
  const { data } = await db.from("now_playing").select("*").eq("id",1).single();
  if (data&&data.video_id) return;
  await nextSongRPC("empty");
}

/* ══ PLAYER ══ */
async function onPlayerStateChange(event) {
  if (event.data===YT.PlayerState.ENDED&&isHost) { endWatchCount=0; await nextSongRPC("ended"); }
  if (event.data===YT.PlayerState.PLAYING) EL.clickToStart.classList.add("hidden");
  if (isHost&&(event.data===YT.PlayerState.PAUSED||event.data===YT.PlayerState.CUED)) {
    setTimeout(async()=>{ try { const c=player.getCurrentTime(),d=player.getDuration(); if(d>8&&c>0&&d-c<=3) await nextSongRPC("paused-near-end"); }catch(e){} },900);
  }
}
function onPlayerError() {
  showToast("เพลงนี้เล่นไม่ได้ กำลังข้าม...");
  if (isHost) setTimeout(()=>nextSongRPC("player-error"),900);
}
function tryAutoPlay() {
  if (!playerReady||!player) return;
  if (!currentVideoId) { loadNowPlaying(); return; }
  try {
    player.mute(); player.playVideo();
    setTimeout(()=>{
      try {
        if (userUnlockedAudio) { player.unMute(); player.setVolume(100); player.playVideo(); EL.clickToStart.classList.add("hidden"); }
        else EL.clickToStart.classList.remove("hidden");
      } catch(e){ EL.clickToStart.classList.remove("hidden"); }
    },800);
  } catch(e){ EL.clickToStart.classList.remove("hidden"); }
}
function unlockAndPlay() {
  userUnlockedAudio=true;
  try { player.unMute(); player.setVolume(100); player.playVideo(); EL.clickToStart.classList.add("hidden"); }
  catch(e){ showToast("กดอีกครั้งเพื่อเปิดเพลง"); }
}
document.addEventListener("click",()=>{ userUnlockedAudio=true; if(currentVideoId) unlockAndPlay(); },{once:true});

/* ══ PROGRESS ══ */
function updateProgress() {
  if (!playerReady||!player||!currentVideoId) { setProgressUI(0,0); return; }
  try {
    const c=player.getCurrentTime?player.getCurrentTime():0, d=player.getDuration?player.getDuration():0;
    setProgressUI(c,d);
    if (lastProgressVid!==currentVideoId) { endWatchCount=0; lastProgressVid=currentVideoId; }
    const nearEnd=d>8&&c>0&&(d-c<=3||c>=d-3);
    if (isHost&&nearEnd&&!changingSong&&!nextRpcCooldown) { if(++endWatchCount>=3){endWatchCount=0;nextSongRPC("progress-near-end");} }
    else if (!nearEnd) endWatchCount=0;
  } catch(e){}
}
async function forceNextIfStuck() {
  if (!isHost||!me||!playerReady||!player||!currentVideoId||changingSong||nextRpcCooldown) return;
  try { const c=player.getCurrentTime(),d=player.getDuration(); if(d>8&&c>0&&d-c<=3) await nextSongRPC("force-stuck"); }catch(e){}
}
function setProgressUI(c,d) {
  const sc=Number(c)||0,sd=Number(d)||0,pct=sd>0?Math.max(0,Math.min(100,(sc/sd)*100)):0;
  EL.currentTimeText.textContent=formatTime(sc);
  EL.durationText.textContent=sd>0?formatTime(sd):"0:00";
  EL.progressBar.style.width=`${pct}%`;
  EL.progressDot.style.left=`${pct}%`;
}

/* ══ UTILS ══ */
function formatTime(s){s=Math.max(0,Math.floor(Number(s)||0));return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`}
function cleanTitle(t,vid){const s=String(t||"").trim();if(!s||s===vid||s.startsWith("YouTube:"))return "กำลังโหลด...";return s;}
async function getYouTubeMeta(vid){
  try{const r=await fetch(`https://noembed.com/embed?url=${encodeURIComponent("https://www.youtube.com/watch?v="+vid)}`);const d=await r.json();if(d?.title)return{title:d.title.replace(/\s*-\s*YouTube\s*$/i,"").trim()}}catch(e){}
  return{title:"ไม่พบชื่อเพลง"};
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
