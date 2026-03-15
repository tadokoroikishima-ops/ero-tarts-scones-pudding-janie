/* ══════════════════════════════════════════
app.js — Ero Tarts player logic
Images are loaded from config.json.
Drop files into images/ to reflect them.
══════════════════════════════════════════ */

let CONFIG = {};
const GRADIENTS = [
[’#1a0a00’,’#2d1200’],
[’#0a0a1a’,’#1a1a3d’],
[’#0a1a0a’,’#1a3a1a’],
[’#1a0a1a’,’#2d002d’]
];

/* ── Load config then boot ── */
async function init() {
requireAuth();
try {
const res = await fetch(‘data/config.json’);
CONFIG = await res.json();
} catch(e) {
CONFIG = { site:{name:‘Ero Tarts’,domain:‘ero-tarts.co’}, player:{seekPct:63,timeDisplay:‘−1:37’,title:’’,subtitle:’’,image:’’,}, logo:{image:’’}, timestamps:[] };
}
applyConfig();
}

/* ── Apply config to DOM ── */
function applyConfig() {
const s = CONFIG.site   || {};
const p = CONFIG.player || {};
const l = CONFIG.logo   || {};

/* Site name & domain watermarks */
document.querySelectorAll(’.site-name’).forEach(el => el.textContent = s.name || ‘Ero Tarts’);
document.querySelectorAll(’.site-tagline’).forEach(el => el.textContent = s.tagline || ‘’);
document.querySelectorAll(’.wm-domain’).forEach(el => el.textContent = (s.domain || ‘ero-tarts.co’));

/* Logo */
tryImage(l.image, img => {
const wrap = document.getElementById(‘logoImgWrap’);
if (wrap) { wrap.innerHTML = ‘’; wrap.appendChild(img); }
});

/* Player title */
const titleEl = document.getElementById(‘videoTitle’);
if (titleEl) titleEl.textContent = p.title || ‘’;
const subtitleEl = document.getElementById(‘pageTitle’);
if (subtitleEl) subtitleEl.textContent = p.subtitle || ‘’;

/* Seek bar */
const pct = p.seekPct ?? 63;
const fill = document.getElementById(‘seekFill’);
if (fill) fill.style.width = pct + ‘%’;
const timeEl = document.getElementById(‘timeDisplay’);
if (timeEl) timeEl.textContent = p.timeDisplay || ‘−1:37’;

/* Player image */
tryImage(p.image, img => {
const frame = document.getElementById(‘playerFrame’);
if (frame) {
frame.style.background = ‘#000’;
frame.insertBefore(img, frame.firstChild);
}
});

/* Timestamps */
renderTimestamps();
}

/* ── Try to load image; callback only if it loads ── */
function tryImage(src, cb) {
if (!src) return;
const img = new Image();
img.onload  = () => cb(img);
img.onerror = () => {};   /* silently fall back to placeholder */
img.src = src;
img.style.cssText = ‘width:100%;height:100%;object-fit:cover;display:block;’;
}

/* ── Render timestamp strip ── */
function renderTimestamps() {
const strip = document.getElementById(‘timestampStrip’);
if (!strip) return;
const data = CONFIG.timestamps || [];

strip.innerHTML = data.map((f, i) => {
const [c1, c2] = GRADIENTS[i % GRADIENTS.length];
return ` <div class="ts-frame ${f.active ? 'active-frame' : ''}" id="tsFrame${i}" onclick="seekTo(${i})" style="background:linear-gradient(135deg,${c1},${c2})"> <div class="ts-img-area" id="tsImgArea${i}"> <div class="ts-placeholder"> <svg width="20" height="20" viewBox="0 0 24 24" fill="#2a2a2a"><polygon points="5 3 19 12 5 21 5 3"/></svg> </div> <div class="ts-time">${f.time}</div> </div> <div class="ts-progress"> <div class="ts-progress-fill" style="width:${f.pct}%"></div> </div> </div>`;
}).join(’’);

/* After rendering, try to inject real images */
data.forEach((f, i) => {
if (!f.src) return;
tryImage(f.src, img => {
const area = document.getElementById(‘tsImgArea’ + i);
if (area) {
const ph = area.querySelector(’.ts-placeholder’);
if (ph) ph.remove();
area.insertBefore(img, area.firstChild);
}
});
});
}

/* ── Seek to timestamp frame ── */
function seekTo(idx) {
const data = CONFIG.timestamps || [];
if (!data[idx]) return;
const f = data[idx];

/* Update seekbar & time */
const fill = document.getElementById(‘seekFill’);
if (fill) fill.style.width = f.pct + ‘%’;
const timeEl = document.getElementById(‘timeDisplay’);
if (timeEl) timeEl.textContent = ‘−’ + f.time;

/* Update active state */
data.forEach((t, i) => {
t.active = (i === idx);
const frame = document.getElementById(‘tsFrame’ + i);
if (frame) frame.classList.toggle(‘active-frame’, t.active);
});
}

/* ── Boot ── */
window.addEventListener(‘DOMContentLoaded’, init);
