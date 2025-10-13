// -------- Конфиг разделов (порядок в сайдбаре) --------
const SECTIONS = [
  { id: "welcome",       title: "Приветствие",                  lead: "Письмо/видео и первые ориентиры." },
  { id: "first-steps",   title: "Первые шаги",                  lead: "Карты и чеклисты первого дня/недели/месяца." },
  { id: "workplace",     title: "Рабочее место и доступы",     lead: "Доступы, безопасность и VPN." },
  { id: "communication", title: "Контакты и правила связи",    lead: "Куда писать и как общаемся." },
  { id: "faq",           title: "Частые вопросы",              lead: "Ответы на типовые ситуации новичка." },
];

// -------- Карточки по разделам --------
const CONTENT = {
  welcome: [
    { h: "Приветственное письмо", p: "Письмо от HR и тимлида, полезные ссылки.", link: "#" },
    { h: "Вводное видео",         p: "Кто мы, продукты, ценности и культура.",    link: "#" },
    { h: "Welcome Pack",          p: "Материалы для старта и бренд-гид.",         link: "https://info.adtika.com/display/INFOCC/Welcome+pack" },
    { h: "Глоссарий терминов",    p: "Быстрые расшифровки часто встречаемых слов.", link: "#" },
  ],
  "first-steps": [
    { h: "Дорожная карта — 1 день",    p: "Подключения, знакомство с командой, первый стендап.", link: "#" },
    { h: "Дорожная карта — 1 неделя",  p: "Первые задачи, кодстайл/процессы, регулярные митинги.", link: "#" },
    { h: "Дорожная карта — 1 месяц",   p: "Цели испытательного срока, чекпоинты и ретро.", link: "#" },
    { h: "Чек-лист до старта",         p: "Данные для аккаунтов, документы, предварительные шаги.", link: "#" },
    { h: "Чек-лист первого дня",       p: "Доступы, безопасность, обязательные инструменты.", link: "#" },
    { h: "Полезные чаты",              p: "Общий, хобби, командные — где задавать вопросы.", link: "#" },
    { h: "Расписание созвонов",        p: "Стендапы, общие синки, регулярные встречи и где их смотреть.", link: "#" },
  ],
  workplace: [
    { h: "Рабочее место",         p: "Выдача/схемы/контакты, требования к оборудованию.", link: "#" },
    { h: "VPN и регионы",         p: "Подключение, политика безопасности, если за пределами офиса.", link: "#" },
    { h: "Система заявок",        p: "Как оформить доступы, адреса, оборудование, пропуска.", link: "#" },
    { h: "Почта и мессенджеры",   p: "Корп. почта, Slack/Telegram — правила и настройки.", link: "#" },
  ],
  communication: [
    { h: "Куда писать и в каких случаях", p: "HR, тимлид, IT-поддержка, финансы, безопасность — маршрутизация вопросов.", link: "#" },
    { h: "Внутренние правила коммуникаций", p: "Этикет, SLA на ответы, формат тикетов и эскалации.", link: "#" },
    { h: "Регламенты созвонов", p: "Подготовка, записи, принятие решений и фоллоу-апы.", link: "#" },
  ],
  faq: [
    { h: "Отпуска и больничные",  p: "Календарь, согласование, оформление заявлений.", link: "#" },
    { h: "Проблемы с доступами",  p: "Куда эскалировать, что приложить к запросу.", link: "#" },
    { h: "Оборудование",          p: "Выдача, обмен, гарантия, возврат.", link: "#" },
    { h: "Компенсации и расходы", p: "Что компенсируем, как подать чеки, сроки выплат.", link: "#" },
  ],
};

// ---------- Сайдбар ----------
const toc = document.getElementById("toc");
SECTIONS.forEach((s) => {
  const btn = document.createElement("button");
  btn.innerHTML = `<span class="title">${s.title}</span><span class="lead">${s.lead}</span>`;
  btn.dataset.target = s.id;
  toc.appendChild(btn);
});
const sidebarBtns = Array.from(toc.children);

