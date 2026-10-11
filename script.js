const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const money = n => '₹' + n.toLocaleString('en-IN');

const store = {
    get(key, fallback) {
        try {
            const v = JSON.parse(localStorage.getItem(key));
            return v === null || v === undefined ? fallback : v;
        } catch (e) { return fallback; }
    },
    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    }
};

/* ---------- Product icons (simple SVG shapes) ---------- */
const icons = {
    shirt: c => `<svg viewBox="0 0 80 80" fill="none"><rect x="20" y="10" width="40" height="50" rx="6" fill="${c}"/><rect x="10" y="14" width="20" height="12" rx="4" fill="${c}"/><rect x="50" y="14" width="20" height="12" rx="4" fill="${c}"/></svg>`,
    jeans: c => `<svg viewBox="0 0 80 80" fill="none"><rect x="15" y="12" width="50" height="60" rx="8" fill="${c}"/><rect x="15" y="32" width="50" height="3" fill="rgba(0,0,0,0.15)"/><rect x="15" y="22" width="10" height="12" fill="rgba(0,0,0,0.15)"/><rect x="55" y="22" width="10" height="12" fill="rgba(0,0,0,0.15)"/></svg>`,
    hoodie: c => `<svg viewBox="0 0 80 80" fill="none"><rect x="18" y="10" width="44" height="54" rx="8" fill="${c}"/><rect x="8" y="14" width="22" height="14" rx="5" fill="${c}"/><rect x="50" y="14" width="22" height="14" rx="5" fill="${c}"/><rect x="18" y="10" width="44" height="18" rx="8" fill="rgba(255,255,255,0.18)"/></svg>`,
    dress: c => `<svg viewBox="0 0 80 80" fill="none"><path d="M40 10 Q55 14 60 26 L60 70 Q40 76 20 70 L20 26 Q25 14 40 10Z" fill="${c}"/></svg>`,
    jacket: c => `<svg viewBox="0 0 80 80" fill="none"><rect x="18" y="10" width="44" height="58" rx="6" fill="${c}"/><rect x="8" y="14" width="22" height="16" rx="5" fill="${c}"/><rect x="50" y="14" width="22" height="16" rx="5" fill="${c}"/><rect x="38" y="14" width="4" height="50" fill="rgba(255,255,255,0.15)"/></svg>`,
    shoe: c => `<svg viewBox="0 0 80 80" fill="none"><path d="M8 54 L8 38 Q30 38 38 26 L48 32 Q60 44 74 46 L74 54 Z" fill="${c}"/><rect x="8" y="54" width="66" height="6" rx="3" fill="rgba(0,0,0,0.3)"/></svg>`,
    glasses: c => `<svg viewBox="0 0 80 80" fill="none"><circle cx="24" cy="42" r="14" fill="${c}"/><circle cx="56" cy="42" r="14" fill="${c}"/><rect x="36" y="38" width="8" height="4" fill="${c}"/></svg>`,
    bag: c => `<svg viewBox="0 0 80 80" fill="none"><path d="M28 28 Q28 12 40 12 Q52 12 52 28" stroke="${c}" stroke-width="5" fill="none"/><rect x="12" y="28" width="56" height="42" rx="8" fill="${c}"/></svg>`
};

