// Courier helper with autocomplete & external list (with notes)
const cityInput = document.getElementById('cityInput');
const checkBtn  = document.getElementById('checkBtn');
const clearBtn  = document.getElementById('clearBtn');
const result    = document.getElementById('result');
const dataList  = document.getElementById('cityList');
const currentList = document.getElementById('currentList');

let entries = [];     // raw lines (with notes)
let entriesNorm = []; // normalized for search

function normalize(str){
  return (str||'')
    .toLowerCase()
    .replace(/[ё]/g,'е')
    .replace(/[“”"']/g,'')
    .replace(/\s+/g,' ')
    .trim();
}

async function loadCities(){
  const resp = await fetch('courier-cities.txt', {cache:'no-store'});
  const text = await resp.text();
  entries = text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  entriesNorm = entries.map(normalize);
  // fill datalist
  const frag = document.createDocumentFragment();
  entries.forEach(e => { const o=document.createElement('option'); o.value=e; frag.appendChild(o); });
  dataList.innerHTML = ''; dataList.appendChild(frag);
  currentList.textContent = entries.join(', ');
}

function verdict(ok, label){
  if(ok){
    result.className = 'result ok';
    result.textContent = `✅ Курьерская доставка: ${label}`;
  }else{
    result.className = 'result fail';
    result.textContent = '✉️ Не найдено в списке КД — оформляй ПОЧТУ (КД недоступна).';
  }
}

function check(query){
  const q = normalize(query);
  if(!q){ result.className='result muted'; result.textContent='Введите город/посёлок…'; return; }
  // exact first, then includes
  let idx = entriesNorm.findIndex(x => x === q);
  if(idx < 0) idx = entriesNorm.findIndex(x => x.includes(q));
  if(idx >= 0) verdict(true, entries[idx]); else verdict(false, query);
}

cityInput.addEventListener('input', e => { /* live preview */ check(e.target.value); });
checkBtn.addEventListener('click', () => check(cityInput.value));
clearBtn.addEventListener('click', () => { cityInput.value=''; result.className='result muted'; result.textContent='Введите город/посёлок…'; });

loadCities();
