// Toggle 'Подробнее' and animate cards on scroll
document.querySelectorAll('.card .toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    card.classList.toggle('open');
    btn.textContent = card.classList.contains('open') ? 'Свернуть' : 'Читать подробнее';
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.setAttribute('data-inview',''); io.unobserve(e.target); }
  })
},{threshold:.2});
document.querySelectorAll('[data-anim]').forEach(el=>io.observe(el));
