// === Data ===
const TERMS = [
  { term: "АО", def: "автоответчик" },
  { term: "ССЗ", def: "служба сопровождения заказов" },
  { term: "РГП", def: "Руководитель Группы Продаж" },
  { term: "СВ", def: "супервайзер" },
  { term: "ОМ", def: "специалист отдела мониторинга" },
  { term: "ВП", def: "выявление потребностей" },
  { term: "РСВ", def: "работа с возражениями" },

  { term: "Апрув", def: "процент подтверждённых заказов от общего количества отказов" },
  { term: "Маржа", def: "доходность" },
  { term: "Ленд", def: "одностраничный сайт, где рассказывается о конкретном продукте, соответствующем запросу клиента" },
  { term: "Выкуп", def: "выкупленные заказы клиентов" },
  { term: "ПП", def: "прямые продажи" },
  { term: "ПМ", def: "партнерский маркетинг" },
];

// === Alphabet (RU) ===
const AZ = "А,Б,В,Г,Д,Е,Ё,Ж,З,И,Й,К,Л,М,Н,О,П,Р,С,Т,У,Ф,Х,Ц,Ч,Ш,Щ,Ъ,Ы,Ь,Э,Ю,Я".split(",");

// === Elements ===
const el = id => document.getElementById(id);
const results = el("glResults");
const empty = el("glEmpty");
const search = el("glSearch");
const clearBtn = el("glClear");
const az = el("glAZ");
const sticky = el("glStickyLetter");

// === State ===
let activeLetter = null;
let query = "";

// === Build AZ bar ===
az.innerHTML = AZ.map(ch => `<button data-ch="${ch}">${ch}</button>`).join("");
az.addEventListener("click", (e)=>{
  const btn = e.target.closest("button");
  if (!btn) return;
  const ch = btn.dataset.ch;
  activeLetter = activeLetter === ch ? null : ch;
  [...az.querySelectorAll("button")].forEach(b => b.classList.toggle("active", b.dataset.ch === activeLetter));
  render();
});

// === Search ===
const doSearch = () => { query = (search.value || "").trim().toLowerCase(); render(); };
search.addEventListener("input", doSearch);
clearBtn.addEventListener("click", ()=>{ search.value = ""; doSearch(); search.focus(); });

// === Back FAB ===
document.getElementById("glFabBack").addEventListener("click", () => {
  if (history.length > 1) history.back(); else location.href = "onboarding-2.html";
});

// === Render ===
function render(){
  let data = TERMS.map(t => ({...t, letter: (t.term[0] || "").toUpperCase()}))
                  .sort((a,b)=> a.letter.localeCompare(b.letter, "ru") || a.term.localeCompare(b.term, "ru"));

  if (activeLetter) data = data.filter(t => t.letter === activeLetter);
  if (query) {
    const q = query;
    data = data.filter(t => (t.term + " " + t.def).toLowerCase().includes(q));
  }

  const groups = {};
  for (const item of data) (groups[item.letter] ||= []).push(item);

  const html = Object.keys(groups).sort((a,b)=>a.localeCompare(b,"ru")).map(letter => {
    const items = groups[letter].map(t => `
      <article class="gl-item card">
        <div class="gl-term">${t.term}</div>
        <div class="gl-def">${t.def}</div>
        <button class="gl-more" data-term="${encodeURIComponent(t.term)}" type="button">Показать полностью</button>
      </article>
    `).join("");

    return `
      <div class="gl-group" data-letter="${letter}">
        <div class="gl-group-title">${letter}</div>
        <div class="gl-grid">${items}</div>
      </div>`;
  }).join("");

  results.innerHTML = html;
  empty.hidden = data.length !== 0;

  results.querySelectorAll(".gl-more").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".gl-item");
      const def = card.querySelector(".gl-def");
      const expanded = card.dataset.expanded === "1";
      def.style.display = expanded ? "-webkit-box" : "block";
      def.style.webkitLineClamp = expanded ? "3" : "unset";
      card.dataset.expanded = expanded ? "0" : "1";
      btn.textContent = expanded ? "Показать полностью" : "Свернуть";
    });
  });

  updateSticky();
}

// === Sticky letter logic ===
function updateSticky(){
  const groups = [...results.querySelectorAll(".gl-group")];
  let current = activeLetter || null;
  const y = window.scrollY + 120;
  for (const g of groups) {
    if (g.offsetTop <= y) current = g.dataset.letter;
    else break;
  }
  if (current) { sticky.textContent = current; sticky.hidden = false; }
  else { sticky.hidden = true; }
}
window.addEventListener("scroll", updateSticky, { passive:true });

// === Progress bar ===
const bar = document.querySelector("#gl-progress span");
const onScroll = () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  bar.style.width = `${pct}%`;
};
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// === Init ===
render();