/* ---------- Product data ---------- */
// g = men / women / kids   |   type = tops, bottoms, jackets, dresses, footwear, accessories
const products = [
    { id: 1, name: 'Casual T-Shirt', g: 'men', type: 'tops', tag: 'Menswear · Cotton', price: 499, old: null, badge: 'new', bg: '#e8efe8', icon: icons.shirt('#2d6a2d'), desc: 'Soft breathable cotton tee with a relaxed fit. Perfect for everyday wear.' },
    { id: 2, name: 'Blue Jeans', g: 'men', type: 'bottoms', tag: 'Bottomwear · Denim', price: 999, old: 1499, badge: 'sale', bg: '#dde6f0', icon: icons.jeans('#2255a4'), desc: 'Classic straight-fit denim with stretch for all-day comfort.' },
    { id: 3, name: 'Winter Hoodie', g: 'men', type: 'jackets', tag: 'Outerwear · Fleece', price: 1299, old: null, badge: null, bg: '#f0eae0', icon: icons.hoodie('#8b4513'), desc: 'Warm fleece-lined hoodie with a kangaroo pocket. Built for cold mornings.' },
    { id: 4, name: 'Stylish Dress', g: 'women', type: 'dresses', tag: 'Womenswear · Linen', price: 1499, old: null, badge: 'new', bg: '#f5eef8', icon: icons.dress('#9b59b6'), desc: 'Lightweight linen dress with a flattering flare. Great for brunch or festive days.' },
    { id: 5, name: 'Leather Jacket', g: 'men', type: 'jackets', tag: 'Outerwear · Leather', price: 2499, old: 3299, badge: 'sale', bg: '#e8e4e0', icon: icons.jacket('#2c2c2c'), desc: 'Biker-style jacket in premium faux leather with a smooth inner lining.' },
    { id: 6, name: 'Kids Graphic Tee', g: 'kids', type: 'tops', tag: 'Kidswear · Cotton', price: 349, old: null, badge: 'new', bg: '#fff4d6', icon: icons.shirt('#e6a700'), desc: 'Fun printed tee made from skin-friendly cotton that survives playtime.' },
    { id: 7, name: 'Running Sneakers', g: 'men', type: 'footwear', tag: 'Footwear · Mesh', price: 1799, old: 2299, badge: 'sale', bg: '#e6eef5', icon: icons.shoe('#34495e'), desc: 'Lightweight mesh sneakers with a cushioned sole for walks and workouts.' },
    { id: 8, name: 'Floral Kurti', g: 'women', type: 'tops', tag: 'Womenswear · Rayon', price: 799, old: null, badge: null, bg: '#fdeceb', icon: icons.dress('#e74c3c'), desc: 'Easy-breezy printed kurti, comfortable for office and casual outings.' },
    { id: 9, name: 'Aviator Sunglasses', g: 'men', type: 'accessories', tag: 'Accessories · UV400', price: 599, old: null, badge: null, bg: '#eceae4', icon: icons.glasses('#333'), desc: 'Timeless aviator frames with UV400 protection lenses.' },
    { id: 10, name: 'Kids Denim Dungaree', g: 'kids', type: 'bottoms', tag: 'Kidswear · Denim', price: 899, old: 1199, badge: 'sale', bg: '#dfeaf5', icon: icons.jeans('#3a78c2'), desc: 'Sturdy yet soft denim dungaree with adjustable straps.' },
    { id: 11, name: 'Classic Handbag', g: 'women', type: 'accessories', tag: 'Accessories · Faux Leather', price: 1299, old: null, badge: 'new', bg: '#f6ece3', icon: icons.bag('#b5651d'), desc: 'Roomy handbag with a zip closure and inner pockets for daily essentials.' },
    { id: 12, name: 'Comfy Sandals', g: 'women', type: 'footwear', tag: 'Footwear · Synthetic', price: 699, old: 999, badge: 'sale', bg: '#f3e9f5', icon: icons.shoe('#c0558a'), desc: 'Cushioned footbed sandals that stay comfortable all day long.' }
];

const byId = id => products.find(p => p.id === Number(id));

/* ---------- State ---------- */
const FREE_SHIP_MIN = 999;
const SHIPPING_FEE = 99;
const COUPONS = { INDIA10: 10, FIRST20: 20 };   // code -> % off

let cart = store.get('indiacart_cart', {});       // { productId: qty }
let wish = store.get('indiacart_wish', []);       // [productId]
let coupon = store.get('indiacart_coupon', null); // { code, pct } or null
let view = { filter: 'all', query: '', sort: 'featured' };

const titles = {
    all: 'Featured Products', men: "Men's Collection", women: "Women's Collection",
    kids: "Kids' Collection", sale: 'Sale — Best Deals', jackets: 'Jackets',
    footwear: 'Footwear', accessories: 'Accessories', wishlist: 'My Wishlist'
};

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

