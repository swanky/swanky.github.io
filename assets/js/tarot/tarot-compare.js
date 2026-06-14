// tarot-compare.js — 「原版偉特 RWS × 史旺基版」牌面對照藝廊。
// 重用 tarot-deck（牌序／牌名）與 tarot-card-image（faceSvg 套框＝與線上同款成品），
// 原版圖在 assets/img/tarot/rws/{id}.jpg（公共財偉特，已縮為 720px 寬）。
// 純前端、零第三方相依；含自製極簡 lightbox（點圖放大、Esc／點背景關閉）。
import { CARDS, buildDeck } from './tarot-deck.js';
import { faceSvg } from './tarot-card-image.js';

const RWS_DIR = '/assets/img/tarot/rws/';
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
  const mine = faceSvg(card, false, 'cmp-svg');
  const ph = PLACEHOLDER.has(card.id) ? ' <span class="cmp-ph" title="暫以 Gemini 圖頂著，待重生">暫代</span>' : '';
  return `
  <article class="cmp-card" id="cmp-${card.id}">
    <h3 class="cmp-name">${esc(card.nameZh)} <span class="cmp-en">${esc(card.nameEn)}</span></h3>
    <div class="cmp-pair">
      <figure class="cmp-cell" data-zoom-img="${rws}" data-zoom-label="原版偉特 · ${esc(card.nameZh)}">
        <div class="cmp-media"><img src="${rws}" alt="原版偉特塔羅 ${esc(card.nameZh)}" loading="lazy" width="720"></div>
        <figcaption>原版偉特 RWS</figcaption>
      </figure>
      <figure class="cmp-cell" data-zoom-svg="${card.id}" data-zoom-label="史旺基版 · ${esc(card.nameZh)}">
        <div class="cmp-media">${mine}</div>
        <figcaption>史旺基版${ph}</figcaption>
      </figure>
    </div>
  </article>`;
}

function closeLightbox() {
  const ov = document.getElementById('cmp-lightbox');
  if (ov) { ov.classList.remove('is-open'); document.body.style.overflow = ''; }
}

function ensureLightbox() {
  let ov = document.getElementById('cmp-lightbox');
  if (ov) return ov;
  ov = document.createElement('div');
  ov.id = 'cmp-lightbox';
  ov.className = 'cmp-lightbox';
  ov.innerHTML = '<button class="cmp-lb-close" type="button" aria-label="關閉放大檢視">×</button>'
    + '<div class="cmp-lb-stage"></div><div class="cmp-lb-cap"></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click', (e) => {
    if (e.target === ov || e.target.closest('.cmp-lb-close')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  return ov;
}

function openLightbox(cell) {
  const ov = ensureLightbox();
  const stage = ov.querySelector('.cmp-lb-stage');
  if (cell.dataset.zoomImg) {
    stage.innerHTML = `<img src="${cell.dataset.zoomImg}" alt="">`;
  } else if (cell.dataset.zoomSvg && CARDS[cell.dataset.zoomSvg]) {
    stage.innerHTML = faceSvg(CARDS[cell.dataset.zoomSvg], false, 'cmp-lb-svg');
  }
  ov.querySelector('.cmp-lb-cap').textContent = cell.dataset.zoomLabel || '';
  ov.classList.add('is-open');
  document.body.style.overflow = 'hidden';
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

  root.addEventListener('click', (e) => {
    const cell = e.target.closest('.cmp-cell');
    if (cell) openLightbox(cell);
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
else render();
