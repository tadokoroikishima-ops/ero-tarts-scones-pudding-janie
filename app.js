/* ═══════════════════════════════════════════
app.js  —  Ero Tarts
config.json を読み込んでページを描画する
═══════════════════════════════════════════ */

let cfg = {};

/* ── フォールバック設定（fetch失敗時・ローカル表示時に使用） ── */
const FALLBACK_CONFIG = {
siteTitle: “Ero Tarts”,
siteTagline: “YES WE ARE SWEET”,
videoTitle: “Jane Willow Leaked Real Life”,
pageTitle: “Jane Willow”,
images: {
logo:   “images/logo.png”,
player: “images/player.jpg”,
thumb1: “images/thumb1.jpg”,
thumb2: “images/thumb2.jpg”,
thumb3: “images/thumb3.jpg”,
thumb4: “images/thumb4.jpg”
},
seekPercent: 63,
timestamps: [
{ key: “thumb1”, time: “0:01”, pct: 1,  label: “Scene 1” },
{ key: “thumb2”, time: “0:02”, pct: 2,  label: “Scene 2” },
{ key: “thumb3”, time: “1:14”, pct: 78, label: “Scene 3” },
{ key: “thumb4”, time: “1:37”, pct: 63, label: “Current”, active: true }
]
};

/* ── 起動 ────────────────────────────────── */
document.addEventListener(‘DOMContentLoaded’, () => {
fetch(‘config.json’)
.then(r => r.json())
.then(data => {
cfg = data;
init();
})
.catch(() => {
// ローカルファイル or fetchエラー時はフォールバック使用
cfg = FALLBACK_CONFIG;
init();
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

/* ── フレームクリック → シーク（HTML直書き版）── */
function seekTo(idx, pct) {
// シークバー更新
applySeekbar(pct);

// active クラス付け替え
document.querySelectorAll(’.ts-frame’).forEach((el, i) => {
el.classList.toggle(‘active-frame’, i === idx);
});
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
