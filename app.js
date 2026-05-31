/* =============================================
   BEARXBABE LIVE — V8 · Plug.dj Style
   ============================================= */

const SUPABASE_URL     = "https://xwfnqxqdlvvykppzlrxj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Zm5xeHFkbHZ2eWtwcHpscnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMTg0NjksImV4cCI6MjA5NTc5NDQ2OX0.Xr46g9TuWFzS3zhVvLAFqyVCqv9Al35W9rGDpXPaIwQ";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── Constants ───────────────────────────────── */
const HOST_TIMEOUT_MS  = 16000;
const HEARTBEAT_MS     = 6000;
const POLL_MS          = 2400;
const CHAT_POLL_MS     = 4500;
const MAX_SONGS_PER_USER = 3;
const ONLINE_CUTOFF_MS = 45000;

/* ── State ───────────────────────────────────── */
let me               = JSON.parse(localStorage.getItem("bbl_me") || "null");
let selectedEmoji    = me?.emoji || "😎";
let player           = null;
let playerReady      = false;
let currentVideoId   = null;
let nowPlayingCache  = null;
let hostState        = null;
let isHost           = false;
let booted           = false;
let changingSong     = false;
let userUnlockedAudio = false;
let endWatchCount    = 0;
let nextRpcCooldown  = false;
let lastProgressVid  = null;
let onlineMembers    = [];   // [{id, name, emoji}]
let avatarDancing    = false;

/* ── Emoji sets ──────────────────────────────── */
const EMOJIS = {
  face:   ["😀","😃","😄","😁","😆","😂","🤣","😊","😇","🙂","🙃","😉","😍","😘","😜","😎","🤩","🥳","😏","😴","🥺","😭","😤","😈","🤡","👻","💀","👽","🤖","😺"],
  music:  ["🎵","🎶","🎧","🎤","🎸","🥁","🎹","🎺","🎷","🪩","📀","💿","📻","🔊","🔈","🎼","🎬","🎭","🎪","🎫"],
  animal: ["🐱","🐶","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦉","🐺","🐝","🦋","🐢","🐬","🐳","🦈","🐉"],
  fire:   ["🔥","⚡","💥","🚀","👑","💎","🌟","⭐","✨","🌙","☀️","🌈","🧊","🍀","🎯","🏆","🥇","💜","🩷","❤️","🖤","🤍","💫","🛸","🪐"]
};
const ALL_EMOJIS = [...EMOJIS.face, ...EMOJIS.music, ...EMOJIS.animal, ...EMOJIS.fire];

const REACTION_EMOJI = { like:"👍", love:"❤️", fire:"🔥", wow:"😮" };

/* ── DOM refs ────────────────────────────────── */
const $ = id => document.getElementById(id);
const EL = {
  toast:         $("toast"),
  floatLayer:    $("floatLayer"),
  loginScreen:   $("loginScreen"),
  app:           $("app"),
  nameInput:     $("nameInput"),
  emojiGrid:     $("emojiGrid"),
  joinBtn:       $("joinBtn"),
  previewEmoji:  $("previewEmoji"),
  previewName:   $("previewName"),
  hostBadge:     $("hostBadge"),
  meLabel:       $("meLabel"),
  statusDot:     $("statusDot"),
  statusText:    $("statusText"),
  chatBox:       $("chatBox"),
  chatInput:     $("chatInput"),
  sendChatBtn:   $("sendChatBtn"),
  youtubeInput:  $("youtubeInput"),
  addSongBtn:    $("addSongBtn"),
  queueList:     $("queueList"),
  queueCount:    $("queueCount"),
  onlineCount:   $("onlineCount"),
  nowTitle:      $("nowTitle"),
  nowBy:         $("nowBy"),
  coverImage:    $("coverImage"),
  coverFallback: $("coverFallback"),
  likeCount:     $("likeCount"),
  loveCount:     $("loveCount"),
  fireCount:     $("fireCount"),
  wowCount:      $("wowCount"),
  currentTimeText:$("currentTimeText"),
  durationText:  $("durationText"),
  progressBar:   $("progressBar"),
  progressDot:   $("progressDot"),
  clickToStart:  $("clickToStart"),
  avatarRow:     $("avatarRow"),
  modalOverlay:  $("modalOverlay"),
  modalTitle:    $("modalTitle"),
  modalBody:     $("modalBody"),
  modalCloseBtn: $("modalCloseBtn"),
};

