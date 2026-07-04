const TRACKS = [
  {
    title: "Sunrise Drive",
    artist: "Northbound Collective",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Late Night Static",
    artist: "Reverie Lane",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Open Road",
    artist: "Northbound Collective",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Amber Hour",
    artist: "Reverie Lane",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
];

const audio = document.getElementById("audio");
const record = document.getElementById("record");
const tonearm = document.getElementById("tonearm");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const loopBtn = document.getElementById("loopBtn");
const seek = document.getElementById("seek");
const volume = document.getElementById("volume");
const timeCurrent = document.getElementById("timeCurrent");
const timeDuration = document.getElementById("timeDuration");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const labelTitle = document.getElementById("labelTitle");
const playlistItems = document.getElementById("playlistItems");

let currentTrack = 0;
let isPlaying = false;
let isShuffle = false;
let isLoop = false;

function renderPlaylist() {
  playlistItems.innerHTML = "";
  TRACKS.forEach((track, i) => {
    const li = document.createElement("li");
    li.className = "playlist-item" + (i === currentTrack ? " is-active" : "");
    li.innerHTML = `
      <span class="pl-index">${i === currentTrack && isPlaying
        ? '<span class="pl-wave"><span></span><span></span><span></span></span>'
        : String(i + 1).padStart(2, "0")}</span>
      <div class="pl-meta">
        <h4>${track.title}</h4>
        <p>${track.artist}</p>
      </div>
      <span class="pl-duration">--:--</span>
    `;
    li.addEventListener("click", () => loadTrack(i, true));
    playlistItems.appendChild(li);
  });
}

function loadTrack(index, autoplay) {
  currentTrack = index;
  const track = TRACKS[currentTrack];
  audio.src = track.src;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  labelTitle.textContent = track.title;
  renderPlaylist();
  if (autoplay) play();
}

function play() {
  audio.play().catch(() => {});
  isPlaying = true;
  playBtn.textContent = "⏸";
  record.classList.add("is-spinning");
  tonearm.classList.add("is-playing");
  renderPlaylist();
}

function pause() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
  record.classList.remove("is-spinning");
  tonearm.classList.remove("is-playing");
  renderPlaylist();
}

function togglePlay() {
  isPlaying ? pause() : play();
}

function nextTrack() {
  let next;
  if (isShuffle) {
    do { next = Math.floor(Math.random() * TRACKS.length); } while (next === currentTrack && TRACKS.length > 1);
  } else {
    next = (currentTrack + 1) % TRACKS.length;
  }
  loadTrack(next, true);
}

function prevTrack() {
  const prev = (currentTrack - 1 + TRACKS.length) % TRACKS.length;
  loadTrack(prev, true);
}

function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

audio.addEventListener("loadedmetadata", () => {
  seek.max = audio.duration;
  timeDuration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (!seek.matches(":active")) {
    seek.value = audio.currentTime;
  }
  timeCurrent.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  if (isLoop) {
    audio.currentTime = 0;
    play();
  } else {
    nextTrack();
  }
});

seek.addEventListener("input", () => {
  audio.currentTime = seek.value;
});

volume.addEventListener("input", () => {
  audio.volume = volume.value / 100;
});

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("is-active", isShuffle);
});

loopBtn.addEventListener("click", () => {
  isLoop = !isLoop;
  loopBtn.classList.toggle("is-active", isLoop);
});

document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") { e.preventDefault(); togglePlay(); }
  if (e.key === "ArrowRight") nextTrack();
  if (e.key === "ArrowLeft") prevTrack();
});

// Init
audio.volume = 0.7;
loadTrack(0, false);

// ---- Spotify embed panel ----
// This does NOT bypass Spotify's subscription rules. It builds an iframe
// pointing at Spotify's own official embed player (open.spotify.com/embed/...).
// That player streams full tracks for anyone with a free Spotify account
// (with occasional audio ads, same as the free Spotify app) — no API keys,
// no login flow, and no premium requirement on our side. Playback happens
// entirely inside Spotify's iframe, sandboxed from the rest of the page.
const spotifyForm = document.getElementById("spotifyForm");
const spotifyInput = document.getElementById("spotifyInput");
const spotifyError = document.getElementById("spotifyError");
const spotifyEmbedWrap = document.getElementById("spotifyEmbedWrap");

function parseSpotifyUrl(url) {
  try {
    const u = new URL(url.trim());
    if (!u.hostname.includes("open.spotify.com")) return null;
    // path looks like /track/{id}, /album/{id}, /playlist/{id}, /episode/{id}, /show/{id}
    const match = u.pathname.match(/\/(track|album|playlist|episode|show|artist)\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    return { type: match[1], id: match[2] };
  } catch {
    return null;
  }
}

spotifyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  spotifyError.textContent = "";
  const parsed = parseSpotifyUrl(spotifyInput.value);
  if (!parsed) {
    spotifyError.textContent = "That doesn't look like a Spotify link. Copy a share link from the Spotify app (⋯ → Share → Copy link) and paste it here.";
    return;
  }
  const height = parsed.type === "track" ? 152 : 352;
  spotifyEmbedWrap.innerHTML = `
    <iframe
      src="https://open.spotify.com/embed/${parsed.type}/${parsed.id}?utm_source=generator"
      width="100%"
      height="${height}"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy">
    </iframe>
  `;
});