// ---------- Рендер карточек из CONTENT ----------
function renderSectionCards() {
  SECTIONS.forEach((s) => {
    const sec = document.getElementById(s.id);
    if (!sec) return;
    let grid = sec.querySelector(".grid");
    if (!grid) {
      grid = document.createElement("div");
      grid.className = "grid";
      sec.appendChild(grid);
    }
    const cards = (CONTENT[s.id] || [])
      .map(
        (c) => `<article class="item card">
          <h3>${c.h}</h3>
          <p>${c.p}</p>
          ${c.link ? `<a class="muted" href="${c.link}" target="_blank" rel="noreferrer">Открыть →</a>` : ""}
        </article>`
      )
      .join("");
    grid.innerHTML = cards;
  });
}

// ---------- Вкладки: показываем только выбранный раздел ----------
const sectionsEls = Array.from(document.querySelectorAll(".section"));
function activateSection(id, { scroll = true, updateHash = true } = {}) {
  sectionsEls.forEach(sec => sec.classList.toggle("hidden", sec.id !== id));
  sidebarBtns.forEach(b => b.classList.toggle("active", b.dataset.target === id));
  if (updateHash && history.replaceState) history.replaceState(null, "", `#${id}`);
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}
function initialSectionId() {
  const fromHash = (location.hash || "").replace("#", "");
  return SECTIONS.find(s => s.id === fromHash)?.id || SECTIONS[0].id;
}
sidebarBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.target;
    if (window.innerWidth < 980) document.getElementById("sidebar").classList.remove("open");
    activateSection(id);
  });
});

// ---------- Прогресс скролла ----------
const progressEl = document.querySelector("#top-progress span");
const onScroll = () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progressEl.style.width = `${pct}%`;
};
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Наверх ----------
document.querySelectorAll(".to-top").forEach(b => b.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" })));
document.getElementById("backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- Мобильное меню ----------
const sidebar = document.getElementById("sidebar");
document.getElementById("menuToggle").addEventListener("click", () => sidebar.classList.toggle("open"));

// ---------- Поиск (только в активном разделе) ----------
const modal = document.getElementById("searchModal");
const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");

const openSearch = () => {
  modal.classList.add("open");
  input.value = "";
  renderSearch();
  input.focus();
};
const closeSearch = () => modal.classList.remove("open");

document.getElementById("openSearch").addEventListener("click", openSearch);
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
  if (e.key === "Escape") closeSearch();
});
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.classList.contains("modal-backdrop")) closeSearch();
});

function buildIndexFor(sectionId) {
  const sec = document.getElementById(sectionId);
  if (!sec) return [];
  const title = sec.querySelector("h2")?.textContent ?? sectionId;
  const items = Array.from(sec.querySelectorAll(".item h3")).map(n => n.textContent);
  return [{ id: sectionId, title, text: title }, ...items.map(t => ({ id: sectionId, title: `${title}: ${t}`, text: t }))];
}
function activeSectionId() {
  return sidebarBtns.find(b => b.classList.contains("active"))?.dataset.target ?? SECTIONS[0].id;
}
function renderSearch() {
  const idx = buildIndexFor(activeSectionId());
  const q = input.value.trim().toLowerCase();
  const data = q ? idx.filter(x => (x.title + " " + (x.text||"")).toLowerCase().includes(q)) : idx;
  results.innerHTML = data.map(d => `
    <button data-id="${d.id}" role="option">
      <div class="res-title">${d.title}</div>
      <div class="res-lead muted">${d.text||""}</div>
    </button>`).join("");

  results.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    closeSearch();
    activateSection(b.dataset.id, { scroll: true });
  }));
}
input.addEventListener("input", renderSearch);

// ---------- Инициализация ----------
renderSectionCards();
activateSection(initialSectionId(), { scroll: false, updateHash: false });
