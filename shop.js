const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const grid = document.getElementById('grid');
const empty = document.getElementById('empty');

const platformBadge = (p) => {
  const name = (p || '').toLowerCase();
  if (name === 'etsy') return '<span class="badge etsy">Etsy</span>';
  if (name === 'ebay') return '<span class="badge ebay">eBay</span>';
  return '<span class="badge">Shop</span>';
};

const card = (p) => {
  const price = isFinite(p.price) ? USD.format(p.price) : '';
  const btnLabel = (p.platform || '').toLowerCase() === 'etsy' ? 'View on Etsy →'
                : (p.platform || '').toLowerCase() === 'ebay' ? 'View on eBay →'
                : 'View →';
  const id = `desc-${p.id}`;
  const safeDesc = (p.description || '').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  return `
    <article class="card">
      <div class="imgbox">
        <img src="${p.img}" alt="${p.title}">
      </div>
      <div class="pad">
        <h3 class="title">${p.title}</h3>
        <div class="meta">${platformBadge(p.platform)} · ${p.model || ''}</div>
        <div class="price">${price}</div>

        <div id="${id}" class="desc" aria-expanded="false">${safeDesc}</div>
        <button class="more" data-target="${id}">Read more</button>

        <a class="btn" href="${p.url}" target="_blank" rel="noopener">${btnLabel}</a>
      </div>
    </article>
  `;
};

function wireExpanders(){
  document.querySelectorAll('.more').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-target');
      const d = document.getElementById(id);
      const expanded = d.getAttribute('aria-expanded') === 'true';
      d.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      btn.textContent = expanded ? 'Read more' : 'Show less';
    });
  });
}

async function boot(){
  try {
    const res = await fetch('products.json', { cache: 'no-store' });
    const items = await res.json();
    if (!Array.isArray(items) || !items.length) {
      empty.style.display = 'block';
      return;
    }
    // Render ALL products (Etsy-style browse page)
    grid.innerHTML = items.map(card).join('');
    wireExpanders();
  } catch (err) {
    console.error('Failed to load products.json', err);
    empty.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', boot);
