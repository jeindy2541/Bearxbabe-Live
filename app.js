/* ================================================
   BEARXBABE LIVE V10 — True Plug.dj Clone
   ================================================ */
const SUPABASE_URL      = "https://xwfnqxqdlvvykppzlrxj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Zm5xeHFkbHZ2eWtwcHpscnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMTg0NjksImV4cCI6MjA5NTc5NDQ2OX0.Xr46g9TuWFzS3zhVvLAFqyVCqv9Al35W9rGDpXPaIwQ";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const HOST_TIMEOUT_MS    = 16000;
const HEARTBEAT_MS       = 6000;
const POLL_MS            = 2400;
const CHAT_POLL_MS       = 4500;
const MAX_SONGS_PER_USER = 3;
const ONLINE_CUTOFF_MS   = 45000;
const XP_SONG_PLAYED     = 50;
const XP_REACT           = 2;

const REACTION_EMOJI = { like:"👍", love:"❤️", fire:"🔥", wow:"😮", woot:"❤️", meh:"💔" };

let me               = JSON.parse(localStorage.getItem("bbl_me") || "null");
let myPoints         = parseInt(localStorage.getItem("bbl_pts") || "0");
let selectedEmoji    = me?.emoji || "😎";
let player           = null, playerReady = false;
let currentVideoId   = null, nowPlayingCache = null;
let hostState        = null, isHost = false, booted = false;
let changingSong     = false, userUnlockedAudio = false;
let endWatchCount    = 0, nextRpcCooldown = false, lastProgressVid = null;
let onlineMembers    = [];
let waitlist         = [];
let isDancing        = false;
let myVoteThisSong   = null;
let currentSongAddedBy = null;

const EMOJIS = {
  face:   ["😀","😃","😄","😁","😆","😂","🤣","😊","😇","🙂","🙃","😉","😍","😘","😜","😎","🤩","🥳","😏","😴","🥺","😭","😤","😈","🤡","👻","💀","👽","🤖","😺"],
  music:  ["🎵","🎶","🎧","🎤","🎸","🥁","🎹","🎺","🎷","🪩","📀","💿","📻","🔊","🎼","🎬","🎭","🎪","🎫"],
  animal: ["🐱","🐶","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦉","🐺","🐝","🦋","🐢","🐬","🐳","🦈","🐉"],
  fire:   ["🔥","⚡","💥","🚀","👑","💎","🌟","⭐","✨","🌙","☀️","🌈","🧊","🍀","🎯","🏆","🥇","💜","🩷","❤️","🖤","🤍","💫","🛸","🪐"]
};
const ALL_EMOJIS = [...EMOJIS.face, ...EMOJIS.music, ...EMOJIS.animal, ...EMOJIS.fire];

const $ = id => document.getElementById(id);
const EL = {
  toast:$("toast"), floatLayer:$("floatLayer"),
  loginScreen:$("loginScreen"), app:$("app"),
  nameInput:$("nameInput"), emojiGrid:$("emojiGrid"), joinBtn:$("joinBtn"),
  previewEmoji:$("previewEmoji"), previewName:$("previewName"),
  hostBadge:$("hostBadge"), meLabel:$("meLabel"), myPoints:$("myPoints"),
  statusDot:$("statusDot"), statusText:$("statusText"),
  nowTitle:$("nowTitle"), nowBy:$("nowBy"),
  coverImage:$("coverImage"),
  likeCount:$("likeCount"), loveCount:$("loveCount"),
  fireCount:$("fireCount"), wowCount:$("wowCount"),
  wootCount:$("wootCount"), wootCount2:$("wootCount2"),
  mehCount:$("mehCount"),   mehCount2:$("mehCount2"),
  wootBtn:$("wootBtn"), mehBtn:$("mehBtn"),
  stageWootBtn:$("stageWootBtn"), stageMehBtn:$("stageMehBtn"),
  currentTimeText:$("currentTimeText"), durationText:$("durationText"),
  progressBar:$("progressBar"), progressDot:$("progressDot"),
  clickToStart:$("clickToStart"),
  djFigureWrap:$("djFigureWrap"), djNameTag:$("djNameTag"),
  djMiniAvatar:$("djMiniAvatar"), djMiniName:$("djMiniName"),
  audienceRow:$("audienceRow"),
  onlineCount:$("onlineCount"),
  queueList:$("queueList"), queueCount:$("queueCount"),
  waitlistList:$("waitlistList"), waitlistCount:$("waitlistCount"),
  waitlistInfo:$("waitlistInfo"), joinWaitlistBtn:$("joinWaitlistBtn"),
  chatBox:$("chatBox"), chatInput:$("chatInput"), sendChatBtn:$("sendChatBtn"),
  tabQueue:$("tabQueue"), tabWaitlist:$("tabWaitlist"),
};