/* =============================================
   INIT
   ============================================= */

// Emoji grid (login)
renderEmojiGrid("all");

document.querySelectorAll(".etab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".etab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderEmojiGrid(tab.dataset.group);
  };
});

EL.joinBtn.onclick = joinRoom;
EL.sendChatBtn.onclick = sendChat;
EL.addSongBtn.onclick = addSong;
EL.clickToStart.onclick = unlockAndPlay;
EL.modalCloseBtn.onclick = closeModal;
EL.modalOverlay.onclick = e => { if (e.target === EL.modalOverlay) closeModal(); };

document.querySelectorAll(".react-btn[data-reaction]").forEach(btn => {
  btn.onclick = () => react(btn.dataset.reaction);
});

EL.chatInput.addEventListener("keydown", e => { if (e.key === "Enter") sendChat(); });
EL.youtubeInput.addEventListener("keydown", e => { if (e.key === "Enter") addSong(); });

EL.nameInput.addEventListener("input", () => {
  EL.previewName.textContent = EL.nameInput.value.trim() || "คุณ";
});

// Name preview from stored session
if (me) {
  EL.previewEmoji.textContent = me.emoji;
  EL.previewName.textContent  = me.name;
}

/* YouTube API ready */
window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("player", {
    videoId: "",
    playerVars: { autoplay:1, controls:0, disablekb:1, fs:0, rel:0, modestbranding:1, iv_load_policy:3, playsinline:1 },
    events: {
      onReady: async () => {
        playerReady = true;
        if (me) {
          showAppAndBoot();
          await loadNowPlaying();
          setTimeout(tryAutoPlay, 600);
        }
      },
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
};

if (me) showAppAndBoot();

/* =============================================
   EMOJI GRID
   ============================================= */
function renderEmojiGrid(group) {
  const list = group === "all" ? ALL_EMOJIS : EMOJIS[group];
  EL.emojiGrid.innerHTML = "";
  list.forEach(icon => {
    const btn = document.createElement("button");
    btn.className = "egrid-btn" + (icon === selectedEmoji ? " active" : "");
    btn.textContent = icon;
    btn.onclick = () => {
      selectedEmoji = icon;
      EL.previewEmoji.textContent = icon;
      document.querySelectorAll(".egrid-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    EL.emojiGrid.appendChild(btn);
  });
}

/* =============================================
   JOIN / BOOT
   ============================================= */
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

  await db.from("members").upsert({ id: me.id, name: me.name, emoji: me.emoji, last_seen: new Date().toISOString() });

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
    await Promise.all([loadHostState(), loadQueue(), loadNowPlaying(), loadReactions(), loadOnline()]);
    await hostOnlyAutoStart();
  }, POLL_MS);
  setInterval(loadChat, CHAT_POLL_MS);
  setInterval(updateProgress, 500);
  setInterval(forceNextIfStuck, 2000);
}

async function ensureRequiredRows() {
  await db.from("now_playing").upsert({ id: 1 }, { onConflict: "id" });
  const { data: ch } = await db.from("host_state").select("*").eq("id", 1).maybeSingle();
  if (!ch) {
    await db.from("host_state").insert({ id:1, host_id:me.id, host_name:me.name, host_emoji:me.emoji, updated_at: new Date().toISOString() });
  }
}

/* =============================================
   REALTIME
   ============================================= */
function subscribeRealtime() {
  db.channel("bbl-v8")
    .on("postgres_changes", { event:"*", schema:"public", table:"chat_messages" }, loadChat)
    .on("postgres_changes", { event:"*", schema:"public", table:"queue" }, async () => { await loadQueue(); await hostOnlyAutoStart(); })
    .on("postgres_changes", { event:"*", schema:"public", table:"now_playing" }, async () => { await loadNowPlaying(); await loadReactions(); })
    .on("postgres_changes", { event:"*", schema:"public", table:"reactions" }, loadReactions)
    .on("postgres_changes", { event:"*", schema:"public", table:"members" }, loadOnline)
    .on("postgres_changes", { event:"*", schema:"public", table:"host_state" }, loadHostState)
    .subscribe(status => {
      const live = status === "SUBSCRIBED";
      EL.statusDot.classList.toggle("live", live);
      EL.statusText.textContent = live ? "เชื่อมต่อสดแล้ว" : "กำลังเชื่อมต่อ...";
    });
}

async function loadAll() {
  await Promise.all([loadHostState(), loadChat(), loadQueue(), loadOnline(), loadNowPlaying(), loadReactions()]);
  await hostOnlyAutoStart();
}

/* =============================================
   HEARTBEAT / HOST
   ============================================= */
async function touchOnline() {
  if (!me) return;
  await db.from("members").upsert({ id:me.id, name:me.name, emoji:me.emoji, last_seen: new Date().toISOString() });
}

async function loadHostState() {
  const { data } = await db.from("host_state").select("*").eq("id", 1).maybeSingle();
  hostState = data;
  if (!hostState) { isHost = false; EL.hostBadge.textContent = ""; return; }
  isHost = hostState.host_id === me?.id;
  EL.hostBadge.textContent = isHost
    ? "⭐ คุณคือ DJ"
    : `🎧 DJ: ${hostState.host_emoji || "🔥"} ${hostState.host_name || "Host"}`;
  renderAvatars(); // re-render so DJ crown updates
}

async function hostLoop() {
  if (!me) return;
  await loadHostState();
  const expired = !hostState?.updated_at || Date.now() - new Date(hostState.updated_at).getTime() > HOST_TIMEOUT_MS;
  if (isHost) {
    await db.from("host_state").update({ host_id:me.id, host_name:me.name, host_emoji:me.emoji, updated_at:new Date().toISOString() }).eq("id", 1);
    await hostOnlyAutoStart();
    return;
  }
  if (expired) {
    const { data: first } = await db.from("members").select("*")
      .gte("last_seen", new Date(Date.now()-ONLINE_CUTOFF_MS).toISOString())
      .order("joined_at", { ascending:true }).limit(1).maybeSingle();
    if (first?.id === me.id) {
      await db.from("host_state").update({ host_id:me.id, host_name:me.name, host_emoji:me.emoji, updated_at:new Date().toISOString() }).eq("id", 1);
      await loadHostState();
    }
  }
}

/* =============================================
   ONLINE MEMBERS + AVATAR STAGE
   ============================================= */
async function loadOnline() {
  const cutoff = new Date(Date.now() - ONLINE_CUTOFF_MS).toISOString();
  const { data } = await db.from("members").select("*")
    .gte("last_seen", cutoff).order("last_seen", { ascending: false });
  onlineMembers = data || [];
  EL.onlineCount.textContent = String(onlineMembers.length);
  renderAvatars();
}

function renderAvatars() {
  const row = EL.avatarRow;
  const existingIds = new Set([...row.querySelectorAll(".av-slot")].map(el => el.dataset.uid));
  const newIds      = new Set(onlineMembers.map(m => m.id));

  // Remove gone members
  row.querySelectorAll(".av-slot").forEach(el => {
    if (!newIds.has(el.dataset.uid)) el.remove();
  });

  // Add / update
  onlineMembers.forEach(member => {
    const djId   = hostState?.host_id;
    const isMeDj = member.id === djId;
    const isMe   = member.id === me?.id;

    if (existingIds.has(member.id)) {
      // Just update crown / me status
      const slot = row.querySelector(`[data-uid="${member.id}"]`);
      if (!slot) return;
      slot.classList.toggle("is-dj", isMeDj);
      slot.classList.toggle("me",    isMe);
      return;
    }

    // New avatar
    const slot = document.createElement("div");
    slot.className = "av-slot" + (isMeDj?" is-dj":"") + (isMe?" me":"") + (avatarDancing?" dancing":"");
    slot.dataset.uid = member.id;

    const body = document.createElement("div");
    body.className = "av-body";
    body.dataset.uid = member.id;

    const emojiSpan = document.createElement("span");
    emojiSpan.className = "av-emoji";
    emojiSpan.textContent = member.emoji;

    body.appendChild(emojiSpan);

    const nameDiv = document.createElement("div");
    nameDiv.className = "av-name";
    nameDiv.textContent = member.name;

    slot.appendChild(body);
    slot.appendChild(nameDiv);
    row.appendChild(slot);
  });

  // Sync dancing state
  toggleAvatarDance(avatarDancing);
}

function toggleAvatarDance(on) {
  avatarDancing = on;
  document.querySelectorAll(".av-slot").forEach(el => el.classList.toggle("dancing", on));
}

/* Trigger bounce + mini reaction pop on a specific member's avatar */
function triggerAvatarReaction(memberId, reactionKey) {
  const slot = EL.avatarRow.querySelector(`[data-uid="${memberId}"]`);
  if (!slot) return;
  const body = slot.querySelector(".av-body");

  // Bounce
  body.classList.remove("bouncing");
  void body.offsetWidth; // reflow
  body.classList.add("bouncing");
  setTimeout(() => body.classList.remove("bouncing"), 600);

  // Pop emoji above avatar
  const pop = document.createElement("div");
  pop.className = "av-reaction-pop";
  pop.textContent = REACTION_EMOJI[reactionKey] || "❓";
  slot.appendChild(pop);
  setTimeout(() => pop.remove(), 1500);
}

/* Float emoji across screen */
function spawnFloatEmoji(reactionKey) {
  const emoji = REACTION_EMOJI[reactionKey] || "❓";
  const count = Math.floor(Math.random()*3) + 1;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "float-emoji";
      el.textContent = emoji;
      el.style.left = Math.random() * 80 + 10 + "%";
      el.style.animationDelay = Math.random() * 0.3 + "s";
      EL.floatLayer.appendChild(el);
      setTimeout(() => el.remove(), 2600);
    }, i * 120);
  }
}

