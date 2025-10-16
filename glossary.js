// Открывать термин по хэшу: glossary_page.html#term-pp
const openByHash = () => {
  const id = location.hash.replace('#','');
  if (!id) return;
  const el = document.getElementById(id);
  if (el && el.tagName.toLowerCase() === 'details') el.setAttribute('open', '');
};
window.addEventListener('hashchange', openByHash);
openByHash();
