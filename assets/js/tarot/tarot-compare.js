// tarot-compare.js — 三副牌對照藝廊：原版偉特 RWS × 制服女孩（墨線）× Cyber Tarot（CloneX）。
// 列表只載 480px WebP 預覽；點開 lightbox 才取原尺寸 JPEG。
// 中欄制服女孩重用 tarot-card-image 的 faceSvg 套框（＝與線上抽牌同款成品）。
// SVG 無原生 lazy，仍以 IntersectionObserver 在進場前才注入，避免一次並發載入 78 張。
// 純前端、零第三方相依；含自製極簡 lightbox（點圖放大、Esc／點背景關閉）。
import { CARDS, buildDeck } from './tarot-deck.js';
import { faceSvg } from './tarot-card-image.js?v=20260813-thumbs';
import { createOverlay } from './tarot-overlay.js';

const RWS_DIR = '/assets/img/tarot/rws/';
const RWS_THUMB_DIR = '/assets/img/tarot/thumbs/rws/';
const UNIFORM_THUMB_DIR = '/assets/img/tarot/thumbs/uniform/';
const CLONEX_DIR = '/assets/img/tarot/clonex/';
const CLONEX_THUMB_DIR = '/assets/img/tarot/thumbs/clonex/';
// 目前以 Gemini 暫代、待 ChatGPT 重生的牌（顯示小標記）。
const PLACEHOLDER = new Set(['pentacles-13', 'pentacles-14']);

const SECTIONS = [
  { key: 'major',     label: '大牌 Major Arcana', short: '大牌',  test: (c) => c.arcana === 'major' },
  { key: 'wands',     label: '權杖 Wands',         short: '權杖',  test: (c) => c.suit === 'wands' },
  { key: 'cups',      label: '聖杯 Cups',          short: '聖杯',  test: (c) => c.suit === 'cups' },
  { key: 'swords',    label: '寶劍 Swords',        short: '寶劍',  test: (c) => c.suit === 'swords' },
  { key: 'pentacles', label: '錢幣 Pentacles',     short: '錢幣',  test: (c) => c.suit === 'pentacles' },
];

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function cardBlock(card) {
  const rws = RWS_DIR + card.id + '.jpg';
  const rwsThumb = RWS_THUMB_DIR + card.id + '.webp';
  const clonex = CLONEX_DIR + card.id + '.jpg';
  const clonexThumb = CLONEX_THUMB_DIR + card.id + '.webp';
  const zh = esc(card.nameZh);
  const ph = PLACEHOLDER.has(card.id) ? ' <span class="cmp-ph" title="暫以 Gemini 圖頂著，待重生">暫代</span>' : '';
  return `
  <article class="cmp-card" id="cmp-${card.id}">
    <h3 class="cmp-name">${zh} <span class="cmp-en">${esc(card.nameEn)}</span></h3>
    <div class="cmp-trio">
      <figure class="cmp-cell" data-zoom-img="${rws}" data-zoom-label="原版偉特 · ${zh}">
        <div class="cmp-media"><img src="${rwsThumb}" alt="原版偉特塔羅 ${zh}" loading="lazy" decoding="async" width="480" height="806"></div>
        <figcaption>原版偉特 RWS</figcaption>
      </figure>
      <figure class="cmp-cell" data-zoom-svg="${card.id}" data-zoom-label="制服女孩 · ${zh}">
        <div class="cmp-media cmp-media--svg" data-svg="${card.id}"></div>
        <figcaption>制服女孩${ph}</figcaption>
      </figure>
      <figure class="cmp-cell" data-zoom-img="${clonex}" data-zoom-label="Cyber Tarot · ${zh}">
        <div class="cmp-media"><img src="${clonexThumb}" alt="Cyber Tarot（CloneX）${zh}" loading="lazy" decoding="async" width="480" height="720"></div>
        <figcaption>Cyber Tarot</figcaption>
      </figure>
    </div>
  </article>`;
}

const lightbox = createOverlay({
  id: 'cmp-lightbox',
  className: 'cmp-lightbox',
  closeSelector: '.cmp-lb-close',
  innerHTML: '<button class="cmp-lb-close" type="button" aria-label="關閉放大檢視">×</button>'
    + '<div class="cmp-lb-stage"></div><div class="cmp-lb-cap"></div>',
});

function openLightbox(cell) {
  const ov = lightbox.ensure();
  const stage = ov.querySelector('.cmp-lb-stage');
  if (cell.dataset.zoomImg) {
    stage.innerHTML = `<img src="${cell.dataset.zoomImg}" alt="">`;
  } else if (cell.dataset.zoomSvg && CARDS[cell.dataset.zoomSvg]) {
    stage.innerHTML = faceSvg(CARDS[cell.dataset.zoomSvg], false, 'cmp-lb-svg');
  }
  ov.querySelector('.cmp-lb-cap').textContent = cell.dataset.zoomLabel || '';
  lightbox.open(cell);
}

// 中欄 SVG 進場前才注入：避免 78 張內嵌圖一次全發、部分圖被連線上限卡住載不出。
function lazyMountSvgs(root) {
  const boxes = root.querySelectorAll('.cmp-media--svg');
  const mount = (box) => {
    if (box.dataset.filled) return;
    const card = CARDS[box.dataset.svg];
    if (!card) return;
    box.innerHTML = faceSvg(card, false, 'cmp-svg', 'uniform', UNIFORM_THUMB_DIR + card.id + '.webp');
    box.dataset.filled = '1';
  };
  if (typeof IntersectionObserver === 'undefined') {
    boxes.forEach(mount);
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      mount(e.target);
      obs.unobserve(e.target);
    }
  }, { rootMargin: '600px 0px' });
  boxes.forEach((b) => io.observe(b));
}

// 跳轉導覽：長距離一律瞬跳，避免平滑捲動飛越全頁時，把後段卡片的懶載入一次拖出視窗
// 觸發（跟「進場前才注入」的節流設計互相牴觸）。近距離仍保留平滑捲動的手感。
function bindJumpNav(root) {
  const nav = root.querySelector('.cmp-jump');
  if (!nav) return;
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const distance = Math.abs(target.getBoundingClientRect().top);
    if (distance > 3000) {
      // 長距離：JS 的 behavior:'auto' 只是「跟隨 CSS scroll-behavior」，而全站 html 是
      // scroll-behavior:smooth（bootstrap.css），所以要瞬跳必須暫時關掉這個 CSS 屬性，
      // 跳完下一輪再還原，避免動到其他捲動互動。
      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      requestAnimationFrame(() => { html.style.scrollBehavior = prevBehavior; });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (window.history && history.pushState) history.pushState(null, '', '#' + id);
  });
}

function render() {
  const root = document.getElementById('tarot-compare');
  if (!root) return;
  const deck = buildDeck().map((id) => CARDS[id]);

  let html = '<nav class="cmp-jump">'
    + SECTIONS.map((s) => `<a href="#cmp-sec-${s.key}">${esc(s.short)}</a>`).join('')
    + '</nav>';

  for (const sec of SECTIONS) {
    const cards = deck.filter(sec.test);
    html += `<section class="cmp-section" id="cmp-sec-${sec.key}">`
      + `<h2 class="cmp-sec-title">${esc(sec.label)}<span class="cmp-sec-count">${cards.length} 張</span></h2>`
      + '<div class="cmp-list">' + cards.map(cardBlock).join('') + '</div></section>';
  }
  root.innerHTML = html;

  lazyMountSvgs(root);
  bindJumpNav(root);

  root.addEventListener('click', (e) => {
    const cell = e.target.closest('.cmp-cell');
    if (cell) openLightbox(cell);
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
}