/* =============================================
   CHAT
   ============================================= */
async function sendChat() {
  const message = EL.chatInput.value.trim();
  if (!message) return;
  const { error } = await db.from("chat_messages").insert({ member_name:me.name, member_emoji:me.emoji, message });
  if (error) { showToast("ส่งแชตไม่สำเร็จ"); return; }
  EL.chatInput.value = "";
  await loadChat();
}

async function loadChat() {
  const { data } = await db.from("chat_messages").select("*").order("created_at", { ascending:true }).limit(120);
  const atBottom = EL.chatBox.scrollHeight - EL.chatBox.scrollTop - EL.chatBox.clientHeight < 60;

  EL.chatBox.innerHTML = "";
  (data || []).forEach(row => {
    const time = new Date(row.created_at).toLocaleTimeString("th-TH", { hour:"2-digit", minute:"2-digit" });
    const div = document.createElement("div");
    div.className = "msg";
    div.innerHTML = `
      <div class="msg-header">
        <span class="msg-name">${escapeHtml(row.member_emoji)} ${escapeHtml(row.member_name)}</span>
        <span class="msg-time">${time}</span>
      </div>
      <div class="msg-text">${linkify(escapeHtml(row.message))}</div>
    `;
    EL.chatBox.appendChild(div);
  });

  if (atBottom || !data?.length) EL.chatBox.scrollTop = EL.chatBox.scrollHeight;
}

