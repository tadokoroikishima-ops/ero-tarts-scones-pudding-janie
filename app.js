/* ═══════════════════════════════════════════
app.js  —  Ero Tarts
config.json を読み込んでページを描画する
═══════════════════════════════════════════ */

let cfg = {};

/* ── 起動 ────────────────────────────────── */
document.addEventListener(‘DOMContentLoaded’, () => {
fetch(‘config.json’)
.then(r => r.json())
.then(data => {
cfg = data;
init();
})
.catch(err => {
console.error(‘config.json の読み込みに失敗:’, err);
});
});

/* ── 初期化 ───────────────────────────────── */
function init() {
applyMeta();
applyLogo();
applyPlayerImage();
renderTimestamps();
applySeekbar(cfg.seekPercent || 63);
}

/* ── サイト名・タイトル ──────────────────── */
function applyMeta() {
// ページタイトル
const pageTitle = document.getElementById(‘pageTitle’);
if (pageTitle) pageTitle.textContent = cfg.pageTitle || ‘’;

// 動画タイトル
const videoTitle = document.getElementById(‘videoTitle’);
if (videoTitle) videoTitle.textContent = cfg.videoTitle || ‘’;

// サイト名（ロゴテキスト）
const siteName = document.getElementById(‘siteName’);
if (siteName) siteName.textContent = cfg.siteTitle || ‘’;

const siteTagline = document.getElementById(‘siteTagline’);
if (siteTagline) siteTagline.textContent = cfg.siteTagline || ‘’;

// ウォーターマーク
const wmMain = document.getElementById(‘wmMain’);
if (wmMain) wmMain.textContent = cfg.siteTitle ? cfg.siteTitle.toLowerCase().replace(’ ‘, ‘-’) + ‘.co’ : ‘’;
const wmSub = document.getElementById(‘wmSub’);
if (wmSub) wmSub.textContent = cfg.siteTitle ? cfg.siteTitle.toLowerCase().replace(’ ’, ‘-’) + ‘.co’ : ‘’;
}

/* ── ロゴ画像 ───────────────────────────── */
function applyLogo() {
const wrap = document.getElementById(‘logoImgWrap’);
const ageLogoWrap = document.getElementById(‘ageLogoWrap’);
const src = cfg.images && cfg.images.logo;
if (!src) return;

[wrap, ageLogoWrap].forEach(el => {
if (!el) return;
el.innerHTML = `<img src="${src}" alt="${cfg.siteTitle} logo">`;
});
}

/* ── プレイヤー画像 ─────────────────────── */
function applyPlayerImage() {
const frame = document.getElementById(‘playerFrame’);
if (!frame) return;
const src = cfg.images && cfg.images.player;
if (!src) return;

frame.style.background = ‘#000’;
let img = frame.querySelector(‘img’);
if (!img) {
img = document.createElement(‘img’);
img.alt = cfg.videoTitle || ‘’;
frame.prepend(img);
}
img.src = src;
}

/* ── シークバー ─────────────────────────── */
function applySeekbar(pct) {
const fill = document.getElementById(‘seekFill’);
if (fill) fill.style.width = Math.min(100, Math.max(0, pct)) + ‘%’;
}

/* ── タイムスタンプ描画 ──────────────────── */
const gradients = [
[’#1a0a00’,’#2d1200’],
[’#0a0a1a’,’#1a1a3d’],
[’#0a1a0a’,’#1a3a1a’],
[’#1a0a1a’,’#2d002d’]
];

function renderTimestamps() {
const strip = document.getElementById(‘timestampStrip’);
if (!strip || !cfg.timestamps) return;

strip.innerHTML = cfg.timestamps.map((f, i) => {
const [c1, c2] = gradients[i % gradients.length];
const imgSrc = cfg.images && cfg.images[f.key];
const imgHTML = imgSrc
? `<img src="${imgSrc}" alt="${f.label}">`
: `<div class="ts-placeholder"> <svg width="22" height="22" viewBox="0 0 24 24" fill="#252525"> <polygon points="5 3 19 12 5 21 5 3"/> </svg> </div>`;

```
return `
  <div class="ts-frame ${f.active ? 'active-frame' : ''}"
       data-index="${i}"
       style="background: linear-gradient(135deg, ${c1}, ${c2})">
    <div class="ts-img-area">
      ${imgHTML}
      <div class="ts-time">${f.time}</div>
    </div>
    <div class="ts-progress">
      <div class="ts-progress-fill" style="width:${f.pct}%"></div>
    </div>
  </div>`;
```

}).join(’’);

// イベント登録
strip.querySelectorAll(’.ts-frame’).forEach(el => {
el.addEventListener(‘click’, () => seekTo(parseInt(el.dataset.index)));
});
}

/* ── フレームクリック → シーク ────────────── */
function seekTo(idx) {
if (!cfg.timestamps || !cfg.timestamps[idx]) return;
const f = cfg.timestamps[idx];

// シークバー更新
applySeekbar(f.pct);

// 時刻表示更新
const timeLbl = document.getElementById(‘timeDisplay’);
if (timeLbl) timeLbl.textContent = ‘−’ + f.time;

// active フレーム更新
cfg.timestamps.forEach((t, i) => t.active = (i === idx));
renderTimestamps();

// プレイヤー画像更新（フレーム画像がある場合）
const frameSrc = cfg.images && cfg.images[f.key];
if (frameSrc) {
applyPlayerImageSrc(frameSrc);
}
}

function applyPlayerImageSrc(src) {
const frame = document.getElementById(‘playerFrame’);
if (!frame) return;
frame.style.background = ‘#000’;
let img = frame.querySelector(‘img’);
if (!img) { img = document.createElement(‘img’); frame.prepend(img); }
img.src = src;
}

/* ── 年齢認証チェック ──────────────────────
player.html は年齢確認済みか検証する
未確認なら index.html へリダイレクト
─────────────────────────────────────────── */
function checkAgeVerified() {
if (sessionStorage.getItem(‘ageVerified’) !== ‘1’) {
window.location.href = ‘index.html’;
}
}
