// ---- Data: 24 frames across 4 categories, using picsum.photos deterministic IDs ----
const PHOTOS = [
  { id: 1015, cat: "nature",   title: "River bend, early light" },
  { id: 1016, cat: "nature",   title: "Ridge line, blue hour" },
  { id: 1018, cat: "nature",   title: "Valley fog" },
  { id: 1021, cat: "nature",   title: "Pine and mist" },
  { id: 1043, cat: "nature",   title: "Coastal grass" },
  { id: 1044, cat: "nature",   title: "Still water" },

  { id: 1031, cat: "urban",    title: "Corner store, 6am" },
  { id: 1040, cat: "urban",    title: "Fire escape geometry" },
  { id: 1048, cat: "urban",    title: "Underpass light" },
  { id: 1074, cat: "urban",    title: "Rooftops, dusk" },
  { id: 1076, cat: "urban",    title: "Platform, waiting" },
  { id: 1080, cat: "urban",    title: "Alley, wet asphalt" },

  { id: 64,   cat: "portrait", title: "Study, window light" },
  { id: 65,   cat: "portrait", title: "Profile, low key" },
  { id: 91,   cat: "portrait", title: "Hands, workbench" },
  { id: 177,  cat: "portrait", title: "Backlit, doorway" },
  { id: 203,  cat: "portrait", title: "Quiet moment" },
  { id: 219,  cat: "portrait", title: "Café, half turn" },

  { id: 225,  cat: "abstract", title: "Texture no. 4" },
  { id: 244,  cat: "abstract", title: "Grain study" },
  { id: 250,  cat: "abstract", title: "Shadow lines" },
  { id: 268,  cat: "abstract", title: "Rust and paint" },
  { id: 300,  cat: "abstract", title: "Fabric fold" },
  { id: 312,  cat: "abstract", title: "Glass refraction" },
];

const sheet = document.getElementById("sheet");
const filters = document.getElementById("filters");

// Render grid
PHOTOS.forEach((photo, i) => {
  const el = document.createElement("div");
  el.className = "frame";
  el.dataset.cat = photo.cat;
  el.dataset.index = i;
  el.style.animationDelay = `${(i % 12) * 0.03}s`;
  el.innerHTML = `
    <img src="https://picsum.photos/id/${photo.id}/700/860" alt="${photo.title}" loading="lazy">
    <span class="frame-index">${String(i + 1).padStart(2, "0")}</span>
    <span class="frame-tag">${photo.title}</span>
  `;
  el.addEventListener("click", () => openLightbox(i));
  sheet.appendChild(el);
});

// Filtering
filters.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  filters.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  const filter = btn.dataset.filter;
  document.querySelectorAll(".frame").forEach(frame => {
    const match = filter === "all" || frame.dataset.cat === filter;
    frame.classList.toggle("hide", !match);
  });
});

// ---- Lightbox ----
const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbCaption = document.getElementById("lbCaption");
const lbCount = document.getElementById("lbCount");
let currentIndex = 0;

function visibleIndexes() {
  return [...document.querySelectorAll(".frame")]
    .filter(f => !f.classList.contains("hide"))
    .map(f => parseInt(f.dataset.index, 10));
}

function openLightbox(index) {
  currentIndex = index;
  renderLightbox();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}

function renderLightbox() {
  const photo = PHOTOS[currentIndex];
  lbImage.src = `https://picsum.photos/id/${photo.id}/1200/1000`;
  lbImage.alt = photo.title;
  lbCaption.textContent = photo.title;
  const order = visibleIndexes();
  const pos = order.indexOf(currentIndex) + 1;
  lbCount.textContent = `${pos} / ${order.length}`;
}

function step(dir) {
  const order = visibleIndexes();
  if (!order.length) return;
  let pos = order.indexOf(currentIndex);
  pos = (pos + dir + order.length) % order.length;
  currentIndex = order[pos];
  renderLightbox();
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => step(-1));
document.getElementById("lbNext").addEventListener("click", () => step(1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});