function addSystemMsg(text) {
  const div = document.createElement("div");
  div.className = "msg system";
  div.textContent = text;
  EL.chatBox.appendChild(div);
  EL.chatBox.scrollTop = EL.chatBox.scrollHeight;
}

/* =============================================
   QUEUE
   ============================================= */
async function addSong() {
  const input   = EL.youtubeInput.value.trim();
  const videoId = extractYouTubeId(input);
  if (!videoId) { showToast("ลิงก์ YouTube ไม่ถูกต้อง"); return; }

  const { data: existing } = await db.from("queue").select("id").eq("video_id", videoId).eq("played", false).limit(1).maybeSingle();
  if (existing) { showToast("เพลงนี้อยู่ในคิวแล้ว", "error"); return; }

  const { count } = await db.from("queue").select("*", { count:"exact", head:true }).eq("member_name", me.name).eq("played", false);
  if ((count || 0) >= MAX_SONGS_PER_USER) { showToast(`จำกัดคนละ ${MAX_SONGS_PER_USER} เพลง`, "error"); return; }

  EL.addSongBtn.disabled = true;
  EL.addSongBtn.textContent = "…";

  const meta = await getYouTubeMeta(videoId);
  const { error } = await db.from("queue").insert({
    member_name: me.name, member_emoji: me.emoji,
    youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
    video_id: videoId, title: meta.title, played: false
  });

  EL.addSongBtn.disabled = false;
  EL.addSongBtn.textContent = "+";
  if (error) { showToast("เพิ่มเพลงไม่สำเร็จ"); return; }
  EL.youtubeInput.value = "";
  showToast("เพิ่มเพลงเข้าคิวแล้ว ✅", "success");
  await loadQueue();
  await hostOnlyAutoStart();
}