/* ---------- Product grid ---------- */
function matchesFilter(p) {
    const f = view.filter;
    if (f === 'all') return true;
    if (f === 'sale') return !!p.old;
    if (f === 'wishlist') return wish.includes(p.id);
    if (['men', 'women', 'kids'].includes(f)) return p.g === f;
    return p.type === f;
}

function visibleProducts() {
    const q = view.query.trim().toLowerCase();
    let list = products.filter(p => matchesFilter(p) &&
        (!q || (p.name + ' ' + p.tag + ' ' + p.g).toLowerCase().includes(q)));

    if (view.sort === 'low') list.sort((a, b) => a.price - b.price);
    else if (view.sort === 'high') list.sort((a, b) => b.price - a.price);
    else if (view.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
}

function renderProducts() {
    const grid = $('#product-grid');
    const list = visibleProducts();

    $('#grid-title').textContent = titles[view.filter] || 'Products';
    $('#result-count').textContent = list.length + (list.length === 1 ? ' product' : ' products');

    if (!list.length) {
        grid.innerHTML = `<div class="empty-state"><strong>Kuch nahi mila 😕</strong>${view.filter === 'wishlist' ? 'Wishlist abhi khali hai. Kisi product ke ♡ par click karo.' : 'Dusra search ya filter try karo.'}</div>`;
        return;
    }

    grid.innerHTML = list.map(p => `
        <div class="product-card" data-id="${p.id}">
            ${p.badge ? `<div class="badge ${p.badge}">${p.badge === 'new' ? 'New' : 'Sale'}</div>` : ''}
            <button class="wish-btn ${wish.includes(p.id) ? 'active' : ''}" data-wish="${p.id}" aria-label="Add to wishlist">${wish.includes(p.id) ? '♥' : '♡'}</button>
            <div class="product-img" style="background:${p.bg};">${p.icon}</div>
            <div class="product-info">
                <div class="category">${p.tag}</div>
                <h4>${p.name}</h4>
                <div class="product-footer">
                    <div class="price">${money(p.price)}${p.old ? ` <span class="old">${money(p.old)}</span>` : ''}</div>
                    <button class="buy-btn" data-add="${p.id}">Add to Cart</button>
                </div>
            </div>
        </div>`).join('');
}

/* ---------- Filters (nav, categories, footer links) ---------- */
function setFilter(f, scroll = true) {
    view.filter = f;
    $$('#main-nav a[data-filter]').forEach(a => a.classList.toggle('active', a.dataset.filter === f));
    renderProducts();
    if (scroll) $('#products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('click', e => {
    const f = e.target.closest('[data-filter]');
    if (f) {
        e.preventDefault();
        $('#search-input').value = '';
        view.query = '';
        setFilter(f.dataset.filter, f.dataset.filter !== 'all' || !f.closest('nav'));
        if (f.dataset.filter === 'all' && f.classList.contains('logo')) window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    if (e.target.closest('[data-scroll="footer"]')) {
        e.preventDefault();
        $('#footer-contact').scrollIntoView({ behavior: 'smooth' });
    }
});

$('#hero-btn').addEventListener('click', e => {
    e.preventDefault();
    $('#products').scrollIntoView({ behavior: 'smooth' });
});

/* ---------- Search & sort ---------- */
let searchTimer;
$('#search-input').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        view.query = e.target.value;
        if (view.filter === 'wishlist') setFilter('all', false); else renderProducts();
    }, 150);
});

$('#sort-select').addEventListener('change', e => {
    view.sort = e.target.value;
    renderProducts();
});

/* ---------- Wishlist ---------- */
function toggleWish(id) {
    id = Number(id);
    const i = wish.indexOf(id);
    if (i === -1) { wish.push(id); toast('Wishlist mein add ho gaya ♥'); }
    else { wish.splice(i, 1); toast('Wishlist se hata diya'); }
    store.set('indiacart_wish', wish);
    updateBadges();
    renderProducts();
}

$('#wish-open').addEventListener('click', e => {
    e.preventDefault();
    closeModal();
    closeCart();
    setFilter('wishlist');
});

/* ---------- Cart logic ---------- */
function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }

