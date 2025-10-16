// Открытие терминов по хэшу: glossary.htmll#term-pp
const openByHash = () => {
  const id = location.hash.replace('#','');
  if (!id) return;
  const el = document.getElementById(id);
  if (el && el.tagName.toLowerCase() === 'details') el.setAttribute('open', '');
};
window.addEventListener('hashchange', openByHash);
openByHash();