async function loadQueue() {
  const { data } = await db.from("queue").select("*").eq("played", false).order("created_at", { ascending:true });
  EL.queueList.innerHTML = "";
  EL.queueCount.textContent = String((data || []).length);

  if (!data || data.length === 0) {
    EL.queueList.innerHTML = `<div class="q-empty">ยังไม่มีเพลงในคิว<br>วาง YouTube URL ด้านล่าง</div>`;
    return;
  }

  data.forEach((row, i) => {
    const div = document.createElement("div");
    div.className = "q-item";
    div.innerHTML = `
      <span class="q-num">${i+1}</span>
      <img class="q-thumb" src="${thumbnail(row.video_id)}" alt="" onerror="this.style.opacity=0">
      <div class="q-info">
        <div class="q-title">${escapeHtml(cleanTitle(row.title, row.video_id))}</div>
        <div class="q-by">${escapeHtml(row.member_emoji)} ${escapeHtml(row.member_name)}</div>
      </div>
    `;
    EL.queueList.appendChild(div);
  });
}

/* =============================================
   NOW PLAYING
   ============================================= */
async function loadNowPlaying() {
  const { data } = await db.from("now_playing").select("*").eq("id", 1).single();
  nowPlayingCache = data;

  if (!data || !data.video_id) {
    EL.nowTitle.textContent = "ยังไม่มีเพลง";
    EL.nowBy.textContent    = "วาง YouTube URL แล้วกด +";
    EL.coverImage.style.display    = "none";
    EL.coverFallback.style.display = "grid";
    currentVideoId = null;
    toggleAvatarDance(false);
    return;
  }

  EL.nowTitle.textContent         = cleanTitle(data.title, data.video_id);
  EL.nowBy.textContent            = data.updated_by ? `เพิ่มโดย ${data.updated_by}` : "กำลังเล่น";
  EL.coverImage.src               = thumbnail(data.video_id, "max");
  EL.coverImage.style.display     = "block";
  EL.coverFallback.style.display  = "none";

  if (data.video_id !== currentVideoId) {
    currentVideoId  = data.video_id;
    endWatchCount   = 0;
    lastProgressVid = data.video_id;
    toggleAvatarDance(true);

    if (playerReady && player) {
      const startSec = data.started_at
        ? Math.max(0, Math.floor((Date.now() - new Date(data.started_at).getTime()) / 1000))
        : 0;
      player.loadVideoById({ videoId: data.video_id, startSeconds: startSec });
      setTimeout(tryAutoPlay, 700);
    }
  }
}

