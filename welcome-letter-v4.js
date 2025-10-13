document.addEventListener("DOMContentLoaded", () => {
  // progress
  const bar = document.querySelector("#wl4-progress span");
  const onScroll = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = `${pct}%`;
  };
  document.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Floating back button logic
  const back = () => {
    if (history.length > 1) history.back();
    else location.href = "onboarding-2.html";
  };
  document.getElementById("wl4FabBack").addEventListener("click", back);

  // smooth anchors
  document.querySelectorAll('.wl4-actions a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });

  // reveal
  const revealer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); revealer.unobserve(e.target); }});
  },{threshold:0.15});
  document.querySelectorAll(".reveal").forEach(el=>revealer.observe(el));

  // counters
  const counters = document.querySelectorAll(".counter");
  const runCounter = (el) => {
    const to = +el.dataset.to || 0;
    const dur = 900;
    const t0 = performance.now();
    const tick = (t)=>{
      const k = Math.min(1, (t - t0)/dur);
      el.textContent = Math.round(to * k).toLocaleString("ru-RU");
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const obsCnt = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ runCounter(e.target); obsCnt.unobserve(e.target); }});
  },{threshold:0.6});
  counters.forEach(c=>obsCnt.observe(c));

  // lightbox
  const lb = document.getElementById("wl4-lightbox");
  const lbImg = lb.querySelector("img");
  const openLB = (src, alt) => { lbImg.src = src; lbImg.alt = alt || ""; lb.classList.add("open"); };
  const closeLB = () => lb.classList.remove("open");
  document.querySelectorAll("[data-lightbox]").forEach(el => {
    el.addEventListener("click", () => openLB(el.src, el.alt));
  });
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("backdrop")) closeLB(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLB(); });
});
