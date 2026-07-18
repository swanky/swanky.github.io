import { CARDS, buildDeck } from './tarot-deck.js';
import { READINGS } from './tarot-data-texts.js';

const SECTIONS = [
  { key: 'major', label: '大牌 Major Arcana', short: '大牌', test: (c) => c.arcana === 'major' },
  { key: 'wands', label: '權杖 Wands', short: '權杖', test: (c) => c.suit === 'wands' },
  { key: 'cups', label: '聖杯 Cups', short: '聖杯', test: (c) => c.suit === 'cups' },
  { key: 'swords', label: '寶劍 Swords', short: '寶劍', test: (c) => c.suit === 'swords' },
  { key: 'pentacles', label: '錢幣 Pentacles', short: '錢幣', test: (c) => c.suit === 'pentacles' },
];

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function renderGallery(root) {
  const dir = root.dataset.galleryDir || '/assets/img/tarot/clonex/';
  const deckLabel = root.dataset.galleryLabel || '原創塔羅牌';
  const cards = buildDeck().map((id) => ({ ...CARDS[id], src: `${dir}${id}.jpg` }));
  let html = '<nav class="ct-gallery-nav" aria-label="牌組分類">'
    + SECTIONS.map((section) => `<a href="#deck-${section.key}">${section.short}</a>`).join('')
    + '</nav>';

  let eagerBudget = 8; // 首屏前 8 張不設 lazy，避免捲動未到前大片留白、感知像沒載入
  for (const section of SECTIONS) {
    const sectionCards = cards.filter(section.test);
    html += `<section class="ct-gallery-section" id="deck-${section.key}">`
      + `<h2 class="ct-gallery-title">${section.label} · ${sectionCards.length} 張</h2>`
      + '<div class="ct-gallery-grid">'
      + sectionCards.map((card) => {
        const label = `${card.nameZh} ${card.nameEn}`;
        const index = cards.indexOf(card);
        const lazyAttr = eagerBudget-- > 0 ? '' : ' loading="lazy"';
        return `<figure class="ct-gallery-card" data-index="${index}" tabindex="0" role="button" aria-label="放大檢視${escapeHtml(label)}">`
          + `<img src="${card.src}" alt="${escapeHtml(deckLabel)}：${escapeHtml(label)}"${lazyAttr} decoding="async" width="768">`
          + `<figcaption>${escapeHtml(card.nameZh)}<br><span>${escapeHtml(card.nameEn)}</span></figcaption></figure>`;
      }).join('')
      + '</div></section>';
  }
  root.innerHTML = html;
  return cards;
}

function createLightbox(cards) {
  const box = document.createElement('div');
  box.className = 'ct-lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', '牌面放大檢視');
  box.innerHTML = `
    <button class="ct-lightbox__close" type="button" aria-label="關閉">×</button>
    <button class="ct-lightbox__nav ct-lightbox__prev" type="button" aria-label="上一張"><span aria-hidden="true">‹</span></button>
    <div class="ct-lightbox__dialog">
      <img class="ct-lightbox__image" alt="">
      <div class="ct-lightbox__copy">
        <p class="ct-lightbox__eyebrow">牌面象徵</p>
        <h2 class="ct-lightbox__title"></h2>
        <p class="ct-lightbox__english"></p>
        <p class="ct-lightbox__description"></p>
        <p class="ct-lightbox__count"></p>
      </div>
    </div>
    <button class="ct-lightbox__nav ct-lightbox__next" type="button" aria-label="下一張"><span aria-hidden="true">›</span></button>`;
  document.body.appendChild(box);
  const closeButton = box.querySelector('.ct-lightbox__close');
  let currentIndex = 0;
  let returnFocus = null;

  const show = (index) => {
    currentIndex = (index + cards.length) % cards.length;
    const card = cards[currentIndex];
    const reading = READINGS[card.id];
    const image = box.querySelector('.ct-lightbox__image');
    image.src = card.src;
    image.alt = `${card.nameZh} ${card.nameEn}`;
    box.querySelector('.ct-lightbox__title').textContent = card.nameZh;
    box.querySelector('.ct-lightbox__english').textContent = card.nameEn;
    box.querySelector('.ct-lightbox__description').textContent = reading?.symbol || '從牌面圖像觀察此刻最值得留意的線索。';
    box.querySelector('.ct-lightbox__count').textContent = `${currentIndex + 1}／${cards.length}`;
  };
  const close = () => {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    returnFocus?.focus();
  };
  const previous = () => show(currentIndex - 1);
  const next = () => show(currentIndex + 1);
  closeButton.addEventListener('click', close);
  box.querySelector('.ct-lightbox__prev').addEventListener('click', previous);
  box.querySelector('.ct-lightbox__next').addEventListener('click', next);
  box.addEventListener('click', (event) => { if (event.target === box) close(); });
  document.addEventListener('keydown', (event) => {
    if (!box.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') { event.preventDefault(); previous(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
  });
  return {
    open(index, trigger) {
      returnFocus = trigger;
      show(index);
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    },
  };
}

function init() {
  const root = document.getElementById('tarot-deck-gallery');
  if (!root) return;
  const cards = renderGallery(root);
  const lightbox = createLightbox(cards);
  root.addEventListener('click', (event) => {
    const card = event.target.closest('.ct-gallery-card');
    if (card) lightbox.open(Number(card.dataset.index), card);
  });
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.ct-gallery-card');
    if (!card) return;
    event.preventDefault();
    lightbox.open(Number(card.dataset.index), card);
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