function totals() {
    const subtotal = Object.entries(cart).reduce((s, [id, q]) => s + byId(id).price * q, 0);
    const discount = coupon ? Math.round(subtotal * coupon.pct / 100) : 0;
    const after = subtotal - discount;
    const shipping = subtotal === 0 ? 0 : (after >= FREE_SHIP_MIN ? 0 : SHIPPING_FEE);
    return { subtotal, discount, shipping, total: after + shipping, after };
}

function saveCart() {
    store.set('indiacart_cart', cart);
    store.set('indiacart_coupon', coupon);
    updateBadges();
    renderCart();
}

function addToCart(id, qty = 1) {
    id = Number(id);
    cart[id] = (cart[id] || 0) + qty;
    saveCart();
    toast(byId(id).name + ' cart mein add ho gaya 🛒');
}

function changeQty(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
}

function removeItem(id) {
    delete cart[id];
    saveCart();
}

function updateBadges() {
    $('#cart-count').textContent = cartCount();
    $('#wish-count').textContent = wish.length;
}

/* ---------- Cart drawer ---------- */
function renderCart() {
    const body = $('#cart-body');
    const foot = $('#cart-foot');
    const ids = Object.keys(cart);

    if (!ids.length) {
        body.innerHTML = '<div class="cart-empty">🛍️<br><br>Aapka cart khali hai.<br>Kuch achha sa pasand karo!</div>';
        foot.innerHTML = '';
        foot.style.display = 'none';
        return;
    }
    foot.style.display = '';

    body.innerHTML = ids.map(id => {
        const p = byId(id), q = cart[id];
        return `
        <div class="cart-item">
            <div class="ci-thumb" style="background:${p.bg};">${p.icon}</div>
            <div class="ci-info">
                <h4>${p.name}</h4>
                <div class="ci-price">${money(p.price)} each</div>
                <div class="ci-row">
                    <div class="qty">
                        <button data-qty="-1" data-id="${p.id}" aria-label="Decrease">−</button>
                        <span>${q}</span>
                        <button data-qty="1" data-id="${p.id}" aria-label="Increase">+</button>
                    </div>
                    <div class="ci-total">${money(p.price * q)}</div>
                </div>
                <button class="ci-remove" data-remove="${p.id}">Remove</button>
            </div>
        </div>`;
    }).join('');

    const t = totals();
    const remaining = FREE_SHIP_MIN - t.after;
    const pct = Math.min(100, Math.round(t.after / FREE_SHIP_MIN * 100));

    foot.innerHTML = `
        <div class="ship-note">${remaining > 0
            ? `Free shipping ke liye ${money(remaining)} aur add karo`
            : '🎉 Aapko free shipping mil gayi!'}</div>
        <div class="ship-bar"><div style="width:${pct}%"></div></div>

        <form class="coupon" id="coupon-form">
            <input type="text" id="coupon-input" placeholder="Coupon code" value="${coupon ? coupon.code : ''}" aria-label="Coupon code">
            <button type="submit">${coupon ? 'Change' : 'Apply'}</button>
        </form>
        <div class="coupon-msg" id="coupon-msg">${coupon ? `✓ ${coupon.code} lag gaya (${coupon.pct}% off)` : 'Try: INDIA10 ya FIRST20'}</div>

        <div class="totals">
            <div><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
            ${t.discount ? `<div class="disc"><span>Discount</span><span>− ${money(t.discount)}</span></div>` : ''}
            <div><span>Shipping</span><span>${t.shipping ? money(t.shipping) : 'Free'}</span></div>
            <div class="grand"><span>Total</span><span>${money(t.total)}</span></div>
        </div>
        <button class="primary-btn" id="checkout-btn">Checkout</button>
        <button class="primary-btn dark" id="clear-btn" style="margin-top:8px;">Clear Cart</button>`;
}

