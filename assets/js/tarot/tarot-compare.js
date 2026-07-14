// tarot-compare.js — 三副牌對照藝廊：原版偉特 RWS × 制服女孩（墨線）× Cyber Tarot（CloneX）。
// 左欄＝公共財偉特靜態圖（assets/img/tarot/rws/{id}.jpg，720px）；
// 中欄＝制服女孩，重用 tarot-card-image 的 faceSvg 套框（＝與線上抽牌同款成品）；
// 右欄＝Cyber Tarot（CloneX）成品圖（assets/img/tarot-clonex/{id}.jpg，768px）。
// 效能：左右兩欄用原生 loading="lazy"；中欄 SVG 無原生 lazy，改用 IntersectionObserver
//       在進場前才注入 faceSvg，避免 78 張 SVG 內嵌圖一次並發把連線塞爆（部分圖載不出）。
// 純前端、零第三方相依；含自製極簡 lightbox（點圖放大、Esc／點背景關閉）。
import { CARDS, buildDeck } from './tarot-deck.js';
import { faceSvg } from './tarot-card-image.js';
import { createOverlay } from './tarot-overlay.js';

const RWS_DIR = '/assets/img/tarot/rws/';
const CLONEX_DIR = '/assets/img/tarot-clonex/';
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
  const clonex = CLONEX_DIR + card.id + '.jpg';
  const zh = esc(card.nameZh);
  const ph = PLACEHOLDER.has(card.id) ? ' <span class="cmp-ph" title="暫以 Gemini 圖頂著，待重生">暫代</span>' : '';
  return `
  <article class="cmp-card" id="cmp-${card.id}">
    <h3 class="cmp-name">${zh} <span class="cmp-en">${esc(card.nameEn)}</span></h3>
    <div class="cmp-trio">
      <figure class="cmp-cell" data-zoom-img="${rws}" data-zoom-label="原版偉特 · ${zh}">
        <div class="cmp-media"><img src="${rws}" alt="原版偉特塔羅 ${zh}" loading="lazy" decoding="async" width="720" height="1208"></div>
        <figcaption>原版偉特 RWS</figcaption>
      </figure>
      <figure class="cmp-cell" data-zoom-svg="${card.id}" data-zoom-label="制服女孩 · ${zh}">
        <div class="cmp-media cmp-media--svg" data-svg="${card.id}"></div>
        <figcaption>制服女孩${ph}</figcaption>
      </figure>
      <figure class="cmp-cell" data-zoom-img="${clonex}" data-zoom-label="Cyber Tarot · ${zh}">
        <div class="cmp-media"><img src="${clonex}" alt="Cyber Tarot（CloneX）${zh}" loading="lazy" decoding="async" width="768" height="1152"></div>
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
    box.innerHTML = faceSvg(card, false, 'cmp-svg');
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

  root.addEventListener('click', (e) => {
    const cell = e.target.closest('.cmp-cell');
    if (cell) openLightbox(cell);
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
}
