// Welcome Pack Player
// Замените пути src на реальные URL ваших слайдов в GitHub (PNG/JPG/SVG).
// Например: "https://24tfaces-lgtm.github.io/onboarding-landing/slides/01.jpg"
const SLIDES = [
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/1.jpg",  title: "Слайд 1",  sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/2.jpg",  title: "Слайд 2",  sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/3.jpg",  title: "Слайд 3",  sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/4.jpg",  title: "Слайд 4",  sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/5.jpg",  title: "Слайд 5",  sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/6.jpg",  title: "Слайд 6",  sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/7.jpg",  title: "Слайд 7",  sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/8.jpg",  title: "Слайд 8",  sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/9.jpg",  title: "Слайд 9",  sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/10.jpg", title: "Слайд 10", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/11.jpg", title: "Слайд 11", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/12.jpg", title: "Слайд 12", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/13.jpg", title: "Слайд 13", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/14.jpg", title: "Слайд 14", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/15.jpg", title: "Слайд 15", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/16.jpg", title: "Слайд 16", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/17.jpg", title: "Слайд 17", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/18.jpg", title: "Слайд 18", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/19.jpg", title: "Слайд 19", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/20.jpg", title: "Слайд 20", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/21.jpg", title: "Слайд 21", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/22.jpg", title: "Слайд 22", sub: "" },
  { src: "https://raw.githubusercontent.com/24tfaces-lgtm/onboarding-landing/main/23.jpg", title: "Слайд 23", sub: "" },
];

const el = (id) => document.getElementById(id);
const img = el("wp2Slide");
const titleEl = el("wp2Title");
const subEl = el("wp2Sub");
const idxEl = el("wp2Index");
const totalEl = el("wp2Total");
const bar = el("wp2ProgBar");
const thumbs = el("wp2Thumbs");
const fsBtn = document.getElementById("wp2FS");
const prevBtn = document.getElementById("wp2Prev");
const nextBtn = document.getElementById("wp2Next");
const playBtn = document.getElementById("wp2Play");
const player = document.getElementById("wp2Player");

let i = 0;
let timer = null;
const AUTOPLAY_MS = 5000;

function renderThumbs() {
  totalEl.textContent = SLIDES.length;
  thumbs.innerHTML = SLIDES.map((s, k) => `
    <button class="wp2-thumb" data-i="${k}" aria-label="Слайд ${k+1}">
      <img src="${s.src}" alt=""/>
    </button>
  `).join("");
  thumbs.querySelectorAll(".wp2-thumb").forEach(b => {
    b.addEventListener("click", () => go(+b.dataset.i));
  });
}

function render() {
  const s = SLIDES[i];
  img.src = s.src;
  titleEl.textContent = s.title || \`Слайд \${i+1}\`;
  subEl.textContent = s.sub || "";
  idxEl.textContent = String(i+1);
  bar.style.width = \`\${((i+1)/SLIDES.length)*100}%\`;
  thumbs.querySelectorAll(".wp2-thumb").forEach((b, k) => b.classList.toggle("active", k === i));
  location.hash = \`#slide=\${i+1}\`;
}

function go(n) { i = (n + SLIDES.length) % SLIDES.length; render(); }
function next(){ go(i+1); }
function prev(){ go(i-1); }

function play() {
  if (timer) { stop(); return; }
  playBtn.textContent = "⏸";
  timer = setInterval(next, AUTOPLAY_MS);
}
function stop() { playBtn.textContent = "▶"; clearInterval(timer); timer = null; }

// Keyboard & gestures
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft")  prev();
  if (e.key === " ") { e.preventDefault(); play(); }
  if (e.key.toLowerCase() === "f") fullscreen();
  if (e.key === "Escape" && document.fullscreenElement) document.exitFullscreen();
});
let startX = 0;
player.addEventListener("pointerdown", (e) => (startX = e.clientX));
player.addEventListener("pointerup", (e) => {
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); }
});

function fullscreen(){
  const elem = document.documentElement;
  if (!document.fullscreenElement) elem.requestFullscreen().catch(()=>{});
  else document.exitFullscreen();
}

// Buttons
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);
playBtn.addEventListener("click", play);
fsBtn.addEventListener("click", fullscreen);

// Hash navigation
function fromHash(){
  const m = location.hash.match(/slide=(\d+)/);
  const n = m ? Math.max(1, Math.min(SLIDES.length, parseInt(m[1],10))) : 1;
  i = n - 1;
}
window.addEventListener("hashchange", () => { fromHash(); render(); });

// Init
renderThumbs();
fromHash();
render();