/* =============================================
   REACTIONS
   ============================================= */
async function react(type) {
  const videoId = nowPlayingCache?.video_id || "none";
  if (videoId === "none") return;
  await db.from("reactions").insert({ video_id: videoId, member_name: me.name, reaction: type });
  // Trigger visuals for self immediately
  triggerAvatarReaction(me.id, type);
  spawnFloatEmoji(type);
  await loadReactions();
}

async function loadReactions() {
  const videoId = nowPlayingCache?.video_id || "none";
  const { data } = await db.from("reactions").select("*").eq("video_id", videoId);
  const rows = data || [];
  EL.likeCount.textContent = rows.filter(x=>x.reaction==="like").length;
  EL.loveCount.textContent = rows.filter(x=>x.reaction==="love").length;
  EL.fireCount.textContent = rows.filter(x=>x.reaction==="fire").length;
  EL.wowCount.textContent  = rows.filter(x=>x.reaction==="wow").length;
}

async function clearReactionsForVideo(videoId) {
  if (!videoId || videoId === "none") return;
  await db.from("reactions").delete().eq("video_id", videoId);
}

/* =============================================
   HOST / AUTO PLAY
   ============================================= */
async function nextSongRPC(reason = "auto") {
  if (!isHost || changingSong || nextRpcCooldown) return;
  changingSong = nextRpcCooldown = true;
  try {
    const { data, error } = await db.rpc("admin_next_song");
    if (error) { showToast("เปลี่ยนเพลงไม่สำเร็จ", "error"); return; }
    currentVideoId = null; nowPlayingCache = null; endWatchCount = 0; lastProgressVid = null;
    await Promise.all([loadNowPlaying(), loadQueue(), loadReactions()]);
    setTimeout(tryAutoPlay, 700);
  } catch(e) {
    showToast("เปลี่ยนเพลงไม่สำเร็จ", "error");
  } finally {
    changingSong = false;
    setTimeout(() => { nextRpcCooldown = false; }, 2200);
  }
}

async function hostOnlyAutoStart() {
  if (!isHost || changingSong || nextRpcCooldown) return;
  const { data } = await db.from("now_playing").select("*").eq("id", 1).single();
  if (data && data.video_id) return;
  await nextSongRPC("empty-now-playing");
}

/* =============================================
   PLAYER
   ============================================= */
async function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED && isHost) {
    endWatchCount = 0;
    await nextSongRPC("youtube-ended");
  }
  if (event.data === YT.PlayerState.PLAYING) {
    EL.clickToStart.classList.add("hidden");
    toggleAvatarDance(true);
  }
  if (isHost && (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.CUED)) {
    setTimeout(async () => {
      try {
        const cur = player.getCurrentTime(), dur = player.getDuration();
        if (dur > 8 && cur > 0 && dur - cur <= 3) await nextSongRPC("paused-near-end");
      } catch(e) {}
    }, 900);
  }
}

function onPlayerError() {
  showToast("เพลงนี้เล่นไม่ได้ กำลังข้าม...");
  if (isHost) setTimeout(() => nextSongRPC("player-error"), 900);
}

function tryAutoPlay() {
  if (!playerReady || !player) return;
  if (!currentVideoId) { loadNowPlaying(); return; }
  try {
    player.mute(); player.playVideo();
    setTimeout(() => {
      try {
        if (userUnlockedAudio) {
          player.unMute(); player.setVolume(100); player.playVideo();
          EL.clickToStart.classList.add("hidden");
        } else {
          EL.clickToStart.classList.remove("hidden");
        }
      } catch(e) { EL.clickToStart.classList.remove("hidden"); }
    }, 800);
  } catch(e) { EL.clickToStart.classList.remove("hidden"); }
}

