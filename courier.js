const cityInput=document.getElementById('cityInput');
const result=document.getElementById('result');
let entries=[];
let normalized=[];

function normalize(str){return str.toLowerCase().replace(/[ё]/g,'е').trim();}

async function loadCities(){
  const r=await fetch('courier-cities.txt');
  const text=await r.text();
  entries=text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  normalized=entries.map(normalize);
  const list=document.getElementById('cityList');
  entries.forEach(e=>{const opt=document.createElement('option');opt.value=e;list.appendChild(opt);});
}

function checkCity(q){
  const n=normalize(q);
  if(!n){result.textContent='Введите город/посёлок...';result.className='result muted';return;}
  const found=normalized.findIndex(v=>v.includes(n));
  if(found>=0){result.textContent='✅ Курьерская доставка: '+entries[found];result.className='result ok';}
  else{result.textContent='✉️ Не найдено — оформляй почту.';result.className='result fail';}
}

cityInput.addEventListener('input',e=>checkCity(e.target.value));
loadCities();