function openCart() {
    closeModal();
    renderCart();
    $('#cart-drawer').classList.add('open');
    $('#overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    $('#cart-drawer').classList.remove('open');
    if (!$('#modal').classList.contains('open')) {
        $('#overlay').classList.remove('show');
        document.body.style.overflow = '';
    }
}

$('#cart-open').addEventListener('click', e => { e.preventDefault(); openCart(); });
$('#cart-close').addEventListener('click', closeCart);

$('#cart-drawer').addEventListener('click', e => {
    const q = e.target.closest('[data-qty]');
    if (q) return changeQty(q.dataset.id, Number(q.dataset.qty));
    const r = e.target.closest('[data-remove]');
    if (r) return removeItem(r.dataset.remove);

    if (e.target.id === 'clear-btn') {
        cart = {};
        coupon = null;
        saveCart();
        toast('Cart khali kar diya');
    }
    if (e.target.id === 'checkout-btn') {
        const t = totals();
        cart = {};
        coupon = null;
        saveCart();
        closeCart();
        toast(`Order place ho gaya! Total ${money(t.total)} (demo) 🎉`);
    }
});

$('#cart-drawer').addEventListener('submit', e => {
    if (e.target.id !== 'coupon-form') return;
    e.preventDefault();
    const code = $('#coupon-input').value.trim().toUpperCase();
    if (COUPONS[code]) {
        coupon = { code, pct: COUPONS[code] };
        saveCart();
        toast('Coupon lag gaya ✓');
    } else {
        const msg = $('#coupon-msg');
        msg.textContent = code ? 'Ye coupon valid nahi hai' : 'Coupon code likho';
        msg.classList.add('err');
    }
});

/* ---------- Quick view modal ---------- */
function openModal(id) {
    const p = byId(id);
    const liked = wish.includes(p.id);
    $('#modal-content').innerHTML = `
        <div class="qv">
            <div class="qv-img" style="background:${p.bg};">${p.icon}</div>
            <div class="qv-info">
                <div class="category">${p.tag}</div>
                <h3>${p.name}</h3>
                <div class="price">${money(p.price)}${p.old ? ` <span class="old">${money(p.old)}</span>` : ''}</div>
                <p>${p.desc}</p>
                <div class="qv-actions">
                    <button class="primary-btn" data-add="${p.id}" data-close="1">Add to Cart</button>
                    <button class="wish-inline ${liked ? 'active' : ''}" data-wish="${p.id}" aria-label="Toggle wishlist">${liked ? '♥' : '♡'}</button>
                </div>
            </div>
        </div>`;
    $('#modal').classList.add('open');
    $('#overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    $('#modal').classList.remove('open');
    if (!$('#cart-drawer').classList.contains('open')) {
        $('#overlay').classList.remove('show');
        document.body.style.overflow = '';
    }
}

$('#modal-close').addEventListener('click', closeModal);

$('#modal').addEventListener('click', e => {
    const w = e.target.closest('[data-wish]');
    if (w) {
        toggleWish(w.dataset.wish);
        const on = wish.includes(Number(w.dataset.wish));
        w.classList.toggle('active', on);
        w.textContent = on ? '♥' : '♡';
        return;
    }
    const a = e.target.closest('[data-add]');
    if (a) {
        addToCart(a.dataset.add);
        closeModal();
    }
});

/* ---------- Grid clicks (add / wishlist / quick view) ---------- */
$('#product-grid').addEventListener('click', e => {
    const w = e.target.closest('[data-wish]');
    if (w) return toggleWish(w.dataset.wish);

    const a = e.target.closest('[data-add]');
    if (a) {
        addToCart(a.dataset.add);
        a.textContent = 'Added ✓';
        setTimeout(() => { a.textContent = 'Add to Cart'; }, 900);
        return;
    }
    const card = e.target.closest('.product-card');
    if (card) openModal(card.dataset.id);
});

/* ---------- Overlay + Escape ---------- */
$('#overlay').addEventListener('click', () => { closeCart(); closeModal(); });
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCart(); closeModal(); }
});

/* ---------- Newsletter ---------- */
$('#newsletter-form').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#newsletter-email');
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    if (ok) { toast('Subscribe karne ke liye shukriya! 💌'); input.value = ''; }
    else toast('Sahi email address daalo');
});

/* ---------- Back to top ---------- */
const toTop = $('#to-top');
window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 500));
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Init ---------- */
// Purane cart mein agar koi invalid product ho to hata do
Object.keys(cart).forEach(id => { if (!byId(id)) delete cart[id]; });
updateBadges();
renderProducts();
renderCart();