function unlockAndPlay() {
  userUnlockedAudio = true;
  try {
    player.unMute(); player.setVolume(100); player.playVideo();
    EL.clickToStart.classList.add("hidden");
  } catch(e) { showToast("กดอีกครั้งเพื่อเปิดเพลง"); }
}

document.addEventListener("click", () => {
  userUnlockedAudio = true;
  if (currentVideoId) unlockAndPlay();
}, { once: true });

/* =============================================
   PROGRESS
   ============================================= */
function updateProgress() {
  if (!playerReady || !player || !currentVideoId) { setProgressUI(0,0); return; }
  try {
    const cur = player.getCurrentTime ? player.getCurrentTime() : 0;
    const dur = player.getDuration ? player.getDuration() : 0;
    setProgressUI(cur, dur);
    if (lastProgressVid !== currentVideoId) { endWatchCount = 0; lastProgressVid = currentVideoId; }
    const nearEnd = dur > 8 && cur > 0 && (dur - cur <= 3 || cur >= dur - 3);
    if (isHost && nearEnd && !changingSong && !nextRpcCooldown) {
      if (++endWatchCount >= 3) { endWatchCount = 0; nextSongRPC("progress-near-end"); }
    } else if (!nearEnd) { endWatchCount = 0; }
  } catch(e) {}
}

async function forceNextIfStuck() {
  if (!isHost || !me || !playerReady || !player || !currentVideoId || changingSong || nextRpcCooldown) return;
  try {
    const cur = player.getCurrentTime(), dur = player.getDuration();
    if (dur > 8 && cur > 0 && dur - cur <= 3) await nextSongRPC("force-stuck");
  } catch(e) {}
}

function setProgressUI(current, duration) {
  const sd = Number(duration)||0, sc = Number(current)||0;
  const pct = sd > 0 ? Math.max(0, Math.min(100, (sc/sd)*100)) : 0;
  EL.currentTimeText.textContent = formatTime(sc);
  EL.durationText.textContent    = sd > 0 ? formatTime(sd) : "0:00";
  EL.progressBar.style.width     = `${pct}%`;
  EL.progressDot.style.left      = `${pct}%`;
}

/* =============================================
   UTILITIES
   ============================================= */
function formatTime(sec) {
  sec = Math.max(0, Math.floor(Number(sec)||0));
  return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;
}

function cleanTitle(title, videoId) {
  const t = String(title||"").trim();
  if (!t || t === videoId || t.startsWith("YouTube: ")) return "กำลังโหลดชื่อเพลง...";
  return t;
}

async function getYouTubeMeta(videoId) {
  try {
    const res  = await fetch(`https://noembed.com/embed?url=${encodeURIComponent("https://www.youtube.com/watch?v="+videoId)}`);
    const data = await res.json();
    if (data?.title) return { title: data.title.replace(/\s*-\s*YouTube\s*$/i,"").trim() };
  } catch(e) {}
  return { title:"ไม่พบชื่อเพลง" };
}

function extractYouTubeId(input) {
  if (!input) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) return url.pathname.replace("/","").slice(0,11);
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v.slice(0,11);
      const s = url.pathname.match(/\/shorts\/([^/?]+)/);
      if (s) return s[1].slice(0,11);
      const e = url.pathname.match(/\/embed\/([^/?]+)/);
      if (e) return e[1].slice(0,11);
    }
  } catch(e) {}
  return null;
}

function thumbnail(videoId, size="mq") {
  if (!videoId) return "";
  if (size === "max") return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

function linkify(text) { return text.replace(/(@[\wก-๙]+)/g,"<b>$1</b>"); }

function escapeHtml(text) {
  return String(text||"")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function showToast(msg, type="") {
  EL.toast.textContent = msg;
  EL.toast.className   = "toast" + (type?" "+type:"");
  EL.toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => EL.toast.classList.add("hidden"), 2800);
}

function closeModal() { EL.modalOverlay.classList.add("hidden"); }