/* ══ INIT ══ */
renderEmojiGrid("all");
document.querySelectorAll(".etab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".etab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderEmojiGrid(tab.dataset.group);
  };
});
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
EL.wootBtn.onclick         = () => castVote("woot");
EL.mehBtn.onclick          = () => castVote("meh");
EL.stageWootBtn.onclick    = () => castVote("woot");
EL.stageMehBtn.onclick     = () => castVote("meh");

document.querySelectorAll(".react-btn[data-reaction]").forEach(btn => {
  btn.onclick = () => react(btn.dataset.reaction);
});

EL.chatInput.addEventListener("keydown", e => { if (e.key==="Enter") sendChat(); });
EL.youtubeInput.addEventListener("keydown", e => { if (e.key==="Enter") addSong(); });
EL.nameInput.addEventListener("input", () => { EL.previewName.textContent = EL.nameInput.value.trim() || "คุณ"; });

if (me) { EL.previewEmoji.textContent = me.emoji; EL.previewName.textContent = me.name; }
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

/* ══ EMOJI GRID ══ */
function renderEmojiGrid(group) {
  const list = group==="all" ? ALL_EMOJIS : EMOJIS[group];
  EL.emojiGrid.innerHTML = "";
  list.forEach(icon => {
    const btn = document.createElement("button");
    btn.className = "egrid-btn" + (icon===selectedEmoji?" active":"");
    btn.textContent = icon;
    btn.onclick = () => {
      selectedEmoji = icon;
      EL.previewEmoji.textContent = icon;
      document.querySelectorAll(".egrid-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
    };
    EL.emojiGrid.appendChild(btn);
  });
}

/* ══ JOIN / BOOT ══ */
function showAppAndBoot() {
  EL.loginScreen.classList.add("hidden");
  EL.app.classList.remove("hidden");
  EL.meLabel.textContent = `${me.emoji} ${me.name}`;
  bootApp();
}
async function joinRoom() {
  const name = EL.nameInput.value.trim();
  if (!name) { showToast("กรุณาใส่ชื่อก่อน"); return; }
  me = { id: crypto.randomUUID(), name, emoji: selectedEmoji };
  localStorage.setItem("bbl_me", JSON.stringify(me));
  await db.from("members").upsert({ id:me.id, name:me.name, emoji:me.emoji, last_seen:new Date().toISOString() });
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
  if (!ch) await db.from("host_state").insert({ id:1, host_id:me.id, host_name:me.name, host_emoji:me.emoji, updated_at:new Date().toISOString() });
}
function subscribeRealtime() {
  db.channel("bbl-v10")
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
  await db.from("members").upsert({ id:me.id, name:me.name, emoji:me.emoji, last_seen:new Date().toISOString() });
}
async function loadHostState() {
  const { data } = await db.from("host_state").select("*").eq("id",1).maybeSingle();
  hostState = data;
  if (!hostState) { isHost=false; return; }
  isHost = hostState.host_id === me?.id;
  // Update topbar
  const djName = isHost ? `${me.emoji} ${me.name} (คุณ)` : `${hostState.host_emoji||"🎧"} ${hostState.host_name||"Host"}`;
  EL.hostBadge.textContent = djName;
  // Update mini DJ panel
  EL.djMiniAvatar.textContent = isHost ? me.emoji : (hostState.host_emoji||"🎧");
  EL.djMiniName.textContent   = isHost ? me.name  : (hostState.host_name||"Host");
  renderStage();
}
async function hostLoop() {
  if (!me) return;
  await loadHostState();
  const expired = !hostState?.updated_at || Date.now()-new Date(hostState.updated_at).getTime() > HOST_TIMEOUT_MS;
  if (isHost) {
    await db.from("host_state").update({ host_id:me.id, host_name:me.name, host_emoji:me.emoji, updated_at:new Date().toISOString() }).eq("id",1);
    await hostOnlyAutoStart();
    return;
  }
  if (expired) {
    const { data:first } = await db.from("members").select("*")
      .gte("last_seen",new Date(Date.now()-ONLINE_CUTOFF_MS).toISOString())
      .order("joined_at",{ascending:true}).limit(1).maybeSingle();
    if (first?.id===me.id) {
      await db.from("host_state").update({ host_id:me.id, host_name:me.name, host_emoji:me.emoji, updated_at:new Date().toISOString() }).eq("id",1);
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

function buildFigure(member, extraClass="") {
  const isMe  = member.id === me?.id;
  const djId  = hostState?.host_id;
  const isDJ  = member.id === djId;

  const fig = document.createElement("div");
  fig.className = "av-figure" + (isDJ?" is-dj":"") + (isMe?" me":"") + (isDancing?" dancing":"") + (extraClass?" "+extraClass:"");
  fig.dataset.uid = member.id;

  // Head
  const head = document.createElement("div");
  head.className = "av-head";
  const emoji = document.createElement("span");
  emoji.className = "av-emoji";
  emoji.textContent = member.emoji;
  head.appendChild(emoji);

  // Body
  const body = document.createElement("div");
  body.className = "av-body";
  const torso = document.createElement("div");
  torso.className = "av-torso";
  const legs = document.createElement("div");
  legs.className = "av-legs-row";
  legs.innerHTML = '<div class="av-leg"></div><div class="av-leg"></div>';
  body.appendChild(torso);
  body.appendChild(legs);

  // Name
  const name = document.createElement("div");
  name.className = "av-nametag";
  name.textContent = member.name;

  fig.appendChild(head);
  fig.appendChild(body);
  fig.appendChild(name);
  return fig;
}

function renderStage() {
  const djId     = hostState?.host_id;
  const djMember = onlineMembers.find(m => m.id===djId);
  const audience = onlineMembers.filter(m => m.id!==djId);

  /* --- DJ Booth --- */
  EL.djFigureWrap.innerHTML = "";
  if (djMember) {
    const fig = buildFigure(djMember, "dj-size");
    fig.classList.add("dancing"); // DJ always dances
    EL.djFigureWrap.appendChild(fig);
    EL.djNameTag.textContent = djMember.name;
    EL.djNameTag.classList.remove("hidden");
  } else {
    EL.djNameTag.classList.add("hidden");
  }

  /* --- Audience --- */
  const existIds = new Set([...EL.audienceRow.querySelectorAll(".av-figure")].map(el=>el.dataset.uid));
  const newIds   = new Set(audience.map(m=>m.id));
  // Remove gone
  EL.audienceRow.querySelectorAll(".av-figure").forEach(el => { if (!newIds.has(el.dataset.uid)) el.remove(); });
  // Add new
  audience.forEach(member => {
    if (!existIds.has(member.id)) {
      EL.audienceRow.appendChild(buildFigure(member));
    } else {
      const el = EL.audienceRow.querySelector(`[data-uid="${member.id}"]`);
      if (el) el.classList.toggle("dancing", isDancing);
    }
  });
}

function setDancing(on) {
  isDancing = on;
  EL.audienceRow.querySelectorAll(".av-figure").forEach(el => el.classList.toggle("dancing", on));
}

function triggerAvatarReaction(uid, reactionKey) {
  let fig = EL.audienceRow.querySelector(`[data-uid="${uid}"]`);
  if (!fig) fig = EL.djFigureWrap.querySelector(`[data-uid="${uid}"]`);
  if (!fig) return;
  fig.classList.remove("bouncing");
  void fig.offsetWidth;
  fig.classList.add("bouncing");
  setTimeout(()=>fig.classList.remove("bouncing"), 550);
  const pop = document.createElement("div");
  pop.className = "av-react-pop";
  pop.textContent = REACTION_EMOJI[reactionKey]||"❓";
  fig.style.position = "relative";
  fig.appendChild(pop);
  setTimeout(()=>pop.remove(), 1700);
}

function showXpPop(uid, xp) {
  let fig = EL.audienceRow.querySelector(`[data-uid="${uid}"]`);
  if (!fig) fig = EL.djFigureWrap.querySelector(`[data-uid="${uid}"]`);
  if (!fig) return;
  const pop = document.createElement("div");
  pop.className = "xp-pop";
  pop.textContent = `+${xp} XP`;
  fig.style.position = "relative";
  fig.appendChild(pop);
  setTimeout(()=>pop.remove(), 2200);
}

function spawnFloat(key, count=3) {
  for (let i=0; i<count; i++) {
    setTimeout(()=>{
      const el = document.createElement("div");
      el.className = "float-emoji";
      el.textContent = REACTION_EMOJI[key]||"❓";
      el.style.left = Math.random()*80+10+"%";
      el.style.bottom = "180px";
      el.style.animationDelay = Math.random()*.3+"s";
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
    EL.waitlistList.innerHTML = '<div class="q-empty">ยังไม่มีใครรอเป็น DJ<br>กดปุ่มด้านล่างเพื่อเข้าคิว</div>';
  } else {
    waitlist.forEach((w,i)=>{
      const isMe = w.id===me?.id;
      const div = document.createElement("div");
      div.className = "wl-item"+(isMe?" me":"");
      div.innerHTML = `<div class="wl-pos">${i+1}</div><div class="wl-emoji">${escapeHtml(w.emoji)}</div><div class="wl-info"><div class="wl-name">${escapeHtml(w.name)}${isMe?' <span style="color:var(--accent)">(คุณ)</span>':''}</div><div class="wl-sub">${i===0?'🎧 DJ คนต่อไป':`รอลำดับที่ ${i+1}`}</div></div>`;
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
    : [...waitlist, {id:me.id, name:me.name, emoji:me.emoji, joined_at:new Date().toISOString()}];
  await db.from("settings").upsert({key:"waitlist", value:newList});
  showToast(myPos>=0 ? "ออกจากคิวแล้ว" : `เข้าคิวแล้ว ลำดับที่ ${newList.length} 🎧`, myPos>=0?"":"success");
  await loadWaitlist();
}

/* ══ CHAT ══ */
async function sendChat() {
  const msg = EL.chatInput.value.trim();
  if (!msg) return;
  await db.from("chat_messages").insert({ member_name:me.name, member_emoji:me.emoji, message:msg });
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
    div.innerHTML = `<div class="msg-hd"><span class="msg-name">${escapeHtml(row.member_emoji)} ${escapeHtml(row.member_name)}</span><span class="msg-time">${time}</span></div><div class="msg-txt">${linkify(escapeHtml(row.message))}</div>`;
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
  const { error } = await db.from("queue").insert({ member_name:me.name, member_emoji:me.emoji, youtube_url:`https://www.youtube.com/watch?v=${vid}`, video_id:vid, title:meta.title, played:false });
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
    div.innerHTML = `<span class="q-num">${i===0?"▶":i+1}</span><img class="q-thumb" src="${thumbnail(row.video_id)}" alt="" onerror="this.style.opacity=0"><div class="q-info"><div class="q-title">${escapeHtml(cleanTitle(row.title,row.video_id))}</div><div class="q-by">${escapeHtml(row.member_emoji)} ${escapeHtml(row.member_name)}</div></div>`;
    EL.queueList.appendChild(div);
  });
}

/* ══ NOW PLAYING ══ */
async function loadNowPlaying() {
  const { data } = await db.from("now_playing").select("*").eq("id",1).single();
  nowPlayingCache = data;
  if (!data||!data.video_id) {
    EL.nowTitle.textContent = "ยังไม่มีเพลง";
    EL.nowBy.textContent    = "";
    EL.coverImage.style.display = "none";
    currentVideoId=null; currentSongAddedBy=null; myVoteThisSong=null;
    updateVoteUI(); setDancing(false); return;
  }
  const title = cleanTitle(data.title, data.video_id);
  EL.nowTitle.textContent = title;
  EL.nowBy.textContent    = data.updated_by ? `เพิ่มโดย ${data.updated_by}` : "";
  EL.coverImage.src       = thumbnail(data.video_id,"max");
  EL.coverImage.style.display = "block";
  currentSongAddedBy = data.updated_by||null;

  if (data.video_id!==currentVideoId) {
    currentVideoId=data.video_id; endWatchCount=0; lastProgressVid=data.video_id;
    myVoteThisSong=null; updateVoteUI(); setDancing(true);
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
  spawnFloat(type, 5);
  triggerAvatarReaction(me.id, type);
  sysMsg(type==="woot" ? `${me.emoji} ${me.name} Woot! ❤️` : `${me.emoji} ${me.name} Meh 💔`);
  await loadReactions();
}
function updateVoteUI() {
  EL.wootBtn.classList.toggle("voted", myVoteThisSong==="woot");
  EL.mehBtn.classList.toggle("voted",  myVoteThisSong==="meh");
  EL.stageWootBtn.classList.toggle("voted", myVoteThisSong==="woot");
  EL.stageMehBtn.classList.toggle("voted",  myVoteThisSong==="meh");
}
async function loadReactions() {
  const vid = nowPlayingCache?.video_id||"none";
  const { data } = await db.from("reactions").select("*").eq("video_id",vid);
  const rows = data||[];
  const wc = rows.filter(x=>x.reaction==="woot").length;
  const mc = rows.filter(x=>x.reaction==="meh").length;
  EL.likeCount.textContent  = rows.filter(x=>x.reaction==="like").length;
  EL.loveCount.textContent  = rows.filter(x=>x.reaction==="love").length;
  EL.fireCount.textContent  = rows.filter(x=>x.reaction==="fire").length;
  EL.wowCount.textContent   = rows.filter(x=>x.reaction==="wow").length;
  EL.wootCount.textContent  = wc;
  EL.wootCount2.textContent = wc;
  EL.mehCount.textContent   = mc;
  EL.mehCount2.textContent  = mc;
}

/* ══ POINTS ══ */
function addPoints(xp) { myPoints+=xp; localStorage.setItem("bbl_pts",String(myPoints)); updatePointsUI(); }
function updatePointsUI() { EL.myPoints.textContent = `${myPoints}`; }

/* ══ HOST / NEXT SONG ══ */
async function nextSongRPC(reason="auto") {
  if (!isHost||changingSong||nextRpcCooldown) return;
  changingSong=nextRpcCooldown=true;
  try {
    if (currentSongAddedBy===me?.name) {
      addPoints(XP_SONG_PLAYED);
      showXpPop(me.id, XP_SONG_PLAYED);
      sysMsg(`🏆 +${XP_SONG_PLAYED} XP — เพลงคุณเพิ่งจบ!`, "xp");
    }
    const { error } = await db.rpc("admin_next_song");
    if (error) { showToast("เปลี่ยนเพลงไม่สำเร็จ","error"); return; }
    currentVideoId=null; nowPlayingCache=null; endWatchCount=0; lastProgressVid=null; myVoteThisSong=null;
    await Promise.all([loadNowPlaying(), loadQueue(), loadReactions()]);
    setTimeout(tryAutoPlay, 700);
  } catch(e){ showToast("เปลี่ยนเพลงไม่สำเร็จ","error"); }
  finally {
    changingSong=false;
    setTimeout(()=>{nextRpcCooldown=false;}, 2200);
  }
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
  if (event.data===YT.PlayerState.PLAYING) { EL.clickToStart.classList.add("hidden"); setDancing(true); }
  if (isHost&&(event.data===YT.PlayerState.PAUSED||event.data===YT.PlayerState.CUED)) {
    setTimeout(async()=>{
      try { const c=player.getCurrentTime(),d=player.getDuration(); if(d>8&&c>0&&d-c<=3) await nextSongRPC("paused-near-end"); }catch(e){}
    },900);
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
    const c=player.getCurrentTime?player.getCurrentTime():0;
    const d=player.getDuration?player.getDuration():0;
    setProgressUI(c,d);
    if (lastProgressVid!==currentVideoId) { endWatchCount=0; lastProgressVid=currentVideoId; }
    const nearEnd = d>8&&c>0&&(d-c<=3||c>=d-3);
    if (isHost&&nearEnd&&!changingSong&&!nextRpcCooldown) {
      if (++endWatchCount>=3) { endWatchCount=0; nextSongRPC("progress-near-end"); }
    } else if (!nearEnd) { endWatchCount=0; }
  } catch(e){}
}
async function forceNextIfStuck() {
  if (!isHost||!me||!playerReady||!player||!currentVideoId||changingSong||nextRpcCooldown) return;
  try { const c=player.getCurrentTime(),d=player.getDuration(); if(d>8&&c>0&&d-c<=3) await nextSongRPC("force-stuck"); }catch(e){}
}
function setProgressUI(c,d) {
  const sc=Number(c)||0, sd=Number(d)||0;
  const pct=sd>0?Math.max(0,Math.min(100,(sc/sd)*100)):0;
  EL.currentTimeText.textContent=formatTime(sc);
  EL.durationText.textContent=sd>0?formatTime(sd):"0:00";
  EL.progressBar.style.width=`${pct}%`;
  EL.progressDot.style.left=`${pct}%`;
}

/* ══ UTILS ══ */
function formatTime(s){s=Math.max(0,Math.floor(Number(s)||0));return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`}
function cleanTitle(t,vid){const s=String(t||"").trim();if(!s||s===vid||s.startsWith("YouTube:")) return "กำลังโหลด...";return s;}
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
