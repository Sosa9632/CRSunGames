const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const $  = (sel, ctx=document) => ctx.querySelector(sel);

const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

let PRODUCTS = [];
const state = { q: '', platform: '', model: '', sort: '' };

function badgeFor(platform){
  const p = (platform || '').toLowerCase();
  if (p === 'etsy') return '<span class="badge etsy">Etsy</span>';
  if (p === 'ebay') return '<span class="badge ebay">eBay</span>';
  return `<span class="badge">${platform || '—'}</span>`;
}

function card(p){
  const price = isFinite(p.price) ? USD.format(p.price) : '';
  const platformBtn = p.platform?.toLowerCase() === 'etsy' ? 'View on Etsy →' :
                      p.platform?.toLowerCase() === 'ebay' ? 'View on eBay →' : 'View →';
  return `
    <article class="card">
      <img src="${p.img}" alt="${p.title}">
      <div class="pad">
        <h3 class="title">${p.title}</h3>
        <div class="meta">
          ${badgeFor(p.platform)}
          <span class="muted">${p.model || ''}</span>
        </div>
        <div class="price">${price}</div>
        <a class="btn" href="${p.url}" target="_blank" rel="noopener">${platformBtn}</a>
      </div>
    </article>
  `;
}

function applyFilters(data){
  const q = state.q.trim().toLowerCase();
  let out = data.filter(p => {
    if (state.platform && p.platform !== state.platform) return false;
    if (state.model && (p.model || '').toLowerCase() !== state.model.toLowerCase()) return false;
    if (q) {
      const hay = `${p.title} ${p.model}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  switch (state.sort){
    case 'price-asc':  out.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity)); break;
    case 'price-desc': out.sort((a,b)=>(b.price??-Infinity)-(a.price??-Infinity)); break;
    case 'title-asc':  out.sort((a,b)=>String(a.title).localeCompare(String(b.title))); break;
    case 'title-desc': out.sort((a,b)=>String(b.title).localeCompare(String(a.title))); break;
    default: break; // featured = original order
  }
  return out;
}

function render(){
  const grid = $('#grid');
  const empty = $('#empty');
  const items = applyFilters(PRODUCTS);
  grid.innerHTML = items.map(card).join('');
  empty.style.display = items.length ? 'none' : 'block';
}

async function boot(){
  try {
    const res = await fetch('products.json', { cache: 'no-store' });
    PRODUCTS = await res.json();
  } catch (e) {
    console.error('Failed to load products.json', e);
    PRODUCTS = [];
  }
  render();

  // Wire controls
  $('#q').addEventListener('input', (e)=>{ state.q = e.target.value; render(); });
  $('#platform').addEventListener('change', (e)=>{ state.platform = e.target.value; render(); });
  $('#model').addEventListener('change', (e)=>{ state.model = e.target.value; render(); });
  $('#sort').addEventListener('change', (e)=>{ state.sort = e.target.value; render(); });
}

document.addEventListener('DOMContentLoaded', boot);
