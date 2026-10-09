/* The Velvet Plate — front end (vanilla JS, no build step).
 *
 * Edit MENU and STOPS below to change what the site shows.
 * Keep ids in sync with schema.sql: the server prices orders from the database.
 *
 * Mode comes from config.js:
 *   web/config.js   -> { mode: 'live' }  real checkout through the Go API + Stripe
 *   demo/config.js  -> { mode: 'demo' }  everything simulated in localStorage
 */
'use strict';

const CONFIG = window.VELVET_CONFIG || { mode: 'live' };
const DEMO = CONFIG.mode === 'demo';

/* ---------------------------------------------------------------
 * MENU — sample BBQ favorites. Prices in cents.
 * image: EITHER a local file   'images/lamb-chop.png'
 *        OR any public link    'https://example.com/photos/lamb-chop.png'
 * Current links are sample photos from Wikimedia Commons (swap for your own).
 * A broken or missing image falls back to the tinted "photo" frame.
 * ------------------------------------------------------------- */
const MENU = [
  // Plates
  { id: 'velvet-brisket-plate', name: 'Velvet Brisket Plate', description: 'Sliced oak-smoked brisket, pickles, onion, white bread.', priceCents: 1800, category: 'Plates', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brisketphoto.jpg?width=800', featured: true },
  { id: 'bark-bone-ribs', name: 'Bark & Bone Ribs', description: 'Glazed St. Louis ribs, half rack.', priceCents: 2200, category: 'Plates', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Spareribs_20160506_182617113.jpg?width=800', featured: true },
  { id: 'pulled-pork-plate', name: 'Pulled Pork Plate', description: 'Shoulder, vinegar pepper sauce on the side.', priceCents: 1500, category: 'Plates', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pulled_pork,_baked_beans_and_mac_%26_cheese_from_Peg_Leg_Porker_in_Nashville,_TN.jpg?width=800' },
  { id: 'lamb-chop', name: 'Lamb Chop', description: 'Two smoked lamb chops, rosemary salt, charred scallion.', priceCents: 2600, category: 'Plates', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lamb_chops_2014-03-06_12-39.jpg?width=800', featured: true },
  { id: 'hot-link-plate', name: 'Hot Link Plate', description: 'Beef hot links, mustard slaw.', priceCents: 1400, category: 'Plates', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hot_chorizo_links.jpg?width=800' },
  { id: 'smoked-chicken', name: 'Smoked Chicken Quarter', description: 'Dry-rubbed, skin on.', priceCents: 1300, category: 'Plates', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chicken_BBQ.jpg?width=800' },
  // Sandwiches
  { id: 'brisket-sandwich', name: 'Brisket Sandwich', description: 'Chopped brisket, pickles, house sauce.', priceCents: 1400, category: 'Sandwiches', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brisket_(3849368711).jpg?width=800' },
  { id: 'pulled-pork-sandwich', name: 'Pulled Pork Sandwich', description: 'Shoulder, slaw.', priceCents: 1200, category: 'Sandwiches', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pulled_pork_sandwich.jpg?width=800' },
  // Sides
  { id: 'mac-cheese', name: 'Mac & Cheese', description: 'Smoked gouda.', priceCents: 500, category: 'Sides', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Original_Mac_n_Cheese_.jpg?width=800' },
  { id: 'collard-greens', name: 'Collard Greens', description: 'Potlikker, pepper vinegar.', priceCents: 450, category: 'Sides', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Collard-Greens-Bundle.jpg?width=800' },
  { id: 'baked-beans', name: 'Baked Beans', description: 'Molasses, burnt ends bits.', priceCents: 450, category: 'Sides', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Baked_beans_in_tomato_sauce.jpg?width=800' },
  { id: 'potato-salad', name: 'Potato Salad', description: 'Mustard, egg.', priceCents: 400, category: 'Sides', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Potato_salad_(1).jpg?width=800' },
  { id: 'cornbread', name: 'Cornbread', description: 'Honey butter.', priceCents: 300, category: 'Sides', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Skillet_cornbread_(cropped).jpg?width=800' },
  // Drinks
  { id: 'sweet-tea', name: 'Sweet Tea', description: 'Brewed daily.', priceCents: 250, category: 'Drinks', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Iced_Tea_from_flickr.jpg?width=800' },
  { id: 'unsweet-tea', name: 'Unsweet Tea', description: 'Brewed daily.', priceCents: 250, category: 'Drinks', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Iced_Tea_from_flickr.jpg?width=800' },
  { id: 'house-lemonade', name: 'House Lemonade', description: 'Fresh squeezed.', priceCents: 300, category: 'Drinks', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lemonade_-_27682817724.jpg?width=800' },
];

/* ---------------------------------------------------------------
 * CHEF — owner / chef section.
 * photo: EITHER a local file   'images/chef.png'   (drop the file in images/)
 *        OR any public link    'https://example.com/thomas-smith.png'
 * Leave photo empty ('') to show the "Chef photo" frame.
 * ------------------------------------------------------------- */
const CHEF = {
  name: 'Thomas Smith IV',
  title: 'Owner & Chef',
  hometown: 'Louisville, KY — Derby City',
  photo: 'images/chef.png',
  photoCaption: '',
  facts: [
    { value: '7', label: 'Age he started cooking' },
    { value: '15+', label: 'Years in kitchens' },
    { value: 'KY', label: 'Derby City roots' },
  ],
  bio: [
    "Hey everyone! I'm Thomas Smith IV, a 31-year-old entrepreneur from Louisville, KY, also known as Derby City. My family has always been big on starting businesses, and I've been around it since I was a kid.",
    "I started learning how to cook when I was just 7 years old, hanging out in the kitchen with my grandma and mom. At 15, I got into selling food at parks, which really got me interested in cooking. Over the past 15 years, I've gone from working at Sonic drive-ins to leading multi-million dollar restaurants, focusing on solving problems and making customers happy.",
    "I have picked up a lot from my grandma Norma, my mom, Lisa, and my dad, Thomas III. They've taught me a ton about cooking. Now, as the owner of The Velvet Plate, I'm excited to welcome everyone to come try our delicious Southern food and experience some real Southern Elegance!",
  ],
  family: [
    { name: 'Grandma Norma', role: 'First teacher' },
    { name: 'Mom, Lisa', role: 'Kitchen partner' },
    { name: 'Dad, Thomas III', role: 'Business sense' },
  ],
  quote: 'Come try our delicious Southern food and experience some real Southern Elegance!',
};

/* ---------------------------------------------------------------
 * STOPS — this week's Huntsville stops (sample).
 * day: 0=Sun … 6=Sat. open/close: 24h "HH:MM".
 * ------------------------------------------------------------- */
const STOPS = [
  { id: 'big-spring-park', name: 'Big Spring Park', address: 'Downtown Huntsville', lat: 34.7276, lng: -86.5863, day: 4, open: '11:00', close: '14:00' },
  { id: 'campus-805', name: 'Campus 805', address: 'Clinton Ave W', lat: 34.7298, lng: -86.6048, day: 5, open: '11:00', close: '14:30' },
  { id: 'stovehouse', name: 'Stovehouse', address: 'Governors Dr SW', lat: 34.7271, lng: -86.6004, day: 5, open: '16:30', close: '20:00' },
  { id: 'midcity', name: 'MidCity', address: 'University Dr', lat: 34.7426, lng: -86.5869, day: 6, open: '11:00', close: '15:00' },
  { id: 'lowe-mill', name: 'Lowe Mill', address: 'Seminole Dr SW', lat: 34.7274, lng: -86.6040, day: 6, open: '16:00', close: '20:00' },
];

const MAP_CENTER = [-86.5861, 34.7304]; // lng, lat
const MAP_ZOOM = 12;
const CATEGORIES = ['All', 'Plates', 'Sandwiches', 'Sides', 'Drinks'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const KEYS = { cart: 'velvet-plate-cart', stop: 'velvet-plate-stop', demoOrders: 'velvet-plate-demo-orders', photos: 'velvet-plate-photos' };

const $ = (sel) => document.querySelector(sel);
const money = (c) => '$' + (c / 100).toFixed(2);
const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const byId = (list, id) => list.find((x) => x.id === id);

/* ---------- storage (safe) ---------- */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* private mode */ } },
  remove(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
};

/* ---------- time helpers ---------- */
function toMinutes(hhmm) { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; }
function fmtTime(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}
function hoursLabel(s) { return `${fmtTime(toMinutes(s.open))} – ${fmtTime(toMinutes(s.close))}`; }
function dayShort(s) { return DAY_NAMES[s.day].slice(0, 3); }
function isoDate(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function parseIso(str) { const [y, m, d] = str.split('-').map(Number); return new Date(y, m - 1, d); }
function nowMinutes() { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); }

// Next date this stop runs (today counts if there is still a pickup window left).
function nextDateFor(stop) {
  const d = new Date();
  for (let i = 0; i < 8; i++) {
    if (d.getDay() === stop.day && (i > 0 || nowMinutes() < toMinutes(stop.close) - 30)) return new Date(d);
    d.setDate(d.getDate() + 1);
  }
  return d;
}

function windowsFor(stop, dateStr) {
  const out = [];
  const isToday = dateStr === isoDate(new Date());
  for (let t = toMinutes(stop.open); t + 30 <= toMinutes(stop.close); t += 30) {
    if (isToday && t + 30 <= nowMinutes() + 20) continue; // need ~20 min lead
    out.push(`${fmtTime(t)} – ${fmtTime(t + 30)}`);
  }
  return out;
}

/* ---------- state ---------- */
const state = {
  cart: store.get(KEYS.cart, {}),
  stopId: store.get(KEYS.stop, null),
  category: 'All',
};
if (!byId(STOPS, state.stopId)) state.stopId = null;
// Drop cart entries that are no longer on the menu.
for (const id of Object.keys(state.cart)) if (!byId(MENU, id)) delete state.cart[id];

function saveCart() { store.set(KEYS.cart, state.cart); }
function cartCount() { return Object.values(state.cart).reduce((a, b) => a + b, 0); }
function cartLines() {
  return Object.entries(state.cart)
    .map(([id, qty]) => ({ item: byId(MENU, id), qty }))
    .filter((l) => l.item && l.qty > 0);
}
function cartTotal() { return cartLines().reduce((sum, l) => sum + l.item.priceCents * l.qty, 0); }

function setQty(id, qty) {
  if (qty <= 0) delete state.cart[id];
  else state.cart[id] = Math.min(qty, 50);
  saveCart();
  renderCart();
}

/* ---------- toast + notice ---------- */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2200);
}
function notice(msg, kind = 'info') {
  const el = $('#notice');
  if (!msg) { el.classList.add('hidden'); return; }
  el.className = 'mb-6 rounded-2xl px-5 py-4 text-sm ' +
    (kind === 'error' ? 'bg-wine/60 border border-wine text-cream' : 'bg-honey/15 border border-honey/40 text-cream');
  el.textContent = msg;
}

/* ---------- picture boxes ---------- */
// Demo only: photos swapped in the browser (URL or uploaded PNG/JPG) are kept here.
const photoOverrides = DEMO ? store.get(KEYS.photos, {}) : {};
function photoFor(key, configured) { return photoOverrides[key] || configured || ''; }

// box: .picbox element; key: 'chef' or a menu item id (used by the demo photo editor)
function hydratePic(box, src, label = 'photo', key = '') {
  box.innerHTML = `<span class="pic-label">${esc(label)}</span>`;
  if (key) box.dataset.photoKey = key;
  if (src) {
    const img = new Image();
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.onerror = () => img.remove(); // broken link or missing file: keep the tinted frame
    img.src = src;
    box.appendChild(img);
  }
  if (DEMO && key) {
    box.insertAdjacentHTML('beforeend',
      `<button type="button" data-edit-photo="${esc(key)}" class="absolute bottom-3 right-3 z-10 rounded-full bg-char/80 hover:bg-ember text-cream text-xs px-3 py-1.5 backdrop-blur border border-cream/20 transition">${src ? 'Change photo' : 'Add photo'}</button>`);
  }
}

/* ---------- chef ---------- */
function renderChef() {
  hydratePic($('#chef-photo'), photoFor('chef', CHEF.photo), 'Chef photo', 'chef');
  $('#chef-caption').textContent = CHEF.photoCaption || '';
  $('#chef-title').textContent = CHEF.title;
  $('#chef-name').textContent = CHEF.name;
  $('#chef-hometown').textContent = CHEF.hometown;
  $('#chef-facts').innerHTML = (CHEF.facts || []).map((f) => `
    <li class="rounded-2xl bg-char/50 border border-copper/25 px-3 py-4 text-center">
      <p class="font-display text-3xl font-semibold text-honey">${esc(f.value)}</p>
      <p class="mt-1 text-[11px] uppercase tracking-widest text-cream/55">${esc(f.label)}</p>
    </li>`).join('');
  $('#chef-bio').innerHTML = (CHEF.bio || []).map((p, i) =>
    `<p class="${i === 0 ? 'text-xl text-cream' : ''}">${esc(p)}</p>`).join('');
  $('#chef-family').innerHTML = (CHEF.family || []).length ? `
    <p class="text-xs uppercase tracking-[.3em] text-copper mb-3">Taught by family</p>
    <ul class="flex flex-wrap gap-2">${CHEF.family.map((f) => `
      <li class="rounded-full border border-copper/35 px-4 py-2 text-sm"><span class="text-cream">${esc(f.name)}</span>
      <span class="text-cream/45"> · ${esc(f.role)}</span></li>`).join('')}</ul>` : '';
  $('#chef-quote').textContent = CHEF.quote ? `“${CHEF.quote}”` : '';
  $('#chef-quote').classList.toggle('hidden', !CHEF.quote);
}

/* ---------- demo photo editor (paste a link or upload a PNG/JPG) ---------- */
function photoLabel(key) { return key === 'chef' ? CHEF.name : (byId(MENU, key) || {}).name || key; }
function configuredPhoto(key) { return key === 'chef' ? CHEF.photo : (byId(MENU, key) || {}).image; }

function savePhotoOverrides() {
  try { localStorage.setItem(KEYS.photos, JSON.stringify(photoOverrides)); return true; }
  catch { return false; }
}

// Shrink uploads so they fit in localStorage (keeps PNG transparency when small).
function fileToDataUrl(file, maxSide = 1100) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        let out = c.toDataURL('image/png');
        if (out.length > 900000) out = c.toDataURL('image/jpeg', 0.85);
        resolve(out);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function buildPhotoDialog() {
  document.body.insertAdjacentHTML('beforeend', `
  <dialog id="photo-dialog" class="rounded-3xl bg-char text-cream border border-copper/40 p-0 w-[min(92vw,460px)] backdrop:bg-black/60">
    <form method="dialog" class="p-6 space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[.3em] text-copper">Demo photo</p>
          <h3 id="pd-title" class="font-display text-2xl font-semibold mt-1"></h3>
        </div>
        <button value="cancel" class="text-cream/50 hover:text-cream text-2xl leading-none" aria-label="Close">×</button>
      </div>
      <div id="pd-preview" class="picbox rounded-2xl aspect-[4/3]"></div>
      <label class="block text-sm">
        <span class="block mb-1.5 text-cream/70">Paste an image link (PNG or JPG)</span>
        <input id="pd-url" type="url" class="field" placeholder="https://…/photo.png" />
      </label>
      <label class="block text-sm">
        <span class="block mb-1.5 text-cream/70">…or upload a file from this computer</span>
        <input id="pd-file" type="file" accept="image/png,image/jpeg,image/webp" class="block w-full text-sm text-cream/70 file:mr-3 file:rounded-full file:border-0 file:bg-cream file:text-char file:px-4 file:py-2 file:font-medium" />
      </label>
      <p id="pd-msg" class="text-xs text-cream/50">Saved in this browser only. To make it permanent, put the link in app.js.</p>
      <div class="flex flex-wrap gap-2 justify-between pt-2">
        <button type="button" id="pd-reset" class="rounded-full border border-cream/25 hover:border-honey px-4 py-2 text-sm">Use original</button>
        <div class="flex gap-2">
          <button type="button" id="pd-export" class="rounded-full border border-cream/25 hover:border-honey px-4 py-2 text-sm">Copy links</button>
          <button type="button" id="pd-save" class="rounded-full bg-ember hover:bg-[#d4692f] px-5 py-2 text-sm font-medium">Save</button>
        </div>
      </div>
    </form>
  </dialog>`);

  const dlg = $('#photo-dialog'), urlEl = $('#pd-url'), fileEl = $('#pd-file'), msg = $('#pd-msg');
  let key = '', pending = '';
  const preview = (src) => hydratePic($('#pd-preview'), src, 'preview');

  openPhotoDialog = (k) => {
    key = k; pending = photoFor(k, configuredPhoto(k));
    $('#pd-title').textContent = photoLabel(k);
    urlEl.value = pending.startsWith('data:') ? '' : pending;
    fileEl.value = '';
    msg.textContent = 'Saved in this browser only. To make it permanent, put the link in app.js.';
    preview(pending);
    dlg.showModal();
  };
  urlEl.addEventListener('input', () => { pending = urlEl.value.trim(); preview(pending); });
  fileEl.addEventListener('change', async () => {
    const f = fileEl.files[0];
    if (!f) return;
    try { pending = await fileToDataUrl(f); urlEl.value = ''; preview(pending); }
    catch { msg.textContent = 'Could not read that image.'; }
  });
  $('#pd-save').addEventListener('click', () => {
    const prev = photoOverrides[key];
    if (pending && pending !== configuredPhoto(key)) photoOverrides[key] = pending; else delete photoOverrides[key];
    if (!savePhotoOverrides()) {
      if (prev) photoOverrides[key] = prev; else delete photoOverrides[key];
      msg.textContent = 'Browser storage is full. Use a smaller image or a link instead.';
      return;
    }
    dlg.close();
    refreshPhotos();
    toast('Photo updated');
  });
  $('#pd-reset').addEventListener('click', () => {
    delete photoOverrides[key];
    savePhotoOverrides();
    dlg.close();
    refreshPhotos();
    toast('Original photo restored');
  });
  $('#pd-export').addEventListener('click', async () => {
    const links = Object.fromEntries(Object.entries(photoOverrides).filter(([, v]) => !v.startsWith('data:')));
    const text = JSON.stringify(links, null, 2);
    try { await navigator.clipboard.writeText(text); msg.textContent = 'Copied photo links (uploads are not included).'; }
    catch { msg.textContent = text; }
  });
}
let openPhotoDialog = () => {};

function refreshPhotos() { renderChef(); renderMenu(); }

/* ---------- menu ---------- */
function renderTabs() {
  $('#menu-tabs').innerHTML = CATEGORIES.map((c) =>
    `<button role="tab" aria-selected="${c === state.category}" data-cat="${c}"
      class="tab rounded-full border border-copper/40 px-4 py-1.5 text-sm hover:border-honey transition">${c}</button>`).join('');
}

function renderMenu() {
  const items = state.category === 'All' ? MENU : MENU.filter((m) => m.category === state.category);
  $('#menu-grid').innerHTML = items.map((m) => `
    <article class="group rounded-3xl bg-bark/40 border border-copper/15 hover:border-copper/50 transition overflow-hidden flex flex-col">
      <div class="picbox aspect-[4/3]" data-photo="${m.id}"></div>
      <div class="p-5 flex flex-col flex-1">
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-display text-xl font-semibold leading-tight">${esc(m.name)}</h3>
          <span class="font-display text-lg text-honey shrink-0">${money(m.priceCents)}</span>
        </div>
        ${m.featured ? '<span class="mt-2 self-start rounded-full bg-ember/20 text-honey border border-ember/40 px-2.5 py-0.5 text-[11px] uppercase tracking-widest">Pit favorite</span>' : ''}
        <p class="mt-2 text-sm text-cream/60 flex-1">${esc(m.description)}</p>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-xs uppercase tracking-widest text-copper/80">${esc(m.category)}</span>
          <button data-add="${m.id}" class="rounded-full bg-cream text-char hover:bg-honey px-5 py-2 text-sm font-medium transition">Add</button>
        </div>
      </div>
    </article>`).join('');
  document.querySelectorAll('#menu-grid [data-photo]').forEach((box) => {
    const m = byId(MENU, box.dataset.photo);
    hydratePic(box, photoFor(m.id, m.image), 'photo', m.id);
  });
}

/* ---------- cart panel ---------- */
function renderCart() {
  const count = cartCount();
  const countEl = $('#cart-count');
  if (countEl.textContent !== String(count)) {
    countEl.textContent = count;
    countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump');
  }
  const lines = cartLines();
  $('#cart-lines').innerHTML = lines.length ? lines.map(({ item, qty }) => `
    <li class="py-3 flex items-center gap-3">
      <div class="flex-1 min-w-0">
        <p class="font-medium truncate">${esc(item.name)}</p>
        <p class="text-xs text-cream/50">${money(item.priceCents)} each</p>
      </div>
      <div class="flex items-center rounded-full border border-copper/30">
        <button type="button" data-dec="${item.id}" class="w-8 h-8 hover:text-honey" aria-label="Remove one ${esc(item.name)}">−</button>
        <span class="w-6 text-center text-sm">${qty}</span>
        <button type="button" data-inc="${item.id}" class="w-8 h-8 hover:text-honey" aria-label="Add one ${esc(item.name)}">+</button>
      </div>
      <span class="w-16 text-right text-sm">${money(item.priceCents * qty)}</span>
    </li>`).join('')
    : `<li class="py-6 text-center text-cream/50 text-sm">Nothing here yet. <a href="#menu" class="text-honey underline">Pick from the menu</a>.</li>`;
  $('#cart-total').textContent = money(cartTotal());
  $('#pay-btn').disabled = lines.length === 0;
}

/* ---------- stops ---------- */
function renderStops() {
  $('#stop-list').innerHTML = STOPS.map((s) => {
    const sel = s.id === state.stopId;
    return `<li>
      <button data-stop="${s.id}" class="w-full text-left rounded-2xl border px-4 py-3 transition ${sel ? 'bg-ember/20 border-ember' : 'border-copper/25 hover:border-copper/60'}">
        <div class="flex justify-between gap-2">
          <span class="font-medium">${esc(s.name)}</span>
          <span class="text-xs uppercase tracking-widest text-honey">${dayShort(s)}</span>
        </div>
        <div class="text-xs text-cream/55 mt-0.5">${esc(s.address)} · ${hoursLabel(s)}</div>
      </button></li>`;
  }).join('');

  const s = byId(STOPS, state.stopId);
  $('#stop-selected').innerHTML = s
    ? `<p class="text-xs uppercase tracking-widest text-honey mb-1">Pre-order for this stop</p>
       <p class="font-display text-xl">${esc(s.name)}</p>
       <p class="text-cream/70">${DAY_NAMES[s.day]} · ${hoursLabel(s)}</p>
       <a href="#preorder" class="inline-block mt-3 text-honey underline">Continue to pre-order →</a>`
    : `<p class="text-cream/70">Tap a marker or a stop to pre-order for it.</p>`;
}

function renderStopSelect() {
  $('#f-stop').innerHTML = '<option value="">Choose a stop…</option>' + STOPS.map((s) =>
    `<option value="${s.id}" ${s.id === state.stopId ? 'selected' : ''}>${esc(s.name)} — ${dayShort(s)} ${hoursLabel(s)}</option>`).join('');
}

function refreshDateAndWindows(resetDate) {
  const s = byId(STOPS, state.stopId);
  const dateEl = $('#f-date'), winEl = $('#f-window'), hint = $('#date-hint');
  dateEl.min = isoDate(new Date());
  if (!s) {
    winEl.innerHTML = '<option value="">Pick a stop first</option>';
    hint.textContent = '';
    return;
  }
  if (resetDate || !dateEl.value) dateEl.value = isoDate(nextDateFor(s));
  const picked = parseIso(dateEl.value);
  if (picked.getDay() !== s.day) {
    winEl.innerHTML = '<option value="">—</option>';
    hint.textContent = `${s.name} runs on ${DAY_NAMES[s.day]}s. Pick a ${DAY_NAMES[s.day]}.`;
    hint.className = 'sm:col-span-2 text-xs text-honey';
    return;
  }
  const wins = windowsFor(s, dateEl.value);
  winEl.innerHTML = wins.length ? wins.map((w) => `<option>${w}</option>`).join('') : '<option value="">No windows left today</option>';
  hint.textContent = `Pickup at ${s.name}, ${s.address}. Order at least 20 minutes ahead.`;
  hint.className = 'sm:col-span-2 text-xs text-cream/50';
}

function selectStop(id, { scroll = false } = {}) {
  state.stopId = id || null;
  store.set(KEYS.stop, state.stopId);
  renderStops();
  renderStopSelect();
  refreshDateAndWindows(true);
  if (stopLayer) stopLayer.changed();
  if (scroll) $('#preorder').scrollIntoView({ behavior: 'smooth' });
}

function renderHeroNext() {
  const upcoming = STOPS.map((s) => {
    const d = nextDateFor(s);
    d.setHours(0, toMinutes(s.open));
    return { s, d };
  }).sort((a, b) => a.d - b.d)[0];
  if (!upcoming) return;
  const { s, d } = upcoming;
  const today = isoDate(d) === isoDate(new Date());
  $('#hero-next').innerHTML = `
    <span class="relative flex h-2.5 w-2.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember opacity-70"></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-ember"></span></span>
    <span><span class="text-cream/60">Next stop:</span> <strong class="font-medium">${esc(s.name)}</strong>
    <span class="text-cream/60">· ${today ? 'Today' : DAY_NAMES[s.day]} ${hoursLabel(s)}</span></span>`;
}

/* ---------- map (OpenLayers) ---------- */
let stopLayer = null;

function initMap() {
  if (!window.ol) { $('#map-fallback').classList.remove('hidden'); return; }
  const { Map, View, Overlay, Feature } = ol;
  const features = STOPS.map((s) => {
    const f = new Feature({ geometry: new ol.geom.Point(ol.proj.fromLonLat([s.lng, s.lat])) });
    f.setId(s.id);
    return f;
  });

  const styleFor = (selected) => [
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: selected ? 16 : 12,
        fill: new ol.style.Fill({ color: selected ? 'rgba(232,160,74,.25)' : 'rgba(196,92,38,.2)' }),
      }),
    }),
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: selected ? 9 : 7,
        fill: new ol.style.Fill({ color: selected ? '#E8A04A' : '#C45C26' }),
        stroke: new ol.style.Stroke({ color: '#F6EDE4', width: 2 }),
      }),
    }),
  ];

  stopLayer = new ol.layer.Vector({
    source: new ol.source.Vector({ features }),
    style: (f) => styleFor(f.getId() === state.stopId),
  });

  const popupEl = $('#map-popup');
  const popup = new Overlay({ element: popupEl, positioning: 'bottom-center', stopEvent: true });

  const map = new Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({ source: new ol.source.OSM(), className: 'ol-layer basemap' }),
      stopLayer,
    ],
    overlays: [popup],
    view: new View({ center: ol.proj.fromLonLat(MAP_CENTER), zoom: MAP_ZOOM }),
  });

  function openPopup(stopId) {
    const s = byId(STOPS, stopId);
    if (!s) return;
    popupEl.innerHTML = `
      <p class="font-display font-semibold text-lg leading-tight">${esc(s.name)}</p>
      <p class="text-xs text-char/70">${DAY_NAMES[s.day]} · ${hoursLabel(s)}</p>
      <p class="text-xs text-char/60">${esc(s.address)}</p>
      <button data-goto="${s.id}" class="mt-2 rounded-full bg-ember text-cream px-3 py-1 text-xs font-medium">Pre-order for this stop</button>`;
    popupEl.classList.remove('hidden');
    popup.setPosition(ol.proj.fromLonLat([s.lng, s.lat]));
  }

  map.on('singleclick', (evt) => {
    const f = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
    if (f) { selectStop(f.getId()); openPopup(f.getId()); }
    else { popup.setPosition(undefined); }
  });
  map.on('pointermove', (evt) => {
    map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
  });

  // Expose for list clicks
  initMap.focus = (stopId) => {
    const s = byId(STOPS, stopId);
    if (!s) return;
    map.getView().animate({ center: ol.proj.fromLonLat([s.lng, s.lat]), zoom: 14, duration: 450 });
    openPopup(stopId);
  };
}

/* ---------- checkout ---------- */
async function submitOrder(e) {
  e.preventDefault();
  notice(null);
  const s = byId(STOPS, state.stopId);
  const payload = {
    items: cartLines().map(({ item, qty }) => ({ id: item.id, qty })),
    stopId: state.stopId,
    pickupDate: $('#f-date').value,
    pickupWindow: $('#f-window').value,
    customerName: $('#f-name').value.trim(),
    customerPhone: $('#f-phone').value.trim(),
    notes: $('#f-notes').value.trim(),
  };

  const problems = [];
  if (!payload.items.length) problems.push('add something from the menu');
  if (!s) problems.push('choose a pickup stop');
  if (s && payload.pickupDate && parseIso(payload.pickupDate).getDay() !== s.day) problems.push(`pick a ${DAY_NAMES[s.day]}`);
  if (!payload.pickupWindow) problems.push('choose a pickup window');
  if (!payload.customerName) problems.push('add your name');
  if (!/[0-9]{7,}/.test(payload.customerPhone.replace(/\D/g, ''))) problems.push('add a phone number');
  if (problems.length) {
    notice('Almost there — please ' + problems.join(', ') + '.', 'error');
    return;
  }

  const btn = $('#pay-btn');
  btn.disabled = true;
  btn.textContent = DEMO ? 'Placing order…' : 'Opening Stripe…';

  try {
    if (DEMO) {
      const id = demoCheckout(payload);
      location.href = 'success.html?demo_order=' + encodeURIComponent(id);
      return;
    }
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.url) { location.href = data.url; return; }
    if (res.status === 503) notice(data.message || 'Online payments are not configured yet. Please call the truck to order.', 'error');
    else notice('Could not start checkout: ' + (data.message || data.error || res.statusText), 'error');
  } catch (err) {
    notice('Could not reach the server. Check your connection and try again.', 'error');
  }
  btn.disabled = cartLines().length === 0;
  btn.textContent = DEMO ? 'Place demo order' : 'Pay with Stripe';
}

// Demo mode: simulated order saved in this browser only.
function demoCheckout(p) {
  const s = byId(STOPS, p.stopId);
  const lines = cartLines().map(({ item, qty }) => ({ itemId: item.id, name: item.name, qty, unitPriceCents: item.priceCents }));
  const order = {
    orderId: 'VP-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
    status: 'paid (simulated)',
    stopName: s.name,
    stopHours: `${dayShort(s)} ${hoursLabel(s)}`,
    pickupDate: p.pickupDate,
    pickupWindow: p.pickupWindow,
    customerName: p.customerName,
    customerPhone: p.customerPhone,
    notes: p.notes,
    items: lines,
    totalCents: cartTotal(),
    createdAt: new Date().toISOString(),
  };
  const orders = store.get(KEYS.demoOrders, []);
  orders.unshift(order);
  store.set(KEYS.demoOrders, orders.slice(0, 50));
  state.cart = {};
  saveCart();
  return order.orderId;
}

/* ---------- hero sparks ---------- */
function sparks() {
  const host = $('#sparks');
  if (!host || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.className = 'ember-spark';
    s.style.left = (40 + Math.random() * 60) + '%';
    s.style.bottom = (-5 + Math.random() * 10) + '%';
    s.style.animationDuration = (6 + Math.random() * 8) + 's';
    s.style.animationDelay = (-Math.random() * 12) + 's';
    host.appendChild(s);
  }
}

/* ---------- wire up ---------- */
function init() {
  if (DEMO) {
    $('#demo-banner').classList.remove('hidden');
    $('#pay-btn').textContent = 'Place demo order';
    $('#pay-note').innerHTML = 'Demo only — no card, no charge. <a href="success.html" class="underline">View demo orders</a>';
    $('#demo-reset').addEventListener('click', () => {
      Object.values(KEYS).forEach((k) => store.remove(k));
      location.reload();
    });
  }

  if (DEMO) buildPhotoDialog();
  renderChef();
  renderTabs();
  renderMenu();
  renderCart();
  renderStops();
  renderStopSelect();
  refreshDateAndWindows(false);
  renderHeroNext();
  sparks();
  initMap();

  $('#menu-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.category = b.dataset.cat;
    renderTabs();
    renderMenu();
  });
  $('#menu-grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const id = b.dataset.add;
    setQty(id, (state.cart[id] || 0) + 1);
    toast(`${byId(MENU, id).name} added`);
  });
  $('#cart-lines').addEventListener('click', (e) => {
    const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
    if (inc) setQty(inc.dataset.inc, (state.cart[inc.dataset.inc] || 0) + 1);
    if (dec) setQty(dec.dataset.dec, (state.cart[dec.dataset.dec] || 0) - 1);
  });
  $('#stop-list').addEventListener('click', (e) => {
    const b = e.target.closest('[data-stop]');
    if (!b) return;
    selectStop(b.dataset.stop);
    if (initMap.focus) initMap.focus(b.dataset.stop);
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-goto]');
    if (b) selectStop(b.dataset.goto, { scroll: true });
    const ed = e.target.closest('[data-edit-photo]');
    if (ed) openPhotoDialog(ed.dataset.editPhoto);
  });
  $('#f-stop').addEventListener('change', (e) => selectStop(e.target.value));
  $('#f-date').addEventListener('change', () => refreshDateAndWindows(false));
  $('#order-form').addEventListener('submit', submitOrder);

  // Returning from Stripe cancel
  const params = new URLSearchParams(location.search);
  if (params.get('canceled') === '1') {
    notice('Checkout canceled. Your cart is still here when you are ready.');
    history.replaceState(null, '', location.pathname + '#preorder');
    $('#preorder').scrollIntoView();
  }

  // Keep cart in sync across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === KEYS.cart) { state.cart = store.get(KEYS.cart, {}); renderCart(); }
  });
}

document.addEventListener('DOMContentLoaded', init);
